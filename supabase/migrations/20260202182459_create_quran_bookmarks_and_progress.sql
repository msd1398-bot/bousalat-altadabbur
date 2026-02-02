/*
  # Create Quran Bookmarks and Reading Progress Tables

  1. New Tables
    - `quran_reading_progress`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `surah_number` (integer)
      - `ayah_number` (integer)
      - `updated_at` (timestamp)
    
    - `quran_bookmarks`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `surah_number` (integer)
      - `ayah_number` (integer)
      - `note` (text, optional)
      - `created_at` (timestamp)

  2. Security
    - Enable RLS on both tables
    - Users can only access their own data
    - Authenticated users can read, insert, update, and delete their own records
*/

-- Create quran_reading_progress table
CREATE TABLE IF NOT EXISTS quran_reading_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Create quran_bookmarks table
CREATE TABLE IF NOT EXISTS quran_bookmarks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  surah_number integer NOT NULL,
  ayah_number integer NOT NULL,
  surah_name text,
  ayah_text text,
  note text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  UNIQUE(user_id, surah_number, ayah_number)
);

-- Enable RLS
ALTER TABLE quran_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE quran_bookmarks ENABLE ROW LEVEL SECURITY;

-- Policies for quran_reading_progress
CREATE POLICY "Users can view own reading progress"
  ON quran_reading_progress FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own reading progress"
  ON quran_reading_progress FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own reading progress"
  ON quran_reading_progress FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own reading progress"
  ON quran_reading_progress FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policies for quran_bookmarks
CREATE POLICY "Users can view own bookmarks"
  ON quran_bookmarks FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own bookmarks"
  ON quran_bookmarks FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own bookmarks"
  ON quran_bookmarks FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own bookmarks"
  ON quran_bookmarks FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);