"use client";
import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import { Shield, Home, Bell, Power, ShieldCheck, RefreshCw, CheckCircle2, XCircle, Search } from 'lucide-react';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
);

// --- COMPONENTE CONTROLADOR (DETERMINA LOGIN / DASHBOARD) ---
// Mantenemos la lógica de la demo, empezando logueados por defecto.
export default function Controller() {
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }
  
  return <DashboardPage onLogout={() => setIsAuthenticated(false)} />;
}

// --- PANTALLA DE LOGIN (SIMULADA) ---
function LoginPage({ onLogin }: { onLogin: () => void }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F3F6', fontFamily: 'sans-serif' }}>
      <div style={{ backgroundColor: 'white', padding: '50px', borderRadius: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.05)', width: '380px', textAlign: 'center' }}>
        
        {/* LOGO G4S OFICIAL */}
        <div style={{ backgroundColor: '#E11D48', color: 'white', width: '80px', height: '80px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '900', fontSize: '32px', margin: '0 auto 30px auto', boxShadow: '0 6px 15px rgba(225,29,72,0.3)' }}>G4S</div>
        
        <h1 style={{ fontSize: '24px', fontWeight: '800', color: '#1A1C21', marginBottom: '10px' }}>Ingreso Seguro</h1>
        <p style={{ color: '#718096', fontSize: '14px', marginBottom: '35px' }}>Ingresa tus credenciales para acceder al panel.</p>
        
        <form onSubmit={(e) => {e.preventDefault(); onLogin();}} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <input type="text" placeholder="Nombre de usuario" style={inputStyle} />
          <input type="password" placeholder="Contraseña" style={inputStyle} />
          <button type="submit" style={{ width: '100%', padding: '15px', backgroundColor: '#E11D48', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 'bold', fontSize: '16px', cursor: 'pointer', boxShadow: '0 6px 15px rgba(225,29,72,0.2)', marginTop: '15px' }}>
            Ingresar al Panel
          </button>
        </form>http://googleusercontent.com/image_generation_content/0
