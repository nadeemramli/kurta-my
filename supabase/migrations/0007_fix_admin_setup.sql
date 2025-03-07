-- Drop the existing function if it exists
drop function if exists setup_admin_user(uuid, admin_role);

-- Recreate the function with fixed parameter reference
create or replace function setup_admin_user(
  p_user_id uuid,
  p_role admin_role
)
returns void
language plpgsql
security definer
as $$
begin
  -- First ensure the user exists
  if not exists (select 1 from auth.users where id = p_user_id) then
    raise exception 'User not found';
  end if;

  -- Update the user's metadata to set them as admin with the specified role
  update auth.users
  set raw_user_meta_data = 
    jsonb_build_object(
      'isAdmin', true,
      'role', p_role::text,
      'updatedAt', extract(epoch from now())
    )
  where id = p_user_id;
end;
$$;

-- Example usage and verification (commented out for safety):
/*
-- Set up a user as admin with owner role
SELECT setup_admin_user('d5461824-e24b-4886-8d55-ddbe19259e1f'::uuid, 'owner'::admin_role);

-- Verify the user's admin status and role
SELECT 
    email,
    raw_user_meta_data->>'isAdmin' as is_admin,
    raw_user_meta_data->>'role' as role,
    raw_user_meta_data->>'updatedAt' as last_updated
FROM auth.users 
WHERE id = 'd5461824-e24b-4886-8d55-ddbe19259e1f'::uuid;
*/