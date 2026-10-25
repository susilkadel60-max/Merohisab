import React, { useState } from 'react';
import { BSDate } from '../types';
import { NEPALI_MONTHS, NEPALI_DAYS_SHORT, toNepaliDigits, getDaysInBSMonth, getBSMonthStartDayOfWeek } from '../utils/bikramSambat';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentDate: BSDate;
  onSelectDate: (date: BSDate) => void;
}

export const NepaliDatePickerModal: React.FC<Props> = ({
  isOpen,
  onClose,
  currentDate,
  onSelectDate,
}) => {
  const [year, setYear] = useState(currentDate.year);
  const [month, setMonth] = useState(currentDate.month);

  if (!isOpen) return null;

  const totalDays = getDaysInBSMonth(year, month);
  const startDay = getBSMonthStartDayOfWeek(year, month);

  const prevMonth = () => {
    if (month === 1) {
      if (year > 2080) {
        setYear(year - 1);
        setMonth(12);
      }
    } else {
      setMonth(month - 1);
    }
  };

  const nextMonth = () => {
    if (month === 12) {
      if (year < 2085) {
        setYear(year + 1);
        setMonth(1);
      }
    } else {
      setMonth(month + 1);
    }
  };

  const handleSelectDay = (day: number) => {
    onSelectDate({ year, month, day });
    onClose();
  };

  const daysGrid: (number | null)[] = [];
  for (let i = 0; i < startDay; i++) {
    daysGrid.push(null);
  }
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push(d);
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="bg-emerald-700 text-white p-4 flex items-center justify-between">
          <div>
            <div className="text-xs text-emerald-200 font-medium">नेपाली मिति छान्नुहोस्</div>
            <div className="text-lg font-bold">
              {NEPALI_MONTHS[month - 1]} {toNepaliDigits(year)}
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-emerald-800/80 hover:bg-emerald-900 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Month Selector Controls */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-slate-50 border-b border-slate-100">
          <button
            onClick={prevMonth}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:scale-95 transition-transform"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex gap-2">
            <select
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
              className="text-sm font-semibold bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {NEPALI_MONTHS.map((m, idx) => (
                <option key={m} value={idx + 1}>
                  {m}
                </option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="text-sm font-semibold bg-white border border-slate-200 rounded-md px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              {[2080, 2081, 2082, 2083, 2084, 2085].map((y) => (
                <option key={y} value={y}>
                  {toNepaliDigits(y)}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={nextMonth}
            className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-700 active:scale-95 transition-transform"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Week Days */}
        <div className="grid grid-cols-7 text-center py-2 px-3 border-b border-slate-100 bg-white">
          {NEPALI_DAYS_SHORT.map((day, idx) => (
            <span
              key={day}
              className={`text-xs font-semibold ${idx === 6 ? 'text-red-500' : 'text-slate-500'}`}
            >
              {day}
            </span>
          ))}
        </div>

        {/* Days Grid */}
        <div className="grid grid-cols-7 gap-1 p-3 bg-white">
          {daysGrid.map((day, idx) => {
            if (day === null) {
              return <div key={`empty-${idx}`} className="h-9" />;
            }
            const isSelected =
              currentDate.year === year &&
              currentDate.month === month &&
              currentDate.day === day;
            const isSaturday = idx % 7 === 6;

            return (
              <button
                key={`day-${day}`}
                onClick={() => handleSelectDay(day)}
                className={`h-9 rounded-xl flex items-center justify-center text-sm font-medium transition-colors ${
                  isSelected
                    ? 'bg-emerald-700 text-white font-bold shadow-sm'
                    : isSaturday
                    ? 'text-red-600 hover:bg-red-50'
                    : 'text-slate-800 hover:bg-slate-100'
                }`}
              >
                {toNepaliDigits(day)}
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            बन्द गर्नुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
