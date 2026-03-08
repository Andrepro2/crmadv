'use client';

import React from 'react';
import { 
  ShieldCheck, 
  History, 
  UserPlus, 
  Database, 
  Lock, 
  Activity,
  ArrowUpRight,
  Settings,
  Terminal,
  Cloud
} from 'lucide-react';
import { motion } from 'motion/react';

const stats = [
  { label: 'Administradores Ativos', value: '1', icon: ShieldCheck, color: 'primary' },
  { label: 'Acessos Hoje', value: '247', icon: Activity, color: 'secondary' },
  { label: 'Backup do Sistema', value: '100%', icon: Cloud, color: 'success' },
  { label: 'Uso de Armazenamento', value: '12%', icon: Database, color: 'accent' },
];

const logs = [
  { id: 1, user: 'André Dias', action: 'Login realizado', time: '10:45:22', status: 'success' },
  { id: 2, user: 'André Dias', action: 'Novo cliente cadastrado', time: '11:12:05', status: 'success' },
  { id: 3, user: 'André Dias', action: 'Documento excluído', time: '11:45:30', status: 'warning' },
  { id: 4, user: 'Sistema', action: 'Backup automático concluído', time: '12:00:00', status: 'success' },
  { id: 5, user: 'André Dias', action: 'Alteração de permissões', time: '14:22:15', status: 'danger' },
];

export function Admin() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            Área Administrativa
            <span className="px-3 py-1 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
              <ShieldCheck size={14} />
              Acesso Total
            </span>
          </h1>
          <p className="text-text-muted mt-1">Configurações globais e monitoramento do sistema</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white/5 text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 border border-white/10 hover:bg-white/10 transition-all">
            <History size={18} />
            Ver Logs Completos
          </button>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <UserPlus size={18} />
            Novo Usuário
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-card border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary-dark opacity-50" />
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl bg-${stat.color}/10 text-${stat.color}`}>
                <stat.icon size={24} />
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-text-muted mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-card border border-white/5 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
            <Terminal size={20} className="text-primary" />
            Logs de Atividade Recente
          </h3>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-transparent hover:border-white/10 transition-all">
                <div className={`w-2 h-2 rounded-full bg-${log.status}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-white">{log.action}</span>
                    <span className="text-xs text-text-muted font-mono">{log.time}</span>
                  </div>
                  <div className="text-xs text-text-muted mt-1">Usuário: {log.user}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-card border border-white/5 rounded-3xl p-6">
            <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
              <Settings size={20} className="text-primary" />
              Configurações Rápidas
            </h3>
            <div className="space-y-3">
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Lock size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-white">Segurança & Senhas</span>
                </div>
                <ArrowUpRight size={16} className="text-text-muted" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Database size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-white">Banco de Dados</span>
                </div>
                <ArrowUpRight size={16} className="text-text-muted" />
              </button>
              <button className="w-full flex items-center justify-between p-4 rounded-2xl bg-white/5 hover:bg-white/10 transition-all group">
                <div className="flex items-center gap-3">
                  <Settings size={18} className="text-text-muted group-hover:text-primary transition-colors" />
                  <span className="text-sm font-medium text-white">Preferências do Sistema</span>
                </div>
                <ArrowUpRight size={16} className="text-text-muted" />
              </button>
            </div>
          </div>

          <div className="bg-gradient-to-br from-primary/20 to-secondary/20 border border-white/10 rounded-3xl p-6 relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-lg font-bold text-white mb-2">Status do Servidor</h3>
              <div className="flex items-center gap-2 text-success mb-4">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-wider">Online & Estável</span>
              </div>
              <p className="text-xs text-text-muted leading-relaxed">
                Último backup realizado há 2 horas. Todos os serviços estão operando normalmente.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
