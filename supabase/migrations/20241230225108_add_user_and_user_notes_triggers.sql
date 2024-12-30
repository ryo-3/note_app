alter table "public"."users" drop column "email";

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.add_user_note()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
    INSERT INTO public.user_notes (user_id)
    VALUES (NEW.id);
    RETURN NEW;
END;
$function$
;

CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
AS $function$
BEGIN
  -- デバッグログを追加
  RAISE NOTICE 'Trigger fired for auth.users ID: %', NEW.id;

  -- `users` テーブルにデータを挿入
  INSERT INTO public.users (id, user_name, created_at)
  VALUES (NEW.id, '', NOW()) -- user_name を空に設定
  ON CONFLICT (id) DO NOTHING;

  RETURN NEW;
END;
$function$
;

CREATE TRIGGER after_user_insert AFTER INSERT ON public.users FOR EACH ROW EXECUTE FUNCTION add_user_note();


