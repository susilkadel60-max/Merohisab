import React from 'react';
import { Transaction } from '../types';
import { toNepaliDigits } from '../utils/bikramSambat';
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  transaction: Transaction | null;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<Props> = ({
  isOpen,
  transaction,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !transaction) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in duration-150">
      <div className="bg-white w-full max-w-sm rounded-2xl shadow-2xl p-5 border border-slate-200">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">कारोबार मेटाउने पुष्टि</h3>
            <p className="text-xs text-slate-500">के तपाईं यो रेकर्ड मेटाउन निश्चित हुनुहुन्छ?</p>
          </div>
        </div>

        <div className="bg-slate-50 rounded-xl p-3 my-3 border border-slate-100 text-sm">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-slate-500">{transaction.bsDateString}</span>
            <span
              className={`text-sm font-bold ${
                transaction.type === 'INCOME' ? 'text-emerald-700' : 'text-red-600'
              }`}
            >
              {transaction.type === 'INCOME' ? '+' : '-'} रु {toNepaliDigits(transaction.total)}
            </span>
          </div>
          <div className="font-semibold text-slate-800">{transaction.category}</div>
          {transaction.description && (
            <div className="text-xs text-slate-600 mt-0.5">{transaction.description}</div>
          )}
        </div>

        <p className="text-xs text-slate-500 mb-4">
          यो कार्य उल्टाउन सकिँदैन। यो कारोबार स्थायी रूपमा मेटिनेछ।
        </p>

        <div className="flex items-center justify-end gap-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            रद्द गर्नुहोस्
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 text-xs font-semibold bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
          >
            मेटाउनुहोस्
          </button>
        </div>
      </div>
    </div>
  );
};
