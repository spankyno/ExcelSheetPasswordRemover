import React from 'react';
import {
  ShieldCheck, Cpu, Globe, Lock, Unlock, Users, Zap,
  FileSpreadsheet, ArrowLeft, Github, Code2, Package,
  CheckCircle2, Info
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* Background mesh */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 -left-60 w-[500px] h-[500px] bg-blue-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-violet-500/4 rounded-full blur-3xl" />
        {/* Grid lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.03]" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
              <path d="M 60 0 L 0 0 0 60" fill="none" stroke="white" strokeWidth="1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 py-12">
        {/* Back button */}
        <button
          onClick={onBack}
          className="group mb-10 inline-flex items-center gap-2 text-slate-400 hover:text-emerald-400 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a la aplicación
        </button>

        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 mb-6">
            <ShieldCheck className="text-emerald-400 w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
            Excel Sheet{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">
              Password Remover
            </span>
          </h1>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Una herramienta de privacidad total para recuperar el acceso a tus hojas de cálculo protegidas, sin servidores externos, sin comprometer tus datos.
          </p>
        </div>

        {/* What it does */}
        <section className="mb-14">
          <SectionLabel icon={<Info size={14} />} text="¿Qué hace?" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <FileSpreadsheet size={22} className="text-emerald-400" />,
                title: 'Analiza tu archivo',
                desc: 'Arrastra un archivo .xlsx y la app detecta automáticamente qué hojas tienen protección por contraseña.',
              },
              {
                icon: <Lock size={22} className="text-amber-400" />,
                title: 'Identifica la protección',
                desc: 'Muestra un listado claro de hojas protegidas y libres, pre-seleccionando las que requieren acción.',
              },
              {
                icon: <Unlock size={22} className="text-cyan-400" />,
                title: 'Descarga sin bloqueos',
                desc: 'Genera un nuevo .xlsx con las hojas seleccionadas desbloqueadas, listo para descargar al instante.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 hover:bg-white/[0.05] transition-colors"
              >
                <div className="mb-4 w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-white mb-2">{item.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy first */}
        <section className="mb-14">
          <SectionLabel icon={<ShieldCheck size={14} />} text="Privacidad absoluta" />
          <div className="mt-6 bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 rounded-2xl p-8">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-emerald-500/15 flex items-center justify-center">
                <Globe size={24} className="text-emerald-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">100% procesado en tu navegador</h3>
                <p className="text-slate-400 leading-relaxed mb-4">
                  Tu archivo nunca sale de tu dispositivo. Todo el proceso —lectura del ZIP, detección de protección y regeneración del archivo— ocurre localmente usando la Web API de JavaScript.
                </p>
                <ul className="space-y-2">
                  {[
                    'Sin subida a servidores externos',
                    'Sin almacenamiento en la nube',
                    'Sin analíticas sobre el contenido de tus archivos',
                    'Funciona incluso sin conexión a internet (tras cargar la página)',
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-300">
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                      {point}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Usage plans */}
        <section className="mb-14">
          <SectionLabel icon={<Users size={14} />} text="Planes de uso" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Guest */}
            <div className="bg-white/[0.03] border border-white/[0.07] rounded-2xl p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-700 flex items-center justify-center">
                    <Globe size={18} className="text-slate-300" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-widest font-medium">Invitado</p>
                    <p className="font-bold text-white">Sin registro</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">Gratis</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Usos ilimitados por día',
                  'Proceso 100% en navegador',
                  'Sin cuenta necesaria',
                  'Descarga inmediata',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-400">
                    <CheckCircle2 size={14} className="text-slate-500" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Registered */}
            <div className="relative bg-gradient-to-br from-emerald-500/10 via-transparent to-cyan-500/5 border border-emerald-500/25 rounded-2xl p-7">
              <div className="absolute top-4 right-4 text-xs bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-medium">
                Registrado
              </div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-500/15 flex items-center justify-center">
                    <Zap size={18} className="text-emerald-400" />
                  </div>
                  <div>
                    <p className="text-xs text-emerald-500/70 uppercase tracking-widest font-medium">Usuario</p>
                    <p className="font-bold text-white">Con cuenta</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-white">Gratis</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  '2 usos diarios con seguimiento',
                  'Historial de sesión',
                  'Acceso a futuras funciones premium',
                  'Registro gratuito con Clerk',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                    <CheckCircle2 size={14} className="text-emerald-400" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-500 text-center">
            El registro es completamente gratuito. Los usos diarios se reinician a medianoche.
          </p>
        </section>

        {/* Tech stack */}
        <section className="mb-14">
          <SectionLabel icon={<Code2 size={14} />} text="Stack tecnológico" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'React 19', desc: 'UI framework', color: 'text-cyan-400', bg: 'bg-cyan-400/10' },
              { name: 'TypeScript', desc: 'Tipado estático', color: 'text-blue-400', bg: 'bg-blue-400/10' },
              { name: 'Vite', desc: 'Build tool', color: 'text-violet-400', bg: 'bg-violet-400/10' },
              { name: 'JSZip', desc: 'Procesado .xlsx', color: 'text-emerald-400', bg: 'bg-emerald-400/10' },
              { name: 'Clerk', desc: 'Autenticación', color: 'text-orange-400', bg: 'bg-orange-400/10' },
              { name: 'Tailwind CSS', desc: 'Estilos', color: 'text-sky-400', bg: 'bg-sky-400/10' },
              { name: 'Lucide React', desc: 'Iconografía', color: 'text-pink-400', bg: 'bg-pink-400/10' },
              { name: 'Vercel', desc: 'Despliegue', color: 'text-white', bg: 'bg-white/10' },
            ].map((tech) => (
              <div key={tech.name} className="bg-white/[0.03] border border-white/[0.07] rounded-xl p-4 flex items-center gap-3">
                <div className={`w-8 h-8 rounded-lg ${tech.bg} flex items-center justify-center flex-shrink-0`}>
                  <Package size={16} className={tech.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">{tech.name}</p>
                  <p className="text-xs text-slate-500">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* How it works technically */}
        <section className="mb-14">
          <SectionLabel icon={<Cpu size={14} />} text="Cómo funciona por dentro" />
          <div className="mt-6 space-y-3">
            {[
              {
                step: '01',
                title: 'Lectura del archivo como ZIP',
                desc: 'Los archivos .xlsx son en realidad archivos ZIP. JSZip los descomprime en memoria en el navegador.',
              },
              {
                step: '02',
                title: 'Detección de protección XML',
                desc: 'Se escanea la carpeta xl/worksheets/ buscando el tag <sheetProtection> en cada hoja XML.',
              },
              {
                step: '03',
                title: 'Eliminación del tag de protección',
                desc: 'Se elimina el elemento <sheetProtection ... /> del XML de las hojas seleccionadas mediante expresiones regulares.',
              },
              {
                step: '04',
                title: 'Reconstrucción del archivo',
                desc: 'El ZIP se re-empaqueta con compresión DEFLATE y se genera un Blob descargable con extensión .xlsx.',
              },
            ].map((item, i) => (
              <div key={item.step} className="flex gap-5 items-start bg-white/[0.02] border border-white/[0.05] rounded-xl p-5">
                <span className="text-3xl font-black text-white/10 select-none w-10 flex-shrink-0">{item.step}</span>
                <div>
                  <p className="font-semibold text-white mb-1">{item.title}</p>
                  <p className="text-sm text-slate-400 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-white/[0.06] pt-8 text-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} Aitor Sánchez Gutiérrez · Todos los derechos reservados</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <a href="mailto:blog.cottage627@passinbox.com" className="hover:text-emerald-400 transition-colors">Contacto</a>
            <span>·</span>
            <a href="https://aitorsanchez.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Blog</a>
            <span>·</span>
            <a href="https://aitorhub.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-emerald-400 transition-colors">Más apps</a>
          </div>
        </footer>
      </div>
    </div>
  );
};

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-semibold">
      <span className="text-slate-500">{icon}</span>
      {text}
      <div className="flex-1 h-px bg-white/[0.06]" />
    </div>
  );
}

export default AboutPage;
