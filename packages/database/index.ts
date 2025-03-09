export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          title: string
          slug: string
          description: string
          price: number
          compare_at_price: number | null
          cost_per_item: number
          sku: string
          barcode: string | null
          inventory_quantity: number
          status: "draft" | "active" | "archived"
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description: string
          price: number
          compare_at_price?: number | null
          cost_per_item: number
          sku: string
          barcode?: string | null
          inventory_quantity?: number
          status?: "draft" | "active" | "archived"
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string
          price?: number
          compare_at_price?: number | null
          cost_per_item?: number
          sku?: string
          barcode?: string | null
          inventory_quantity?: number
          status?: "draft" | "active" | "archived"
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_variants: {
        Row: {
          id: string
          product_id: string
          title: string
          sku: string
          price: number
          compare_at_price: number | null
          inventory_quantity: number
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          option3_name: string | null
          option3_value: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          product_id: string
          title: string
          sku: string
          price: number
          compare_at_price?: number | null
          inventory_quantity?: number
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          title?: string
          sku?: string
          price?: number
          compare_at_price?: number | null
          inventory_quantity?: number
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_images: {
        Row: {
          id: string
          product_id: string
          url: string
          alt: string | null
          position: number
          is_primary: boolean
          created_at: string
        }
        Insert: {
          id?: string
          product_id: string
          url: string
          alt?: string | null
          position?: number
          is_primary?: boolean
          created_at?: string
        }
        Update: {
          id?: string
          product_id?: string
          url?: string
          alt?: string | null
          position?: number
          is_primary?: boolean
          created_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          seo_title: string | null
          seo_description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          seo_title?: string | null
          seo_description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      product_collections: {
        Row: {
          product_id: string
          collection_id: string
        }
        Insert: {
          product_id: string
          collection_id: string
        }
        Update: {
          product_id?: string
          collection_id?: string
        }
      }
      orders: {
        Row: {
          id: string
          order_number: string
          customer_id: string | null
          status: string
          total_price: number
          subtotal_price: number
          total_tax: number
          total_shipping: number
          total_discounts: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          order_number: string
          customer_id?: string | null
          status: string
          total_price: number
          subtotal_price: number
          total_tax: number
          total_shipping: number
          total_discounts: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          order_number?: string
          customer_id?: string | null
          status?: string
          total_price?: number
          subtotal_price?: number
          total_tax?: number
          total_shipping?: number
          total_discounts?: number
          created_at?: string
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          variant_id: string | null
          title: string
          quantity: number
          price: number
          total_price: number
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          variant_id?: string | null
          title: string
          quantity: number
          price: number
          total_price: number
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          variant_id?: string | null
          title?: string
          quantity?: number
          price?: number
          total_price?: number
          created_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          email: string
          first_name: string | null
          last_name: string | null
          phone: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          first_name?: string | null
          last_name?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      addresses: {
        Row: {
          id: string
          customer_id: string
          first_name: string
          last_name: string
          company: string | null
          address1: string
          address2: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone: string | null
          is_default: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_id: string
          first_name: string
          last_name: string
          company?: string | null
          address1: string
          address2?: string | null
          city: string
          state: string
          postal_code: string
          country: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_id?: string
          first_name?: string
          last_name?: string
          company?: string | null
          address1?: string
          address2?: string | null
          city?: string
          state?: string
          postal_code?: string
          country?: string
          phone?: string | null
          is_default?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      blog_posts: {
        Row: {
          id: string
          title: string
          slug: string
          content: string
          excerpt: string | null
          featured_image: string | null
          status: string
          published_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          content: string
          excerpt?: string | null
          featured_image?: string | null
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          content?: string
          excerpt?: string | null
          featured_image?: string | null
          status?: string
          published_at?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_categories: {
        Row: {
          id: string
          title: string
          slug: string
          description: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          description?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      blog_post_categories: {
        Row: {
          post_id: string
          category_id: string
        }
        Insert: {
          post_id: string
          category_id: string
        }
        Update: {
          post_id?: string
          category_id?: string
        }
      }
      blog_tags: {
        Row: {
          id: string
          title: string
          slug: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          slug: string
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          slug?: string
          created_at?: string
          updated_at?: string
        }
      }
      blog_post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      product_status: "draft" | "active" | "archived"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
} 