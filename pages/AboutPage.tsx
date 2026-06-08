import React from 'react';
import {
  ShieldCheck, Globe, Lock, Unlock, Users, Zap,
  FileSpreadsheet, ArrowLeft, Code2, Package,
  CheckCircle2, Info
} from 'lucide-react';

interface AboutPageProps {
  onBack: () => void;
}

const AboutPage: React.FC<AboutPageProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans py-10 px-4">
      <div className="max-w-4xl mx-auto">

        {/* Back button */}
        <button
          onClick={onBack}
          className="group mb-10 inline-flex items-center gap-2 text-slate-400 hover:text-blue-600 transition-colors text-sm font-medium"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
          Volver a la aplicación
        </button>

        {/* Hero */}
        <div className="mb-16 text-center">
          <div className="inline-flex items-center justify-center p-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-200 mb-6">
            <ShieldCheck className="text-white w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-slate-800 mb-4">
            Excel's Sheets Password Remover
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto leading-relaxed">
            Una herramienta de privacidad total para recuperar el acceso a tus hojas de cálculo protegidas, sin servidores externos, sin comprometer tus datos.
          </p>
        </div>

        {/* What it does */}
        <section className="mb-14">
          <SectionLabel icon={<Info size={14} />} text="¿Qué hace?" />
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                icon: <FileSpreadsheet size={22} className="text-blue-500" />,
                title: 'Analiza tu archivo',
                desc: 'Arrastra un archivo .xlsx y la app detecta automáticamente qué hojas tienen protección por contraseña.',
              },
              {
                icon: <Lock size={22} className="text-amber-500" />,
                title: 'Identifica la protección',
                desc: 'Muestra un listado claro de hojas protegidas y libres, pre-seleccionando las que requieren acción.',
              },
              {
                icon: <Unlock size={22} className="text-green-500" />,
                title: 'Descarga sin bloqueos',
                desc: 'Genera un nuevo .xlsx con las hojas seleccionadas desbloqueadas, listo para descargar al instante.',
              },
            ].map((item) => (
              <div
                key={item.title}
                className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow"
              >
                <div className="mb-4 w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
                  {item.icon}
                </div>
                <h3 className="font-semibold text-slate-800 mb-2">{item.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Privacy first */}
        <section className="mb-14">
          <SectionLabel icon={<ShieldCheck size={14} />} text="Privacidad absoluta" />
          <div className="mt-6 bg-white border border-slate-200 rounded-2xl p-8">
            <div className="flex items-start gap-5">
              <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <Globe size={24} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-800 mb-2">100% procesado en tu navegador</h3>
                <p className="text-slate-500 leading-relaxed mb-4">
                  Tu archivo nunca sale de tu dispositivo. Todo el proceso —lectura del ZIP, detección de protección y regeneración del archivo— ocurre localmente usando la Web API de JavaScript.
                </p>
                <ul className="space-y-2">
                  {[
                    'Sin subida a servidores externos',
                    'Sin almacenamiento en la nube',
                    'Sin analíticas sobre el contenido de tus archivos',
                    'Funciona incluso sin conexión a internet (tras cargar la página)',
                  ].map((point) => (
                    <li key={point} className="flex items-center gap-2 text-sm text-slate-600">
                      <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
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
            <div className="bg-white border border-slate-200 rounded-2xl p-7">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-slate-100 flex items-center justify-center">
                    <Globe size={18} className="text-slate-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">Invitado</p>
                    <p className="font-bold text-slate-800">Sin registro</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-800">Gratis</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Usos ilimitados por día',
                  'Proceso 100% en navegador',
                  'Sin cuenta necesaria',
                  'Descarga inmediata',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-500">
                    <CheckCircle2 size={14} className="text-slate-400 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>

            {/* Registered */}
            <div className="relative bg-white border border-blue-200 rounded-2xl p-7 shadow-sm shadow-blue-100">
              <div className="absolute top-4 right-4 text-xs bg-blue-50 text-blue-600 border border-blue-200 px-2.5 py-0.5 rounded-full font-medium">
                Registrado
              </div>
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center gap-3">
                  {/* Clerk logo SVG */}
                  <div className="w-9 h-9 rounded-lg bg-[#6C47FF]/10 flex items-center justify-center">
                    <svg width="18" height="18" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M16 2C8.268 2 2 8.268 2 16s6.268 14 14 14 14-6.268 14-14S23.732 2 16 2z" fill="#6C47FF"/>
                      <path d="M21.5 11.5L19 14a4.5 4.5 0 1 0 0 4l2.5 2.5A8 8 0 1 1 21.5 11.5z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <p className="text-xs text-blue-400 uppercase tracking-widest font-medium">Usuario</p>
                    <p className="font-bold text-slate-800">Con cuenta</p>
                  </div>
                </div>
                <span className="text-2xl font-bold text-slate-800">Gratis</span>
              </div>
              <ul className="space-y-2.5">
                {[
                  'Uso ilimitado',
                  'Historial de sesión',
                  'Acceso a futuras funciones premium',
                  'Registro gratuito con Clerk',
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                    <CheckCircle2 size={14} className="text-blue-500 flex-shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 text-center">
            El registro es completamente gratuito.
          </p>
        </section>

        {/* Tech stack */}
        <section className="mb-14">
          <SectionLabel icon={<Code2 size={14} />} text="Stack tecnológico" />
          <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { name: 'React 19', desc: 'UI framework', color: 'text-cyan-500', bg: 'bg-cyan-50' },
              { name: 'TypeScript', desc: 'Tipado estático', color: 'text-blue-500', bg: 'bg-blue-50' },
              { name: 'Vite', desc: 'Build tool', color: 'text-violet-500', bg: 'bg-violet-50' },
              { name: 'JSZip', desc: 'Procesado .xlsx', color: 'text-emerald-500', bg: 'bg-emerald-50' },
              { name: 'Clerk', desc: 'Autenticación', color: 'text-[#6C47FF]', bg: 'bg-[#6C47FF]/10' },
              { name: 'Tailwind CSS', desc: 'Estilos', color: 'text-sky-500', bg: 'bg-sky-50' },
              { name: 'Lucide React', desc: 'Iconografía', color: 'text-pink-500', bg: 'bg-pink-50' },
              { name: 'Vercel', desc: 'Despliegue', color: 'text-slate-700', bg: 'bg-slate-100' },
            ].map((tech) => (
              <div key={tech.name} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-3 hover:shadow-sm transition-shadow">
                <div className={`w-8 h-8 rounded-lg ${tech.bg} flex items-center justify-center flex-shrink-0`}>
                  <Package size={16} className={tech.color} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{tech.name}</p>
                  <p className="text-xs text-slate-400">{tech.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="border-t border-slate-200 pt-8 text-center text-sm text-slate-400">
          <p>© {new Date().getFullYear()} Aitor Sánchez Gutiérrez · Todos los derechos reservados</p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <a href="mailto:blog.cottage627@passinbox.com" className="hover:text-blue-500 transition-colors">Contacto</a>
            <span>·</span>
            <a href="https://aitorsanchez.pages.dev/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Blog</a>
            <span>·</span>
            <a href="https://aitorhub.vercel.app/" target="_blank" rel="noopener noreferrer" className="hover:text-blue-500 transition-colors">Más apps</a>
          </div>
        </footer>

      </div>
    </div>
  );
};

function SectionLabel({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-400 uppercase tracking-widest font-semibold">
      <span className="text-slate-400">{icon}</span>
      {text}
      <div className="flex-1 h-px bg-slate-200" />
    </div>
  );
}

export default AboutPage;
