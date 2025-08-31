"use client";

import React, { createContext, useContext, ReactNode } from 'react';

interface NavigationContextType {
  navigate: (href: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const useNavigation = () => {
  const context = useContext(NavigationContext);
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
};

interface NavigationProviderProps {
  children: ReactNode;
  navigate: (href: string) => void;
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({ children, navigate }) => {
  return (
    <NavigationContext.Provider value={{ navigate }}>
      {children}
    </NavigationContext.Provider>
  );
};
