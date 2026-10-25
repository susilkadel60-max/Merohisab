import JSZip from 'jszip';

export async function generateExpoProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root files
  zip.file(
    'package.json',
    JSON.stringify(
      {
        name: 'mero-hisab',
        version: '1.0.0',
        description: 'Android-first Nepali Personal Income & Expense Management app. Developed by SUSIL KADEL.',
        author: 'SUSIL KADEL',
        main: 'expo/AppEntry.js',
        scripts: {
          start: 'expo start',
          android: 'expo start --android',
          ios: 'expo start --ios',
          web: 'expo start --web'
        },
        dependencies: {
          '@react-native-async-storage/async-storage': '1.23.1',
          '@react-navigation/bottom-tabs': '^6.5.20',
          '@react-navigation/native': '^6.1.17',
          '@react-navigation/native-stack': '^6.9.26',
          expo: '~51.0.0',
          'expo-file-system': '~17.0.1',
          'expo-sharing': '~12.0.1',
          'expo-status-bar': '~1.12.1',
          react: '18.2.0',
          'react-native': '0.74.1',
          'react-native-safe-area-context': '4.10.1',
          'react-native-screens': '~3.31.1'
        },
        devDependencies: {
          '@babel/core': '^7.20.0',
          '@types/react': '~18.2.45',
          typescript: '~5.3.3'
        },
        private: true
      },
      null,
      2
    )
  );

  zip.file(
    'app.json',
    JSON.stringify(
      {
        expo: {
          name: 'मेरो हिसाब',
          slug: 'mero-hisab',
          version: '1.0.0',
          description: 'Android-first Nepali Personal Income & Expense Management app with Bikram Sambat calendar. Developed by SUSIL KADEL.',
          author: 'SUSIL KADEL',
          orientation: 'portrait',
          icon: './assets/icon.png',
          userInterfaceStyle: 'light',
          splash: {
            backgroundColor: '#168447'
          },
          android: {
            adaptiveIcon: {
              backgroundColor: '#168447'
            },
            package: 'com.merohisab.app'
          },
          extra: {
            eas: {
              projectId: 'mero-hisab-project'
            },
            developer: 'SUSIL KADEL'
          }
        }
      },
      null,
      2
    )
  );

  zip.file(
    'eas.json',
    JSON.stringify(
      {
        cli: {
          version: '>= 7.0.0'
        },
        build: {
          development: {
            developmentClient: true,
            distribution: 'internal'
          },
          preview: {
            distribution: 'internal',
            android: {
              buildType: 'apk'
            }
          },
          production: {
            android: {
              buildType: 'app-bundle'
            }
          }
        }
      },
      null,
      2
    )
  );

  zip.file(
    'tsconfig.json',
    JSON.stringify(
      {
        extends: 'expo/tsconfig.base',
        compilerOptions: {
          strict: true
        }
      },
      null,
      2
    )
  );

  zip.file(
    'App.tsx',
    `/**
 * मेरो हिसाब (Mero Hisab) - Android Personal Finance App
 * Developed by SUSIL KADEL
 */

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { TransactionProvider } from './src/context/TransactionContext';
import { AppNavigator } from './src/navigation/AppNavigator';

export default function App() {
  return (
    <SafeAreaProvider>
      <TransactionProvider>
        <NavigationContainer>
          <StatusBar style="light" backgroundColor="#1b5e20" />
          <AppNavigator />
        </NavigationContainer>
      </TransactionProvider>
    </SafeAreaProvider>
  );
}
`
  );

  // README with build and APK guide
  zip.file(
    'README.md',
    `# मेरो हिसाब (Mero Hisab) - React Native + Expo Android Project

नेपाली व्यक्तिगत आम्दानी तथा खर्च व्यवस्थापन प्रणाली (Android-First Application)

**Developed by SUSIL KADEL**
- विकासकर्ता (Developer): SUSIL KADEL
- प्रविधि: React Native, Expo, TypeScript

---

## १. प्रोजेक्ट तयार गर्ने (Quick Start)

1. निर्भरताहरू स्थापना गर्नुहोस्:
   \`\`\`bash
   npm install
   \`\`\`

2. Expo Go मा चलाउनुहोस्:
   \`\`\`bash
   npx expo start
   \`\`\`
   त्यसपछि Android फोनको Expo Go एपबाट स्क्रिनको QR Code स्क्यान गर्नुहोस्।

---

## २. इन्स्टलेबल Android APK बनाउने तरिका (EAS Build)

Google Play Store बिना सीधै फोनमा इन्स्टल गर्न मिल्ने \`.apk\` बनाउन:

1. EAS CLI इन्स्टल गर्नुहोस्:
   \`\`\`bash
   npm install -g eas-cli
   \`\`\`

2. Expo खातामा लगइन गर्नुहोस्:
   \`\`\`bash
   eas login
   \`\`\`

3. प्रोजेक्ट लिङ्क गर्नुहोस्:
   \`\`\`bash
   eas project:init
   \`\`\`

4. APK निर्माण सुरु गर्नुहोस्:
   \`\`\`bash
   eas build --platform android --profile preview
   \`\`\`

5. जब EAS ले build सम्पन्न गर्छ, टर्मिनलमा \`.apk\` डाउनलोड गर्ने लिङ्क प्राप्त हुनेछ।
6. त्यो लिङ्क फोनमा खोली सिधै इन्स्टल गर्नुहोस्!

---

## ३. Google Play Store का लागि AAB बनाउने तरिका

\`\`\`bash
eas build --platform android --profile production
\`\`\`

---

## विकासकर्ता विवरण (Developer Info)
- **App Name:** मेरो हिसाब (Mero Hisab)
- **Developer:** Developed by SUSIL KADEL
- **All Rights Reserved**
`
  );

  // src/types/index.ts
  zip.file(
    'src/types/index.ts',
    `export type TransactionType = 'INCOME' | 'EXPENSE';

export type PaymentMethod =
  | 'नगद (Cash)'
  | 'ई-सेवा / खल्ती (Wallet)'
  | 'मोबाइल बैंकिङ (Bank)'
  | 'चेक (Cheque)'
  | 'अन्य (Other)';

export interface BSDate {
  year: number;
  month: number;
  day: number;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  rate?: number;
  quantity?: number;
  total: number;
  paymentMethod: PaymentMethod;
  notes?: string;
  bsDate: BSDate;
  bsDateString: string;
  createdAt: string;
}

export const INCOME_CATEGORIES: string[] = [
  'तलब',
  'व्यवसायबाट आम्दानी',
  'ब्याज आम्दानी',
  'घरभाडा आम्दानी',
  'बोनस तथा इन्सेन्टिभ',
  'चाडपर्व तथा उपहार आम्दानी',
  'लगानीबाट आम्दानी',
  'अन्य आम्दानी',
];

export const EXPENSE_CATEGORIES: string[] = [
  'खाना तथा खाजा',
  'किराना तथा घरायसी सामान',
  'लुगा तथा व्यक्तिगत सामान',
  'इन्टरनेट तथा मोबाइल बिल',
  'घरभाडा',
  'बिजुली तथा पानी',
  'यातायात तथा इन्धन',
  'स्वास्थ्य तथा औषधि',
  'शिक्षा',
  'उपहार तथा सहयोग',
  'घुमफिर तथा मनोरञ्जन',
  'ऋणको किस्ता',
  'अन्य खर्च',
];

export const PAYMENT_METHODS: PaymentMethod[] = [
  'नगद (Cash)',
  'ई-सेवा / खल्ती (Wallet)',
  'मोबाइल बैंकिङ (Bank)',
  'चेक (Cheque)',
  'अन्य (Other)',
];
`
  );

  // src/utils/bikramSambat.ts
  zip.file(
    'src/utils/bikramSambat.ts',
    `import { BSDate } from '../types';

export const NEPALI_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फागुन', 'चैत'
];

export const NEPALI_DAYS = ['आइत', 'सोम', 'मंगल', 'बुध', 'बिही', 'शुक्र', 'शनि'];
export const NEPALI_NUMBERS = ['०', '१', '२', '३', '४', '५', '६', '७', '८', '९'];

export const toNepaliDigits = (num: number | string): string => {
  if (num === undefined || num === null) return '';
  return num.toString().replace(/\\d/g, (d) => NEPALI_NUMBERS[parseInt(d, 10)]);
};

export const BS_CALENDAR_DATA: Record<number, number[]> = {
  2080: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30],
  2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2082: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  2083: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
  2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
  2085: [31, 32, 31, 32, 30, 31, 30, 29, 30, 29, 30, 30],
};

const REFERENCE_AD = new Date(2023, 3, 14);
const REFERENCE_BS: BSDate = { year: 2080, month: 1, day: 1 };

export function getDaysBetween(date1: Date, date2: Date): number {
  const oneDay = 24 * 60 * 60 * 1000;
  return Math.round((date2.getTime() - date1.getTime()) / oneDay);
}

export function getDaysInBSMonth(year: number, month: number): number {
  const months = BS_CALENDAR_DATA[year];
  return months ? months[month - 1] : 30;
}

export function adToBs(adDate: Date): BSDate {
  let diffDays = getDaysBetween(REFERENCE_AD, adDate);
  let curYear = REFERENCE_BS.year;
  let curMonth = REFERENCE_BS.month;
  let curDay = REFERENCE_BS.day;

  if (diffDays >= 0) {
    while (diffDays > 0) {
      const daysThisMonth = getDaysInBSMonth(curYear, curMonth);
      if (curDay + diffDays <= daysThisMonth) {
        curDay += diffDays;
        diffDays = 0;
      } else {
        diffDays -= (daysThisMonth - curDay + 1);
        curDay = 1;
        curMonth++;
        if (curMonth > 12) {
          curMonth = 1;
          curYear++;
        }
      }
    }
  } else {
    while (diffDays < 0) {
      if (curDay + diffDays >= 1) {
        curDay += diffDays;
        diffDays = 0;
      } else {
        diffDays += curDay;
        curMonth--;
        if (curMonth < 1) {
          curMonth = 12;
          curYear--;
        }
        curDay = getDaysInBSMonth(curYear, curMonth);
      }
    }
  }
  return { year: curYear, month: curMonth, day: curDay };
}

export function bsToAd(bsDate: BSDate): Date {
  let days = 0;
  for (let y = REFERENCE_BS.year; y < bsDate.year; y++) {
    for (let m = 1; m <= 12; m++) {
      days += getDaysInBSMonth(y, m);
    }
  }
  for (let m = 1; m < bsDate.month; m++) {
    days += getDaysInBSMonth(bsDate.year, m);
  }
  days += (bsDate.day - 1);
  return new Date(REFERENCE_AD.getTime() + (days * 24 * 60 * 60 * 1000));
}

export function getBSMonthStartDayOfWeek(year: number, month: number): number {
  return bsToAd({ year, month, day: 1 }).getDay();
}

export function formatBSDate(bs: BSDate): string {
  const y = toNepaliDigits(bs.year);
  const m = toNepaliDigits(bs.month < 10 ? \`0\${bs.month}\` : bs.month);
  const d = toNepaliDigits(bs.day < 10 ? \`0\${bs.day}\` : bs.day);
  return \`\${y}-\${m}-\${d}\`;
}

export function getTodayBS(): BSDate {
  return adToBs(new Date());
}
`
  );

  // src/utils/storage.ts for React Native
  zip.file(
    'src/utils/storage.ts',
    `import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { Transaction } from '../types';

const STORAGE_KEY = '@mero_hisab_transactions_v1';

export const loadTransactionsFromStorage = async (): Promise<Transaction[]> => {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (error) {
    console.error('Failed to load transactions:', error);
    return [];
  }
};

export const saveTransactionsToStorage = async (data: Transaction[]): Promise<void> => {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save transactions:', error);
  }
};

export const exportTransactionsToCSV = async (transactions: Transaction[]): Promise<boolean> => {
  try {
    const header = 'ID,Type,BS Date,Category,Rate,Quantity,Total,Payment Method,Description,Notes,Created At\\n';
    const rows = transactions.map(t =>
      \`"\${t.id}","\${t.type}","\${t.bsDateString}","\${t.category}","\${t.rate || ''}","\${t.quantity || ''}","\${t.total}","\${t.paymentMethod}","\${(t.description || '').replace(/"/g, '""')}","\${(t.notes || '').replace(/"/g, '""')}","\${t.createdAt}"\`
    ).join('\\n');

    const csvContent = '\\uFEFF' + header + rows;
    const fileUri = \`\${FileSystem.documentDirectory}Mero_Hisab_Backup_\${Date.now()}.csv\`;

    await FileSystem.writeAsStringAsync(fileUri, csvContent, {
      encoding: FileSystem.EncodingType.UTF8,
    });

    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(fileUri, {
        mimeType: 'text/csv',
        dialogTitle: 'मेरो हिसाब डाटा ब्याकअप (CSV) सुरक्षित गर्नुहोस्',
        UTI: 'public.comma-separated-values-text',
      });
      return true;
    }
    return false;
  } catch (err) {
    console.error('CSV Export Error:', err);
    return false;
  }
};
`
  );

  // src/context/TransactionContext.tsx
  zip.file(
    'src/context/TransactionContext.tsx',
    `import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, BSDate } from '../types';
import { loadTransactionsFromStorage, saveTransactionsToStorage } from '../utils/storage';
import { getTodayBS } from '../utils/bikramSambat';

interface TransactionContextType {
  transactions: Transaction[];
  selectedDate: BSDate;
  setSelectedDate: (date: BSDate) => void;
  addTransaction: (tx: Omit<Transaction, 'id' | 'createdAt'>) => Promise<void>;
  updateTransaction: (tx: Transaction) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
}

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [selectedDate, setSelectedDate] = useState<BSDate>(getTodayBS());

  useEffect(() => {
    (async () => {
      const data = await loadTransactionsFromStorage();
      setTransactions(data);
    })();
  }, []);

  const addTransaction = async (tx: Omit<Transaction, 'id' | 'createdAt'>) => {
    const newTx: Transaction = {
      ...tx,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    const updated = [newTx, ...transactions];
    setTransactions(updated);
    await saveTransactionsToStorage(updated);
  };

  const updateTransaction = async (tx: Transaction) => {
    const updated = transactions.map((t) => (t.id === tx.id ? tx : t));
    setTransactions(updated);
    await saveTransactionsToStorage(updated);
  };

  const deleteTransaction = async (id: string) => {
    const updated = transactions.filter((t) => t.id !== id);
    setTransactions(updated);
    await saveTransactionsToStorage(updated);
  };

  return (
    <TransactionContext.Provider
      value={{ transactions, selectedDate, setSelectedDate, addTransaction, updateTransaction, deleteTransaction }}
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
`
  );

  // src/navigation/AppNavigator.tsx with Green Top (#168447) and Red Bottom (#C62828)
  zip.file(
    'src/navigation/AppNavigator.tsx',
    `import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Text } from 'react-native';

import { DashboardScreen } from '../screens/DashboardScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { AddTransactionScreen } from '../screens/AddTransactionScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { ReportsScreen } from '../screens/ReportsScreen';
import { ProfileSettingsScreen } from '../screens/ProfileSettingsScreen';

const Tab = createBottomTabNavigator();

export const AppNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#168447' },
        headerTintColor: '#ffffff',
        headerTitleStyle: { fontWeight: 'bold' },
        tabBarStyle: { backgroundColor: '#C62828', borderTopColor: '#B71C1C' },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#ffcdd2',
        tabBarLabelStyle: { fontSize: 11, paddingBottom: 2, fontWeight: 'bold' },
      }}
    >
      <Tab.Screen name="ड्यासबोर्ड" component={DashboardScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📊</Text> }} />
      <Tab.Screen name="क्यालेन्डर" component={CalendarScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📅</Text> }} />
      <Tab.Screen name="इन्ट्री थप्नुहोस्" component={AddTransactionScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>➕</Text> }} />
      <Tab.Screen name="इतिहास" component={HistoryScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📜</Text> }} />
      <Tab.Screen name="रिपोर्ट" component={ReportsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>📈</Text> }} />
      <Tab.Screen name="सेटिङ" component={ProfileSettingsScreen} options={{ tabBarIcon: ({ color }) => <Text style={{ color, fontSize: 18 }}>⚙️</Text> }} />
    </Tab.Navigator>
  );
};
`
  );

  // Bundle the user's portrait watermark into the zip's assets folder
  try {
    const res = await fetch('/developer_watermark.png');
    if (res.ok) {
      const watermarkBlob = await res.blob();
      zip.file('assets/developer_watermark.png', watermarkBlob);
    }
  } catch (err) {
    console.warn('Could not bundle watermark asset in zip:', err);
  }

  return await zip.generateAsync({ type: 'blob' });
}
