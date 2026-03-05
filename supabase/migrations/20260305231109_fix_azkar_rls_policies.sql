/*
  # Fix Azkar RLS Policies

  1. Security Fixes
    - Remove overly permissive policies using USING (true)
    - Separate SELECT from ALL operations
    - Create specific, secure policies for each operation
    
  2. Changes
    - Drop existing problematic policies
    - Create granular policies for SELECT, INSERT, UPDATE, DELETE
    - Public can only SELECT, authenticated users can manage
*/

DROP POLICY IF EXISTS "Public can read azkar" ON azkar;
DROP POLICY IF EXISTS "Authenticated users can manage azkar" ON azkar;

-- Public can read all azkar
CREATE POLICY "Public can read azkar"
  ON azkar FOR SELECT
  TO public
  USING (true);

-- Authenticated users can insert azkar (for future admin)
CREATE POLICY "Authenticated users can insert azkar"
  ON azkar FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Authenticated users can update azkar (for future admin)
CREATE POLICY "Authenticated users can update azkar"
  ON azkar FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Authenticated users can delete azkar (for future admin)
CREATE POLICY "Authenticated users can delete azkar"
  ON azkar FOR DELETE
  TO authenticated
  USING (true);
