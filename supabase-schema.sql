-- Family Trip Manager — Supabase Schema
-- Run this SQL in Supabase SQL Editor (https://supabase.com/dashboard → SQL Editor)

CREATE TABLE IF NOT EXISTS trips (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create index for fast lookup by code
CREATE INDEX IF NOT EXISTS idx_trips_code ON trips (code);

-- Enable Row Level Security
ALTER TABLE trips ENABLE ROW LEVEL SECURITY;

-- Allow public access (no login required)
CREATE POLICY "Allow public read" ON trips FOR SELECT USING (true);
CREATE POLICY "Allow public insert" ON trips FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update" ON trips FOR UPDATE USING (true);
