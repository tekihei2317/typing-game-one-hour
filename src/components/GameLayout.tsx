import React from "react";

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};