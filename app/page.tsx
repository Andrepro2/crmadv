'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { Login } from '@/components/Login';
import { Dashboard } from '@/components/Dashboard';
import { Clients } from '@/components/Clients';
import { Cases } from '@/components/Cases';
import { Calendar } from '@/components/Calendar';
import { Documents } from '@/components/Documents';
import { Finance } from '@/components/Finance';
import { Admin } from '@/components/Admin';
import { motion, AnimatePresence } from 'motion/react';

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogin = (username: string) => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setActiveSection('dashboard');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-darker flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
      </div>
    );
  }

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-darker">
      <div className="bg-animation" />
      
      <Sidebar 
        activeSection={activeSection} 
        onSectionChange={setActiveSection} 
        onLogout={handleLogout}
      />

      <main className="lg:ml-72 p-6 md:p-10 min-h-screen relative z-10">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSection}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeSection === 'dashboard' && <Dashboard />}
            {activeSection === 'clients' && <Clients />}
            {activeSection === 'cases' && <Cases />}
            {activeSection === 'calendar' && <Calendar />}
            {activeSection === 'documents' && <Documents />}
            {activeSection === 'finance' && <Finance />}
            {activeSection === 'admin' && <Admin />}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Toast Notification Container (Global) */}
      <div id="toast-container" className="fixed bottom-8 right-8 z-[100] space-y-4" />
    </div>
  );
}
