'use client';

import React, { useState } from 'react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  FileText, 
  Download, 
  Eye, 
  Trash2, 
  Upload,
  FileCode,
  FileImage,
  FileSpreadsheet,
  File as FileIcon
} from 'lucide-react';
import { motion } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const initialDocs = [
  { id: 1, name: 'Contrato de Honorários - João Silva', type: 'contract', format: 'pdf', size: '2.5 MB', date: '2026-02-15', client: 'João Silva' },
  { id: 2, name: 'Petição Inicial', type: 'petition', format: 'pdf', size: '1.2 MB', date: '2026-02-10', client: 'João Silva' },
  { id: 3, name: 'Procuração', type: 'power', format: 'pdf', size: '0.8 MB', date: '2026-02-20', client: 'Maria Santos' },
  { id: 4, name: 'Comprovante de Pagamento', type: 'receipt', format: 'pdf', size: '0.5 MB', date: '2026-02-25', client: 'Empresa ABC Ltda' },
  { id: 5, name: 'Planilha de Custas', type: 'other', format: 'xls', size: '1.5 MB', date: '2026-03-01', client: 'Empresa ABC Ltda' },
];

const filters = [
  { id: 'all', label: 'Todos' },
  { id: 'pdf', label: 'PDFs' },
  { id: 'doc', label: 'Documentos' },
  { id: 'img', label: 'Imagens' },
  { id: 'contract', label: 'Contratos' },
  { id: 'petition', label: 'Petições' },
];

export function Documents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [docs, setDocs] = useState(initialDocs);

  const filteredDocs = docs.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         doc.client.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = activeFilter === 'all' || doc.format === activeFilter || doc.type === activeFilter;
    return matchesSearch && matchesFilter;
  });

  const getIcon = (format: string) => {
    switch (format) {
      case 'pdf': return <FileText size={28} className="text-danger" />;
      case 'doc': return <FileCode size={28} className="text-primary" />;
      case 'xls': return <FileSpreadsheet size={28} className="text-success" />;
      case 'img': return <FileImage size={28} className="text-warning" />;
      default: return <FileIcon size={28} className="text-text-muted" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white">Gerenciamento de Documentos</h1>
          <p className="text-text-muted mt-1">Organize e acesse seus arquivos jurídicos</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex-1 md:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-white focus:outline-none focus:border-primary transition-all"
            />
          </div>
          <button className="bg-primary text-white px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 hover:shadow-glow transition-all whitespace-nowrap">
            <Upload size={18} />
            Upload
          </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.id}
            onClick={() => setActiveFilter(filter.id)}
            className={cn(
              "px-4 py-2 rounded-full text-xs font-bold transition-all border",
              activeFilter === filter.id 
                ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" 
                : "bg-white/5 text-text-muted border-white/10 hover:bg-white/10 hover:text-white"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredDocs.map((doc) => (
          <motion.div
            key={doc.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border border-white/5 rounded-2xl p-5 relative overflow-hidden group hover:border-primary/30 transition-all"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-primary to-primary-dark opacity-50" />
            <div className="flex items-start justify-between mb-4">
              <div className="p-3 bg-white/5 rounded-xl">
                {getIcon(doc.format)}
              </div>
              <div className="flex items-center gap-1">
                <button className="p-2 text-text-muted hover:text-white transition-colors">
                  <Eye size={16} />
                </button>
                <button className="p-2 text-text-muted hover:text-white transition-colors">
                  <Download size={16} />
                </button>
              </div>
            </div>
            <h4 className="text-sm font-bold text-white mb-1 truncate">{doc.name}</h4>
            <p className="text-xs text-text-muted mb-4 flex items-center gap-1">
              <Plus size={10} className="text-primary" />
              {doc.client}
            </p>
            <div className="flex items-center justify-between text-[10px] font-bold text-text-muted uppercase tracking-wider">
              <span>{doc.size}</span>
              <span>{doc.date}</span>
            </div>
            <div className="mt-4 pt-4 border-t border-white/5 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity">
              <span className="text-[10px] font-bold text-primary uppercase tracking-wider bg-primary/10 px-2 py-0.5 rounded-full">
                {doc.type}
              </span>
              <button className="text-text-muted hover:text-danger transition-colors">
                <Trash2 size={14} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
