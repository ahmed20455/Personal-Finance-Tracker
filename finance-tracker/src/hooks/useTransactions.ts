import { useQuery } from '@tanstack/react-query';
import { Transaction } from '../types';

const fetchTransactions = async (): Promise<Transaction[]> => {
  const response = await fetch('https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions');
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const useTransactions = () => {
  return useQuery<Transaction[], Error>({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
  });
};