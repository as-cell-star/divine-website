alter table appointments add column if not exists cloudinary_url text;
alter table appointments add column if not exists email_status text not null default 'queued';
alter table inquiries add column if not exists cloudinary_url text;
alter table inquiries add column if not exists email_status text not null default 'queued';
