"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface AgeVerificationContextType {
  isVerified: boolean;
  verifyAge: () => void;
  exitApp: () => void; // Optional: For handling exit logic
  isLoading: boolean;
}

const AgeVerificationContext = createContext<AgeVerificationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'crimsonCanvasAgeVerified';

export const AgeVerificationProvider = ({ children }: { children: ReactNode }) => {
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const storedValue = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (storedValue === 'true') {
        setIsVerified(true);
      }
    } catch (error) {
      console.error("Could not access localStorage:", error);
      // Fallback or specific handling if localStorage is unavailable
    }
    setIsLoading(false);
  }, []);

  const verifyAge = useCallback(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, 'true');
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
    setIsVerified(true);
  }, []);

  const exitApp = useCallback(() => {
    // This is a placeholder. In a real app, you might redirect to a safe page
    // or simply close the gate, making the app inaccessible if 'isVerified' remains false.
    // For this example, we'll just ensure isVerified is false if they choose to "exit" the verification.
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (error) {
      console.error("Could not write to localStorage:", error);
    }
    setIsVerified(false); 
    // Optionally, redirect or display a message
    // window.location.href = 'https://www.google.com'; // Example redirect
  }, []);

  return (
    <AgeVerificationContext.Provider value={{ isVerified, verifyAge, exitApp, isLoading }}>
      {children}
    </AgeVerificationContext.Provider>
  );
};

export const useAgeVerification = () => {
  const context = useContext(AgeVerificationContext);
  if (context === undefined) {
    throw new Error('useAgeVerification must be used within an AgeVerificationProvider');
  }
  return context;
};
