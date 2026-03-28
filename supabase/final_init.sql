-- TELUGU NEWS — FINAL CONSOLIDATED SCHEMA & SEEDING

-- 1. Create Categories Table
create table categories (
  id bigint generated always as identity primary key,
  name text not null,
  name_telugu text,
  slug text not null unique,
  color text default '#C8102E',  -- Deep Red
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

-- 5. Create Reporter Submissions Table
create table reporter_submissions (
  id bigint generated always as identity primary key,
  reporter_name text not null,
  reporter_phone text,
  reporter_location text, -- City/District in AP/TS
  title text,
  content text,
  status text default 'pending', -- pending, approved, rejected
  submitted_at timestamp with time zone default now()
);

-- 6. Enable RLS & Policies
alter table categories enable row level security;
alter table articles enable row level security;
alter table social_posts enable row level security;
alter table breaking_news enable row level security;
alter table reporter_submissions enable row level security;

-- Public Read Access
create policy "Allow public read on categories" on categories for select using (true);
create policy "Allow public read on articles" on articles for select using (is_published = true);
create policy "Allow public read on breaking_news" on breaking_news for select using (is_active = true);

-- Admin Write Access (Simulated via Service Role or specific rules)
create policy "Allow admin write on all" on articles for all using (true) with check (true);
create policy "Allow admin write on social" on social_posts for all using (true) with check (true);
create policy "Allow reporter submissions" on reporter_submissions for insert with check (true);

-- 7. Seed Categories
insert into categories (name, name_telugu, slug, color) values
('AI', 'ఆర్టిఫిషియల్ ఇంటెలిజెన్స్', 'ai', '#60a5fa'),
('Tech', 'టెక్నాలజీ', 'tech', '#34d399'),
('Business', 'బిజినెస్', 'business', '#fbbf24'),
('Global', 'అంతర్జాతీయ వార్తలు', 'global', '#f87171'),
('Local', 'స్థానిక వార్తలు', 'local', '#a78bfa'),
('Politics', 'రాజకీయాలు', 'politics', '#fb923c'),
('Entertainment', 'వినోదం', 'entertainment', '#f472b6'),
('Sports', 'క్రీడలు', 'sports', '#fb7185'),
('Health', 'ఆరోగ్యం', 'health', '#2dd4bf'),
('Science', 'సైన్స్', 'science', '#818cf8'),
('Education', 'విద్య', 'education', '#4ade80');

-- 8. Seed Sample Breaking News
insert into breaking_news (headline, headline_telugu, link_url) values
('Mistral Large 2 Released: Better performance in Telugu translations.', 'మిస్ట్రల్ లార్జ్ 2 విడుదల: తెలుగు అనువాదాలలో మెరుగైన పనితీరు.', '#'),
('Tech centers expanding in AP & Telangana.', 'ఏపీ మరియు తెలంగాణలో విస్తరిస్తున్న టెక్ సెంటర్లు.', '#');

-- 9. Seed 10 Sample Articles
insert into articles (title, title_telugu, summary, summary_telugu, content, slug, source_name, source_platform, is_published, category_id, published_at) values
('AI Revolution in 2026', '2026లో ఏఐ విప్లవం: కొత్త మార్పులు', 'How AI is reshaping the industries in 2026.', '2026లో ఏఐ పరిశ్రమలను ఎలా మారుస్తోంది.', 'Full content about AI transformation...', 'ai-revolution-2026', 'Tech Blog', 'rss', true, 1, now()),
('Tech Expo in Hyderabad', 'హైదరాబాద్‌లో టెక్ ఎక్స్‌పో', 'Major technology event happening in Hyderabad.', 'హైదరాబాద్‌లో జరుగుతున్న ప్రధాన సాంకేతిక కార్యక్రమం.', 'Details about the expo...', 'tech-expo-hyd', 'Admin Manual', 'manual', true, 2, now()),
('New Economic Policies', 'కొత్త ఆర్థిక విధానాలు', 'Government announces new policies for startups.', 'స్టార్టప్‌ల కోసం ప్రభుత్వం కొత్త విధానాలను ప్రకటించింది.', 'Economy details...', 'new-econ-policies', 'Economic Times', 'rss', true, 3, now()),
('Global Space Mission', 'అంతర్జాతీయ అంతరిక్ష యాత్ర', 'SpaceX launches new mission to Mars.', 'స్పేస్ ఎక్స్ అంగారక గ్రహానికి కొత్త యాత్రను ప్రారంభించింది.', 'Space mission details...', 'global-space-mission', 'Reuters', 'rss', true, 4, now()),
('Local Election Updates', 'స్థానిక ఎన్నికల అప్‌డేట్స్', 'Voter turnout increases in local polls.', 'స్థానిక ఎన్నికల్లో ఓటర్ల సంఖ్య పెరిగింది.', 'Election results...', 'local-election-2026', 'Admin Manual', 'manual', true, 5, now()),
('Political Shift in State', 'రాష్ట్రంలో రాజకీయ మార్పులు', 'Emerging trends in state politics.', 'రాష్ట్ర రాజకీయాల్లో అభివృద్ధి చెందుతున్న ధోరణులు.', 'Politics analysis...', 'political-shift-2026', 'ET Politics', 'rss', true, 6, now()),
('Mega Movie Release', 'మెగా మూవీ విడుదల', 'Special premiere of the latest Telugu blockbuster.', 'లేటెస్ట్ తెలుగు బ్లాక్‌బస్టర్ స్పెషల్ ప్రీమియర్.', 'Movie review...', 'mega-movie-2026', 'Entertainment Weekly', 'rss', true, 7, now()),
('Cricket World Cup Qualifiers', 'క్రికెట్ వరల్డ్ కప్ క్వాలిఫైయర్స్', 'India wins the first qualifying match.', 'భారత్ మొదటి క్వాలిఫైయింగ్ మ్యాచ్‌లో విజయం సాధించింది.', 'Sports highlights...', 'cricket-world-cup-2026', 'Sports Guru', 'rss', true, 8, now()),
('New Health Guidelines', 'కొత్త ఆరోగ్య మార్గదర్శకాలు', 'WHO releases new guidelines for wellness.', 'WHO ఆరోగ్యం కోసం కొత్త మార్గదర్శకాలను విడుదల చేసింది.', 'Health tips...', 'health-guidelines-2026', 'Wellness News', 'rss', true, 9, now()),
('Science Breakthrough', 'సైన్స్ అద్భుతం', 'Scientists discover a new way to clean oceans.', 'సముద్రాలను శుభ్రం చేయడానికి శాస్త్రవేత్తలు కొత్త మార్గాన్ని కనుగొన్నారు.', 'Science details...', 'science-breakthrough-2026', 'Nature', 'rss', true, 10, now());
