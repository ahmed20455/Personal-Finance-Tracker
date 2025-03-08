'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

interface FinanceChartProps {
  transactions: Transaction[];
}

const FinanceChart: React.FC<FinanceChartProps> = ({ transactions }) => {
  // Aggregate data by date
  const data = transactions.reduce((acc, transaction) => {
    const date = transaction.date;
    const existing = acc.find((entry) => entry.date === date);
    if (existing) {
      existing[transaction.type] = (existing[transaction.type] || 0) + transaction.amount;
    } else {
      acc.push({
        date,
        income: transaction.type === 'income' ? transaction.amount : 0,
        expense: transaction.type === 'expense' ? transaction.amount : 0,
      });
    }
    return acc;
  }, [] as { date: string; income: number; expense: number }[]);

  // Sort by date
  data.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="bg-white p-4 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4">Income vs Expenses Over Time</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="income" stroke="#10B981" name="Income" />
          <Line type="monotone" dataKey="expense" stroke="#EF4444" name="Expenses" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default FinanceChart;