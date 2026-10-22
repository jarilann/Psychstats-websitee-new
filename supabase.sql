create table if not exists survey_responses (
  id uuid default gen_random_uuid() primary key,
  created_at timestamptz default now(),
  ticket_number text unique not null,
  payload jsonb not null
);
alter table survey_responses enable row level security;

-- Anyone can submit a response, nobody but a logged-in researcher can read or delete.
create policy "public can submit" on survey_responses for insert to anon with check (true);
create policy "researchers can read" on survey_responses for select to authenticated using (true);
create policy "researchers can delete" on survey_responses for delete to authenticated using (true);
