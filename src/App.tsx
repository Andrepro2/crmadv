import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { 
  Scale, 
  Users, 
  Briefcase, 
  Calendar as CalendarIcon, 
  FileText, 
  LineChart, 
  Settings, 
  LogOut, 
  Plus, 
  Search, 
  Bell,
  Shield,
  Fingerprint,
  ArrowUp,
  ArrowDown,
  Gavel,
  DollarSign,
  MessageCircle,
  MoreVertical,
  Edit,
  Trash2,
  Eye,
  Download,
  X,
  CheckCircle2,
  AlertCircle,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';
import { type Client, type Case, type Event, type Transaction, type Document } from './types';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

// --- Components ---

const StatCard = ({ title, value, icon: Icon, trend, colorClass }: any) => (
  <motion.div 
    whileHover={{ y: -5 }}
    className={`bg-card border border-white/5 rounded-2xl p-6 relative overflow-hidden group`}
  >
    <div className={`absolute top-0 left-0 w-full h-1 bg-linear-to-r ${colorClass}`} />
    <div className="flex justify-between items-start mb-4">
      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
        <Icon size={24} />
      </div>
      {trend && (
        <span className="text-xs px-2 py-1 rounded-full bg-success/20 text-success flex items-center gap-1">
          <ArrowUp size={12} /> {trend}
        </span>
      )}
    </div>
    <div className="text-3xl font-bold mb-1">{value}</div>
    <div className="text-text-muted text-sm">{title}</div>
  </motion.div>
);

const Modal = ({ isOpen, onClose, title, children, footer }: any) => (
  <AnimatePresence>
    {isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />
        <motion.div 
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          className="bg-card border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-hidden relative z-10 shadow-2xl flex flex-col"
        >
          <div className="p-6 border-b border-white/10 flex justify-between items-center shrink-0">
            <h2 className="text-xl font-bold">{title}</h2>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
              <X size={20} />
            </button>
          </div>
          <div className="p-6 overflow-y-auto flex-1">
            {children}
          </div>
          {footer && (
            <div className="p-6 border-t border-white/10 flex justify-end gap-3 shrink-0">
              {footer}
            </div>
          )}
        </motion.div>
      </div>
    )}
  </AnimatePresence>
);

// --- Main App ---

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeSection, setActiveSection] = useState('dashboard');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [loginData, setLoginData] = useState({ username: '', password: '' });
  const [loginError, setLoginError] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  
  // Data States
  const [clients, setClients] = useState<Client[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [userRole, setUserRole] = useState<'admin' | 'employee' | 'client'>('admin');
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  
  // Form States
  const [editingClient, setEditingClient] = useState<Partial<Client> | null>(null);
  const [editingCase, setEditingCase] = useState<Partial<Case> | null>(null);
  const [editingEvent, setEditingEvent] = useState<Partial<Event> | null>(null);
  const [editingTransaction, setEditingTransaction] = useState<Partial<Transaction> | null>(null);
  const [editingUser, setEditingUser] = useState<any | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  // Modal States
  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isCaseModalOpen, setIsCaseModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTransactionModalOpen, setIsTransactionModalOpen] = useState(false);
  const [isDocumentModalOpen, setIsDocumentModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const { data: clientsData } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      const { data: casesData } = await supabase.from('cases').select('*').order('created_at', { ascending: false });
      const { data: eventsData } = await supabase.from('events').select('*').order('date', { ascending: true });
      const { data: transactionsData } = await supabase.from('transactions').select('*').order('date', { ascending: false });
      const { data: documentsData } = await supabase.from('documentos').select('*').order('criado_em', { ascending: false });
      const { data: usersData } = await supabase.from('users_crm').select('*').order('created_at', { ascending: false });

      if (clientsData) setClients(clientsData);
      if (casesData) setCases(casesData);
      if (eventsData) setEvents(eventsData);
      
      // Normalizar transações para garantir que 'value' exista mesmo que o banco use 'amount'
      if (transactionsData) {
        const normalizedTransactions = transactionsData.map((t: any) => ({
          ...t,
          value: t.value !== undefined ? t.value : (t.amount !== undefined ? t.amount : 0)
        }));
        setTransactions(normalizedTransactions);
      }
      
      if (documentsData) {
        const normalizedDocuments = documentsData.map((d: any) => ({
          ...d,
          name: d.nome || d.name || 'Sem nome',
          url: d.URL || d.url || '',
          created_at: d.criado_em || d.created_at || new Date().toISOString()
        }));
        setDocuments(normalizedDocuments);
      }
      if (usersData) setUsers(usersData);
    } catch (error) {
      console.error('Error fetching data:', error);
      showToast('Erro ao carregar dados', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (isLoggedIn) {
      fetchData();
      // Anti-copy protection from original template
      const handleContextMenu = (e: MouseEvent) => e.preventDefault();
      const handleKeyDown = (e: KeyboardEvent) => {
        if (
          (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
          e.key === 'F12' ||
          (e.ctrlKey && (e.key === 'c' || e.key === 'C' || e.key === 'x' || e.key === 'X' || e.key === 's' || e.key === 'S' || e.key === 'u' || e.key === 'U'))
        ) {
          e.preventDefault();
        }
      };
      
      document.addEventListener('contextmenu', handleContextMenu);
      document.addEventListener('keydown', handleKeyDown);
      
      return () => {
        document.removeEventListener('contextmenu', handleContextMenu);
        document.removeEventListener('keydown', handleKeyDown);
      };
    }
  }, [isLoggedIn]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setIsLoading(true);
    
    try {
      // Fallback para o André (Admin) para garantir acesso inicial
      if (loginData.username === 'andre' && loginData.password === '123456') {
        setUserRole('admin');
        setIsLoggedIn(true);
        showToast('Bem-vindo, André! Acesso administrativo concedido.');
        return;
      }

      const { data, error } = await supabase
        .from('users_crm')
        .select('*')
        .eq('username', loginData.username)
        .eq('password', loginData.password)
        .single();

      if (data) {
        setUserRole(data.role);
        setIsLoggedIn(true);
        showToast(`Bem-vindo, ${data.name}!`);
      } else {
        setLoginError('Usuário ou senha incorretos');
      }
    } catch (err) {
      console.error(err);
      setLoginError('Erro ao realizar login. Verifique a tabela users_crm.');
    } finally {
      setIsLoading(false);
    }
  };

  const saveClient = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const clientData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      document: formData.get('document') as string,
      phone: formData.get('phone') as string,
      address: formData.get('address') as string,
      notes: formData.get('notes') as string,
      status: 'Ativo' as const,
    };

    try {
      if (editingClient) {
        await supabase.from('clients').update(clientData).eq('id', editingClient.id);
      } else {
        await supabase.from('clients').insert([clientData]);
      }
      
      showToast(editingClient ? 'Cliente atualizado com sucesso' : 'Cliente cadastrado com sucesso');
      setIsClientModalOpen(false);
      setEditingClient(null);
      fetchData();
    } catch (error) {
      showToast('Erro ao salvar cliente', 'error');
    }
  };

  const deleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      try {
        await supabase.from('clients').delete().eq('id', id);
        showToast('Cliente excluído');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir cliente', 'error');
      }
    }
  };

  const saveCase = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const caseData = {
      number: formData.get('number') as string,
      client_id: formData.get('client_id') as string,
      type: formData.get('type') as string,
      priority: formData.get('priority') as any,
      status: formData.get('status') as any,
      value: parseFloat(formData.get('value') as string) || 0,
      description: formData.get('description') as string,
    };

    try {
      if (editingCase) {
        await supabase.from('cases').update(caseData).eq('id', editingCase.id);
      } else {
        await supabase.from('cases').insert([caseData]);
      }
      
      showToast(editingCase ? 'Processo atualizado com sucesso' : 'Processo cadastrado com sucesso');
      setIsCaseModalOpen(false);
      setEditingCase(null);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Erro ao salvar processo', 'error');
    }
  };

  const deleteCase = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este processo?')) {
      try {
        await supabase.from('cases').delete().eq('id', id);
        showToast('Processo excluído');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir processo', 'error');
      }
    }
  };

  const saveEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const eventData = {
      title: formData.get('title') as string,
      date: formData.get('date') as string,
      time: formData.get('time') as string,
      type: formData.get('type') as string,
      description: formData.get('description') as string,
      case_id: formData.get('case_id') as string || null,
    };

    try {
      if (editingEvent) {
        await supabase.from('events').update(eventData).eq('id', editingEvent.id);
      } else {
        await supabase.from('events').insert([eventData]);
      }
      
      showToast(editingEvent ? 'Evento atualizado com sucesso' : 'Evento agendado com sucesso');
      setIsEventModalOpen(false);
      setEditingEvent(null);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Erro ao salvar evento', 'error');
    }
  };

  const deleteEvent = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este compromisso?')) {
      try {
        await supabase.from('events').delete().eq('id', id);
        showToast('Compromisso excluído');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir compromisso', 'error');
      }
    }
  };

  const saveTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const transactionData = {
      description: formData.get('description') as string,
      value: parseFloat(formData.get('value') as string) || 0,
      type: formData.get('type') as any,
      date: formData.get('date') as string,
      category: formData.get('category') as string,
      case_id: formData.get('case_id') as string || null,
      paid: true
    };

    try {
      if (editingTransaction) {
        await supabase.from('transactions').update(transactionData).eq('id', editingTransaction.id);
      } else {
        await supabase.from('transactions').insert([transactionData]);
      }
      
      showToast(editingTransaction ? 'Transação atualizada' : 'Transação registrada');
      setIsTransactionModalOpen(false);
      setEditingTransaction(null);
      fetchData();
    } catch (error) {
      console.error(error);
      showToast('Erro ao salvar transação', 'error');
    }
  };

  const deleteTransaction = async (id: string) => {
    if (confirm('Deseja excluir esta transação?')) {
      try {
        await supabase.from('transactions').delete().eq('id', id);
        showToast('Transação excluída');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir transação', 'error');
      }
    }
  };

  const uploadDocument = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const file = formData.get('file') as File;
    const case_id = formData.get('case_id') as string;
    const client_id = formData.get('client_id') as string;

    if (!file || file.size === 0) {
      showToast('Selecione um arquivo', 'error');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Supabase Storage
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documentos')
        .upload(filePath, file);

      if (uploadError) {
        console.error('Erro no Storage:', uploadError);
        throw new Error(`Erro no Armazenamento (Storage): ${uploadError.message}. Verifique se o bucket "documentos" existe e é público.`);
      }

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('documentos')
        .getPublicUrl(filePath);

      // 3. Save Metadata to Database
      const docData: any = {
        nome: file.name,
        URL: publicUrl,
        case_id: case_id || null,
        client_id: client_id || null,
      };

      // Tenta inserir na tabela 'documentos'
      const { error: insertError } = await supabase.from('documentos').insert([docData]);
      
      if (insertError) {
        console.error('Erro no Banco de Dados:', insertError);
        throw new Error(`Erro no Banco de Dados: ${insertError.message}. Verifique se a tabela "documentos" existe.`);
      }
      
      showToast('Documento enviado com sucesso');
      setIsDocumentModalOpen(false);
      fetchData();
    } catch (error: any) {
      console.error(error);
      const message = error.message || 'Erro desconhecido';
      showToast(`Erro ao enviar: ${message}. Verifique se a tabela "documentos" e o bucket "documentos" existem no Supabase.`, 'error');
    } finally {
      setIsUploading(false);
    }
  };

  const deleteDocument = async (id: string) => {
    if (confirm('Deseja excluir este documento?')) {
      try {
        // Find document to get URL
        const doc = documents.find(d => d.id === id);
        if (doc && doc.url) {
          const fileName = doc.url.split('/').pop();
          if (fileName) {
            await supabase.storage.from('documentos').remove([fileName]);
          }
        }
        await supabase.from('documentos').delete().eq('id', id);
        showToast('Documento excluído');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir documento', 'error');
      }
    }
  };

  const saveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);
    const userData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      username: formData.get('username') as string,
      role: formData.get('role') as any,
      password: formData.get('password') as string || '123456',
    };

    try {
      if (editingUser) {
        await supabase.from('users_crm').update(userData).eq('id', editingUser.id);
      } else {
        await supabase.from('users_crm').insert([userData]);
      }
      
      showToast(editingUser ? 'Usuário atualizado' : 'Usuário cadastrado');
      setIsUserModalOpen(false);
      setEditingUser(null);
      fetchData();
    } catch (error) {
      showToast('Erro ao salvar usuário', 'error');
    }
  };

  const deleteUser = async (id: string) => {
    if (confirm('Deseja excluir este usuário?')) {
      try {
        await supabase.from('users_crm').delete().eq('id', id);
        showToast('Usuário excluído');
        fetchData();
      } catch (error) {
        showToast('Erro ao excluir usuário', 'error');
      }
    }
  };

  const simulateBiometric = () => {
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setIsLoggedIn(true);
    }, 1500);
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="bg-animation" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card p-8 w-full max-w-md"
        >
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-linear-to-br from-primary to-indigo-700 text-white mb-4">
              <Scale size={32} />
            </div>
            <h1 className="text-3xl font-bold bg-linear-to-r from-white to-text-muted bg-clip-text text-transparent">LexPro CRM</h1>
            <p className="text-text-muted mt-2">Sistema Jurídico Integrado</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Usuário</label>
              <input 
                type="text" 
                className="input-field" 
                placeholder="andre"
                value={loginData.username}
                onChange={(e) => setLoginData({...loginData, username: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-text-muted">Senha</label>
              <input 
                type="password" 
                className="input-field" 
                placeholder="••••••••"
                value={loginData.password}
                onChange={(e) => setLoginData({...loginData, password: e.target.value})}
              />
            </div>

            <div className="flex flex-col items-center justify-center py-6">
              <motion.button
                type="button"
                onClick={simulateBiometric}
                animate={isScanning ? { scale: [1, 1.1, 1] } : {}}
                transition={{ repeat: Infinity, duration: 1.5 }}
                className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-all ${isScanning ? 'border-primary bg-primary/20 shadow-[0_0_40px_rgba(99,102,241,0.6)]' : 'border-primary/30 bg-primary/5 hover:border-primary hover:bg-primary/10 shadow-lg'}`}
              >
                <Fingerprint size={40} className="text-primary" />
              </motion.button>
              <p className="text-xs text-text-muted mt-3 font-medium">Toque para login biométrico</p>
            </div>

            <button type="submit" className="btn-primary w-full flex items-center justify-center gap-2">
              Acessar Sistema
            </button>

            {loginError && (
              <motion.p 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                className="text-danger text-center text-sm flex items-center justify-center gap-1"
              >
                <AlertCircle size={14} /> {loginError}
              </motion.p>
            )}
          </form>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <div className="bg-animation" />
      
      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-72 bg-card/95 backdrop-blur-xl border-r border-white/5 transition-transform duration-300 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="p-8 flex items-center gap-3 border-b border-white/5">
          <Scale className="text-primary" size={32} />
          <h2 className="text-2xl font-bold">LexPro</h2>
        </div>

        <nav className="p-4 space-y-2">
          {[
            { id: 'dashboard', icon: LineChart, label: 'Dashboard', roles: ['admin', 'employee'] },
            { id: 'clients', icon: Users, label: 'Clientes', roles: ['admin', 'employee'] },
            { id: 'cases', icon: Briefcase, label: 'Processos', roles: ['admin', 'employee', 'client'] },
            { id: 'calendar', icon: CalendarIcon, label: 'Agenda', roles: ['admin', 'employee'] },
            { id: 'documents', icon: FileText, label: 'Documentos', roles: ['admin', 'employee', 'client'] },
            { id: 'finance', icon: DollarSign, label: 'Financeiro', roles: ['admin'] },
            { id: 'users', icon: Users, label: 'Usuários', roles: ['admin'] },
            { id: 'admin', icon: Shield, label: 'Administração', badge: 'ADM', roles: ['admin'] },
          ].filter(item => item.roles.includes(userRole)).map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${activeSection === item.id ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-text-muted hover:bg-white/5 hover:text-text'}`}
            >
              <item.icon size={20} />
              <span className="flex-1 text-left">{item.label}</span>
              {item.badge && <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded-full">{item.badge}</span>}
            </button>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-white/5">
          <div className="flex items-center gap-3 p-3 bg-dark/50 rounded-xl mb-4">
            <div className="w-10 h-10 rounded-full bg-linear-to-br from-secondary to-pink-600 flex items-center justify-center font-bold">AD</div>
            <div>
              <div className="text-sm font-bold">André Dias</div>
              <div className="text-xs text-text-muted">Administrador</div>
            </div>
          </div>
          <button onClick={() => setIsLoggedIn(false)} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 transition-all">
            <LogOut size={18} /> Sair
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 lg:p-12 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-3xl lg:text-4xl font-bold capitalize">{activeSection}</h1>
            <p className="text-text-muted mt-1">Bem-vindo de volta, André</p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <span className="hidden md:flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold">
              <Shield size={14} /> Modo Administrador
            </span>
            <button 
              onClick={() => {
                setEditingClient(null);
                setIsClientModalOpen(true);
              }} 
              className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
            >
              <Plus size={20} /> Novo Cliente
            </button>
          </div>
        </header>

        {activeSection === 'dashboard' && (
          <div className="space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total de Clientes" value={clients.length} icon={Users} trend="12%" colorClass="from-primary to-indigo-600" />
              <StatCard title="Processos Ativos" value={cases.length} icon={Briefcase} trend="8%" colorClass="from-secondary to-pink-600" />
              <StatCard title="Casos Concluídos" value="156" icon={Gavel} trend="95%" colorClass="from-accent to-cyan-600" />
              <StatCard title="Receita Mensal" value="R$ 89K" icon={DollarSign} trend="23%" colorClass="from-success to-emerald-600" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-bold">Desempenho Mensal</h3>
                  <select className="bg-dark border border-white/10 rounded-lg px-3 py-1 text-sm">
                    <option>Março 2026</option>
                  </select>
                </div>
                <div className="h-[300px]">
                  <Bar 
                    data={{
                      labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
                      datasets: [
                        { label: 'Receitas', data: [15000, 22000, 18000, 25000], backgroundColor: '#10b981', borderRadius: 8 },
                        { label: 'Despesas', data: [8000, 12000, 10000, 6500], backgroundColor: '#ef4444', borderRadius: 8 }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#94a3b8' } },
                        x: { grid: { display: false }, ticks: { color: '#94a3b8' } }
                      }
                    }}
                  />
                </div>
              </div>

              <div className="glass-card p-8">
                <h3 className="text-xl font-bold mb-8">Próximos Eventos</h3>
                <div className="space-y-6">
                  {[
                    { title: 'Audiência Conciliação', time: '14:00', date: '08 Mar', type: 'audiencia' },
                    { title: 'Reunião Cliente', time: '10:00', date: '10 Mar', type: 'reuniao' },
                    { title: 'Prazo Manifestação', time: '23:59', date: '12 Mar', type: 'prazo' },
                  ].map((event, i) => (
                    <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border-l-4 border-primary hover:translate-x-2 transition-transform cursor-pointer">
                      <div className="text-center min-w-[50px]">
                        <div className="text-xl font-bold text-primary">{event.date.split(' ')[0]}</div>
                        <div className="text-[10px] uppercase text-text-muted">{event.date.split(' ')[1]}</div>
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-sm">{event.title}</div>
                        <div className="text-xs text-text-muted">{event.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 glass-card p-8">
                <h3 className="text-xl font-bold mb-6">Processos Recentes</h3>
                <div className="space-y-4">
                  {cases.slice(0, 5).map((c) => (
                    <div key={c.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-colors group">
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${c.priority === 'Alta' ? 'bg-danger/20 text-danger' : 'bg-primary/20 text-primary'}`}>
                          <Briefcase size={20} />
                        </div>
                        <div>
                          <div className="font-bold text-sm lg:text-base">{c.number}</div>
                          <div className="text-xs text-text-muted">{c.type}</div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-sm">R$ {c.value.toLocaleString('pt-BR')}</div>
                        <div className="text-[10px] uppercase text-text-muted">{c.status}</div>
                      </div>
                    </div>
                  ))}
                  {cases.length === 0 && <div className="text-center py-4 text-text-muted">Nenhum processo cadastrado.</div>}
                </div>
              </div>

              <div className="glass-card p-8">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold">Documentos Recentes</h3>
                  <button onClick={() => setActiveSection('documents')} className="text-xs text-primary hover:underline">Ver todos</button>
                </div>
                <div className="space-y-4">
                  {documents.slice(0, 5).map((doc) => (
                    <div key={doc.id} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
                        <FileText size={16} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-xs truncate" title={doc.name}>{doc.name}</div>
                        <div className="text-[10px] text-text-muted">
                          {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : 'Data n/a'}
                        </div>
                      </div>
                      <a href={doc.url} target="_blank" rel="noopener noreferrer" className="p-1.5 hover:bg-primary/20 text-primary rounded-lg opacity-0 group-hover:opacity-100 transition-opacity">
                        <Eye size={14} />
                      </a>
                    </div>
                  ))}
                  {documents.length === 0 && <div className="text-center py-4 text-text-muted text-xs">Nenhum documento enviado.</div>}
                </div>
              </div>
            </div>
          </div>
        )}

        {activeSection === 'clients' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input type="text" placeholder="Buscar clientes..." className="input-field pl-12" />
              </div>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Documento</th>
                    <th className="px-6 py-4">Telefone</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {clients.map((client) => (
                    <tr key={client.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/20 text-primary flex items-center justify-center font-bold shrink-0">
                            {client.name.substring(0, 2).toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <div className="font-bold truncate">{client.name}</div>
                            <div className="text-xs text-text-muted truncate">{client.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{client.document}</td>
                      <td className="px-6 py-4 text-sm whitespace-nowrap">{client.phone}</td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full bg-success/20 text-success text-[10px] font-bold uppercase">
                          {client.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button className="p-2 hover:bg-whatsapp/20 text-whatsapp rounded-lg transition-colors">
                            <MessageCircle size={18} />
                          </button>
                          <button 
                            onClick={() => {
                              setEditingClient(client);
                              setIsClientModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteClient(client.id)}
                            className="p-2 hover:bg-danger/20 text-danger rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'cases' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
                <input type="text" placeholder="Buscar processos..." className="input-field pl-12" />
              </div>
              <button 
                onClick={() => {
                  setEditingCase(null);
                  setIsCaseModalOpen(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} /> Novo Processo
              </button>
            </div>

            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Número</th>
                    <th className="px-6 py-4">Cliente</th>
                    <th className="px-6 py-4">Tipo</th>
                    <th className="px-6 py-4">Prioridade</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {cases.map((c) => {
                    const client = clients.find(cl => cl.id === c.client_id);
                    return (
                      <tr key={c.id} className="hover:bg-white/5 transition-colors">
                        <td className="px-6 py-4 font-bold text-sm whitespace-nowrap">{c.number}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">{client?.name || 'N/A'}</td>
                        <td className="px-6 py-4 text-sm whitespace-nowrap">{c.type}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            c.priority === 'Alta' ? 'bg-danger/20 text-danger' : 
                            c.priority === 'Média' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                          }`}>
                            {c.priority}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                            c.status === 'Ativo' ? 'bg-primary/20 text-primary' : 
                            c.status === 'Pendente' ? 'bg-warning/20 text-warning' : 'bg-success/20 text-success'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button className="p-2 hover:bg-whatsapp/20 text-whatsapp rounded-lg transition-colors">
                              <MessageCircle size={18} />
                            </button>
                            <button 
                              onClick={() => {
                                setEditingCase(c);
                                setIsCaseModalOpen(true);
                              }}
                              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                            >
                              <Edit size={18} />
                            </button>
                            <button 
                              onClick={() => deleteCase(c.id)}
                              className="p-2 hover:bg-danger/20 text-danger rounded-lg transition-colors"
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'calendar' && (
          <div className="space-y-8">
            <div className="flex justify-end">
              <button 
                onClick={() => {
                  setEditingEvent(null);
                  setIsEventModalOpen(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} /> Novo Compromisso
              </button>
            </div>
            <div className="glass-card p-8">
              <FullCalendar
                plugins={[dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="pt-br"
                headerToolbar={{
                  left: 'prev,next today',
                  center: 'title',
                  right: 'dayGridMonth,timeGridWeek,listWeek'
                }}
                events={events.map(e => ({
                  id: e.id,
                  title: e.title,
                  start: `${e.date}T${e.time}`,
                  color: e.type === 'audiencia' ? '#ef4444' : e.type === 'prazo' ? '#f59e0b' : '#6366f1',
                  extendedProps: { ...e }
                }))}
                eventClick={(info) => {
                  setEditingEvent(info.event.extendedProps as Event);
                  setIsEventModalOpen(true);
                }}
                height="auto"
              />
            </div>
          </div>
        )}

        {activeSection === 'finance' && (
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
              <h2 className="text-2xl font-bold">Financeiro</h2>
              <button 
                onClick={() => {
                  setEditingTransaction(null);
                  setIsTransactionModalOpen(true);
                }}
                className="btn-primary flex items-center gap-2 w-full md:w-auto justify-center"
              >
                <Plus size={20} /> Nova Transação
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="glass-card p-6 border-t-4 border-success">
                <div className="text-text-muted text-sm mb-2">Total Receitas</div>
                <div className="text-3xl font-bold text-success">
                  R$ {transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + (t.value || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="glass-card p-6 border-t-4 border-danger">
                <div className="text-text-muted text-sm mb-2">Total Despesas</div>
                <div className="text-3xl font-bold text-danger">
                  R$ {transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + (t.value || 0), 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="glass-card p-6 border-t-4 border-primary">
                <div className="text-text-muted text-sm mb-2">Saldo Geral</div>
                <div className="text-3xl font-bold text-primary">
                  R$ {(transactions.filter(t => t.type === 'entrada').reduce((acc, t) => acc + (t.value || 0), 0) - 
                       transactions.filter(t => t.type === 'saida').reduce((acc, t) => acc + (t.value || 0), 0)).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </div>
              </div>
            </div>
            <div className="glass-card p-4 lg:p-8">
              <h3 className="text-xl font-bold mb-6">Últimas Transações</h3>
              <div className="space-y-4">
                {transactions.map((t) => (
                  <div key={t.id} className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white/5 rounded-xl hover:bg-white/10 transition-colors group gap-4">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${t.type === 'entrada' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'}`}>
                        {t.type === 'entrada' ? <ArrowDown size={18} /> : <ArrowUp size={18} />}
                      </div>
                      <div>
                        <div className="font-bold text-sm lg:text-base">{t.description}</div>
                        <div className="text-xs text-text-muted">
                          {t.date ? new Date(t.date).toLocaleDateString('pt-BR') : 'Data n/a'} • {t.category}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between w-full sm:w-auto gap-6">
                      <div className={`font-bold ${t.type === 'entrada' ? 'text-success' : 'text-danger'}`}>
                        {t.type === 'entrada' ? '+' : '-'} R$ {(t.value || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </div>
                      <div className="flex gap-2 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={() => {
                            setEditingTransaction(t);
                            setIsTransactionModalOpen(true);
                          }}
                          className="p-2 hover:bg-white/10 rounded"
                        >
                          <Edit size={16} />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(t.id)}
                          className="p-2 hover:bg-danger/20 text-danger rounded"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeSection === 'users' && userRole === 'admin' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestão de Usuários</h2>
              <button 
                onClick={() => {
                  setEditingUser(null);
                  setIsUserModalOpen(true);
                }}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} /> Novo Usuário
              </button>
            </div>
            <div className="glass-card overflow-x-auto">
              <table className="w-full text-left min-w-[800px]">
                <thead>
                  <tr className="bg-white/5 text-text-muted text-xs uppercase tracking-wider">
                    <th className="px-6 py-4">Usuário</th>
                    <th className="px-6 py-4">Username</th>
                    <th className="px-6 py-4">Nível de Acesso</th>
                    <th className="px-6 py-4">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="font-bold">{u.name}</div>
                        <div className="text-xs text-text-muted">{u.email}</div>
                      </td>
                      <td className="px-6 py-4 text-sm">{u.username}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                          u.role === 'admin' ? 'bg-primary/20 text-primary' : 
                          u.role === 'employee' ? 'bg-success/20 text-success' : 'bg-warning/20 text-warning'
                        }`}>
                          {u.role === 'admin' ? 'Administrador' : u.role === 'employee' ? 'Funcionário' : 'Cliente'}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          <button 
                            onClick={() => {
                              setEditingUser(u);
                              setIsUserModalOpen(true);
                            }}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                          >
                            <Edit size={18} />
                          </button>
                          <button 
                            onClick={() => deleteUser(u.id)}
                            className="p-2 hover:bg-danger/20 text-danger rounded-lg transition-colors"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="space-y-8">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Documentos</h2>
              <button 
                onClick={() => setIsDocumentModalOpen(true)}
                className="btn-primary flex items-center gap-2"
              >
                <Plus size={20} /> Novo Documento
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div key={doc.id} className="glass-card p-6 flex flex-col gap-4 group relative">
                  <button 
                    onClick={() => deleteDocument(doc.id)}
                    className="absolute top-4 right-4 p-2 hover:bg-danger/20 text-danger rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <FileText size={24} />
                  </div>
                  <div>
                    <div className="font-bold truncate pr-8" title={doc.name}>{doc.name}</div>
                    <div className="text-xs text-text-muted">
                      {doc.created_at ? new Date(doc.created_at).toLocaleDateString('pt-BR') : 'Data n/a'}
                    </div>
                  </div>
                  <div className="flex gap-2 mt-auto">
                    <a 
                      href={doc.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Eye size={14} /> Ver
                    </a>
                    <a 
                      href={doc.url} 
                      download={doc.name}
                      className="flex-1 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors flex items-center justify-center gap-2"
                    >
                      <Download size={14} /> Baixar
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Modals */}
      <Modal 
        isOpen={isClientModalOpen} 
        onClose={() => setIsClientModalOpen(false)} 
        title={editingClient ? "Editar Cliente" : "Novo Cliente"}
        footer={
          <>
            <button onClick={() => setIsClientModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="clientForm" type="submit" className="btn-primary">Salvar Cliente</button>
          </>
        }
      >
        <form id="clientForm" onSubmit={saveClient} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Nome Completo *</label>
            <input name="name" type="text" required className="input-field" placeholder="Nome do cliente" defaultValue={editingClient?.name} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Email *</label>
            <input name="email" type="email" required className="input-field" placeholder="email@exemplo.com" defaultValue={editingClient?.email} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">CPF/CNPJ</label>
            <input name="document" type="text" className="input-field" placeholder="000.000.000-00" defaultValue={editingClient?.document} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Telefone *</label>
            <input name="phone" type="text" required className="input-field" placeholder="(00) 00000-0000" defaultValue={editingClient?.phone} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Endereço</label>
            <input name="address" type="text" className="input-field" placeholder="Rua, número, bairro..." defaultValue={editingClient?.address} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Observações</label>
            <textarea name="notes" className="input-field min-h-[100px]" placeholder="Informações adicionais..." defaultValue={editingClient?.notes}></textarea>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isCaseModalOpen} 
        onClose={() => setIsCaseModalOpen(false)} 
        title={editingCase ? "Editar Processo" : "Novo Processo"}
        footer={
          <>
            <button onClick={() => setIsCaseModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="caseForm" type="submit" className="btn-primary">Salvar Processo</button>
          </>
        }
      >
        <form id="caseForm" onSubmit={saveCase} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Número do Processo *</label>
            <input name="number" type="text" required className="input-field" placeholder="0000000-00.0000.0.00.0000" defaultValue={editingCase?.number} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Cliente *</label>
            <select name="client_id" required className="input-field" defaultValue={editingCase?.client_id}>
              <option value="">Selecione um cliente</option>
              {clients.map(client => (
                <option key={client.id} value={client.id}>{client.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Tipo de Ação *</label>
            <select name="type" required className="input-field" defaultValue={editingCase?.type}>
              <option value="">Selecione</option>
              <option value="Cível">Cível</option>
              <option value="Trabalhista">Trabalhista</option>
              <option value="Família">Família</option>
              <option value="Criminal">Criminal</option>
              <option value="Tributário">Tributário</option>
              <option value="Consumidor">Consumidor</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Prioridade</label>
            <select name="priority" className="input-field" defaultValue={editingCase?.priority || 'Média'}>
              <option value="Baixa">Baixa</option>
              <option value="Média">Média</option>
              <option value="Alta">Alta</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Status</label>
            <select name="status" className="input-field" defaultValue={editingCase?.status || 'Ativo'}>
              <option value="Ativo">Ativo</option>
              <option value="Pendente">Pendente</option>
              <option value="Concluído">Concluído</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Valor da Causa</label>
            <input name="value" type="number" step="0.01" className="input-field" placeholder="0.00" defaultValue={editingCase?.value} />
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Descrição</label>
            <textarea name="description" className="input-field min-h-[100px]" placeholder="Descrição detalhada do caso..." defaultValue={editingCase?.description}></textarea>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isEventModalOpen} 
        onClose={() => setIsEventModalOpen(false)} 
        title={editingEvent ? "Editar Compromisso" : "Novo Compromisso"}
        footer={
          <>
            {editingEvent && (
              <button 
                onClick={() => deleteEvent(editingEvent.id)} 
                className="px-6 py-2 rounded-xl bg-danger/10 text-danger hover:bg-danger/20 mr-auto"
              >
                Excluir
              </button>
            )}
            <button onClick={() => setIsEventModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="eventForm" type="submit" className="btn-primary">Salvar</button>
          </>
        }
      >
        <form id="eventForm" onSubmit={saveEvent} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Título *</label>
            <input name="title" type="text" required className="input-field" placeholder="Ex: Audiência de Instrução" defaultValue={editingEvent?.title} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Data *</label>
            <input name="date" type="date" required className="input-field" defaultValue={editingEvent?.date} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Hora *</label>
            <input name="time" type="time" required className="input-field" defaultValue={editingEvent?.time} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Tipo *</label>
            <select name="type" required className="input-field" defaultValue={editingEvent?.type}>
              <option value="reuniao">Reunião</option>
              <option value="audiencia">Audiência</option>
              <option value="prazo">Prazo</option>
              <option value="outro">Outro</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Processo Relacionado</label>
            <select name="case_id" className="input-field" defaultValue={editingEvent?.case_id || ''}>
              <option value="">Nenhum</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.number}</option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Descrição</label>
            <textarea name="description" className="input-field min-h-[100px]" placeholder="Detalhes do compromisso..." defaultValue={editingEvent?.description}></textarea>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isTransactionModalOpen} 
        onClose={() => setIsTransactionModalOpen(false)} 
        title={editingTransaction ? "Editar Transação" : "Nova Transação"}
        footer={
          <>
            <button onClick={() => setIsTransactionModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="transactionForm" type="submit" className="btn-primary">Salvar</button>
          </>
        }
      >
        <form id="transactionForm" onSubmit={saveTransaction} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Descrição *</label>
            <input name="description" type="text" required className="input-field" placeholder="Ex: Honorários Processo X" defaultValue={editingTransaction?.description} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Valor (R$) *</label>
            <input name="value" type="number" step="0.01" required className="input-field" placeholder="0.00" defaultValue={editingTransaction?.value} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Tipo *</label>
            <select name="type" required className="input-field" defaultValue={editingTransaction?.type}>
              <option value="entrada">Receita (Entrada)</option>
              <option value="saida">Despesa (Saída)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Data *</label>
            <input name="date" type="date" required className="input-field" defaultValue={editingTransaction?.date || new Date().toISOString().split('T')[0]} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Categoria</label>
            <select name="category" className="input-field" defaultValue={editingTransaction?.category}>
              <option value="Honorários">Honorários</option>
              <option value="Custas">Custas</option>
              <option value="Aluguel">Aluguel</option>
              <option value="Salários">Salários</option>
              <option value="Impostos">Impostos</option>
              <option value="Outros">Outros</option>
            </select>
          </div>
          <div className="md:col-span-2 space-y-2">
            <label className="text-xs text-text-muted">Processo Relacionado</label>
            <select name="case_id" className="input-field" defaultValue={editingTransaction?.case_id || ''}>
              <option value="">Nenhum</option>
              {cases.map(c => (
                <option key={c.id} value={c.id}>{c.number}</option>
              ))}
            </select>
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isUserModalOpen} 
        onClose={() => setIsUserModalOpen(false)} 
        title={editingUser ? "Editar Usuário" : "Novo Usuário"}
        footer={
          <>
            <button onClick={() => setIsUserModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="userForm" type="submit" className="btn-primary">Salvar Usuário</button>
          </>
        }
      >
        <form id="userForm" onSubmit={saveUser} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Nome Completo *</label>
            <input name="name" type="text" required className="input-field" defaultValue={editingUser?.name} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Email *</label>
            <input name="email" type="email" required className="input-field" defaultValue={editingUser?.email} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Username *</label>
            <input name="username" type="text" required className="input-field" defaultValue={editingUser?.username} />
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Nível de Acesso *</label>
            <select name="role" required className="input-field" defaultValue={editingUser?.role || 'employee'}>
              <option value="admin">Administrador Geral</option>
              <option value="employee">Funcionário do Escritório</option>
              <option value="client">Cliente (Acompanhamento)</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Senha {editingUser ? '(Deixe em branco para manter)' : '*'}</label>
            <input name="password" type="password" required={!editingUser} className="input-field" placeholder="••••••••" />
          </div>
        </form>
      </Modal>

      <Modal 
        isOpen={isDocumentModalOpen} 
        onClose={() => setIsDocumentModalOpen(false)} 
        title="Novo Documento"
        footer={
          <>
            <button onClick={() => setIsDocumentModalOpen(false)} className="px-6 py-2 rounded-xl border border-white/10 hover:bg-white/5">Cancelar</button>
            <button form="docForm" type="submit" disabled={isUploading} className="btn-primary flex items-center gap-2">
              {isUploading ? 'Enviando...' : 'Enviar Arquivo'}
            </button>
          </>
        }
      >
        <form id="docForm" onSubmit={uploadDocument} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs text-text-muted">Arquivo *</label>
            <input name="file" type="file" required className="input-field" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs text-text-muted">Cliente (Opcional)</label>
              <select name="client_id" className="input-field">
                <option value="">Nenhum</option>
                {clients.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs text-text-muted">Processo (Opcional)</label>
              <select name="case_id" className="input-field">
                <option value="">Nenhum</option>
                {cases.map(c => (
                  <option key={c.id} value={c.id}>{c.number}</option>
                ))}
              </select>
            </div>
          </div>
        </form>
      </Modal>

      {/* Mobile Toggle */}
      <button 
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="lg:hidden fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-primary text-white shadow-2xl flex items-center justify-center"
      >
        <Menu size={24} />
      </button>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: 50, x: '-50%' }}
            className={`fixed bottom-8 left-1/2 z-50 px-6 py-3 rounded-2xl shadow-2xl flex items-center gap-3 border ${toast.type === 'success' ? 'bg-success/10 border-success/20 text-success' : 'bg-danger/10 border-danger/20 text-danger'}`}
          >
            {toast.type === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold">{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
