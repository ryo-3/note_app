alter table "public"."notes" drop constraint "note_id_key";

alter table "public"."notes" drop constraint "notes_user_notes_id_fkey";

drop index if exists "public"."note_id_key";

CREATE UNIQUE INDEX notes_pkey ON public.notes USING btree (id);

alter table "public"."notes" add constraint "notes_pkey" PRIMARY KEY using index "notes_pkey";

alter table "public"."notes" add constraint "notes_user_notes_id_fkey" FOREIGN KEY (user_notes_id) REFERENCES user_notes(id) ON UPDATE RESTRICT ON DELETE SET DEFAULT not valid;

alter table "public"."notes" validate constraint "notes_user_notes_id_fkey";


