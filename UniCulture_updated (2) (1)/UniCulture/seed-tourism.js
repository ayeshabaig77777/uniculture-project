import { db } from "./firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// This is a ONE-TIME uploader. After you click "Seed Tourism" once, all of
// this content lives in Firestore (Tourism collection) and can be edited
// there directly, exactly like your heritage/food/festival documents.
// tourism.js and tourism_detail.js read ONLY from Firestore — they do not
// use this file after the initial seed.

const TOURISM = {

  // ===================== PUNJAB =====================

  "badshahi-mosque": {
    name: "Badshahi Mosque",
    region: "punjab",
    province: "Punjab",
    type: "historical",
    city: "Lahore",
    image: "images/badshahi.jpg",
    description: "One of the largest mosques in the world, built by Emperor Aurangzeb in 1673 and a masterpiece of Mughal architecture.",
    history: "Commissioned by the Mughal emperor Aurangzeb and completed in 1673, the mosque was built directly across from the Lahore Fort as a statement of imperial and religious grandeur, and it remained the largest mosque in the world for over three centuries.",
    best_time_to_visit: "October to March, when the weather in Lahore is cool and comfortable.",
    how_to_reach: "Located in the Walled City of Lahore, easily reached by road or ride-hailing service; the nearest metro stop is Bin Badar (Orange Line).",
    tips: "Visit at sunset for beautiful lighting on the red sandstone, and pair the trip with the neighboring Lahore Fort.",
    funfact: "The mosque's courtyard can hold over 55,000 worshippers at once.",
    activities: ["Explore the vast marble courtyard", "Visit Hazoori Bagh in between the mosque and fort", "Photograph the minarets at sunset"],
    nearby: ["lahore-fort", "minar-e-pakistan", "shalimar-gardens"]
  },

  "lahore-fort": {
    name: "Lahore Fort",
    region: "punjab",
    province: "Punjab",
    type: "historical",
    city: "Lahore",
    image: "images/lahorefort.webp",
    description: "A UNESCO World Heritage Site featuring palaces, mosques, and Mughal era architecture.",
    history: "Though a fort has stood on this site for centuries, most of the surviving structure was built and expanded under Mughal emperors Akbar, Jahangir, and Shah Jahan, blending defensive walls with delicate palaces and gardens.",
    best_time_to_visit: "Cooler months, October through March, for comfortable walking through the open courtyards.",
    how_to_reach: "Situated at the edge of Lahore's Walled City, next to Badshahi Mosque; accessible by road or the Orange Line metro.",
    tips: "Hire a guide at the entrance to get the most out of the Sheesh Mahal and Alamgiri Gate.",
    funfact: "It was declared a UNESCO World Heritage Site in 1981, alongside Shalimar Gardens.",
    activities: ["Walk through the Sheesh Mahal (Mirror Palace)", "See the Alamgiri Gate and Elephant Path", "Explore the Diwan-e-Aam and Diwan-e-Khas halls"],
    nearby: ["badshahi-mosque", "minar-e-pakistan", "shalimar-gardens"]
  },

  "minar-e-pakistan": {
    name: "Minar-e-Pakistan",
    region: "punjab",
    province: "Punjab",
    type: "historical",
    city: "Lahore",
    image: "images/minar.jpg",
    description: "A national monument marking the historic Lahore Resolution of 1940.",
    history: "The tower was built on the site where the All-India Muslim League passed the Lahore Resolution in March 1940, a key milestone in the movement for an independent Pakistan; construction of the monument was completed in 1968.",
    best_time_to_visit: "Evenings year-round, when the surrounding Greater Iqbal Park is lively and lit up.",
    how_to_reach: "Located in Greater Iqbal Park near the Walled City, reachable by road or the Orange Line metro's Iqbal Park station.",
    tips: "Combine your visit with a stroll through Greater Iqbal Park and the nearby food street.",
    funfact: "The monument's design blends Mughal, Islamic, and modern architectural elements in a single structure.",
    activities: ["Walk around Greater Iqbal Park", "Read the inscriptions detailing the Lahore Resolution", "Enjoy the food street nearby in the evening"],
    nearby: ["badshahi-mosque", "lahore-fort", "shalimar-gardens"]
  },

  "shalimar-gardens": {
    name: "Shalimar Gardens",
    region: "punjab",
    province: "Punjab",
    type: "historical",
    city: "Lahore",
    image: "images/shalimar.jpg",
    description: "Beautiful Mughal gardens built by Shah Jahan with flowing fountains and terraces.",
    history: "Laid out in 1641 on the orders of Emperor Shah Jahan, the gardens were designed as a terraced paradise garden with hundreds of fountains fed by a canal built specifically to supply them.",
    best_time_to_visit: "Spring (March–April) when the gardens are in full bloom.",
    how_to_reach: "Located on Grand Trunk Road in Lahore, easily reached by road or ride-hailing service.",
    tips: "Visit in the morning for a quieter, cooler walk through the three descending terraces.",
    funfact: "The gardens are laid out on three terraces that each sit at a different elevation, an engineering feat for their time.",
    activities: ["Walk through all three descending terraces", "See the fountains run during opening hours", "Visit in spring for blooming flowers"],
    nearby: ["badshahi-mosque", "lahore-fort", "minar-e-pakistan"]
  },

  "khewra-salt-mine": {
    name: "Khewra Salt Mine",
    region: "punjab",
    province: "Punjab",
    type: "natural",
    city: "Khewra, Jhelum",
    image: "images/kehwara.jpg",
    description: "The second largest salt mine in the world, famous for pink Himalayan salt formations.",
    history: "According to local legend the deposit was first noticed by Alexander the Great's troops, but organized mining began under Mughal rule and was later industrialized during British colonial administration in the 19th century.",
    best_time_to_visit: "October to March, since the mine interior stays cool year-round but travel to the site is easier in cooler months.",
    how_to_reach: "Located near Pind Dadan Khan in Jhelum district, about a 3-hour drive from Lahore or Islamabad.",
    tips: "A small train takes visitors partway into the mine — book tickets at the entrance and wear comfortable shoes.",
    funfact: "The mine contains an illuminated mosque built entirely from salt bricks.",
    activities: ["Ride the mini-train into the mine", "Visit the illuminated salt mosque", "Browse salt-lamp and crystal souvenir shops"],
    nearby: []
  },

  "noor-mahal": {
    name: "Noor Mahal",
    region: "punjab",
    province: "Punjab",
    type: "historical",
    city: "Bahawalpur",
    image: "images/noormahal.jpg",
    description: "A royal palace in Bahawalpur built in 1872, inspired by Italian architecture.",
    history: "Built in 1872 for the Nawab of Bahawalpur as a residence for his mother, the palace blends Italian, Corinthian, and local architectural styles and later served as a garrison headquarters before opening to the public.",
    best_time_to_visit: "November to February, when Bahawalpur's desert climate is mildest.",
    how_to_reach: "Located in Bahawalpur city, reachable by road from Multan or by domestic flight to Bahawalpur Airport.",
    tips: "Visit in the late afternoon when the palace's facade catches the golden light beautifully.",
    funfact: "Legend says the Nawab's mother refused to live there after learning it was built facing a graveyard.",
    activities: ["Tour the palace's Italian-style interiors", "Photograph the façade from the front lawns", "Visit nearby Bahawalpur Zoo and Lal Suhanra park"],
    nearby: []
  },

  // ===================== SINDH =====================

  "mohenjo-daro": {
    name: "Mohenjo-Daro",
    region: "sindh",
    province: "Sindh",
    type: "archaeological",
    city: "Larkana",
    image: "images/mohenjo.jpg",
    description: "An ancient Indus Valley Civilization city dating back more than 4000 years.",
    history: "Built around 2500 BCE, Mohenjo-daro was one of the largest settlements of the Indus Valley Civilization, featuring advanced urban planning with a grid street layout, granaries, and one of the world's earliest known drainage systems.",
    best_time_to_visit: "November to February to avoid Sindh's intense summer heat.",
    how_to_reach: "Located near Larkana, reachable by road from Sukkur or Karachi, or by domestic flight to Moenjodaro Airport.",
    tips: "Visit the on-site museum first to understand the layout before walking the ruins.",
    funfact: "The name 'Mohenjo-daro' translates to 'Mound of the Dead' in Sindhi.",
    activities: ["Walk the Great Bath and citadel mound", "Visit the on-site archaeological museum", "See original Indus Valley artifacts and seals"],
    nearby: []
  },

  "shah-jahan-mosque": {
    name: "Shah Jahan Mosque",
    region: "sindh",
    province: "Sindh",
    type: "historical",
    city: "Thatta",
    image: "images/shahjahan.jpg",
    description: "A 17th century mosque in Thatta famous for its detailed blue tile work.",
    history: "Gifted to the people of Thatta by Mughal emperor Shah Jahan in 1647 as a token of gratitude for hosting him during exile, the mosque is renowned for its acoustics and its extensive Persian-influenced tile work.",
    best_time_to_visit: "November to February, avoiding Sindh's hot summer months.",
    how_to_reach: "Located in Thatta, about a 1.5 hour drive from Karachi.",
    tips: "Stand in the main prayer hall and speak softly — the design carries sound remarkably far.",
    funfact: "The mosque has over 100 domes designed to distribute sound evenly throughout the prayer hall.",
    activities: ["Admire the blue and turquoise tile work", "Test the mosque's famous acoustics", "Visit nearby Makli Necropolis"],
    nearby: ["keenjhar-lake"]
  },

  "keenjhar-lake": {
    name: "Keenjhar Lake",
    region: "sindh",
    province: "Sindh",
    type: "natural",
    city: "Thatta",
    image: "images/keenjhar.jpeg",
    description: "One of Pakistan's largest freshwater lakes and a peaceful tourist destination.",
    history: "Formed naturally and later expanded with embankments, the lake has long served as a key freshwater source for Karachi and Thatta while also becoming a popular weekend getaway and migratory bird habitat.",
    best_time_to_visit: "November to March, when migratory birds also visit the lake.",
    how_to_reach: "About an hour's drive from Thatta and roughly 2.5 hours from Karachi via the M-9 motorway.",
    tips: "Boat rides are available at the lakeside — bring binoculars if you're interested in birdwatching.",
    funfact: "The lake is an important wintering site for thousands of migratory birds from Central Asia.",
    activities: ["Take a boat ride on the lake", "Go birdwatching in the winter months", "Enjoy lakeside food stalls"],
    nearby: ["shah-jahan-mosque"]
  },

  "gorakh-hill": {
    name: "Gorakh Hill",
    region: "sindh",
    province: "Sindh",
    type: "natural",
    city: "Dadu",
    image: "images/gorakh.jpg",
    description: "A cool hill station in Sindh offering stunning mountain views.",
    history: "Part of the Kirthar mountain range, Gorakh Hill has traditionally served as a summer retreat for people from the plains of Sindh due to its unusually cool climate for the region.",
    best_time_to_visit: "May to August — unlike most of Sindh, this is peak season here due to the cooler hill climate.",
    how_to_reach: "Reached via a mountain road from Dadu, about a 3-4 hour drive; a 4x4 vehicle is recommended for the final stretch.",
    tips: "Temperatures drop sharply at night even in summer, so pack warm clothing.",
    funfact: "Gorakh Hill has recorded temperatures near freezing in winter, a rarity for Sindh.",
    activities: ["Enjoy panoramic views of the Kirthar range", "Camp overnight under clear skies", "Escape summer heat at higher elevation"],
    nearby: []
  },

  "ranikot-fort": {
    name: "Ranikot Fort",
    region: "sindh",
    province: "Sindh",
    type: "historical",
    city: "Jamshoro",
    image: "images/ranikotfort.jpg",
    description: "Known as the Great Wall of Sindh, one of the largest forts in the world.",
    history: "The exact origins of Ranikot Fort are debated among historians, with estimates ranging from the Sassanid era to a 19th-century rebuild by the Talpur rulers of Sindh, but its massive stone walls have long guarded this stretch of the Kirthar range.",
    best_time_to_visit: "November to February, avoiding the extreme summer heat of the region.",
    how_to_reach: "Located about 90 km from Hyderabad, reachable by road with a 4x4 recommended for the inner fort areas.",
    tips: "The fort's perimeter is vast, so plan a full day and carry plenty of water.",
    funfact: "The fort's outer wall stretches roughly 26 kilometers, giving it its 'Great Wall of Sindh' nickname.",
    activities: ["Explore the massive stone perimeter walls", "Visit the Sann Gate entrance", "Hike sections of the historic ramparts"],
    nearby: []
  },

  "clifton-beach": {
    name: "Clifton Beach",
    region: "sindh",
    province: "Sindh",
    type: "natural",
    city: "Karachi",
    image: "images/clifton.jpg",
    description: "A famous Karachi beach known for sunset views and camel rides.",
    history: "One of Karachi's oldest recreational spots, Clifton Beach has been a public gathering place since the early 20th century and remains one of the city's most visited stretches of coastline.",
    best_time_to_visit: "Evenings year-round, especially in the cooler months from November to February.",
    how_to_reach: "Located in Karachi's Clifton area, easily reachable by road or ride-hailing service.",
    tips: "Go around sunset for the best atmosphere, and keep valuables close as the beach gets crowded.",
    funfact: "The beach is home to Pakistan's tallest flagpole, standing near the promenade.",
    activities: ["Take a camel or horse ride along the shore", "Watch the sunset over the Arabian Sea", "Visit the nearby promenade and food stalls"],
    nearby: []
  },

  // ===================== KHYBER PAKHTUNKHWA =====================

  "swat-valley": {
    name: "Swat Valley",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Swat",
    image: "images/swat.jpg",
    description: "Often called the Switzerland of Pakistan due to its scenic beauty.",
    history: "Once the seat of the ancient Buddhist kingdom of Uddiyana and later a princely state until 1969, Swat Valley carries archaeological remains spanning Buddhist, Hindu Shahi, and Islamic periods alongside its natural beauty.",
    best_time_to_visit: "April to September for greenery and mild weather; December to February for snow.",
    how_to_reach: "Reachable by road from Islamabad in about 4-5 hours via the Swat Motorway (M-16).",
    tips: "Use Mingora or Saidu Sharif as a base to explore the valley's smaller towns and viewpoints.",
    funfact: "Swat is home to Buddhist archaeological sites dating back over 2,000 years, including ruins near Butkara.",
    activities: ["Visit the White Palace in Marghazar", "Explore Buddhist ruins near Butkara", "Drive up to Malam Jabba for valley views"],
    nearby: ["kalam-valley", "malam-jabba"]
  },

  "kalam-valley": {
    name: "Kalam Valley",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Swat",
    image: "images/kalam.jpg",
    description: "A beautiful valley surrounded by forests and rivers.",
    history: "Historically a remote settlement within the Swat princely state, Kalam grew into a popular tourist base after the region opened up to visitors in the mid-20th century, serving as the gateway to Mahodand and Ushu forests.",
    best_time_to_visit: "May to September for pleasant weather and open mountain roads.",
    how_to_reach: "About a 2-3 hour drive north from Mingora along the Swat River.",
    tips: "Use Kalam as a base for day trips to Mahodand Lake and Ushu Forest.",
    funfact: "Kalam sits at the confluence of the Swat and Ushu rivers, giving it dramatic river views from almost anywhere in town.",
    activities: ["Walk along the Swat River banks", "Take a jeep to Ushu Forest", "Shop for local handicrafts in the bazaar"],
    nearby: ["swat-valley", "mahodand-lake"]
  },

  "mahodand-lake": {
    name: "Mahodand Lake",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Swat",
    image: "images/mahodand.jpg",
    description: "A crystal clear alpine lake surrounded by glaciers and mountains.",
    history: "Fed by glacial meltwater from the surrounding peaks, Mahodand ('Lake of Fish') has long been used by local Gujjar herders for grazing in summer before becoming a major tourist destination in recent decades.",
    best_time_to_visit: "June to September, when the mountain road is clear of snow.",
    how_to_reach: "Located about 3-4 hours by jeep from Kalam along an unpaved mountain track; 4x4 vehicles are required.",
    tips: "Hire a jeep in Kalam rather than attempting the rocky road in a regular car.",
    funfact: "The lake's name means 'Lake of Fish' in the local language, referring to the trout found in its waters.",
    activities: ["Rent a boat to cross the lake", "Try freshly grilled trout fish", "Camp beside the lake overnight"],
    nearby: ["kalam-valley"]
  },

  "saiful-malook-lake": {
    name: "Saif-ul-Malook Lake",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Naran",
    image: "images/saifulmalook.jpg",
    description: "A magical lake near Naran famous for its fairy tales and beauty.",
    history: "The lake takes its name from a Punjabi folk tale about Prince Saiful Malook and a fairy princess, and it has drawn travelers for generations for the dramatic reflection of Malika Parbat peak on its surface.",
    best_time_to_visit: "June to September, when the road from Naran is open and snow-free.",
    how_to_reach: "About a 2-hour jeep ride from Naran; the unpaved track requires a 4x4 or hired jeep.",
    tips: "Arrive early morning for the calmest water and clearest mountain reflection.",
    funfact: "Local legend says fairies still visit the lake by moonlight, giving it its enduring folklore status.",
    activities: ["Take a jeep ride from Naran", "Boat across the lake at sunrise", "Hike partway around the shoreline"],
    nearby: ["shogran"]
  },

  "malam-jabba": {
    name: "Malam Jabba",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Swat",
    image: "images/malamjabba.jpg",
    description: "A popular ski resort known for winter sports and mountain adventures.",
    history: "Developed as Pakistan's premier ski resort starting in the 1990s, Malam Jabba was rebuilt and expanded in the 2010s after being damaged, and now includes a chairlift and modern ski facilities.",
    best_time_to_visit: "December to February for skiing; June to September for hiking and mild weather.",
    how_to_reach: "About a 1.5-2 hour drive from Mingora, Swat.",
    tips: "Ski and snowboard equipment can be rented on-site in winter, so no need to bring your own gear.",
    funfact: "Malam Jabba is home to Pakistan's first chairlift-equipped ski resort.",
    activities: ["Ski or snowboard in winter", "Ride the chairlift for valley views", "Hike nearby trails in summer"],
    nearby: ["swat-valley"]
  },

  "shogran": {
    name: "Shogran",
    region: "kpk",
    province: "Khyber Pakhtunkhwa",
    type: "natural",
    city: "Kaghan Valley",
    image: "images/Shogran.jpg",
    description: "A peaceful hill station in Kaghan Valley surrounded by pine forests.",
    history: "A traditional summer grazing meadow for local herders, Shogran developed into a hill station retreat in the 20th century thanks to its pine forests and views of Makra Peak, and now serves as a gateway to Siri Paye meadows.",
    best_time_to_visit: "May to September for pleasant summer weather.",
    how_to_reach: "Reached via a winding road from Kaghan Valley, about a 30-40 minute drive from Balakot.",
    tips: "From Shogran, a jeep or a hike leads up to the Siri Paye meadows for panoramic views.",
    funfact: "Shogran sits at an elevation of around 2,362 meters, keeping it cool even in peak summer.",
    activities: ["Trek or jeep up to Siri Paye meadows", "Enjoy pine forest walks", "Photograph views of Makra Peak"],
    nearby: ["saiful-malook-lake"]
  },

  // ===================== GILGIT-BALTISTAN =====================

  "hunza-valley": {
    name: "Hunza Valley",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Hunza",
    image: "images/hunza.jpg",
    description: "A spectacular valley surrounded by Karakoram mountains and forts.",
    history: "Once an independent princely state until 1974, Hunza has a distinct culture and history shaped by its position along the ancient Silk Road, with the centuries-old Baltit and Altit Forts still standing above the valley.",
    best_time_to_visit: "April for apricot and cherry blossoms, or October for autumn foliage.",
    how_to_reach: "Reached via the Karakoram Highway, about 8-10 hours by road from Gilgit or a shorter flight to Gilgit followed by a drive.",
    tips: "Visit Baltit Fort and Eagle's Nest viewpoint for the best panoramic views of the valley.",
    funfact: "Hunza is famously associated with longevity, with locals often attributing it to their traditional diet and mountain lifestyle.",
    activities: ["Explore Baltit and Altit Forts", "Watch sunset from Eagle's Nest viewpoint", "Try local apricot products"],
    nearby: ["attabad-lake", "khunjerab-pass"]
  },

  "fairy-meadows": {
    name: "Fairy Meadows",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Diamer",
    image: "images/FairyMeadows.webp",
    description: "A green alpine meadow offering breathtaking views of Nanga Parbat.",
    history: "Long used by local herders as a summer pasture, the meadow earned its English name from early European travelers and mountaineers who came to view Nanga Parbat, the world's ninth highest peak, up close.",
    best_time_to_visit: "June to September, when the trail is accessible and the meadow is green.",
    how_to_reach: "Requires a jeep ride from Raikot Bridge on the Karakoram Highway followed by a 2-3 hour trek or pony ride.",
    tips: "Camp overnight if possible — sunrise over Nanga Parbat from the meadow is a highlight for most visitors.",
    funfact: "Fairy Meadows sits at the base of Nanga Parbat, nicknamed 'Killer Mountain' for its steep, technical climbing routes.",
    activities: ["Trek to Nanga Parbat base camp views", "Camp overnight under the stars", "Photograph sunrise over Nanga Parbat"],
    nearby: []
  },

  "attabad-lake": {
    name: "Attabad Lake",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Hunza",
    image: "images/Attabad.jpg",
    description: "A turquoise lake formed after a landslide in Hunza Valley.",
    history: "The lake was formed in January 2010 when a massive landslide near Attabad village dammed the Hunza River, submerging part of the Karakoram Highway and creating a new lake almost overnight.",
    best_time_to_visit: "May to October for boating and clear turquoise water.",
    how_to_reach: "Located directly along the Karakoram Highway, easily reached by road from Hunza or Gilgit.",
    tips: "Boat rides across the lake are available, and jet-skiing has become popular in recent years.",
    funfact: "The landslide that created the lake also submerged an entire section of the original Karakoram Highway, which was later rerouted through tunnels.",
    activities: ["Take a boat ride across the lake", "Try jet-skiing on the turquoise water", "Photograph the lakeside cafés"],
    nearby: ["hunza-valley", "khunjerab-pass"]
  },

  "skardu": {
    name: "Skardu",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Skardu",
    image: "images/skardu.jpg",
    description: "The gateway to the world's highest mountains including K2.",
    history: "Historically the capital of the Baltistan region and once a key Silk Road trading post, Skardu is dotted with old forts such as Kharpocho Fort and has become the main staging point for expeditions into the Karakoram range.",
    best_time_to_visit: "May to October, when mountain routes and lakes are accessible.",
    how_to_reach: "Reachable by domestic flight from Islamabad, or by road via the Karakoram Highway (a full-day journey).",
    tips: "Use Skardu as a base to visit nearby Shangrila Resort, Upper Kachura Lake, and Deosai Plains.",
    funfact: "Skardu serves as the base camp launch point for expeditions to K2, the world's second-highest mountain.",
    activities: ["Visit Kharpocho Fort", "Explore Upper Kachura Lake", "Use as a base for K2 base camp treks"],
    nearby: ["deosai-plains"]
  },

  "khunjerab-pass": {
    name: "Khunjerab Pass",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Hunza",
    image: "images/KhunjerabPass.jpg",
    description: "The highest paved international border crossing between Pakistan and China.",
    history: "Once a treacherous route used by ancient traders along the Silk Road, the pass was developed into a modern paved crossing with the completion of the Karakoram Highway, a joint Pakistan-China engineering project finished in 1979.",
    best_time_to_visit: "May to October — the pass is closed by snow in winter months.",
    how_to_reach: "About a 2.5 hour drive north from Sost along the Karakoram Highway; a valid ID/passport is required as it is a border zone.",
    tips: "Altitude here exceeds 4,700 meters, so dress warmly even in summer and take it easy if you feel short of breath.",
    funfact: "At 4,693 meters, Khunjerab Pass is the highest paved international border crossing in the world.",
    activities: ["Spot Himalayan wildlife like ibex and marmots", "Photograph the Pakistan-China border marker", "Visit Khunjerab National Park"],
    nearby: ["hunza-valley", "attabad-lake"]
  },

  "deosai-plains": {
    name: "Deosai Plains",
    region: "gilgit",
    province: "Gilgit-Baltistan",
    type: "natural",
    city: "Skardu",
    image: "images/DeosaiPlains.jpg",
    description: "Known as the Land of Giants, famous for wildlife and open landscapes.",
    history: "Long used seasonally by local shepherds, Deosai was designated a national park in 1993 to protect the Himalayan brown bear population and the plateau's unique high-altitude ecosystem.",
    best_time_to_visit: "July to September, the only months the plateau is snow-free and accessible.",
    how_to_reach: "About a 2-3 hour drive from Skardu; the route is only open in summer.",
    tips: "Nights get very cold even in summer, so carry warm layers even for a day trip.",
    funfact: "At an average elevation of over 4,000 meters, Deosai is one of the highest plateaus in the world and hosts the endangered Himalayan brown bear.",
    activities: ["Spot the Himalayan brown bear from a safe distance", "Camp on the open plateau", "Photograph Sheosar Lake"],
    nearby: ["skardu"]
  },

  // ===================== BALOCHISTAN =====================

  "hingol-national-park": {
    name: "Hingol National Park",
    region: "balochistan",
    province: "Balochistan",
    type: "natural",
    city: "Lasbela",
    image: "images/hingolNationalPark.jpg",
    description: "The largest national park of Pakistan known for unique landscapes.",
    history: "Established in 1988 along the Makran Coastal Highway, Hingol National Park protects a vast stretch of desert, mangroves, and mud volcanoes, and includes the Hinglaj Mata temple, an important Hindu pilgrimage site.",
    best_time_to_visit: "November to February, avoiding the intense summer heat.",
    how_to_reach: "Located along the Makran Coastal Highway, about a 3-4 hour drive from Karachi.",
    tips: "Don't miss the Princess of Hope rock formation and the park's active mud volcanoes.",
    funfact: "The park is home to Pakistan's largest concentration of mud volcanoes, some of which are still active.",
    activities: ["Visit the Princess of Hope rock formation", "See active mud volcanoes", "Visit Hinglaj Mata temple"],
    nearby: ["kund-malir-beach"]
  },

  "astola-island": {
    name: "Astola Island",
    region: "balochistan",
    province: "Balochistan",
    type: "natural",
    city: "Pasni",
    image: "images/astola-island.jpeg",
    description: "Also called the Island of Seven Hills, famous for marine biodiversity.",
    history: "Pakistan's largest offshore island, Astola has long been known to local fishermen and was declared a wildlife sanctuary in 2017 due to its importance as a nesting site for endangered green turtles.",
    best_time_to_visit: "October to March, when the sea is calmer for the boat crossing.",
    how_to_reach: "Reached by boat from Pasni, a journey of about 2-3 hours depending on sea conditions.",
    tips: "Camping overnight is popular, but arrange permits and supplies in advance as the island has no facilities.",
    funfact: "Astola Island is one of the most important nesting grounds for endangered green sea turtles in the region.",
    activities: ["Snorkel around the reef", "Watch for nesting green turtles", "Camp overnight on the island"],
    nearby: []
  },

  "kund-malir-beach": {
    name: "Kund Malir Beach",
    region: "balochistan",
    province: "Balochistan",
    type: "natural",
    city: "Makran Coastal Highway",
    image: "images/Kund_Malir_Beach_Pakistan.jpg",
    description: "A scenic beach on the Makran Coastal Highway.",
    history: "The beach became widely accessible after the completion of the Makran Coastal Highway in the early 2000s, which opened up this remote stretch of Balochistan's coastline to travelers from Karachi.",
    best_time_to_visit: "November to February, avoiding the summer heat and monsoon swells.",
    how_to_reach: "About a 2.5-3 hour drive from Karachi along the Makran Coastal Highway.",
    tips: "Combine the visit with nearby Hingol National Park, since both sit along the same highway.",
    funfact: "The beach sits near dramatic desert cliffs, creating a striking contrast between sand dunes and the Arabian Sea.",
    activities: ["Walk along the golden sand dunes", "Photograph the coastal cliffs", "Combine with a Hingol National Park visit"],
    nearby: ["hingol-national-park"]
  },

  "ziarat-residency": {
    name: "Ziarat Residency",
    region: "balochistan",
    province: "Balochistan",
    type: "historical",
    city: "Ziarat",
    image: "images/Quaid_e_Azam_Residency_Ziarat.jpg",
    description: "The historic residence where Quaid-e-Azam spent his final days.",
    history: "Originally built in 1892 as a colonial-era sanatorium, the wooden residency became the last home of Muhammad Ali Jinnah, founder of Pakistan, who stayed there in 1948 in his final weeks before his death.",
    best_time_to_visit: "April to October, avoiding the cold winter snowfall in Ziarat.",
    how_to_reach: "Located in Ziarat town, about a 2.5-3 hour drive from Quetta.",
    tips: "The residency is now a museum with Jinnah's personal belongings on display; check opening hours before visiting.",
    funfact: "The original residency building was set on fire during unrest in 2013 and has since been restored.",
    activities: ["Tour Jinnah's preserved living quarters", "Walk through the surrounding juniper forest", "Visit the nearby Ziarat Museum"],
    nearby: ["hanna-lake"]
  },

  "hanna-lake": {
    name: "Hanna Lake",
    region: "balochistan",
    province: "Balochistan",
    type: "natural",
    city: "Quetta",
    image: "images/Hanna_Lake_Quetta.jpg",
    description: "A scenic lake near Quetta surrounded by mountains.",
    history: "Developed as a recreational reservoir in the vicinity of Quetta, Hanna Lake has long served as a popular picnic and boating destination for residents of the city thanks to its cool mountain setting.",
    best_time_to_visit: "April to October, when Quetta's climate is mild and pleasant.",
    how_to_reach: "About a 20-30 minute drive from Quetta city center.",
    tips: "Paddle boats are available for rent at the lakeside, and the surrounding hills are good for a short walk.",
    funfact: "Hanna Lake sits at an elevation of roughly 1,950 meters, giving Quetta's summers a noticeably cooler climate than the plains.",
    activities: ["Rent a paddle boat", "Walk the surrounding hill trails", "Have a lakeside picnic"],
    nearby: ["ziarat-residency"]
  },

  "gwadar-beach": {
    name: "Gwadar Beach",
    region: "balochistan",
    province: "Balochistan",
    type: "natural",
    city: "Gwadar",
    image: "images/gwadr.webp",
    description: "A beautiful coastal destination known for golden beaches.",
    history: "Gwadar's natural deep-water harbor has made it strategically important for centuries, from its time under Omani rule until 1958 to its modern development as a major port city along the Arabian Sea.",
    best_time_to_visit: "November to February, avoiding the intense summer heat along the coast.",
    how_to_reach: "Reachable by domestic flight to Gwadar, or by road along the Makran Coastal Highway from Karachi (about 8-10 hours).",
    tips: "Visit Koh-e-Batil viewpoint at sunset for panoramic views of the town and coastline.",
    funfact: "Gwadar was ruled by the Sultanate of Oman for nearly two centuries before Pakistan purchased it in 1958.",
    activities: ["Watch sunset from Koh-e-Batil viewpoint", "Visit the nearby fish harbor", "Explore Gwadar's Old Bazaar"],
    nearby: []
  }

};


const seedBtn = document.getElementById("seedTourismBtn");
const statusEl = document.getElementById("seedTourismStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Seeding...";

    try {

      await Promise.all(
        Object.entries(TOURISM).map(([key, data]) =>
          setDoc(doc(db, "Tourism", key), data)
        )
      );

      statusEl.textContent = `✅ Done! ${Object.keys(TOURISM).length} destinations saved to Firestore.`;

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}