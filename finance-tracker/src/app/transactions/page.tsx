'use client';

import { useTheme } from '../../context/ThemeContext';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useTransactions } from '../../hooks/useTransactions';
import TransactionCard from '../../components/TransactionCard';
import TransactionForm from '../../components/TransactionForm';

export default function Transactions() {
  const { theme } = useTheme();
  const { data: transactions, isLoading, error } = useTransactions();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar transactions={transactions || []} searchQuery="" setSearchQuery={() => {}} />
      <div className="p-6 max-w-7xl mx-auto flex-grow w-full">
        <h1 className={`text-3xl font-bold mb-6 ${theme === 'dark' ? 'text-gray-100' : 'text-gray-900'}`}>Transactions</h1>
        <TransactionForm />
       
        <div className="mt-6">
          {transactions?.length ? transactions.map((transaction) => (
            <TransactionCard key={transaction.id} transaction={transaction} />
          )) : <p className="text-gray-500 dark:text-gray-400 text-center">No transactions found.</p>}
        </div>
      </div>
      <Footer />
    </div>
  );
}