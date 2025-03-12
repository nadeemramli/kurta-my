import sharp from 'sharp';

export interface ImageSize {
  width: number;
  height: number;
  quality: number;
}

export const IMAGE_SIZES = {
  thumbnail: { width: 100, height: 100, quality: 80 },
  small: { width: 300, height: 300, quality: 80 },
  medium: { width: 600, height: 600, quality: 85 },
  large: { width: 1200, height: 1200, quality: 90 },
} as const;

export interface ProcessedImage {
  buffer: Buffer;
  width: number;
  height: number;
  format: string;
  size: number;
}

export async function processImage(
  buffer: Buffer,
  size: ImageSize,
  format: 'jpeg' | 'webp' = 'webp'
): Promise<ProcessedImage> {
  try {
    // Get image metadata
    const metadata = await sharp(buffer).metadata();
    
    // Calculate aspect ratio
    const aspectRatio = metadata.width! / metadata.height!;
    
    // Determine dimensions maintaining aspect ratio
    let width = size.width;
    let height = size.height;
    
    if (aspectRatio > 1) {
      // Landscape
      height = Math.round(width / aspectRatio);
    } else {
      // Portrait
      width = Math.round(height * aspectRatio);
    }

    // Process image
    const processedBuffer = await sharp(buffer)
      .resize(width, height, {
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      [format]({
        quality: size.quality,
        progressive: true,
      })
      .toBuffer();

    return {
      buffer: processedBuffer,
      width,
      height,
      format,
      size: processedBuffer.length,
    };
  } catch (error) {
    console.error('Error processing image:', error);
    throw new Error('Failed to process image');
  }
}

export async function generateResponsiveImages(buffer: Buffer): Promise<Record<keyof typeof IMAGE_SIZES, ProcessedImage>> {
  const sizes = Object.entries(IMAGE_SIZES) as [keyof typeof IMAGE_SIZES, ImageSize][];
  
  const processed = await Promise.all(
    sizes.map(async ([key, size]) => {
      const image = await processImage(buffer, size);
      return [key, image] as const;
    })
  );

  return Object.fromEntries(processed) as Record<keyof typeof IMAGE_SIZES, ProcessedImage>;
} 