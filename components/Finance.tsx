'use client';

import React, { useState } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight, 
  Calendar as CalendarIcon,
  Search,
  MoreVertical,
  Filter
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const data = [
  { name: 'Semana 1', receitas: 15000, despesas: 8000 },
  { name: 'Semana 2', receitas: 22000, despesas: 12000 },
  { name: 'Semana 3', receitas: 18000, despesas: 10000 },
  { name: 'Semana 4', receitas: 25000, despesas: 6500 },
];

const transactions = [
  { id: 1, type: 'entrada', category: 'Honorários', value: 15000, date: '2026-03-01', client: 'João Silva', description: 'Honorários contratuais', paid: true },
  { id: 2, type: 'entrada', category: 'Honorários', value: 8000, date: '2026-03-05', client: 'Maria Santos', description: 'Entrada - Maria Santos', paid: true },
  { id: 3, type: 'saida', category: 'Custas', value: 2500, date: '2026-03-08', client: 'João Silva', description: 'Custas processuais', paid: true },
  { id: 4, type: 'entrada', category: 'Honorários', value: 25000, date: '2026-03-10', client: 'Empresa ABC', description: 'Honorários - Empresa ABC', paid: true },
  { id: 5, type: 'saida', category: 'Despesas Operacionais', value: 3500, date: '2026-03-12', client: null, description: 'Aluguel do escritório', paid: true },
  { id: 6, type: 'saida', category: 'Impostos', value: 8000, date: '2026-03-15', client: null, description: 'ISS e INSS', paid: true },
];

export function Finance() {
  const [activeMonth, setActiveMonth] = useState('2'); // Março

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Controle Financeiro</h1>
          <p className="text-text-muted mt-1">Gestão de receitas, despesas e fluxo de caixa</p>
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={activeMonth}
            onChange={(e) => setActiveMonth(e.target.value)}
            className="bg-card border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white outline-none focus:border-primary transition-all"
          >
            <option value="0">Janeiro 2026</option>
            <option value="1">Fevereiro 2026</option>
            <option value="2">Março 2026</option>
            <option value="3">Abril 2026</option>
          </select>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <Plus size={18} />
            Nova Transação
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-success" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-success/10 text-success rounded-xl">
              <TrendingUp size={24} />
            </div>
            <div className="flex items-center gap-1 text-success text-xs font-bold bg-success/10 px-2 py-1 rounded-full">
              <ArrowUpRight size={12} />
              +15%
            </div>
          </div>
          <div className="text-3xl font-bold text-white">R$ 80.000,00</div>
          <div className="text-sm text-text-muted mt-1">Total Receitas</div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-danger" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-danger/10 text-danger rounded-xl">
              <TrendingDown size={24} />
            </div>
            <div className="flex items-center gap-1 text-danger text-xs font-bold bg-danger/10 px-2 py-1 rounded-full">
              <ArrowDownRight size={12} />
              -5%
            </div>
          </div>
          <div className="text-3xl font-bold text-white">R$ 36.500,00</div>
          <div className="text-sm text-text-muted mt-1">Total Despesas</div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl p-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-primary" />
          <div className="flex justify-between items-start mb-4">
            <div className="p-3 bg-primary/10 text-primary rounded-xl">
              <Wallet size={24} />
            </div>
            <div className="flex items-center gap-1 text-primary text-xs font-bold bg-primary/10 px-2 py-1 rounded-full">
              <TrendingUp size={12} />
              +23%
            </div>
          </div>
          <div className="text-3xl font-bold text-white">R$ 43.500,00</div>
          <div className="text-sm text-text-muted mt-1">Saldo do Mês</div>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-3xl p-6">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-lg font-bold text-white">Fluxo de Caixa - Março 2026</h3>
          <div className="flex gap-4">
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="w-2 h-2 rounded-full bg-success" />
              Receitas
            </div>
            <div className="flex items-center gap-2 text-xs text-text-muted">
              <div className="w-2 h-2 rounded-full bg-danger" />
              Despesas
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
              <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(value) => `R$ ${value / 1000}k`} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                itemStyle={{ color: '#f8fafc' }}
              />
              <Bar dataKey="receitas" fill="#10b981" radius={[6, 6, 0, 0]} barSize={40} />
              <Bar dataKey="despesas" fill="#ef4444" radius={[6, 6, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-white">Últimas Transações</h3>
          <div className="flex items-center gap-2">
            <button className="p-2 text-text-muted hover:text-white transition-colors">
              <Filter size={18} />
            </button>
            <button className="p-2 text-text-muted hover:text-white transition-colors">
              <Search size={18} />
            </button>
          </div>
        </div>

        <div className="bg-card border border-white/5 rounded-3xl overflow-hidden">
          <div className="divide-y divide-white/5">
            {transactions.map((t) => (
              <div key={t.id} className="flex items-center gap-4 p-5 hover:bg-white/[0.02] transition-colors group">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center text-xl",
                  t.type === 'entrada' ? "bg-success/10 text-success" : "bg-danger/10 text-danger"
                )}>
                  {t.type === 'entrada' ? <TrendingUp size={20} /> : <TrendingDown size={20} />}
                </div>
                <div className="flex-1 overflow-hidden">
                  <h4 className="text-sm font-bold text-white truncate">{t.description}</h4>
                  <p className="text-xs text-text-muted mt-1 flex items-center gap-2">
                    <span className="bg-white/5 px-2 py-0.5 rounded-full">{t.category}</span>
                    {t.client && <span>• {t.client}</span>}
                    <span>• {t.date}</span>
                  </p>
                </div>
                <div className={cn(
                  "text-sm font-bold",
                  t.type === 'entrada' ? "text-success" : "text-danger"
                )}>
                  {t.type === 'entrada' ? '+' : '-'} R$ {t.value.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
                <button className="p-2 text-text-muted hover:text-white opacity-0 group-hover:opacity-100 transition-all">
                  <MoreVertical size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
