'use client';

import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Transaction } from '../types';

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const CategoryBreakdown: React.FC<CategoryBreakdownProps> = ({ transactions }) => {
  const expenseData = transactions
    .filter((t) => t.type === 'expense')
    .reduce((acc: { name: string; value: number }[], transaction: Transaction) => {
      const existing = acc.find((entry) => entry.name === transaction.category);
      if (existing) {
        existing.value += transaction.amount;
        return acc;
      }
      acc.push({ name: transaction.category, value: transaction.amount });
      return acc;
    }, []);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md mb-6">
      <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Expenses by Category</h2>
      {expenseData.length ? (
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={expenseData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              fill="#8884d8"
              label
            >
              {expenseData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500 dark:text-gray-400 text-center">No expenses to display.</p>
      )}
    </div>
  );
};

export default CategoryBreakdown;