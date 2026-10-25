import React, { useState } from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
  NEPALI_MONTHS,
  NEPALI_DAYS,
  NEPALI_DAYS_SHORT,
  toNepaliDigits,
  getDaysInBSMonth,
  getBSMonthStartDayOfWeek,
  getTodayBS,
  formatBSDate,
  formatBSDateLong,
} from '../utils/bikramSambat';
import { BSDate, Transaction } from '../types';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  TrendingUp,
  TrendingDown,
  Trash2,
  Edit2,
} from 'lucide-react';

interface Props {
  onNavigate: (tabId: string, params?: any) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteRequest: (tx: Transaction) => void;
}

export const CalendarScreen: React.FC<Props> = ({
  onNavigate,
  onEditTransaction,
  onDeleteRequest,
}) => {
  const { transactions, selectedDate, setSelectedDate } = useTransactions();
  const today = getTodayBS();

  const [activeYear, setActiveYear] = useState<number>(selectedDate.year);
  const [activeMonth, setActiveMonth] = useState<number>(selectedDate.month);

  const nextMonth = () => {
    if (activeMonth === 12) {
      if (activeYear < 2085) {
        setActiveYear(activeYear + 1);
        setActiveMonth(1);
      }
    } else {
      setActiveMonth(activeMonth + 1);
    }
  };

  const prevMonth = () => {
    if (activeMonth === 1) {
      if (activeYear > 2080) {
        setActiveYear(activeYear - 1);
        setActiveMonth(12);
      }
    } else {
      setActiveMonth(activeMonth - 1);
    }
  };

  const totalDays = getDaysInBSMonth(activeYear, activeMonth);
  const startDayOffset = getBSMonthStartDayOfWeek(activeYear, activeMonth);

  // Indicators lookup for the month
  const monthTransactions = transactions.filter(
    (t) => t?.bsDate && t.bsDate.year === activeYear && t.bsDate.month === activeMonth
  );

  const getDayStats = (day: number) => {
    const dayTx = monthTransactions.filter((t) => t?.bsDate && t.bsDate.day === day);
    const hasIncome = dayTx.some((t) => t.type === 'INCOME');
    const hasExpense = dayTx.some((t) => t.type === 'EXPENSE');
    const dayIncome = dayTx
      .filter((t) => t.type === 'INCOME')
      .reduce((acc, c) => acc + (Number(c.total) || 0), 0);
    const dayExpense = dayTx
      .filter((t) => t.type === 'EXPENSE')
      .reduce((acc, c) => acc + (Number(c.total) || 0), 0);

    return { hasIncome, hasExpense, count: dayTx.length, dayIncome, dayExpense };
  };

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < startDayOffset; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  const onDatePress = (d: number) => {
    const newDate: BSDate = { year: activeYear, month: activeMonth, day: d };
    setSelectedDate(newDate);
  };

  const isToday = (d: number) =>
    today.year === activeYear && today.month === activeMonth && today.day === d;

  const isSelected = (d: number) =>
    selectedDate.year === activeYear &&
    selectedDate.month === activeMonth &&
    selectedDate.day === d;

  const selectedDayTx = transactions.filter(
    (t) =>
      t?.bsDate &&
      t.bsDate.year === selectedDate.year &&
      t.bsDate.month === selectedDate.month &&
      t.bsDate.day === selectedDate.day
  );

  const selectedDayIncome = selectedDayTx
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const selectedDayExpense = selectedDayTx
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  return (
    <div className="pb-24 space-y-4">
      {/* Month Navigation Header */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-slate-500 font-medium">बिक्रम संवत् क्यालेन्डर</div>
            <h2 className="text-xl font-bold text-slate-900">
              {NEPALI_MONTHS[activeMonth - 1]} {toNepaliDigits(activeYear)}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setActiveYear(today.year);
                setActiveMonth(today.month);
                setSelectedDate(today);
              }}
              className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-emerald-50 text-emerald-800 hover:bg-emerald-100 transition-colors"
            >
              आज
            </button>
            <div className="flex items-center bg-slate-100 rounded-xl p-1">
              <button
                onClick={prevMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition-all shadow-xs"
                title="अघिल्लो महिना"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={nextMonth}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-700 hover:bg-white active:scale-95 transition-all shadow-xs"
                title="पछिल्लो महिना"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-slate-500 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#168447]" />
            <span>आम्दानी (Income)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#C62828]" />
            <span>खर्च (Expense)</span>
          </div>
          <div className="flex items-center gap-1.5 ml-auto">
            <span className="w-2.5 h-2.5 rounded-full border-2 border-[#168447]" />
            <span>आजको दिन</span>
          </div>
        </div>

        {/* Week Days Header */}
        <div className="grid grid-cols-7 text-center py-2.5 text-xs font-bold border-b border-slate-100">
          {NEPALI_DAYS_SHORT.map((day, idx) => (
            <span key={day} className={idx === 6 ? 'text-[#C62828]' : 'text-slate-600'}>
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 pt-2">
          {daysGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-12" />;
            }

            const { hasIncome, hasExpense } = getDayStats(day);
            const active = isSelected(day);
            const currentDay = isToday(day);
            const isSaturday = idx % 7 === 6;

            return (
              <button
                key={`day-${day}`}
                onClick={() => onDatePress(day)}
                className={`h-12 rounded-xl flex flex-col items-center justify-center relative transition-all ${
                  active
                    ? 'bg-[#168447] text-white font-bold shadow-sm ring-2 ring-[#168447]/20'
                    : currentDay
                    ? 'bg-emerald-50 text-[#168447] font-bold border-2 border-[#168447]'
                    : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span
                  className={`text-sm ${
                    active ? 'text-white' : isSaturday ? 'text-[#C62828] font-semibold' : ''
                  }`}
                >
                  {toNepaliDigits(day)}
                </span>

                {/* Dot Indicators */}
                <div className="flex items-center gap-1 mt-0.5 h-1.5">
                  {hasIncome && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        active ? 'bg-white' : 'bg-[#168447]'
                      }`}
                    />
                  )}
                  {hasExpense && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        active ? 'bg-red-200' : 'bg-[#C62828]'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Day's Transactions Section */}
      <div className="bg-white/95 border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-100">
          <div>
            <div className="text-xs text-slate-500 font-medium">छानिएको मितिको कारोबार</div>
            <h3 className="text-base font-bold text-slate-900">
              {formatBSDateLong(selectedDate)}
            </h3>
            <div className="flex gap-3 text-xs mt-1">
              <span className="text-[#168447] font-semibold">
                आम्दानी: रु {toNepaliDigits(selectedDayIncome)}
              </span>
              <span className="text-[#C62828] font-semibold">
                खर्च: रु {toNepaliDigits(selectedDayExpense)}
              </span>
            </div>
          </div>

          <button
            onClick={() => onNavigate('इन्ट्री थप्नुहोस्', { prefillDate: selectedDate })}
            className="self-start sm:self-auto px-3.5 py-2 bg-[#168447] hover:bg-[#116e3a] active:scale-95 text-white text-xs font-bold rounded-xl flex items-center gap-1.5 transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> ＋ नयाँ इन्ट्री (यो मितिमा)
          </button>
        </div>

        {selectedDayTx.length === 0 ? (
          <div className="py-8 text-center text-slate-400">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">
              यस मितिमा कुनै पनि कारोबार रेकर्ड भएको छैन।
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              माथिको “＋ नयाँ इन्ट्री (यो मितिमा)” थिचेर नयाँ कारोबार थप्न सक्नुहुन्छ।
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-100 mt-2">
            {selectedDayTx.map((tx) => (
              <div
                key={tx.id}
                className="py-3 flex items-center justify-between hover:bg-slate-50/80 px-2 rounded-xl transition-colors"
              >
                <div className="flex items-start gap-3 min-w-0 pr-2">
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
                    <div className="text-sm font-bold text-slate-900 truncate">{tx.category}</div>
                    {tx.description && (
                      <div className="text-xs text-slate-600 truncate mt-0.5">
                        {tx.description}
                      </div>
                    )}
                    <div className="text-[11px] text-slate-400 mt-1">
                      {tx.paymentMethod}
                      {tx.notes ? ` • ${tx.notes}` : ''}
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
                  <div className="flex items-center justify-end gap-2 mt-1">
                    <button
                      onClick={() => onEditTransaction(tx)}
                      className="text-xs text-slate-500 hover:text-slate-800 p-1"
                      title="सम्पादन"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onDeleteRequest(tx)}
                      className="text-xs text-red-500 hover:text-red-700 p-1"
                      title="मेटाउनुहोस्"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
