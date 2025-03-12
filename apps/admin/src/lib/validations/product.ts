import { z } from 'zod';

export const productValidationSchema = z.object({
  title: z.string().min(1, 'Product title is required').max(255, 'Title is too long'),
  description: z.string().min(1, 'Product description is required'),
  status: z.enum(['draft', 'active', 'archived']),
  price: z.number().min(0.01, 'Price must be greater than 0'),
  compare_at_price: z.number().nullable().optional(),
  cost_per_item: z.number().min(0.01, 'Cost per item must be greater than 0'),
  charge_tax: z.boolean(),
  weight: z.number().nullable().optional(),
  weight_unit: z.enum(['kg', 'g']).optional(),
  vendor: z.string().optional(),
  type: z.string().optional(),
  sku: z.string().optional(),
  barcode: z.string().optional(),
  customs_info: z.object({
    country_of_origin: z.string().optional(),
    hs_code: z.string().optional(),
  }).optional(),
  seo_title: z.string().max(60, 'SEO title should be under 60 characters').optional(),
  seo_description: z.string().max(160, 'SEO description should be under 160 characters').optional(),
  track_quantity: z.boolean(),
  continue_selling_when_out_of_stock: z.boolean(),
  requires_shipping: z.boolean(),
  variant_brackets: z.array(
    z.object({
      id: z.string().optional(),
      name: z.string().min(1, 'Bracket name is required'),
      description: z.string().optional(),
      options: z.array(
        z.object({
          name: z.string().min(1, 'Option name is required'),
          values: z.array(z.string()).min(1, 'At least one value is required'),
          additional_costs: z.record(z.number().min(0)),
        })
      ),
    })
  ),
  collections: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      slug: z.string(),
      description: z.string().optional(),
    })
  ),
  media: z.array(
    z.object({
      id: z.string().optional(),
      url: z.string().url('Invalid media URL'),
      type: z.enum(['image', 'video']),
      alt: z.string().optional(),
      position: z.number(),
      metadata: z.record(z.any()).optional(),
      sizes: z.record(
        z.object({
          url: z.string().url(),
          width: z.number(),
          height: z.number(),
          size: z.number(),
        })
      ).optional(),
    })
  ),
  tags: z.array(z.string()).optional(),
  slug: z.string().optional(),
});

export type ProductValidationSchema = z.infer<typeof productValidationSchema>;

interface ValidationResult {
  success: boolean;
  data?: z.infer<typeof productValidationSchema>;
  errors?: Record<string, string>;
}

export const validateProduct = (data: unknown): ValidationResult => {
  try {
    return {
      success: true,
      data: productValidationSchema.parse(data),
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.reduce<Record<string, string>>((acc, err) => {
        const path = err.path.join('.');
        return { ...acc, [path]: err.message };
      }, {});
      
      return {
        success: false,
        errors,
      };
    }
    throw error;
  }
}; 