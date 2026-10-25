import { Transaction, BSDate } from '../types';
import { getTodayBS, formatBSDate, NEPALI_MONTHS } from './bikramSambat';

const STORAGE_KEY = 'mero_hisab_transactions_v2';

export const getInitialDemoTransactions = (): Transaction[] => {
  const today = getTodayBS();
  const y = today.year;
  const m = today.month;
  const d = today.day;

  const mkDate = (dayOffset: number): BSDate => {
    let day = d + dayOffset;
    if (day < 1) day = 1;
    if (day > 28) day = 28;
    return { year: y, month: m, day };
  };

  const sample: Array<Omit<Transaction, 'id' | 'createdAt'>> = [
    {
      type: 'INCOME',
      category: 'तलब',
      description: `${NEPALI_MONTHS[m - 1]} महिनाको मासिक तलब भुक्तानी`,
      rate: 65000,
      quantity: 1,
      total: 65000,
      paymentMethod: 'मोबाइल बैंकिङ (Bank)',
      notes: 'कम्पनी खाताबाट जम्मा भएको',
      bsDate: mkDate(-4),
      bsDateString: formatBSDate(mkDate(-4)),
    },
    {
      type: 'EXPENSE',
      category: 'किराना तथा घरायसी सामान',
      description: 'मासिक चामल, तेल, दाल र खाद्यान्न',
      rate: 4800,
      quantity: 1,
      total: 4800,
      paymentMethod: 'ई-सेवा / खल्ती (Wallet)',
      notes: 'स्थानिय किराना पसलबाट',
      bsDate: mkDate(-3),
      bsDateString: formatBSDate(mkDate(-3)),
    },
    {
      type: 'EXPENSE',
      category: 'घरभाडा',
      description: 'फ्ल्याटको मासिक कोठा भाडा',
      rate: 15000,
      quantity: 1,
      total: 15000,
      paymentMethod: 'मोबाइल बैंकिङ (Bank)',
      notes: 'घरबेटीलाई ट्रान्सफर',
      bsDate: mkDate(-2),
      bsDateString: formatBSDate(mkDate(-2)),
    },
    {
      type: 'EXPENSE',
      category: 'इन्टरनेट तथा मोबाइल बिल',
      description: 'WorldLink फाइबर इन्टरनेट ३ महिना नवीकरण',
      rate: 3500,
      quantity: 1,
      total: 3500,
      paymentMethod: 'ई-सेवा / खल्ती (Wallet)',
      notes: 'वाइफाइ बिल',
      bsDate: mkDate(-1),
      bsDateString: formatBSDate(mkDate(-1)),
    },
    {
      type: 'INCOME',
      category: 'व्यवसायबाट आम्दानी',
      description: 'फ्रिलान्स वेब डिजाइन र आईटी परामर्श',
      rate: 18500,
      quantity: 1,
      total: 18500,
      paymentMethod: 'मोबाइल बैंकिङ (Bank)',
      notes: 'प्रोजेक्ट सम्पन्न पश्चात',
      bsDate: today,
      bsDateString: formatBSDate(today),
    },
    {
      type: 'EXPENSE',
      category: 'खाना तथा खाजा',
      description: 'अफिस खाजा तथा चिया नास्ता',
      rate: 180,
      quantity: 2,
      total: 360,
      paymentMethod: 'नगद (Cash)',
      notes: '',
      bsDate: today,
      bsDateString: formatBSDate(today),
    },
    {
      type: 'EXPENSE',
      category: 'यातायात तथा इन्धन',
      description: 'मोटरसाइकल पेट्रोल ३ लिटर',
      rate: 175,
      quantity: 3,
      total: 525,
      paymentMethod: 'ई-सेवा / खल्ती (Wallet)',
      notes: 'नक्साल पेट्रोल पम्प',
      bsDate: today,
      bsDateString: formatBSDate(today),
    },
  ];

  return sample.map((item, index) => ({
    ...item,
    id: `demo_${Date.now()}_${index}`,
    createdAt: new Date(Date.now() - (index * 3600000)).toISOString(),
  }));
};

export const sanitizeTransaction = (item: any): Transaction | null => {
  if (!item || typeof item !== 'object') return null;

  const today = getTodayBS();
  let bsDate: BSDate = today;

  if (
    item.bsDate &&
    typeof item.bsDate.year === 'number' &&
    !isNaN(item.bsDate.year) &&
    typeof item.bsDate.month === 'number' &&
    !isNaN(item.bsDate.month)
  ) {
    bsDate = {
      year: item.bsDate.year,
      month: item.bsDate.month,
      day: typeof item.bsDate.day === 'number' && !isNaN(item.bsDate.day) ? item.bsDate.day : 1,
    };
  }

  const rawTotal = typeof item.total === 'number' ? item.total : parseFloat(item.total);
  const total = !isNaN(rawTotal) ? Math.max(0, rawTotal) : 0;

  const rate = typeof item.rate === 'number' ? item.rate : parseFloat(item.rate);
  const quantity = typeof item.quantity === 'number' ? item.quantity : parseFloat(item.quantity);

  return {
    id: typeof item.id === 'string' && item.id.trim() ? item.id : `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    type: item.type === 'INCOME' ? 'INCOME' : 'EXPENSE',
    category: typeof item.category === 'string' && item.category.trim() ? item.category : (item.type === 'INCOME' ? 'अन्य आम्दानी' : 'अन्य खर्च'),
    description: typeof item.description === 'string' ? item.description : '',
    rate: !isNaN(rate) && rate > 0 ? rate : undefined,
    quantity: !isNaN(quantity) && quantity > 0 ? quantity : undefined,
    total,
    paymentMethod: typeof item.paymentMethod === 'string' && item.paymentMethod.trim() ? item.paymentMethod : 'नगद (Cash)',
    notes: typeof item.notes === 'string' ? item.notes : '',
    bsDate,
    bsDateString: typeof item.bsDateString === 'string' && item.bsDateString.trim() ? item.bsDateString : formatBSDate(bsDate),
    createdAt: typeof item.createdAt === 'string' ? item.createdAt : new Date().toISOString(),
  };
};

export const loadTransactionsFromStorage = (): Transaction[] => {
  try {
    if (typeof localStorage === 'undefined') {
      return getInitialDemoTransactions();
    }

    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial = getInitialDemoTransactions();
      saveTransactionsToStorage(initial);
      return initial;
    }

    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      const initial = getInitialDemoTransactions();
      saveTransactionsToStorage(initial);
      return initial;
    }

    const sanitized = parsed
      .map(sanitizeTransaction)
      .filter((t): t is Transaction => t !== null);

    if (sanitized.length === 0) {
      const initial = getInitialDemoTransactions();
      saveTransactionsToStorage(initial);
      return initial;
    }

    return sanitized;
  } catch (err) {
    console.error('Failed to load transactions:', err);
    const initial = getInitialDemoTransactions();
    try {
      saveTransactionsToStorage(initial);
    } catch (_) {}
    return initial;
  }
};

export const saveTransactionsToStorage = (transactions: Transaction[]): void => {
  try {
    if (typeof localStorage === 'undefined' || !Array.isArray(transactions)) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
  } catch (err) {
    console.error('Failed to save transactions:', err);
  }
};

export const clearAllTransactions = (): void => {
  try {
    if (typeof localStorage === 'undefined') return;
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error('Failed to clear:', err);
  }
};

export const exportTransactionsToCSV = (transactions: Transaction[]): void => {
  const header = ['आईडी (ID)', 'प्रकार (Type)', 'नेपाली मिति (BS Date)', 'वर्ग (Category)', 'विवरण (Description)', 'दर (Rate)', 'परिमाण (Qty)', 'कुल रकम (Total)', 'भुक्तानी माध्यम (Payment Method)', 'टिप्पणी (Notes)', 'रेकर्ड समय (Timestamp)'];
  
  const rows = transactions.map((t) => [
    `"${t.id}"`,
    `"${t.type === 'INCOME' ? 'आम्दानी' : 'खर्च'}"`,
    `"${t.bsDateString}"`,
    `"${(t.category || '').replace(/"/g, '""')}"`,
    `"${(t.description || '').replace(/"/g, '""')}"`,
    `"${t.rate || ''}"`,
    `"${t.quantity || ''}"`,
    `"${t.total}"`,
    `"${(t.paymentMethod || '').replace(/"/g, '""')}"`,
    `"${(t.notes || '').replace(/"/g, '""')}"`,
    `"${t.createdAt}"`,
  ].join(','));

  const csvContent = '\uFEFF' + [header.join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Mero_Hisab_Backup_${formatBSDate(getTodayBS())}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};
