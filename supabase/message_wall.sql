-- Message wall (lined paper) for the portfolio. Run this once in the Supabase SQL editor.
--
-- How it stays safe with only the public anon key:
--   * Visitors can READ notes (position + text) but never the secret edit token.
--   * Visitors can't insert, update or delete the table directly. They go through two functions:
--       add_wall_note  -> saves a note and hands back a fresh edit token (kept in that browser tab only)
--       edit_wall_note -> changes or removes a note, but only with that note's token
--     So nobody can change or remove someone else's note.
--   * To hide a note yourself, set approved = false in the Table Editor (or delete the row there).
--
-- If you ran the older version of this file, the old table can go:  drop table if exists public.messages;

create extension if not exists pgcrypto;

create table if not exists public.wall_notes (
	id uuid primary key default gen_random_uuid(),
	created_at timestamptz not null default now(),
	updated_at timestamptz not null default now(),
	x real not null check (x >= 0 and x <= 1),
	line integer not null check (line between 0 and 2000),
	body text not null check (char_length(trim(body)) between 1 and 280),
	edit_token uuid not null default gen_random_uuid(),
	approved boolean not null default true
);

alter table public.wall_notes enable row level security;

-- read approved notes, without the token column
revoke all on public.wall_notes from anon, authenticated;
grant select (id, created_at, x, line, body) on public.wall_notes to anon, authenticated;

drop policy if exists "Anyone can read approved notes" on public.wall_notes;
create policy "Anyone can read approved notes"
	on public.wall_notes for select
	to anon, authenticated
	using (approved);

-- write a new note; returns its id and the edit token
create or replace function public.add_wall_note(p_x real, p_line integer, p_body text)
returns table (id uuid, token uuid)
language plpgsql
security definer
set search_path = public
as $$
begin
	-- light flood guard: at most 30 new notes a minute across the whole wall
	if (select count(*) from wall_notes w where w.created_at > now() - interval '1 minute') >= 30 then
		raise exception 'The wall is busy, try again in a minute';
	end if;

	return query
	insert into wall_notes (x, line, body)
	values (least(greatest(p_x, 0), 1), p_line, trim(p_body))
	returning wall_notes.id, wall_notes.edit_token;
end;
$$;

-- change your own note (an empty body removes it); false if the token doesn't match
create or replace function public.edit_wall_note(p_id uuid, p_token uuid, p_body text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
	n integer;
begin
	if coalesce(trim(p_body), '') = '' then
		delete from wall_notes w where w.id = p_id and w.edit_token = p_token;
	else
		update wall_notes w set body = trim(p_body), updated_at = now()
		where w.id = p_id and w.edit_token = p_token;
	end if;
	get diagnostics n = row_count;
	return n > 0;
end;
$$;

revoke all on function public.add_wall_note(real, integer, text) from public;
revoke all on function public.edit_wall_note(uuid, uuid, text) from public;
grant execute on function public.add_wall_note(real, integer, text) to anon, authenticated;
grant execute on function public.edit_wall_note(uuid, uuid, text) to anon, authenticated;
