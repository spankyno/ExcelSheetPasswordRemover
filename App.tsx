import React, { useState, useEffect } from 'react';
import { SheetInfo, AppStatus, ProcessedFile } from './types';
import { analyzeExcelFile, unlockExcelSheets } from './services/excelService';
import DropZone from './components/DropZone';
import SheetList from './components/SheetList';
import { Unlock, Download, RefreshCw, ShieldCheck, AlertCircle, FileCheck } from 'lucide-react';

function App() {
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);

  // Handle file drop
  const handleFileAccepted = async (uploadedFile: File) => {
    setFile(uploadedFile);
    setStatus('analyzing');
    setErrorMsg('');
    setProcessedFile(null);

    try {
      const detectedSheets = await analyzeExcelFile(uploadedFile);
      setSheets(detectedSheets);
      
      // Auto-select protected sheets for better UX
      const sheetsWithAutoSelection = detectedSheets.map(s => ({
        ...s,
        selected: s.isProtected
      }));
      setSheets(sheetsWithAutoSelection);
      
      setStatus('ready_to_unlock');
    } catch (err: any) {
      setErrorMsg(err.message || "Error desconocido al leer el archivo.");
      setStatus('error');
    }
  };

  // Toggle single sheet selection
  const handleToggleSheet = (id: string) => {
    setSheets(prev => prev.map(sheet => 
      sheet.id === id ? { ...sheet, selected: !sheet.selected } : sheet
    ));
  };

  // Toggle all protected sheets
  const handleToggleAll = (shouldSelect: boolean) => {
    setSheets(prev => prev.map(sheet => 
      sheet.isProtected ? { ...sheet, selected: shouldSelect } : sheet
    ));
  };

  // Process unlocking
  const handleUnlock = async () => {
    if (!file) return;

    const sheetsToUnlock = sheets.filter(s => s.selected && s.isProtected).map(s => s.id);
    
    if (sheetsToUnlock.length === 0) {
      setErrorMsg("Por favor, selecciona al menos una hoja protegida para desbloquear.");
      return;
    }

    setStatus('processing');
    try {
      // Simulate a small delay for better UX perceiving "work"
      await new Promise(resolve => setTimeout(resolve, 800));

      const unlockedBlob = await unlockExcelSheets(file, sheetsToUnlock);
      
      const originalName = file.name.replace(/\.xlsx$/i, "");
      const newName = `${originalName}_unlocked.xlsx`;

      setProcessedFile({
        fileName: newName,
        blob: unlockedBlob
      });
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || "Error al desbloquear el archivo.");
      setStatus('error');
    }
  };

  // Download handler
  const handleDownload = () => {
    if (!processedFile) return;
    const url = URL.createObjectURL(processedFile.blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = processedFile.fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Reset App
  const handleReset = () => {
    setFile(null);
    setSheets([]);
    setStatus('idle');
    setErrorMsg('');
    setProcessedFile(null);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 py-10 px-4 font-sans flex flex-col">
      <div className="max-w-3xl mx-auto flex-grow w-full">
        
        {/* Header */}
        <header className="mb-10 text-center space-y-2">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-slate-800 tracking-tight">
            Excel's Sheets Password Remover
          </h1>
          <p className="text-lg text-slate-500 max-w-xl mx-auto">
            Elimina contraseñas de hojas protegidas de forma rápida y segura en tu navegador.
          </p>
        </header>

        {/* Main Card */}
        <main className="bg-white rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 transition-all">
          
          <div className="p-6 md:p-8">
            
            {/* Step 1: Upload */}
            {(status === 'idle' || status === 'analyzing' || status === 'error') && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">1. Sube tu archivo</h2>
                  {status === 'analyzing' && <span className="text-sm text-blue-600 animate-pulse font-medium">Analizando...</span>}
                </div>
                <DropZone onFileAccepted={handleFileAccepted} isLoading={status === 'analyzing'} />
                
                {status === 'error' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Error</h4>
                      <p className="text-sm opacity-90">{errorMsg}</p>
                      <button 
                        onClick={handleReset}
                        className="mt-2 text-xs font-semibold underline hover:text-red-900"
                      >
                        Intentar de nuevo
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Step 2: Selection */}
            {(status === 'ready_to_unlock' || status === 'processing') && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">2. Selecciona las hojas</h2>
                  <button onClick={handleReset} className="text-xs text-slate-400 hover:text-slate-600 underline">
                    Cambiar archivo
                  </button>
                </div>

                <SheetList 
                  sheets={sheets} 
                  onToggleSheet={handleToggleSheet} 
                  onToggleAll={handleToggleAll} 
                />

                <div className="mt-8 flex justify-end">
                  <button
                    onClick={handleUnlock}
                    disabled={status === 'processing' || !sheets.some(s => s.selected)}
                    className={`
                      relative overflow-hidden group flex items-center px-8 py-3 rounded-xl font-semibold text-white shadow-lg shadow-blue-200 transition-all
                      ${status === 'processing' || !sheets.some(s => s.selected)
                        ? 'bg-slate-300 cursor-not-allowed shadow-none' 
                        : 'bg-blue-600 hover:bg-blue-700 hover:shadow-blue-300 transform hover:-translate-y-0.5'}
                    `}
                  >
                    {status === 'processing' ? (
                      <>
                        <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <Unlock className="w-5 h-5 mr-2 group-hover:rotate-[-10deg] transition-transform" />
                        Desbloquear Hojas (Unlock)
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Success */}
            {status === 'success' && processedFile && (
               <div className="py-10 text-center animate-in zoom-in-95 duration-500">
                 <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 text-green-600 rounded-full mb-6">
                    <FileCheck className="w-10 h-10" />
                 </div>
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">¡Desbloqueo Completado!</h2>
                 <p className="text-slate-500 mb-8 max-w-sm mx-auto">
                   Tu archivo ha sido procesado correctamente. Las hojas seleccionadas ya no tienen contraseña.
                 </p>

                 <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                   <button
                     onClick={handleDownload}
                     className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl font-semibold shadow-lg shadow-green-200 transition-all transform hover:-translate-y-0.5"
                   >
                     <Download className="w-5 h-5 mr-2" />
                     Descargar Archivo
                   </button>
                   <button
                     onClick={handleReset}
                     className="w-full sm:w-auto flex items-center justify-center px-8 py-3 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 rounded-xl font-semibold transition-colors"
                   >
                     <RefreshCw className="w-5 h-5 mr-2" />
                     Procesar otro
                   </button>
                 </div>
                 
                 <div className="mt-6 text-xs text-slate-400 font-mono">
                   {processedFile.fileName}
                 </div>
               </div>
            )}
          </div>
          
          {/* Footer of Card */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Privacidad: Los archivos se procesan 100% en tu navegador.</span>
            <span>v1.0.0</span>
          </div>
        </main>
        
        {/* Page Footer */}
        <footer className="mt-12 mb-6 text-center space-y-2">
          <p className="text-sm text-slate-400 font-medium">
            © {new Date().getFullYear()} Aitor Sánchez Gutiérrez - Todos los derechos reservados
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-slate-400">
            <a href="mailto:blog.cottage627@passinbox.com" className="hover:text-blue-500 transition-colors">
              Contacto
            </a>
            <span>·</span>
            <a href="https://aitorblog.infinityfreeapp.com" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              Blog
            </a>
            <span>·</span>
            <a href="https://aitorhub.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              Más apps
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;