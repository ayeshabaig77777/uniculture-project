// All city / region culture data for the Culture hub (culture.html) and the city page (city.html).
//
// VIDEOS: paste any YouTube link (or just the 11-character id) in these fields and it plays on the page.
//   heroVideo : plays silently behind the city name (a YouTube link, or a file path like "videos/karachi.mp4")
//   heroStart : seconds to skip at the beginning of the hero video (to skip its own title or intro)
//   heroEnd   : (optional) the second where the video should jump back to the start, to cut off an outro or logo at the end
//   softCenter: true  (optional) adds a soft dark patch in the middle of the video, only if that video has a watermark there
//   Time is in seconds. 1 minute 20 seconds = 80.
//   video     : on any card, shows a play button and opens the video in a popup
//   videoNote : small caption under the video (for example the channel name)
// Leave a field out and that card simply shows its photo (or text only).
//
// To add a city: add an object below. status "soon" shows a "coming soon" card until you fill it in.

export const SECTION_COLORS = {
  places:   ["#0ea5e9", "#0369a1"],
  food:     ["#f59e0b", "#ea580c"],
  hang:     ["#22c55e", "#15803d"],
  wedding:  ["#ec4899", "#be185d"],
  dress:    ["#8b5cf6", "#6d28d9"],
  language: ["#3b82f6", "#1d4ed8"],
  festivals:["#d946ef", "#a21caf"],
  crafts:   ["#b45309", "#78350f"]
};

export const PROVINCES = ["Islamabad Capital Territory", "Sindh", "Punjab", "Khyber Pakhtunkhwa", "Balochistan", "Gilgit-Baltistan"];

export const CITIES = [

  /* ---------------------------------------------------------- KARACHI */
  {
    id: "karachi", name: "Karachi", province: "Sindh", status: "draft",
    tagline: "Pakistan's biggest city: colonial palaces, a long Arabian Sea coast and some of the country's best street food.",
    img: "images/clifton.jpg", imgPos: "center 60%",
    heroVideo: "https://www.youtube.com/watch?v=2F5IiY627Is",
    heroImage: "",   // OR a big photo with a slow zoom, e.g. "images/karachi-night.jpg" (used only when heroVideo is empty)
    heroStart: 8,   // seconds to skip at the start of the film (its own title intro). Change if the intro still shows.   // 4K cinematic drone film, Sea View at sunset
    facts: [
      { b: "🗓 Best time", t: "Late November to early March: mild and dry, around 27°C. May and June can reach about 35°C." },
      { b: "🗣 Languages", t: "Urdu is the national language. English is widely spoken in hotels and tourist areas." },
      { b: "👗 What to wear", t: "Dress modestly. A long tunic or shalwar kameez is comfortable and respectful." },
      { b: "🚕 Getting around", t: "Taxis and ride-hailing apps are the easiest way to move around." }
    ],
    story: {
      title: "A city of many cultures",
      text: "Karachi is a melting pot. Before 1947 it was home mainly to Sindhis, Baloch, Makranis and Gujaratis. After 1947 migrants arrived from India, and later people came from across Pakistan. Today Urdu-speaking, Sindhi, Memon, Baloch, Pashtun, Punjabi, Parsi, Christian and many other communities live side by side, and many neighbourhoods have a flavour of their own.",
      img: "images/empress-market.jpg",
      tags: ["Diversity", "Languages", "Food", "Festivals"]
    },
    plan: [
      { when: "Morning", title: "Saddar and the old city", t: "Start at Empress Market, then walk to Frere Hall. Both are in Saddar, close to each other, and Zainab Market is nearby for souvenirs." },
      { when: "Lunch", title: "Burns Road", t: "The classic food street of the old city. Try nihari, bun kabab or fry kebab." },
      { when: "Afternoon", title: "Mohatta Palace", t: "Visit the museum in Clifton, then head to the sea. If you have time, add Mazar-e-Quaid in the city centre." },
      { when: "Evening", title: "Clifton and Do Darya", t: "Watch the sunset by the sea, then have dinner at a seaside restaurant." }
    ],
    banners: [
      { b: "🎭 Karachi's cultural season is winter", t: "January often brings literary gatherings such as the Karachi Literature Festival, and February has celebrations linked to Sindhi heritage." },
      { b: "🍽 Eat like a Karachiite", t: "Evenings from late autumn are the best time for Burns Road, once the daytime heat fades. Dinner here runs late and that is completely normal." }
    ],
    sections: [
      { id: "culture", short: "Culture", icon: "🎭", title: "Culture and traditions", more: { href: "categories.html", label: "Explore all culture categories" }, sub: "What makes Karachi's culture different. Every community here brings its own language, food, dress and celebrations.", cards: [
        { n: "Many languages, one city", tag: "Languages", img: "images/people.jpg", s: "Urdu is the main language and English is widely understood. Sindhi, Punjabi, Pashto, Balochi, Saraiki, Gujarati and many more are also spoken.",
          facts: [ { k: "Main language", v: "Urdu" }, { k: "Also spoken", v: "Sindhi, Punjabi, Pashto, Balochi" } ],
          m: "In the 1998 census, about 39% spoke Urdu, 27% Sindhi, 14% Punjabi, 12% Pashto and 4% Balochi. These figures are old, and the city has changed since.", link: { href: "languages.html", label: "Explore languages" } },
        { n: "Ajrak and the Sindhi topi", tag: "Dress", img: "images/ajrak-heritage.jpg", s: "Ajrak is Sindh's block-printed shawl and the Sindhi topi is the embroidered cap worn by men. Together they stand for respect, dignity and pride, and are often given as gifts of honour.",
          see: ["Ajrak shawls in deep red and blue patterns", "Topis with embroidery and mirror work"],
          m: "Both are worn at weddings and festivals, and on Sindhi Cultural Day.", near: "Zainab Market, Empress Market", link: { href: "handicrafts.html", label: "Explore handicrafts" } },
        { n: "Sindhi Cultural Day", tag: "Festival", img: "images/sindhifolk.jpg", s: "People wear ajrak and topi, and the day is full of folk music, dance and processions, including at the Karachi Press Club.",
          facts: [ { k: "When", v: "First Sunday of December" } ],
          m: "It began in 2009 as Sindhi Topi Day and is now one of the biggest cultural days of the year. Crowds can be large, so follow local advice.", link: { href: "festivals.html", label: "Explore festivals" } },
        { n: "Sindhi embroidery and crafts", tag: "Crafts", img: "images/sindhilang.jpg", s: "Bold colours and mirror work decorate shirts, bags and wall hangings. Ajrak, pottery and embroidered caps are popular souvenirs.",
          near: "Zainab Market", link: { href: "handicrafts.html", label: "Explore handicrafts" } },
        { n: "Folk and Sufi music", tag: "Music", img: "images/hub-music.jpg", s: "Sindhi folk songs and Sufi music are an important part of Sindhi identity, and folk artists perform at cultural days and festivals.",
          link: { href: "music.html", label: "Explore music and dance" } },
        { n: "Literature and arts festivals", tag: "Events", s: "Karachi hosts the Karachi Literature Festival and the Karachi Biennale, and the Sindh Literature Festival (Sindh Adabi Melo) celebrates Indus heritage and languages over two days each year.",
          facts: [ { k: "Season", v: "Mostly winter" } ],
          m: "Dates change every year, so check the festival's own page before you plan around it.", link: { href: "events.html", label: "See upcoming events" } },
        { n: "Neighbourhood flavours", tag: "Communities", s: "Many communities have their own areas and dishes: Makranis in Lyari, Memons around Bolton Market. Memon food includes pav bhaji, khatta aloo and gathiya.",
          m: "Exploring Karachi by neighbourhood is one of the best ways to taste its diversity." }
      ]},
      { id: "history", short: "History", icon: "🏛", title: "History and landmarks", sub: "The old and iconic side of Karachi. Opening days can change, so check before you go.", cards: [
        { n: "Mazar-e-Quaid", img: "images/mazar-e-quaid.jpg", tag: "Landmark", s: "The white marble mausoleum of Pakistan's founder, Muhammad Ali Jinnah, set in quiet gardens in the middle of the city.",
          facts: [ { k: "Suggested time", v: "About 1 hour" }, { k: "Dress", v: "Modest" } ],
          see: ["The marble mausoleum and its gardens", "The small museum at the site"],
          q: "Mazar-e-Quaid Karachi" },
        { n: "Frere Hall", img: "images/frere-hall.webp", tag: "Colonial", s: "A Venetian-Gothic building from the British era, surrounded by lawns. It is now a library and exhibition space.",
          facts: [ { k: "Built", v: "1865" }, { k: "Sundays", v: "Book market in the grounds" }, { k: "Suggested time", v: "About 1 hour" } ],
          see: ["The building and its gardens", "Ceiling murals by the artist Sadequain", "Art shows and events (check what is on)"],
          near: "Empress Market, Zainab Market", q: "Frere Hall Karachi" },
        { n: "Mohatta Palace", img: "images/mohatta-palace.jpg", tag: "Museum", s: "A palace of pink Jodhpur stone in Clifton, built as a summer home. Its style blends Islamic and British influences.",
          facts: [ { k: "Built", v: "1927" }, { k: "Usually closed", v: "Mondays" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          see: ["The palace building itself", "Art and cultural exhibitions in the museum"],
          near: "Clifton Beach", q: "Mohatta Palace Museum Karachi" },
        { n: "Empress Market", img: "images/empress-market.jpg", tag: "Market", s: "A busy colonial-era market in Saddar, named after Queen Victoria.",
          facts: [ { k: "Completed", v: "1889" }, { k: "Best time", v: "Morning" }, { k: "Suggested time", v: "About 1 hour" } ],
          see: ["Spices, dry fruits and fresh produce", "The grand old building"],
          m: "Expect crowds and keep your belongings close.", near: "Frere Hall, Zainab Market", q: "Empress Market Karachi" }
      ]},
      { id: "sea", short: "Sea", icon: "🌊", title: "Sea and evenings", sub: "Karachi comes alive by the water in the evening.", cards: [
        { n: "Clifton Beach", tag: "Sunset", img: "images/clifton.jpg", imgPos: "center 42%", s: "Karachi's most famous shoreline, also called Sea View. A favourite for an evening walk.",
          facts: [ { k: "Best time", v: "Evening, around sunset" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          see: ["Walk along the Arabian Sea at sunset", "Stalls, camel rides and horse buggies"],
          near: "Mohatta Palace, Do Darya, Bagh Ibn-e-Qasim", q: "Clifton Beach Karachi" },
        { n: "Do Darya", img: "images/do-darya.jpg", imgPos: "center 55%", tag: "Dinner", s: "A strip of seaside restaurants built over the Arabian Sea, known for barbecue and seafood.",
          facts: [ { k: "Best time", v: "Evening" }, { k: "Where", v: "DHA Phase 8" } ],
          see: ["Barbecue and seafood by the water"], q: "Do Darya Karachi" },
        { n: "Port Grand", img: "images/port-grand.jpg", imgPos: "center 72%", tag: "Evening", s: "A pedestrian food and entertainment strip along the historic Napier Mole bridge.",
          facts: [ { k: "Best time", v: "Evening" } ],
          see: ["Food stalls and restaurants", "A walk along the old Napier Mole"], q: "Port Grand Karachi" },
        { n: "Manora and Churna Island", img: "images/Manora.jpg", tag: "Boat trip", s: "Island trips by boat, popular for a relaxed day out, snorkelling and diving.",
          facts: [ { k: "How", v: "Boat from Kemari or Mubarak Village" } ],
          m: "Boat trips depend on the weather and the operator. Use a trusted operator and ask about safety before you go.", q: "Manora Island Karachi" }
      ]},
      { id: "family", short: "Museums", icon: "🎒", title: "Museums and family", sub: "Good for families and rainy or very hot days.", cards: [
        { n: "Pakistan Maritime Museum and PAF Museum", img: "images/museum.jpg", tag: "Museum", s: "Two museums close to each other: decommissioned navy vessels and aircraft on display.",
          see: ["Navy ships and a submarine", "Fighter jets and aviation history"],
          m: "Check opening hours for both museums before you go.", q: "Pakistan Maritime Museum Karachi" },
        { n: "TDF MagnifiScience Centre", img: "images/tdf.jpg", tag: "Hands-on", s: "An interactive science museum with hands-on exhibits for children and adults.", q: "MagnifiScience Centre Karachi" },
        { n: "Bagh Ibn-e-Qasim", img: "images/bagh.jpg", tag: "Park", s: "A large seaside park near Clifton, about 130 acres, with walking paths, lawns and family areas.", near: "Clifton Beach", q: "Bagh Ibn-e-Qasim Karachi" }
      ]},
      { id: "food", short: "Food", icon: "🍽", title: "Food", more: { href: "food.html", label: "Explore Pakistan's food on UniCulture" }, sub: "Burns Road, Boat Basin, Dhoraji and Do Darya are the big food areas. Tap Maps to find a place. Branches and quality change over time, so check recent reviews.", cards: [
        { n: "Nihari", tag: "Must try", img: "images/nihari.jpg", imgPos: "center 62%", s: "A slow-cooked beef stew with a rich, spicy gravy, eaten with naan, ginger, green chilli and lemon.",
          spots: [ { n: "Zahid Nihari", a: "Tariq Road", q: "Zahid Nihari Tariq Road Karachi" }, { n: "Javed Nihari", a: "Karachi", q: "Javed Nihari Karachi" }, { n: "Sabri Nihari", a: "M.A. Jinnah Road", q: "Sabri Nihari Karachi" }, { n: "Nihari Inn", a: "Boat Basin", q: "Nihari Inn Boat Basin Karachi" } ] },
        { n: "Bun kabab", img: "images/bun-kabab.jpg", tag: "Street food", s: "Karachi's all-time favourite street snack: a spiced patty in a soft bun. Burns Road and Pakistan Chowk are known for the original.",
          spots: [ { n: "Burns Road food street", a: "Old city", q: "Burns Road food street Karachi" }, { n: "Pakistan Chowk", a: "Old city", q: "Pakistan Chowk Karachi" } ] },
        { n: "Biryani", tag: "Classic", img: "images/biryani.jpg", s: "Karachi has many biryani styles. If you do not like very spicy food, ask for it milder.",
          spots: [ { n: "Student Biryani", a: "Saddar", q: "Student Biryani Saddar Karachi" } ] },
        { n: "Halwa puri breakfast", img: "images/halwa-puri.webp", tag: "Breakfast", s: "Sweet halwa, fried puris, and potato-chickpea curry with mango pickle. Boat Basin is the most famous area for it.",
          spots: [ { n: "Boat Basin breakfast spots", a: "Clifton area", q: "Boat Basin Karachi halwa puri" } ] },
        { n: "Fry kebab and BBQ", img: "images/bbq.jpg", imgPos: "center 70%", tag: "Burns Road", s: "Known for fry kebab and dhaga kebab near Burns Road.",
          spots: [ { n: "Waheed Kabab House", a: "Near Burns Road", q: "Waheed Kabab House Karachi" }, { n: "Sheikh Abdul Ghaffar Kebab House", a: "Off Tariq Road", q: "Sheikh Abdul Ghaffar Kebab House Karachi" } ] },
        { n: "Fresh fish", img: "images/fish.jpg", tag: "Seafood", s: "Fried fish and seafood, from simple street stalls to seaside dinners.",
          spots: [ { n: "Yadgar", a: "Jamshed Road", q: "Yadgar fish Jamshed Road Karachi" }, { n: "Kaemari seafood street", a: "Kaemari", q: "Kaemari seafood Karachi" }, { n: "Do Darya", a: "Clifton, seaside", q: "Do Darya Karachi" } ] }
      ]},
      { id: "shopping", short: "Shopping", icon: "🛍", title: "Shopping", sub: "From bargain markets to air-conditioned malls.", cards: [
        { n: "Zainab Market", tag: "Bazaar", s: "A busy maze of small shops, good for bargain hunting, clothes, handicrafts and leather goods.",
          m: "Bargaining is common in markets like this.", near: "Empress Market, Saddar", q: "Zainab Market Karachi" },
        { n: "Tariq Road and Zamzama", tag: "Streets", s: "Popular shopping areas for clothes, handicrafts and fashion.",
          spots: [ { n: "Tariq Road", a: "PECHS", q: "Tariq Road Karachi" }, { n: "Zamzama", a: "Clifton", q: "Zamzama Karachi" } ] },
        { n: "Malls", tag: "Indoor", s: "Large indoor malls with international brands, food courts and entertainment. A comfortable break from the heat.",
          spots: [ { n: "Dolmen Mall Clifton", a: "Clifton", q: "Dolmen Mall Clifton Karachi" }, { n: "LuckyOne Mall", a: "Karachi", q: "LuckyOne Mall Karachi" } ] }
      ]}
    ],
    tips: [
      { i: "🕌", t: "At mosques and shrines, dress conservatively, cover your head and take off your shoes before entering." },
      { i: "👗", t: "Women in non-local clothes may draw curious looks. A long tunic or shalwar kameez helps you feel comfortable." },
      { i: "🚗", t: "Karachi is big and traffic is heavy. Plan your day by area (Saddar, Clifton) instead of trying to fit in many places." },
      { i: "🌙", t: "Ramadan is the holiest month of the Muslim calendar. Please behave respectfully during it." },
      { i: "🛂", t: "Check your government's latest travel advice and Pakistan's visa rules before you travel." }
    ],
    sources: [
      { title: "Best desi food in Karachi (Dawn)", url: "https://www.dawn.com/news/amp/1140694" },
      { title: "Must-have desi food items in Karachi (Zameen)", url: "https://www.zameen.com/blog/must-have-desi-food-items-karachi.html" },
      { title: "Food in Karachi and Lahore (Zameen)", url: "https://www.zameen.com/blog/food-karachi-lahore.html" },
      { title: "Must-visit attractions in Karachi (The Culture Trip)", url: "https://theculturetrip.com/articles/20-must-visit-attractions-in-karachi-pakistan" },
      { title: "Things to do in Karachi (Away With The Steiners)", url: "https://awaywiththesteiners.com/things-to-do-in-karachi-pakistan/amp/" },
      { title: "Best time to visit Karachi (Champion Traveler)", url: "https://championtraveler.com/dates/best-time-to-visit-karachi-pk/" },
      { title: "Holidays to Karachi (lastminute.com)", url: "https://www.lastminute.com/holidays/pk_pakistan/karachi-d1400163916" },
      { title: "A journey in Karachi (Turkish Airlines blog)", url: "https://blog.turkishairlines.com/en/?p=3711" },
      { title: "Empress Market (Wikipedia)", url: "https://en.wikipedia.org/wiki/Empress_Market" },
      { title: "Karachi: the dominant culture (History Pak)", url: "https://historypak.com/karachis-dominant-culture/" },
      { title: "Karachi: communities and languages (History Pak)", url: "https://historypak.com/karachi-the-most-largest/" },
      { title: "Karachi culture and traditions (Words.pk)", url: "https://words.pk/karachi-culture-and-traditions/" },
      { title: "Sindhi Cultural Day (Wikipedia)", url: "https://en.wikipedia.org/wiki/Sindhi_Cultural_Day" },
      { title: "Sindhi Culture Day and the Sindhi topi (PKLand)", url: "https://pkland.pk/sindhi-culture-day-topi-guide" },
      { title: "Sindh Literature Festival (Wikipedia)", url: "https://en.wikipedia.org/wiki/Sindh_Literature_Festival" }
    ]
  },

  /* ------------------------------------------------------------ HUNZA */
  {
    id: "hunza", name: "Hunza", province: "Gilgit-Baltistan", status: "draft",
    tagline: "A mountain valley of ancient forts, a turquoise lake, apricot orchards and one of Pakistan's warmest welcomes.",
    img: "images/hunza.jpg", imgPos: "center 40%",
    heroVideo: "https://www.youtube.com/watch?v=i0GpfpO9mCo",
    heroStart: 16,
    facts: [
      { b: "🗓 Best time", t: "April to October. Blossom in April and May, autumn colours in October and early November." },
      { b: "⛰ Altitude", t: "Karimabad sits at about 2,400 m. Take it easy on your first day." },
      { b: "🗣 Languages", t: "Burushaski, Wakhi and Shina are spoken. Urdu is widely understood." },
      { b: "🚌 Getting there", t: "Fly to Gilgit or drive the Karakoram Highway. Allow two extra days if driving from Islamabad." }
    ],
    plan: [
      { when: "Day 1", title: "Karimabad and Baltit Fort", t: "Visit Baltit Fort when it opens (8 or 9 AM depending on season) and allow about two hours. Walk the Karimabad bazaar, have walnut cake at Café de Hunza, then catch the sunset at Eagle's Nest." },
      { when: "Day 2", title: "Altit Fort and Attabad Lake", t: "Visit Altit Fort and its old village in the morning (about 3 km from Baltit). Then drive 30 to 45 minutes to Attabad Lake for a boat ride and a lakeside lunch." },
      { when: "Day 3", title: "Upper Hunza (Gojal)", t: "Passu Cones, Hussaini Bridge and Borith Lake make a long but rewarding day. Add Khunjerab Pass only if the pass is open. You can also stay overnight in Gulmit or Passu." }
    ],
    banners: [
      { b: "🌸 Two best seasons", t: "Late April to early May, when apricot blossom turns the valley white. And October to early November, when the poplars turn gold." },
      { b: "🎉 Festival times", t: "Ginani is around 21 June and Navroz marks the spring new year. Both are celebrated with music and special food." }
    ],
    sections: [
      { id: "central", short: "Central Hunza", icon: "🏰", title: "Central Hunza", sub: "Forts, viewpoints and the bazaar around Karimabad. Everything here is close together.", cards: [
        { n: "Baltit Fort", tag: "Fort", img: "images/baltit.jfif", s: "A roughly 700-year-old fort above Karimabad, once the seat of Hunza's rulers, now restored by the Aga Khan Trust for Culture and open as a museum.",
          facts: [ { k: "Suggested time", v: "About 2 hours" }, { k: "Opens", v: "8 or 9 AM, depending on season" } ],
          see: ["The old rooms and watchtowers", "Roof views across the valley"],
          near: "Altit Fort (about 3 km), Eagle's Nest (about 5 km)", q: "Baltit Fort Karimabad Hunza" },
        { n: "Altit Fort", tag: "Oldest fort", s: "The oldest fort in Hunza, often said to be around 900 years old, standing above the Hunza River gorge. Quieter and less restored than Baltit.",
          facts: [ { k: "Suggested time", v: "1 to 2 hours" }, { k: "Distance", v: "About 3 km from Baltit Fort" } ],
          see: ["The fort and its museum", "The old village and Royal Garden"],
          q: "Altit Fort Hunza" },
        { n: "Eagle's Nest (Duikar)", tag: "Viewpoint", s: "A high viewpoint at about 3,100 m with views over the valley and several peaks above 7,000 m. Famous for sunrise and sunset.",
          facts: [ { k: "Best time", v: "Sunrise or sunset" }, { k: "Season", v: "Accessible May to October" } ],
          m: "For sunrise, many visitors leave around 5 AM. Bring a warm layer.", q: "Eagle's Nest Duikar Hunza" },
        { n: "Karimabad Bazaar", tag: "Bazaar", s: "The heart of Hunza, with cafés, handicraft shops and dried apricots.",
          see: ["Embroidered caps and woollen goods", "Dried apricots and walnuts"],
          q: "Karimabad Bazaar Hunza" }
      ]},
      { id: "upper", short: "Upper Hunza", icon: "🏔", title: "Lakes and Upper Hunza", sub: "Further north along the Karakoram Highway. Distances are bigger and roads are slower than they look on the map.", cards: [
        { n: "Attabad Lake", tag: "Turquoise lake", img: "images/Attabad.jpg", s: "A turquoise lake formed by a landslide in 2010, now about 21 km long, with boating, jet skis and lakeside restaurants.",
          facts: [ { k: "Best time", v: "Summer" }, { k: "From Karimabad", v: "30 to 45 minutes" }, { k: "Suggested time", v: "2 to 3 hours" } ],
          see: ["A boat ride on the lake", "A lakeside lunch", "The tunnels along the Karakoram Highway"],
          q: "Attabad Lake Hunza" },
        { n: "Passu Cones", tag: "Iconic view", s: "Sharp, jagged peaks above the village of Passu, often called Passu Cathedral, and one of the most photographed views in Hunza.",
          see: ["The view of the cones from the highway", "Passu Glacier"],
          near: "Hussaini Bridge, Borith Lake", q: "Passu Cones Hunza" },
        { n: "Hussaini Suspension Bridge", tag: "Adventure", s: "A long rope-and-plank footbridge over the Hunza River, rebuilt after the 2010 landslide and one of the most photographed crossings in the north.",
          facts: [ { k: "Entry", v: "Small fee" } ],
          m: "The gaps between the planks make it a thrill. Cross only if you are comfortable with heights.", near: "Passu Cones", q: "Hussaini Suspension Bridge Hunza" },
        { n: "Borith Lake", tag: "Quiet stop", s: "A calm lake near Gulmit, usually combined with Passu and Hussaini Bridge in one day.",
          q: "Borith Lake Hunza" },
        { n: "Khunjerab Pass", tag: "Border pass", img: "images/KhunjerabPass.jpg", s: "The high mountain pass on the border with China, reached through Khunjerab National Park.",
          facts: [ { k: "From Passu", v: "About 2 hours" }, { k: "Season", v: "Usually open in summer" } ],
          m: "Opening dates and rules change. Check the current conditions and requirements before you travel.", q: "Khunjerab Pass" }
      ]},
      { id: "food", short: "Food", icon: "🍲", title: "Food", sub: "Hunza food is simple and filling, often cooked with apricot oil. Most places to eat are in and around Karimabad. Tap to see places and Maps.", cards: [
        { n: "Chapshuro", tag: "Must try", s: "Hunza's \"pizza\": a savoury flatbread stuffed with minced meat, vegetables and herbs.",
          spots: [ { n: "Hunza Food Pavilion", a: "Karimabad Bazaar", q: "Hunza Food Pavilion Karimabad" }, { n: "Café de Hunza", a: "Karimabad", q: "Cafe de Hunza Karimabad" } ] },
        { n: "Walnut cake", tag: "Famous", s: "The best-known treat in Hunza, filled with honey and walnuts. Visitors often take one home as a gift. Try it with Hunza tea.",
          spots: [ { n: "Café de Hunza", a: "Karimabad Bazaar", q: "Cafe de Hunza Karimabad" } ] },
        { n: "Dawdo (apricot soup)", tag: "Seasonal", s: "Apricots boiled with handmade noodles. It is seasonal, best from June to August.",
          spots: [ { n: "Hunza Food Pavilion", a: "Run by local women", q: "Hunza Food Pavilion Karimabad" } ] },
        { n: "Burus Shapik and Molida", tag: "Traditional", s: "Burus Shapik is chapati layered with local cheese and apricot oil. Molida is crushed bread with dried cheese and apricot oil, traditionally made for honoured guests.",
          spots: [ { n: "Kha Basi Café", a: "Run by local women", q: "Kha Basi Cafe Hunza" } ] },
        { n: "Harissa and Diram Phitti", tag: "Festival food", s: "Harissa is a wheat-and-meat dish served at the Navroz feast. Diram Phitti is a sweet bread cake made from sprouted wheat, eaten at Thumushiling." },
        { n: "Apricots", tag: "Take home", s: "Fresh in summer, dried through winter. Apricot oil is used in cooking, and apricot juice is on many menus.",
          m: "Many visitors praise the half-dried apricots from Khyber village in Upper Hunza." }
      ]},
      { id: "culture", short: "Culture", icon: "🎶", title: "People and culture", sub: "What makes Hunza feel different. Details vary between villages and families.", cards: [
        { n: "Languages", tag: "Burushaski", s: "Three main languages are spoken: Burushaski, Wakhi and Shina. Burushaski is a language isolate with no known relatives.",
          m: "Wakhi is the language of Upper Hunza (Gojal), where the harvest festival is called Chineer." },
        { n: "Ginani", tag: "Harvest festival", img: "images/hunza-festival.jpg", s: "An annual harvest festival, usually around 21 June, with ten days of music at Altit Fort before it.",
          m: "An annual harvest festival of Hunza and Nagar. Musicians at Altit Fort play tunes called Haneepa for ten days before Ginani day, and celebrations have included polo, tug-of-war, music and shared food." },
        { n: "Navroz", tag: "Spring new year", s: "The spring new year: a big feast, special dishes and colourful clothes.",
          m: "Families prepare a special feast with dishes such as Harissa and Chapshuro and wear colourful traditional clothes." },
        { n: "Traditional dress", tag: "Caps and robes", s: "Women wear a jewel-decorated embroidered cap under a long chador. Men wear long embroidered gowns with a woollen cap.",
          m: "Girls traditionally learn embroidery from their mothers and grandmothers. Woollen shawls are worn by both men and women in the cold winter months." },
        { n: "Crafts and souvenirs", tag: "Take home", s: "Embroidered caps, woollen shawls, handmade rugs, gemstone jewellery and wood carving.",
          m: "Wood carving is a living craft in Karimabad, and women artisans have taken it up in recent years. Rugs and carpets are mostly handmade rather than mass-produced." },
        { n: "Weddings", tag: "Traditions", s: "A small nikah on the bride's side, local music and dancing, and an embroidered woollen robe for the groom.",
          m: "In one account from Karimabad, the nikah was held on the bride's side, near her house, with a small group of relatives from the groom's side. In nearby Yasin, the women of the household weave and embroider the groom's robe. Details differ between villages and families." }
      ]}
    ],
    tips: [
      { i: "⛰", t: "Karimabad is about 2,400 m high. Rest on your first day, drink plenty of water and avoid rushing." },
      { i: "🛣", t: "Mountain roads can be slowed or blocked by weather and landslides. Keep a spare day in your plan." },
      { i: "📅", t: "Eagle's Nest is accessible from May to October, and Khunjerab Pass is usually open in summer. Check conditions before you travel." },
      { i: "🧥", t: "Evenings are cold even in summer. Bring warm layers, and dress modestly." },
      { i: "📷", t: "Ask before photographing people, especially women. Hunza is welcoming, and a polite question goes a long way." },
      { i: "🛂", t: "Check your government's latest travel advice and the current rules for visiting Gilgit-Baltistan before you travel." }
    ],
    sources: [
      { title: "Must visit places in Hunza (Pakistan Tour n Travel)", url: "https://pakistantourntravel.com/2026/04/29/must-visit-places-in-hunza/" },
      { title: "Hunza Valley travel guide (Karakoram Treks)", url: "https://karakoramtreks.com/blog/hunza-valley-travel-guide-2026/" },
      { title: "Hunza Valley travel guide (Intentional Detours)", url: "https://intentionaldetours.com/hunza-valley-travel-guide/" },
      { title: "Things to do in Hunza Valley (MySRZ Tourism)", url: "https://www.mysrztourism.com/blog/things-to-do-in-hunza-valley" },
      { title: "5-day Hunza itinerary (Raahi Retreats)", url: "https://raahiretreats.com/blog/hunza-valley-itinerary-5-days" },
      { title: "Hunza Valley area guide (Green Tourism Pakistan)", url: "https://greenpaktourism.com/areas/hunza" },
      { title: "Hunza Valley guide (Tormik Valley)", url: "https://tormikvalley.com/hunza-valley-guide/" },
      { title: "Hunza Valley travel guide (Northern Discover)", url: "https://northerndiscover.com/destination/hunza-valley/" },
      { title: "Best places to visit in Hunza (Real Pakistan)", url: "https://realpakistan.com.pk/top-10-places-to-visit-in-hunza-valley/" },
      { title: "Best places to eat in Hunza (Click Pakistan)", url: "https://clickpakistan.org/best-places-to-eat-in-hunza-valley-click-pakistan/" },
      { title: "Traditional foods in Hunza Valley (GoPKZ)", url: "https://gopkz.com/blogs/food/traditional-foods-hunza-valley" },
      { title: "A travelogue from Hunza (Truly Pakistan)", url: "https://trulypakistan.net/a-travelogue-from-hunza/" },
      { title: "Things to do in Hunza and Nagar (The Silent Traveler)", url: "https://thesilenttraveler.com/things-to-do-in-hunza-valley/" },
      { title: "Ginani (Wikipedia)", url: "https://en.wikipedia.org/wiki/Ginani" },
      { title: "Hunza crafts and dress (SMEDA)", url: "https://fon.smeda.org/?p=1227" },
      { title: "People of Hunza Valley: Culture and Traditions (Pleiades Travel)", url: "https://gopleiades.com/?p=13229" },
      { title: "Karimabad: Wedding (travel account)", url: "https://en.agustinuswibowo.com/?p=456" },
      { title: "Wedding clothing, Yasin (Horniman Museum)", url: "https://www.horniman.ac.uk/object/2015.7" },
      { title: "Culture of Gilgit-Baltistan (Wikipedia)", url: "https://en.wikipedia.org/wiki/Culture_of_Gilgit-Baltistan" }
    ]
  },

  /* -------------------------------------------------------- ISLAMABAD */
  {
    id: "islamabad", name: "Islamabad", province: "Islamabad Capital Territory", status: "draft",
    tagline: "Pakistan's calm, green capital, set against the Margalla Hills, with great views, museums and cafés.",
    img: "images/islamabad.jpg", imgPos: "center",
    heroVideo: "https://www.youtube.com/watch?v=rctbclDosWA",
    facts: [
      { b: "🗓 Best time", t: "Spring (March to April) and autumn (October to November). Winters are cool and summers are hot." },
      { b: "⏱ How long", t: "Two to three days covers the city well, including a hike and a day trip." },
      { b: "🏔 The hills", t: "The Margalla Hills National Park starts at the edge of the city, with forest trails and viewpoints." },
      { b: "🚕 Getting around", t: "Taxis and ride-hailing apps work well. For the hills, a driver for a half-day loop is easiest." }
    ],
    plan: [
      { when: "Morning", title: "Faisal Mosque and Daman-e-Koh", t: "Visit Faisal Mosque before the midday heat, then take the short drive up the hill to Daman-e-Koh for the view over the city." },
      { when: "Midday", title: "Pakistan Monument and Lok Virsa", t: "These two are close to each other on Shakarparian Hills. Go to Lok Virsa in late morning, before the crowds." },
      { when: "Evening", title: "Saidpur Village or Monal", t: "Saidpur Village works best in the late afternoon or evening. For dinner, try Des Pardes there, or go up to Monal for the view." },
      { when: "Day 2", title: "Margalla trail, then the lake", t: "Hike early in the morning (6 to 10 AM). In the late afternoon head to Rawal Lake for sunset, or take a half-day trip to Rawalpindi or Taxila." }
    ],
    banners: [
      { b: "🌿 A calm capital", t: "Islamabad is green, planned and relaxed compared with other big Pakistani cities. Weekdays are quieter at popular spots like Daman-e-Koh and Saidpur Village." },
      { b: "🗺 Plan by area", t: "Faisal Mosque, Daman-e-Koh and Saidpur Village are on one side of the city. Pakistan Monument and Lok Virsa form a second loop closer to the centre." }
    ],
    sections: [
      { id: "landmarks", short: "Landmarks", icon: "🕌", title: "Landmarks and museums", sub: "The capital's best-known sights. Hours and entry fees can change, so check before you go.", cards: [
        { n: "Faisal Mosque", tag: "Icon", img: "images/faisal-mosque.jpg", s: "Pakistan's best-known mosque, shaped like a Bedouin tent with four tall minarets and no dome, at the foot of the Margalla Hills. Designed by Turkish architect Vedat Dalokay and completed in 1986.",
          facts: [ { k: "Best time", v: "Sunset or evening, when it is lit up" }, { k: "Usual hours", v: "About 5 AM to 10:30 PM" }, { k: "Suggested time", v: "About 1 hour" } ],
          m: "Dress modestly. Visitors are welcome outside prayer times.", near: "Daman-e-Koh", q: "Faisal Mosque Islamabad" },
        { n: "Pakistan Monument", tag: "Monument", img: "images/pakistan-monument.jpg", s: "A petal-shaped monument on Shakarparian Hills, representing the provinces and territories, with views over the city. It opened in 2007.",
          facts: [ { k: "Best time", v: "Late afternoon to sunset" }, { k: "Usual hours", v: "About 9 AM to 9 PM" }, { k: "Suggested time", v: "About 1 hour" } ],
          see: ["The monument and its viewpoint", "The Pakistan Monument Museum next door"], near: "Lok Virsa Museum", q: "Pakistan Monument Islamabad" },
        { n: "Lok Virsa Heritage Museum", tag: "Culture", img: "images/lokvirsa.jpg", s: "The national museum of folk and traditional heritage: crafts, music and everyday culture from across Pakistan.",
          facts: [ { k: "Best time", v: "Late morning, before the crowds" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          near: "Pakistan Monument", q: "Lok Virsa Museum Islamabad" },
        { n: "Pakistan Museum of Natural History", tag: "Family", s: "A natural history museum that works well for families with children.",
          m: "Check opening hours before you go.", q: "Pakistan Museum of Natural History Islamabad" }
      ]},
      { id: "hills", short: "Hills and lakes", icon: "⛰", title: "Hills, views and lakes", sub: "Islamabad's green side. Weekdays are quieter.", cards: [
        { n: "Daman-e-Koh", tag: "Viewpoint", img: "images/daman-e-koh.jpg", s: "A hilltop garden halfway up the Margalla Hills with the best panoramic view of Islamabad, including Faisal Mosque and Rawal Lake.",
          facts: [ { k: "Best time", v: "Afternoon to sunset" }, { k: "Usual hours", v: "About 6 AM to 10 PM" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          see: ["The city view, busiest at sunset", "Small cafés and walking paths"], near: "Faisal Mosque, Saidpur Village", q: "Daman-e-Koh Islamabad" },
        { n: "Margalla Hills trails", tag: "Hiking", img: "images/margalla-hills.jpg", s: "Pine forest trails that start at the edge of the city. Trail 3 begins near F-6 and Trail 5 starts from Daman-e-Koh.",
          facts: [ { k: "Best time", v: "6 to 10 AM" }, { k: "Best seasons", v: "Spring and autumn" } ],
          m: "Carry water and wear comfortable shoes. Monkeys live along the trails, so keep food out of sight.", q: "Margalla Hills National Park Trail 3 Islamabad" },
        { n: "Saidpur Village", tag: "Old village", img: "images/saidpur-village.jpg", s: "A restored historical village at the foot of the Margalla Hills, now with cafés and restaurants. Best in the late afternoon or evening.",
          see: ["Strolling the old lanes", "Dinner with a view of the hills"], near: "Daman-e-Koh, Faisal Mosque", q: "Saidpur Village Islamabad" },
        { n: "Rawal Lake and Lake View Park", tag: "Lake", img: "images/rawal-lake.jpg", s: "Boating, picnics and birdwatching by the lake. Lovely at sunrise or sunset.",
          q: "Lake View Park Islamabad" }
      ]},
      { id: "trips", short: "Day trips", icon: "🚌", title: "Day trips", sub: "Just outside the city, in the direction of Rawalpindi.", cards: [
        { n: "Raja Bazaar, Rawalpindi", tag: "Old bazaar", s: "The old bazaar of neighbouring Rawalpindi, a lively contrast to calm Islamabad.",
          facts: [ { k: "Suggested time", v: "Half a day" } ], q: "Raja Bazaar Rawalpindi" },
        { n: "Taxila", tag: "UNESCO", img: "images/taxila-card.jpg", s: "Ancient ruins west of Islamabad, a UNESCO World Heritage Site, good for a half-day trip.",
          facts: [ { k: "Suggested time", v: "Half a day" } ],
          m: "Check opening hours and the best route before you go.", q: "Taxila archaeological ruins" }
      ]},
      { id: "food", short: "Food", icon: "🍽", title: "Food", sub: "Islamabad is better known for its restaurants, views and cafés than for one signature dish. Tap to see places and Maps. Quality and hours change, so check recent reviews.", cards: [
        { n: "Dinner with a view", tag: "Monal", s: "The Monal is the best-known restaurant in Islamabad, with large outdoor terraces looking out over the city, and popular for barbecue.",
          spots: [ { n: "The Monal", a: "Pir Sohawa Road", q: "The Monal Islamabad Pir Sohawa Road" } ] },
        { n: "Saidpur Village dining", tag: "Heritage setting", s: "Pakistani food in a restored village at the foot of the hills. Good before or after exploring the village.",
          spots: [ { n: "Des Pardes", a: "Saidpur Village", q: "Des Pardes Restaurant Saidpur Village Islamabad" }, { n: "Andaaz", a: "Saidpur Village", q: "Andaaz Restaurant Saidpur Village Islamabad" } ] },
        { n: "Melody Food Park", tag: "Food street", s: "One of Islamabad's oldest food streets, with many small stalls offering karahi, kebabs and street food. Known for cheap Pakistani food, ras malai, khoya ice cream, paan and kehwa.",
          spots: [ { n: "Melody Food Park", a: "G-6 Markaz", q: "Melody Food Park G-6 Islamabad" } ] },
        { n: "Pashtun food and chapli kebab", tag: "Local favourite", s: "Pashtun and Afghan-style food and barbecue, including chapli kebab, in the Super Market area of F-6.",
          spots: [ { n: "Khyber Dodai", a: "F-6 Super Market", q: "Khyber Dodai Islamabad" } ] },
        { n: "Cafés in Kohsar Market", tag: "Breakfast and brunch", s: "A compact market full of cafés and restaurants, good for breakfast, brunch or a relaxed coffee.",
          spots: [ { n: "Street 1 Cafe", a: "Kohsar Market, F-6", q: "Street 1 Cafe Kohsar Market Islamabad" }, { n: "Tuscany Courtyard", a: "Kohsar Market, F-6", q: "Tuscany Courtyard Kohsar Market Islamabad" } ] },
        { n: "Rooftop at Jinnah Super", tag: "Evening", s: "Jinnah Super Market (F-7) mixes shopping and dining, with rooftop cafés for an easy evening.",
          spots: [ { n: "Atrio Rooftop Café and Grill", a: "Jinnah Super, F-7", q: "Atrio Rooftop Cafe and Grill Jinnah Super Islamabad" } ] }
      ]}
    ],
    tips: [
      { i: "🕌", t: "At Faisal Mosque, dress modestly. Visitors are welcome outside prayer times." },
      { i: "🥾", t: "For the Margalla trails, go early (6 to 10 AM), carry water and wear comfortable shoes. Monkeys live along the paths, so keep food out of sight." },
      { i: "📅", t: "Weekdays are quieter at Daman-e-Koh and Saidpur Village. Spring and autumn are the most comfortable seasons." },
      { i: "🗺", t: "Plan by area: Faisal Mosque, Daman-e-Koh and Saidpur Village together, and Pakistan Monument and Lok Virsa together." },
      { i: "🌙", t: "Ramadan is the holiest month of the Muslim calendar. Please behave respectfully during it." },
      { i: "🛂", t: "Check your government's latest travel advice and Pakistan's visa rules before you travel." }
    ],
    sources: [
      { title: "Top 10 best Islamabad tourist places (Chakor Ventures)", url: "https://chakorventures.com/top-10-best-islamabad-tourist-places/" },
      { title: "Things to do in Islamabad (Pak Citizen Guide)", url: "https://pakcitizenguide.com/things-to-do-in-islamabad-2026-top-attractions-hiking-food-day-trips-guide" },
      { title: "Best places to visit in Islamabad (Upload Article)", url: "https://uploadarticle.net/best-places-to-visit-in-islamabad-a-complete-travel-guide/" },
      { title: "Islamabad area guide (Green Tourism Pakistan)", url: "https://greenpaktourism.com/areas/islamabad" },
      { title: "Best places to visit in Islamabad (Envoy Hotel)", url: "https://envoyhotel.com/blogs/best-places-to-visit-in-islamabad-in-2026-envoy-hotel-guide" },
      { title: "Islamabad travel guide (Atlas Guide)", url: "https://www.atlas-guide.com/asia/pakistan/islamabad" },
      { title: "Things to do in Islamabad (Truly Pakistan)", url: "https://trulypakistan.net/things-to-do-in-islamabad/" },
      { title: "Top 10 places to visit in Islamabad (Real Pakistan)", url: "https://realpakistan.com.pk/top-10-places-to-visit-in-islamabad/" },
      { title: "Where to eat in Islamabad (Wanderlog)", url: "https://wanderlog.com/list/geoCategory/197906/where-to-eat-the-50-best-restaurants-in-islamabad" },
      { title: "Best restaurants in Islamabad (Chakor Ventures)", url: "https://chakorventures.com/best-restaurants-in-islamabad/" },
      { title: "Top restaurants in Islamabad (How2HaveFun)", url: "https://how2havefun.com/restaurants/top-restaurants-islamabad" },
      { title: "Restaurants in Islamabad (Islamabad Business Directory)", url: "https://islamabad.org.pk/restaurants-islamabad-best-places-eat-2026/" }
    ]
  },

  /* ---------------------------------------------------------- LAHORE */
  {
    id: "lahore", name: "Lahore", province: "Punjab", status: "draft",
    tagline: "The Mughal heart of Punjab: great mosques, royal gardens, and a food scene people travel for.",
    img: "images/lahorefort.webp", imgPos: "center 45%",
    heroVideo: "https://www.youtube.com/watch?v=j8Qhqwbv3A0",
    heroStart: 45,   // skips the first 5 seconds of the film
    facts: [
      { b: "🗓 Best time", t: "October to March is pleasant for sightseeing. Outside these months it can get very hot." },
      { b: "🗣 Languages", t: "Punjabi and Urdu are spoken everywhere. English is common in tourist areas." },
      { b: "👗 What to wear", t: "Dress modestly, and women should carry a scarf for mosques." },
      { b: "🚕 Getting around", t: "Ride-hailing apps or a local guide are the easiest way to get around." }
    ],
    plan: [
      { when: "Early morning", title: "Walled City and breakfast", t: "Start before 9am, when it is cooler and quieter. Walk from Delhi Gate toward Wazir Khan Mosque, then have halwa puri or siri paye for breakfast." },
      { when: "Midday", title: "Lahore Fort", t: "Give it 2 to 3 hours. The fort is a UNESCO World Heritage Site and sits right next to Badshahi Mosque." },
      { when: "Late afternoon", title: "Badshahi Mosque at sunset", t: "Many visitors say sunset is the best time, when the mosque glows warmly. Check prayer times first." },
      { when: "Evening", title: "Dinner with a view", t: "Try a rooftop on Fort Road Food Street for views of Badshahi Mosque, or head to Gawalmandi for classic Lahori food." }
    ],
    banners: [
      { b: "🍽 Lahore is often called Pakistan's food capital", t: "Breakfast is a big event here. For siri paye and nihari, go early, between 5 and 8 AM. Nihari spots often sell out by late morning." },
      { b: "📚 A UNESCO City of Literature", t: "Lahore has a long tradition of books, poetry and publishing, and a lively literary scene." }
    ],
    sections: [
      { id: "history", short: "History", icon: "🏛", title: "History and landmarks", sub: "Most of the big sights are in or near the Walled City. Opening days and hours can change, so check before you go.", cards: [
        { n: "Badshahi Mosque", tag: "Mughal", img: "images/badshahi.jpg", s: "A grand red sandstone mosque built in the 17th century under Emperor Aurangzeb, with a huge courtyard.",
          facts: [ { k: "Usual hours", v: "About 8 AM to 7 PM" }, { k: "Best time", v: "Sunset or early morning" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          see: ["The vast courtyard and main prayer hall", "Views of the mosque from Lahore Fort"],
          m: "Visitors are welcome outside prayer times. It is closed to tourists during prayers, especially Friday prayers. Dress modestly, and carry small change for shoe storage.", near: "Lahore Fort, Fort Road Food Street", q: "Badshahi Mosque Lahore" },
        { n: "Lahore Fort", tag: "UNESCO", img: "images/lahorefort.webp", imgPos: "center 40%", s: "A huge Mughal-era citadel in the Walled City, covering more than 20 hectares, with palaces, gardens and gateways.",
          facts: [ { k: "Suggested time", v: "2 to 3 hours" }, { k: "Status", v: "UNESCO World Heritage Site" } ],
          see: ["The famous Picture Wall", "Palaces and gardens inside the fort", "Views of Badshahi Mosque"],
          near: "Badshahi Mosque", q: "Lahore Fort" },
        { n: "Wazir Khan Mosque", tag: "Tilework", s: "A 17th-century mosque in the Walled City, loved for its detailed tilework and painted decoration.",
          facts: [ { k: "Best time", v: "Daylight, to see the tilework" }, { k: "Suggested time", v: "30 to 60 minutes" } ],
          see: ["Colourful tile and fresco work", "The surrounding old lanes"],
          m: "It is smaller than Badshahi Mosque but many visitors rank it among the most beautiful in Pakistan.", q: "Wazir Khan Mosque Lahore" },
        { n: "Walled City and Delhi Gate", tag: "Old city", s: "Lahore's old quarter, full of narrow lanes, old houses and bazaars. Go early before the heat and crowds.",
          facts: [ { k: "Best time", v: "Before 9 AM" }, { k: "Suggested time", v: "Half a day" } ],
          see: ["Start at Delhi Gate and follow the royal route toward Wazir Khan Mosque", "Street food and old bazaars"],
          q: "Delhi Gate Lahore" },
        { n: "Shalimar Gardens", tag: "UNESCO", img: "images/shalimar-card.jpg", s: "A Mughal garden built in 1642 under Shah Jahan, with terraced lawns, fountains and shaded walkways.",
          facts: [ { k: "Suggested time", v: "1 to 2 hours" }, { k: "Status", v: "UNESCO World Heritage Site" }, { k: "Where", v: "Outside the Walled City" } ],
          see: ["Terraces, water channels and fountains", "A peaceful break from the busy city"],
          m: "If you are short on time, this is the one to skip. Use a ride-hailing app to get there.", q: "Shalimar Gardens Lahore" },
        { n: "Lahore Museum", tag: "Museum", s: "One of Pakistan's best-known museums, with art and history collections.",
          facts: [ { k: "Suggested time", v: "2 to 3 hours" } ],
          m: "Check opening days and ticket details before you go.", q: "Lahore Museum" }
      ]},
      { id: "evenings", short: "Evenings", icon: "🌙", title: "Evenings and views", sub: "Lahore is at its best after sunset.", cards: [
        { n: "Fort Road Food Street", tag: "Rooftops", s: "Rooftop restaurants with views of Badshahi Mosque and Lahore Fort, especially lovely at night.",
          facts: [ { k: "Best time", v: "Evening and night" } ],
          m: "Many visitors come mainly for the view and the setting. Popular names include Haveli Restaurant and Cuckoo's Den.",
          spots: [ { n: "Haveli Restaurant", a: "Fort Road", q: "Haveli Restaurant Lahore" }, { n: "Cuckoo's Den", a: "Fort Road", q: "Cuckoo's Den Lahore" } ], q: "Fort Road Food Street Lahore" },
        { n: "Minar-e-Pakistan", tag: "Landmark", img: "images/minar.jpg", imgPos: "center 45%", s: "A tall national monument in a large park, lit up at night.",
          facts: [ { k: "Best time", v: "Evening" } ],
          see: ["The monument and the park around it"], near: "Badshahi Mosque, Lahore Fort", q: "Minar-e-Pakistan Lahore" },
        { n: "Old Anarkali Food Street", tag: "Street food", s: "A busy food street in the old Anarkali area, known for falooda and snacks.",
          spots: [ { n: "Riaz Falooda", a: "Old Anarkali", q: "Riaz Falooda Anarkali Lahore" } ], q: "Old Anarkali Food Street Lahore" }
      ]},
      { id: "food", short: "Food", icon: "🍽", title: "Food", sub: "Famous Lahori classics and where people go for them. Tap to see places and Maps. Quality and hours change over time, so check recent reviews.", cards: [
        { n: "Halwa puri breakfast", tag: "Breakfast", img: "images/halwa-puri.webp", s: "A classic weekend breakfast: fried puri with sweet halwa and chickpea curry. Expect queues on weekends.",
          spots: [ { n: "Taj Mahal Halwa Poori", a: "Shahi Mohallah, Walled City", q: "Taj Mahal Halwa Poori Lahore" } ] },
        { n: "Siri paye", tag: "Must try", s: "Slow-cooked sheep trotters and head in a rich, sticky broth, eaten early in the morning with khameeri roti or naan.",
          spots: [ { n: "Phajja Siri Paye", a: "Kali Beri Bazaar, Walled City", q: "Phajja Siri Paye Lahore" } ] },
        { n: "Nihari", tag: "Breakfast", img: "images/nihari.jpg", imgPos: "center 62%", s: "A rich, slow-cooked stew, best early in the morning with fresh khameeri roti. It often sells out by late morning.",
          spots: [ { n: "Waris Nihari", a: "Anarkali", q: "Waris Nihari Lahore" } ] },
        { n: "Karahi", tag: "Dinner", s: "Lahore's famous butter-rich chicken karahi, eaten with roti. Lakshmi Chowk is the best-known area for it.",
          spots: [ { n: "Butt Karahi", a: "Lakshmi Chowk", q: "Butt Karahi Lakshmi Chowk Lahore" } ] },
        { n: "Gawalmandi Food Street", tag: "Dinner", s: "One of Pakistan's oldest food streets, known for fried fish, murgh cholay, hareesa and BBQ. Best in the evening.",
          spots: [ { n: "Gawalmandi Food Street", a: "Chamberlain Road", q: "Gawalmandi Food Street Lahore" }, { n: "Haji Sardar Fish", a: "Gawalmandi", q: "Haji Sardar Fish Gawalmandi Lahore" }, { n: "Saadiq Murgh Cholay", a: "Gawalmandi", q: "Saadiq Murgh Cholay Gawalmandi Lahore" } ] },
        { n: "Falooda and lassi", tag: "Dessert", s: "Cold drinks and desserts after a heavy meal: falooda, kulfi and thick Lahori lassi.",
          spots: [ { n: "Yousaf Falooda", a: "Gawalmandi", q: "Yousaf Falooda Gawalmandi Lahore" }, { n: "Riaz Falooda", a: "Old Anarkali", q: "Riaz Falooda Anarkali Lahore" }, { n: "Feeka Lassi", a: "Gawalmandi", q: "Feeka Lassi Gawalmandi Lahore" } ] }
      ]}
    ],
    tips: [
      { i: "🕌", t: "At mosques, dress modestly and carry a scarf if you are a woman. Mosques can be closed to visitors during prayer times, especially Friday prayers. Carry small change for shoe storage." },
      { i: "🌅", t: "Go early to the Walled City. Before 9 AM it is cooler, quieter and the morning light is lovely." },
      { i: "☀️", t: "Summer is very hot. October to March is much more comfortable for walking around." },
      { i: "🚕", t: "Use ride-hailing apps or a local guide, and keep a loose plan since traffic can be heavy." },
      { i: "🌙", t: "Ramadan is the holiest month of the Muslim calendar. Please behave respectfully during it." },
      { i: "🛂", t: "Check your government's latest travel advice and Pakistan's visa rules before you travel." }
    ],
    sources: [
      { title: "Popular food streets in Lahore (Graana)", url: "https://www.graana.com/blog/food-street-lahore/" },
      { title: "Must-have foods in Lahore (Medium)", url: "https://medium.com/@sabrinasajid52/must-have-foods-in-lahore-in-2023-4cad0b8db387" },
      { title: "Best food in Lahore (Zarrasha)", url: "https://www.zarrasha.com/best-food-in-lahore/" },
      { title: "Best street food cities in Pakistan (PakBestFinds)", url: "https://pakbestfinds.com/best-street-food-cities-in-pakistan/" },
      { title: "Gawalmandi Food Street (Wikipedia)", url: "https://en.wikipedia.org/wiki/Gawalmandi_Food_Street" },
      { title: "Pakistani food streets (Wikipedia)", url: "https://en.wikipedia.org/wiki/Pakistani_food_streets" },
      { title: "Lahore travel guide (Audiala)", url: "https://audiala.com/en/pakistan/lahore" },
      { title: "Badshahi Mosque visiting guide (Audiala)", url: "https://audiala.com/en/pakistan/lahore/badshahi-mosque" },
      { title: "Things to do in Lahore (Away With The Steiners)", url: "https://awaywiththesteiners.com/things-to-do-in-lahore-pakistan/" },
      { title: "Best places to visit in Lahore (Pakistan Tour Packages)", url: "https://pakistantourpackages.com/blog/best-places-to-visit-in-lahore/" },
      { title: "Places to visit in Lahore (Pakrism)", url: "https://pakrism.pk/places-to-visit-in-lahore/" },
      { title: "What to do in Lahore (Revibe Journeys)", url: "https://revibejourneys.com/what-to-do-in-lahore/" }
    ]
  },
  { id: "swat", name: "Swat and Kalam", province: "Khyber Pakhtunkhwa", status: "soon", img: "images/swat.jpg", imgPos: "center", tagline: "Green valleys and rivers." },
  {
    id: "skardu", name: "Skardu and Baltistan", province: "Gilgit-Baltistan", status: "draft",
    tagline: "The gateway to K2: turquoise lakes, a cold desert, ancient forts and the high plains of Deosai.",
    img: "images/skarduu.jpg", imgPos: "center",
    heroVideo: "https://www.youtube.com/watch?v=sRVWO7EnibI",
    heroStart: 18,
    facts: [
      { b: "🗓 Best time", t: "May to October, when roads and lakes are open. Deosai is open only from mid-June to October." },
      { b: "⏱ How long", t: "Three days covers Skardu town, the lakes and Katpana. Five to seven days adds Shigar, Khaplu and Deosai." },
      { b: "⛰ Altitude", t: "Skardu sits at about 2,200 m, with cold nights even in summer." },
      { b: "🗣 Language", t: "Balti is the local language, with Tibetan influences. Urdu is widely understood." }
    ],
    plan: [
      { when: "Day 1", title: "The Kachura Lakes", t: "Drive about 25 km to Upper Kachura Lake, with the famous Shangrila Resort nearby, and arrive in time for the late afternoon light. Stop at the quieter Lower Kachura Lake on the way back." },
      { when: "Day 2", title: "Shigar Valley", t: "A short drive east into the valley of apricot orchards. Visit Shigar Fort, a 17th-century palace restored by the Aga Khan Trust. It is worth visiting even if you are not staying there." },
      { when: "Day 3", title: "Khaplu day trip", t: "About two to two and a half hours each way on mountain roads. Visit Khaplu Palace above the Shyok Valley and the old wooden mosques of the village." },
      { when: "Day 4", title: "Deosai National Park", t: "A full day on the high plains, only mid-June to October. The park closes at night, so plan to return to Skardu before dark." },
      { when: "Day 5", title: "Katpana and Kharpocho Fort", t: "Visit Katpana Cold Desert about 10 km from town, then climb to Kharpocho Fort for the view over the whole valley." }
    ],
    banners: [
      { b: "🌸 Seasons", t: "Cherry and apricot blossom in Shigar and Khaplu comes in spring. Summer suits Deosai and the lakes. Many travellers call autumn the most beautiful season." },
      { b: "🏔 A Balti blend", t: "Baltistan has its own culture, a mix of Tibetan influences and Islamic heritage, seen in its forts, old wooden mosques and village traditions." }
    ],
    sections: [
      { id: "nature", short: "Lakes and nature", icon: "🏞", title: "Lakes, desert and high plains", sub: "Skardu's famous scenery. Seasons matter here, so check the months for each place.", cards: [
        { n: "Lower Kachura Lake (Shangrila)", tag: "Iconic", img: "images/skardu.jpg", s: "The heart-shaped lake famous from photographs, home to the Shangrila Resort, built in 1983. Its restaurant is set inside an old aircraft.",
          facts: [ { k: "Best time", v: "May to October" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          m: "It is the most developed and touristy of the two lakes, and prices at the resort are higher.", near: "Upper Kachura Lake (about 3 km)", q: "Shangrila Resort Skardu" },
        { n: "Upper Kachura Lake", tag: "Quiet lake", img: "images/upper-kachura.jpg", s: "Clearer and quieter than Lower Kachura, with boating and rocky shores. A short drive from the first lake.",
          facts: [ { k: "Best time", v: "May to October" }, { k: "Suggested time", v: "2 to 3 hours" }, { k: "From Skardu", v: "About 25 km" } ],
          see: ["Boating on the lake", "Photography in the late afternoon light"], q: "Upper Kachura Lake Skardu" },
        { n: "Katpana Cold Desert", tag: "Sunset", img: "images/katpana.jpg", s: "Sand dunes at about 2,200 m with snow-capped peaks behind them, one of the highest cold deserts in the world.",
          facts: [ { k: "From Skardu", v: "About 10 km" }, { k: "Suggested time", v: "2 to 3 hours" }, { k: "Season", v: "Open all year" } ],
          see: ["Sunset over the dunes"], q: "Katpana Cold Desert Skardu" },
        { n: "Deosai National Park", tag: "Land of Giants", img: "images/DeosaiPlains.jpg", s: "A vast high plateau, known as the Land of Giants, with wildflower meadows, marmots and the endangered Himalayan brown bear.",
          facts: [ { k: "Season", v: "Mid-June to October" }, { k: "Suggested time", v: "A full day" } ],
          m: "The park closes at night, so return to Skardu before dark. It is not accessible for much of the year because of snow.", q: "Deosai National Park" },
        { n: "Sheosar Lake", tag: "In Deosai", img: "images/sheosar-lake.jpg", s: "A high-altitude lake inside Deosai National Park, about 40 km from Skardu.",
          facts: [ { k: "Best time", v: "June to September" } ],
          q: "Sheosar Lake Deosai" }
      ]},
      { id: "forts", short: "Forts and palaces", icon: "🏰", title: "Forts and palaces", sub: "Baltistan's heritage, from a hilltop fort to restored royal palaces.", cards: [
        { n: "Kharpocho Fort", tag: "Viewpoint", img: "images/kharpocho-fort.jpg", s: "A 16th-century fort above Skardu town, climbed for the view that explains the whole valley.",
          see: ["The view over Skardu and the Indus valley"], q: "Kharpocho Fort Skardu" },
        { n: "Shigar Fort", tag: "Heritage", img: "images/shigar-fort.jpg", s: "A 17th-century palace built of wood and stone, restored by the Aga Khan Trust for Culture and now a heritage hotel.",
          facts: [ { k: "From Skardu", v: "About 32 km" }, { k: "Suggested time", v: "1 to 2 hours" }, { k: "Season", v: "Open all year" } ],
          see: ["The restored fort and its gardens", "Shigar village, its bazaar and old mosque"], m: "You can visit even if you are not staying there.", q: "Shigar Fort Serena" },
        { n: "Khaplu Palace", tag: "Heritage", img: "images/khaplu-palace.jpg", s: "A royal palace above the Shyok Valley, with a faintly Tibetan style, now a heritage hotel that is also open for visits.",
          facts: [ { k: "From Skardu", v: "About 100 km, 2 to 2.5 hours" }, { k: "Suggested time", v: "2 to 3 hours" } ],
          see: ["The palace and its views up the valley", "The old wooden mosques in the village"], q: "Khaplu Palace" }
      ]},
      { id: "food", short: "Food", icon: "🥟", title: "Food", sub: "Balti food is warm and filling, built for cold weather. Tap to see places and Maps. Quality and hours change, so check recent reviews.", cards: [
        { n: "Mamtu", tag: "Must try", img: "images/mamtu.jpg", s: "Balti steamed dumplings filled with seasoned minced meat, served with chilli sauce. The dish most closely linked with Skardu.",
          spots: [ { n: "Mamtu De Skardu", a: "Near the bazaar", q: "Mamtu De Skardu" }, { n: "Café de Khaplu", a: "Khaplu", q: "Cafe de Khaplu" } ] },
        { n: "Chapshoro", tag: "Balti meat pie", img: "images/chapshoro.jpg", s: "A baked meat-filled bread, found across Gilgit-Baltistan and made the traditional way in Skardu.",
          spots: [ { n: "Skardu Food Street (Api Xhoq)", a: "Skardu", q: "Skardu Food Street Api Xhoq" }, { n: "Concordia II", a: "Airport Road", q: "Concordia II Restaurant Skardu" } ] },
        { n: "Balay and Prapu", tag: "Warming", s: "Balay is a handmade wheat-noodle soup, and Prapu is a buckwheat noodle dish. Both suit cold evenings.",
          spots: [ { n: "Dewane Khas", a: "Airport Road", q: "Dewane Khas Restaurant Skardu" }, { n: "Balti Cuisine Skardu", a: "Marafie Colony Road, home-style", q: "Balti Cuisine Skardu" } ] },
        { n: "Khambir and butter tea", tag: "Local staples", s: "Khambir is a thick whole-wheat bread baked in clay ovens. Butter tea is a salty tea made with butter and milk, often from yak milk." },
        { n: "Fresh trout", tag: "Lakeside", img: "images/trout.jpg", s: "River and lake trout, fried or curried, is one of the best things to eat here.",
          spots: [ { n: "Shangrila Resort restaurant", a: "Lower Kachura Lake", q: "Shangrila Resort Skardu" } ] },
        { n: "Apricots and walnuts", tag: "Take home", s: "Villages like Shigar and Khaplu make their own apricot jam, and dried apricots and walnut dishes are common.",
          m: "Eat it with local bread for a sweet start to the day." }
      ]}
    ],
    tips: [
      { i: "⛰", t: "Skardu is at about 2,200 m and nights are cold. Bring layers, even in summer." },
      { i: "🐻", t: "Deosai is open only from mid-June to October. The park closes at night, so plan to be back in Skardu before dark." },
      { i: "🛣", t: "Distances are long and roads are slow. Khaplu is 2 to 2.5 hours each way. Keep a spare day for weather." },
      { i: "🧗", t: "Skardu is the gateway to K2 and other treks. These need a licensed operator and the right permits, so check the current rules first." },
      { i: "👗", t: "Dress modestly and ask before photographing people, especially women." },
      { i: "🛂", t: "Check your government's latest travel advice and the current rules for visiting Gilgit-Baltistan before you travel." }
    ],
    sources: [
      { title: "Is Skardu worth visiting? (Mosafir)", url: "https://mosafir.pk/blogs/is-skardu-worth-visiting-in-2026-complete-travel-guide-for-pakistani-travelers" },
      { title: "Skardu, Pakistan Travel Guide", url: "https://www.pakistantravelguide.pk/category/skardu-pakistan/" },
      { title: "Must-see attractions in Skardu (Nature Adventure Club)", url: "https://www.natureadventureclub.pk/blog/must-visit-places-skardu/" },
      { title: "Skardu travel guide 2026 (Ilyas Skardu Travels)", url: "https://ilyasskardutravelsandtours.com/skardu-travel-guide-2026/" },
      { title: "Skardu Valley guide (Pakistan Tour Maker)", url: "https://pakistantourmaker.com/destinations/skardu-valley/" },
      { title: "5-day Skardu itinerary (Raahi Retreats)", url: "https://raahiretreats.com/blog/skardu-itinerary-5-days" },
      { title: "Skardu sightseeing itinerary (Ilyas Skardu Travels)", url: "https://ilyasskardutravelsandtours.com/skardu-sightseeing-itinerary-guide/" },
      { title: "Best time to visit Skardu (K2 Travels and Tours)", url: "https://k2travelsandtours.com/best-time-to-visit-skardu/" },
      { title: "Skardu Valley guide (Real Pakistan)", url: "https://realpakistan.com.pk/explore-skardu/" },
      { title: "Best restaurants in Skardu (Pakrism)", url: "https://pakrism.pk/best-restaurants-in-skardu/" },
      { title: "Best food in Skardu (MealBear)", url: "https://www.mealbear.pk/blog/best-food-in-skardu-complete-guide" },
      { title: "Restaurants in Skardu (Gilgit-Baltistan Guide)", url: "https://www.gilgitbaltistanguide.com/skardu/restaurants" },
      { title: "Traditional food of Skardu (iMusafir)", url: "https://www.imusafir.pk/blog/%F0%9F%A5%98-traditional-food-of-skardu-what-to-eat-on-your-next-trip/" },
      { title: "Traditional food in Skardu (Click Pakistan)", url: "https://clickpakistan.org/food-in-skardu/" }
    ]
  },
  { id: "kaghan", name: "Kaghan and Naran", province: "Khyber Pakhtunkhwa", status: "soon", img: "images/saifulmalook.jpg", imgPos: "center", tagline: "Alpine lakes and meadows." },
  {
    id: "diamer", name: "Diamer and Fairy Meadows", province: "Gilgit-Baltistan", status: "draft",
    tagline: "A meadow at 3,300 m beneath Nanga Parbat, reached by one of the world's wildest jeep tracks, with ancient rock carvings along the Karakoram Highway.",
    img: "images/FairyMeadows.webp", imgPos: "center",   // <- this photo shows a stock-photo caption and is small. Replace it with a free-licence photo when you have one
    heroVideo: "https://www.youtube.com/watch?v=ZXlxVSqQ1gI",
    heroStart: 0,   // change this number (seconds) if the film has an intro you want to skip
    facts: [
      { b: "🗓 Best time", t: "June to September (some guides say May to October). Fairy Meadows is closed in winter because of snow." },
      { b: "⛰ Altitude", t: "The meadow is at about 3,300 m, directly below Nanga Parbat (8,126 m). Base camp is at about 4,200 m." },
      { b: "🚙 Getting there", t: "From Raikot Bridge on the Karakoram Highway: a 4x4 jeep to Tato village (about 1.5 hours), then a 3 to 4 hour trek." },
      { b: "📄 Permits", t: "Several guides say no permit is needed for Fairy Meadows or the Raikot-face base camp trek. Rules can change, so check." }
    ],
    plan: [
      { when: "Day 1", title: "Chilas and the rock carvings", t: "Drive along the Karakoram Highway to Chilas. If you have time, stop at the Thalpan rock carvings. Stay overnight in Chilas or near Raikot Bridge." },
      { when: "Day 2", title: "Jeep to Tato, trek to the meadow", t: "Take a 4x4 jeep from Raikot Bridge to Tato village, then walk 3 to 4 hours up to Fairy Meadows. Watch the sun set on Nanga Parbat and stay overnight in a wooden hut." },
      { when: "Day 3", title: "Beyal Camp, then back down", t: "Walk 2 to 3 hours up to Beyal Camp for closer views of the mountain and its glacier, then return to Tato and Raikot Bridge. Add one more night if you want to go on to base camp." }
    ],
    banners: [
      { b: "🏔 Which peak are you looking at?", t: "The peak most visitors photograph from Fairy Meadows is actually Nanga Parbat's North Peak (7,816 m). The main summit (8,126 m) is behind it." },
      { b: "🪨 Rock carvings along the highway", t: "More than 50,000 rock carvings and inscriptions, many of them Buddhist, line the Karakoram Highway between Hunza and Shatial. The Chilas area has some of the best." }
    ],
    sections: [
      { id: "meadows", short: "Fairy Meadows", icon: "🏔", title: "Fairy Meadows and Nanga Parbat", sub: "The big reason people come to Diamer. Distances, times and costs differ between sources, so ask your jeep driver and guesthouse for current details.", cards: [
        { n: "Fairy Meadows", tag: "The meadow", img: "images/fairy-meadows.jpg", s: "A green alpine meadow at about 3,300 m with wooden huts, pine forest and a huge view of Nanga Parbat. Known for stargazing and silence.",
          facts: [ { k: "Best time", v: "June to September" }, { k: "Suggested stay", v: "1 to 2 nights" } ],
          see: ["Sunrise and sunset over Nanga Parbat", "Stargazing on clear nights"], near: "Beyal Camp", q: "Fairy Meadows Nanga Parbat" },
        { n: "The jeep track to Tato", tag: "Adventure", img: "images/jeep-track.jpg", s: "A narrow, rough, unpaved track cut into cliffs, from Raikot Bridge on the Karakoram Highway to Tato village. Famous as one of the world's most dramatic jeep rides.",
          facts: [ { k: "Time", v: "About 1.5 hours each way" }, { k: "Jeep cost", v: "Roughly PKR 16,000 to 20,000 round trip per jeep (5 to 6 people)" } ],
          m: "The track has no guardrails and is dusty and hot, so cover up. Use the local jeep association, write down your jeep's number plate, and confirm the current price before you go.", q: "Raikot Bridge Gilgit-Baltistan" },
        { n: "Beyal Camp", tag: "Quiet base", img: "images/beyal-camp.jpg", s: "A quieter camp above the meadow, at about 3,900 m, with closer views of Nanga Parbat and its glacier. A good base if you want peace.",
          facts: [ { k: "From the meadow", v: "2 to 3 hours" } ],
          see: ["Pine forests and river paths on the way", "The Nanga Parbat viewpoint just beyond the camp"], q: "Beyal Camp Fairy Meadows" },
        { n: "Nanga Parbat Base Camp", tag: "Trek", img: "images/nanga-parbat-base-camp.jpg", s: "The Raikot-face base camp, at about 4,200 m, reached on a long day walk from the meadow. Usually done over two days with a night at Beyal.",
          facts: [ { k: "Difficulty", v: "Moderate to hard" }, { k: "Season", v: "June to September" } ],
          m: "Go with a local guide. Sources differ on whether one is required for this route, so check the current rules.", q: "Nanga Parbat Base Camp Raikot" }
      ]},
      { id: "history", short: "Chilas and the KKH", icon: "🪨", title: "Chilas and the Karakoram Highway", sub: "The ancient and scenic side of Diamer, on the way to Fairy Meadows.", cards: [
        { n: "Thalpan Petroglyphs", tag: "Rock art", img: "images/thalpan-petroglyphs.jpg", s: "Buddhist rock carvings a few kilometres from Chilas, about 1,500 years old, showing Buddhas, stupas and animals. Made by monks and travellers on the Silk Road.",
          facts: [ { k: "Suggested time", v: "About 1 hour" } ],
          q: "Thalpan Petroglyphs Chilas" },
        { n: "Shatial Rock Carvings", tag: "Inscriptions", img: "images/shatial.jpg", s: "An important site of rock art and ancient inscriptions beside the Indus River, with carvings dating from roughly the 4th to the 8th century.",
          see: ["Buddhist carvings and old scripts"], q: "Shatial rock carvings" },
        { n: "Chilas town and fort", tag: "Town", s: "The headquarters of Diamer District, on the left bank of the Indus. It has a fort in the town centre and is the usual overnight stop on the Karakoram Highway.",
          m: "Chilas is a conservative town. Dress modestly.", q: "Chilas Fort" },
        { n: "Babusar Pass", tag: "Mountain pass", img: "images/babusar-pass.jpg", s: "A high pass at about 4,170 m linking Chilas with the Kaghan Valley, with big views and a zigzag road.",
          facts: [ { k: "Season", v: "Closed from about October, reopens in June" } ],
          m: "A scenic way to reach Chilas from Islamabad, if the pass is open.", q: "Babusar Pass" }
      ]},
      { id: "stay", short: "Stay and eat", icon: "🏕", title: "Where to stay and eat", sub: "Simple places with simple meals. This is not a food destination, but hot food after a long trek is very welcome.", cards: [
        { n: "Fairy Meadows guesthouses", tag: "Wooden huts", s: "Basic wooden huts and camping spots in the meadow, with the best views of Nanga Parbat. Meals are served at the guesthouses.",
          q: "Fairy Meadows guesthouse" },
        { n: "Beyal Camp", tag: "Quieter", s: "Basic huts and guesthouses at Beyal, slightly cheaper and closer to base camp than the main meadow.",
          q: "Beyal Camp" },
        { n: "Chilas hotels", tag: "On the highway", s: "Hotels and guesthouses in the town centre and along the Karakoram Highway. Panorama Hotel and Restaurant is one option on the highway.",
          spots: [ { n: "Panorama Hotel and Restaurant", a: "Karakoram Highway, Chilas", q: "Panorama Hotel Chilas" } ] }
      ]}
    ],
    tips: [
      { i: "🛡", t: "Parts of Diamer have had security incidents in the past, including an attack on climbers at Nanga Parbat in 2013. Check your government's latest travel advice and local conditions, and go with a registered operator if you can." },
      { i: "🚙", t: "The jeep track is narrow, rough and has no guardrails. It is more demanding than the walk. Use the local jeep association and confirm the price before you go." },
      { i: "⛰", t: "The meadow is at about 3,300 m and base camp at about 4,200 m. Go slowly, drink water and bring warm layers. Nights are cold." },
      { i: "📅", t: "Fairy Meadows is closed in winter because of snow. Late June to September is the safest window, and Babusar Pass is only open in summer." },
      { i: "🧭", t: "A local guide is recommended for Beyal and base camp. One source says a registered guide is required for the full base camp route, so ask before you go." },
      { i: "👗", t: "Diamer is a conservative area. Dress modestly, and ask before photographing people, especially women." }
    ],
    sources: [
      { title: "Fairy Meadows tour packages (TripMaker)", url: "https://tripmaker.pk/tours/fairy-meadows-tour-packages/" },
      { title: "Fairy Meadows and Nanga Parbat Base Camp guide (Pakistan Locals)", url: "https://pakistanlocals.com/blog/fairy-meadows-nanga-parbat-guide" },
      { title: "Fairy Meadows (Discovering Pakistan)", url: "https://discoveringpakistan.com/fairy-meadows/" },
      { title: "Fairy Meadows (Wikipedia)", url: "https://en.wikipedia.org/wiki/Fairy_Meadows" },
      { title: "Fairy Meadows trek and Nanga Parbat guide (Into the Wild Unknown)", url: "https://intothewildunknown.com/fairy-meadows-nanga-parbat-guide/" },
      { title: "Fairy Meadows travel guide 2026 (Northern Discover)", url: "https://northerndiscover.com/guides/fairy-meadows-travel-guide/" },
      { title: "Guide to visit Fairy Meadows and Beyal Camp (Being a Traveler)", url: "https://beingatraveler.com/guide-to-visit-fairy-meadows-trekking-to-beyal-camp-nanga-parbat-view-point/" },
      { title: "Fairy Meadows guide (Raahi Retreats)", url: "https://raahiretreats.com/blog/fairy-meadows-nanga-parbat-guide" },
      { title: "Fairy Meadows travel guide 2026 (Northistan)", url: "https://northistan.com/fairy-meadows-travel-guide-2026-how-to-get-there-where-to-stay-what-to-do/" },
      { title: "Chilas (Wikipedia)", url: "https://en.wikipedia.org/wiki/Chilas" },
      { title: "List of cultural heritage sites in Gilgit-Baltistan (Wikipedia)", url: "https://en.wikipedia.org/wiki/List_of_cultural_heritage_sites_in_Gilgit-Baltistan" },
      { title: "Chilas (PakPedia)", url: "https://www.pakpedia.pk/chilas/" },
      { title: "Chilas: what to visit (Wild Trips)", url: "https://www.wildtrips.net/places/Chilas-Pakistan-what-to-visit.htm" },
      { title: "Travel guide to Chilas (Gilgit-Baltistan Discoveries)", url: "https://gilgitbaltistandiscoveries.com/2024/08/11/best-places-to-visit-chilas/" }
    ]
  },  { id: "quetta", name: "Quetta and Ziarat", province: "Balochistan", status: "soon", img: "images/Hanna_Lake_Quetta.jpg", imgPos: "center", tagline: "Orchards and juniper forests." },
  { id: "makran", name: "Makran Coast", province: "Balochistan", status: "soon", img: "images/Kund_Malir_Beach_Pakistan.jpg", imgPos: "center", tagline: "A wild, empty coastline." },
  {
    id: "thatta", name: "Thatta and Makli", province: "Sindh", status: "draft",
    tagline: "Sindh's old capital: a vast UNESCO necropolis, a blue-tiled Mughal mosque and a lake for sunset, all within a day of Karachi.",
    img: "images/makli-heritage.jpg", imgPos: "center",
    heroVideo: "",   // <- paste a Thatta / Makli YouTube link here (and heroStart if you want to skip the start)
    facts: [
      { b: "🗓 Best time", t: "November to February is comfortable. From April to September it is very hot, often 40 to 45°C." },
      { b: "🚗 From Karachi", t: "About 100 km east of Karachi, roughly a 2-hour drive on the National Highway (N-5)." },
      { b: "⏱ How long", t: "One long day trip from Karachi covers the main sights. Add a night if you want to see Banbhore and Keenjhar at a slower pace." },
      { b: "🏛 Heritage", t: "Makli and the Shah Jahan Mosque are on the UNESCO World Heritage List as the Historical Monuments of Thatta." }
    ],
    plan: [
      { when: "Early morning", title: "Chaukhandi Tombs", t: "Leave Karachi by about 7 or 8 AM. Chaukhandi is only about 30 minutes out of the city, a good first stop on the way." },
      { when: "Late morning", title: "Makli Necropolis", t: "Allow 2 to 3 hours. The site is huge and gets very hot, so start early, especially outside winter." },
      { when: "Midday", title: "Shah Jahan Mosque and lunch", t: "The mosque is only about 3 km from Makli. Try to see it before the midday heat, then have a Sindhi biryani lunch in Thatta." },
      { when: "Afternoon", title: "Keenjhar Lake", t: "Go boating, stay for sunset, then head back to Karachi. Traffic can add to the 2-hour drive." }
    ],
    banners: [
      { b: "👑 A capital for centuries", t: "From the 14th century, several dynasties ruled Sindh from Thatta, until the capital moved away in 1739. The tombs at Makli were built over these centuries." },
      { b: "🌤 Pick your season", t: "This is a dry, open landscape with little shade. Winter is the time to come, and in summer only the early morning is bearable." }
    ],
    sections: [
      { id: "heritage", short: "Heritage", icon: "🏛", title: "Makli, the mosque and the road to Thatta", sub: "Sindh's most important Islamic heritage, in order from Karachi. Entry fees are usually small and vary by site. Hours can change, so check before you go.", cards: [
        { n: "Makli Necropolis", tag: "UNESCO", img: "images/makli-heritage.jpg", s: "One of the largest burial grounds in the world, spread across Makli Hill and holding the tombs of kings, saints and nobles from the 14th to the 18th centuries.",
          facts: [ { k: "Status", v: "UNESCO World Heritage Site (1981)" }, { k: "Suggested time", v: "2 to 3 hours" }, { k: "Best time", v: "Early morning or late afternoon" } ],
          see: ["The tomb of Jam Nizamuddin II, known for its symmetry", "The tomb of Isa Khan Tarkhan II, with its blue tiles", "Carved sandstone and glazed tilework"],
          m: "The site is very large. Wear comfortable shoes, carry water and sun protection, and consider an authorised guide. Some tombs are weathered, so take care around crumbling stone.", near: "Shah Jahan Mosque (about 3 km)", q: "Makli Necropolis Thatta" },
        { n: "Shah Jahan Mosque", tag: "Mughal", img: "images/shahjahan.jpg", s: "A 17th-century mosque built under Emperor Shah Jahan, known for its blue tilework, its many domes (UNESCO mentions 93) and remarkable acoustics.",
          facts: [ { k: "Best time", v: "Before the midday heat" }, { k: "Suggested time", v: "About 1 hour" }, { k: "From Makli", v: "About 3 km" } ],
          see: ["Tile patterns in many shades of blue", "The central courtyard"],
          m: "It is a working mosque. Dress modestly and respect prayer times.", q: "Shah Jahan Mosque Thatta" },
        { n: "Chaukhandi Tombs", tag: "On the way", img: "images/chaukhandi-tombs.jpg", s: "A cemetery of tall, tiered sandstone tombs covered in detailed carving, dating from roughly the 15th to the 18th century.",
          facts: [ { k: "From Karachi", v: "About 30 minutes" }, { k: "Suggested time", v: "About 1 hour" } ],
          see: ["The carved sandstone tombs"], m: "It is on the highway out of Karachi, so it makes an easy first stop.", q: "Chaukhandi Tombs" },
        { n: "Banbhore", tag: "Ancient city", img: "images/banbhore.jpg", s: "The ruins of an ancient city with a small museum, on the route between Karachi and Thatta.",
          facts: [ { k: "Suggested time", v: "About 1 hour" } ],
          m: "Check the museum's opening hours before you go.", q: "Banbhore Museum" }
      ]},
      { id: "lakes", short: "Lakes", icon: "🌅", title: "Lakes and sunsets", sub: "A calm end to a hot day of sightseeing.", cards: [
        { n: "Keenjhar Lake", tag: "Sunset", img: "images/keenjhar.jpeg", s: "A large freshwater lake near Thatta, popular for boating, picnics and sunsets. In winter, migratory birds visit.",
          facts: [ { k: "From Thatta", v: "About 18 to 22 km" }, { k: "Best time", v: "Late afternoon, stay for sunset" }, { k: "Suggested time", v: "1 to 2 hours" } ],
          see: ["Boating on the lake", "A simple lakeside lunch"], q: "Keenjhar Lake Thatta" },
        { n: "Haleji Lake", tag: "Birdwatching", img: "images/haleji-lake.jpg", s: "A lake known for winter migratory birds, a quiet stop on the way back to Karachi.",
          facts: [ { k: "Best time", v: "Winter" } ],
          q: "Haleji Lake" }
      ]},
      { id: "food", short: "Food", icon: "🍛", title: "Food", sub: "Thatta has simple local eateries rather than famous restaurants. Ask around, and expect good, basic Sindhi food.", cards: [
        { n: "Sindhi biryani", tag: "Lunch", img: "images/sindhibiryani.jpg", s: "Sindh's own style of biryani, a popular lunch in Thatta and at Keenjhar Lake." },
        { n: "Fresh lake fish", tag: "Keenjhar", img: "images/fish.jpg", s: "Freshly caught fish from Keenjhar Lake, usually fried or grilled." },
        { n: "Khajoor halwa and ladoo", tag: "Sweets", s: "Sweet treats such as ladoo and khajoor halwa (date halwa), good to take home." },
        { n: "Street snacks", tag: "Quick bites", s: "Spicy chaat, samosas and pakoras from local vendors." }
      ]}
    ],
    tips: [
      { i: "☀️", t: "Heat is the biggest problem. November to February is best. From April to September it can reach 40 to 45°C, so see Makli only in the early morning." },
      { i: "🥾", t: "Makli covers a very large area. Wear comfortable shoes, carry water, a hat and sun protection, and consider an authorised guide." },
      { i: "🕌", t: "Shah Jahan Mosque is a working mosque. Dress modestly and respect prayer times." },
      { i: "🚗", t: "Traffic on the National Highway can be heavy. Start early, and allow extra time for the drive back to Karachi." },
      { i: "🦆", t: "In winter, Keenjhar and Haleji lakes are good for migratory birds." },
      { i: "🛂", t: "Check your government's latest travel advice and the current conditions on the highways of interior Sindh before you travel." }
    ],
    sources: [
      { title: "Day tour to Bhambore, Makli, Thatta and Keenjhar Lake (Sindh Tourism)", url: "https://stdc.gos.pk/wp-content/uploads/2024/10/School_trip_to_Keenjar_lake.pdf" },
      { title: "Thatta District (Wikipedia)", url: "https://en.wikipedia.org/wiki/Thatta_District" },
      { title: "Thatta travel guide (Guide to Pakistan)", url: "https://guidetopakistan.pk/destinations/sindh/thatta/" },
      { title: "Makli (Traverse Pakistan)", url: "https://traversepakistan.com/destinations/makli" },
      { title: "Makli Necropolis (Green Tourism Pakistan)", url: "https://greenpaktourism.com/places/makli-thatta" },
      { title: "Discovering Thatta (Travel Pakistani)", url: "https://www.travelpakistani.com/blogs/discovering-thatta-the-ancient-city-of-pakistan/139" },
      { title: "Makli Necropolis Thatta guide (Real Pakistan)", url: "https://realpakistan.com.pk/makli-necropolis-thatta/" },
      { title: "Chaukhandi, Bhambore, Makli and Thatta tour (Shirazi Travels)", url: "https://shirazitravels.com/chaukhandi-bhambore-makli-thatta-tour/" },
      { title: "Thatta UNESCO sites tour from Karachi (tourHQ)", url: "https://www.tourhq.com/tours/23221/8-hour-thatta-unesco-sites-tour-from-karachi" },
      { title: "Sindh (Wikivoyage)", url: "https://en.wikivoyage.org/wiki/Sindh" },
      { title: "Best places to visit in Sindh (Anna Sherchand)", url: "https://annasherchand.com/best-places-to-visit-in-sindh-pakistan/" }
    ]
  },  { id: "larkana", name: "Larkana", province: "Sindh", status: "soon", img: "images/mohenjo.jpg", imgPos: "center", tagline: "Home of Mohenjo-daro." },
  { id: "dadu", name: "Dadu and Kirthar", province: "Sindh", status: "soon", img: "images/sindh.jpg", imgPos: "center", tagline: "Mountains and desert in Sindh." },
  { id: "bahawalpur", name: "Bahawalpur", province: "Punjab", status: "soon", img: "images/punjab.jpg", imgPos: "center", tagline: "Palaces and desert forts." },
  { id: "jhelum", name: "Jhelum and Khewra", province: "Punjab", status: "soon", img: "images/punjab.jpg", imgPos: "center", tagline: "Home of the Khewra Salt Mine." }
];