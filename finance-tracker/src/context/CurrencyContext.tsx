'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CurrencyContextType {
  currency: string;
  symbol: string;
  setCurrency: (currency: string) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrency] = useState<string>('INR'); // Default to 'INR' on SSR
  const [isMounted, setIsMounted] = useState(false); // Track if component is mounted

  useEffect(() => {
    // This runs only on the client after mounting
    setIsMounted(true);
    const storedCurrency = localStorage.getItem('currency') || 'INR';
    setCurrency(storedCurrency);
  }, []);

  const symbolMap: Record<string, string> = {
    INR: '₹',
    USD: '$',
    EUR: '€',
  };

  const symbol = symbolMap[currency] || '₹';

  useEffect(() => {
    if (isMounted) {
      // Save to localStorage only on the client
      localStorage.setItem('currency', currency);
    }
  }, [currency, isMounted]);

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};