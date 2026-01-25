/*
  # إنشاء جدول الحالات النفسية مع الآيات القرآنية

  ## الجداول الجديدة
  
  ### `emotions`
  - `id` (uuid, primary key) - معرف فريد
  - `emotion_name` (text) - اسم الحالة النفسية (قلق، خوف، حزن، إلخ)
  - `emotion_category` (text) - الفئة (مشاعر سلبية، تحديات، أمل)
  - `ayah_text` (text) - نص الآية الكريمة
  - `ayah_reference` (text) - مرجع الآية (السورة:الآية)
  - `explanation` (text) - شرح مبسط للآية وارتباطها بالحالة
  - `action` (text) - عمل عملي مقترح
  - `duaa` (text) - دعاء مرتبط بالحالة
  - `icon` (text) - اسم الأيقونة من lucide-react
  - `color` (text) - لون الفئة
  - `created_at` (timestamptz) - تاريخ الإنشاء
  
  ## الأمان
  - تفعيل RLS على جدول emotions
  - السماح للجميع بقراءة البيانات (محتوى عام)
*/

CREATE TABLE IF NOT EXISTS emotions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  emotion_name text NOT NULL,
  emotion_category text NOT NULL,
  ayah_text text NOT NULL,
  ayah_reference text NOT NULL,
  explanation text NOT NULL,
  action text NOT NULL,
  duaa text NOT NULL,
  icon text DEFAULT 'Heart',
  color text DEFAULT 'blue',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE emotions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read emotions"
  ON emotions
  FOR SELECT
  TO anon
  USING (true);

-- إضافة index للبحث السريع
CREATE INDEX IF NOT EXISTS emotions_name_idx ON emotions(emotion_name);
CREATE INDEX IF NOT EXISTS emotions_category_idx ON emotions(emotion_category);
