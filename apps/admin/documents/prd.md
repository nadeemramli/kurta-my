
# E-commerce Admin Dashboard PRD

This is a PRD created by the an AI as an iteration of the @prd-overview.md, this is version of elaboration of the features we need.


1. Orders
   1. Order Analytics
      - Page: /order-analytics
      - Components:
        - MetricCard (reusable)
        - ChartCard (reusable)
        - DateRangePicker
        - AnalyticsFilters
      - User Story: 
        - As an admin, I want to see the performance of our orders at a glance
        - As an admin, I want to filter analytics by date range and other parameters
      - Required Actions:
        - View total orders count
        - Track orders items over time
        - Monitor return rate
        - Analyze average order value
        - Track total revenue
        - Calculate total profit
        - Measure total profit margin
        - View profit margin percentage
        - Visualize total orders over time
      - Database Schema:
        ```sql
        Orders (
          id UUID PRIMARY KEY,
          created_at TIMESTAMP,
          total_amount DECIMAL,
          cost_amount DECIMAL,
          profit_amount DECIMAL,
          profit_margin_percentage DECIMAL,
          status VARCHAR,
          is_returned BOOLEAN
        )

        OrderAnalytics (
          date DATE PRIMARY KEY,
          total_orders INTEGER,
          total_revenue DECIMAL,
          total_profit DECIMAL,
          average_order_value DECIMAL,
          return_rate DECIMAL
        )
        ```
      - API Endpoints:
        - GET /api/analytics/orders/metrics
        - GET /api/analytics/orders/trends
        - GET /api/analytics/orders/returns

   2. Orders List
      - Page: /orders
      - Views: 
        - List view (/orders/list)
        - Kanban board (/orders/kanban)
        - Calendar view (/orders/calendar)
      - Components:
        - OrdersTable
        - OrdersKanbanBoard
        - OrdersCalendar
        - OrderDetailsModal
        - OrderActionsMenu
      - User Story:
        - As an admin, I want to view and manage orders in different layouts
        - As an admin, I want to quickly access order details and perform actions
      - Required Actions:
        - View order details
          - Order items
          - Order status
          - Payment details
          - Shipping info
          - Tax details
          - Order date
          - Order tags
          - Customer information
        - Edit order
          - Update status
          - Modify total
          - Change date
          - Manage actions
        - Delete order
          - Confirm deletion
          - Cancel deletion
      - Database Schema:
        ```sql
        Orders (
          id UUID PRIMARY KEY,
          customer_id UUID,
          status VARCHAR,
          total_amount DECIMAL,
          shipping_amount DECIMAL,
          tax_amount DECIMAL,
          discount_amount DECIMAL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          tags TEXT[],
          FOREIGN KEY (customer_id) REFERENCES Customers(id)
        )

        OrderItems (
          id UUID PRIMARY KEY,
          order_id UUID,
          product_id UUID,
          quantity INTEGER,
          unit_price DECIMAL,
          total_price DECIMAL,
          FOREIGN KEY (order_id) REFERENCES Orders(id),
          FOREIGN KEY (product_id) REFERENCES Products(id)
        )
        ```
      - API Endpoints:
        - GET /api/orders
        - GET /api/orders/:id
        - PUT /api/orders/:id
        - DELETE /api/orders/:id
        - GET /api/orders/:id/items

   3. Order Draft
      - Page: /orders/draft
      - Components:
        - DraftOrderForm
        - ProductSelector
        - CustomerSelector
        - OrderSummary
      - User Story:
        - As an admin, I want to manually create orders for phone/email customers
      - Required Actions:
        - Create draft order
        - Add/remove items
        - Set customer details
        - Calculate totals
        - Convert to actual order
      - Database Schema:
        ```sql
        DraftOrders (
          id UUID PRIMARY KEY,
          status VARCHAR,
          customer_id UUID,
          total_amount DECIMAL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          FOREIGN KEY (customer_id) REFERENCES Customers(id)
        )

        DraftOrderItems (
          id UUID PRIMARY KEY,
          draft_order_id UUID,
          product_id UUID,
          quantity INTEGER,
          unit_price DECIMAL,
          total_price DECIMAL,
          FOREIGN KEY (draft_order_id) REFERENCES DraftOrders(id),
          FOREIGN KEY (product_id) REFERENCES Products(id)
        )
        ```
      - API Endpoints:
        - GET /api/draft-orders
        - POST /api/draft-orders
        - PUT /api/draft-orders/:id
        - DELETE /api/draft-orders/:id
        - POST /api/draft-orders/:id/convert


// ... existing code ...

2. Products
   1. Product List & Management
      - Page: /products
      - Components:
        - ProductsTable
        - ProductsGrid
        - ProductFilters
        - ProductBulkActions
        - ProductQuickEdit
      - User Story:
        - As an admin, I want to view and manage all products in my inventory
        - As an admin, I want to quickly edit product details without leaving the list view
      - Required Actions:
        - View all products
        - Filter and search products
        - Quick edit product details
        - Bulk actions (status update, delete, categorize)
      - Database Schema:
        ```sql
        Products (
          id UUID PRIMARY KEY,
          title VARCHAR,
          description TEXT,
          status VARCHAR,
          base_price DECIMAL,
          compare_at_price DECIMAL,
          cost DECIMAL,
          sale_price DECIMAL,
          profit_margin DECIMAL,
          profit_margin_percentage DECIMAL,
          created_at TIMESTAMP,
          updated_at TIMESTAMP
        )
        ```
      - API Endpoints:
        - GET /api/products
        - GET /api/products/search
        - POST /api/products/bulk-action
        - GET /api/products/stats

   2. Product Details/Edit
      - Page: /products/[id]
      - Components:
        - ProductForm
        - VariantEditor
        - MediaUploader
        - PricingCalculator
        - SEOEditor
        - InventoryManager
      - User Story:
        - As an admin, I want to create and edit detailed product information
        - As an admin, I want to manage product variants and options
      - Required Actions:
        - Edit basic info (title, description)
        - Manage pricing (compare-at-price, cost, sale price)
        - Calculate profit margins
        - Set product status
        - Manage organization (category, collection, tag)
        - Handle variants and options
        - Upload media (images, videos, files)
        - Configure SEO settings
      - Database Schema:
        ```sql
        ProductVariants (
          id UUID PRIMARY KEY,
          product_id UUID,
          title VARCHAR,
          sku VARCHAR,
          price DECIMAL,
          inventory_quantity INTEGER,
          options JSONB,
          FOREIGN KEY (product_id) REFERENCES Products(id)
        )

        ProductMedia (
          id UUID PRIMARY KEY,
          product_id UUID,
          type VARCHAR,
          url VARCHAR,
          is_main BOOLEAN,
          position INTEGER,
          FOREIGN KEY (product_id) REFERENCES Products(id)
        )

        ProductSEO (
          product_id UUID PRIMARY KEY,
          title VARCHAR,
          meta_description TEXT,
          keywords TEXT[],
          FOREIGN KEY (product_id) REFERENCES Products(id)
        )
        ```
      - API Endpoints:
        - GET /api/products/:id
        - PUT /api/products/:id
        - POST /api/products
        - DELETE /api/products/:id
        - POST /api/products/:id/media
        - PUT /api/products/:id/variants

   3. Product Categories & Collections
      - Page: /products/categories
      - Components:
        - CategoryTree
        - CategoryForm
        - CollectionManager
        - TagManager
        - ProductAssigner
      - User Story:
        - As an admin, I want to organize products into categories, collections, and tags
        - As an admin, I want to manage product hierarchies and relationships
      - Required Actions:
        - Create/edit categories
        - Manage collections
        - Handle tags
        - Assign products to categories
        - Reorder categories
        - Manage category hierarchy
      - Database Schema:
        ```sql
        Categories (
          id UUID PRIMARY KEY,
          title VARCHAR,
          description TEXT,
          parent_id UUID,
          type VARCHAR,
          position INTEGER,
          created_at TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES Categories(id)
        )

        ProductCategories (
          product_id UUID,
          category_id UUID,
          PRIMARY KEY (product_id, category_id),
          FOREIGN KEY (product_id) REFERENCES Products(id),
          FOREIGN KEY (category_id) REFERENCES Categories(id)
        )
        ```
      - API Endpoints:
        - GET /api/categories
        - POST /api/categories
        - PUT /api/categories/:id
        - DELETE /api/categories/:id
        - POST /api/categories/:id/products
        - PUT /api/categories/reorder

3. Customers
   1. Customer List
      - Page: /customers
      - Components:
        - CustomersTable
        - CustomerFilters
        - CustomerQuickView
        - CustomerSegments
      - User Story:
        - As an admin, I want to view and manage customer information
        - As an admin, I want to segment customers based on their behavior
      - Required Actions:
        - View customer list
        - Search and filter customers
        - View quick customer details
        - Manage customer segments
        - Export customer data
      - Database Schema:
        ```sql
        Customers (
          id UUID PRIMARY KEY,
          first_name VARCHAR,
          last_name VARCHAR,
          email VARCHAR UNIQUE,
          phone VARCHAR,
          total_orders INTEGER,
          total_spent DECIMAL,
          created_at TIMESTAMP,
          last_order_at TIMESTAMP
        )

        CustomerSegments (
          id UUID PRIMARY KEY,
          name VARCHAR,
          criteria JSONB,
          created_at TIMESTAMP
        )
        ```
      - API Endpoints:
        - GET /api/customers
        - GET /api/customers/search
        - GET /api/customers/segments
        - POST /api/customers/export

   2. Customer Details
      - Page: /customers/[id]
      - Components:
        - CustomerProfile
        - OrderHistory
        - CustomerNotes
        - CustomerMetrics
        - AddressBook
      - User Story:
        - As an admin, I want to view detailed customer information
        - As an admin, I want to track customer interactions and history
      - Required Actions:
        - View customer details
        - See order history
        - Manage customer notes
        - View customer metrics
        - Manage addresses
      - Database Schema:
        ```sql
        CustomerAddresses (
          id UUID PRIMARY KEY,
          customer_id UUID,
          type VARCHAR,
          address_line1 VARCHAR,
          address_line2 VARCHAR,
          city VARCHAR,
          state VARCHAR,
          postal_code VARCHAR,
          country VARCHAR,
          is_default BOOLEAN,
          FOREIGN KEY (customer_id) REFERENCES Customers(id)
        )

        CustomerNotes (
          id UUID PRIMARY KEY,
          customer_id UUID,
          note TEXT,
          created_at TIMESTAMP,
          created_by UUID,
          FOREIGN KEY (customer_id) REFERENCES Customers(id)
        )
        ```
      - API Endpoints:
        - GET /api/customers/:id
        - PUT /api/customers/:id
        - GET /api/customers/:id/orders
        - POST /api/customers/:id/notes
        - GET /api/customers/:id/addresses

// ... existing code ...

4. Content
   1. Content Management
      - Page: /content
      - Components:
        - ContentTable
        - ContentEditor
        - MediaLibrary
        - ContentPreview
        - VersionHistory
      - User Story:
        - As an admin, I want to create and manage website content
        - As an admin, I want to preview content before publishing
      - Required Actions:
        - Create/edit content
        - Manage media files
        - Preview content
        - Version control
        - Schedule publications
      - Database Schema:
        ```sql
        Content (
          id UUID PRIMARY KEY,
          title VARCHAR,
          slug VARCHAR UNIQUE,
          content TEXT,
          status VARCHAR,
          author_id UUID,
          published_at TIMESTAMP,
          created_at TIMESTAMP,
          updated_at TIMESTAMP,
          FOREIGN KEY (author_id) REFERENCES Users(id)
        )

        ContentVersions (
          id UUID PRIMARY KEY,
          content_id UUID,
          version INTEGER,
          content TEXT,
          created_at TIMESTAMP,
          created_by UUID,
          FOREIGN KEY (content_id) REFERENCES Content(id),
          FOREIGN KEY (created_by) REFERENCES Users(id)
        )
        ```
      - API Endpoints:
        - GET /api/content
        - POST /api/content
        - PUT /api/content/:id
        - DELETE /api/content/:id
        - GET /api/content/:id/versions
        - POST /api/content/:id/publish

   2. Media Library
      - Page: /content/media
      - Components:
        - MediaGrid
        - MediaUploader
        - MediaOrganizer
        - ImageEditor
      - User Story:
        - As an admin, I want to manage all media assets in one place
        - As an admin, I want to organize and search media files easily
      - Required Actions:
        - Upload media
        - Organize files
        - Edit images
        - Search media
        - Filter by type
      - Database Schema:
        ```sql
        Media (
          id UUID PRIMARY KEY,
          type VARCHAR,
          filename VARCHAR,
          url VARCHAR,
          size INTEGER,
          metadata JSONB,
          folder_id UUID,
          created_at TIMESTAMP,
          FOREIGN KEY (folder_id) REFERENCES MediaFolders(id)
        )

        MediaFolders (
          id UUID PRIMARY KEY,
          name VARCHAR,
          parent_id UUID,
          created_at TIMESTAMP,
          FOREIGN KEY (parent_id) REFERENCES MediaFolders(id)
        )
        ```
      - API Endpoints:
        - GET /api/media
        - POST /api/media/upload
        - DELETE /api/media/:id
        - PUT /api/media/:id/move
        - POST /api/media/folders

5. Promotions
   1. Promotion Management
      - Page: /promotions
      - Components:
        - PromotionsTable
        - PromotionEditor
        - DiscountCalculator
        - PromotionScheduler
      - User Story:
        - As an admin, I want to create and manage promotional campaigns
        - As an admin, I want to track promotion performance
      - Required Actions:
        - Create promotions
        - Set discount rules
        - Schedule campaigns
        - Track usage
        - Analyze results
      - Database Schema:
        ```sql
        Promotions (
          id UUID PRIMARY KEY,
          name VARCHAR,
          code VARCHAR UNIQUE,
          type VARCHAR,
          value DECIMAL,
          min_purchase_amount DECIMAL,
          usage_limit INTEGER,
          used_count INTEGER,
          starts_at TIMESTAMP,
          ends_at TIMESTAMP,
          status VARCHAR,
          created_at TIMESTAMP
        )

        PromotionUsage (
          id UUID PRIMARY KEY,
          promotion_id UUID,
          order_id UUID,
          customer_id UUID,
          used_at TIMESTAMP,
          FOREIGN KEY (promotion_id) REFERENCES Promotions(id),
          FOREIGN KEY (order_id) REFERENCES Orders(id),
          FOREIGN KEY (customer_id) REFERENCES Customers(id)
        )
        ```
      - API Endpoints:
        - GET /api/promotions
        - POST /api/promotions
        - PUT /api/promotions/:id
        - DELETE /api/promotions/:id
        - GET /api/promotions/:id/usage

6. Analytics
   1. Dashboard Analytics
      - Page: /analytics
      - Components:
        - MetricsOverview
        - SalesChart
        - CustomerMetrics
        - ProductPerformance
        - DateRangePicker
      - User Story:
        - As an admin, I want to view key business metrics
        - As an admin, I want to analyze trends and patterns
      - Required Actions:
        - View sales metrics
        - Analyze customer behavior
        - Track product performance
        - Monitor inventory
        - Export reports
      - Database Schema:
        ```sql
        Analytics (
          date DATE PRIMARY KEY,
          total_sales DECIMAL,
          order_count INTEGER,
          customer_count INTEGER,
          average_order_value DECIMAL,
          top_products JSONB,
          top_categories JSONB
        )

        AnalyticsEvents (
          id UUID PRIMARY KEY,
          event_type VARCHAR,
          event_data JSONB,
          created_at TIMESTAMP
        )
        ```
      - API Endpoints:
        - GET /api/analytics/dashboard
        - GET /api/analytics/sales
        - GET /api/analytics/customers
        - GET /api/analytics/products
        - POST /api/analytics/export

7. Settings
   1. System Settings
      - Page: /settings
      - Components:
        - GeneralSettings
        - PaymentSettings
        - ShippingSettings
        - TaxSettings
        - UserManagement
        - StoreCustomization
      - User Story:
        - As an admin, I want to configure system settings
        - As an admin, I want to manage user permissions
      - Required Actions:
        - Configure general settings
        - Set up payment methods
        - Manage shipping options
        - Configure tax rules
        - Manage user roles
        - Customize store
      - Database Schema:
        ```sql
        Settings (
          key VARCHAR PRIMARY KEY,
          value JSONB,
          updated_at TIMESTAMP
        )

        Users (
          id UUID PRIMARY KEY,
          email VARCHAR UNIQUE,
          role VARCHAR,
          permissions JSONB,
          created_at TIMESTAMP,
          last_login TIMESTAMP
        )
        ```
      - API Endpoints:
        - GET /api/settings
        - PUT /api/settings
        - GET /api/users
        - POST /api/users
        - PUT /api/users/:id
        - DELETE /api/users/:id