/*
  # Create Azkar (أذكار) Table

  1. New Tables
    - `azkar`
      - `id` (uuid, primary key) - Unique identifier
      - `type` (text) - Type of azkar: 'morning' or 'evening'
      - `text_arabic` (text) - The Arabic text of the dhikr
      - `text_transliteration` (text, optional) - Transliteration for non-Arabic speakers
      - `repetition` (integer) - Number of times to repeat (default 1)
      - `reference` (text, optional) - Source reference (Quran, Hadith, etc)
      - `order_number` (integer) - Display order within the type
      - `created_at` (timestamptz) - Record creation timestamp

  2. Security
    - Enable RLS on `azkar` table
    - Add policy for public read access (azkar are public knowledge)
    - Only authenticated users can modify (future admin feature)
*/

CREATE TABLE IF NOT EXISTS azkar (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL CHECK (type IN ('morning', 'evening')),
  text_arabic text NOT NULL,
  text_transliteration text,
  repetition integer DEFAULT 1,
  reference text,
  order_number integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_azkar_type_order ON azkar(type, order_number);

-- Enable RLS
ALTER TABLE azkar ENABLE ROW LEVEL SECURITY;

-- Allow public read access to azkar
CREATE POLICY "Public can read azkar"
  ON azkar FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert/update/delete (for future admin)
CREATE POLICY "Authenticated users can manage azkar"
  ON azkar FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);