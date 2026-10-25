import React, { useState, useCallback } from 'react';
import { TransactionProvider, useTransactions } from './context/TransactionContext';
import { AndroidFrame } from './components/AndroidFrame';
import { BottomNav } from './components/BottomNav';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { EasBuildModal } from './components/EasBuildModal';
import { SplashScreen } from './components/SplashScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

import { DashboardScreen } from './screens/DashboardScreen';
import { CalendarScreen } from './screens/CalendarScreen';
import { AddTransactionScreen } from './screens/AddTransactionScreen';
import { HistoryScreen } from './screens/HistoryScreen';
import { ReportsScreen } from './screens/ReportsScreen';
import { ProfileSettingsScreen } from './screens/ProfileSettingsScreen';
import { Transaction, BSDate } from './types';

function MainAppContent() {
  const { deleteTransaction } = useTransactions();
  const [showSplash, setShowSplash] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<string>('ड्यासबोर्ड');
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [prefillDate, setPrefillDate] = useState<BSDate | undefined>(undefined);
  const [txToDelete, setTxToDelete] = useState<Transaction | null>(null);
  const [isEasModalOpen, setIsEasModalOpen] = useState<boolean>(false);

  const handleFinishSplash = useCallback(() => {
    setShowSplash(false);
  }, []);

  const handleNavigate = (tabId: string, params?: { prefillDate?: BSDate; editTx?: Transaction }) => {
    if (params?.prefillDate) {
      setPrefillDate(params.prefillDate);
    }
    if (params?.editTx) {
      setEditTx(params.editTx);
    } else if (tabId === 'इन्ट्री थप्नुहोस्' && !params?.editTx) {
      setEditTx(null);
    }
    setCurrentTab(tabId);
  };

  const handleEdit = (tx: Transaction) => {
    setEditTx(tx);
    setCurrentTab('इन्ट्री थप्नुहोस्');
  };

  const handleDeleteRequest = (tx: Transaction) => {
    setTxToDelete(tx);
  };

  const handleConfirmDelete = () => {
    if (txToDelete) {
      deleteTransaction(txToDelete.id);
      setTxToDelete(null);
    }
  };

  return (
    <AndroidFrame
      onOpenEasModal={() => setIsEasModalOpen(true)}
      currentTab={currentTab}
    >
      {/* Screens Routing */}
      {currentTab === 'ड्यासबोर्ड' && (
        <DashboardScreen
          onNavigate={handleNavigate}
          onEditTransaction={handleEdit}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {currentTab === 'क्यालेन्डर' && (
        <CalendarScreen
          onNavigate={handleNavigate}
          onEditTransaction={handleEdit}
          onDeleteRequest={handleDeleteRequest}
        />
      )}

      {currentTab === 'इन्ट्री थप्नुहोस्' && (
        <AddTransactionScreen
          editTx={editTx}
          prefillDate={prefillDate}
          onDone={() => {
            setEditTx(null);
            setPrefillDate(undefined);
            setCurrentTab('ड्यासबोर्ड');
          }}
        />
      )}

      {currentTab === 'इतिहास' && (
        <HistoryScreen
          onEditTransaction={handleEdit}
          onDeleteRequest={handleDeleteRequest}
          onNavigateAdd={() => handleNavigate('इन्ट्री थप्नुहोस्')}
        />
      )}

      {currentTab === 'रिपोर्ट' && <ReportsScreen />}

      {currentTab === 'सेटिङ' && (
        <ProfileSettingsScreen
          onOpenEasModal={() => setIsEasModalOpen(true)}
          onReplaySplash={() => setShowSplash(true)}
        />
      )}

      {/* Persistent Bottom Nav Bar */}
      <BottomNav currentTab={currentTab} onSelectTab={(tabId) => handleNavigate(tabId)} />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={!!txToDelete}
        transaction={txToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={() => setTxToDelete(null)}
      />

      {/* EAS Build and APK Guide Modal */}
      <EasBuildModal
        isOpen={isEasModalOpen}
        onClose={() => setIsEasModalOpen(false)}
      />

      {/* Native App Opening Splash Screen (Requirement 1: Developed by SUSIL KADEL) */}
      {showSplash && (
        <SplashScreen onFinish={handleFinishSplash} />
      )}
    </AndroidFrame>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <TransactionProvider>
        <MainAppContent />
      </TransactionProvider>
    </ErrorBoundary>
  );
}
