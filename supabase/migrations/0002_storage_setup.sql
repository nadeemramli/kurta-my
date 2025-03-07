-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
('product-images', 'product-images', true),
('blog-images', 'blog-images', true),
('content-images', 'content-images', true),
('user-uploads', 'user-uploads', false);

-- Set up storage policies for product-images bucket
CREATE POLICY "Public Access Product Images" ON storage.objects
FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Admin Insert Product Images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'product-images' 
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Update Product Images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Delete Product Images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'product-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

-- Set up storage policies for blog-images bucket
CREATE POLICY "Public Access Blog Images" ON storage.objects
FOR SELECT USING (bucket_id = 'blog-images');

CREATE POLICY "Admin Insert Blog Images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Update Blog Images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Delete Blog Images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'blog-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

-- Set up storage policies for content-images bucket
CREATE POLICY "Public Access Content Images" ON storage.objects
FOR SELECT USING (bucket_id = 'content-images');

CREATE POLICY "Admin Insert Content Images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'content-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Update Content Images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'content-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

CREATE POLICY "Admin Delete Content Images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'content-images'
  AND auth.role() = 'authenticated'
  AND auth.jwt()->>'role' = 'admin'
);

-- Set up storage policies for user-uploads bucket
CREATE POLICY "Authenticated Users Access Own Uploads" ON storage.objects
FOR SELECT USING (
  bucket_id = 'user-uploads'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users Insert Own Uploads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-uploads'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users Update Own Uploads" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'user-uploads'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
);

CREATE POLICY "Users Delete Own Uploads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'user-uploads'
  AND auth.role() = 'authenticated'
  AND (storage.foldername(name))[1] = auth.uid()::text
); 