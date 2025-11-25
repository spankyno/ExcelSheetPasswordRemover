export interface SheetInfo {
  id: string; // Typically the file path inside the zip, e.g., "xl/worksheets/sheet1.xml"
  name: string; // Display name (filename)
  isProtected: boolean;
  selected: boolean;
}

export type AppStatus = 'idle' | 'analyzing' | 'ready_to_unlock' | 'processing' | 'success' | 'error';

export interface ProcessedFile {
  fileName: string;
  blob: Blob;
}