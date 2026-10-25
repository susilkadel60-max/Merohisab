import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
  NEPALI_MONTHS,
  toNepaliDigits,
  getTodayBS,
} from '../utils/bikramSambat';
import {
  PieChart,
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Calendar,
  Layers,
} from 'lucide-react';

export const ReportsScreen: React.FC = () => {
  const { transactions } = useTransactions();
  const today = getTodayBS();

  const [selectedYear, setSelectedYear] = useState<number>(today.year);
  const [selectedMonth, setSelectedMonth] = useState<number>(today.month);

  const monthTx = transactions.filter(
    (t) => t?.bsDate && t.bsDate.year === selectedYear && t.bsDate.month === selectedMonth
  );

  const totalIncome = monthTx
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const totalExpense = monthTx
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const netBalance = totalIncome - totalExpense;
  const savingsRate = totalIncome > 0 ? ((netBalance / totalIncome) * 100).toFixed(1) : '0';

  // Category breakdown for Expenses
  const expenseByCategory: Record<string, number> = {};
  monthTx
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      const cat = t.category || 'अन्य खर्च';
      expenseByCategory[cat] = (expenseByCategory[cat] || 0) + (Number(t.total) || 0);
    });

  const sortedExpenseCategories = Object.entries(expenseByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  // Category breakdown for Income
  const incomeByCategory: Record<string, number> = {};
  monthTx
    .filter((t) => t.type === 'INCOME')
    .forEach((t) => {
      incomeByCategory[t.category] = (incomeByCategory[t.category] || 0) + t.total;
    });

  const sortedIncomeCategories = Object.entries(incomeByCategory).sort(
    (a, b) => b[1] - a[1]
  );

  // Colors for expense bars
  const barColors = [
    'bg-red-500',
    'bg-amber-500',
    'bg-blue-500',
    'bg-indigo-500',
    'bg-purple-500',
    'bg-rose-500',
    'bg-teal-500',
    'bg-orange-500',
  ];

  return (
    <div className="pb-24 space-y-4">
      {/* Month & Year Filter Bar */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">मासिक आर्थिक प्रतिवेदन</div>
            <h2 className="text-lg font-bold text-slate-900">
              {NEPALI_MONTHS[selectedMonth - 1]} {toNepaliDigits(selectedYear)} को रिपोर्ट
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {NEPALI_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(Number(e.target.value))}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[2080, 2081, 2082, 2083, 2084, 2085].map((y) => (
                <option key={y} value={y}>
                  {toNepaliDigits(y)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* KPI Overview Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
        <div className="bg-white/95 border border-emerald-200 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#168447]">कुल आम्दानी</span>
            <TrendingUp className="w-3.5 h-3.5 text-[#168447]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#168447] tabular-nums">
            रु {toNepaliDigits(totalIncome)}
          </div>
        </div>

        <div className="bg-white/95 border border-red-200 rounded-2xl p-3.5 shadow-xs">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-[#C62828]">कुल खर्च</span>
            <TrendingDown className="w-3.5 h-3.5 text-[#C62828]" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-[#C62828] tabular-nums">
            रु {toNepaliDigits(totalExpense)}
          </div>
        </div>

        <div className="bg-blue-50/90 border border-blue-200 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-blue-800">खुद बचत</span>
            <Wallet className="w-3.5 h-3.5 text-blue-700" />
          </div>
          <div
            className={`text-lg sm:text-xl font-bold tabular-nums ${
              netBalance >= 0 ? 'text-blue-800' : 'text-red-700'
            }`}
          >
            रु {toNepaliDigits(netBalance)}
          </div>
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-3.5">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] font-semibold text-slate-700">बचत प्रतिशत</span>
            <ArrowUpRight className="w-3.5 h-3.5 text-slate-600" />
          </div>
          <div className="text-lg sm:text-xl font-bold text-slate-800 tabular-nums">
            {toNepaliDigits(savingsRate)}%
          </div>
        </div>
      </div>

      {/* Expense by Category Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-100 text-red-700 flex items-center justify-center">
              <PieChart className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                शीर्षकगत खर्च विवरण (Expense by Category)
              </h3>
              <p className="text-xs text-slate-500">कुन शीर्षकमा कति खर्च भयो?</p>
            </div>
          </div>
          <span className="text-xs font-bold text-red-600 tabular-nums">
            कुल: रु {toNepaliDigits(totalExpense)}
          </span>
        </div>

        {sortedExpenseCategories.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            यस महिना कुनै पनि खर्च भएको छैन।
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {sortedExpenseCategories.map(([category, amount], idx) => {
              const percent = totalExpense > 0 ? ((amount / totalExpense) * 100).toFixed(1) : '0';
              const colorClass = barColors[idx % barColors.length];

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{category}</span>
                    <span className="tabular-nums font-bold text-slate-700">
                      रु {toNepaliDigits(amount)}{' '}
                      <span className="text-slate-400 font-normal">({toNepaliDigits(percent)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colorClass} rounded-full transition-all duration-300`}
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Income by Category Breakdown */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">
                शीर्षकगत आम्दानी विवरण (Income by Category)
              </h3>
              <p className="text-xs text-slate-500">कुन स्रोतबाट कति आम्दानी भयो?</p>
            </div>
          </div>
          <span className="text-xs font-bold text-emerald-700 tabular-nums">
            कुल: रु {toNepaliDigits(totalIncome)}
          </span>
        </div>

        {sortedIncomeCategories.length === 0 ? (
          <div className="py-8 text-center text-slate-400 text-sm">
            यस महिना कुनै पनि आम्दानी रेकर्ड गरिएको छैन।
          </div>
        ) : (
          <div className="space-y-3 pt-1">
            {sortedIncomeCategories.map(([category, amount]) => {
              const percent = totalIncome > 0 ? ((amount / totalIncome) * 100).toFixed(1) : '0';

              return (
                <div key={category} className="space-y-1">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-semibold text-slate-800">{category}</span>
                    <span className="tabular-nums font-bold text-emerald-800">
                      रु {toNepaliDigits(amount)}{' '}
                      <span className="text-slate-400 font-normal">({toNepaliDigits(percent)}%)</span>
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-600 rounded-full transition-all duration-300"
                      style={{ width: `${percent}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
