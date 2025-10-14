-- Create teachers table
CREATE TABLE IF NOT EXISTS public.teachers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name text NOT NULL,
  last_name text NOT NULL,
  middle_name text,
  position text NOT NULL,
  categories text[] DEFAULT '{}',
  subjects text[] DEFAULT '{}',
  bio text,
  photo_url text,
  contact_email text,
  contact_phone text,
  public boolean DEFAULT true,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.teachers ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view public teachers
CREATE POLICY "Public can view public teachers"
  ON public.teachers
  FOR SELECT
  USING (public = true);

-- Policy: Authenticated users can view all teachers
CREATE POLICY "Authenticated users can view all teachers"
  ON public.teachers
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert teachers
CREATE POLICY "Authenticated users can insert teachers"
  ON public.teachers
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update teachers
CREATE POLICY "Authenticated users can update teachers"
  ON public.teachers
  FOR UPDATE
  TO authenticated
  USING (true);

-- Policy: Authenticated users can delete teachers
CREATE POLICY "Authenticated users can delete teachers"
  ON public.teachers
  FOR DELETE
  TO authenticated
  USING (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for updated_at
CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.teachers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Create storage bucket for teacher photos
INSERT INTO storage.buckets (id, name, public)
VALUES ('teacher-photos', 'teacher-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for teacher photos
CREATE POLICY "Public can view teacher photos"
  ON storage.objects
  FOR SELECT
  USING (bucket_id = 'teacher-photos');

CREATE POLICY "Authenticated users can upload teacher photos"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'teacher-photos');

CREATE POLICY "Authenticated users can update teacher photos"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (bucket_id = 'teacher-photos');

CREATE POLICY "Authenticated users can delete teacher photos"
  ON storage.objects
  FOR DELETE
  TO authenticated
  USING (bucket_id = 'teacher-photos');

-- Enable realtime for teachers table
ALTER PUBLICATION supabase_realtime ADD TABLE public.teachers;