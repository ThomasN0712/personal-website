-- Gift Match — Seed Data for Thomas's Profile
-- Run this in the Supabase SQL editor AFTER running DB_SCHEMA.md
--
-- NOTE: owner_id is left NULL here (no Supabase Auth user yet).
-- After you authenticate via magic link, run:
--   update public.profiles set owner_id = auth.uid() where slug = 'thomas';
--
-- IMPORTANT: If re-seeding, delete existing data first:
--   delete from public.gifts where profile_id = (select id from public.profiles where slug = 'thomas');
--   delete from public.action_gifts where profile_id = (select id from public.profiles where slug = 'thomas');
--   delete from public.profiles where slug = 'thomas';

do $$
declare
  pid uuid;
begin

  -- ── Profile ──────────────────────────────────────────────────────────────────
  insert into public.profiles (slug, display_name, bio, companion_animal, email, is_public)
  values (
    'thomas',
    'Thomas',
    'Mid-twenties, lives in the LA area. Intensely fitness-oriented — lifts almost daily, training for his first marathon. Software developer. Interested in personal finance, astrophysics, and geopolitics. Quality over quantity — appreciates well-made, lasting things. Enjoys good coffee, cooking, and eating well. Minimalist but considered aesthetic. Not sentimental in a sappy way — values practicality and intentionality. Already has lots of running gear and standard workout equipment. Responds well to things that help him perform, learn, or eat/drink well. Bad fit: generic novelty gifts, purely decorative items, anything cheap-feeling.',
    'wolf',
    'thomas@thomasnguyen.tech',
    true
  )
  returning id into pid;


  -- ── Gifts ────────────────────────────────────────────────────────────────────
  -- Price tiers: 'Under $30' (≤$29) · '$30–$50' ($30–$50)
  -- x/y axes: x = practical↔aesthetic, y = performance↔social
  --   high x = performance/active, low x = aesthetic/refined
  --   high y = social/experiential, low y = functional/serious

  insert into public.gifts (profile_id, name, description, x, y, price, price_tier, store_name, sort_order) values

    -- ── Under $30 ────────────────────────────────────────────────────────────
    (pid, 'LMNT Electrolyte Variety Pack',
      'Hydration built around performance, not sweetness. 30 sticks, every flavor.',
       2.5, -2.5, 25, 'Under $30', 'DrinkLMNT.com', 1),

    (pid, 'Balega Blister-Resist Socks 3-Pack',
      'The last socks you''ll ever have to think about.',
       1.5, -2.0, 22, 'Under $30', 'REI', 2),

    (pid, 'What I Talk About When I Talk About Running',
      'The best book about running that isn''t really about running.',
       1.5,  0.5, 14, 'Under $30', 'Bookshop.org', 3),

    (pid, 'Single-Origin Coffee Bag',
      'Beans worth waking up for. One bag, rotating roaster.',
       0.5, -1.5, 20, 'Under $30', 'Onyx Coffee Lab', 4),

    (pid, 'The Almanack of Naval Ravikant',
      'Wealth, happiness, and judgment — distilled into something you''ll actually finish.',
       1.5, -0.5, 15, 'Under $30', 'Amazon', 5),

    (pid, 'Mini Succulent Trio',
      'Low maintenance. Still alive a year from now.',
      -1.5,  2.0, 18, 'Under $30', 'The Sill', 6),

    (pid, 'Brightland Alive Olive Oil',
      'You''ll notice the difference immediately. 375ml — the right size to actually use up.',
      -0.5, -2.0, 28, 'Under $30', 'Brightland', 7),

    (pid, 'TriggerPoint Grid Foam Roller',
      'The one recovery tool that actually earns its shelf space.',
       2.0, -1.5, 28, 'Under $30', 'REI', 8),

    -- ── $30–$50 ──────────────────────────────────────────────────────────────
    (pid, 'Bialetti Moka Pot (6-cup)',
      'Espresso before the sun comes up. Will outlast most appliances.',
       0.5, -2.5, 40, '$30–$50', 'Williams Sonoma', 9),

    (pid, 'Lodge Cast Iron Skillet',
      'The last pan they''ll ever need. Seasoned, indestructible, honest.',
       0.0, -3.0, 30, '$30–$50', 'Lodge', 10),

    (pid, 'Aged Balsamic from Modena',
      'The real stuff — not the watered-down grocery store version. Elevates everything.',
      -0.5, -1.5, 40, '$30–$50', 'Eataly', 11),

    (pid, 'Boy Smells Cedar Stack Candle',
      'A scent that knows what kind of room it''s in.',
      -1.0,  2.5, 35, '$30–$50', 'Boy Smells', 12),

    (pid, 'A Bottle of Bulleit Bourbon',
      'Better than the usual gift bottle. Goes further than wine.',
       0.5,  1.5, 35, '$30–$50', 'Total Wine', 13),

    (pid, 'Kinto SCS Pour-Over Coffee Set',
      'Minimal, beautiful, makes coffee ritual feel intentional.',
       1.0, -2.0, 45, '$30–$50', 'Kinto', 14),

    (pid, 'Nomad Slim Leather Card Wallet',
      'Fewer things, better made. Ages better than anything synthetic.',
      -1.5, -0.5, 45, '$30–$50', 'Nomad', 15),

    (pid, 'Salt Fat Acid Heat',
      'The only cookbook that teaches you to cook instead of just listing recipes.',
       0.0, -1.0, 35, '$30–$50', 'Bookshop.org', 16),

    (pid, 'Phaidon Architecture Coffee Table Book',
      'Lives on the table, not the shelf. Looks good whether you open it or not.',
      -2.0,  2.5, 50, '$30–$50', 'Phaidon', 17),

    (pid, 'Modern Sprout Herb Grow Kit',
      'Herbs on the counter. Smells like someone who has their life together.',
      -2.0,  3.0, 40, '$30–$50', 'Modern Sprout', 18),

    (pid, 'Hario Mini Slim Hand Grinder',
      'Fresh grounds, anywhere. The detail that separates good coffee from great coffee.',
       1.5, -1.0, 48, '$30–$50', 'Prima Coffee', 19),

    (pid, 'OXO Pull-Out Display Kitchen Scale',
      'The detail that changes how you cook. Precise, simple, built to last.',
       1.0, -2.5, 50, '$30–$50', 'OXO', 20),

    (pid, 'Midori Traveler''s Notebook',
      'A thing you''ll actually carry for years. Refillable, grows with you.',
      -2.5,  1.5, 40, '$30–$50', 'Midori', 21),

    (pid, 'Ippodo Unkaku Ceremonial Matcha',
      'For mornings when espresso is too much. The real thing, not a latte mix.',
      -0.5, -2.5, 35, '$30–$50', 'Ippodo', 22);


  -- ── Action Gifts ─────────────────────────────────────────────────────────────
  insert into public.action_gifts (profile_id, emoji, title, body, sort_order) values
    (pid, '🎽', 'Cheer me on',       'Come watch me run my first marathon in October — bring a sign.', 1),
    (pid, '🍝', 'Cook me dinner',    'Pick a cuisine you''ve never made. I''ll bring the wine.',       2),
    (pid, '✉️', 'Write me a letter', 'An actual letter, on paper. About anything you want.',           3);

end $$;
