-- Function to directly set up an admin user with role
create or replace function setup_admin_user(
  user_id uuid,
  role admin_role
)
returns void
language plpgsql
security definer
as $$
begin
  -- First ensure the user exists
  if not exists (select 1 from auth.users where id = user_id) then
    raise exception 'User not found';
  end if;

  -- Update the user's metadata to set them as admin with the specified role
  update auth.users
  set raw_user_meta_data = 
    jsonb_build_object(
      'isAdmin', true,
      'role', role::text,
      'updatedAt', extract(epoch from now())
    )
  where id = user_id;
end;
$$; 