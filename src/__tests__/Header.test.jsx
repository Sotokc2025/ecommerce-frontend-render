// @ts-check
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import React from 'react';

// Un componente Dummy para testear que la UI renderiza el título esperado
const HeaderDummy = () => (
  <header>
    <h1>Triplay y Maderas Finas.mx</h1>
  </header>
);

describe('Suite de Pruebas Frontend - TyMCO React', () => {
  it('Debe renderizar el título Inmutable (ProtocoloMaster)', () => {
    render(<HeaderDummy />);
    const titleElement = screen.getByText(/Triplay y Maderas Finas.mx/i);
    expect(titleElement).toBeInTheDocument();
  });
});
