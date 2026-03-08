'use client';

import React, { useState } from 'react';
import { 
  Scale, 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  Calendar as CalendarIcon, 
  FileText, 
  TrendingUp, 
  Settings, 
  ShieldCheck,
  LogOut,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type NavItem = {
  id: string;
  label: string;
  icon: React.ElementType;
  isAdmin?: boolean;
};

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'clients', label: 'Clientes', icon: Users },
  { id: 'cases', label: 'Processos', icon: Briefcase },
  { id: 'calendar', label: 'Agenda', icon: CalendarIcon },
  { id: 'documents', label: 'Documentos', icon: FileText },
  { id: 'finance', label: 'Financeiro', icon: TrendingUp },
  { id: 'admin', label: 'Administração', icon: Settings, isAdmin: true },
];

interface SidebarProps {
  activeSection: string;
  onSectionChange: (id: string) => void;
  onLogout: () => void;
}

export function Sidebar({ activeSection, onSectionChange, onLogout }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-card border border-white/10 rounded-xl text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar Overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Content */}
      <aside className={cn(
        "fixed left-0 top-0 h-screen w-72 bg-card/95 backdrop-blur-xl border-r border-white/5 p-6 z-40 transition-transform duration-300 lg:translate-x-0",
        !isOpen && "-translate-x-full"
      )}>
        <div className="flex items-center gap-3 pb-8 border-b border-white/10 mb-8">
          <div className="p-2 bg-gradient-to-br from-primary to-primary-dark rounded-xl">
            <Scale className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-white to-text-muted bg-clip-text text-transparent">
            LexPro
          </h2>
        </div>

        <nav className="space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                onSectionChange(item.id);
                setIsOpen(false);
              }}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group",
                activeSection === item.id 
                  ? "bg-primary text-white shadow-lg shadow-primary/20" 
                  : "text-text-muted hover:bg-white/5 hover:text-white"
              )}
            >
              <item.icon size={20} className={cn(
                activeSection === item.id ? "text-white" : "text-text-muted group-hover:text-white"
              )} />
              <span className="font-medium">{item.label}</span>
              {item.isAdmin && (
                <div className="ml-auto flex items-center gap-1 px-2 py-0.5 bg-white/10 rounded-full text-[10px] font-bold text-primary border border-primary/30">
                  <ShieldCheck size={10} />
                  ADM
                </div>
              )}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-8 left-6 right-6 pt-6 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 bg-darker/50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-secondary to-danger flex items-center justify-center font-bold text-white">
              AD
            </div>
            <div className="overflow-hidden">
              <h4 className="text-sm font-semibold text-white truncate">André Dias</h4>
              <p className="text-xs text-text-muted">Administrador</p>
            </div>
          </div>
          <button 
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-danger/10 border border-danger/20 text-danger rounded-xl hover:bg-danger/20 transition-all font-semibold"
          >
            <LogOut size={18} />
            Sair
          </button>
        </div>
      </aside>
    </>
  );
}
