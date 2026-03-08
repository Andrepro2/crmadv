'use client';

import React, { useState } from 'react';
import { Scale, Fingerprint, LogIn, AlertCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (username: string) => void;
}

export function Login({ onLogin }: LoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'andre' && password === '929130ab#') {
      onLogin(username);
    } else {
      setError('Credenciais inválidas');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleBiometric = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsSuccess(true);
      setTimeout(() => {
        onLogin('andre');
      }, 500);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      <div className="bg-animation" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-[420px] glass rounded-[32px] p-1 relative overflow-hidden group"
      >
        {/* Animated border effect */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 opacity-20" />
        
        <div className="bg-card rounded-[30px] p-8 md:p-10 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex p-4 bg-gradient-to-br from-primary to-primary-dark rounded-2xl mb-4 shadow-lg shadow-primary/20">
              <Scale size={48} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent">
              LexPro CRM
            </h1>
            <p className="text-text-muted mt-2 text-sm">Sistema Jurídico Integrado</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Usuário</label>
              <input 
                type="text" 
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Digite seu usuário"
                className="w-full bg-darker/60 border-2 border-primary/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted ml-1">Senha</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Digite sua senha"
                className="w-full bg-darker/60 border-2 border-primary/20 rounded-xl px-4 py-3.5 text-white focus:outline-none focus:border-primary transition-all placeholder:text-white/20"
              />
            </div>

            <div className="text-center py-4">
              <button 
                type="button"
                onClick={handleBiometric}
                disabled={isScanning}
                className={`
                  w-20 h-20 rounded-full mx-auto flex items-center justify-center border-2 transition-all duration-300 relative
                  ${isSuccess ? 'border-success bg-success/20 text-success' : 'border-primary/40 bg-primary/10 text-primary hover:scale-110 hover:border-primary hover:shadow-glow'}
                  ${isScanning ? 'animate-pulse' : ''}
                `}
              >
                <Fingerprint size={36} />
                {isScanning && (
                  <div className="absolute inset-0 border-2 border-primary rounded-full animate-ping opacity-40" />
                )}
              </button>
              <p className="text-xs text-text-muted mt-3">Toque para login biométrico</p>
            </div>

            <button 
              type="submit"
              className="w-full bg-gradient-to-r from-primary to-primary-dark text-white font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:translate-y-[-2px] transition-all flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Acessar Sistema
            </button>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center justify-center gap-2 text-danger text-sm font-medium"
              >
                <AlertCircle size={16} />
                {error}
              </motion.div>
            )}
          </form>
        </div>
      </motion.div>
    </div>
  );
}
