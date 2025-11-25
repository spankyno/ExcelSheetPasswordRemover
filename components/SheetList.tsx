import React from 'react';
import { SheetInfo } from '../types';
import { Lock, Unlock, CheckSquare, Square, FileSpreadsheet } from 'lucide-react';

interface SheetListProps {
  sheets: SheetInfo[];
  onToggleSheet: (id: string) => void;
  onToggleAll: (select: boolean) => void;
}

const SheetList: React.FC<SheetListProps> = ({ sheets, onToggleSheet, onToggleAll }) => {
  const protectedSheets = sheets.filter(s => s.isProtected);
  const unprotectedSheets = sheets.filter(s => !s.isProtected);
  
  // Only count protected sheets for "Select All" logic because we only want to unlock protected ones usually
  const allProtectedSelected = protectedSheets.length > 0 && protectedSheets.every(s => s.selected);

  if (sheets.length === 0) {
    return <div className="text-center text-slate-500 py-4">No se encontraron hojas.</div>;
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden mt-6">
      <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-4">
        <div>
          <h3 className="font-semibold text-slate-800">Selección de Hojas</h3>
          <p className="text-sm text-slate-500">Selecciona las hojas que deseas desbloquear</p>
        </div>
        
        {protectedSheets.length > 0 && (
            <button
            onClick={() => onToggleAll(!allProtectedSelected)}
            className="text-sm font-medium text-blue-600 hover:text-blue-800 flex items-center transition-colors"
            >
            {allProtectedSelected ? (
                <>
                <Square size={16} className="mr-1.5" /> Desmarcar todas
                </>
            ) : (
                <>
                <CheckSquare size={16} className="mr-1.5" /> Seleccionar protegidas
                </>
            )}
            </button>
        )}
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        <ul className="divide-y divide-slate-100">
          {sheets.map((sheet) => (
            <li 
              key={sheet.id} 
              className={`
                px-6 py-4 flex items-center justify-between transition-colors
                ${sheet.isProtected ? 'hover:bg-blue-50/50' : 'opacity-60 bg-slate-50/50'}
              `}
            >
              <div className="flex items-center space-x-4">
                <div className={`
                  p-2 rounded-lg 
                  ${sheet.isProtected ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'}
                `}>
                  <FileSpreadsheet size={20} />
                </div>
                <div>
                  <p className="font-medium text-slate-700">{sheet.name}</p>
                  <p className="text-xs text-slate-500 font-mono">{sheet.id}</p>
                </div>
              </div>

              <div className="flex items-center">
                {sheet.isProtected ? (
                  <div className="flex items-center space-x-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-amber-100 text-amber-800">
                      <Lock size={12} className="mr-1" /> Protegida
                    </span>
                    <button
                      onClick={() => onToggleSheet(sheet.id)}
                      className={`
                        w-6 h-6 rounded border flex items-center justify-center transition-all
                        ${sheet.selected 
                          ? 'bg-blue-600 border-blue-600 text-white' 
                          : 'border-slate-300 text-transparent hover:border-blue-400'}
                      `}
                    >
                      <CheckSquare size={16} className={sheet.selected ? 'block' : 'hidden'} />
                    </button>
                  </div>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 opacity-70">
                    <Unlock size={12} className="mr-1" /> Libre
                  </span>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
        <span>Total hojas: {sheets.length}</span>
        <span>Protegidas: {protectedSheets.length}</span>
      </div>
    </div>
  );
};

export default SheetList;