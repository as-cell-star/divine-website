-- Divine Birth CMS, bookings, and inquiries
create table if not exists media (
  id          text primary key,
  kind        text not null,
  url         text not null,
  alt         text not null default '',
  title       text not null default '',
  caption     text not null default '',
  category    text not null default '',
  sort_order  integer not null default 0,
  created_by  text,
  created_at  timestamptz not null default now()
);
create index if not exists media_kind_idx on media (kind, sort_order);

create table if not exists site_content (
  key         text primary key,
  value       text not null,
  updated_at  timestamptz not null default now(),
  updated_by  text
);

create table if not exists testimonials (
  id          text primary key,
  quote       text not null,
  author      text not null,
  rating      integer not null default 5,
  sort_order  integer not null default 0,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create table if not exists faqs (
  id          text primary key,
  question    text not null,
  answer      text not null,
  sort_order  integer not null default 0,
  published   boolean not null default true
);

create table if not exists appointments (
  id          text primary key,
  first_name  text not null,
  last_name   text not null,
  phone       text not null,
  service     text not null,
  date        text not null,
  time        text not null,
  notes       text not null default '',
  status      text not null default 'pending',
  created_at  timestamptz not null default now()
);
create index if not exists appointments_created_idx on appointments (created_at desc);

create table if not exists inquiries (
  id          text primary key,
  first_name  text not null,
  last_name   text not null,
  phone       text not null,
  service     text not null default '',
  message     text not null default '',
  status      text not null default 'new',
  created_at  timestamptz not null default now()
);
create index if not exists inquiries_created_idx on inquiries (created_at desc);

insert into media (id, kind, url, alt, title, sort_order) values
  ('seed-hero-1', 'hero', '/images/photo-midwife-newborn.jpg', 'A Divine Birth midwife holding a newborn at the centre', 'Hero 1', 1),
  ('seed-hero-2', 'hero', '/images/hero4.jpg', 'Midwife holding a newborn', 'Hero 2', 2),
  ('seed-hero-3', 'hero', '/images/hero2.jpg', 'Care at Divine Birth Midwifery Centre', 'Hero 3', 3),
  ('seed-hero-4', 'hero', '/images/hero3.jpg', 'The Divine Birth team', 'Hero 4', 4),
  ('seed-hero-5', 'hero', '/images/hero5.jpg', 'A calm birthing suite', 'Hero 5', 5),
  ('seed-gallery-1', 'gallery', '/images/photo-midwife-newborn.jpg', 'A Divine Birth midwife holding a newborn at the centre', 'Newborn care', 1),
  ('seed-gallery-2', 'gallery', '/images/photo-mother-baby.jpg', 'A new mother and her midwife with her newborn', 'Mother and baby', 2),
  ('seed-gallery-3', 'gallery', '/images/photo-handover.jpg', 'A midwife placing a newborn into her mother''s arms', 'First hold', 3),
  ('seed-gallery-4', 'gallery', '/images/photo-team-celebration.jpg', 'The Divine Birth team celebrating together at the centre', 'The team', 4),
  ('seed-gallery-5', 'gallery', '/images/photo-twins.jpg', 'Two Divine Birth midwives each holding a newborn twin', 'Twins', 5),
  ('seed-gallery-6', 'gallery', '/images/photo-swaddled.jpg', 'A Divine Birth midwife holding a swaddled newborn', 'Swaddled', 6),
  ('seed-gallery-7', 'gallery', '/images/team-main.jpg', 'Divine Birth midwifery team with newborns', 'Team portrait', 7),
  ('seed-gallery-8', 'gallery', '/images/photo-midwife-blue.jpg', 'A Divine Birth midwife in the clinic', 'Clinic', 8)
on conflict (id) do nothing;

insert into testimonials (id, quote, author, rating, sort_order, published) values
  ('seed-rev-1', 'Best hospital for normal delivery with high quality services at a very affordable price. I couldn''t have asked for a better experience.', 'Verified Patient — Google', 5, 1, true),
  ('seed-rev-2', 'I had a wonderful experience — the midwives were kind, professional and made me feel completely supported throughout the entire process.', 'Verified Patient — Google', 5, 2, true),
  ('seed-rev-3', 'The team, led by Diana, is truly exceptional. Full attention is given to every client. I highly recommend Divine Birth to every expectant family.', 'Verified Patient''s Spouse — Google', 5, 3, true)
on conflict (id) do nothing;

insert into faqs (id, question, answer, sort_order, published) values
  ('seed-faq-1', 'Do I need an appointment, or can I just walk in?', 'You are welcome to walk in — we are open 24 hours, every day. For antenatal check-ups, scans and clinic visits we recommend booking so you are seen without waiting. If you are in labour, come straight in or call us on the way. Never wait for an appointment in an emergency.', 1, true),
  ('seed-faq-2', 'What should I bring to the centre when I come to deliver?', 'Bring your national ID, your antenatal booklet, your insurance or SHA/SHIF details, and a bag for yourself and the baby — clothing, shawls, sanitary pads, toiletries, and a going-home outfit. If you have forgotten something, we will help. Nothing is more important than you arriving safely.', 2, true),
  ('seed-faq-3', 'Can my husband or a family member stay with me during labour?', 'Yes. We are a family-centred centre and you are welcome to have a birth companion with you. If you would prefer continuous professional support instead of, or alongside, your family, ask us about doula support.', 3, true),
  ('seed-faq-4', 'Do you accept SHA / SHIF or private insurance?', 'Please call us on 0794 444 141 before your visit and we will confirm exactly what your cover includes and what, if anything, you will pay. We would rather you know in advance than be surprised.', 4, true),
  ('seed-faq-5', 'What happens if there is a complication during my birth?', 'Every birth here is attended by a qualified midwife who is trained to recognise complications early. If your birth needs care beyond what a midwifery centre can safely give — for example an emergency caesarean — we stabilise you and refer you immediately to a partner hospital. Your safety comes before everything else.', 5, true),
  ('seed-faq-6', 'How soon after birth can I go home?', 'For an uncomplicated birth, most mothers go home within 24 to 48 hours, once you and your baby have both been checked and you are feeding comfortably. We then follow up with you at the postnatal clinic.', 6, true)
on conflict (id) do nothing;
