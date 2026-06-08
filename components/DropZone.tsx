import React, { useCallback, useState } from 'react';
import { Upload, XCircle, ShieldOff } from 'lucide-react';

interface DropZoneProps {
  onFileAccepted: (file: File) => void;
  isLoading: boolean;
  disabled?: boolean;
}

const DropZone: React.FC<DropZoneProps> = ({ onFileAccepted, isLoading, disabled = false }) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragOver(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const validateAndPass = (file: File) => {
    setError(null);
    if (file.name.endsWith('.xlsx') || file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet') {
      onFileAccepted(file);
    } else {
      setError('Por favor, sube solo archivos de Excel (.xlsx).');
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (disabled) return;
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndPass(e.dataTransfer.files[0]);
    }
  }, [onFileAccepted, disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return;
    if (e.target.files && e.target.files.length > 0) {
      validateAndPass(e.target.files[0]);
    }
  };

  if (disabled) {
    return (
      <div className="w-full border-2 border-dashed border-slate-200 rounded-xl p-10 text-center bg-slate-50 flex flex-col items-center gap-3">
        <ShieldOff size={32} className="text-slate-300" />
        <p className="text-slate-400 font-medium">Has alcanzado el límite diario de usos.</p>
        <p className="text-sm text-slate-400">Vuelve mañana o usa la app sin cuenta para usos ilimitados.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`
          relative border-2 border-dashed rounded-xl p-10 text-center transition-all duration-300
          ${isDragOver
            ? 'border-blue-500 bg-blue-50'
            : 'border-slate-300 bg-white hover:border-blue-400 hover:bg-slate-50'}
          ${isLoading ? 'opacity-50 pointer-events-none' : 'cursor-pointer'}
        `}
      >
        <input
          type="file"
          accept=".xlsx"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isLoading}
        />
        <div className="flex flex-col items-center justify-center space-y-4">
          <div className={`p-4 rounded-full ${isDragOver ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'}`}>
            <Upload size={32} />
          </div>
          <div>
            <p className="text-lg font-medium text-slate-700">Arrastra y suelta tu archivo Excel aquí</p>
            <p className="text-sm text-slate-500 mt-1">o haz clic para seleccionar (solo .xlsx)</p>
          </div>
        </div>
      </div>

      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center text-red-700 text-sm animate-in fade-in slide-in-from-top-2">
          <XCircle size={18} className="mr-2" />
          {error}
        </div>
      )}
    </div>
  );
};

export default DropZone;
