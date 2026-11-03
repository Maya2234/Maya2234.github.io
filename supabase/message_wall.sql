-- Message wall table for the portfolio. Run this once in the Supabase SQL editor.
-- Visitors (the anon key) can read approved messages and add new ones; nobody can edit or delete
-- through the API. To hide a message, set approved = false in the Table Editor.

create table if not exists public.messages (
	id bigint generated always as identity primary key,
	created_at timestamptz not null default now(),
	name text not null check (char_length(trim(name)) between 1 and 40),
	message text not null check (char_length(trim(message)) between 1 and 280),
	sticker text not null default 'sparkle' check (sticker in ('sparkle', 'star', 'heart', 'bubble')),
	color text not null default 'pink' check (color in ('pink', 'cyan', 'white')),
	approved boolean not null default true
);

alter table public.messages enable row level security;

create policy "Anyone can read approved messages"
	on public.messages for select
	to anon
	using (approved);

create policy "Anyone can post a message"
	on public.messages for insert
	to anon
	with check (approved);
