import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import './TyMCoBot.css';
import { useAuth } from '../../../context/AuthContext';

/**
 * TyMCoBot Component
 * Ported from Yeriko-Bot (SCS) and adapted for TyMCO Ecommerce.
 * Style: CyberPunk Terminal / Matrix.
 */
const TyMCoBot = () => {
    const { user, token } = useAuth();
    const [isMuted, setIsMuted] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const synthesisRef = useRef(window.speechSynthesis);
    const [isOpen, setIsOpen] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const scrollRef = useRef(null);
    const inputRef = useRef(null);
    const recognitionRef = useRef(null);
    const [isListening, setIsListening] = useState(false);

    // Inicializar Reconocimiento de Voz (STT)
    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.lang = 'es-MX';
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setInputValue(transcript);
                setIsListening(false);
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Error reconocimiento de voz:', event.error);
                setIsListening(false);
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
            };
        }
    }, []);

    const toggleListening = () => {
        if (isListening) {
            recognitionRef.current?.stop();
        } else {
            if (recognitionRef.current) {
                try {
                    recognitionRef.current.start();
                    setIsListening(true);
                } catch (e) {
                    console.error('Error al iniciar reconocimiento:', e);
                }
            } else {
                alert('El reconocimiento de voz no es compatible con este navegador.');
            }
        }
    };

    // Get user display name for CLI prompt
    const getPromptName = () => {
        if (!user) return 'visitante';
        const fullName = (user.username || user.name || user.email || '').toLowerCase();
        return fullName.split(' ')[0] || 'usuario';
    };

    const promptName = getPromptName();
    const displayName = promptName.charAt(0).toUpperCase() + promptName.slice(1);

    // TyMCO Welcome logic
    const getWelcomeMessage = () => {
        if (!user) return '> SISTEMA INICIADO\n> [!] **MODO INVITADO**\n> Hola, soy **TyMCO-Bot** v1.1. Identifícate para rastrear tus pedidos de madera.';
        return `> SISTEMA INICIADO\n> Hola **${displayName}**, soy **TyMCO-Bot**.\n> Estoy sincronizado con tus pedidos. ¿En qué puedo ayudarte hoy?`;
    };

    const [messages, setMessages] = useState([
        {
            id: '1',
            text: getWelcomeMessage(),
            sender: 'bot',
            timestamp: new Date()
        }
    ]);

    const baseUrl = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3000/api';

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages, isTyping, isOpen]);

    // Simple Browser TTS con selección de voz mejorada
    const speak = useCallback((text) => {
        if (!synthesisRef.current || isMuted) return;
        synthesisRef.current.cancel();

        const cleanText = text
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/> /g, '')
            .replace(/#/g, '');

        const utterance = new SpeechSynthesisUtterance(cleanText);
        
        // Intentar encontrar una voz en español
        const voices = synthesisRef.current.getVoices();
        const preferredVoice = voices.find(v => v.lang === 'es-MX') || 
                               voices.find(v => v.lang.startsWith('es')) || 
                               voices[0];
        
        if (preferredVoice) utterance.voice = preferredVoice;
        utterance.lang = 'es-MX';
        utterance.rate = 1.0;
        utterance.pitch = 1.1;

        utterance.onstart = () => setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = (e) => {
            console.error('SpeechSynthesis Error:', e);
            setIsSpeaking(false);
        };

        synthesisRef.current.speak(utterance);
    }, [isMuted]);

    useEffect(() => {
        if (isOpen && inputRef.current) {
            inputRef.current.focus();
        }
        
        // Hablar el mensaje de bienvenida al abrir el bot
        if (isOpen && messages.length === 1 && messages[0].sender === 'bot') {
            const timer = setTimeout(() => {
                speak(messages[0].text);
            }, 600);
            return () => clearTimeout(timer);
        }
    }, [isOpen, messages, speak]);

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMsg = {
            id: Date.now().toString(),
            text: inputValue,
            sender: 'user',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMsg]);
        setInputValue('');
        setIsTyping(true);

        try {
            const chatHistory = messages
                .filter(m => m.id !== '1')
                .map(m => ({
                    role: m.sender === 'user' ? 'user' : 'assistant',
                    content: m.text
                }));

            const response = await axios.post(`${baseUrl}/tymco/chat`, {
                message: inputValue,
                history: chatHistory,
                context: {
                    project: 'TyMCO-Ecommerce',
                    timestamp: new Date().toISOString()
                }
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const botResponseText = response.data.response || response.data.text || '> [FATAL] Error de respuesta.';

            const botMsg = {
                id: (Date.now() + 1).toString(),
                text: botResponseText,
                sender: 'bot',
                timestamp: new Date()
            };

            setMessages(prev => [...prev, botMsg]);
            if (!isMuted) speak(botResponseText);
            
        } catch (error) {
            console.error('Error chat:', error);
            const errorMsg = {
                id: (Date.now() + 1).toString(),
                text: '> ERROR DE CONEXIÓN.\n> No se ha podido establecer contacto con el núcleo de TyMCO.',
                sender: 'bot',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMsg]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSendMessage();
    };

    return (
        <div className={`tymco-bot-container ${isOpen ? 'is-open' : ''}`}>
            <div className={`tymco-terminal-window ${isOpen ? 'active' : ''}`}>
                <div className="terminal-header">
                    <div className="terminal-dots">
                        <span className="t-dot red" onClick={() => setIsOpen(false)} title="Cerrar"></span>
                        <span className="t-dot yellow" onClick={() => setIsOpen(false)} title="Ocultar"></span>
                        <span className="t-dot green"></span>
                    </div>
                    <div className="terminal-title">
                        root@tymco-bot: {isSpeaking ? <span className="voice-wave">~🎙️</span> : "v1.1"}
                    </div>
                    <div className="terminal-actions">
                        <button 
                            className={`audio-btn ${isMuted ? 'muted' : ''}`}
                            onClick={() => setIsMuted(!isMuted)}
                        >
                            {isMuted ? "🔇" : "🔊"}
                        </button>
                    </div>
                </div>

                <div className="terminal-body" ref={scrollRef}>
                    <div className="scanline"></div>
                    {messages.map((msg) => (
                        <div key={msg.id} className={`terminal-row ${msg.sender}`}>
                            <span className="line-prompt">{msg.sender === 'user' ? `${promptName}@ecommerce:~$ ` : 'tymco-bot:/&gt; '}</span>
                            <span 
                                className="line-txt"
                                dangerouslySetInnerHTML={{ __html: msg.text.replace(/\n/g, '<br/>').replace(/\*\*(.*?)\*\*/g, '<span class="glow">$1</span>') }}
                            ></span>
                        </div>
                    ))}
                    {isTyping && (
                        <div className="terminal-row bot typing">
                            <span className="line-prompt">tymco-bot:/&gt; </span>
                            <span className="blink-cursor">█</span>
                        </div>
                    )}
                </div>

                <div className="terminal-footer">
                    <span className="input-prompt">{promptName}@ecommerce:~$</span>
                    <input
                        ref={inputRef}
                        type="text"
                        className="shell-input"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyDown={handleKeyDown}
                        maxLength={500}
                        placeholder={isListening ? "Escuchando..." : "Escribe o usa el micro..."}
                    />
                    <button 
                        className={`mic-btn ${isListening ? 'listening' : ''}`}
                        onClick={toggleListening}
                        title="Hablar con TyMCO-Bot"
                    >
                        {isListening ? "🎙️" : "🎤"}
                    </button>
                </div>
            </div>

            <button className="tymco-bot-trigger" onClick={() => setIsOpen(!isOpen)}>
                <div className="trigger-inner">
                    <img src="/assets/tymco-bot.png" alt="Bot" className="bot-icon" />
                    <div className="status-indicator"></div>
                </div>
            </button>
        </div>
    );
};

export default TyMCoBot;
