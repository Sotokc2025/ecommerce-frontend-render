// @ts-check
import React, { useEffect, useState } from "react";
import "./HealthPulse.css";

/**
 * Componente que muestra el estado de salud del Backend Legacy.
 * Actúa como un HUD de disponibilidad en tiempo real. 🛡️🧟‍♂️⚡
 */
const HealthPulse = () => {
    const [status, setStatus] = useState("checking"); // checking | online | offline

    useEffect(() => {
        const checkHealth = async () => {
            try {
                // El backend legacy tiene un endpoint /alive que devuelve 200
                const response = await fetch("/alive", { method: "HEAD" });
                if (response.ok) {
                    setStatus("online");
                } else {
                    setStatus("offline");
                }
            } catch (error) {
                setStatus("offline");
            }
        };

        checkHealth();
        // Check cada 30 segundos
        const interval = setInterval(checkHealth, 30000);
        return () => clearInterval(interval);
    }, []);

    const getStatusText = () => {
        switch (status) {
            case "online": return "SISTEMA: IT'S ALIVE ⚡";
            case "offline": return "SISTEMA: OFFLINE 💀";
            default: return "SISTEMA: CHECKING... 🧬";
        }
    };

    return (
        <div className={`health-pulse health-pulse--${status}`} title={getStatusText()}>
            <div className="health-pulse__dot" />
            <span className="health-pulse__label desktop-only">{getStatusText()}</span>
        </div>
    );
};

export default HealthPulse;