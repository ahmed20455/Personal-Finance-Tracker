'use client';

import TransactionCard from '../components/TransactionCard';
import { useTransactions } from '../hooks/useTransactions';
import { Transaction } from '../types';

export default function Home() {
  const { data: transactions, error, isLoading } = useTransactions();

  if (isLoading) return <div className="p-6 bg-gray-200">Loading...</div>;
  if (error) return <div className="p-6 bg-red-100 text-red-500">Error: {error.message}</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-blue-600">Personal Finance Tracker</h1>
      {transactions?.map((transaction: Transaction) => (
        <TransactionCard key={transaction.id} transaction={transaction} />
      ))}
    </div>
  );
}