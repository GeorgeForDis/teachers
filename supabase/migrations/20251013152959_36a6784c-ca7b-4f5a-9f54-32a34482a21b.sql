-- Drop the problematic recursive policy that causes infinite recursion
DROP POLICY IF EXISTS "Admins can manage roles" ON public.user_roles;

-- Create the correct policy using has_role function with SECURITY DEFINER
-- This bypasses RLS and prevents infinite recursion
CREATE POLICY "Admins can manage all roles"
  ON public.user_roles
  FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));