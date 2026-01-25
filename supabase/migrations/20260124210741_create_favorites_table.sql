/*
  # Create favorites table

  1. New Tables
    - `favorites`
      - `id` (uuid, primary key) - Unique identifier for each favorite
      - `emotion_id` (uuid, foreign key) - References the emotions table
      - `created_at` (timestamptz) - When the favorite was added
  
  2. Security
    - Enable RLS on `favorites` table
    - Add policy for public access (since we don't have auth yet)
  
  3. Indexes
    - Add index on emotion_id for faster lookups
  
  Note: This implementation uses a simple approach without user authentication.
  When auth is added later, we can add a user_id column and update policies.
*/

CREATE TABLE IF NOT EXISTS favorites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_id uuid NOT NULL REFERENCES emotions(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read favorites (temporary until auth is added)
CREATE POLICY "Anyone can view favorites"
  ON favorites
  FOR SELECT
  TO public
  USING (true);

-- Allow anyone to insert favorites (temporary until auth is added)
CREATE POLICY "Anyone can add favorites"
  ON favorites
  FOR INSERT
  TO public
  WITH CHECK (true);

-- Allow anyone to delete favorites (temporary until auth is added)
CREATE POLICY "Anyone can remove favorites"
  ON favorites
  FOR DELETE
  TO public
  USING (true);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_favorites_emotion_id ON favorites(emotion_id);