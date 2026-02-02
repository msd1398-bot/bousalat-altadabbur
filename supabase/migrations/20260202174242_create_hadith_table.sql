/*
  # Create Hadith Table

  1. New Tables
    - `hadith`
      - `id` (uuid, primary key) - Unique identifier for each hadith
      - `hadith_arabic` (text) - The hadith text in Arabic
      - `hadith_english` (text) - The hadith translation in English
      - `narrator` (text) - The narrator/companion who reported the hadith
      - `source` (text) - The hadith book source (e.g., Sahih Bukhari, Sahih Muslim)
      - `reference` (text) - The reference number in the source book
      - `category` (text) - Category of the hadith (e.g., Faith, Prayer, Manners)
      - `created_at` (timestamptz) - Timestamp when the record was created

  2. Security
    - Enable RLS on `hadith` table
    - Add policy for public read access (anyone can view hadiths)
    
  3. Notes
    - This table stores authentic hadiths from major collections
    - All hadiths should be verified from authentic sources
    - Categories help organize hadiths by topic for easy navigation
*/

CREATE TABLE IF NOT EXISTS hadith (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  hadith_arabic text NOT NULL,
  hadith_english text NOT NULL,
  narrator text NOT NULL,
  source text NOT NULL,
  reference text NOT NULL,
  category text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE hadith ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view hadiths"
  ON hadith
  FOR SELECT
  USING (true);