import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
  formatBSDate,
  formatBSDateLong,
  toNepaliDigits,
  NEPALI_MONTHS,
  getTodayBS,
  NEPALI_DAYS_SHORT,
  getDaysInBSMonth,
  getDayOfWeekForBS,
} from '../utils/bikramSambat';
import { Transaction } from '../types';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  Plus,
  Calendar as CalendarIcon,
  ChevronRight,
  ArrowRight,
  Clock,
  Sparkles,
  Search,
} from 'lucide-react';
import { useDeveloperInfo } from '../utils/developerSettings';

interface Props {
  onNavigate: (tabId: string, params?: any) => void;
  onEditTransaction: (tx: Transaction) => void;
  onDeleteRequest: (tx: Transaction) => void;
}

export const DashboardScreen: React.FC<Props> = ({
  onNavigate,
  onEditTransaction,
  onDeleteRequest,
}) => {
  const { transactions, selectedDate, setSelectedDate } = useTransactions();
  const devInfo = useDeveloperInfo();
  const today = getTodayBS();

  // Current BS month transactions safely filtered
  const currentMonthTransactions = transactions.filter(
    (t) => t?.bsDate && t.bsDate.year === today.year && t.bsDate.month === today.month
  );

  const monthIncome = currentMonthTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const monthExpense = currentMonthTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const monthSavings = monthIncome - monthExpense;

  // Selected date transactions safely filtered
  const selectedDayTransactions = transactions.filter(
    (t) =>
      t?.bsDate &&
      t.bsDate.year === selectedDate.year &&
      t.bsDate.month === selectedDate.month &&
      t.bsDate.day === selectedDate.day
  );

  const selectedDayIncome = selectedDayTransactions
    .filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  const selectedDayExpense = selectedDayTransactions
    .filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + (Number(t.total) || 0), 0);

  // Quick horizontal 7-day strip around selectedDate or today
  const totalDaysInCurrentMonth = getDaysInBSMonth(today.year, today.month);
  const startOffset = Math.max(1, selectedDate.day - 3);
  const dayStrip: number[] = [];
  for (let d = startOffset; d <= Math.min(totalDaysInCurrentMonth, startOffset + 6); d++) {
    dayStrip.push(d);
  }

  const isTodaySelected =
    selectedDate.year === today.year &&
    selectedDate.month === today.month &&
    selectedDate.day === today.day;

  return (
    <div className="relative pb-24 space-y-4">
      {/* Top Banner: Today's BS Date & Nepali Greeting - Green #168447 */}
      <div className="bg-gradient-to-br from-[#168447] to-[#0f5e32] text-white p-4.5 rounded-2xl shadow-sm">
        <div className="flex items-center justify-between text-xs text-emerald-100 mb-1">
          <span className="flex items-center gap-1 font-medium">
            <CalendarIcon className="w-3.5 h-3.5" /> आजको नेपाली मिति (वि.सं.)
          </span>
          <span className="bg-[#0c4e29]/70 px-2 py-0.5 rounded-full text-[11px] text-emerald-100">
            {NEPALI_MONTHS[today.month - 1]} महिना
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
          {formatBSDateLong(today)}
        </h1>
        <div className="mt-2 pt-2 border-t border-emerald-500/40 flex items-center justify-between text-xs text-emerald-100">
          <span>मिति: {formatBSDate(today)}</span>
          <button
            onClick={() => onNavigate('क्यालेन्डर')}
            className="flex items-center gap-1 text-emerald-100 hover:text-white underline underline-offset-2 transition-colors"
          >
            पूर्ण क्यालेन्डर हेर्नुहोस् <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Monthly Summary Cards (Income: Green #168447, Expense: Red #C62828, Savings: Blue) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Income Card */}
        <div className="bg-white/95 border border-emerald-200/90 rounded-2xl p-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#168447]">यस महिनाको आम्दानी</span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 flex items-center justify-center text-[#168447]">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#168447] tabular-nums">
            रु {toNepaliDigits(monthIncome)}
          </div>
          <div className="text-[11px] text-[#168447]/80 mt-1">
            {toNepaliDigits(currentMonthTransactions.filter((t) => t.type === 'INCOME').length)} वटा आम्दानी इन्ट्री
          </div>
        </div>

        {/* Expense Card */}
        <div className="bg-white/95 border border-red-200/90 rounded-2xl p-3.5 shadow-xs transition-all hover:shadow-sm">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold text-[#C62828]">यस महिनाको खर्च</span>
            <div className="w-7 h-7 rounded-xl bg-red-50 flex items-center justify-center text-[#C62828]">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-bold text-[#C62828] tabular-nums">
            रु {toNepaliDigits(monthExpense)}
          </div>
          <div className="text-[11px] text-[#C62828]/80 mt-1">
            {toNepaliDigits(currentMonthTransactions.filter((t) => t.type === 'EXPENSE').length)} वटा खर्च इन्ट्री
          </div>
        </div>

        {/* Net Savings Card */}
        <div
          className={`border rounded-2xl p-3.5 shadow-xs transition-all hover:shadow-sm ${
            monthSavings >= 0
              ? 'bg-blue-50/80 border-blue-200/80 text-blue-900'
              : 'bg-orange-50/80 border-orange-200/80 text-orange-900'
          }`}
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-semibold">
              {monthSavings >= 0 ? 'यस महिनाको बचत (बाँकी)' : 'यस महिनाको घाटा'}
            </span>
            <div
              className={`w-7 h-7 rounded-xl flex items-center justify-center ${
                monthSavings >= 0 ? 'bg-blue-100 text-blue-700' : 'bg-orange-100 text-orange-700'
              }`}
            >
              <Wallet className="w-4 h-4" />
            </div>
          </div>
          <div
            className={`text-xl sm:text-2xl font-bold tabular-nums ${
              monthSavings >= 0 ? 'text-blue-800' : 'text-red-700'
            }`}
          >
            रु {toNepaliDigits(monthSavings)}
          </div>
          <div className="text-[11px] opacity-80 mt-1">
            कुल बचत अनुपात: {monthIncome > 0 ? toNepaliDigits(((monthSavings / monthIncome) * 100).toFixed(1)) : '०'}%
          </div>
        </div>
      </div>

      {/* Horizontal Mini Date Picker Strip */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-3 shadow-xs">
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
            <span>छानिएको मिति: {formatBSDate(selectedDate)}</span>
          </div>
          {!isTodaySelected && (
            <button
              onClick={() => setSelectedDate(today)}
              className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors"
            >
              आज जानुहोस्
            </button>
          )}
        </div>

        <div className="grid grid-cols-7 gap-1.5">
          {dayStrip.map((dayNum) => {
            const dateObj = { year: today.year, month: today.month, day: dayNum };
            const dayOfWeek = getDayOfWeekForBS(dateObj);
            const isSelected =
              selectedDate.year === dateObj.year &&
              selectedDate.month === dateObj.month &&
              selectedDate.day === dateObj.day;
            const isTodayDay =
              today.year === dateObj.year &&
              today.month === dateObj.month &&
              today.day === dateObj.day;

            // Check if day has tx
            const dayTxs = transactions.filter(
              (t) =>
                t?.bsDate &&
                t.bsDate.year === dateObj.year &&
                t.bsDate.month === dateObj.month &&
                t.bsDate.day === dateObj.day
            );
            const hasIncome = dayTxs.some((t) => t.type === 'INCOME');
            const hasExpense = dayTxs.some((t) => t.type === 'EXPENSE');

            return (
              <button
                key={dayNum}
                onClick={() => setSelectedDate(dateObj)}
                className={`py-2 px-1 rounded-xl flex flex-col items-center justify-center transition-all ${
                  isSelected
                    ? 'bg-emerald-700 text-white shadow-sm'
                    : isTodayDay
                    ? 'bg-emerald-50 text-emerald-800 font-bold border border-emerald-300'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700'
                }`}
              >
                <span className="text-[10px] opacity-80">{NEPALI_DAYS_SHORT[dayOfWeek]}</span>
                <span className="text-sm font-bold mt-0.5">{toNepaliDigits(dayNum)}</span>
                <div className="flex gap-1 mt-1 h-1.5 items-center">
                  {hasIncome && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-600'
                      }`}
                    />
                  )}
                  {hasExpense && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-red-200' : 'bg-red-500'
                      }`}
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date's Daily Transactions List */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-4 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h2 className="text-sm font-bold text-slate-900">
              यस दिनको कारोबार विवरण
            </h2>
            <div className="text-xs text-slate-500">
              {formatBSDateLong(selectedDate)}
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs font-semibold text-slate-700">
              आम्दानी: <span className="text-emerald-700">रु {toNepaliDigits(selectedDayIncome)}</span>
            </div>
            <div className="text-xs font-semibold text-slate-700">
              खर्च: <span className="text-red-600">रु {toNepaliDigits(selectedDayExpense)}</span>
            </div>
          </div>
        </div>

        {selectedDayTransactions.length === 0 ? (
          <div className="py-8 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200 my-2">
            <CalendarIcon className="w-8 h-8 mx-auto text-slate-300 mb-2" />
            <p className="text-sm font-medium text-slate-600">
              यस मितिमा कुनै पनि कारोबार रेकर्ड गरिएको छैन।
            </p>
            <p className="text-xs text-slate-400 mt-0.5">
              नयाँ आम्दानी वा खर्च थप्न तलको “＋ नयाँ इन्ट्री” थिच्नुहोस्।
            </p>
            <button
              onClick={() => onNavigate('इन्ट्री थप्नुहोस्', { prefillDate: selectedDate })}
              className="mt-3 px-3.5 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg inline-flex items-center gap-1.5 transition-colors"
            >
              <Plus className="w-3.5 h-3.5" /> यस मितिमा इन्ट्री थप्नुहोस्
            </button>
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {selectedDayTransactions.map((tx) => (
              <div
                key={tx.id}
                onClick={() => onEditTransaction(tx)}
                className="py-3 flex items-center justify-between cursor-pointer hover:bg-slate-50/80 px-2 rounded-xl transition-colors group"
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
                    <div className="text-sm font-bold text-slate-900 group-hover:text-emerald-800 transition-colors truncate">
                      {tx.category}
                    </div>
                    {tx.description && (
                      <div className="text-xs text-slate-600 truncate mt-0.5">
                        {tx.description}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-1">
                      <span>{tx.paymentMethod}</span>
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
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteRequest(tx);
                    }}
                    className="text-[11px] text-red-500 hover:text-red-700 font-medium underline underline-offset-2 mt-1 opacity-80 hover:opacity-100 transition-opacity"
                  >
                    मेटाउनुहोस्
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Home Screen Footer (Display "Developed by [Developer Name]") */}
      <footer className="pt-4 pb-2 text-center text-xs text-slate-500 border-t border-slate-200/60 mt-6 space-y-1">
        <div className="font-semibold text-slate-800">
          मेरो हिसाब • नेपाली आय-व्यय व्यवस्थापन
        </div>
        <div className="text-[11px] text-slate-600 font-medium flex items-center justify-center gap-1">
          <span>Developed by</span>
          <span className="font-bold text-emerald-800">{devInfo.developerName}</span>
        </div>
        <div className="text-[10px] text-slate-400">
          बिक्रम संवत् {devInfo.developmentDateBS} • अफलाइन सुरक्षित डाटा
        </div>
      </footer>

      {/* Floating Action Button (FAB) for "＋ नयाँ इन्ट्री" - Green #168447 */}
      <button
        onClick={() => onNavigate('इन्ट्री थप्नुहोस्', { prefillDate: selectedDate })}
        className="fixed bottom-20 right-4 sm:right-8 z-30 bg-[#168447] hover:bg-[#116e3a] active:scale-95 text-white px-5 py-3.5 rounded-full shadow-lg shadow-emerald-950/30 flex items-center gap-2 text-sm font-bold transition-all"
        title="नयाँ इन्ट्री थप्नुहोस्"
      >
        <Plus className="w-5 h-5" />
        <span>＋ नयाँ इन्ट्री</span>
      </button>
    </div>
  );
};
