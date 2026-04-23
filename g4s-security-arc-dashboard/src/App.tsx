/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Shield, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Unlock, 
  TriangleAlert,
  ChevronRight,
  Bell,
  User,
  History,
  AlertOctagon,
  Scan,
  Mail,
  Eye,
  EyeOff,
  Fingerprint,
  LogOut
} from 'lucide-react';

// --- Dashboard Component ---
function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [isArmed, setIsArmed] = useState(true);
  const [showPanic, setShowPanic] = useState(false);

  const toggleArmed = () => {
    if (window.navigator.vibrate) {
      window.navigator.vibrate(50);
    }
    setIsArmed(!isArmed);
  };

  return (
    <div className="min-h-screen bg-[#F5F7F9] text-g4s-black font-sans safe-top safe-bottom pb-24">
      {/* AppBar / Navigation */}
      <header className="bg-white sticky top-0 z-30 border-b border-gray-100 px-6 py-4 flex justify-between items-center shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-g4s-red rounded-sm flex items-center justify-center font-black text-white text-lg italic tracking-tighter shadow-md">
            G4S
          </div>
          <span className="font-extrabold text-lg tracking-tight text-g4s-black">ARC Dashboard</span>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative p-1 active:scale-90 transition-transform">
            <Bell size={22} className="text-gray-400" />
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-g4s-red rounded-full border-2 border-white"></span>
          </button>
          <button onClick={onLogout} className="w-8 h-8 rounded-full bg-g4s-gray/30 flex items-center justify-center overflow-hidden border border-gray-100 active:scale-90 transition-transform">
            <LogOut size={16} className="text-gray-500" />
          </button>
        </div>
      </header>

      <main className="max-w-md mx-auto p-6 space-y-6">
        {/* Header Section */}
        <section className="space-y-1">
          <p className="text-[10px] font-black text-gray-400 tracking-[0.2em] uppercase">
            ESTADO GLOBAL
          </p>
          <h1 className="text-3xl font-extrabold tracking-tight text-g4s-black">Mi Seguridad</h1>
        </section>

        {/* System Status Card */}
        <motion.div 
          layout
          initial={false}
          animate={{
            backgroundColor: isArmed ? '#E8F5E9' : '#FFFFFF',
            scale: 1,
          }}
          whileTap={{ scale: 0.98 }}
          onClick={toggleArmed}
          className={`p-6 rounded-[28px] border-2 flex flex-col gap-4 shadow-lg transition-all duration-500 cursor-pointer ${
            isArmed ? 'border-[#2E7D32]/20' : 'border-gray-200'
          }`}
        >
          <div className="flex items-center justify-between">
            <div className={`p-4 rounded-3xl ${isArmed ? 'bg-green-100 text-[#2E7D32]' : 'bg-gray-100 text-gray-400'}`}>
              {isArmed ? <ShieldCheck size={48} strokeWidth={1.5} /> : <Shield size={48} strokeWidth={1.5} />}
            </div>
            <div className={`px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${isArmed ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
              {isArmed ? 'Protegido' : 'Desactivado'}
            </div>
          </div>
          <div className="space-y-1">
            <p className={`text-xs font-bold uppercase tracking-wide opacity-70 ${isArmed ? 'text-[#2E7D32]' : 'text-gray-400'}`}>
              {isArmed ? 'SISTEMA ARMADO — TOTAL' : 'SISTEMA DESARMADO'}
            </p>
            <p className="text-2xl font-black text-g4s-black">
              {isArmed ? 'Residencia G.G.' : 'Presencia Detectada'}
            </p>
          </div>
        </motion.div>

        {/* Control Grid */}
        <div className="grid grid-cols-2 gap-4">
          <motion.button
            whileTap={{ scale: 0.95 }}
            onClick={toggleArmed}
            className={`flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] shadow-sm font-bold border transition-colors ${
              isArmed 
                ? 'bg-[#FFEBE6] border-red-100 text-[#C62828]' 
                : 'bg-blue-50 border-blue-100 text-[#1565C0]'
            }`}
          >
            {isArmed ? <Unlock size={32} /> : <Lock size={32} />}
            <span className="text-sm">{isArmed ? 'Desarmar' : 'Armar'}</span>
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.95 }}
            className="flex flex-col items-center justify-center gap-3 p-6 rounded-[24px] bg-white shadow-sm font-bold border border-gray-100"
          >
            <Scan size={32} className="text-g4s-gray" />
            <span className="text-sm text-gray-600">Scan QR</span>
          </motion.button>
        </div>

        {/* Alert Card */}
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white p-6 rounded-[28px] border border-red-50 space-y-5 shadow-xl shadow-red-900/5 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 p-4 opacity-5">
              <TriangleAlert size={80} className="text-g4s-red" />
            </div>
            <div className="flex gap-4">
              <div className="mt-1 text-g4s-red bg-red-50 p-2 rounded-xl">
                <TriangleAlert size={28} />
              </div>
              <div className="space-y-1">
                <h3 className="font-extrabold text-g4s-red text-lg">Alerta Detectada</h3>
                <p className="text-sm text-gray-500 font-medium leading-relaxed">
                  Confirma si es una falsa alarma para evitar el despacho de seguridad autorizada.
                </p>
              </div>
            </div>
            <button 
              className="w-full bg-g4s-red text-white py-4 rounded-2xl font-black shadow-lg shadow-red-600/30 active:scale-95 active:bg-red-700 transition-all flex items-center justify-center gap-2"
            >
              CANCELAR FALSA ALARMA
            </button>
          </motion.div>
        </AnimatePresence>

        {/* Activity Section */}
        <section className="space-y-4">
          <div className="flex justify-between items-center px-1">
            <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">Actividad</h4>
            <button className="text-xs font-bold text-g4s-red">Ver historial</button>
          </div>
          <div className="bg-white rounded-[28px] border border-gray-50 shadow-sm overflow-hidden divide-y divide-gray-50">
            {[
              { time: '14:20', event: 'Armado Total', user: 'App Mobile', icon: <Lock size={16} /> },
              { time: '08:15', event: 'Desarmado', user: 'Admin Local', icon: <Unlock size={16} /> },
            ].map((log, i) => (
              <div key={i} className="p-5 flex justify-between items-center active:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400">
                    {log.icon}
                  </div>
                  <div>
                    <p className="font-bold text-sm text-g4s-black">{log.event}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tight">{log.user} • Hoy</p>
                  </div>
                </div>
                <div className="text-xs font-black text-gray-400">{log.time}</div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Panic Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowPanic(true)}
        className="fixed bottom-24 right-6 w-16 h-16 bg-g4s-red rounded-full shadow-2xl flex items-center justify-center text-white z-50 border-4 border-white shadow-red-600/40"
      >
        <AlertOctagon size={32} strokeWidth={2.5} />
      </motion.button>

      {/* Nav Bar */}
      <footer className="fixed bottom-0 left-0 right-0 bg-white/90 backdrop-blur-lg border-t border-gray-100 px-8 py-4 sm:py-6 flex justify-around items-center z-40 safe-bottom">
        <button className="flex flex-col items-center gap-1.5 text-g4s-red group">
          <div className="p-1 rounded-lg bg-red-50 group-active:scale-90 transition-transform">
            <Shield size={22} strokeWidth={2.5} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Panel</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-300 group">
          <div className="p-1 rounded-lg group-active:scale-90 transition-transform">
            <History size={22} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Historial</span>
        </button>
        <button className="flex flex-col items-center gap-1.5 text-gray-300 group">
          <div className="p-1 rounded-lg group-active:scale-90 transition-transform">
            <User size={22} strokeWidth={2} />
          </div>
          <span className="text-[10px] font-black uppercase tracking-tighter">Perfil</span>
        </button>
      </footer>

      {/* Panic Overlay */}
      <AnimatePresence>
        {showPanic && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-g4s-black/80 backdrop-blur-sm z-[100] flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white w-full max-w-xs rounded-[32px] p-8 text-center space-y-6"
            >
              <div className="w-20 h-20 bg-red-100 text-g4s-red rounded-full flex items-center justify-center mx-auto animate-pulse">
                <AlertOctagon size={48} />
              </div>
              <div className="space-y-2">
                <h2 className="text-2xl font-black text-g4s-black leading-tight">¿Confirmar EMERGENCIA?</h2>
                <p className="text-sm text-gray-500 font-medium">Se enviará una alerta inmediata a la central G4S.</p>
              </div>
              <div className="flex flex-col gap-3 pt-2">
                <button className="w-full bg-g4s-red text-white py-4 rounded-2xl font-black text-lg shadow-lg shadow-red-600/30">ENVIAR PÁNICO</button>
                <button 
                  onClick={() => setShowPanic(false)}
                  className="w-full bg-gray-100 text-g4s-black py-4 rounded-2xl font-bold"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// --- Login Component ---
function Login({ onLogin }: { onLogin: (email: string) => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulated auth delay
    setTimeout(() => {
      onLogin(email);
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-white text-g4s-black font-sans flex flex-col p-8 safe-top safe-bottom">
      <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full space-y-10">
        {/* Logo Section */}
        <div className="flex flex-col items-center space-y-4">
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-24 h-24 bg-g4s-red rounded-2xl flex items-center justify-center font-black text-white text-5xl italic tracking-tighter shadow-2xl shadow-red-500/20"
          >
            G4S
          </motion.div>
          <div className="text-center">
            <h1 className="text-2xl font-black tracking-tight">ARC Security App</h1>
            <p className="text-gray-400 text-sm font-bold uppercase tracking-widest mt-1">G4S Technology</p>
          </div>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            {/* Email Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Usuario (Correo)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-g4s-red transition-colors">
                  <Mail size={18} />
                </div>
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@g4s.com"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-4 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-g4s-red/10 focus:border-g4s-red outline-none transition-all"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest pl-1">Contraseña</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-g4s-red transition-colors">
                  <Lock size={18} />
                </div>
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-4 pl-12 pr-12 text-sm font-bold focus:bg-white focus:ring-2 focus:ring-g4s-red/10 focus:border-g4s-red outline-none transition-all"
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-g4s-black"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              <div className="text-right">
                <button type="button" className="text-xs font-bold text-gray-400 hover:text-g4s-red transition-colors">¿Olvidó su contraseña?</button>
              </div>
            </div>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-g4s-red text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-red-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70"
          >
            {loading ? (
              <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                INICIAR SESIÓN
                <ChevronRight size={20} />
              </>
            )}
          </button>
        </form>

        {/* Biometric Simulation */}
        <div className="pt-4 flex flex-col items-center space-y-4">
          <p className="text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">O ingresa con</p>
          <button type="button" className="w-16 h-16 rounded-full border border-gray-100 flex items-center justify-center text-g4s-red active:bg-gray-50 transition-colors">
            <Fingerprint size={32} />
          </button>
        </div>
      </div>

      {/* Support Footer */}
      <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-widest pb-4">
        Soporte: 01-800-G4S-HELP
      </p>
    </div>
  );
}

// --- Main App Entry ---
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  const handleLogin = (email: string) => {
    setIsAuthenticated(true);
    setUserEmail(email);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUserEmail('');
  };

  return (
    <AnimatePresence mode="wait">
      {!isAuthenticated ? (
        <motion.div 
          key="login"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.3 }}
        >
          <Login onLogin={handleLogin} />
        </motion.div>
      ) : (
        <motion.div 
          key="dashboard"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Dashboard onLogout={handleLogout} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
