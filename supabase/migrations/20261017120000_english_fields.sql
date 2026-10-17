-- 17.10: English version of the site (/en) reads the dogs and team from the DB, in English.
-- Translations of the nonprofit's own Hebrew texts. Editable in the admin (dog edit → English).
alter table public.dogs add column if not exists name_en text;
alter table public.dogs add column if not exists tagline_en text;
alter table public.dogs add column if not exists story_en text;
alter table public.dogs add column if not exists age_en text;
alter table public.team add column if not exists name_en text;

update public.team set name_en = v.n from (values
  ('טלי','Tali'),('דבורה','Dvora'),('רן','Ran'),('לזי','Lazy'),('עדי','Adi'),('ברי','Beri'),('יונתן','Yonatan'),('שוקי','Shuki')
) as v(he, n) where team.name = v.he;

update public.dogs set name_en = 'Shuki', age_en = '2 years and 5 months', tagline_en = 'Looking for the home he never had', story_en = $t$Shuki's story began in February 2024. A young woman with a huge heart spotted him wandering with his sister Shirley in the open fields near Abu Ghosh. Shuki was then a tiny three-month-old puppy, hungry and shivering from the cold in an isolated area. His luck changed when that woman refused to look away: she contacted us right away and asked us to rescue him and his sister.

From that fragile puppy, Shuki grew into the sweetest dog in the country — a ball of positive energy who is simply in love with people. He is playful and happy, full of joy, and we have no doubt he will be the best friend of children and teenagers.

Shuki has an especially sweet hobby: he loves nothing more than rolling around in piles of freshly washed sheets and towels. It seems that every time he closes his eyes in the soft fabric, he dreams of the home he never had — a real home with a family, the smell of clean laundry and a warm, safe corner of his own.

Shuki is waiting for a new beginning, and in the meantime he needs you. Choose to support Shuki and help us give him warmth and safety until he finds the perfect home.$t$ where slug = 'shuki';

update public.dogs set name_en = 'Bobi', age_en = '1.5 years', tagline_en = 'Running toward life', story_en = $t$Bobi is the free spirit of the shelter. Nothing makes him happier than running loose in the open fields, feeling the wind in his ears and simply being himself. Watching him run, it's hard to believe that not long ago he almost lost everything.

In June 2025, when he was only three months old, Bobi was seconds away from being put down. He had been labeled a feral dog with no chance of adoption, one with no future among people. But we didn't give up on the little puppy and took him into the shelter.

Thanks to the devoted, patient work of wonderful volunteers, the unbelievable happened: the "hopeless dog" became a remarkably sweet and friendly one. He is still a little shy and careful, but he is without a doubt one of the cutest dogs in the country.

Bobi needs you to keep running toward a better future. Choose to support Bobi and help us give him the confidence and love he needs to keep opening up to the world.$t$ where slug = 'bobi';

update public.dogs set name_en = 'Laura', age_en = '3.5 years', tagline_en = 'From deep fear to splashing in the pool', story_en = $t$Laura is, without a doubt, the shelter's biggest water lover. Nothing makes her happier than jumping enthusiastically into our pool in summer, or celebrating in the winter puddles outside. Seeing her enjoy that freedom, it's hard to imagine the frightened, closed-off dog she once was.

Laura came to us in August 2023, after being taken to a temporary kennel. There, terrified and helpless, she hid inside a "cage within a cage", trying to disappear from the world and letting no one come near. But with us, thanks to a lot of patience and quiet, Laura began to blossom. She became a wonderful dog with soft fur that just invites stroking — though, like a true princess, she keeps her boundaries and won't let just anyone touch her right away.

With us, Laura found the courage to jump into the water, and now she needs you to keep blossoming. Choose to support Laura and help us give her the safe, loving space she deserves.$t$ where slug = 'laura';

update public.dogs set name_en = 'Pil', age_en = '2 years', tagline_en = 'The giant with a puppy''s heart', story_en = $t$Pil (Hebrew for "elephant") is the very definition of an "oversized baby". His favorite hobby? Sitting comfortably on a chair (even if it's a bit small for him) and daydreaming. Watching him, it seems he is sure he's still a little puppy who can curl up in anyone's lap.

Pil came to us in October 2024, one of eight puppies we rescued together. Even then, as a puppy, he was twice the size of his siblings — but in character he was, and still is, the most babyish of them all. He kept growing and growing, and the charmed volunteers soon gave him the nickname "Pil". He is a wonderfully sweet dog who simply isn't aware of his impressive size, and he hands out love like a giant.

Pil needs you to keep dreaming big. Choose to support our gentle giant and help us give him all the space and food he needs to stay everyone's happy baby.$t$ where slug = 'pil';

update public.dogs set name_en = 'Gili', age_en = '4 years', tagline_en = 'The lion who guards the shelter', story_en = $t$Gili is much more than a dog; he is a lion in the body of a German Shepherd. He has the presence of a king — noble, quiet and confident. He is the leader of our pack, the kind who doesn't need to make a sound to be respected. But despite his powerful, impressive looks, he has one small, sweet weakness: he is crazy about balls. The moment he has a ball, the "lion" becomes the happiest puppy in the world.

Gili's story began in December 2022. He suddenly appeared in a dog park in Jerusalem and was taken to the municipal pound, where we found him and decided he had to come to us. From the very first moment he was exceptionally friendly with all the dogs, and became a leader who calms everyone with his presence.

On a walk with Gili, you understand what a lion's loyalty means. He guards whoever walks with him with determination, walks proudly by their side and never takes his eyes off them. He is a dog who needs one person to trust — and once he finds them, he will be the most loyal guardian and friend in the world.

Gili is waiting for the person who will win a lion's heart. Choose to support Gili and help us give our special leader everything he needs until he finds his permanent kingdom.$t$ where slug = 'gili';

update public.dogs set name_en = 'Junior', age_en = '5 years and 8 months', tagline_en = 'The king of the shelter', story_en = $t$Junior is a handsome dog with a presence you can't ignore. He is the natural leader of our big dogs, the "king" of the yard, who loyally (and a little stubbornly) guards the food and the good order. Junior isn't just a dog; he is a dominant figure with the captivating personality of a true leader.

Junior's road wasn't easy. He was abandoned in January 2021 and found himself behind the bars of a cage. Over the years he went out to a few homes, but each time fate was cruel and he was returned to the shelter. After those attempts, Junior became a permanent resident with us — he found his kingdom at the shelter, and he rules it with a firm hand and a big heart.

Junior lives permanently in our hearts, and he needs your support to keep leading the pack, safe and well fed. Choose to support our king and help us give him the best life he deserves.$t$ where slug = 'junior';

update public.dogs set name_en = 'Cooper', age_en = '8 years', tagline_en = 'The leader of the "Coopers" family', story_en = $t$If you asked Cooper what the most important thing in the world is, the answer would be simple: a hug. Cooper is a big dog with an even bigger heart, a kind of huge, sweet "Care Bear" for whom warm touch matters more than anything.

Cooper spent most of his life in a kennel in Rishpon, where he arrived as a puppy. When he came to us together with his pack — "the Coopers" — we discovered a charming dog it's simply impossible not to fall in love with. Although he is the leader and protector of his friends, Cooper has an exceptional sensitivity: he knows how to give the volunteers and staff a real hug and comfort exactly when they need it most.

A family we don't break up: Cooper's pack isn't just a group of dogs — they are each other's real family. They are already 8 years old, and after years of surviving together, they cannot be separated. They need your support to keep living together in safety, as they will spend the rest of their lives at the shelter as beloved permanent residents.

Choose to support Cooper and his family and help us give them a dignified old age, full of love and the certainty that they will never have to be separated.$t$ where slug = 'cooper';

update public.dogs set name_en = 'Micha', age_en = '10 years', tagline_en = 'The beating heart and elder of the tribe', story_en = $t$Micha is the oldest dog at the shelter, 10 years old, and everyone who knows him knows he is its beating heart. Despite everything he has been through, Micha remains a dog full of love, and nothing makes him happier than a generous handful of treats and attention.

Micha's story is one of extraordinary survival. In 2017, when he was just a year old, he was caught and taken to the pound with a broken pelvis — painful evidence of severe abuse. We rescued him, gave him the complex medical care he needed, and he went to what seemed like a warm foster home. But fate was cruel again: seven years later, Micha was found wandering alone in the streets of Jaffa, after his owner simply disappeared and left him behind.

Micha came back home, to the place that saved him once and will never give up on him. Choose to support Micha and help us give him a dignified old age, full of treats and the certainty that he will never be abandoned again.$t$ where slug = 'micha';

update public.dogs set name_en = 'Bella', age_en = '4 years', tagline_en = 'The fox-like beauty waiting to go home', story_en = $t$Bella is a dog who simply knows she is special. With her fox-like look and her warmth, she makes sure everyone sees how beautiful she is, and there isn't a volunteer at the shelter who doesn't fall for her charm at first sight. She is lovely, friendly, and clearly used to the warmth of people.

But behind those captivating looks hides a heartbreaking story. In May 2025, after three years of living in a home as part of a family, Bella was abandoned. Moving from the familiar couch to the shelter was unbearably hard for her. For a long time, every single morning, Bella would stand by the gate and wait — looking out in the hope that the people she knew would come to take her back.

Bella is still waiting for a home that understands a dog is family for life. Choose to support Bella and help us give her the care and pampering she deserves, until she finds a heart that will open for her again.$t$ where slug = 'bella';

-- new dogs (still hidden until they have photos)
update public.dogs set name_en = 'Roni', age_en = '2 years', tagline_en = 'The heart that never gives up', story_en = $t$Roni is one of the sweetest, most charming dogs in the country — a wonderfully friendly dog who sees every person as a friend for life. Although he is only two, Roni has already beaten fate twice: he was rescued at the very last moment from mortal danger in a municipal pound, and shortly afterwards he also survived a severe viper bite, after we fought for his life.

Thanks to devoted, patient care at the shelter, Roni is still a happy, trusting dog full of joy, with no trace of the traumas he went through. Choose to adopt Roni and help us give him the peace and security on his way to the perfect family for him.$t$ where slug = 'roni';

update public.dogs set name_en = 'Sunny', age_en = '3.5 years', tagline_en = 'The angel of peace of the home', story_en = $t$Some stories simply break your heart, and Sunny's is one of them. Only three and a half, Sunny is a perfect dog — gentle, smart, beautifully behaved and calm. Three years ago he was saved from the pound and had a wonderful life in the home of a young woman, where he grew up in amazing harmony with another dog and a cat.

But then life turned upside down. After a severe personal crisis, his owner lost her home, her money and her family. Heartbroken and with no choice, she had to return him to us to secure a better future for him. Sunny doesn't understand why his world changed, but he still keeps his balanced, loving nature. He is a true gift, ready to bring calm, light and comfort to the family that chooses to adopt him.$t$ where slug = 'sunny';

update public.dogs set name_en = 'Yoav', tagline_en = 'The bear who cares', story_en = $t$Yoav is a real-life Care Bear — a big, unusually cute dog who is all love, cuddles and kisses. For a whole year Yoav sat within the walls of the pound, waiting for a miracle, and was saved at the very last moment from being put down.

The day Tali, our director, came to take him out, everything changed. Even before he left the gate, you couldn't miss his wide smile and his kind, grateful eyes. Despite the hard year he went through, Yoav is still a happy, charming dog, wonderfully friendly to people and other dogs alike. If you love big dogs with even bigger hearts, Yoav is exactly the friend for life you've been looking for.$t$ where slug = 'yoav';

update public.dogs set name_en = 'Omri', tagline_en = 'From Gaza to freedom', story_en = $t$Omri carries a story you can't forget. In the first week of the war, a group of soldiers found him and his brother in the Gaza Strip — two puppies frightened to death, thin and trembling, with huge, kind eyes. The soldiers fed them, gave them water and brought them to Israel. His brother has already been adopted, but sweet Omri is still with us and has never had a home of his own.

It took us and our volunteers long months of patience to heal his wounded soul, rebuild his trust and teach him that it's safe to trust people. Omri is an unusually gentle, moving dog. He doesn't push forward; he stands to the side and waits quietly every day for a pat from the staff, thirsty for love and stability.

The soldiers saved his body from the inferno — now it's your turn to save his soul. Omri is looking for a patient, accepting home that will give him time to open up at his own pace, and will win the most loyal, loving dog in the world.$t$ where slug = 'omri';

update public.dogs set name_en = 'Bruno & Lila', age_en = '7 years old', tagline_en = 'The love no cage could break', story_en = $t$Bruno and Lila (7) are soul siblings who were adopted together as puppies and grew up for six years in a warm home alongside cats. But one day their world fell apart. Their owner met a partner who set a condition for their marriage: give up the dogs. To the sorrow of both dogs, she didn't hesitate, and left these two loyal creatures behind bars in a cold kennel cage.

Their hearts broke, but through the fear they looked after each other and didn't part for a moment — until, after a long year, we managed to get them out and bring them to us, to the Lives of Others shelter.

Today, despite that hard betrayal, they are still wonderful dogs: quiet, well behaved, remarkably gentle and kind-hearted. After someone gave them up so easily, we are looking for the great repair — a patient, family home that will adopt them both together, so they never have to be separated and can have the stable love they deserve.$t$ where slug = 'bruno-lila';
