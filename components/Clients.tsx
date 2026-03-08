'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  Mail, 
  Phone, 
  MessageCircle, 
  Edit, 
  Trash2,
  FileText
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialClients = [
  { id: 1, name: 'João Silva', email: 'joao@email.com', document: '123.456.789-00', phone: '5511987654321', status: 'Ativo', cases: 2 },
  { id: 2, name: 'Maria Santos', email: 'maria@email.com', document: '987.654.321-00', phone: '5511912345678', status: 'Ativo', cases: 1 },
  { id: 3, name: 'Empresa ABC Ltda', email: 'contato@abc.com', document: '12.345.678/0001-90', phone: '551133334444', status: 'Ativo', cases: 3 },
  { id: 4, name: 'Ricardo Oliveira', email: 'ricardo@email.com', document: '456.789.123-44', phone: '5511999998888', status: 'Pendente', cases: 0 },
];

export function Clients() {
  const [searchTerm, setSearchTerm] = useState('');
  const [clients, setClients] = useState(initialClients);

  const filteredClients = clients.filter(client => 
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.document.includes(searchTerm)
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gestão de Clientes</h1>
          <p className="text-text-muted mt-1">Gerencie sua base de contatos e clientes</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar clientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <Plus size={18} />
            Novo Cliente
          </button>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-white/5">
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Documento</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Contato</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Processos</th>
                <th className="px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredClients.map((client) => (
                <tr key={client.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center font-bold text-white text-sm">
                        {client.name.split(' ').map(n => n[0]).join('').substring(0, 2)}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{client.name}</div>
                        <div className="text-xs text-text-muted">{client.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-text-muted font-mono">{client.document}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button className="p-2 bg-whatsapp/10 text-whatsapp rounded-lg hover:bg-whatsapp hover:text-white transition-all">
                        <MessageCircle size={16} />
                      </button>
                      <button className="p-2 bg-primary/10 text-primary rounded-lg hover:bg-primary hover:text-white transition-all">
                        <Phone size={16} />
                      </button>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={cn(
                      "px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                      client.status === 'Ativo' ? "bg-success/10 text-success border border-success/20" : "bg-warning/10 text-warning border border-warning/20"
                    )}>
                      {client.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-sm text-white font-medium">
                      <FileText size={14} className="text-text-muted" />
                      {client.cases}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 text-text-muted hover:text-white transition-colors">
                        <Edit size={16} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-danger transition-colors">
                        <Trash2 size={16} />
                      </button>
                      <button className="p-2 text-text-muted hover:text-white transition-colors">
                        <MoreVertical size={16} />
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
