import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateResponsiveImages, IMAGE_SIZES } from '@/lib/utils/image-processing';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export async function POST(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const productId = formData.get('productId') as string;

    // Validation
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: 'File size exceeds 5MB limit' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_FILE_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Only JPEG, PNG, and WebP are allowed' },
        { status: 400 }
      );
    }

    try {
      // Convert File to Buffer for processing
      const buffer = Buffer.from(await file.arrayBuffer());

      // Generate responsive images
      const responsiveImages = await generateResponsiveImages(buffer);

      // Upload all sizes to storage
      const uploads = await Promise.all(
        Object.entries(responsiveImages).map(async ([size, image]) => {
          const timestamp = Date.now();
          const fileName = `${timestamp}-${size}-${file.name}`;
          const filePath = `products/${productId}/${fileName}`;

          const { error: uploadError } = await supabase.storage
            .from('product_media')
            .upload(filePath, image.buffer, {
              contentType: `image/${image.format}`,
              cacheControl: '31536000', // 1 year cache
              upsert: false
            });

          if (uploadError) throw uploadError;

          const { data: { publicUrl } } = supabase.storage
            .from('product_media')
            .getPublicUrl(filePath);

          return [size, {
            url: publicUrl,
            width: image.width,
            height: image.height,
            size: image.size,
          }];
        })
      );

      // Get the original file URL for the main record
      const originalFileName = `${Date.now()}-original-${file.name}`;
      const originalFilePath = `products/${productId}/${originalFileName}`;

      const { error: originalUploadError } = await supabase.storage
        .from('product_media')
        .upload(originalFilePath, buffer, {
          contentType: file.type,
          cacheControl: '31536000',
          upsert: false
        });

      if (originalUploadError) throw originalUploadError;

      const { data: { publicUrl: originalUrl } } = supabase.storage
        .from('product_media')
        .getPublicUrl(originalFilePath);

      // Return the complete media object
      return NextResponse.json({
        url: originalUrl,
        type: 'image',
        sizes: Object.fromEntries(uploads),
        metadata: {
          originalSize: file.size,
          originalType: file.type,
          lastModified: file.lastModified,
          processedSizes: Object.keys(responsiveImages).length,
        }
      });
    } catch (error) {
      console.error('Error processing image:', error);
      return NextResponse.json(
        { error: 'Failed to process image' },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error('Error uploading media:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    const { searchParams } = new URL(request.url);
    const filePath = searchParams.get('path');
    const productId = searchParams.get('productId');

    if (!filePath || !productId) {
      return NextResponse.json(
        { error: 'File path and product ID are required' },
        { status: 400 }
      );
    }

    // Delete all size variants
    const baseFileName = filePath.split('/').pop()?.replace('original-', '');
    if (!baseFileName) {
      return NextResponse.json(
        { error: 'Invalid file path' },
        { status: 400 }
      );
    }

    const filesToDelete = [
      filePath,
      ...Object.keys(IMAGE_SIZES).map(size => 
        `products/${productId}/${Date.now()}-${size}-${baseFileName}`
      )
    ];

    const { error } = await supabase
      .storage
      .from('product_media')
      .remove(filesToDelete);

    if (error) {
      console.error('Error deleting files:', error);
      throw error;
    }

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error('Error deleting media:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
} 