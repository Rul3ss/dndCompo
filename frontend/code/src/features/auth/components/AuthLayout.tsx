import React from 'react';
import bgImage from '../../../assets/hero-bg.png'; // Reusing the epic background for the left pane

interface AuthLayoutProps {
  children: React.ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="split-auth-page">
      {/* Esquerda: Imagem Epica */}
      <div 
        className="split-auth-left" 
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <div className="split-auth-overlay"></div>
      </div>
      
      {/* Direita: Formulário Escuro */}
      <div className="split-auth-right">
        {children}
      </div>
    </div>
  );
}
