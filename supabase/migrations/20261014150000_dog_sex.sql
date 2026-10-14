-- 13.10: ages read "בן 8" / "בת 3 וחצי" (needs the dog's sex); age moves to the end of the story,
-- the tagline becomes the card caption. Sex taken from each dog's own story text (הוא/היא).
alter table public.dogs add column if not exists sex text check (sex in ('m','f'));
update public.dogs set sex = 'f' where slug in ('laura','bella');
update public.dogs set sex = 'm' where slug in ('shuki','bobi','pil','gili','junior','cooper','micha');
update public.dogs set tagline = 'הלב הפועם וזקן השבט' where slug = 'micha' and tagline = 'הלב הפועם וזקן השבט · בן 10';
-- 13.10: Laura and Bobi join the gift gallery (9 dogs, symmetric grid)
update public.dogs set available_for_gift = true where slug in ('laura','bobi');
