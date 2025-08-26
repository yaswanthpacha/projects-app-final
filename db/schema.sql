-- Run this in Supabase SQL editor
create table if not exists projects (
  id bigint generated always as identity primary key,
  name text not null,
  description text,
  sector text,
  cost numeric,
  modules text,
  newUseCases text,
  created_at timestamp with time zone default now()
);
