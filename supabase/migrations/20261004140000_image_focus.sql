-- Where the dog's face is in its main photo ("x% y%"), so cropped cards never cut the face.
alter table public.dogs add column if not exists image_focus text check (image_focus is null or image_focus ~ '^\d{1,3}% \d{1,3}%$');
