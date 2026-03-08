'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Briefcase, 
  AlertCircle, 
  CheckCircle2, 
  Clock,
  Edit,
  Trash2,
  MessageCircle
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialCases = [
  { id: 1, number: '0000001-12.2023.8.26.0100', client: 'João Silva', type: 'Cível', priority: 'Alta', status: 'Ativo', value: 'R$ 50.000,00' },
  { id: 2, number: '0000002-34.2023.5.03.0075', client: 'Maria Santos', type: 'Trabalhista', priority: 'Média', status: 'Pendente', value: 'R$ 25.000,00' },
  { id: 3, number: '0000003-56.2023.8.26.0100', client: 'Empresa ABC Ltda', type: 'Tributário', priority: 'Baixa', status: 'Ativo', value: 'R$ 100.000,00' },
  { id: 4, number: '0000004-78.2023.8.26.0100', client: 'Ricardo Oliveira', type: 'Criminal', priority: 'Alta', status: 'Concluído', value: 'R$ 0,00' },
];

export function Cases() {
  const [searchTerm, setSearchTerm] = useState('');
  const [cases, setCases] = useState(initialCases);

  const filteredCases = cases.filter(c => 
    c.number.includes(searchTerm) ||
    c.client.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Processos Jurídicos</h1>
          <p className="text-text-muted mt-1">Acompanhe o andamento de todos os casos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar processos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <Plus size={18} />
            Novo Processo
          </button>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Número</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Tipo</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Prioridade</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredCases.map((c) => (
                <tr key={c.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-white font-mono">{c.number}</div>
                    <div className="text-xs text-text-muted mt-0.5">{c.value}</div>
                  </td>
                  <td className="px-6 py-4 text-sm text-white font-medium">{c.client}</td>
                  <td className="px-6 py-4 text-sm text-text-muted">{c.type}</td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      c.priority === 'Alta' ? "bg-danger/10 text-danger border border-danger/20" : 
                      c.priority === 'Média' ? "bg-warning/10 text-warning border border-warning/20" : 
                      "bg-success/10 text-success border border-success/20"
                    )}>
                      {c.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {c.status === 'Ativo' && <Clock size={14} className="text-primary" />}
                      {c.status === 'Pendente' && <AlertCircle size={14} className="text-warning" />}
                      {c.status === 'Concluído' && <CheckCircle2 size={14} className="text-success" />}
                      <span className="text-sm text-white">{c.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 bg-whatsapp/10 text-whatsapp rounded-lg hover:bg-whatsapp hover:text-white transition-all">
                        <MessageCircle size={16} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-white transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
