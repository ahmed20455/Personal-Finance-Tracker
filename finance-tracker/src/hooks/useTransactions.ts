import { useQuery } from '@tanstack/react-query';

const fetchTransactions = async () => {
  const response = await fetch('https://symmetrical-space-barnacle-jp9px4x7qpw3jqq5-3001.app.github.dev/transactions');
  if (!response.ok) throw new Error('Failed to fetch transactions');
  return response.json();
};

export const useTransactions = () => {
  return useQuery({
    queryKey: ['transactions'],
    queryFn: fetchTransactions,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};