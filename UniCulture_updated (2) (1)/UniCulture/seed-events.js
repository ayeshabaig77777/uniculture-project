import { db } from "./firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";


// One-time uploader — click "Seed Events" once in the admin panel.
// After that, edit/add events directly in Firestore (events collection).
// 3 standout events per category, 4 under National (16 total). "Festival"
// category was dropped on purpose — it duplicates the site's dedicated
// Festivals page.

const EVENTS = {

  // ---- SPORTS ----

  "shandur-polo": {
    name: "Shandur Polo Festival",
    description: "Held on the world's highest polo ground at over 12,000 feet, the Shandur Polo Festival brings together rival teams from Chitral and Gilgit for a fierce, free-style match with almost no rules. The tournament dates back to the 1930s and has grown into a three-day celebration combining sport, folk music, and camping under the stars. Spectators travel from across the north and abroad to watch riders navigate the thin mountain air on a pitch surrounded by snow-capped peaks. Alongside the polo matches, the festival features traditional dances, paragliding displays, and a lively night-time cultural show. It remains one of the most visually striking sporting events in Pakistan, blending fierce competition with breathtaking scenery and centuries-old mountain hospitality.",
    category: "Sports",
    date: "July 7, 2026",
    venue: "Shandur Pass, Gilgit-Baltistan",
    region: "gilgit",
    image: "images/polo.jpg",
    featured: true,
    highlights: [
      { icon: "🐎", title: "High-Altitude Polo", text: "Free-style polo played at nearly 12,200 feet elevation." },
      { icon: "🏔️", title: "Roof of the World", text: "Held at Shandur Pass, the world's highest polo ground." },
      { icon: "⛺", title: "Camping Grounds", text: "Visitors camp beside the pass for the multi-day festival." },
      { icon: "🎶", title: "Folk Performances", text: "Traditional music and dance accompany the matches." }
    ],
    culturalHighlights: [
      { icon: "🤝", title: "Regional Rivalry", text: "A century-old sporting rivalry between Chitral and Gilgit." },
      { icon: "👘", title: "Traditional Dress", text: "Players and spectators wear regional mountain attire." },
      { icon: "🍲", title: "Local Cuisine", text: "Trout and traditional mountain dishes are widely enjoyed." },
      { icon: "🏕️", title: "Community Gathering", text: "Entire valleys come together for the celebration." },
      { icon: "🧵", title: "Local Crafts", text: "Handicraft stalls showcase Gilgit-Baltistan's artisan traditions." }
    ]
  },

  "horse-cattle-show": {
    name: "National Horse & Cattle Show",
    description: "The National Horse & Cattle Show is one of Pakistan's oldest and largest agricultural and cultural exhibitions, held annually in Lahore since the 1950s. Over the course of a week, the event showcases prized livestock breeds, horse and cattle competitions, and displays of rural craftsmanship from across the country. Evenings are reserved for spectacular tent pegging displays, folk dance performances, and a military tattoo show featuring precision drills and marching bands. The show also hosts food stalls, handicraft exhibitions, and cultural performances representing every province, making it as much a celebration of rural life as it is a competitive showcase. For many families, it remains an eagerly anticipated yearly tradition.",
    category: "Sports",
    date: "March 5, 2026",
    venue: "Lahore, Punjab",
    region: "punjab",
    image: "images/horse-cattle-show.jpg",
    featured: false,
    highlights: [
      { icon: "🐴", title: "Livestock Competitions", text: "Prize animals compete across categories judged by experts." },
      { icon: "🎖️", title: "Tent Pegging", text: "Skilled horsemen compete in traditional tent-pegging contests." },
      { icon: "🎭", title: "Folk Dances", text: "Regional dance troupes perform throughout the week." },
      { icon: "🎺", title: "Military Tattoo", text: "A ceremonial military band and drill display closes each day." }
    ],
    culturalHighlights: [
      { icon: "🏆", title: "National Pride", text: "Showcases Pakistan's agricultural and equestrian heritage." },
      { icon: "👘", title: "Traditional Dress", text: "Performers and handlers wear colourful regional outfits." },
      { icon: "🍢", title: "Food Stalls", text: "Punjabi street food stalls line the show grounds." },
      { icon: "👨‍👩‍👧‍👦", title: "Family Event", text: "A week-long outing enjoyed by families across Lahore." },
      { icon: "🎨", title: "Handicrafts", text: "Artisan stalls sell traditional Punjabi crafts and textiles." }
    ]
  },

  "psl-opening": {
    name: "PSL Opening Ceremony",
    description: "The PSL Opening Ceremony marks the start of Pakistan's biggest domestic cricket tournament with a high-energy blend of music, fireworks, and performances from leading local and international artists. Since the league's launch, the opening night has become a cultural event in its own right, drawing massive live audiences and television viewership across the country. The ceremony typically features a mix of pop, folk, and patriotic songs, alongside elaborate stage productions and pyrotechnics. It sets the tone for weeks of cricket that follow, uniting fans from every province behind their franchise teams. For many young Pakistanis, the ceremony has become as anticipated as the tournament itself, a night that celebrates both sport and popular culture.",
    category: "Sports",
    date: "February 13, 2026",
    venue: "Lahore, Punjab",
    region: "punjab",
    image: "images/psl-opening.jpg",
    featured: false,
    highlights: [
      { icon: "🎤", title: "Star Performers", text: "Top musicians headline a high-energy opening show." },
      { icon: "🏏", title: "Season Kickoff", text: "Marks the official start of the PSL cricket season." },
      { icon: "🎇", title: "Fireworks Display", text: "A spectacular fireworks show lights up the stadium." },
      { icon: "📣", title: "Team Introductions", text: "All franchise teams are introduced to the roaring crowd." }
    ],
    culturalHighlights: [
      { icon: "🇵🇰", title: "National Unity", text: "Cricket brings fans together across every province." },
      { icon: "🎵", title: "Modern Music", text: "Blends pop, folk, and rap performances on one stage." },
      { icon: "🍔", title: "Stadium Food", text: "Popular local and fast-food stalls serve the crowd." },
      { icon: "👨‍👩‍👧‍👦", title: "Family Outing", text: "A festive night out for cricket-loving families." },
      { icon: "📺", title: "Wide Broadcast", text: "Watched live by millions across Pakistan and abroad." }
    ]
  },

  // ---- CULTURAL FAIR ----

  "lok-mela": {
    name: "Lok Virsa Mela",
    description: "Lok Virsa Mela is a national folk heritage festival held in Islamabad, bringing together artisans, musicians, and performers representing every province and region of Pakistan. Organized by the Lok Virsa (National Institute of Folk and Traditional Heritage), the fair showcases traditional crafts such as truck art, pottery, embroidery, and woodwork alongside live folk music and dance performances. Visitors can walk through recreated village settings representing different regions, sample regional cuisine, and watch artisans demonstrate skills passed down through generations. The event plays an important role in preserving and promoting Pakistan's diverse folk traditions, offering urban audiences a rare chance to experience rural cultural heritage in one place. It has become a favorite outing for families and cultural enthusiasts alike.",
    category: "Cultural Fair",
    date: "November 15, 2026",
    venue: "Islamabad",
    region: "punjab",
    image: "images/lokvirsa.jpg",
    featured: false,
    highlights: [
      { icon: "🎨", title: "Artisan Stalls", text: "Craftspeople from every province display handmade work." },
      { icon: "🎶", title: "Folk Music", text: "Live performances of regional folk songs and instruments." },
      { icon: "💃", title: "Traditional Dance", text: "Provincial dance troupes perform throughout the mela." },
      { icon: "🍽️", title: "Regional Food", text: "A food court featuring cuisine from across Pakistan." }
    ],
    culturalHighlights: [
      { icon: "🇵🇰", title: "National Heritage", text: "Celebrates Pakistan's diverse provincial cultures under one roof." },
      { icon: "👘", title: "Traditional Dress", text: "Visitors and performers showcase regional dress and jewelry." },
      { icon: "🧵", title: "Handicrafts", text: "Rare handicraft techniques from remote regions on display." },
      { icon: "👨‍👩‍👧‍👦", title: "Family Friendly", text: "A popular outing for families in Islamabad." },
      { icon: "📚", title: "Living Heritage", text: "Organized by Lok Virsa, Pakistan's national heritage institute." }
    ]
  },

  "hunza-festival": {
    name: "Hunza Cultural Festival",
    description: "The Hunza Cultural Festival celebrates the unique heritage of the Hunza Valley, set against the dramatic backdrop of the Karakoram mountain range. The festival brings together traditional music, folk dance, and local cuisine, offering visitors an intimate look at the customs of one of Pakistan's most scenic regions. Performers showcase traditional instruments and dance forms passed down through generations, while food stalls serve regional specialties like apricot dishes and walnut bread. The event also highlights local craftsmanship, including handwoven textiles and wood carving. Beyond entertainment, the festival serves as a way for the Hunza community to preserve and share its distinct cultural identity, shaped by centuries of mountain life and Silk Road trade influences.",
    category: "Cultural Fair",
    date: "September 21, 2026",
    venue: "Hunza, Gilgit-Baltistan",
    region: "gilgit",
    image: "images/hunza-festival.jpg",
    featured: false,
    highlights: [
      { icon: "🎻", title: "Live Music", text: "Traditional Hunza instruments accompany folk performances." },
      { icon: "💃", title: "Folk Dance", text: "Colourful group dances performed against mountain views." },
      { icon: "🍎", title: "Local Cuisine", text: "Fresh apricots, walnuts, and Hunza specialties are served." },
      { icon: "🏔️", title: "Karakoram Backdrop", text: "Set against the towering peaks of the Karakoram range." }
    ],
    culturalHighlights: [
      { icon: "🏔️", title: "Mountain Heritage", text: "Preserves the unique culture of the Hunza valley." },
      { icon: "👘", title: "Traditional Dress", text: "Locals wear vibrant Hunza and Wakhi attire." },
      { icon: "🍇", title: "Orchard Produce", text: "Celebrates the valley's famous fruit harvests." },
      { icon: "🤝", title: "Community Spirit", text: "Villages unite to host visitors from across Pakistan." },
      { icon: "🗣️", title: "Local Language", text: "Wakhi and Burushaski culture are proudly showcased." }
    ]
  },

  "thar-festival": {
    name: "Thar Cultural Festival",
    description: "The Thar Cultural Festival celebrates the folk traditions of the Thar Desert, one of Pakistan's most culturally rich yet often overlooked regions. The festival features traditional Sindhi and Thari folk music, colorful handicrafts, and vibrant textile displays reflecting the desert community's artistic heritage. Visitors can take part in camel safaris and jeep rallies across the dunes, offering a taste of desert life and hospitality. Local cuisine, folk dance performances, and displays of traditional dress round out the experience. The festival plays an important role in bringing attention to Thar's unique culture, supporting local artisans and performers while giving visitors a memorable glimpse into desert traditions that have endured for generations.",
    category: "Cultural Fair",
    date: "December 6, 2026",
    venue: "Mithi, Sindh",
    region: "sindh",
    image: "images/thar-festival.jpg",
    featured: false,
    highlights: [
      { icon: "🐫", title: "Camel Safaris", text: "Guided camel rides across the Thar desert dunes." },
      { icon: "🚙", title: "Jeep Rallies", text: "Off-road jeep safaris through the desert landscape." },
      { icon: "🎶", title: "Folk Music", text: "Traditional Thari and Sindhi music performances." },
      { icon: "🎨", title: "Craft Bazaar", text: "Local artisans sell traditional Thari embroidery and crafts." }
    ],
    culturalHighlights: [
      { icon: "🏜️", title: "Desert Heritage", text: "Showcases the unique culture of the Thar desert communities." },
      { icon: "👘", title: "Traditional Dress", text: "Vibrant Thari embroidery and mirror-work clothing on display." },
      { icon: "🍛", title: "Local Cuisine", text: "Traditional Sindhi and desert cuisine served to visitors." },
      { icon: "🤝", title: "Interfaith Harmony", text: "Celebrated together by Thar's Hindu and Muslim communities." },
      { icon: "🧵", title: "Embroidery Craft", text: "Famous Thari embroidery techniques passed through generations." }
    ]
  },

  // ---- RELIGIOUS FESTIVAL ----

  "eid-ul-fitr": {
    name: "Eid-ul-Fitr Celebrations",
    description: "Eid-ul-Fitr marks the joyous end of the holy month of Ramadan, celebrated by Muslims across Pakistan with morning prayers, family gatherings, and festive meals. The day begins with special Eid prayers at mosques and open grounds, followed by visits to family and friends, the exchange of gifts, and generous charity to those in need. Homes are decorated, new clothes are worn, and traditional sweets like sheer khurma are prepared and shared widely. Markets and bazaars come alive in the days leading up to Eid with shoppers preparing for the celebrations. Beyond the religious significance, Eid-ul-Fitr is a deeply social occasion, reinforcing bonds of family, community, and generosity across the country.",
    category: "Religious Festival",
    date: "March 20, 2026",
    venue: "Nationwide",
    region: "punjab",
    image: "images/eid-ul-fitr.png",
    featured: true,
    highlights: [
      { icon: "🕌", title: "Eid Prayers", text: "Special congregational prayers held in mosques nationwide." },
      { icon: "🍬", title: "Sweet Treats", text: "Sheer khurma and festive sweets are shared with guests." },
      { icon: "🎁", title: "Eidi Tradition", text: "Elders give money gifts (Eidi) to children and youth." },
      { icon: "👨‍👩‍👧‍👦", title: "Family Gatherings", text: "Families reunite to celebrate after a month of fasting." }
    ],
    culturalHighlights: [
      { icon: "🌙", title: "Spiritual Significance", text: "Marks the joyful end of the holy month of Ramadan." },
      { icon: "👘", title: "New Clothes", text: "People wear new outfits for Eid morning prayers." },
      { icon: "🍲", title: "Traditional Foods", text: "Sheer khurma, biryani, and festive dishes are prepared." },
      { icon: "🤝", title: "Community Bond", text: "Visiting relatives and neighbours strengthens family ties." },
      { icon: "🎗️", title: "Charity", text: "Zakat-ul-Fitr is given to those in need before Eid." }
    ]
  },

  "eid-ul-azha": {
    name: "Eid-ul-Azha",
    description: "Eid-ul-Azha, the festival of sacrifice, commemorates the willingness of Prophet Ibrahim to sacrifice his son in obedience to God, and is observed nationwide with prayers, animal sacrifice, and charity. Families who are able to purchase livestock — typically goats, cows, or camels — perform the sacrifice and distribute the meat in three parts: for family, friends, and those in need. In the weeks leading up to Eid, livestock markets across the country come alive with buyers selecting animals for the occasion. The day includes special prayers at mosques, family visits, and festive meals. The festival emphasizes themes of sacrifice, generosity, and community, with the act of sharing meat ensuring that even the less fortunate can partake in the celebration.",
    category: "Religious Festival",
    date: "May 27, 2026",
    venue: "Nationwide",
    region: "punjab",
    image: "images/eid-ul-azha.png",
    featured: false,
    highlights: [
      { icon: "🕌", title: "Offer Prayers", text: "Special Eid prayers are offered in congregation." },
      { icon: "🐐", title: "Sacrifice", text: "Animals are sacrificed as a symbol of devotion." },
      { icon: "🤲", title: "Share & Care", text: "Meat is shared with family, neighbors and the poor." },
      { icon: "🌙", title: "Gratitude", text: "A reminder of gratitude, faith and compassion." }
    ],
    culturalHighlights: [
      { icon: "🕌", title: "Spiritual Significance", text: "Commemorates the devotion of Prophet Ibrahim (A.S)." },
      { icon: "🍲", title: "Traditional Foods", text: "Enjoy delicious dishes like nihari, paya, qorma and more." },
      { icon: "👘", title: "Traditional Dress", text: "People wear new clothes and visit relatives." },
      { icon: "🤝", title: "Community Bond", text: "Strengthens relationships through sharing and togetherness." },
      { icon: "🎗️", title: "Charity", text: "Encourages giving to those who are in need." }
    ]
  },

  "ramzan": {
    name: "Ramzan (Ramadan)",
    description: "Ramadan is the holy month during which Muslims across Pakistan observe fasting from dawn to sunset, alongside increased prayer, charity, and reflection. Each evening, families and communities gather to break their fast at iftar, often sharing dates, fruit, and traditional dishes before the sunset prayer. Nights are marked by special taraweeh prayers at mosques, with many attending in large congregations. The month brings a distinct rhythm to daily life, with markets staying open late, charitable giving increasing significantly, and communities coming together for shared iftar meals. Ramadan concludes with the celebration of Eid-ul-Fitr, but throughout the month itself, the emphasis remains on self-discipline, spiritual growth, and supporting those less fortunate.",
    category: "Religious Festival",
    date: "February 18, 2026",
    venue: "Nationwide",
    region: "punjab",
    image: "images/ramzan.png",
    featured: false,
    highlights: [
      { icon: "🌙", title: "Fasting", text: "Muslims fast from dawn to dusk throughout the month." },
      { icon: "🕌", title: "Taraweeh Prayers", text: "Special night prayers are held in mosques nationwide." },
      { icon: "🍽️", title: "Iftar Gatherings", text: "Families and friends break their fast together each evening." },
      { icon: "📖", title: "Quran Recitation", text: "Increased focus on reading and reflecting on the Quran." }
    ],
    culturalHighlights: [
      { icon: "🌙", title: "Spiritual Reflection", text: "A month of self-discipline, prayer, and reflection." },
      { icon: "🍲", title: "Iftar Cuisine", text: "Pakoras, dates, and traditional iftar dishes are prepared." },
      { icon: "🕌", title: "Mosque Culture", text: "Mosques fill nightly for taraweeh prayers." },
      { icon: "🤝", title: "Community Sharing", text: "Neighbours and mosques organize community iftars." },
      { icon: "🎗️", title: "Charity", text: "A time of increased charity and giving to the needy." }
    ]
  },

  // ---- NATIONAL ----

  "pakistan-day": {
    name: "Pakistan Day Parade",
    description: "Pakistan Day, observed every March 23rd, commemorates the 1940 Lahore Resolution, in which the All-India Muslim League formally called for the creation of a separate Muslim homeland. The centerpiece of the day is a grand military parade held in Islamabad, showcasing the armed forces' equipment, formations, and ceremonial units, alongside a flypast by the Pakistan Air Force. Provincial floats and cultural performances highlight the diversity of the country's traditions, while civilian award ceremonies recognize outstanding contributions to the nation. The parade is broadcast live nationwide, drawing families together to watch the display of military strength and cultural pride. For many Pakistanis, Pakistan Day is both a solemn reminder of the country's founding struggle and a proud celebration of national identity.",
    category: "National",
    date: "March 23, 2026",
    venue: "Islamabad",
    region: "punjab",
    image: "images/pakistan-day.jpg",
    featured: true,
    highlights: [
      { icon: "🎖️", title: "Military Parade", text: "Armed forces showcase equipment and formations." },
      { icon: "🇵🇰", title: "Flag Hoisting", text: "Ceremonial flag hoisting opens the day's events." },
      { icon: "🎇", title: "Flypast Display", text: "Air force jets perform a ceremonial flypast." },
      { icon: "🎭", title: "Cultural Floats", text: "Provincial floats showcase Pakistan's diverse culture." }
    ],
    culturalHighlights: [
      { icon: "🏛️", title: "Historic Significance", text: "Marks the 1940 Lahore Resolution for a separate homeland." },
      { icon: "🎖️", title: "National Pride", text: "A show of unity, strength, and patriotism." },
      { icon: "🎭", title: "Cultural Display", text: "Provinces present their traditions on parade floats." },
      { icon: "👨‍👩‍👧‍👦", title: "Public Celebration", text: "Streets and homes are decorated in green and white." },
      { icon: "📺", title: "National Broadcast", text: "Watched live by families across the country." }
    ]
  },

  "independence-day": {
    name: "Independence Day Celebrations",
    description: "Independence Day, celebrated on August 14th, marks Pakistan's independence from British colonial rule in 1947. The day begins with flag hoisting ceremonies at government buildings and public spaces nationwide, accompanied by the national anthem and a 31-gun salute in the capital. Streets and homes are decorated in green and white, and cities light up with fireworks after dark. Cultural events, patriotic songs, and television specials fill the day, while many Pakistanis take part in flag-related activities, car rallies, and community gatherings. The occasion serves as a moment of collective pride and reflection on the nation's founding, with people across the country — regardless of province or background — coming together in celebration of a shared national identity.",
    category: "National",
    date: "August 14, 2026",
    venue: "Nationwide",
    region: "punjab",
    image: "images/independence-day.jpg",
    featured: true,
    highlights: [
      { icon: "🇵🇰", title: "Flag Hoisting", text: "Ceremonies held nationwide at dawn to raise the flag." },
      { icon: "🎇", title: "Fireworks", text: "Cities light up with fireworks after sunset." },
      { icon: "🎶", title: "Patriotic Songs", text: "Milli naghmay play across radio, TV, and public spaces." },
      { icon: "🏛️", title: "Public Ceremonies", text: "Official events held at monuments across the country." }
    ],
    culturalHighlights: [
      { icon: "🇵🇰", title: "National Pride", text: "Commemorates Pakistan's independence on 14 August 1947." },
      { icon: "👘", title: "Green & White", text: "Homes, cars, and streets decorated in national colours." },
      { icon: "🍨", title: "Street Food", text: "Vendors sell festive treats at public celebrations." },
      { icon: "👨‍👩‍👧‍👦", title: "Family Outings", text: "Families visit monuments and public light shows together." },
      { icon: "🎗️", title: "Unity", text: "A day that unites all provinces and communities." }
    ]
  },

  "quaid-day": {
    name: "Quaid-e-Azam Day",
    description: "Quaid-e-Azam Day, observed on December 25th, celebrates the birth anniversary of Muhammad Ali Jinnah, the founder of Pakistan and its first Governor-General. The day is marked by official ceremonies at his mausoleum in Karachi, where wreaths are laid and tributes are paid by political and military leaders. Schools, government offices, and media outlets across the country hold events reflecting on Jinnah's role in the independence movement and his vision for the new nation. Public buildings are often illuminated, and documentaries and speeches recounting his life and leadership are broadcast throughout the day. As a national holiday, it offers an opportunity for Pakistanis to reflect on the ideals of unity, faith, and discipline that Jinnah championed during the country's founding.",
    category: "National",
    date: "December 25, 2026",
    venue: "Nationwide",
    region: "sindh",
    image: "images/defence-day.jpg",
    featured: false,
    highlights: [
      { icon: "🏛️", title: "Official Ceremonies", text: "Government events honour Jinnah's life and legacy." },
      { icon: "🎖️", title: "Guard of Honour", text: "Ceremonial guards are presented at his mausoleum." },
      { icon: "📖", title: "Tributes & Speeches", text: "Leaders and citizens pay tribute to the founding father." },
      { icon: "🎂", title: "Cake Cutting", text: "Cakes are cut at schools and institutions nationwide." }
    ],
    culturalHighlights: [
      { icon: "🏛️", title: "Historic Significance", text: "Honours Muhammad Ali Jinnah, Pakistan's founding father." },
      { icon: "🕯️", title: "National Reflection", text: "A day of remembrance and national gratitude." },
      { icon: "🎓", title: "Educational Events", text: "Schools hold special events on his life and vision." },
      { icon: "👨‍👩‍👧‍👦", title: "Public Participation", text: "Citizens visit his mausoleum in Karachi to pay respects." },
      { icon: "📺", title: "National Broadcast", text: "Documentaries and tributes air across national media." }
    ]
  },

  "youm-e-takbeer": {
    name: "Youm-e-Takbeer",
    description: "Youm-e-Takbeer, observed on May 28th, commemorates Pakistan's successful nuclear tests conducted in the Chagai Hills in 1998, an event widely seen as a milestone in the country's defense history. The day is marked by ceremonies honoring the scientists, engineers, and military personnel involved in the program, along with speeches emphasizing national security and self-reliance. Government buildings and monuments, including replicas of the Chagai hills displayed in some cities, are illuminated, and documentaries recounting the events of 1998 are broadcast on television. While more solemn than festive, Youm-e-Takbeer holds significant symbolic weight in Pakistan's national narrative, framed as a moment when the country asserted its place as a nuclear power on the world stage.",
    category: "National",
    date: "May 28, 2026",
    venue: "Nationwide",
    region: "punjab",
    image: "images/youm-e-takbeer.jpg",
    featured: false,
    highlights: [
      { icon: "⚛️", title: "Nuclear Test Anniversary", text: "Marks Pakistan's 1998 nuclear tests at Chagai." },
      { icon: "🎖️", title: "Ceremonies", text: "Official events honour the nation's scientists and armed forces." },
      { icon: "🇵🇰", title: "National Pride", text: "Celebrated as a milestone of self-reliance and strength." },
      { icon: "📺", title: "Tributes", text: "Documentaries and speeches air across national media." }
    ],
    culturalHighlights: [
      { icon: "🏛️", title: "Historic Significance", text: "Marks Pakistan becoming a nuclear power on 28 May 1998." },
      { icon: "🎖️", title: "National Pride", text: "Honours scientists and the armed forces' achievements." },
      { icon: "🕯️", title: "Reflection", text: "A day of remembrance for national sovereignty and strength." },
      { icon: "🎓", title: "Educational Focus", text: "Institutions highlight the nation's scientific achievements." },
      { icon: "📺", title: "National Broadcast", text: "Special programs air across TV and radio." }
    ]
  },

  // ---- SUFI FESTIVAL ----

  "urs-lal-shahbaz": {
    name: "Urs of Lal Shahbaz Qalandar",
    description: "The Urs of Lal Shahbaz Qalandar is one of Pakistan's most vibrant Sufi festivals, held annually at the shrine of the 13th-century Sufi saint in Sehwan Sharif, Sindh. Devotees from across the country gather for several days of devotional music, poetry, and the famous ecstatic dhamaal dance performed to the rhythm of drums late into the night. The shrine itself, painted in red to reflect the saint's title, becomes a focal point of prayer, offerings, and qawwali performances throughout the celebration. Pilgrims of diverse backgrounds attend, reflecting the saint's reputation for inclusivity and tolerance. The Urs is considered one of the most important events in Pakistan's Sufi calendar, embodying the mystical, music-centered spirituality that has long shaped Sindhi religious life.",
    category: "Sufi Festival",
    date: "August 2, 2026",
    venue: "Sehwan Sharif, Sindh",
    region: "sindh",
    image: "images/urs-lal-shahbaz.jpg",
    featured: true,
    highlights: [
      { icon: "💃", title: "Dhamaal Dance", text: "Devotees perform the ecstatic dhamaal dance at the shrine." },
      { icon: "🎶", title: "Qawwali Nights", text: "Live qawwali performances continue through the night." },
      { icon: "🕯️", title: "Shrine Visits", text: "Thousands of devotees travel to Sehwan Sharif to pay respects." },
      { icon: "🌸", title: "Chadar Offerings", text: "Devotees offer flower chadars at the saint's shrine." }
    ],
    culturalHighlights: [
      { icon: "🕌", title: "Spiritual Significance", text: "Honours the 13th-century Sufi saint Lal Shahbaz Qalandar." },
      { icon: "🎶", title: "Devotional Music", text: "Qawwali and dhamaal express spiritual devotion through sound." },
      { icon: "🍲", title: "Langar (Free Food)", text: "Free food is distributed to all visiting devotees." },
      { icon: "🤝", title: "Interfaith Gathering", text: "Devotees of all faiths and backgrounds attend together." },
      { icon: "🌺", title: "Sufi Tradition", text: "Reflects Sindh's centuries-old Sufi spiritual heritage." }
    ]
  },

  "urs-bhittai": {
    name: "Urs of Shah Abdul Latif Bhittai",
    description: "The Urs of Shah Abdul Latif Bhittai honors one of Sindh's greatest Sufi poets at his shrine in Bhit Shah. The multi-day gathering draws devotees, musicians, and poetry lovers who come to hear recitations from his renowned work, the Shah Jo Risalo, performed in traditional sur (musical raga) style unique to the shrine. Devotional singers, known as faqirs, perform through the night accompanied by traditional instruments, creating an atmosphere of deep spiritual reflection. The event also features folk dance and poetry gatherings that celebrate Bhittai's influence on Sindhi language and literature. As one of the most significant cultural and spiritual events in Sindh, the Urs reflects the enduring connection between Sufi mysticism, poetry, and music in the region's identity.",
    category: "Sufi Festival",
    date: "September 10, 2026",
    venue: "Bhit Shah, Sindh",
    region: "sindh",
    image: "images/urs-bhittai.jpg",
    featured: false,
    highlights: [
      { icon: "🎶", title: "Devotional Music", text: "Sindhi Sufi poetry is sung throughout the gathering." },
      { icon: "📖", title: "Poetry Recitation", text: "Verses from the Shah Jo Risalo are recited by devotees." },
      { icon: "💃", title: "Traditional Dance", text: "Folk dances accompany devotional performances." },
      { icon: "🕯️", title: "Shrine Visits", text: "Devotees travel to Bhit Shah to pay their respects." }
    ],
    culturalHighlights: [
      { icon: "🕌", title: "Spiritual Significance", text: "Honours the revered Sindhi Sufi poet Shah Abdul Latif Bhittai." },
      { icon: "📖", title: "Literary Heritage", text: "Celebrates his poetic masterpiece, the Shah Jo Risalo." },
      { icon: "🎶", title: "Devotional Music", text: "Raag-based Sufi singing is central to the gathering." },
      { icon: "🍲", title: "Langar (Free Food)", text: "Free meals are distributed to all attendees." },
      { icon: "🌺", title: "Sufi Tradition", text: "A cornerstone of Sindh's Sufi cultural heritage." }
    ]
  },

  "urs-rehman-baba": {
    name: "Urs of Rehman Baba",
    description: "The Urs of Rehman Baba celebrates the life and poetry of the revered 17th-century Pashto Sufi poet at his shrine near Peshawar. The gathering draws devotees and poetry enthusiasts from across Khyber Pakhtunkhwa for recitations of his verses, which remain deeply influential in Pashto literature and Sufi thought. Devotional music performances, including qawwali, accompany the poetry sessions, creating an atmosphere that blends spiritual reflection with cultural celebration. Visitors also gather to share food and stories, reinforcing community bonds around the shared reverence for the saint's teachings on love, humility, and unity. The Urs remains an important marker of Pashtun cultural and spiritual life, keeping Rehman Baba's message alive for new generations.",
    category: "Sufi Festival",
    date: "April 18, 2026",
    venue: "Peshawar, Khyber Pakhtunkhwa",
    region: "kpk",
    image: "images/urs-data-darbar.jpg",
    featured: false,
    highlights: [
      { icon: "📖", title: "Poetry Recitation", text: "Verses of the great Pashto Sufi poet are recited." },
      { icon: "🎶", title: "Devotional Music", text: "Pashto devotional songs are performed at the shrine." },
      { icon: "🕯️", title: "Shrine Gathering", text: "Devotees from across Khyber Pakhtunkhwa gather to pay respects." },
      { icon: "🤲", title: "Prayers & Reflection", text: "A time of spiritual reflection and remembrance." }
    ],
    culturalHighlights: [
      { icon: "🕌", title: "Spiritual Significance", text: "Honours the revered Pashto Sufi poet Rehman Baba." },
      { icon: "📖", title: "Literary Heritage", text: "Celebrates his enduring contribution to Pashto poetry." },
      { icon: "🎶", title: "Devotional Music", text: "Traditional Pashto devotional singing marks the event." },
      { icon: "🍲", title: "Langar (Free Food)", text: "Free food is offered to all who attend." },
      { icon: "🌺", title: "Sufi Tradition", text: "Reflects the Pashtun region's deep Sufi heritage." }
    ]
  }

};


const seedBtn = document.getElementById("seedEventsBtn");
const statusEl = document.getElementById("seedEventsStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Seeding...";

    try {

      await Promise.all(
        Object.entries(EVENTS).map(([key, data]) =>
          setDoc(doc(db, "events", key), data)
        )
      );

      statusEl.textContent = "✅ Done! 16 events saved to Firestore.";

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}