-- 1. Rollenprüfung nur noch für die eigene Person (oder Server)
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
 RETURNS boolean
 LANGUAGE sql
 STABLE SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT (_user_id = auth.uid() OR auth.role() = 'service_role')
    AND EXISTS (
      SELECT 1 FROM public.user_roles
      WHERE user_id = _user_id AND role = _role
    )
$function$;

REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.has_role(uuid, app_role) TO authenticated, service_role;

-- 2. Budget-Zeilen dürfen Teilnehmende nicht mehr selbst anlegen oder ändern
DROP POLICY IF EXISTS "Users can insert own api keys" ON public.user_api_keys;
DROP POLICY IF EXISTS "Users can update own api keys" ON public.user_api_keys;

-- 3. Kurse: nur der eigene Kurs bzw. alle für Admins
DROP POLICY IF EXISTS "Anyone can read courses" ON public.courses;
CREATE POLICY "Users can read own course, admins all"
ON public.courses
FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
  OR id = (SELECT up.course_id FROM public.user_profiles up WHERE up.id = auth.uid())
);