export interface Database {
  // Orders and Order-related tables
  orders: {
    Row: {
      id: string;
      customer_id: string;
      status: 'draft' | 'pending' | 'processing' | 'completed' | 'cancelled';
      total_amount: number;
      subtotal_amount: number;
      tax_amount: number;
      shipping_amount: number;
      discount_amount: number;
      shipping_address: string;
      billing_address: string;
      payment_status: 'pending' | 'paid' | 'failed';
      payment_method: string;
      notes: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  order_items: {
    Row: {
      id: string;
      order_id: string;
      product_id: string;
      variant_id: string | null;
      quantity: number;
      unit_price: number;
      total_price: number;
      created_at: string;
    };
  };

  // Products and Product-related tables
  products: {
    Row: {
      id: string;
      title: string;
      slug: string;
      description: string;
      price: number;
      compare_at_price: number | null;
      cost_per_item: number;
      sku: string;
      barcode: string | null;
      inventory_quantity: number;
      status: 'draft' | 'active' | 'archived';
      seo_title: string | null;
      seo_description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  product_variants: {
    Row: {
      id: string;
      product_id: string;
      title: string;
      sku: string;
      price: number;
      compare_at_price: number | null;
      inventory_quantity: number;
      option1_name: string | null;
      option1_value: string | null;
      option2_name: string | null;
      option2_value: string | null;
      option3_name: string | null;
      option3_value: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  product_images: {
    Row: {
      id: string;
      product_id: string;
      url: string;
      alt: string | null;
      position: number;
      is_primary: boolean;
      created_at: string;
    };
  };

  categories: {
    Row: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      parent_id: string | null;
      seo_title: string | null;
      seo_description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  product_categories: {
    Row: {
      product_id: string;
      category_id: string;
    };
  };

  collections: {
    Row: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      seo_title: string | null;
      seo_description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  product_collections: {
    Row: {
      product_id: string;
      collection_id: string;
    };
  };

  // Customers
  customers: {
    Row: {
      id: string;
      email: string;
      first_name: string;
      last_name: string;
      phone: string | null;
      accepts_marketing: boolean;
      total_spent: number;
      orders_count: number;
      last_order_id: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  customer_addresses: {
    Row: {
      id: string;
      customer_id: string;
      address_type: 'billing' | 'shipping';
      address_line1: string;
      address_line2: string | null;
      city: string;
      state: string;
      postal_code: string;
      country: string;
      is_default: boolean;
      created_at: string;
      updated_at: string;
    };
  };

  // Content
  pages: {
    Row: {
      id: string;
      title: string;
      slug: string;
      content: string;
      status: 'draft' | 'published' | 'archived';
      seo_title: string | null;
      seo_description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  blog_posts: {
    Row: {
      id: string;
      title: string;
      slug: string;
      content: string;
      excerpt: string | null;
      author_id: string;
      status: 'draft' | 'published' | 'archived';
      published_at: string | null;
      seo_title: string | null;
      seo_description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  blog_categories: {
    Row: {
      id: string;
      title: string;
      slug: string;
      description: string | null;
      created_at: string;
      updated_at: string;
    };
  };

  blog_post_categories: {
    Row: {
      post_id: string;
      category_id: string;
    };
  };

  tags: {
    Row: {
      id: string;
      title: string;
      slug: string;
      created_at: string;
    };
  };

  blog_post_tags: {
    Row: {
      post_id: string;
      tag_id: string;
    };
  };

  // Promotions
  promotions: {
    Row: {
      id: string;
      title: string;
      description: string | null;
      type: 'percentage' | 'fixed_amount';
      value: number;
      starts_at: string;
      ends_at: string | null;
      minimum_order_amount: number | null;
      usage_limit: number | null;
      used_count: number;
      status: 'active' | 'inactive' | 'expired';
      created_at: string;
      updated_at: string;
    };
  };

  promotion_rules: {
    Row: {
      id: string;
      promotion_id: string;
      type: 'product' | 'collection' | 'customer' | 'minimum_amount';
      value: string;
      created_at: string;
    };
  };

  // Analytics
  order_analytics: {
    Row: {
      date: string;
      total_orders: number;
      total_revenue: number;
      average_order_value: number;
      total_profit: number;
      profit_margin: number;
      return_rate: number;
      created_at: string;
    };
  };

  traffic_analytics: {
    Row: {
      date: string;
      page_views: number;
      unique_visitors: number;
      bounce_rate: number;
      average_session_duration: number;
      created_at: string;
    };
  };

  conversion_metrics: {
    Row: {
      date: string;
      cart_views: number;
      checkout_starts: number;
      checkout_completions: number;
      successful_orders: number;
      abandoned_cart_rate: number;
      created_at: string;
    };
  };

  // Settings
  settings: {
    Row: {
      key: string;
      value: string;
      created_at: string;
      updated_at: string;
    };
  };
} 