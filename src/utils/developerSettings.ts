import React from 'react';
import { BSDate } from '../types';
import { getTodayBS, NEPALI_MONTHS, toNepaliDigits } from './bikramSambat';

export interface DeveloperSettings {
  developerName: string;
  developmentDateBS: string;
}

const STORAGE_KEY = 'mero_hisab_developer_settings_v1';
const INIT_DATE_STORAGE_KEY = 'mero_hisab_project_init_bs_date';

export const DEFAULT_DEVELOPER_NAME = 'SUSIL KADEL';

/**
 * Formats a BS date into a clean Nepali BS string e.g. "२०८३ कार्तिक ०७"
 */
export function formatBSDateNepali(bs: BSDate): string {
  const y = toNepaliDigits(bs.year);
  const m = NEPALI_MONTHS[bs.month - 1] || 'कार्तिक';
  const d = toNepaliDigits(bs.day < 10 ? `0${bs.day}` : bs.day);
  return `${y} ${m} ${d}`;
}

/**
 * Gets or initializes the actual date when this app project was first initialized
 */
export function getAppProjectInitBSDate(): string {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return '२०८१ कार्तिक ०९';
  }

  try {
    const existing = localStorage.getItem(INIT_DATE_STORAGE_KEY);
    if (existing && existing.trim()) {
      return existing;
    }

    // Determine initial date: automatically set to today's Bikram Sambat date
    const todayBS = getTodayBS();
    const formatted = formatBSDateNepali(todayBS);
    localStorage.setItem(INIT_DATE_STORAGE_KEY, formatted);
    return formatted;
  } catch (e) {
    console.error('Failed to access localStorage for project init date', e);
    return '२०८१ कार्तिक ०९';
  }
}

/**
 * Retrieves developer settings from localStorage, or initializes defaults
 */
export function getDeveloperSettings(): DeveloperSettings {
  const initDate = getAppProjectInitBSDate();

  if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
    return {
      developerName: DEFAULT_DEVELOPER_NAME,
      developmentDateBS: initDate,
    };
  }

  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const initial: DeveloperSettings = {
        developerName: DEFAULT_DEVELOPER_NAME,
        developmentDateBS: initDate,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
      return initial;
    }

    const parsed = JSON.parse(raw);
    return {
      developerName: (parsed?.developerName || DEFAULT_DEVELOPER_NAME).trim(),
      developmentDateBS: (parsed?.developmentDateBS || initDate).trim(),
    };
  } catch (e) {
    console.error('Failed to read developer settings', e);
    return {
      developerName: DEFAULT_DEVELOPER_NAME,
      developmentDateBS: initDate,
    };
  }
}

/**
 * Saves developer settings to localStorage and dispatches a broadcast event
 */
export function saveDeveloperSettings(settings: DeveloperSettings): void {
  if (typeof window === 'undefined' || typeof localStorage === 'undefined') return;

  try {
    const clean: DeveloperSettings = {
      developerName: (settings.developerName || DEFAULT_DEVELOPER_NAME).trim(),
      developmentDateBS: (settings.developmentDateBS || getAppProjectInitBSDate()).trim(),
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean));

    // Dispatch custom event for real-time sync across components
    window.dispatchEvent(
      new CustomEvent('mero_hisab_developer_updated', {
        detail: clean,
      })
    );
  } catch (e) {
    console.error('Failed to save developer settings', e);
  }
}

/**
 * Resets developer settings back to initial defaults
 */
export function resetDeveloperSettings(): DeveloperSettings {
  const defaultInfo: DeveloperSettings = {
    developerName: DEFAULT_DEVELOPER_NAME,
    developmentDateBS: getAppProjectInitBSDate(),
  };
  saveDeveloperSettings(defaultInfo);
  return defaultInfo;
}

/**
 * React hook to read and observe developer info dynamically
 */
export function useDeveloperInfo(): DeveloperSettings {
  const [info, setInfo] = React.useState<DeveloperSettings>(() => getDeveloperSettings());

  React.useEffect(() => {
    const handleUpdate = (e: Event) => {
      const customEvent = e as CustomEvent<DeveloperSettings>;
      if (customEvent.detail) {
        setInfo(customEvent.detail);
      } else {
        setInfo(getDeveloperSettings());
      }
    };

    window.addEventListener('mero_hisab_developer_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('mero_hisab_developer_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  return info;
}

