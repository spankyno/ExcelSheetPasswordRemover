export interface SheetInfo {
  id: string;
  name: string;
  isProtected: boolean;
  selected: boolean;
}

export type AppStatus = 'idle' | 'analyzing' | 'ready_to_unlock' | 'processing' | 'success' | 'error';

export interface ProcessedFile {
  fileName: string;
  blob: Blob;
}

export interface UsageRecord {
  date: string; // YYYY-MM-DD
  count: number;
}
