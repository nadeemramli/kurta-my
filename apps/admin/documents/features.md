

# Orders
- Backend (Admin App)
    - Orders (this is where we can see all the orders and their details)
         - draft orders (this is where we can create a new order manually, and connect to a customer)
         - order management (this is where we can see the order details and status, for us to update and process the order)
         - order details (historical view of the order, and the order details such as amount, payment status, shipping status, customer details, etc.)
    - Conversion Flow (this is where we can see the performance of the conversion funnel/order flow and abandoned orders)
    - Analytics (a dashboard to see the performance of the orders and the conversion rate)

   - Relationship with Frontend App
      - Order Flows (Add-to-cart, Checkout, Payment, etc.) - from the checkout page (an order is created (with status "pending"))
      - Order Detail and Status (if the customer opt to create an account, the order is updated with the customer id and status "paid", customer can then login and navigate to their profile to see order history and their recent orders details)


# Products
- Backend (Admin App)
   - Products (this is where user add their product)
        - Product Sheet (this is where user can add the product details, our product details is comprehensive from SEO, to variants, to inventory, to pricing, to images, to description, etc.)
   - Collections (this is where user can add their collection, and add products to the collection)

   - Relationship with Frontend App
      - Product List (product category page, for user to see the product list and filter by category, price, etc.)
      - Product Carousel (product carousel components for the add-to-cart page, and product detail page, homepage, etc.)
      - Product Detail (product detail page, for user to see the product details and add to cart, select variant, etc.)

# Customers 
- Customers
- Segments

   - Relationship with Frontend App
      - Customer Profile
      - Order History

Customer login and authentication
Customer communication channel (WhatsApp (WhatsApp Business API), (SMS, Email) using Amazon SES and SNS, etc.)


# Content
- Posts
- Taxanomies

   - Relationship with Frontend App

# Promotions
- Overview
- Discounts
- Coupons
- Loyalty Program 
- Referrals

   - Relationship with Frontend App

# Performance
- Advertisement
- Creative
- Recurring
- Reports