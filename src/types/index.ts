export type TransactionType = 'INCOME' | 'EXPENSE';

export type PaymentMethod =
  | 'नगद (Cash)'
  | 'ई-सेवा / खल्ती (Wallet)'
  | 'मोबाइल बैंकिङ (Bank)'
  | 'चेक (Cheque)'
  | 'अन्य (Other)';

export interface BSDate {
  year: number;
  month: number; // 1 to 12
  day: number;   // 1 to 32
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
  bsDateString: string; // e.g. "२०८१-०२-१५"
  createdAt: string;    // ISO timestamp
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
