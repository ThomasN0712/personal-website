# Gift Match — Database Schema

Supabase (Postgres). Run the SQL below in the Supabase SQL editor.

---

## Tables

### `profiles`
One row per Gift Match profile. `owner_id` links to the Supabase Auth user who created it.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, auto-generated |
| `owner_id` | uuid | FK → `auth.users(id)` — null until magic link claimed |
| `slug` | text | Unique URL segment — `/gifts/thomas` |
| `display_name` | text | Shown on the quiz screen |
| `bio` | text | LLM system context — the profile owner's taste description |
| `companion_animal` | text | One of: `raccoon` `pig` `wolf` `horse` `gorilla` |
| `email` | text | Used for magic link auth, unique |
| `accent_color` | text | Optional hex override; falls back to animal palette |
| `is_public` | boolean | Whether profile appears in public directory |
| `created_at` | timestamptz | |
| `updated_at` | timestamptz | Auto-updated via trigger |

### `gifts`
Items on the profile owner's gift list. `x`/`y` place it in the 2D taste grid; `z` reserved for future use.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, auto-generated |
| `profile_id` | uuid | FK → `profiles.id` |
| `name` | text | Gift name |
| `description` | text | One-sentence description |
| `x` | float | Sentimental (−5) ↔ Experiential (+5) |
| `y` | float | Functional (−5) ↔ Aesthetic (+5) |
| `z` | float | Reserved — nullable |
| `price` | numeric | Numeric price |
| `price_tier` | text | `Under $30` / `$30–$50` |
| `store_name` | text | e.g. "Williams Sonoma" |
| `store_url` | text | Optional direct link |
| `is_active` | boolean | Soft-delete; false hides from quiz results |
| `sort_order` | int | Display order in admin |
| `created_at` | timestamptz | |

### `action_gifts`
2–3 free/low-cost gesture suggestions set by the profile owner. Not algorithm-driven.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, auto-generated |
| `profile_id` | uuid | FK → `profiles.id` |
| `emoji` | text | Single emoji for visual identity |
| `title` | text | Short label |
| `body` | text | One-sentence description |
| `sort_order` | int | Display order |
| `created_at` | timestamptz | |

### `claims`
Append-only. Each row = one person claiming one gift. No client update or delete.

| Column | Type | Notes |
|---|---|---|
| `id` | uuid | PK, auto-generated |
| `gift_id` | uuid | FK → `gifts.id` |
| `claimer_name` | text | Optional — never shown to other visitors |
| `claimed_at` | timestamptz | |

---

## SQL

```sql
-- ============================================================
-- 0. Extension
-- ============================================================
create extension if not exists "uuid-ossp";


-- ============================================================
-- 1. profiles
-- ============================================================
create table public.profiles (
  id               uuid        primary key default gen_random_uuid(),
  owner_id         uuid        references auth.users(id) on delete set null,
  slug             text        unique not null,
  display_name     text        not null,
  bio              text,
  companion_animal text        not null
                               check (companion_animal in ('raccoon','pig','wolf','horse','gorilla')),
  email            text        unique not null,
  accent_color     text,
  is_public        boolean     not null default true,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);


-- ============================================================
-- 2. gifts
-- ============================================================
create table public.gifts (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        not null references public.profiles(id) on delete cascade,
  name        text        not null,
  description text,
  x           float       not null check (x between -5 and 5),
  y           float       not null check (y between -5 and 5),
  z           float                check (z between -5 and 5),
  price       numeric              check (price >= 0),
  price_tier  text                 check (price_tier in ('Under $30','$30–$50')),
  store_name  text,
  store_url   text,
  is_active   boolean     not null default true,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- 3. action_gifts
-- ============================================================
create table public.action_gifts (
  id          uuid        primary key default gen_random_uuid(),
  profile_id  uuid        not null references public.profiles(id) on delete cascade,
  emoji       text,
  title       text        not null,
  body        text        not null,
  sort_order  int         not null default 0,
  created_at  timestamptz not null default now()
);


-- ============================================================
-- 4. claims (append-only)
-- ============================================================
create table public.claims (
  id            uuid        primary key default gen_random_uuid(),
  gift_id       uuid        not null references public.gifts(id) on delete cascade,
  claimer_name  text,
  claimed_at    timestamptz not null default now()
);


-- ============================================================
-- 5. updated_at trigger
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ============================================================
-- 6. Indexes
-- ============================================================
create index gifts_profile_id_idx        on public.gifts(profile_id);
create index gifts_profile_active_idx    on public.gifts(profile_id) where is_active = true;
create index action_gifts_profile_id_idx on public.action_gifts(profile_id);
create index claims_gift_id_idx          on public.claims(gift_id);
create index claims_claimed_at_idx       on public.claims(claimed_at desc);
create index profiles_owner_id_idx       on public.profiles(owner_id);


-- ============================================================
-- 7. Row-Level Security
-- ============================================================
alter table public.profiles     enable row level security;
alter table public.gifts        enable row level security;
alter table public.action_gifts enable row level security;
alter table public.claims       enable row level security;

-- profiles
create policy "profiles_select_public"
  on public.profiles for select using (true);

create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = owner_id);

create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = owner_id);

-- gifts
create policy "gifts_select_public"
  on public.gifts for select using (true);

create policy "gifts_insert_own"
  on public.gifts for insert
  with check (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

create policy "gifts_update_own"
  on public.gifts for update
  using (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

create policy "gifts_delete_own"
  on public.gifts for delete
  using (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

-- action_gifts
create policy "action_gifts_select_public"
  on public.action_gifts for select using (true);

create policy "action_gifts_insert_own"
  on public.action_gifts for insert
  with check (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

create policy "action_gifts_update_own"
  on public.action_gifts for update
  using (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

create policy "action_gifts_delete_own"
  on public.action_gifts for delete
  using (
    auth.uid() = (
      select owner_id from public.profiles where id = profile_id
    )
  );

-- claims: public read + insert; no update/delete from client
create policy "claims_select_public"
  on public.claims for select using (true);

create policy "claims_insert_public"
  on public.claims for insert with check (true);
```

---

## Auth Model

- Profile creation goes through `POST /api/gifts/create` (server route, service role key) OR directly from the browser after magic link auth — RLS enforces `auth.uid() = owner_id`.
- Claims are fully public — no auth required. The `claims_insert_public` policy allows anonymous inserts.
- Admin view at `/gifts/[slug]/admin` is protected by Supabase Auth session — only the `owner_id` user can access it.

---

## Seed — Thomas's Profile

```sql
-- Run after schema creation. Replace owner_id with the actual auth.users UUID after first login.
insert into public.profiles (owner_id, slug, display_name, bio, companion_animal, email)
values (
  null,  -- fill in after magic link auth
  'thomas',
  'Thomas',
  'Mid-twenties, lives in the LA area. Intensely fitness-oriented — lifts almost daily, training for his first marathon. Software developer. Interested in personal finance, astrophysics, and geopolitics. Quality over quantity — well-made, lasting things. Enjoys good coffee, cooking, and eating well. Minimalist but considered aesthetic. Practical, not sentimental.',
  'wolf',
  'thomas@example.com'
);
```
