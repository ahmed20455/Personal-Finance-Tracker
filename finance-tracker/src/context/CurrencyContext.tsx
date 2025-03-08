'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Currency = 'INR' | 'USD' | 'EUR';
type CurrencySymbol = '₹' | '$' | '€';

interface CurrencyContextType {
  currency: Currency;
  symbol: CurrencySymbol;
  setCurrency: (currency: Currency) => void;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

export const CurrencyProvider = ({ children }: { children: ReactNode }) => {
  const [currency, setCurrency] = useState<Currency>(() => {
    if (typeof window !== 'undefined') {
      return (localStorage.getItem('currency') as Currency) || 'INR';
    }
    return 'INR';
  });

  const [symbol, setSymbol] = useState<CurrencySymbol>('₹');

  useEffect(() => {
    const symbols: Record<Currency, CurrencySymbol> = {
      INR: '₹',
      USD: '$',
      EUR: '€',
    };
    setSymbol(symbols[currency]);
    localStorage.setItem('currency', currency);
  }, [currency]);

  return (
    <CurrencyContext.Provider value={{ currency, symbol, setCurrency }}>
      {children}
    </CurrencyContext.Provider>
  );
};

export const useCurrency = () => {
  const context = useContext(CurrencyContext);
  if (!context) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
};