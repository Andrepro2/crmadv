-- LexPro CRM - Supabase Database Schema
-- Execute este script no SQL Editor do seu projeto Supabase.

-- 1. Tabela de Clientes
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  document TEXT,
  phone TEXT,
  address TEXT,
  notes TEXT,
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Inativo')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Tabela de Processos (Cases)
CREATE TABLE IF NOT EXISTS cases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  number TEXT NOT NULL UNIQUE,
  client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
  type TEXT NOT NULL,
  priority TEXT DEFAULT 'Média' CHECK (priority IN ('Baixa', 'Média', 'Alta')),
  status TEXT DEFAULT 'Ativo' CHECK (status IN ('Ativo', 'Pendente', 'Concluído')),
  value NUMERIC(15, 2) DEFAULT 0,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Tabela de Agenda (Events)
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('audiencia', 'reuniao', 'prazo', 'julgamento', 'pericia', 'outro')),
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  date DATE NOT NULL,
  time TIME NOT NULL,
  location TEXT,
  description TEXT,
  notify BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Tabela Financeira (Transactions)
CREATE TABLE IF NOT EXISTS transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('entrada', 'saida')),
  category TEXT NOT NULL,
  value NUMERIC(15, 2) NOT NULL,
  date DATE NOT NULL,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  description TEXT NOT NULL,
  paid BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Tabela de Documentos
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  case_id UUID REFERENCES cases(id) ON DELETE SET NULL,
  client_id UUID REFERENCES clients(id) ON DELETE SET NULL,
  format TEXT,
  size TEXT,
  url TEXT NOT NULL,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Habilitar Realtime para atualizações automáticas
-- Nota: Algumas versões do Supabase requerem que você habilite isso via UI em 'Database' -> 'Replication'
-- alter publication supabase_realtime add table clients;
-- alter publication supabase_realtime add table cases;
-- alter publication supabase_realtime add table events;
-- alter publication supabase_realtime add table transactions;
-- alter publication supabase_realtime add table documents;
