import React, { useState } from 'react';
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from '@clerk/clerk-react';
import { SheetInfo, AppStatus, ProcessedFile } from './types';
import { analyzeExcelFile, unlockExcelSheets } from './services/excelService';
import DropZone from './components/DropZone';
import SheetList from './components/SheetList';
import UsageBanner from './components/UsageBanner';
import { useUsageLimit } from './hooks/useUsageLimit';
import AboutPage from './pages/AboutPage';
import {
  Unlock, Download, RefreshCw, ShieldCheck, AlertCircle,
  FileCheck, LogIn, Info
} from 'lucide-react';

function App() {
  const { isSignedIn = false } = useUser();
  const [page, setPage] = useState<'main' | 'about'>('main');
  const [file, setFile] = useState<File | null>(null);
  const [sheets, setSheets] = useState<SheetInfo[]>([]);
  const [status, setStatus] = useState<AppStatus>('idle');
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [processedFile, setProcessedFile] = useState<ProcessedFile | null>(null);

  const { canUse, remaining, dailyLimit, incrementUsage } = useUsageLimit(isSignedIn);

  if (page === 'about') {
    return <AboutPage onBack={() => setPage('main')} />;
  }

  const handleFileAccepted = async (uploadedFile: File) => {
    if (!canUse) {
      setErrorMsg('Has agotado tus usos diarios. Vuelve mañana.');
      setStatus('error');
      return;
    }
    setFile(uploadedFile);
    setStatus('analyzing');
    setErrorMsg('');
    setProcessedFile(null);

    try {
      const detectedSheets = await analyzeExcelFile(uploadedFile);
      const sheetsWithAutoSelection = detectedSheets.map(s => ({
        ...s,
        selected: s.isProtected,
      }));
      setSheets(sheetsWithAutoSelection);
      setStatus('ready_to_unlock');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error desconocido al leer el archivo.');
      setStatus('error');
    }
  };

  const handleToggleSheet = (id: string) => {
    setSheets(prev => prev.map(sheet =>
      sheet.id === id ? { ...sheet, selected: !sheet.selected } : sheet
    ));
  };

  const handleToggleAll = (shouldSelect: boolean) => {
    setSheets(prev => prev.map(sheet =>
      sheet.isProtected ? { ...sheet, selected: shouldSelect } : sheet
    ));
  };

  const handleUnlock = async () => {
    if (!file) return;
    if (!canUse) {
      setErrorMsg('Has agotado tus usos diarios. Vuelve mañana.');
      return;
    }

    const sheetsToUnlock = sheets.filter(s => s.selected && s.isProtected).map(s => s.id);
    if (sheetsToUnlock.length === 0) {
      setErrorMsg('Por favor, selecciona al menos una hoja protegida para desbloquear.');
      return;
    }

    setStatus('processing');
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const unlockedBlob = await unlockExcelSheets(file, sheetsToUnlock);
      const originalName = file.name.replace(/\.xlsx$/i, '');
      const newName = `${originalName}_unlocked.xlsx`;
      setProcessedFile({ fileName: newName, blob: unlockedBlob });
      incrementUsage();
      setStatus('success');
    } catch (err: any) {
      setErrorMsg(err.message || 'Error al desbloquear el archivo.');
      setStatus('error');
    }
  };

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

        {/* Top bar */}
        <div className="flex items-center justify-end mb-6 gap-3">
          <SignedOut>
            <SignInButton mode="modal">
              <button className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-blue-600 border border-slate-200 hover:border-blue-300 bg-white rounded-xl px-4 py-2 transition-all shadow-sm">
                <LogIn size={15} />
                Iniciar sesión
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <UserButton
              appearance={{
                elements: {
                  avatarBox: 'w-8 h-8',
                },
              }}
            />
          </SignedIn>
        </div>

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

        {/* Usage banner */}
        <div className="mb-6">
          <UsageBanner remaining={remaining} dailyLimit={dailyLimit} isSignedIn={isSignedIn} />
        </div>

        {/* Main Card */}
        <main className="bg-white rounded-2xl shadow-xl shadow-slate-200 overflow-hidden border border-slate-100 transition-all">
          <div className="p-6 md:p-8">

            {/* Step 1: Upload */}
            {(status === 'idle' || status === 'analyzing' || status === 'error') && (
              <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-slate-800">1. Sube tu archivo</h2>
                  {status === 'analyzing' && (
                    <span className="text-sm text-blue-600 animate-pulse font-medium">Analizando...</span>
                  )}
                </div>
                <DropZone
                  onFileAccepted={handleFileAccepted}
                  isLoading={status === 'analyzing'}
                  disabled={!canUse && isSignedIn}
                />

                {status === 'error' && (
                  <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start space-x-3 text-red-800">
                    <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-sm">Error</h4>
                      <p className="text-sm opacity-90">{errorMsg}</p>
                      <button onClick={handleReset} className="mt-2 text-xs font-semibold underline hover:text-red-900">
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
                        Desbloquear Hojas
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

                <div className="mt-6 text-xs text-slate-400 font-mono">{processedFile.fileName}</div>
              </div>
            )}
          </div>

          {/* Footer of Card */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400">
            <span>Privacidad: Los archivos se procesan 100% en tu navegador.</span>
            <span>v2.0.0</span>
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
            <a href="https://aitorsanchez.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              Blog
            </a>
            <span>·</span>
            <a href="https://aitorhub.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">
              Más apps
            </a>
            <span>·</span>
            <button onClick={() => setPage('about')} className="hover:text-blue-500 transition-colors inline-flex items-center gap-1">
              <Info size={12} />
              Acerca de
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
