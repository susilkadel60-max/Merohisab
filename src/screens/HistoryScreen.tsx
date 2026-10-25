import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import { Transaction } from '../types';
import { toNepaliDigits } from '../utils/bikramSambat';
import {
  Search,
  TrendingUp,
  TrendingDown,
  Edit2,
  Trash2,
  Filter,
  Calendar,
  X,
  SlidersHorizontal,
} from 'lucide-react';

interface Props {
  onEditTransaction: (tx: Transaction) => void;
  onDeleteRequest: (tx: Transaction) => void;
  onNavigateAdd: () => void;
}

export const HistoryScreen: React.FC<Props> = ({
  onEditTransaction,
  onDeleteRequest,
  onNavigateAdd,
}) => {
  const { transactions } = useTransactions();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  // Collect unique categories safely
  const allCategories = Array.from(
    new Set(transactions.map((t) => t?.category).filter((c): c is string => Boolean(c)))
  );

  const filtered = transactions.filter((t) => {
    if (!t) return false;

    // Type filter
    if (typeFilter !== 'ALL' && t.type !== typeFilter) return false;

    // Category filter
    if (selectedCategory !== 'ALL' && t.category !== selectedCategory) return false;

    // Search query
    if (search.trim()) {
      const q = search.toLowerCase();
      const cat = (t.category || '').toLowerCase();
      const desc = (t.description || '').toLowerCase();
      const dateStr = (t.bsDateString || '').toLowerCase();
      const method = (t.paymentMethod || '').toLowerCase();
      const notesStr = (t.notes || '').toLowerCase();

      const match =
        cat.includes(q) ||
        desc.includes(q) ||
        dateStr.includes(q) ||
        method.includes(q) ||
        notesStr.includes(q);

      if (!match) return false;
    }

    return true;
  });

  const totalFilteredIncome = filtered
    .filter((t) => t.type === 'INCOME')
    .reduce((s, t) => s + (Number(t.total) || 0), 0);

  const totalFilteredExpense = filtered
    .filter((t) => t.type === 'EXPENSE')
    .reduce((s, t) => s + (Number(t.total) || 0), 0);

  return (
    <div className="pb-24 space-y-4">
      {/* Search & Filter Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-slate-900">
            कारोबार इतिहास (Transaction History)
          </h2>
          <span className="text-xs text-slate-500 font-medium">
            कुल: {toNepaliDigits(filtered.length)} वटा रेकर्ड
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="खोज्नुहोस् (वर्ग, विवरण, मिति २०८१, भुक्तानी माध्यम)..."
            className="w-full text-sm pl-9 pr-9 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-3 top-3 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Type Filter Buttons */}
        <div className="flex items-center gap-1.5 p-1 bg-slate-100 rounded-xl">
          <button
            onClick={() => setTypeFilter('ALL')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'ALL'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            सबै ({toNepaliDigits(transactions.length)})
          </button>
          <button
            onClick={() => setTypeFilter('EXPENSE')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'EXPENSE'
                ? 'bg-red-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-red-700'
            }`}
          >
            खर्च
          </button>
          <button
            onClick={() => setTypeFilter('INCOME')}
            className={`flex-1 py-1.5 rounded-lg text-xs font-bold transition-all ${
              typeFilter === 'INCOME'
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-emerald-800'
            }`}
          >
            आम्दानी
          </button>
        </div>

        {/* Category Pill Filter (if categories exist) */}
        {allCategories.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pt-1">
            <button
              onClick={() => setSelectedCategory('ALL')}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                selectedCategory === 'ALL'
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              सबै वर्ग
            </button>
            {allCategories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium shrink-0 transition-colors ${
                  selectedCategory === cat
                    ? 'bg-emerald-700 text-white font-bold'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Filtered Metrics Strip */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-emerald-50/70 border border-emerald-200/70 rounded-xl p-3 flex justify-between items-center">
          <span className="text-xs font-medium text-emerald-800">कुल देखाइएको आम्दानी:</span>
          <span className="text-sm font-bold text-emerald-800 tabular-nums">
            + रु {toNepaliDigits(totalFilteredIncome)}
          </span>
        </div>
        <div className="bg-red-50/70 border border-red-200/70 rounded-xl p-3 flex justify-between items-center">
          <span className="text-xs font-medium text-red-800">कुल देखाइएको खर्च:</span>
          <span className="text-sm font-bold text-red-700 tabular-nums">
            - रु {toNepaliDigits(totalFilteredExpense)}
          </span>
        </div>
      </div>

      {/* Transaction List */}
      <div className="space-y-2.5">
        {filtered.length === 0 ? (
          <div className="bg-white border border-slate-200 rounded-2xl p-10 text-center text-slate-400">
            <Filter className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">कुनै कारोबार फेला परेन।</p>
            <p className="text-xs text-slate-400 mt-0.5">
              खोज शब्द परिवर्तन गर्नुहोस् वा नयाँ कारोबार थप्नुहोस्।
            </p>
            <button
              onClick={onNavigateAdd}
              className="mt-4 px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition-colors shadow-xs"
            >
              ＋ नयाँ इन्ट्री थप्नुहोस्
            </button>
          </div>
        ) : (
          filtered.map((tx) => (
            <div
              key={tx.id}
              className="bg-white border border-slate-200/80 rounded-2xl p-3.5 shadow-xs hover:border-slate-300 transition-all group"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                      tx.type === 'INCOME'
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-red-100 text-red-600'
                    }`}
                  >
                    {tx.type === 'INCOME' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-900 truncate">
                        {tx.category}
                      </span>
                      <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                        {tx.paymentMethod.split(' ')[0]}
                      </span>
                    </div>

                    {tx.description && (
                      <div className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                        {tx.description}
                      </div>
                    )}

                    <div className="text-[11px] text-slate-400 mt-1 flex items-center gap-1.5">
                      <Calendar className="w-3 h-3" />
                      <span>{tx.bsDateString}</span>
                      {tx.rate && tx.quantity ? (
                        <>
                          <span>•</span>
                          <span>
                            रु {toNepaliDigits(tx.rate)} × {toNepaliDigits(tx.quantity)}
                          </span>
                        </>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <div
                    className={`text-base font-bold tabular-nums ${
                      tx.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'
                    }`}
                  >
                    {tx.type === 'INCOME' ? '+' : '-'} रु {toNepaliDigits(tx.total)}
                  </div>

                  <div className="flex items-center justify-end gap-1.5 mt-2">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
                      title="सम्पादन गर्नुहोस्"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(tx)}
                      className="p-1.5 rounded-lg hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors"
                      title="मेटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
