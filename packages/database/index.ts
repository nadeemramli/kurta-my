export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      blog_categories: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      blog_post_categories: {
        Row: {
          category_id: string
          post_id: string
        }
        Insert: {
          category_id: string
          post_id: string
        }
        Update: {
          category_id?: string
          post_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_post_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "blog_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_categories_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
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
        Relationships: [
          {
            foreignKeyName: "blog_post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "blog_post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          author_id: string
          content: string
          created_at: string | null
          excerpt: string | null
          id: string
          published_at: string | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          author_id: string
          content: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          author_id?: string
          content?: string
          created_at?: string | null
          excerpt?: string | null
          id?: string
          published_at?: string | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      collections: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      conversion_metrics: {
        Row: {
          abandoned_cart_rate: number
          cart_views: number
          checkout_completions: number
          checkout_starts: number
          created_at: string | null
          date: string
          successful_orders: number
        }
        Insert: {
          abandoned_cart_rate?: number
          cart_views?: number
          checkout_completions?: number
          checkout_starts?: number
          created_at?: string | null
          date: string
          successful_orders?: number
        }
        Update: {
          abandoned_cart_rate?: number
          cart_views?: number
          checkout_completions?: number
          checkout_starts?: number
          created_at?: string | null
          date?: string
          successful_orders?: number
        }
        Relationships: []
      }
      customer_addresses: {
        Row: {
          address_line1: string
          address_line2: string | null
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          country: string
          created_at: string | null
          customer_id: string
          id: string
          is_default: boolean | null
          postal_code: string
          state: string
          updated_at: string | null
        }
        Insert: {
          address_line1: string
          address_line2?: string | null
          address_type: Database["public"]["Enums"]["address_type"]
          city: string
          country: string
          created_at?: string | null
          customer_id: string
          id?: string
          is_default?: boolean | null
          postal_code: string
          state: string
          updated_at?: string | null
        }
        Update: {
          address_line1?: string
          address_line2?: string | null
          address_type?: Database["public"]["Enums"]["address_type"]
          city?: string
          country?: string
          created_at?: string | null
          customer_id?: string
          id?: string
          is_default?: boolean | null
          postal_code?: string
          state?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "customer_addresses_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      customers: {
        Row: {
          accepts_marketing: boolean | null
          created_at: string | null
          email: string
          first_name: string
          id: string
          last_name: string
          last_order_id: string | null
          orders_count: number | null
          phone: string | null
          total_spent: number | null
          updated_at: string | null
        }
        Insert: {
          accepts_marketing?: boolean | null
          created_at?: string | null
          email: string
          first_name: string
          id?: string
          last_name: string
          last_order_id?: string | null
          orders_count?: number | null
          phone?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Update: {
          accepts_marketing?: boolean | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          last_order_id?: string | null
          orders_count?: number | null
          phone?: string | null
          total_spent?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      order_analytics: {
        Row: {
          average_order_value: number
          created_at: string | null
          date: string
          profit_margin: number
          return_rate: number
          total_orders: number
          total_profit: number
          total_revenue: number
        }
        Insert: {
          average_order_value?: number
          created_at?: string | null
          date: string
          profit_margin?: number
          return_rate?: number
          total_orders?: number
          total_profit?: number
          total_revenue?: number
        }
        Update: {
          average_order_value?: number
          created_at?: string | null
          date?: string
          profit_margin?: number
          return_rate?: number
          total_orders?: number
          total_profit?: number
          total_revenue?: number
        }
        Relationships: []
      }
      order_items: {
        Row: {
          created_at: string | null
          id: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          order_id: string
          product_id: string
          quantity: number
          total_price: number
          unit_price: number
          variant_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          total_price?: number
          unit_price?: number
          variant_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "order_items_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "order_items_variant_id_fkey"
            columns: ["variant_id"]
            isOneToOne: false
            referencedRelation: "product_variants"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          billing_address: Json
          communication_channels: Json | null
          created_at: string | null
          customer_id: string
          delivery_option: string | null
          discount_amount: number
          id: string
          notes: string | null
          payment_method: string
          payment_status: Database["public"]["Enums"]["payment_status"]
          profit: number | null
          shipping_address: Json
          shipping_amount: number
          status: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          tax_amount: number
          total_amount: number
          updated_at: string | null
        }
        Insert: {
          billing_address: Json
          communication_channels?: Json | null
          created_at?: string | null
          customer_id: string
          delivery_option?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_method: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profit?: number | null
          shipping_address: Json
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount: number
          tax_amount?: number
          total_amount: number
          updated_at?: string | null
        }
        Update: {
          billing_address?: Json
          communication_channels?: Json | null
          created_at?: string | null
          customer_id?: string
          delivery_option?: string | null
          discount_amount?: number
          id?: string
          notes?: string | null
          payment_method?: string
          payment_status?: Database["public"]["Enums"]["payment_status"]
          profit?: number | null
          shipping_address?: Json
          shipping_amount?: number
          status?: Database["public"]["Enums"]["order_status"]
          subtotal_amount?: number
          tax_amount?: number
          total_amount?: number
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_customer_id_fkey"
            columns: ["customer_id"]
            isOneToOne: false
            referencedRelation: "customers"
            referencedColumns: ["id"]
          },
        ]
      }
      pages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          seo_description: string | null
          seo_title: string | null
          slug: string
          status: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          status?: Database["public"]["Enums"]["content_status"]
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["content_status"]
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      product_collections: {
        Row: {
          collection_id: string
          product_id: string
        }
        Insert: {
          collection_id: string
          product_id: string
        }
        Update: {
          collection_id?: string
          product_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_collections_collection_id_fkey"
            columns: ["collection_id"]
            isOneToOne: false
            referencedRelation: "collections"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "product_collections_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_images: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          is_primary: boolean | null
          position: number
          product_id: string
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number
          product_id: string
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          is_primary?: boolean | null
          position?: number
          product_id?: string
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_images_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_media: {
        Row: {
          alt: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          position: number | null
          product_id: string | null
          sizes: Json | null
          type: string
          updated_at: string | null
          url: string
        }
        Insert: {
          alt?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          position?: number | null
          product_id?: string | null
          sizes?: Json | null
          type: string
          updated_at?: string | null
          url: string
        }
        Update: {
          alt?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          position?: number | null
          product_id?: string | null
          sizes?: Json | null
          type?: string
          updated_at?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "product_media_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_options: {
        Row: {
          created_at: string | null
          id: string
          name: string
          position: number | null
          product_id: string | null
          updated_at: string | null
          values: string[]
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          product_id?: string | null
          updated_at?: string | null
          values: string[]
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          product_id?: string | null
          updated_at?: string | null
          values?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "product_options_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      product_variants: {
        Row: {
          compare_at_price: number | null
          created_at: string | null
          id: string
          inventory_quantity: number
          option1_name: string | null
          option1_value: string | null
          option2_name: string | null
          option2_value: string | null
          option3_name: string | null
          option3_value: string | null
          price: number
          product_id: string
          sku: string
          title: string
          updated_at: string | null
        }
        Insert: {
          compare_at_price?: number | null
          created_at?: string | null
          id?: string
          inventory_quantity?: number
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price: number
          product_id: string
          sku: string
          title: string
          updated_at?: string | null
        }
        Update: {
          compare_at_price?: number | null
          created_at?: string | null
          id?: string
          inventory_quantity?: number
          option1_name?: string | null
          option1_value?: string | null
          option2_name?: string | null
          option2_value?: string | null
          option3_name?: string | null
          option3_value?: string | null
          price?: number
          product_id?: string
          sku?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "product_variants_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      products: {
        Row: {
          barcode: string | null
          charge_tax: boolean | null
          compare_at_price: number | null
          continue_selling_when_out_of_stock: boolean | null
          cost_per_item: number
          created_at: string | null
          customs_info: Json | null
          description: string
          id: string
          inventory_quantity: number
          media: Json[] | null
          meta_fields: Json | null
          price: number
          published_at: string | null
          requires_shipping: boolean | null
          seo_description: string | null
          seo_title: string | null
          sku: string
          slug: string
          status: Database["public"]["Enums"]["product_status"]
          tags: string[] | null
          title: string
          track_quantity: boolean | null
          type: string | null
          updated_at: string | null
          vendor: string | null
          weight: number | null
          weight_unit: string | null
        }
        Insert: {
          barcode?: string | null
          charge_tax?: boolean | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          cost_per_item: number
          created_at?: string | null
          customs_info?: Json | null
          description: string
          id?: string
          inventory_quantity?: number
          media?: Json[] | null
          meta_fields?: Json | null
          price: number
          published_at?: string | null
          requires_shipping?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          sku: string
          slug: string
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          title: string
          track_quantity?: boolean | null
          type?: string | null
          updated_at?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Update: {
          barcode?: string | null
          charge_tax?: boolean | null
          compare_at_price?: number | null
          continue_selling_when_out_of_stock?: boolean | null
          cost_per_item?: number
          created_at?: string | null
          customs_info?: Json | null
          description?: string
          id?: string
          inventory_quantity?: number
          media?: Json[] | null
          meta_fields?: Json | null
          price?: number
          published_at?: string | null
          requires_shipping?: boolean | null
          seo_description?: string | null
          seo_title?: string | null
          sku?: string
          slug?: string
          status?: Database["public"]["Enums"]["product_status"]
          tags?: string[] | null
          title?: string
          track_quantity?: boolean | null
          type?: string | null
          updated_at?: string | null
          vendor?: string | null
          weight?: number | null
          weight_unit?: string | null
        }
        Relationships: []
      }
      promotion_rules: {
        Row: {
          created_at: string | null
          id: string
          promotion_id: string
          type: Database["public"]["Enums"]["promotion_rule_type"]
          value: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          promotion_id: string
          type: Database["public"]["Enums"]["promotion_rule_type"]
          value: string
        }
        Update: {
          created_at?: string | null
          id?: string
          promotion_id?: string
          type?: Database["public"]["Enums"]["promotion_rule_type"]
          value?: string
        }
        Relationships: [
          {
            foreignKeyName: "promotion_rules_promotion_id_fkey"
            columns: ["promotion_id"]
            isOneToOne: false
            referencedRelation: "promotions"
            referencedColumns: ["id"]
          },
        ]
      }
      promotions: {
        Row: {
          id: string;
          name: string;
          code: string | null;
          description: string | null;
          type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping' | 'tier_discount';
          value: number | null;
          min_purchase_amount: number | null;
          max_discount_amount: number | null;
          starts_at: string;
          ends_at: string | null;
          usage_limit: number | null;
          used_count: number;
          status: 'draft' | 'active' | 'scheduled' | 'expired' | 'cancelled';
          is_stackable: boolean;
          priority: number;
          conditions: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          code?: string;
          description?: string;
          type: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping' | 'tier_discount';
          value?: number;
          min_purchase_amount?: number;
          max_discount_amount?: number;
          starts_at: string;
          ends_at?: string;
          usage_limit?: number;
          used_count?: number;
          status?: 'draft' | 'active' | 'scheduled' | 'expired' | 'cancelled';
          is_stackable?: boolean;
          priority?: number;
          conditions?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          code?: string;
          description?: string;
          type?: 'percentage' | 'fixed_amount' | 'buy_x_get_y' | 'free_shipping' | 'tier_discount';
          value?: number;
          min_purchase_amount?: number;
          max_discount_amount?: number;
          starts_at?: string;
          ends_at?: string;
          usage_limit?: number;
          used_count?: number;
          status?: 'draft' | 'active' | 'scheduled' | 'expired' | 'cancelled';
          is_stackable?: boolean;
          priority?: number;
          conditions?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      }
      promotion_targets: {
        Row: {
          id: string;
          promotion_id: string;
          target_type: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          target_type: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          target_type?: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promotion_targets_promotion_id_fkey";
            columns: ["promotion_id"];
            isOneToOne: false;
            referencedRelation: "promotions";
            referencedColumns: ["id"];
          }
        ];
      };
      promotion_usage: {
        Row: {
          id: string;
          promotion_id: string;
          order_id: string;
          customer_id: string;
          discount_amount: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          order_id: string;
          customer_id: string;
          discount_amount: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          order_id?: string;
          customer_id?: string;
          discount_amount?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promotion_usage_promotion_id_fkey";
            columns: ["promotion_id"];
            isOneToOne: false;
            referencedRelation: "promotions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promotion_usage_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promotion_usage_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      };
      promotion_exclusions: {
        Row: {
          id: string;
          promotion_id: string;
          target_type: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          target_type: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          target_type?: 'all' | 'product' | 'category' | 'collection' | 'customer_segment';
          target_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promotion_exclusions_promotion_id_fkey";
            columns: ["promotion_id"];
            isOneToOne: false;
            referencedRelation: "promotions";
            referencedColumns: ["id"];
          }
        ];
      };
      promotion_tiers: {
        Row: {
          id: string;
          promotion_id: string;
          min_quantity: number;
          discount_value: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          min_quantity: number;
          discount_value: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          min_quantity?: number;
          discount_value?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promotion_tiers_promotion_id_fkey";
            columns: ["promotion_id"];
            isOneToOne: false;
            referencedRelation: "promotions";
            referencedColumns: ["id"];
          }
        ];
      };
      promotion_bxgy_rules: {
        Row: {
          id: string;
          promotion_id: string;
          buy_quantity: number;
          get_quantity: number;
          buy_product_id: string | null;
          get_product_id: string | null;
          discount_percentage: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          promotion_id: string;
          buy_quantity: number;
          get_quantity: number;
          buy_product_id?: string;
          get_product_id?: string;
          discount_percentage?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          promotion_id?: string;
          buy_quantity?: number;
          get_quantity?: number;
          buy_product_id?: string;
          get_product_id?: string;
          discount_percentage?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "promotion_bxgy_rules_promotion_id_fkey";
            columns: ["promotion_id"];
            isOneToOne: false;
            referencedRelation: "promotions";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promotion_bxgy_rules_buy_product_id_fkey";
            columns: ["buy_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "promotion_bxgy_rules_get_product_id_fkey";
            columns: ["get_product_id"];
            isOneToOne: false;
            referencedRelation: "products";
            referencedColumns: ["id"];
          }
        ];
      };
      settings: {
        Row: {
          created_at: string | null
          key: string
          updated_at: string | null
          value: string
        }
        Insert: {
          created_at?: string | null
          key: string
          updated_at?: string | null
          value: string
        }
        Update: {
          created_at?: string | null
          key?: string
          updated_at?: string | null
          value?: string
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string | null
          id: string
          slug: string
          title: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          slug: string
          title: string
        }
        Update: {
          created_at?: string | null
          id?: string
          slug?: string
          title?: string
        }
        Relationships: []
      }
      traffic_analytics: {
        Row: {
          average_session_duration: number
          bounce_rate: number
          created_at: string | null
          date: string
          page_views: number
          unique_visitors: number
        }
        Insert: {
          average_session_duration?: number
          bounce_rate?: number
          created_at?: string | null
          date: string
          page_views?: number
          unique_visitors?: number
        }
        Update: {
          average_session_duration?: number
          bounce_rate?: number
          created_at?: string | null
          date?: string
          page_views?: number
          unique_visitors?: number
        }
        Relationships: []
      }
      variant_brackets: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          name: string
          position: number | null
          product_id: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          name: string
          position?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          name?: string
          position?: number | null
          product_id?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "variant_brackets_product_id_fkey"
            columns: ["product_id"]
            isOneToOne: false
            referencedRelation: "products"
            referencedColumns: ["id"]
          },
        ]
      }
      variant_options: {
        Row: {
          additional_costs: Json | null
          bracket_id: string | null
          created_at: string | null
          id: string
          name: string
          position: number | null
          updated_at: string | null
          values: string[]
        }
        Insert: {
          additional_costs?: Json | null
          bracket_id?: string | null
          created_at?: string | null
          id?: string
          name: string
          position?: number | null
          updated_at?: string | null
          values: string[]
        }
        Update: {
          additional_costs?: Json | null
          bracket_id?: string | null
          created_at?: string | null
          id?: string
          name?: string
          position?: number | null
          updated_at?: string | null
          values?: string[]
        }
        Relationships: [
          {
            foreignKeyName: "variant_options_bracket_id_fkey"
            columns: ["bracket_id"]
            isOneToOne: false
            referencedRelation: "variant_brackets"
            referencedColumns: ["id"]
          },
        ]
      }
      customer_segments: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          criteria: {
            conditions: Array<{
              field: string;
              operator: string;
              value: string | number | boolean | Array<string | number>;
            }>;
            match_type: 'all' | 'any';
          };
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string;
          criteria: {
            conditions: Array<{
              field: string;
              operator: string;
              value: string | number | boolean | Array<string | number>;
            }>;
            match_type: 'all' | 'any';
          };
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          criteria?: {
            conditions: Array<{
              field: string;
              operator: string;
              value: string | number | boolean | Array<string | number>;
            }>;
            match_type: 'all' | 'any';
          };
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      },
      customer_segment_memberships: {
        Row: {
          customer_id: string;
          segment_id: string;
          created_at: string;
        };
        Insert: {
          customer_id: string;
          segment_id: string;
          created_at?: string;
        };
        Update: {
          customer_id?: string;
          segment_id?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_segment_memberships_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "customer_segment_memberships_segment_id_fkey";
            columns: ["segment_id"];
            isOneToOne: false;
            referencedRelation: "customer_segments";
            referencedColumns: ["id"];
          }
        ];
      },
      customer_notes: {
        Row: {
          id: string;
          customer_id: string;
          note: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          note: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          note?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_notes_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      },
      customer_preferences: {
        Row: {
          customer_id: string;
          marketing_email: boolean;
          marketing_sms: boolean;
          marketing_push: boolean;
          newsletter_subscribed: boolean;
          preferences: Record<string, any>;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          customer_id: string;
          marketing_email?: boolean;
          marketing_sms?: boolean;
          marketing_push?: boolean;
          newsletter_subscribed?: boolean;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          customer_id?: string;
          marketing_email?: boolean;
          marketing_sms?: boolean;
          marketing_push?: boolean;
          newsletter_subscribed?: boolean;
          preferences?: Record<string, any>;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "customer_preferences_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: true;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      },
      loyalty_program: {
        Row: {
          id: string;
          customer_id: string;
          points_balance: number;
          lifetime_points: number;
          tier_level: string;
          tier_progress: number;
          last_points_earned_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          points_balance?: number;
          lifetime_points?: number;
          tier_level?: string;
          tier_progress?: number;
          last_points_earned_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          points_balance?: number;
          lifetime_points?: number;
          tier_level?: string;
          tier_progress?: number;
          last_points_earned_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loyalty_program_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: true;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          }
        ];
      },
      loyalty_transactions: {
        Row: {
          id: string;
          customer_id: string;
          order_id: string | null;
          points_earned: number | null;
          points_redeemed: number | null;
          transaction_type: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_id: string;
          order_id?: string;
          points_earned?: number;
          points_redeemed?: number;
          transaction_type: string;
          description?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_id?: string;
          order_id?: string;
          points_earned?: number;
          points_redeemed?: number;
          transaction_type?: string;
          description?: string;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "loyalty_transactions_customer_id_fkey";
            columns: ["customer_id"];
            isOneToOne: false;
            referencedRelation: "customers";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "loyalty_transactions_order_id_fkey";
            columns: ["order_id"];
            isOneToOne: false;
            referencedRelation: "orders";
            referencedColumns: ["id"];
          }
        ];
      },
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      add_order_item: {
        Args: {
          p_order_id: string
          p_product_id: string
          p_variant_id: string
          p_quantity: number
        }
        Returns: string
      }
      apply_discount: {
        Args: {
          p_order_id: string
          p_discount_amount: number
        }
        Returns: undefined
      }
      apply_shipping_cost: {
        Args: {
          p_order_id: string
          p_shipping_amount: number
        }
        Returns: undefined
      }
      apply_tax: {
        Args: {
          p_order_id: string
          p_tax_amount: number
        }
        Returns: undefined
      }
      calculate_daily_analytics: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      calculate_order_totals: {
        Args: {
          order_id: string
        }
        Returns: undefined
      }
      create_draft_order: {
        Args: {
          p_customer_id: string
          p_shipping_address: Json
          p_billing_address: Json
        }
        Returns: string
      }
      generate_sku: {
        Args: {
          product_name: string
        }
        Returns: string
      }
      generate_test_orders: {
        Args: {
          num_orders: number
        }
        Returns: undefined
      }
      get_admin_role: {
        Args: {
          user_id: string
        }
        Returns: string
      }
      get_collection_products: {
        Args: {
          collection_id: string
        }
        Returns: {
          product_id: string
          title: string
          price: number
          status: Database["public"]["Enums"]["product_status"]
        }[]
      }
      get_order_summary: {
        Args: {
          p_order_id: string
        }
        Returns: {
          order_id: string
          customer_name: string
          status: Database["public"]["Enums"]["order_status"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          total_amount: number
          items_count: number
          created_at: string
        }[]
      }
      get_product_collections: {
        Args: {
          product_id: string
        }
        Returns: {
          collection_id: string
          title: string
          slug: string
        }[]
      }
      has_admin_access: {
        Args: {
          required_role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
      has_admin_role: {
        Args: {
          user_id: string
          required_role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: boolean
      }
      process_payment: {
        Args: {
          p_order_id: string
          p_payment_method: string
          p_payment_details?: Json
        }
        Returns: Json
      }
      remove_admin_role: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      remove_order_item: {
        Args: {
          p_order_id: string
          p_order_item_id: string
        }
        Returns: undefined
      }
      set_admin_role: {
        Args: {
          user_id: string
          role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: undefined
      }
      setup_admin_user: {
        Args: {
          p_user_id: string
          p_role: Database["public"]["Enums"]["admin_role"]
        }
        Returns: undefined
      }
      update_communication_preferences: {
        Args: {
          p_order_id: string
          p_preferences: Json
        }
        Returns: undefined
      }
      update_order_analytics: {
        Args: {
          p_date: string
        }
        Returns: undefined
      }
      update_order_item_quantity: {
        Args: {
          p_order_item_id: string
          p_quantity: number
        }
        Returns: undefined
      }
      update_order_status: {
        Args: {
          p_order_id: string
          p_status: Database["public"]["Enums"]["order_status"]
          p_payment_status?: Database["public"]["Enums"]["payment_status"]
        }
        Returns: undefined
      }
    }
    Enums: {
      address_type: "billing" | "shipping"
      admin_role: "owner" | "operations" | "marketing" | "support" | "content"
      content_status: "draft" | "published" | "archived"
      delivery_option: "standard" | "express"
      order_status:
        | "draft"
        | "pending"
        | "processing"
        | "completed"
        | "cancelled"
      payment_status: "pending" | "paid" | "failed"
      product_status: "draft" | "active" | "archived"
      promotion_rule_type:
        | "product"
        | "collection"
        | "customer"
        | "minimum_amount"
      promotion_status: "active" | "inactive" | "expired"
      promotion_type: "percentage" | "fixed_amount"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

