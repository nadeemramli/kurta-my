-- Create enum for admin roles
create type admin_role as enum (
  'owner',
  'operations',
  'marketing',
  'support',
  'content'
);

-- Create function to set user as admin with role
create or replace function set_admin_role(
  user_id uuid,
  role admin_role
)
returns void
language plpgsql
security definer
as $$
begin
  update auth.users
  set raw_user_meta_data = 
    coalesce(raw_user_meta_data, '{}'::jsonb) || 
    jsonb_build_object(
      'isAdmin', true,
      'role', role::text,
      'updatedAt', extract(epoch from now())
    )
  where id = user_id;
end;
$$;

-- Create function to remove admin status
create or replace function remove_admin_role(user_id uuid)
returns void
language plpgsql
security definer
as $$
begin
  update auth.users
  set raw_user_meta_data = 
    raw_user_meta_data - 'isAdmin' - 'role'
  where id = user_id;
end;
$$;

-- Create function to get user's admin role
create or replace function get_admin_role(user_id uuid)
returns text
language plpgsql
security definer
as $$
declare
  user_role text;
begin
  select raw_user_meta_data->>'role'
  into user_role
  from auth.users
  where id = user_id;
  
  return user_role;
end;
$$;

-- Create function to check if user has specific admin role
create or replace function has_admin_role(
  user_id uuid,
  required_role admin_role
)
returns boolean
language plpgsql
security definer
as $$
declare
  user_role text;
  is_admin boolean;
begin
  select 
    raw_user_meta_data->>'role',
    (raw_user_meta_data->>'isAdmin')::boolean
  into 
    user_role,
    is_admin
  from auth.users
  where id = user_id;
  
  -- Owner role has access to everything
  if user_role = 'owner' then
    return true;
  end if;
  
  -- Check if user is admin and has the required role
  return coalesce(is_admin, false) and user_role = required_role::text;
end;
$$;

-- Create RLS policy helper function
create or replace function has_admin_access(required_role admin_role)
returns boolean
language plpgsql
security definer
as $$
begin
  return has_admin_role(auth.uid(), required_role);
end;
$$;

-- Create RLS policies for admin access
-- Example: Orders management
create policy "Only operations can manage orders"
  on orders
  for all
  to authenticated
  using (has_admin_access('operations'));

-- Example: Content management
create policy "Only content team can manage products"
  on products
  for all
  to authenticated
  using (has_admin_access('content'));

-- Example: Marketing management
create policy "Only marketing can manage promotions"
  on promotions
  for all
  to authenticated
  using (has_admin_access('marketing'));

-- Example: Support management
create policy "Only support can access customer data"
  on customers
  for select
  to authenticated
  using (has_admin_access('support'));

-- Owner has access to everything by default
-- No need for specific policies as the has_admin_access function
-- automatically grants access to owners 