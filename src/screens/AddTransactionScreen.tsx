import React, { useState, useEffect } from 'react';
import { useTransactions } from '../context/TransactionContext';
import {
  INCOME_CATEGORIES,
  EXPENSE_CATEGORIES,
  PAYMENT_METHODS,
  TransactionType,
  PaymentMethod,
  BSDate,
  Transaction,
} from '../types';
import { formatBSDate, formatBSDateLong, toNepaliDigits, getTodayBS } from '../utils/bikramSambat';
import { NepaliDatePickerModal } from '../components/NepaliDatePickerModal';
import {
  TrendingUp,
  TrendingDown,
  Calendar as CalendarIcon,
  Check,
  ArrowLeft,
  Calculator,
  PlusCircle,
} from 'lucide-react';

interface Props {
  editTx?: Transaction | null;
  prefillDate?: BSDate;
  onDone: () => void;
}

export const AddTransactionScreen: React.FC<Props> = ({
  editTx,
  prefillDate,
  onDone,
}) => {
  const { addTransaction, updateTransaction } = useTransactions();
  const initialDate = editTx ? editTx.bsDate : prefillDate || getTodayBS();

  const [type, setType] = useState<TransactionType>(editTx ? editTx.type : 'EXPENSE');
  const [category, setCategory] = useState<string>(
    editTx ? editTx.category : EXPENSE_CATEGORIES[0]
  );
  const [customCategory, setCustomCategory] = useState<string>('');
  const [isCustomCategory, setIsCustomCategory] = useState<boolean>(false);
  const [description, setDescription] = useState<string>(editTx ? editTx.description : '');
  const [rate, setRate] = useState<string>(editTx?.rate ? String(editTx.rate) : '');
  const [quantity, setQuantity] = useState<string>(
    editTx?.quantity ? String(editTx.quantity) : ''
  );
  const [manualTotal, setManualTotal] = useState<string>(
    editTx && !editTx.rate ? String(editTx.total) : ''
  );
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(
    editTx ? editTx.paymentMethod : PAYMENT_METHODS[0]
  );
  const [notes, setNotes] = useState<string>(editTx?.notes || '');
  const [date, setDate] = useState<BSDate>(initialDate);
  const [showDatePicker, setShowDatePicker] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  // Auto calculate total
  const rateNum = parseFloat(rate);
  const qtyNum = parseFloat(quantity);
  const manualNum = parseFloat(manualTotal);

  let finalTotal = 0;
  if (!isNaN(rateNum) && !isNaN(qtyNum) && rateNum > 0 && qtyNum > 0) {
    finalTotal = Math.round(rateNum * qtyNum * 100) / 100;
  } else if (!isNaN(manualNum) && manualNum > 0) {
    finalTotal = manualNum;
  }

  // Adjust categories when type changes
  useEffect(() => {
    if (!editTx) {
      if (type === 'INCOME') {
        setCategory(INCOME_CATEGORIES[0]);
      } else {
        setCategory(EXPENSE_CATEGORIES[0]);
      }
      setIsCustomCategory(false);
    }
  }, [type, editTx]);

  const categories = type === 'INCOME' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (finalTotal <= 0) {
      setErrorMessage('कृपया मान्य रकम वा दर र परिमाण उल्लेख गर्नुहोस्।');
      return;
    }

    const selectedCategory = isCustomCategory
      ? customCategory.trim() || 'अन्य'
      : category;

    const payload = {
      type,
      category: selectedCategory,
      description: description.trim(),
      rate: !isNaN(rateNum) && rateNum > 0 ? rateNum : undefined,
      quantity: !isNaN(qtyNum) && qtyNum > 0 ? qtyNum : undefined,
      total: finalTotal,
      paymentMethod,
      notes: notes.trim(),
      bsDate: date,
      bsDateString: formatBSDate(date),
    };

    if (editTx) {
      updateTransaction({
        ...payload,
        id: editTx.id,
        createdAt: editTx.createdAt,
      });
    } else {
      addTransaction(payload);
    }

    onDone();
  };

  return (
    <div className="pb-24 space-y-4">
      {/* Header bar */}
      <div className="flex items-center justify-between bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            onClick={onDone}
            className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h2 className="text-base font-bold text-slate-900">
              {editTx ? 'कारोबार सम्पादन गर्नुहोस्' : 'नयाँ इन्ट्री थप्नुहोस्'}
            </h2>
            <div className="text-xs text-slate-500">
              {formatBSDateLong(date)}
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDatePicker(true)}
          className="px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-xl flex items-center gap-1.5 transition-colors border border-emerald-200"
        >
          <CalendarIcon className="w-3.5 h-3.5 text-emerald-700" />
          <span>{formatBSDate(date)}</span>
        </button>
      </div>

      {errorMessage && (
        <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl font-medium">
          {errorMessage}
        </div>
      )}

      {/* Main Form Card */}
      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs space-y-4">
        {/* Income / Expense Switcher */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            कारोबारको प्रकार (Transaction Type)
          </label>
          <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
            <button
              type="button"
              onClick={() => setType('EXPENSE')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === 'EXPENSE'
                  ? 'bg-[#C62828] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingDown className="w-4 h-4" /> खर्च (Expense)
            </button>
            <button
              type="button"
              onClick={() => setType('INCOME')}
              className={`py-2.5 px-3 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                type === 'INCOME'
                  ? 'bg-[#168447] text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <TrendingUp className="w-4 h-4" /> आम्दानी (Income)
            </button>
          </div>
        </div>

        {/* Categories Selection */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-bold text-slate-600">
              वर्ग (Category)
            </label>
            <button
              type="button"
              onClick={() => setIsCustomCategory(!isCustomCategory)}
              className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {isCustomCategory ? 'सूचीबाट छान्नुहोस्' : 'आफ्नै वर्ग लेख्नुहोस्'}
            </button>
          </div>

          {isCustomCategory ? (
            <input
              type="text"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              placeholder="आफ्नो छुट्टै वर्गको नाम लेख्नुहोस्..."
              className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          ) : (
            <div className="flex flex-wrap gap-1.5 max-h-40 overflow-y-auto p-1 border border-slate-100 rounded-xl bg-slate-50/50">
              {categories.map((c) => {
                const isSelected = category === c;
                return (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setCategory(c)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                      isSelected
                        ? type === 'INCOME'
                          ? 'bg-emerald-700 text-white font-bold shadow-xs'
                          : 'bg-red-600 text-white font-bold shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-200/80 border border-slate-200/60'
                    }`}
                  >
                    {c}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            विवरण (Description)
          </label>
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="जस्तै: घरभाडा भुक्तानी, मासिक किराना सामान, तलब..."
            className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Rate & Quantity (Auto Calculation) */}
        <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200/80 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-700">
            <span className="flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5 text-emerald-700" /> दर र परिमाण (वैकल्पिक)
            </span>
            <span className="text-[11px] text-slate-500 font-normal">दर × परिमाण = कुल रकम</span>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                दर / प्रति इकाई (Rate)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">रु</span>
                <input
                  type="number"
                  step="any"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-sm pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                परिमाण (Quantity)
              </label>
              <input
                type="number"
                step="any"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="0"
                className="w-full text-sm px-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
              />
            </div>
          </div>

          {/* Or Manual Total */}
          {(!rate || !quantity) && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 mb-1">
                वा सिधै एकमुष्ट कुल रकम (Manual Total)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-xs text-slate-400 font-semibold">रु</span>
                <input
                  type="number"
                  step="any"
                  value={manualTotal}
                  onChange={(e) => setManualTotal(e.target.value)}
                  placeholder="0.00"
                  className="w-full text-sm pl-8 pr-3 py-2 bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 tabular-nums"
                />
              </div>
            </div>
          )}

          {/* Computed Preview */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-200">
            <span className="text-xs font-bold text-slate-700">अन्तिम कुल रकम:</span>
            <span
              className={`text-lg font-bold tabular-nums ${
                type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              रु {toNepaliDigits(finalTotal)}
            </span>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            भुक्तानी माध्यम (Payment Method)
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
            {PAYMENT_METHODS.map((method) => {
              const isSelected = paymentMethod === method;
              return (
                <button
                  key={method}
                  type="button"
                  onClick={() => setPaymentMethod(method)}
                  className={`py-2 px-2.5 rounded-xl text-xs font-medium text-left truncate transition-all ${
                    isSelected
                      ? 'bg-slate-900 text-white font-bold shadow-xs'
                      : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200/70'
                  }`}
                >
                  {method}
                </button>
              );
            })}
          </div>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-xs font-bold text-slate-600 mb-1.5">
            अतिरिक्त टिप्पणी (Optional Notes)
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="केही थप विवरण भए यहाँ लेख्न सक्नुहुन्छ..."
            className="w-full text-sm px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-2 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onDone}
            className="px-4 py-2.5 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            type="submit"
            className={`px-6 py-2.5 text-xs font-bold text-white rounded-xl shadow-sm transition-all active:scale-95 ${
              type === 'INCOME' ? 'bg-[#168447] hover:bg-[#116e3a]' : 'bg-[#C62828] hover:bg-[#a71d1d]'
            }`}
          >
            {editTx ? 'अपडेट गर्नुहोस्' : 'सुरक्षित गर्नुहोस्'}
          </button>
        </div>
      </form>

      {/* Date Picker Modal */}
      <NepaliDatePickerModal
        isOpen={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        currentDate={date}
        onSelectDate={(newDate) => setDate(newDate)}
      />
    </div>
  );
};
