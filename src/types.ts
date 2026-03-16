export type Client = {
  id: string;
  name: string;
  email: string;
  document: string;
  phone: string;
  address: string;
  notes: string;
  username?: string;
  password?: string;
  status: 'Ativo' | 'Inativo';
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
  notify: boolean;
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
  paid: boolean;
  created_at: string;
};

export type User = {
  id: string;
  name: string;
  email: string;
  username: string;
  role: 'admin' | 'employee' | 'client' | 'partner';
  password?: string;
  created_at: string;
};

export type Document = {
  id: string;
  name: string;
  type: string;
  case_id?: string;
  client_id?: string;
  format: string;
  size: string;
  url: string;
  notes: string;
  created_at: string;
};
