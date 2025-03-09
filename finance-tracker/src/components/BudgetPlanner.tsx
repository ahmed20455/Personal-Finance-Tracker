'use client';

import { useState, useEffect } from 'react';
import { useTransactions } from '../hooks/useTransactions';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function BudgetPlanner() {
  const { data: transactions, isLoading, error } = useTransactions();
  const [view, setView] = useState<'overall' | 'category'>('overall');
  const [incomeGoal, setIncomeGoal] = useState(() => parseFloat(localStorage.getItem('incomeGoal') || '0'));
  const [expenseGoal, setExpenseGoal] = useState(() => parseFloat(localStorage.getItem('expenseGoal') || '0'));
  const [categoryGoals, setCategoryGoals] = useState<Record<string, number>>(() => {
    const saved = localStorage.getItem('categoryGoals');
    return saved ? JSON.parse(saved) : {};
  });

  const totalIncome = transactions?.reduce((sum, t) => (t.type === 'income' ? sum + t.amount : sum), 0) || 0;
  const totalExpenses = transactions?.reduce((sum, t) => (t.type === 'expense' ? sum + t.amount : sum), 0) || 0;

  const categoryTotals = transactions?.reduce((acc, t) => {
    if (t.type === 'expense') {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
    }
    return acc;
  }, {} as Record<string, number>) || {};

  const incomePercentage = incomeGoal > 0 ? Math.min((totalIncome / incomeGoal) * 100, 100) : 0;
  const expensePercentage = expenseGoal > 0 ? Math.min((totalExpenses / expenseGoal) * 100, 100) : 0;

  const saveGoals = () => {
    if (incomeGoal < 0 || expenseGoal < 0 || Object.values(categoryGoals).some(g => g < 0)) {
      toast.error('Goals cannot be negative!');
      return;
    }
    localStorage.setItem('incomeGoal', incomeGoal.toString());
    localStorage.setItem('expenseGoal', expenseGoal.toString());
    localStorage.setItem('categoryGoals', JSON.stringify(categoryGoals));
    toast.success('Goals saved successfully!');
  };

  const resetGoals = () => {
    setIncomeGoal(0);
    setExpenseGoal(0);
    setCategoryGoals({});
    localStorage.removeItem('incomeGoal');
    localStorage.removeItem('expenseGoal');
    localStorage.removeItem('categoryGoals');
    toast.info('Goals reset successfully!');
  };

  useEffect(() => {
    if (incomePercentage > 100) toast.warn('Income goal exceeded!');
    if (expensePercentage > 100) toast.warn('Expense goal exceeded!');
    Object.entries(categoryGoals).forEach(([category, goal]) => {
      const spent = categoryTotals[category] || 0;
      if (goal > 0 && spent / goal > 1) {
        toast.warn(`${category} budget exceeded!`);
      }
    });
  }, [incomePercentage, expensePercentage, categoryGoals, categoryTotals]);

  if (isLoading) return <div className="text-gray-500 dark:text-gray-400">Loading budget planner...</div>;
  if (error) return <div className="text-red-500 dark:text-red-400">Error: {error.message}</div>;

  return (
    <div className="bg-gradient-to-br from-blue-50 to-teal-50 dark:from-blue-900 dark:to-teal-900 p-6 rounded-lg shadow-lg mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">Budget Planner</h2>
        <div className="flex space-x-2">
          <button
            onClick={() => setView(view === 'overall' ? 'category' : 'overall')}
            className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
          >
            {view === 'overall' ? 'Category View' : 'Overall View'}
          </button>
          <button
            onClick={resetGoals}
            className="px-3 py-1 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
          >
            Reset Goals
          </button>
        </div>
      </div>
      {view === 'overall' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="text-center">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Income Goal (₹)</label>
            <input
              type="number"
              value={incomeGoal}
              onChange={(e) => setIncomeGoal(parseFloat(e.target.value) || 0)}
              className="w-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 mb-4"
              min="0"
            />
            <div className="w-40 mx-auto">
              <CircularProgressbar
                value={incomePercentage}
                text={`${incomePercentage.toFixed(1)}%`}
                styles={buildStyles({
                  pathColor: `rgba(16, 185, 129, ${incomePercentage / 100})`,
                  textColor: '#10B981',
                  trailColor: '#E5E7EB',
                })}
              />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Current: ₹{totalIncome.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-center">
            <label className="block text-gray-700 dark:text-gray-300 mb-2 font-medium">Expense Goal (₹)</label>
            <input
              type="number"
              value={expenseGoal}
              onChange={(e) => setExpenseGoal(parseFloat(e.target.value) || 0)}
              className="w-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500 mb-4"
              min="0"
            />
            <div className="w-40 mx-auto">
              <CircularProgressbar
                value={expensePercentage}
                text={`${expensePercentage.toFixed(1)}%`}
                styles={buildStyles({
                  pathColor: `rgba(239, 68, 68, ${expensePercentage / 100})`,
                  textColor: '#EF4444',
                  trailColor: '#E5E7EB',
                })}
              />
              <p className="mt-2 text-gray-600 dark:text-gray-400">Current: ₹{totalExpenses.toFixed(2)}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {Object.keys(categoryTotals).map((category) => (
            <div key={category} className="flex items-center justify-between p-4 bg-white dark:bg-gray-800 rounded-md shadow-sm">
              <div className="flex-1">
                <label className="block text-gray-700 dark:text-gray-300 font-medium">{category} Goal (₹)</label>
                <input
                  type="number"
                  value={categoryGoals[category] || 0}
                  onChange={(e) => setCategoryGoals({ ...categoryGoals, [category]: parseFloat(e.target.value) || 0 })}
                  className="w-32 p-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 focus:ring-2 focus:ring-blue-500"
                  min="0"
                />
              </div>
              <div className="w-24">
                <CircularProgressbar
                  value={categoryGoals[category] ? Math.min((categoryTotals[category] / categoryGoals[category]) * 100, 100) : 0}
                  text={`${categoryGoals[category] ? ((categoryTotals[category] / categoryGoals[category]) * 100).toFixed(1) : '0'}%`}
                  styles={buildStyles({
                    pathColor: `rgba(59, 130, 246, ${((categoryTotals[category] || 0) / (categoryGoals[category] || 1))})`,
                    textColor: '#3B82F6',
                    trailColor: '#E5E7EB',
                  })}
                />
              </div>
              <p className="text-gray-600 dark:text-gray-400">Spent: ₹{categoryTotals[category].toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
      <div className="flex justify-end space-x-2 mt-4">
        <button
          onClick={saveGoals}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300"
        >
          Save Goals
        </button>
      </div>
    </div>
  );
}