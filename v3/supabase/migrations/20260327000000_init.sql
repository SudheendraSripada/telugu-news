-- 1. Create Categories Table
create table categories (
  id bigint generated always as identity primary key,
  name text not null,
  slug text not null unique,
  color text default '#C8102E',
  created_at timestamp with time zone default now()
);

-- 2. Create Articles Table
create table articles (
  id bigint generated always as identity primary key,
  title text not null,
  title_telugu text,
  summary text,
  summary_telugu text,
  content text,
  slug text not null unique,
  source_url text,
  source_name text,
  source_platform text check (source_platform in ('rss', 'instagram', 'twitter', 'manual')),
  raw_social_id text,
  cover_image_url text,
  is_breaking boolean default false,
  is_published boolean default true,
  category_id bigint references categories(id),
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- 3. Create Social Posts (Staging) Table
create table social_posts (
  id bigint generated always as identity primary key,
  platform text not null,
  platform_id text not null unique,
  author_handle text not null,
  content text,
  media_url text,
  media_type text, -- image, video, carousel
  status text default 'pending', -- pending, processed, rejected
  scraped_at timestamp with time zone default now(),
  processed_at timestamp with time zone
);

-- 4. Create Breaking News Table
create table breaking_news (
  id bigint generated always as identity primary key,
  headline text not null,
  headline_telugu text,
  link_url text,
  is_active boolean default true,
  created_at timestamp with time zone default now()
);

-- 4. Create Reporter Submissions Table
create table reporter_submissions (
  id bigint generated always as identity primary key,
  reporter_name text not null,
  reporter_phone text,
  reporter_location text,
  title text not null,
  content text,
  status text default 'pending', -- pending, approved, rejected
  submitted_at timestamp with time zone default now(),
  reviewed_at timestamp with time zone
);

-- 5. RLS Policies
alter table categories enable row level security;
alter table articles enable row level security;
alter table breaking_news enable row level security;
alter table reporter_submissions enable row level security;

-- Public read access
create policy "Allow public read" on categories for select using (true);
create policy "Allow public read" on articles for select using (is_published = true);
create policy "Allow public read" on breaking_news for select using (is_active = true);

-- Public insert for submissions
create policy "Allow public submission" on reporter_submissions for insert with check (true);

-- Admin full access (using service_role usually, or a specific admin filter)
-- For this setup, we'll allow all operations for now or filter by a secret header if needed.
-- In production, you'd use Supabase Auth and check for admin role.

-- 6. Indices
create index idx_articles_slug on articles(slug);
create index idx_articles_published_at on articles(published_at desc);
create index idx_articles_is_breaking on articles(is_breaking) where is_breaking = true;

-- 7. Seed Categories
insert into categories (name, slug, color) values 
('AI & Tech', 'ai', '#0057b7'),
('Business', 'business', '#1a6b2e'),
('Telugu News', 'telugu', '#b5451b'),
('Politics', 'politics', '#8b1a1a'),
('Sports', 'sports', '#0a5c36'),
('World', 'world', '#333');
