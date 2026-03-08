import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Client = {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
  notes: string;
  status: 'Ativo' | 'Inativo' | 'Pendente';
  created_at: string;
};

export type Case = {
  id: string;
  number: string;
  client_id: string;
  type: string;
  priority: 'Baixa' | 'Média' | 'Alta';
  status: 'Ativo' | 'Pendente' | 'Concluído';
  value: number;
  description: string;
  created_at: string;
};

export type Event = {
  id: string;
  title: string;
  type: 'audiencia' | 'reuniao' | 'prazo' | 'julgamento' | 'pericia' | 'outro';
  case_id?: string;
  date: string;
  time: string;
  location: string;
  description: string;
  notify_whatsapp: boolean;
  created_at: string;
};

export type Transaction = {
  id: string;
  type: 'entrada' | 'saida';
  category: string;
  value: number;
  date: string;
  case_id?: string;
  client_id?: string;
  description: string;
  is_paid: boolean;
  created_at: string;
};
