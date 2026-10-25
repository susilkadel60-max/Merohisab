import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, BSDate } from '../types';
import {
  loadTransactionsFromStorage,
  saveTransactionsToStorage,
  getInitialDemoTransactions,
  clearAllTransactions,
} from '../utils/storage';
import { getTodayBS, formatBSDate } from '../utils/bikramSambat';

interface TransactionContextType {
  transactions: Transaction[];
  selectedDate: BSDate;
  setSelectedDate: (date: BSDate) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => void;
  updateTransaction: (tx: Transaction) => void;
  deleteTransaction: (id: string) => void;
  resetToDemoData: () => void;
  clearAll: () => void;
  importTransactions: (txs: Transaction[]) => void;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    try {
      return loadTransactionsFromStorage();
    } catch (e) {
      console.error('Error in initial loadTransactionsFromStorage:', e);
      return [];
    }
  });
  const [selectedDate, setSelectedDate] = useState<BSDate>(() => {
    try {
      return getTodayBS();
    } catch {
      return { year: 2081, month: 1, day: 1 };
    }
  });

  const addTransaction = (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      bsDateString: formatBSDate(tx.bsDate),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    saveTransactionsToStorage(updated);
  };

  const updateTransaction = (tx: Transaction) => {
    const updated = transactions.map((t) => (t.id === tx.id ? tx : t));
    setTransactions(updated);
    saveTransactionsToStorage(updated);
  };

  const deleteTransaction = (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    saveTransactionsToStorage(updated);
  };

  const resetToDemoData = () => {
    const demo = getInitialDemoTransactions();
    setTransactions(demo);
    saveTransactionsToStorage(demo);
  };

  const clearAll = () => {
    setTransactions([]);
    clearAllTransactions();
  };

  const importTransactions = (imported: Transaction[]) => {
    const combined = [...imported, ...transactions];
    setTransactions(combined);
    saveTransactionsToStorage(combined);
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        selectedDate,
        setSelectedDate,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        resetToDemoData,
        clearAll,
        importTransactions,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const ctx = useContext(TransactionContext);
  if (!ctx) throw new Error('useTransactions must be inside TransactionProvider');
  return ctx;
};
