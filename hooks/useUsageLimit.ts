import { useState, useEffect } from 'react';

const STORAGE_KEY = 'excel_remover_usage';
const GUEST_DAILY_LIMIT = 2;   // 2 usos al día para invitados
const USER_DAILY_LIMIT = null; // null = ilimitado para registrados

interface UsageData {
  date: string;
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().split('T')[0];
}

function getUsage(): UsageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return { date: getTodayKey(), count: 0 };
    const parsed = JSON.parse(raw) as UsageData;
    if (parsed.date !== getTodayKey()) return { date: getTodayKey(), count: 0 };
    return parsed;
  } catch {
    return { date: getTodayKey(), count: 0 };
  }
}

function saveUsage(data: UsageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function useUsageLimit(isSignedIn: boolean) {
  const [usageCount, setUsageCount] = useState<number>(0);

  useEffect(() => {
    const usage = getUsage();
    setUsageCount(usage.count);
  }, []);

  const dailyLimit = isSignedIn ? USER_DAILY_LIMIT : GUEST_DAILY_LIMIT;
  const canUse = dailyLimit === null || usageCount < dailyLimit;
  const remaining = dailyLimit === null ? null : Math.max(0, dailyLimit - usageCount);

  function incrementUsage() {
    const usage = getUsage();
    const updated = { date: getTodayKey(), count: usage.count + 1 };
    saveUsage(updated);
    setUsageCount(updated.count);
  }

  return { usageCount, canUse, remaining, dailyLimit, incrementUsage };
}
