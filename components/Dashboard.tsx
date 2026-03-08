'use client';

import React from 'react';
import { 
  Users, 
  Briefcase, 
  Gavel, 
  DollarSign, 
  MessageSquare,
  ArrowUpRight,
  Plus
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { motion } from 'motion/react';

const data = [
  { name: 'Semana 1', receitas: 15000, despesas: 8000 },
  { name: 'Semana 2', receitas: 22000, despesas: 12000 },
  { name: 'Semana 3', receitas: 18000, despesas: 10000 },
  { name: 'Semana 4', receitas: 25000, despesas: 6500 },
];

const stats = [
  { label: 'Total de Clientes', value: '1,248', trend: '+12%', icon: Users, color: 'primary' },
  { label: 'Processos Ativos', value: '342', trend: '+8%', icon: Briefcase, color: 'secondary' },
  { label: 'Casos Concluídos', value: '156', trend: '95%', icon: Gavel, color: 'accent' },
  { label: 'Receita Mensal', value: 'R$ 89k', trend: '+23%', icon: DollarSign, color: 'success' },
  { label: 'Mensagens WhatsApp', value: '1,247', trend: '+45%', icon: MessageSquare, color: 'whatsapp' },
];

export function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Dashboard</h1>
          <p className="text-text-muted mt-1">Bem-vindo de volta, André</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-3 py-1.5 bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
            Modo Administrador
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all">
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
              <div className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <div className="text-2xl font-bold text-white">{stat.value}</div>
            <div className="text-sm text-text-muted mt-1">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-card border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Desempenho Mensal</h3>
            <select className="bg-darker border border-white/10 rounded-lg px-3 py-1.5 text-xs text-text-muted outline-none focus:border-primary">
              <option>Março 2026</option>
              <option>Fevereiro 2026</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis 
                  dataKey="name" 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="#94a3b8" 
                  fontSize={12} 
                  tickLine={false} 
                  axisLine={false} 
                  tickFormatter={(value) => `R$ ${value / 1000}k`}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
                <Bar dataKey="receitas" fill="#6366f1" radius={[6, 6, 0, 0]} barSize={30} />
                <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl p-6">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-lg font-bold text-white">Fluxo de Caixa</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className="w-2 h-2 rounded-full bg-primary" />
                Receitas
              </div>
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <div className="w-2 h-2 rounded-full bg-secondary" />
                Despesas
              </div>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorRec" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value / 1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                <Area type="monotone" dataKey="receitas" stroke="#6366f1" fillOpacity={1} fill="url(#colorRec)" strokeWidth={3} />
                <Area type="monotone" dataKey="despesas" stroke="#ec4899" fill="transparent" strokeWidth={3} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
