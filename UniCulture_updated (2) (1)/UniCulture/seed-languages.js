import { db } from "./firebase-config.js";

import {
  doc,
  setDoc
} from "https://www.gstatic.com/firebasejs/12.13.0/firebase-firestore.js";

// ============================================================
// SEED LANGUAGES — Language Learning Content
// ============================================================
// This does NOT touch the existing base fields of each language
// document (name, province, region, image, script, speakers,
// language_family, description, history, writing_direction,
// dialects, similar_languages, hello, thanks, welcome, goodbye,
// literature, notable_people, cultural_practices, traditional_food,
// music_dance, fun_fact). Those already live in Firestore and this
// project has no seed file for them, so this script writes ONLY
// the new `language_learning` field using setDoc(..., { merge: true }),
// which adds/overwrites just that one field and leaves everything
// else in the document exactly as it is.
//
// Document IDs used (must match the existing "languages" collection
// document IDs — these are the slugs used across languages.js /
// language_detail.js flow): balochi, punjabi, sindhi, pashto, saraiki,
// urdu, kashmiri, hindko, shina, balti, burushaski, wakhi.
// If your live Firestore documents use different IDs, update the keys
// in LANGUAGE_LEARNING below to match before seeding — otherwise this
// will create 12 new, separate documents instead of updating the
// existing ones.
//
// DATA ACCURACY NOTE: entries for Shina, Balti, Burushaski, Wakhi,
// Kashmiri, and (to a lesser extent) Saraiki, Hindko and Balochi
// include "note" fields wherever a word reflects genuine dialectal
// variation, a commonly-used Urdu-shared spoken form, or needs
// native-speaker verification, rather than a fabricated translation.
// Treat this as a v1 dataset — review with native speakers before
// treating it as final, especially for the four most under-documented
// languages (Shina, Balti, Burushaski, Wakhi).
//
// UPDATE (vocabulary expansion): each language below now also
// includes: 3 extra greetings, common-word additions across all
// 6 categories (people/transport/food/places/objects/useful), and
// 5 extra phrases. Numbers were extended to 20 for Urdu, Punjabi,
// Sindhi, Pashto, Saraiki, Kashmiri, Hindko and Balochi. Numbers were
// intentionally left at 1–10 for Shina, Balti, Burushaski and Wakhi,
// since reliable 11–20 sourcing was not available for those four —
// extend them only once verified with a native speaker or reference
// grammar. New entries follow the same "note" convention as above.

const LANGUAGE_LEARNING = {
  "Urdu": {
    "greetings": [
      {
        "english": "Hello",
        "native": "السلام علیکم",
        "roman": "Assalam-o-Alaikum"
      },
      {
        "english": "Hi",
        "native": "ہائے",
        "roman": "Hi"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair"
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dopeher Bakhair"
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair"
      },
      {
        "english": "Good Night",
        "native": "شب بخیر",
        "roman": "Shab Bakhair"
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed"
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "شکریہ",
        "roman": "Shukriya"
      },
      {
        "english": "Please",
        "native": "براہ کرم",
        "roman": "Baraye Meherbani"
      },
      {
        "english": "Sorry",
        "native": "معاف کیجیے",
        "roman": "Maaf Kijiye"
      },
      {
        "english": "Yes",
        "native": "جی ہاں",
        "roman": "Ji Haan"
      },
      {
        "english": "No",
        "native": "نہیں",
        "roman": "Nahi"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge"
      },
      {
        "english": "Nice To Meet You",
        "native": "آپ سے مل کر خوشی ہوئی",
        "roman": "Aap se mil kar khushi hui"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیں",
        "roman": "Apna khayal rakhein"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "ایک",
        "roman": "Ek"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دو",
        "roman": "Do"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "تین",
        "roman": "Teen"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پانچ",
        "roman": "Paanch"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "چھ",
        "roman": "Chhay"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "سات",
        "roman": "Saat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "آٹھ",
        "roman": "Aath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نو",
        "roman": "Nau"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "دس",
        "roman": "Das"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "گیارہ",
        "roman": "Gyarah"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "بارہ",
        "roman": "Baarah"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تیرہ",
        "roman": "Terah"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چودہ",
        "roman": "Chaudah"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پندرہ",
        "roman": "Pandrah"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "سولہ",
        "roman": "Solah"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "سترہ",
        "roman": "Satrah"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "اٹھارہ",
        "roman": "Athaarah"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "انیس",
        "roman": "Unnees"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "بیس",
        "roman": "Bees"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "آدمی",
          "roman": "Aadmi"
        },
        {
          "english": "Woman",
          "native": "عورت",
          "roman": "Aurat"
        },
        {
          "english": "Boy",
          "native": "لڑکا",
          "roman": "Larka"
        },
        {
          "english": "Girl",
          "native": "لڑکی",
          "roman": "Larki"
        },
        {
          "english": "Child",
          "native": "بچہ",
          "roman": "Bachcha"
        },
        {
          "english": "Friend",
          "native": "دوست",
          "roman": "Dost"
        },
        {
          "english": "Mother",
          "native": "ماں",
          "roman": "Maa"
        },
        {
          "english": "Father",
          "native": "باپ",
          "roman": "Baap"
        },
        {
          "english": "Brother",
          "native": "بھائی",
          "roman": "Bhai"
        },
        {
          "english": "Sister",
          "native": "بہن",
          "roman": "Behan"
        },
        {
          "english": "Grandfather",
          "native": "دادا",
          "roman": "Dada"
        },
        {
          "english": "Grandmother",
          "native": "دادی",
          "roman": "Dadi"
        },
        {
          "english": "Son",
          "native": "بیٹا",
          "roman": "Beta"
        },
        {
          "english": "Daughter",
          "native": "بیٹی",
          "roman": "Beti"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "کار",
          "roman": "Kaar"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹر سائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "سڑک",
          "roman": "Sarak"
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari"
        },
        {
          "english": "Train",
          "native": "ٹرین",
          "roman": "Train"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz"
        },
        {
          "english": "Boat",
          "native": "کشتی",
          "roman": "Kashti"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana"
        },
        {
          "english": "Water",
          "native": "پانی",
          "roman": "Paani"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "دودھ",
          "roman": "Doodh"
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti"
        },
        {
          "english": "Rice",
          "native": "چاول",
          "roman": "Chawal"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "پھل",
          "roman": "Phal"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi"
        },
        {
          "english": "Sugar",
          "native": "چینی",
          "roman": "Cheeni"
        },
        {
          "english": "Salt",
          "native": "نمک",
          "roman": "Namak"
        },
        {
          "english": "Egg",
          "native": "انڈا",
          "roman": "Anda"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "گاؤں",
          "roman": "Gaon"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar"
        },
        {
          "english": "River",
          "native": "دریا",
          "roman": "Darya"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازہ",
          "roman": "Darwaza"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "بستر",
          "roman": "Bistar"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آؤ",
          "roman": "Aao"
        },
        {
          "english": "Go",
          "native": "جاؤ",
          "roman": "Jao"
        },
        {
          "english": "Eat",
          "native": "کھاؤ",
          "roman": "Khao"
        },
        {
          "english": "Drink",
          "native": "پیو",
          "roman": "Piyo"
        },
        {
          "english": "Sit",
          "native": "بیٹھو",
          "roman": "Baitho"
        },
        {
          "english": "Stand",
          "native": "کھڑے ہو",
          "roman": "Khare Ho"
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "اچھا",
          "roman": "Acha"
        },
        {
          "english": "Bad",
          "native": "برا",
          "roman": "Bura"
        },
        {
          "english": "Big",
          "native": "بڑا",
          "roman": "Bara"
        },
        {
          "english": "Small",
          "native": "چھوٹا",
          "roman": "Chota"
        },
        {
          "english": "Today",
          "native": "آج",
          "roman": "Aaj"
        },
        {
          "english": "Tomorrow",
          "native": "کل",
          "roman": "Kal"
        },
        {
          "english": "Here",
          "native": "یہاں",
          "roman": "Yahan"
        },
        {
          "english": "There",
          "native": "وہاں",
          "roman": "Wahan"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "آپ کا نام کیا ہے؟",
        "roman": "Aap ka naam kya hai?"
      },
      {
        "english": "My name is...",
        "native": "میرا نام ... ہے",
        "roman": "Mera naam ... hai"
      },
      {
        "english": "How are you?",
        "native": "آپ کیسے ہیں؟",
        "roman": "Aap kaisay hain?"
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک ہوں",
        "roman": "Main theek hoon"
      },
      {
        "english": "Where are you from?",
        "native": "آپ کہاں سے ہیں؟",
        "roman": "Aap kahan se hain?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان سے ہوں",
        "roman": "Main Pakistan se hoon"
      },
      {
        "english": "What are you doing?",
        "native": "آپ کیا کر رہے ہیں؟",
        "roman": "Aap kya kar rahay hain?"
      },
      {
        "english": "I don't understand.",
        "native": "مجھے سمجھ نہیں آیا",
        "roman": "Mujhe samajh nahi aaya"
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستہ بولیں",
        "roman": "Aahista bolein"
      },
      {
        "english": "Can you help me?",
        "native": "کیا آپ میری مدد کر سکتے ہیں؟",
        "roman": "Kya aap meri madad kar saktay hain?"
      },
      {
        "english": "How much is this?",
        "native": "یہ کتنے کا ہے؟",
        "roman": "Yeh kitnay ka hai?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کہاں ہے؟",
        "roman": "Bazaar kahan hai?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "باتھ روم کہاں ہے؟",
        "roman": "Bathroom kahan hai?"
      },
      {
        "english": "I am hungry.",
        "native": "مجھے بھوک لگی ہے",
        "roman": "Mujhe bhookh lagi hai"
      },
      {
        "english": "I am thirsty.",
        "native": "مجھے پیاس لگی ہے",
        "roman": "Mujhe pyaas lagi hai"
      },
      {
        "english": "I like this.",
        "native": "مجھے یہ پسند ہے",
        "roman": "Mujhe yeh pasand hai"
      },
      {
        "english": "I don't like this.",
        "native": "مجھے یہ پسند نہیں",
        "roman": "Mujhe yeh pasand nahi"
      },
      {
        "english": "What time is it?",
        "native": "کیا وقت ہوا ہے؟",
        "roman": "Kya waqt hua hai?"
      },
      {
        "english": "I love you.",
        "native": "میں تم سے محبت کرتا ہوں",
        "roman": "Main tumse mohabbat karta hoon"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملتے ہیں",
        "roman": "Kal miltay hain"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہو!",
        "roman": "Mubarak ho!"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak"
      }
    ]
  },
  "Punjabi": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Common Urdu-shared form in spoken Punjabi"
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Common Urdu-shared form"
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Common Urdu-shared form"
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair",
        "note": "Common Urdu-shared form"
      },
      {
        "english": "Welcome",
        "native": "جی آیاں نوں",
        "roman": "Jee Ayan Nu"
      },
      {
        "english": "Goodbye",
        "native": "اللہ حافظ",
        "roman": "Allah Hafiz"
      },
      {
        "english": "Thank You",
        "native": "شکریہ",
        "roman": "Shukriya"
      },
      {
        "english": "Please",
        "native": "مہربانی کر کے",
        "roman": "Meharbani Kar Ke"
      },
      {
        "english": "Sorry",
        "native": "معاف کرنا",
        "roman": "Maaf Karna"
      },
      {
        "english": "Yes",
        "native": "ہاں",
        "roman": "Haan"
      },
      {
        "english": "No",
        "native": "نہیں",
        "roman": "Nahi"
      },
      {
        "english": "See You Later",
        "native": "فیر ملاں گے",
        "roman": "Fer Milange"
      },
      {
        "english": "Nice To Meet You",
        "native": "تہاڈے نال مل کے خوشی ہوئی",
        "roman": "Tuhade naal mil ke khushi hoi"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیو",
        "roman": "Apna khayal rakhio"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "اک",
        "roman": "Ik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دو",
        "roman": "Do"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "تن",
        "roman": "Tinn"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنج",
        "roman": "Panj"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "چھ",
        "roman": "Chhe"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ست",
        "roman": "Sat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اٹھ",
        "roman": "Ath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نو",
        "roman": "Nau"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "دس",
        "roman": "Das"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "گیاراں",
        "roman": "Gyarah"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "بارہ",
        "roman": "Baarah"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تیرہ",
        "roman": "Terah"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چودہ",
        "roman": "Chaudah"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پندراں",
        "roman": "Pandrah"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "سولاں",
        "roman": "Solah"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "ستارہ",
        "roman": "Satarah"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "اٹھارہ",
        "roman": "Athaarah"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "انی",
        "roman": "Unni"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "ویہہ",
        "roman": "Veeh"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "بندہ",
          "roman": "Banda"
        },
        {
          "english": "Woman",
          "native": "زنانی",
          "roman": "Zanani"
        },
        {
          "english": "Boy",
          "native": "منڈا",
          "roman": "Munda"
        },
        {
          "english": "Girl",
          "native": "کڑی",
          "roman": "Kudi"
        },
        {
          "english": "Child",
          "native": "بچہ",
          "roman": "Bacha"
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar"
        },
        {
          "english": "Mother",
          "native": "ماں",
          "roman": "Maa"
        },
        {
          "english": "Father",
          "native": "پیو",
          "roman": "Pio"
        },
        {
          "english": "Brother",
          "native": "بھرا",
          "roman": "Bhra"
        },
        {
          "english": "Sister",
          "native": "بھین",
          "roman": "Bhain"
        },
        {
          "english": "Grandfather",
          "native": "دادا",
          "roman": "Dada"
        },
        {
          "english": "Grandmother",
          "native": "دادی",
          "roman": "Dadi"
        },
        {
          "english": "Son",
          "native": "پتر",
          "roman": "Puttar"
        },
        {
          "english": "Daughter",
          "native": "دھی",
          "roman": "Dhee"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "سڑک",
          "roman": "Sarak"
        },
        {
          "english": "Vehicle",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz"
        },
        {
          "english": "Boat",
          "native": "بیڑی",
          "roman": "Beri"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana"
        },
        {
          "english": "Water",
          "native": "پانی",
          "roman": "Paani"
        },
        {
          "english": "Tea",
          "native": "چاہ",
          "roman": "Chah"
        },
        {
          "english": "Milk",
          "native": "دُدھ",
          "roman": "Dudh"
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti"
        },
        {
          "english": "Rice",
          "native": "چاول",
          "roman": "Chawal"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "پھل",
          "roman": "Phal"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi"
        },
        {
          "english": "Sugar",
          "native": "کھنڈ",
          "roman": "Khand"
        },
        {
          "english": "Salt",
          "native": "لون",
          "roman": "Loon"
        },
        {
          "english": "Egg",
          "native": "آنڈا",
          "roman": "Aanda"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسیت",
          "roman": "Maseet"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "پنڈ",
          "roman": "Pind"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar"
        },
        {
          "english": "River",
          "native": "دریا",
          "roman": "Darya"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "بوہا",
          "roman": "Boha"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "منجی",
          "roman": "Manji"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آ",
          "roman": "Aa"
        },
        {
          "english": "Go",
          "native": "جا",
          "roman": "Ja"
        },
        {
          "english": "Eat",
          "native": "کھا",
          "roman": "Kha"
        },
        {
          "english": "Drink",
          "native": "پی",
          "roman": "Pee"
        },
        {
          "english": "Sit",
          "native": "بہہ",
          "roman": "Baih"
        },
        {
          "english": "Stand",
          "native": "کھلو",
          "roman": "Khalo"
        },
        {
          "english": "Stop",
          "native": "رک",
          "roman": "Ruk"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "چنگا",
          "roman": "Changa"
        },
        {
          "english": "Bad",
          "native": "مندا",
          "roman": "Manda"
        },
        {
          "english": "Big",
          "native": "وڈا",
          "roman": "Wadda"
        },
        {
          "english": "Small",
          "native": "نکا",
          "roman": "Nikka"
        },
        {
          "english": "Today",
          "native": "اج",
          "roman": "Ajj"
        },
        {
          "english": "Tomorrow",
          "native": "کل",
          "roman": "Kal",
          "note": "Commonly shared with Urdu in spoken Punjabi; meaning (yesterday/tomorrow) depends on context"
        },
        {
          "english": "Here",
          "native": "ایتھے",
          "roman": "Ethe"
        },
        {
          "english": "There",
          "native": "اوتھے",
          "roman": "Othe"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "تیرا ناں کی اے؟",
        "roman": "Tera naan ki ae?"
      },
      {
        "english": "My name is...",
        "native": "میرا ناں ... اے",
        "roman": "Mera naan ... ae"
      },
      {
        "english": "How are you?",
        "native": "توں کیویں ایں؟",
        "roman": "Tu kiven ain?"
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک آں",
        "roman": "Main theek aan"
      },
      {
        "english": "Where are you from?",
        "native": "توں کتھوں ایں؟",
        "roman": "Tu kithon ain?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان توں آں",
        "roman": "Main Pakistan ton aan"
      },
      {
        "english": "What are you doing?",
        "native": "توں کی کر رہا ایں؟",
        "roman": "Tu ki kar riha ain?"
      },
      {
        "english": "I don't understand.",
        "native": "میکوں سمجھ نہیں آئی",
        "roman": "Mainu samajh nahi aayi"
      },
      {
        "english": "Please speak slowly.",
        "native": "ہولی بول",
        "roman": "Holi bol"
      },
      {
        "english": "Can you help me?",
        "native": "کی توں میری مدد کر سکدا ایں؟",
        "roman": "Ki tu meri madad kar sakda ain?"
      },
      {
        "english": "How much is this?",
        "native": "ایہ کتنے دا اے؟",
        "roman": "Eh kitne da ae?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کتھے اے؟",
        "roman": "Bazaar kithe ae?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانہ کتھے اے؟",
        "roman": "Ghusal khana kithe ae?"
      },
      {
        "english": "I am hungry.",
        "native": "میکوں بھکھ لگی اے",
        "roman": "Mainu bhukh lagi ae"
      },
      {
        "english": "I am thirsty.",
        "native": "میکوں پیاس لگی اے",
        "roman": "Mainu pyaas lagi ae"
      },
      {
        "english": "I like this.",
        "native": "میکوں ایہ چنگا لگدا اے",
        "roman": "Mainu eh changa lagda ae"
      },
      {
        "english": "I don't like this.",
        "native": "میکوں ایہ چنگا نہیں لگدا",
        "roman": "Mainu eh changa nahi lagda"
      },
      {
        "english": "What time is it?",
        "native": "کیہڑا ویلا اے؟",
        "roman": "Kehda vela ae?"
      },
      {
        "english": "I love you.",
        "native": "میں تینوں پیار کرنا ہاں",
        "roman": "Main tainu pyar karna haan"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملاں گے",
        "roman": "Kal milange"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہووے!",
        "roman": "Mubarak hove!"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak"
      }
    ],
    "dialect_note": "Written in Shahmukhi (Perso-Arabic) script as used in Pakistani Punjab. Formal greetings like 'Good Morning/Afternoon/Evening' are commonly borrowed from Urdu in everyday Pakistani Punjabi speech."
  },
  "Sindhi": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح جو سلام",
        "roman": "Subha Jo Salaam"
      },
      {
        "english": "Good Afternoon",
        "native": "منجھند جو سلام",
        "roman": "Manjhand Jo Salaam"
      },
      {
        "english": "Good Evening",
        "native": "شام جو سلام",
        "roman": "Shaam Jo Salaam"
      },
      {
        "english": "Good Night",
        "native": "سٺي راٽ",
        "roman": "Sathi Raat"
      },
      {
        "english": "Welcome",
        "native": "ڀلي ڪري آيا",
        "roman": "Bhali Kari Aaya"
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "شڪريو",
        "roman": "Shukrio"
      },
      {
        "english": "Please",
        "native": "مهرباني ڪري",
        "roman": "Meharbani Kari"
      },
      {
        "english": "Sorry",
        "native": "معاف ڪجو",
        "roman": "Maaf Kajo"
      },
      {
        "english": "Yes",
        "native": "ها",
        "roman": "Ha"
      },
      {
        "english": "No",
        "native": "نه",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "وري ملنداسين",
        "roman": "Wari Mildaseen"
      },
      {
        "english": "Nice To Meet You",
        "native": "توهان سان ملي خوشي ٿي",
        "roman": "Toha San Mili Khushi Thi"
      },
      {
        "english": "Take Care",
        "native": "پنهنجو خيال رکجو",
        "roman": "Panhinjo Khayal Rakhjo"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "هڪ",
        "roman": "Hik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "ٻه",
        "roman": "Bay"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "ٽي",
        "roman": "Trey"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنج",
        "roman": "Panj"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "ڇهه",
        "roman": "Chhe"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ست",
        "roman": "Sat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اَٺ",
        "roman": "Ath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نو",
        "roman": "Nau"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "ڏهه",
        "roman": "Daha"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "يارهن",
        "roman": "Yaarahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "ٻارهن",
        "roman": "Baarahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تيرهن",
        "roman": "Terahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چوڏهن",
        "roman": "Chodahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پندرهن",
        "roman": "Pandrahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "سورهن",
        "roman": "Sorahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "سترهن",
        "roman": "Satrahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "ارڙهن",
        "roman": "Arrahn",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "اڻويهه",
        "roman": "Anvih",
        "note": "Needs native-speaker verification for exact spoken form"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "ويهه",
        "roman": "Vih"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "مرد",
          "roman": "Mard"
        },
        {
          "english": "Woman",
          "native": "عورت",
          "roman": "Aurat"
        },
        {
          "english": "Boy",
          "native": "ڇوڪرو",
          "roman": "Chhokro"
        },
        {
          "english": "Girl",
          "native": "ڇوڪري",
          "roman": "Chhokri"
        },
        {
          "english": "Child",
          "native": "ٻار",
          "roman": "Baar"
        },
        {
          "english": "Friend",
          "native": "دوست",
          "roman": "Dost"
        },
        {
          "english": "Mother",
          "native": "امان",
          "roman": "Amaan"
        },
        {
          "english": "Father",
          "native": "بابو",
          "roman": "Babo"
        },
        {
          "english": "Brother",
          "native": "ڀاءُ",
          "roman": "Bhau"
        },
        {
          "english": "Sister",
          "native": "ڀيڻ",
          "roman": "Bhen"
        },
        {
          "english": "Grandfather",
          "native": "ڏاڏو",
          "roman": "Dado"
        },
        {
          "english": "Grandmother",
          "native": "ڏاڏي",
          "roman": "Dadi"
        },
        {
          "english": "Son",
          "native": "پٽ",
          "roman": "Putt"
        },
        {
          "english": "Daughter",
          "native": "ڌيءَ",
          "roman": "Dhee"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڏي",
          "roman": "Gaddi"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رڪشا",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائيڪل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٽرسائيڪل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستو",
          "roman": "Rasto"
        },
        {
          "english": "Vehicle",
          "native": "گاڏي",
          "roman": "Gaddi"
        },
        {
          "english": "Train",
          "native": "ريل",
          "roman": "Rail"
        },
        {
          "english": "Airplane",
          "native": "جهاز",
          "roman": "Jahaz"
        },
        {
          "english": "Boat",
          "native": "ٻيڙي",
          "roman": "Beri"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کاڌو",
          "roman": "Khadho"
        },
        {
          "english": "Water",
          "native": "پاڻي",
          "roman": "Paani"
        },
        {
          "english": "Tea",
          "native": "چانهه",
          "roman": "Chahn"
        },
        {
          "english": "Milk",
          "native": "کير",
          "roman": "Kheer"
        },
        {
          "english": "Bread",
          "native": "ماني",
          "roman": "Maani"
        },
        {
          "english": "Rice",
          "native": "چانور",
          "roman": "Chanwar"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "ميوو",
          "roman": "Mewo"
        },
        {
          "english": "Vegetable",
          "native": "ڀاڄي",
          "roman": "Bhaji"
        },
        {
          "english": "Sugar",
          "native": "کنڊ",
          "roman": "Khand"
        },
        {
          "english": "Salt",
          "native": "لوڻ",
          "roman": "Loon"
        },
        {
          "english": "Egg",
          "native": "آنڊو",
          "roman": "Aando"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گهر",
          "roman": "Ghar"
        },
        {
          "english": "School",
          "native": "اسڪول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "اسپتال",
          "roman": "Ispatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دڪان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "ڳوٺ",
          "roman": "Goth"
        },
        {
          "english": "City",
          "native": "شهر",
          "roman": "Shehar"
        },
        {
          "english": "River",
          "native": "درياءُ",
          "roman": "Darya"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "ڪتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازو",
          "roman": "Darwazo"
        },
        {
          "english": "Chair",
          "native": "ڪرسي",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "ميز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "ڪپڙا",
          "roman": "Kapda"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "ٿيلهو",
          "roman": "Thailho"
        },
        {
          "english": "Bed",
          "native": "کٽ",
          "roman": "Khatt"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "اچ",
          "roman": "Ach"
        },
        {
          "english": "Go",
          "native": "وڃ",
          "roman": "Waanj"
        },
        {
          "english": "Eat",
          "native": "کاءُ",
          "roman": "Khaau"
        },
        {
          "english": "Drink",
          "native": "پي",
          "roman": "Pee"
        },
        {
          "english": "Sit",
          "native": "ويهه",
          "roman": "Vehh"
        },
        {
          "english": "Stand",
          "native": "اُٿ",
          "roman": "Uth"
        },
        {
          "english": "Stop",
          "native": "بيهه",
          "roman": "Behh"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "سٺو",
          "roman": "Sathho"
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab"
        },
        {
          "english": "Big",
          "native": "وڏو",
          "roman": "Wado"
        },
        {
          "english": "Small",
          "native": "ننڍو",
          "roman": "Nandho"
        },
        {
          "english": "Today",
          "native": "اڄ",
          "roman": "Aj"
        },
        {
          "english": "Tomorrow",
          "native": "سڀاڻي",
          "roman": "Sabhaani"
        },
        {
          "english": "Here",
          "native": "هتي",
          "roman": "Hitay"
        },
        {
          "english": "There",
          "native": "اتي",
          "roman": "Utay"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "توهانجو نالو ڇا آهي؟",
        "roman": "Toahnjo naalo chha aahe?"
      },
      {
        "english": "My name is...",
        "native": "منهنجو نالو ... آهي",
        "roman": "Munhinjo naalo ... aahe"
      },
      {
        "english": "How are you?",
        "native": "توهان ڪيئن آهيو؟",
        "roman": "Toahn kevin aaheyo?"
      },
      {
        "english": "I am fine.",
        "native": "مان ٺيڪ آهيان",
        "roman": "Maan theek aahiyaan"
      },
      {
        "english": "Where are you from?",
        "native": "توهان ڪٿان آهيو؟",
        "roman": "Toahn kithaan aaheyo?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "مان پاڪستان کان آهيان",
        "roman": "Maan Pakistan khaan aahiyaan"
      },
      {
        "english": "What are you doing?",
        "native": "توهان ڇا ڪري رهيا آهيو؟",
        "roman": "Toahn chha kari rahiya aaheyo?"
      },
      {
        "english": "I don't understand.",
        "native": "مون کي سمجهه ۾ نه آيو",
        "roman": "Moon khe samajh mein na aayo"
      },
      {
        "english": "Please speak slowly.",
        "native": "آهستي ڳالهايو",
        "roman": "Aahisti gaalhayo"
      },
      {
        "english": "Can you help me?",
        "native": "ڇا توهان منهنجي مدد ڪري سگهو ٿا؟",
        "roman": "Chha toahn munhinji madad kari sagho tha?"
      },
      {
        "english": "How much is this?",
        "native": "هي ڪيترو آهي؟",
        "roman": "Hee kitro aahe?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار ڪٿي آهي؟",
        "roman": "Bazaar kithe aahe?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانو ڪٿي آهي؟",
        "roman": "Ghusal khano kithe aahe?"
      },
      {
        "english": "I am hungry.",
        "native": "مون کي بک لڳي آهي",
        "roman": "Moon khe bukh lagi aahe"
      },
      {
        "english": "I am thirsty.",
        "native": "مون کي اُڃ لڳي آهي",
        "roman": "Moon khe unjh lagi aahe"
      },
      {
        "english": "I like this.",
        "native": "مون کي هي پسند آهي",
        "roman": "Moon khe hee pasand aahe"
      },
      {
        "english": "I don't like this.",
        "native": "مون کي هي پسند ناهي",
        "roman": "Moon khe hee pasand naahe"
      },
      {
        "english": "What time is it?",
        "native": "وقت ڪيترو ٿيو آهي؟",
        "roman": "Waqt kiitro thyo aahe?"
      },
      {
        "english": "I love you.",
        "native": "مان توسان پيار ڪريان ٿو",
        "roman": "Maan tosaan pyar karyan tho"
      },
      {
        "english": "See you tomorrow.",
        "native": "سڀاڻي ملنداسين",
        "roman": "Sabhaani mildaseen"
      },
      {
        "english": "Congratulations!",
        "native": "مبارڪ هجي!",
        "roman": "Mubarak hujay!"
      },
      {
        "english": "Happy Eid.",
        "native": "عيد مبارڪ",
        "roman": "Eid Mubarak"
      }
    ]
  },
  "Pashto": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "سهار مو پخير",
        "roman": "Sahar Mo Pa Khair"
      },
      {
        "english": "Good Afternoon",
        "native": "غرمه مو پخير",
        "roman": "Ghrma Mo Pa Khair"
      },
      {
        "english": "Good Evening",
        "native": "ماښام مو پخير",
        "roman": "Maasham Mo Pa Khair"
      },
      {
        "english": "Good Night",
        "native": "شپه مو پخير",
        "roman": "Shpa Mo Pa Khair"
      },
      {
        "english": "Welcome",
        "native": "ښه راغلاست",
        "roman": "Kha Raghlast"
      },
      {
        "english": "Goodbye",
        "native": "په امان د خدای",
        "roman": "Pa Aman Da Khuday"
      },
      {
        "english": "Thank You",
        "native": "مننه",
        "roman": "Manana"
      },
      {
        "english": "Please",
        "native": "مهرباني وکړئ",
        "roman": "Mehrabani Wakrai"
      },
      {
        "english": "Sorry",
        "native": "بښنه غواړم",
        "roman": "Bakhana Ghwaram"
      },
      {
        "english": "Yes",
        "native": "هو",
        "roman": "Ho"
      },
      {
        "english": "No",
        "native": "نه",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "بيا به وينو",
        "roman": "Beya ba wino"
      },
      {
        "english": "Nice To Meet You",
        "native": "له تاسو سره خوشحاله شوم",
        "roman": "Le taso sara khushala shwom"
      },
      {
        "english": "Take Care",
        "native": "خیال ساتئ",
        "roman": "Khayal saatai"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "يو",
        "roman": "Yaw"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دوه",
        "roman": "Dwa"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "درې",
        "roman": "Dre"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "څلور",
        "roman": "Tsalor"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنځه",
        "roman": "Pindza"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "شپږ",
        "roman": "Shpag"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "اووه",
        "roman": "Owa"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اته",
        "roman": "Ata"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نهه",
        "roman": "Nuh"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "لس",
        "roman": "Las"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "یوولس",
        "roman": "Yawolas"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "دولس",
        "roman": "Dolas"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "دیارلس",
        "roman": "Diyarlas"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "څوارلس",
        "roman": "Tsawarlas"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پنځلس",
        "roman": "Pindzlas"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "شپاړس",
        "roman": "Shpaaras"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "اووه لس",
        "roman": "Awlas"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "اتلس",
        "roman": "Atlas"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "نولس",
        "roman": "Nawlas"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "شل",
        "roman": "Shil"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "سړی",
          "roman": "Sarray"
        },
        {
          "english": "Woman",
          "native": "ښځه",
          "roman": "Khaza"
        },
        {
          "english": "Boy",
          "native": "هلک",
          "roman": "Halak"
        },
        {
          "english": "Girl",
          "native": "نجلۍ",
          "roman": "Njoolai"
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom"
        },
        {
          "english": "Friend",
          "native": "ملگری",
          "roman": "Malgaray"
        },
        {
          "english": "Mother",
          "native": "مور",
          "roman": "Mor"
        },
        {
          "english": "Father",
          "native": "پلار",
          "roman": "Plaar"
        },
        {
          "english": "Brother",
          "native": "ورور",
          "roman": "Wror"
        },
        {
          "english": "Sister",
          "native": "خور",
          "roman": "Khor"
        },
        {
          "english": "Grandfather",
          "native": "نیکه",
          "roman": "Nikeh"
        },
        {
          "english": "Grandmother",
          "native": "انا",
          "roman": "Anaa"
        },
        {
          "english": "Son",
          "native": "زوی",
          "roman": "Zoy"
        },
        {
          "english": "Daughter",
          "native": "لور",
          "roman": "Lur"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "موټر",
          "roman": "Motar"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشا",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سايکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موټرسايکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "لار",
          "roman": "Laar"
        },
        {
          "english": "Vehicle",
          "native": "موټر",
          "roman": "Motar"
        },
        {
          "english": "Train",
          "native": "اورګاډی",
          "roman": "Aurgaray"
        },
        {
          "english": "Airplane",
          "native": "الوتکه",
          "roman": "Alwatka"
        },
        {
          "english": "Boat",
          "native": "کشتۍ",
          "roman": "Kashti"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "خواړه",
          "roman": "Khwara"
        },
        {
          "english": "Water",
          "native": "اوبه",
          "roman": "Oba"
        },
        {
          "english": "Tea",
          "native": "چای",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "شيدې",
          "roman": "Shide"
        },
        {
          "english": "Bread",
          "native": "ډوډۍ",
          "roman": "Doday"
        },
        {
          "english": "Rice",
          "native": "وريجې",
          "roman": "Wrijay"
        },
        {
          "english": "Meat",
          "native": "غوښه",
          "roman": "Ghwakha"
        },
        {
          "english": "Fruit",
          "native": "مېوه",
          "roman": "Mewa"
        },
        {
          "english": "Vegetable",
          "native": "سابه",
          "roman": "Saba"
        },
        {
          "english": "Sugar",
          "native": "بوره",
          "roman": "Bora"
        },
        {
          "english": "Salt",
          "native": "مالګه",
          "roman": "Malga"
        },
        {
          "english": "Egg",
          "native": "هګۍ",
          "roman": "Hagai"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "کور",
          "roman": "Kor"
        },
        {
          "english": "School",
          "native": "ښوونځی",
          "roman": "Skhwonzay"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "روغتون",
          "roman": "Roghtoon"
        },
        {
          "english": "Mosque",
          "native": "جومات",
          "roman": "Jumaat"
        },
        {
          "english": "Shop",
          "native": "دوکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "کلی",
          "roman": "Kali"
        },
        {
          "english": "City",
          "native": "ښار",
          "roman": "Khaar"
        },
        {
          "english": "River",
          "native": "سیند",
          "roman": "Sind"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازه",
          "roman": "Darwaza"
        },
        {
          "english": "Chair",
          "native": "څوکۍ",
          "roman": "Tsokai"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کالي",
          "roman": "Kaali"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بګ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "کټ",
          "roman": "Katt"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "راشه",
          "roman": "Raasha"
        },
        {
          "english": "Go",
          "native": "لاړ شه",
          "roman": "Laar Sha"
        },
        {
          "english": "Eat",
          "native": "وخوره",
          "roman": "Wakhora"
        },
        {
          "english": "Drink",
          "native": "وڅښه",
          "roman": "Watskha"
        },
        {
          "english": "Sit",
          "native": "کښېنه",
          "roman": "Kshena"
        },
        {
          "english": "Stand",
          "native": "ودرېږه",
          "roman": "Wadrega"
        },
        {
          "english": "Stop",
          "native": "ودرېږه",
          "roman": "Dreega"
        },
        {
          "english": "Help",
          "native": "مرسته",
          "roman": "Marasta"
        },
        {
          "english": "Good",
          "native": "ښه",
          "roman": "Kha"
        },
        {
          "english": "Bad",
          "native": "بد",
          "roman": "Bad"
        },
        {
          "english": "Big",
          "native": "لوی",
          "roman": "Loy"
        },
        {
          "english": "Small",
          "native": "وړوکی",
          "roman": "Warokay"
        },
        {
          "english": "Today",
          "native": "نن",
          "roman": "Nun"
        },
        {
          "english": "Tomorrow",
          "native": "سبا",
          "roman": "Sabaa"
        },
        {
          "english": "Here",
          "native": "دلته",
          "roman": "Dalta"
        },
        {
          "english": "There",
          "native": "هلته",
          "roman": "Halta"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "ستا نوم څه دی؟",
        "roman": "Sta noom tsa dai?"
      },
      {
        "english": "My name is...",
        "native": "زما نوم ... دی",
        "roman": "Zma noom ... dai"
      },
      {
        "english": "How are you?",
        "native": "ته څنګه یې؟",
        "roman": "Ta tsanga ye?"
      },
      {
        "english": "I am fine.",
        "native": "زه ښه یم",
        "roman": "Za kha yam"
      },
      {
        "english": "Where are you from?",
        "native": "ته له کومه ځای څخه یې؟",
        "roman": "Ta la koma zay tskha ye?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "زه له پاکستانه یم",
        "roman": "Za la Pakistana yam"
      },
      {
        "english": "What are you doing?",
        "native": "ته څه کوې؟",
        "roman": "Ta tsa kawe?"
      },
      {
        "english": "I don't understand.",
        "native": "زما پوهه نشوه",
        "roman": "Zma poha nashwa"
      },
      {
        "english": "Please speak slowly.",
        "native": "په آهسته ووایه",
        "roman": "Pa aahista wawaya"
      },
      {
        "english": "Can you help me?",
        "native": "ایا ته زما مرسته کولی شې؟",
        "roman": "Aya ta zma marasta kawali she?"
      },
      {
        "english": "How much is this?",
        "native": "دا څومره دی؟",
        "roman": "Da tsomra dai?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار چیرته دی؟",
        "roman": "Bazaar cherta dai?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "تشناب چیرته دی؟",
        "roman": "Tashnaab cherta dai?"
      },
      {
        "english": "I am hungry.",
        "native": "زه وږی یم",
        "roman": "Za wagay yam"
      },
      {
        "english": "I am thirsty.",
        "native": "زه تږی یم",
        "roman": "Za tagay yam"
      },
      {
        "english": "I like this.",
        "native": "دا زما خوښ دی",
        "roman": "Da zma khwakh dai"
      },
      {
        "english": "I don't like this.",
        "native": "دا زما خوښ نه دی",
        "roman": "Da zma khwakh na dai"
      },
      {
        "english": "What time is it?",
        "native": "اوس څو بجی دی؟",
        "roman": "Os tso bajai di?"
      },
      {
        "english": "I love you.",
        "native": "زه له تاسو سره مینه لرم",
        "roman": "Za le taso sara mina lram"
      },
      {
        "english": "See you tomorrow.",
        "native": "سبا به وینو",
        "roman": "Sabaa ba wino"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک شه!",
        "roman": "Mubarak sha!"
      },
      {
        "english": "Happy Eid.",
        "native": "اختر مو مبارک",
        "roman": "Akhtar mo mubarak"
      }
    ]
  },
  "Saraiki": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair"
      },
      {
        "english": "Good Afternoon",
        "native": "ڈُپہر بخیر",
        "roman": "Dupahir Bakhair"
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair"
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair"
      },
      {
        "english": "Welcome",
        "native": "ست بسم اللہ",
        "roman": "Sat Bismillah",
        "note": "Traditional Saraiki welcome greeting"
      },
      {
        "english": "Goodbye",
        "native": "الله حافظ",
        "roman": "Allah Hafiz"
      },
      {
        "english": "Thank You",
        "native": "مہربانی",
        "roman": "Meharbani"
      },
      {
        "english": "Please",
        "native": "مہربانی کریندے",
        "roman": "Meharbani Karinde"
      },
      {
        "english": "Sorry",
        "native": "معاف کرین",
        "roman": "Maaf Karin"
      },
      {
        "english": "Yes",
        "native": "ہاں",
        "roman": "Haan"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "فیر ملاں گے",
        "roman": "Fer Milange",
        "note": "Commonly shared with spoken Punjabi/Urdu forms"
      },
      {
        "english": "Nice To Meet You",
        "native": "تہاڈے نال مل کے خوشی تھئی",
        "roman": "Tuhade naal mil ke khushi thai"
      },
      {
        "english": "Take Care",
        "native": "پنڈا خیال رکھیو",
        "roman": "Apna khayal rakhio",
        "note": "Commonly shared spoken form"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "اک",
        "roman": "Ik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "ڈوہ",
        "roman": "Doh"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "ٹے",
        "roman": "Tray"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنج",
        "roman": "Panj"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "چھے",
        "roman": "Chhe"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ست",
        "roman": "Sat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اٹھ",
        "roman": "Ath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نوں",
        "roman": "Naun"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "ڈہ",
        "roman": "Dah"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "گیارہ",
        "roman": "Gyarah",
        "note": "Regional variation exists"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "بارہ",
        "roman": "Baarah",
        "note": "Regional variation exists"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تیرہ",
        "roman": "Terah",
        "note": "Regional variation exists"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چودہ",
        "roman": "Chaudah",
        "note": "Regional variation exists"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پندرہ",
        "roman": "Pandrah",
        "note": "Regional variation exists"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "سولہ",
        "roman": "Solah",
        "note": "Regional variation exists"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "سترہ",
        "roman": "Satrah",
        "note": "Regional variation exists"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "اٹھارہ",
        "roman": "Athaarah",
        "note": "Regional variation exists"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "اُنی",
        "roman": "Unni",
        "note": "Regional variation exists"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "ویہہ",
        "roman": "Veeh",
        "note": "Regional variation exists"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "بندہ",
          "roman": "Banda"
        },
        {
          "english": "Woman",
          "native": "نار",
          "roman": "Naar",
          "note": "Regional variation exists"
        },
        {
          "english": "Boy",
          "native": "منڈا",
          "roman": "Munda"
        },
        {
          "english": "Girl",
          "native": "نکڑی",
          "roman": "Nikri",
          "note": "Regional variation exists"
        },
        {
          "english": "Child",
          "native": "نِکا",
          "roman": "Nikka"
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar"
        },
        {
          "english": "Mother",
          "native": "اَمّاں",
          "roman": "Ammaan"
        },
        {
          "english": "Father",
          "native": "پیو",
          "roman": "Piyo"
        },
        {
          "english": "Brother",
          "native": "ڀاء",
          "roman": "Bhra"
        },
        {
          "english": "Sister",
          "native": "ڀین",
          "roman": "Bhein"
        },
        {
          "english": "Grandfather",
          "native": "ڈاڈا",
          "roman": "Dada"
        },
        {
          "english": "Grandmother",
          "native": "ڈاڈی",
          "roman": "Dadi"
        },
        {
          "english": "Son",
          "native": "پتر",
          "roman": "Puttar"
        },
        {
          "english": "Daughter",
          "native": "ڈھی",
          "roman": "Dhi"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستہ",
          "roman": "Rasta"
        },
        {
          "english": "Vehicle",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz"
        },
        {
          "english": "Boat",
          "native": "بیڑی",
          "roman": "Beri"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھاون",
          "roman": "Khaawan"
        },
        {
          "english": "Water",
          "native": "پاणی",
          "roman": "Paani"
        },
        {
          "english": "Tea",
          "native": "چاہ",
          "roman": "Chah"
        },
        {
          "english": "Milk",
          "native": "ڏُدھ",
          "roman": "Dudh"
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti"
        },
        {
          "english": "Rice",
          "native": "چانوَل",
          "roman": "Chawal"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "ڦل",
          "roman": "Phal"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi"
        },
        {
          "english": "Sugar",
          "native": "کھنڈ",
          "roman": "Khand"
        },
        {
          "english": "Salt",
          "native": "پھل",
          "roman": "Lun",
          "note": "Also commonly used as 'لون'"
        },
        {
          "english": "Egg",
          "native": "آنڈا",
          "roman": "Anda"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسیت",
          "roman": "Maseet"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "پنڈ",
          "roman": "Pind"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar"
        },
        {
          "english": "River",
          "native": "درياء",
          "roman": "Darya"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "در",
          "roman": "Dar"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "منجی",
          "roman": "Manji"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آ",
          "roman": "Aa"
        },
        {
          "english": "Go",
          "native": "ونج",
          "roman": "Wanj"
        },
        {
          "english": "Eat",
          "native": "کھا",
          "roman": "Kha"
        },
        {
          "english": "Drink",
          "native": "پی",
          "roman": "Pee"
        },
        {
          "english": "Sit",
          "native": "ٻہہ",
          "roman": "Bahh",
          "note": "Regional variation exists"
        },
        {
          "english": "Stand",
          "native": "اُٹھ",
          "roman": "Uth"
        },
        {
          "english": "Stop",
          "native": "ٹھہر",
          "roman": "Thehr"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "چنگا",
          "roman": "Changa"
        },
        {
          "english": "Bad",
          "native": "ماڑا",
          "roman": "Maara"
        },
        {
          "english": "Big",
          "native": "وڏا",
          "roman": "Wadda"
        },
        {
          "english": "Small",
          "native": "نکا",
          "roman": "Nikka"
        },
        {
          "english": "Today",
          "native": "اَج",
          "roman": "Aj"
        },
        {
          "english": "Tomorrow",
          "native": "کلھ",
          "roman": "Kallh"
        },
        {
          "english": "Here",
          "native": "ایتھاں",
          "roman": "Ethaan"
        },
        {
          "english": "There",
          "native": "اوتھاں",
          "roman": "Othaan"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "تیڈا نام کیا ہے؟",
        "roman": "Teda naam kya hai?"
      },
      {
        "english": "My name is...",
        "native": "میڈا نام ... ہے",
        "roman": "Meda naam ... hai"
      },
      {
        "english": "How are you?",
        "native": "تُوں کیویں ایں؟",
        "roman": "Tu kiven ain?"
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک آں",
        "roman": "Main theek aan"
      },
      {
        "english": "Where are you from?",
        "native": "تُوں کتھوں ایں؟",
        "roman": "Tu kithon ain?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان کنوں آں",
        "roman": "Main Pakistan kanon aan"
      },
      {
        "english": "What are you doing?",
        "native": "تُوں کیا کر رہا ایں؟",
        "roman": "Tu kya kar riha ain?"
      },
      {
        "english": "I don't understand.",
        "native": "میکوں سمجھ نہ آئی",
        "roman": "Mainu samajh na aayi"
      },
      {
        "english": "Please speak slowly.",
        "native": "ہولے ہولے گل کر",
        "roman": "Hole hole gal kar"
      },
      {
        "english": "Can you help me?",
        "native": "کیا تُوں میڈی مدد کر سکنا ایں؟",
        "roman": "Kya tu medi madad kar sakna ain?"
      },
      {
        "english": "How much is this?",
        "native": "ایہ کتنے دا ہے؟",
        "roman": "Eh kitne da hai?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کتھے ہے؟",
        "roman": "Bazaar kithe hai?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانہ کتھے ہے؟",
        "roman": "Ghusal khana kithe hai?"
      },
      {
        "english": "I am hungry.",
        "native": "میکوں بھُک لگی ہے",
        "roman": "Mainu bhukh lagi hai"
      },
      {
        "english": "I am thirsty.",
        "native": "میکوں پیاس لگی ہے",
        "roman": "Mainu pyaas lagi hai"
      },
      {
        "english": "I like this.",
        "native": "میکوں ایہ چنگا لگدا ہے",
        "roman": "Mainu eh changa lagda hai"
      },
      {
        "english": "I don't like this.",
        "native": "میکوں ایہ چنگا نہ لگے",
        "roman": "Mainu eh changa na lage"
      },
      {
        "english": "What time is it?",
        "native": "ہُن ڈا ویلا کیا تھئے؟",
        "roman": "Hun da vela kya thai?"
      },
      {
        "english": "I love you.",
        "native": "میں تہاڈے نال پیار کریندا آں",
        "roman": "Main tuhade naal pyar karenda aan"
      },
      {
        "english": "See you tomorrow.",
        "native": "کلھ ملاں گے",
        "roman": "Kallh milange"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہووے!",
        "roman": "Mubarak hovay!"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak"
      }
    ],
    "dialect_note": "Saraiki vocabulary shows real regional variation across Multan, Dera Ghazi Khan, Bahawalpur and Mianwali. The forms below reflect commonly documented Multani Saraiki; some items are marked where variation is especially notable."
  },
  "Kashmiri": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "مہربانی",
        "roman": "Meharbani"
      },
      {
        "english": "Please",
        "native": "مہربانی کرو",
        "roman": "Meharbani Karo"
      },
      {
        "english": "Sorry",
        "native": "معاف کریو",
        "roman": "Maaf Kariv"
      },
      {
        "english": "Yes",
        "native": "آہا",
        "roman": "Aaha"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Nice To Meet You",
        "native": "توہہ سیتہ ملتھ خوشی گیہ",
        "roman": "Tohi seeth milith khushi gayi",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیو",
        "roman": "Apna khayal rakhio",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "اکھ",
        "roman": "Akh"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "زہ",
        "roman": "Zah"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "تریہ",
        "roman": "Treh"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "ژور",
        "roman": "Tsoor"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پانژ",
        "roman": "Paantsh"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "شہٕ",
        "roman": "Sheh"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ستہ",
        "roman": "Satah"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "آٹھ",
        "roman": "Aath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نَو",
        "roman": "Nav"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "دَہ",
        "roman": "Dah"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "کاہ",
        "roman": "Kah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "تروہ",
        "roman": "Truvah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تراوہ",
        "roman": "Trawah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "ژودہ",
        "roman": "Tsudah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پاندہ",
        "roman": "Pandah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "شورہ",
        "roman": "Shurah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "ستہ",
        "roman": "Sattah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "ارادہ",
        "roman": "Aradah",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "کنوہ",
        "roman": "Kunavuh",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "وہ",
        "roman": "Vuh",
        "note": "Needs native-speaker verification"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "آدمی",
          "roman": "Aadmi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Woman",
          "native": "زنانہ",
          "roman": "Zanana",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Boy",
          "native": "نیچُک",
          "roman": "Nyichuk",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Girl",
          "native": "کور",
          "roman": "Kuur"
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Mother",
          "native": "مۆج",
          "roman": "Moj"
        },
        {
          "english": "Father",
          "native": "مول",
          "roman": "Mol"
        },
        {
          "english": "Brother",
          "native": "بوی",
          "roman": "Boy",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sister",
          "native": "بہین",
          "roman": "Behn",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Grandfather",
          "native": "بابا",
          "roman": "Baaba",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "بوڈی",
          "roman": "Boddi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Son",
          "native": "نیچُک",
          "roman": "Nyichuk",
          "note": "Same term as 'Boy'; needs native-speaker verification"
        },
        {
          "english": "Daughter",
          "native": "کور",
          "roman": "Kuur"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستہ",
          "roman": "Rasta",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Boat",
          "native": "ہور",
          "roman": "Hor",
          "note": "Needs native-speaker verification"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Water",
          "native": "آب",
          "roman": "Aab"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "دودھ",
          "roman": "Doodh",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bread",
          "native": "چوٹ",
          "roman": "Tsot",
          "note": "Kashmiri bread; needs native-speaker verification"
        },
        {
          "english": "Rice",
          "native": "تومُل",
          "roman": "Tomul"
        },
        {
          "english": "Meat",
          "native": "موٹھ",
          "roman": "Moth",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Fruit",
          "native": "میوہ",
          "roman": "Mewa",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sugar",
          "native": "شکر",
          "roman": "Shakar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Salt",
          "native": "نُن",
          "roman": "Nun"
        },
        {
          "english": "Egg",
          "native": "تھَل",
          "roman": "Thal",
          "note": "Needs native-speaker verification"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "گاٮ‍وں",
          "roman": "Gaon",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "River",
          "native": "دریاو",
          "roman": "Daryav"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازہ",
          "roman": "Darwaza",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bed",
          "native": "پلنگ",
          "roman": "Palang",
          "note": "Needs native-speaker verification"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "اے یو",
          "roman": "Ayo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Go",
          "native": "گژھ",
          "roman": "Gatsh",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Eat",
          "native": "کھاؤ",
          "roman": "Khao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Drink",
          "native": "پیو",
          "roman": "Piyo",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sit",
          "native": "بیٹھو",
          "roman": "Baitho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stand",
          "native": "کھڑے ہو",
          "roman": "Khare Ho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Good",
          "native": "اچھا",
          "roman": "Acha",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Big",
          "native": "بڑا",
          "roman": "Bara",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Small",
          "native": "چھوٹا",
          "roman": "Chota",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Today",
          "native": "اَز",
          "roman": "Az"
        },
        {
          "english": "Tomorrow",
          "native": "پگاہ",
          "roman": "Pagah",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Here",
          "native": "یتی",
          "roman": "Yati"
        },
        {
          "english": "There",
          "native": "تتی",
          "roman": "Tati"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "توہند ناو کیاہ چھُ؟",
        "roman": "Tohand naav kyah chhu?"
      },
      {
        "english": "My name is...",
        "native": "میوں ناو ... چھُ",
        "roman": "Myon naav ... chhu"
      },
      {
        "english": "How are you?",
        "native": "توہی کیتھ چھِوا؟",
        "roman": "Tohi kyath chhiva?"
      },
      {
        "english": "I am fine.",
        "native": "بہٕ ٹھیک چھُس",
        "roman": "Bah theek chhus"
      },
      {
        "english": "Where are you from?",
        "native": "توہی کتیو چھِوا؟",
        "roman": "Tohi katyo chhiva?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "بہٕ پاکستانہٕ چھُس",
        "roman": "Bah Pakistanah chhus"
      },
      {
        "english": "What are you doing?",
        "native": "توہی کیاہ کرِوا چھِوا؟",
        "roman": "Tohi kyah kariva chhiva?"
      },
      {
        "english": "I don't understand.",
        "native": "بہٕ نہ سمجھ آو",
        "roman": "Bah na samajh aav"
      },
      {
        "english": "Please speak slowly.",
        "native": "مہربانی کرِتھ ہولی وول",
        "roman": "Meharbani karith holi wol"
      },
      {
        "english": "Can you help me?",
        "native": "کیاہ توہی میہند مدد کرِو سکیوا؟",
        "roman": "Kyah tohi mihand madad kariv sakyova?"
      },
      {
        "english": "How much is this?",
        "native": "یہ کتاہ چھُ؟",
        "roman": "Yeh kataah chhu?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کتیو چھُ؟",
        "roman": "Bazaar katyo chhu?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانہ کتیو چھُ؟",
        "roman": "Ghusal khana katyo chhu?"
      },
      {
        "english": "I am hungry.",
        "native": "بہٕ بوچھ چھُس",
        "roman": "Bah bochh chhus"
      },
      {
        "english": "I am thirsty.",
        "native": "بہٕ تراش چھُس",
        "roman": "Bah traash chhus"
      },
      {
        "english": "I like this.",
        "native": "یہ میہند پسند چھُ",
        "roman": "Yeh mihand pasand chhu"
      },
      {
        "english": "I don't like this.",
        "native": "یہ میہند پسند نہ چھُ",
        "roman": "Yeh mihand pasand na chhu"
      },
      {
        "english": "What time is it?",
        "native": "اوس کیاہ ویلہ چھُ؟",
        "roman": "Wus kyah wela chhu?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I love you.",
        "native": "بہٕ کرم چھُس تہٕ محبت",
        "roman": "Bah karim chhus tuh mohabbat",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "See you tomorrow.",
        "native": "پگاہ ملیو",
        "roman": "Pagah milyo",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک باد!",
        "roman": "Mubarak baad!",
        "note": "Commonly shared Urdu form"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "dialect_note": "Kashmiri as spoken by communities in Pakistan (Azad Kashmir / Neelum Valley) shows regional variation from the standard Kashmir Valley dialect, which has the most linguistic documentation. Core numerals and a few kinship terms below are native Kashmiri; several everyday-vocabulary items are commonly rendered in the shared Urdu form used in daily speech (marked with a note) rather than a guessed native form."
  },
  "Hindko": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair"
      },
      {
        "english": "Good Afternoon",
        "native": "ڈوپہر بخیر",
        "roman": "Dupahir Bakhair"
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair"
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair"
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed"
      },
      {
        "english": "Goodbye",
        "native": "الله حافظ",
        "roman": "Allah Hafiz"
      },
      {
        "english": "Thank You",
        "native": "مہربانی",
        "roman": "Meharbani"
      },
      {
        "english": "Please",
        "native": "مہربانی کرکے",
        "roman": "Meharbani Karke"
      },
      {
        "english": "Sorry",
        "native": "معافی",
        "roman": "Maafi"
      },
      {
        "english": "Yes",
        "native": "ہاں",
        "roman": "Haan"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "فیر ملاں گے",
        "roman": "Fer Milange"
      },
      {
        "english": "Nice To Meet You",
        "native": "تہاڈے نال مل کے خوشی ہوئی",
        "roman": "Tuhade naal mil ke khushi hoi"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیو",
        "roman": "Apna khayal rakhio"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "اک",
        "roman": "Ik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دو",
        "roman": "Do"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "تن",
        "roman": "Tin"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنج",
        "roman": "Panj"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "چھ",
        "roman": "Chhi"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ست",
        "roman": "Sat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اٹھ",
        "roman": "Ath"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نو",
        "roman": "Nau"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "ڈھا",
        "roman": "Dha"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "گیارہ",
        "roman": "Gyarah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "بارہ",
        "roman": "Baarah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "تیرہ",
        "roman": "Terah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چودہ",
        "roman": "Chaudah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پندرہ",
        "roman": "Pandrah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "سولہ",
        "roman": "Solah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "سترہ",
        "roman": "Satrah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "اٹھارہ",
        "roman": "Athaarah",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "انیس",
        "roman": "Unees",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "بیس",
        "roman": "Bees",
        "note": "Shares numeral forms with neighboring Punjabi/Potohari dialects"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "بندہ",
          "roman": "Banda"
        },
        {
          "english": "Woman",
          "native": "زنانی",
          "roman": "Zanani"
        },
        {
          "english": "Boy",
          "native": "منڈا",
          "roman": "Munda"
        },
        {
          "english": "Girl",
          "native": "کڑی",
          "roman": "Kudi"
        },
        {
          "english": "Child",
          "native": "بالک",
          "roman": "Baalak"
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar"
        },
        {
          "english": "Mother",
          "native": "اَمّاں",
          "roman": "Ammaan"
        },
        {
          "english": "Father",
          "native": "بابا",
          "roman": "Baba"
        },
        {
          "english": "Brother",
          "native": "ویر",
          "roman": "Veer"
        },
        {
          "english": "Sister",
          "native": "بھین",
          "roman": "Bhein"
        },
        {
          "english": "Grandfather",
          "native": "بابا",
          "roman": "Baba"
        },
        {
          "english": "Grandmother",
          "native": "ماں جی",
          "roman": "Maan Ji"
        },
        {
          "english": "Son",
          "native": "پُتر",
          "roman": "Puttar"
        },
        {
          "english": "Daughter",
          "native": "دھی",
          "roman": "Dhee"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "سڑک",
          "roman": "Sarak"
        },
        {
          "english": "Vehicle",
          "native": "گڈی",
          "roman": "Gaddi"
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz"
        },
        {
          "english": "Boat",
          "native": "بیڑی",
          "roman": "Beri"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana"
        },
        {
          "english": "Water",
          "native": "پانی",
          "roman": "Paani"
        },
        {
          "english": "Tea",
          "native": "چاہ",
          "roman": "Chah"
        },
        {
          "english": "Milk",
          "native": "دُدھ",
          "roman": "Dudh"
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti"
        },
        {
          "english": "Rice",
          "native": "چاول",
          "roman": "Chawal"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "پھل",
          "roman": "Phal"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi"
        },
        {
          "english": "Sugar",
          "native": "کھنڈ",
          "roman": "Khand"
        },
        {
          "english": "Salt",
          "native": "لُون",
          "roman": "Loon"
        },
        {
          "english": "Egg",
          "native": "آنڈا",
          "roman": "Anda"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسیت",
          "roman": "Maseet"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "پنڈ",
          "roman": "Pind"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar"
        },
        {
          "english": "River",
          "native": "دریا",
          "roman": "Darya"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "بوہا",
          "roman": "Boha"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "منجی",
          "roman": "Manji"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آ",
          "roman": "Aa"
        },
        {
          "english": "Go",
          "native": "جا",
          "roman": "Ja"
        },
        {
          "english": "Eat",
          "native": "کھا",
          "roman": "Kha"
        },
        {
          "english": "Drink",
          "native": "پی",
          "roman": "Pee"
        },
        {
          "english": "Sit",
          "native": "بہہ",
          "roman": "Bahh"
        },
        {
          "english": "Stand",
          "native": "اُٹھ",
          "roman": "Uth"
        },
        {
          "english": "Stop",
          "native": "رک",
          "roman": "Ruk"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "چنگا",
          "roman": "Changa"
        },
        {
          "english": "Bad",
          "native": "بُرا",
          "roman": "Bura"
        },
        {
          "english": "Big",
          "native": "وڈا",
          "roman": "Wadda"
        },
        {
          "english": "Small",
          "native": "نِکا",
          "roman": "Nikka"
        },
        {
          "english": "Today",
          "native": "اَج",
          "roman": "Aj"
        },
        {
          "english": "Tomorrow",
          "native": "پرسوں",
          "roman": "Bhalak",
          "note": "Also commonly said as 'کل' (Kal), shared with Urdu"
        },
        {
          "english": "Here",
          "native": "ایتھے",
          "roman": "Ethay"
        },
        {
          "english": "There",
          "native": "اوتھے",
          "roman": "Othay"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "تیرا ناں کیہ اے؟",
        "roman": "Tera naan keh ae?"
      },
      {
        "english": "My name is...",
        "native": "میرا ناں ... اے",
        "roman": "Mera naan ... ae"
      },
      {
        "english": "How are you?",
        "native": "تُوں کیویں ایں؟",
        "roman": "Tu kiven ain?"
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک آں",
        "roman": "Main theek aan"
      },
      {
        "english": "Where are you from?",
        "native": "تُوں کتھوں ایں؟",
        "roman": "Tu kithon ain?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان توں آں",
        "roman": "Main Pakistan ton aan"
      },
      {
        "english": "What are you doing?",
        "native": "تُوں کیہ کر رہا ایں؟",
        "roman": "Tu keh kar riha ain?"
      },
      {
        "english": "I don't understand.",
        "native": "میکوں سمجھ نہ آئی",
        "roman": "Mainu samajh na aayi"
      },
      {
        "english": "Please speak slowly.",
        "native": "ہولی بول",
        "roman": "Holi bol"
      },
      {
        "english": "Can you help me?",
        "native": "کیہ تُوں میری مدد کر سکدا ایں؟",
        "roman": "Keh tu meri madad kar sakda ain?"
      },
      {
        "english": "How much is this?",
        "native": "ایہ کتنے دا اے؟",
        "roman": "Eh kitne da ae?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کتھے اے؟",
        "roman": "Bazaar kithe ae?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانہ کتھے اے؟",
        "roman": "Ghusal khana kithe ae?"
      },
      {
        "english": "I am hungry.",
        "native": "میکوں بھُکھ لگی اے",
        "roman": "Mainu bhukh lagi ae"
      },
      {
        "english": "I am thirsty.",
        "native": "میکوں پیاس لگی اے",
        "roman": "Mainu pyaas lagi ae"
      },
      {
        "english": "I like this.",
        "native": "میکوں ایہ چنگا لگدا اے",
        "roman": "Mainu eh changa lagda ae"
      },
      {
        "english": "I don't like this.",
        "native": "میکوں ایہ چنگا نہیں لگدا",
        "roman": "Mainu eh changa nahi lagda"
      },
      {
        "english": "What time is it?",
        "native": "ہُن کیہڑا ویلا اے؟",
        "roman": "Hun kehda vela ae?"
      },
      {
        "english": "I love you.",
        "native": "میں تہاڈے نال پیار کریناں",
        "roman": "Main tuhade naal pyar karinaan"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملاں گے",
        "roman": "Kal milange"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہووے!",
        "roman": "Mubarak hovay!"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak"
      }
    ],
    "dialect_note": "Hindko vocabulary closely overlaps with Punjabi/Potohari and Pashto (through heavy contact in KP). Forms below reflect Peshawar/Hazara Hindko where documented."
  },
  "Balochi": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "بگاہ بخیر",
        "roman": "Bagah Bakhair"
      },
      {
        "english": "Good Afternoon",
        "native": "نیمروچ بخیر",
        "roman": "Nimroch Bakhair"
      },
      {
        "english": "Good Evening",
        "native": "بیگاہ بخیر",
        "roman": "Begah Bakhair"
      },
      {
        "english": "Good Night",
        "native": "شپ بخیر",
        "roman": "Shap Bakhair"
      },
      {
        "english": "Welcome",
        "native": "خوش آمدگ",
        "roman": "Khush Amadag"
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "تشکر",
        "roman": "Tashakor"
      },
      {
        "english": "Please",
        "native": "مہربانی بکن",
        "roman": "Meharbani Bakan"
      },
      {
        "english": "Sorry",
        "native": "بښیش کن",
        "roman": "Bakhshesh Kan"
      },
      {
        "english": "Yes",
        "native": "ہان",
        "roman": "Haan"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Na"
      },
      {
        "english": "See You Later",
        "native": "بلے ئے بہ وانتیں",
        "roman": "Bale-e ba wantin",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Nice To Meet You",
        "native": "شمَا سرا آشنا بوتگ خوش وتم",
        "roman": "Shuma sara aashna butagh khosh watam",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Take Care",
        "native": "وتی خیال بدار",
        "roman": "Wati khayal bidaar"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "یک",
        "roman": "Yak"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دو",
        "roman": "Do"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "سہ",
        "roman": "Seh"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چار",
        "roman": "Chaar"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پنچ",
        "roman": "Panch"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "شش",
        "roman": "Shash"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ہپت",
        "roman": "Haft"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "ہشت",
        "roman": "Hasht"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نہ",
        "roman": "Noh"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "دہ",
        "roman": "Dah"
      },
      {
        "number": 11,
        "english": "Eleven",
        "native": "یازدہ",
        "roman": "Yazdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect (Eastern/Western/Southern Balochi)"
      },
      {
        "number": 12,
        "english": "Twelve",
        "native": "دوازدہ",
        "roman": "Dwazdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 13,
        "english": "Thirteen",
        "native": "سیزدہ",
        "roman": "Sezdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 14,
        "english": "Fourteen",
        "native": "چاردہ",
        "roman": "Chardah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 15,
        "english": "Fifteen",
        "native": "پانزدہ",
        "roman": "Panzdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 16,
        "english": "Sixteen",
        "native": "شانزدہ",
        "roman": "Shanzdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 17,
        "english": "Seventeen",
        "native": "ہفدہ",
        "roman": "Hifdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 18,
        "english": "Eighteen",
        "native": "ہژدہ",
        "roman": "Hazhdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 19,
        "english": "Nineteen",
        "native": "نوزدہ",
        "roman": "Nozdah",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      },
      {
        "number": 20,
        "english": "Twenty",
        "native": "بیست",
        "roman": "Bist",
        "note": "Documented in Balochi reference grammars; forms may vary by dialect"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "مرد",
          "roman": "Mard"
        },
        {
          "english": "Woman",
          "native": "جن",
          "roman": "Jan"
        },
        {
          "english": "Boy",
          "native": "زاہگ",
          "roman": "Zaahag",
          "note": "General term used for a young child/boy; gendered vocabulary varies by dialect"
        },
        {
          "english": "Girl",
          "native": "جنک",
          "roman": "Janik"
        },
        {
          "english": "Child",
          "native": "بچک",
          "roman": "Bachak"
        },
        {
          "english": "Friend",
          "native": "دوست",
          "roman": "Dost"
        },
        {
          "english": "Mother",
          "native": "ماس",
          "roman": "Maat"
        },
        {
          "english": "Father",
          "native": "پت",
          "roman": "Pit"
        },
        {
          "english": "Brother",
          "native": "براس",
          "roman": "Braas"
        },
        {
          "english": "Sister",
          "native": "گوہار",
          "roman": "Gohar"
        },
        {
          "english": "Grandfather",
          "native": "پپّک",
          "roman": "Pappak",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "ماماگ",
          "roman": "Mamaag",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Son",
          "native": "پس",
          "roman": "Pus"
        },
        {
          "english": "Daughter",
          "native": "دوگ",
          "roman": "Dukht",
          "note": "Needs native-speaker verification"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "موٹر",
          "roman": "Motor"
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشا",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "راہ",
          "roman": "Raah"
        },
        {
          "english": "Vehicle",
          "native": "موٹر",
          "roman": "Motor"
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Boat",
          "native": "بیلم",
          "roman": "Belam",
          "note": "Needs native-speaker verification"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "وراک",
          "roman": "Waraak"
        },
        {
          "english": "Water",
          "native": "آپ",
          "roman": "Aap"
        },
        {
          "english": "Tea",
          "native": "چای",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "شیر",
          "roman": "Sheer"
        },
        {
          "english": "Bread",
          "native": "نان",
          "roman": "Naan"
        },
        {
          "english": "Rice",
          "native": "برنج",
          "roman": "Birinj"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht"
        },
        {
          "english": "Fruit",
          "native": "میوگ",
          "roman": "Mewag"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi"
        },
        {
          "english": "Sugar",
          "native": "شکر",
          "roman": "Shakar"
        },
        {
          "english": "Salt",
          "native": "نمک",
          "roman": "Namak"
        },
        {
          "english": "Egg",
          "native": "ہیگ",
          "roman": "Haig",
          "note": "Needs native-speaker verification"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "کہل",
          "roman": "Kahal"
        },
        {
          "english": "School",
          "native": "اسکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسیت",
          "roman": "Maseet"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "ہل",
          "roman": "Hall",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shahr"
        },
        {
          "english": "River",
          "native": "رود",
          "roman": "Rod"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "در",
          "roman": "Dar"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "جامگ",
          "roman": "Jaamag"
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag"
        },
        {
          "english": "Bed",
          "native": "کت",
          "roman": "Katt",
          "note": "Needs native-speaker verification"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "بیا",
          "roman": "Biya"
        },
        {
          "english": "Go",
          "native": "برو",
          "roman": "Bero"
        },
        {
          "english": "Eat",
          "native": "بوَر",
          "roman": "Bwar"
        },
        {
          "english": "Drink",
          "native": "بوش",
          "roman": "Bosh"
        },
        {
          "english": "Sit",
          "native": "بنیش",
          "roman": "Banesh"
        },
        {
          "english": "Stand",
          "native": "ورگر",
          "roman": "Wargir",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Stop",
          "native": "وست",
          "roman": "Wast",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad"
        },
        {
          "english": "Good",
          "native": "باش",
          "roman": "Baash"
        },
        {
          "english": "Bad",
          "native": "بد",
          "roman": "Bad"
        },
        {
          "english": "Big",
          "native": "گوران",
          "roman": "Gwaran"
        },
        {
          "english": "Small",
          "native": "کسان",
          "roman": "Kasaan"
        },
        {
          "english": "Today",
          "native": "اَشی",
          "roman": "Ashi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Tomorrow",
          "native": "بانگی",
          "roman": "Baangi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Here",
          "native": "اِدر",
          "roman": "Idar"
        },
        {
          "english": "There",
          "native": "اودر",
          "roman": "Odar"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "تئی نام چہ ئنت؟",
        "roman": "Tei naam che ant?"
      },
      {
        "english": "My name is...",
        "native": "منی نام ... انت",
        "roman": "Mani naam ... ant"
      },
      {
        "english": "How are you?",
        "native": "تو چون ئے؟",
        "roman": "To chon e?"
      },
      {
        "english": "I am fine.",
        "native": "من باش آں",
        "roman": "Man baash aan"
      },
      {
        "english": "Where are you from?",
        "native": "تو کجا ءِ؟",
        "roman": "To kaja e?"
      },
      {
        "english": "I am from Pakistan.",
        "native": "من پاکستان ءَ آں",
        "roman": "Man Pakistan a aan"
      },
      {
        "english": "What are you doing?",
        "native": "تو چہ کن ئے؟",
        "roman": "To che kan e?"
      },
      {
        "english": "I don't understand.",
        "native": "منا نہ فہم بوت",
        "roman": "Mana na fahm but"
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستگی گپ بکن",
        "roman": "Ahestagi gap bakan"
      },
      {
        "english": "Can you help me?",
        "native": "تو منی مدد کورتین؟",
        "roman": "To mani madad korten?"
      },
      {
        "english": "How much is this?",
        "native": "اے چند انت؟",
        "roman": "Ay chand ant?"
      },
      {
        "english": "Where is the market?",
        "native": "بازار کجا انت؟",
        "roman": "Bazaar kaja ant?"
      },
      {
        "english": "Where is the bathroom?",
        "native": "غسل خانہ کجا انت؟",
        "roman": "Ghusal khana kaja ant?"
      },
      {
        "english": "I am hungry.",
        "native": "من گشنگ آں",
        "roman": "Man gushnag aan"
      },
      {
        "english": "I am thirsty.",
        "native": "من تشنگ آں",
        "roman": "Man tishnag aan"
      },
      {
        "english": "I like this.",
        "native": "اے منا خوش انت",
        "roman": "Ay mana khosh ant"
      },
      {
        "english": "I don't like this.",
        "native": "اے منا خوش نہ انت",
        "roman": "Ay mana khosh na ant"
      },
      {
        "english": "What time is it?",
        "native": "چہ وخت اِنت؟",
        "roman": "Che wakht int?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I love you.",
        "native": "من تئی سرا مہر کنان",
        "roman": "Man tai sara mehr kanaan",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "See you tomorrow.",
        "native": "بانگی بہ وانتیں",
        "roman": "Baangi ba wantin",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک بیت!",
        "roman": "Mubarak bait!"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak"
      }
    ]
  },
  "Shina": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "شکریہ",
        "roman": "Shukriya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please",
        "native": "مہربانی",
        "roman": "Meharbani",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Sorry",
        "native": "معافی",
        "roman": "Maafi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Yes",
        "native": "اَہاں",
        "roman": "Ahaan"
      },
      {
        "english": "No",
        "native": "آ نہ",
        "roman": "Aa Na"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Nice To Meet You",
        "native": "آپ سے مل کر خوشی ہوئی",
        "roman": "Aap se mil kar khushi hui",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیں",
        "roman": "Apna khayal rakhein",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "ایک",
        "roman": "Ek"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "دو",
        "roman": "Doo"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "جا",
        "roman": "Ja"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "چو",
        "roman": "Tso"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پونج",
        "roman": "Poonj",
        "note": "Numerals are cited from linguistic reference sources; pronunciation varies by valley — recommend native-speaker confirmation"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "شو",
        "roman": "Sho"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "ست",
        "roman": "Sat"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اَشٹ",
        "roman": "Asht"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نو",
        "roman": "Nu"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "دیی",
        "roman": "Dyi"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "مانوش",
          "roman": "Manush",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Woman",
          "native": "گَشے",
          "roman": "Gushe",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Boy",
          "native": "پُتر",
          "roman": "Putr"
        },
        {
          "english": "Girl",
          "native": "ژیی",
          "roman": "Zhi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Mother",
          "native": "مو",
          "roman": "Mo"
        },
        {
          "english": "Father",
          "native": "باپ",
          "roman": "Baap",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Brother",
          "native": "بوئے",
          "roman": "Boi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sister",
          "native": "سے",
          "roman": "Se",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandfather",
          "native": "بابو",
          "roman": "Babo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "دادی",
          "roman": "Dadi",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Son",
          "native": "پُتر",
          "roman": "Putr"
        },
        {
          "english": "Daughter",
          "native": "ژی",
          "roman": "Zhi",
          "note": "Needs native-speaker verification"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستہ",
          "roman": "Rasta",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Boat",
          "native": "کشتی",
          "roman": "Kashti",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Water",
          "native": "وئی",
          "roman": "Vai",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "دودھ",
          "roman": "Doodh",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Rice",
          "native": "براس",
          "roman": "Braas",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Fruit",
          "native": "میوہ",
          "roman": "Mewa",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sugar",
          "native": "چینی",
          "roman": "Cheeni",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Salt",
          "native": "لون",
          "roman": "Lun",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Egg",
          "native": "انڈا",
          "roman": "Anda",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "گاؤں",
          "roman": "Gaon",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "River",
          "native": "سیندھ",
          "roman": "Sindh",
          "note": "Needs native-speaker verification"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازہ",
          "roman": "Darwaza",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bed",
          "native": "بستر",
          "roman": "Bistar",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آؤ",
          "roman": "Aao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Go",
          "native": "جاؤ",
          "roman": "Jao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Eat",
          "native": "کھاؤ",
          "roman": "Khao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Drink",
          "native": "پیو",
          "roman": "Piyo",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sit",
          "native": "بیٹھو",
          "roman": "Baitho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stand",
          "native": "کھڑے ہو",
          "roman": "Khare Ho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Good",
          "native": "اچھا",
          "roman": "Acha",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Big",
          "native": "بڑا",
          "roman": "Bara",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Small",
          "native": "چھوٹا",
          "roman": "Chota",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Today",
          "native": "آج",
          "roman": "Aaj",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Tomorrow",
          "native": "گونو",
          "roman": "Guno",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Here",
          "native": "یہاں",
          "roman": "Yahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "There",
          "native": "وہاں",
          "roman": "Wahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "تے نام کیا اِن؟",
        "roman": "Te naam kya in?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "My name is...",
        "native": "مے نام ... اِن",
        "roman": "Me naam ... in",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "How are you?",
        "native": "تُو کیا حال اِن؟",
        "roman": "Tu kya haal in?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک اُن",
        "roman": "Main theek un",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where are you from?",
        "native": "تُو کوٹھو اِن؟",
        "roman": "Tu kotho in?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان کوٹھو اُن",
        "roman": "Main Pakistan kotho un",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What are you doing?",
        "native": "تُو کیا کر ہین؟",
        "roman": "Tu kya kar hin?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I don't understand.",
        "native": "مجھے سمجھ نہیں آیا",
        "roman": "Mujhe samajh nahi aaya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستہ بولیں",
        "roman": "Aahista bolein",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Can you help me?",
        "native": "کیا تُو میری مدد کر سکن؟",
        "roman": "Kya tu meri madad kar sakin?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How much is this?",
        "native": "یہ کتنے کا اِن؟",
        "roman": "Yeh kitne ka in?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the market?",
        "native": "بازار کوٹھو اِن؟",
        "roman": "Bazaar kotho in?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Where is the bathroom?",
        "native": "باتھ روم کوٹھو اِن؟",
        "roman": "Bathroom kotho in?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am hungry.",
        "native": "مجھے بھوک لگی اے",
        "roman": "Mujhe bhookh lagi ae",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am thirsty.",
        "native": "مجھے پیاس لگی اے",
        "roman": "Mujhe pyaas lagi ae",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I like this.",
        "native": "مجھے یہ پسند اے",
        "roman": "Mujhe yeh pasand ae",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't like this.",
        "native": "مجھے یہ پسند نہیں",
        "roman": "Mujhe yeh pasand nahi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What time is it?",
        "native": "کیا وقت ہوا ہے؟",
        "roman": "Kya waqt hua hai?",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "I love you.",
        "native": "میں تم سے محبت کرتا ہوں",
        "roman": "Main tumse mohabbat karta hoon",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملتے ہیں",
        "roman": "Kal miltay hain",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہو!",
        "roman": "Mubarak ho!",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "dialect_note": "Shina has multiple regional varieties (Gilgit, Astore, Kohistani, Chilas, Drass) with pronunciation differences. Standardized Shina orthography is recent, so online documentation is limited. Numerals and greetings below reflect commonly cited Gilgit Shina forms; several everyday-vocabulary items use the shared Urdu form in daily speech (marked with a note) rather than a guessed native word."
  },
  "Balti": {
    "greetings": [
      {
        "english": "Hello",
        "native": "جولے",
        "roman": "Julley"
      },
      {
        "english": "Hi",
        "native": "جولے",
        "roman": "Julley"
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Night",
        "native": "جولے",
        "roman": "Julley",
        "note": "Also used at night as a general greeting"
      },
      {
        "english": "Welcome",
        "native": "جولے",
        "roman": "Julley"
      },
      {
        "english": "Goodbye",
        "native": "جولے",
        "roman": "Julley",
        "note": "Also used when parting, alongside Khuda Hafiz"
      },
      {
        "english": "Thank You",
        "native": "تھُوجے چے",
        "roman": "Thuje-che"
      },
      {
        "english": "Please",
        "native": "مہربانی",
        "roman": "Meharbani",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Sorry",
        "native": "معافی",
        "roman": "Maafi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Yes",
        "native": "یِن",
        "roman": "Yin"
      },
      {
        "english": "No",
        "native": "مین",
        "roman": "Meen"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Nice To Meet You",
        "native": "آپ سے مل کر خوشی ہوئی",
        "roman": "Aap se mil kar khushi hui",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیں",
        "roman": "Apna khayal rakhein",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "چِک",
        "roman": "Chik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "ङیس",
        "roman": "Ngees"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "سُم",
        "roman": "Sum"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "ژی",
        "roman": "Zhi"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "ङا",
        "roman": "Nga"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "دْرُک",
        "roman": "Druk"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "دُن",
        "roman": "Dun"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "گیَد",
        "roman": "Gyad"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "گُ",
        "roman": "Gu"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "چُ",
        "roman": "Chu"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "مِی",
          "roman": "Mee",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Woman",
          "native": "بُود مو",
          "roman": "Budmo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Boy",
          "native": "بُو",
          "roman": "Bu"
        },
        {
          "english": "Girl",
          "native": "بُومو",
          "roman": "Bumo"
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Mother",
          "native": "اَما",
          "roman": "Ama"
        },
        {
          "english": "Father",
          "native": "اَبا",
          "roman": "Aba"
        },
        {
          "english": "Brother",
          "native": "جوجو",
          "roman": "Jojo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sister",
          "native": "سِنگمو",
          "roman": "Singmo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandfather",
          "native": "می می",
          "roman": "Mimi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "اَبی",
          "roman": "Abi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Son",
          "native": "بُو",
          "roman": "Bu",
          "note": "Same term as 'Boy'; needs native-speaker verification"
        },
        {
          "english": "Daughter",
          "native": "بُو مو",
          "roman": "Bumo",
          "note": "Needs native-speaker verification"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "لَم",
          "roman": "Lam"
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Boat",
          "native": "کشتی",
          "roman": "Kashti",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "زَس",
          "roman": "Zas",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Water",
          "native": "چُو",
          "roman": "Chu"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "اُومَا",
          "roman": "Ooma",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Bread",
          "native": "خَپَٹ",
          "roman": "Khapat",
          "note": "Balti bread; needs native-speaker verification"
        },
        {
          "english": "Rice",
          "native": "بْراس",
          "roman": "Bras",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Meat",
          "native": "شَا",
          "roman": "Sha"
        },
        {
          "english": "Fruit",
          "native": "شِنگ توگَس",
          "roman": "Shing-togas",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sugar",
          "native": "چینی",
          "roman": "Cheeni",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Salt",
          "native": "چا",
          "roman": "Cha",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Egg",
          "native": "گونگ ما",
          "roman": "Gongma",
          "note": "Needs native-speaker verification"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "خَنگ",
          "roman": "Khang"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "یول",
          "roman": "Yul",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "River",
          "native": "توی",
          "roman": "Tuwi",
          "note": "Needs native-speaker verification"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "سگو",
          "roman": "Sgo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bed",
          "native": "بستر",
          "roman": "Bistar",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "شوگ",
          "roman": "Shog",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Go",
          "native": "سونگ",
          "roman": "Song",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Eat",
          "native": "زو",
          "roman": "Zo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Drink",
          "native": "تُنگ",
          "roman": "Tung",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sit",
          "native": "سدود",
          "roman": "Sdod",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Stand",
          "native": "لَنگز",
          "roman": "Langz",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Good",
          "native": "یاگمو",
          "roman": "Yagmo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Big",
          "native": "چھینمو",
          "roman": "Cheenmo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Small",
          "native": "چُنگ چُنگ",
          "roman": "Chung-chung",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Today",
          "native": "دی رِنگ",
          "roman": "Diring",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Tomorrow",
          "native": "توتو",
          "roman": "Toto",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Here",
          "native": "دَی نگ",
          "roman": "Ding",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "There",
          "native": "فا نگ",
          "roman": "Fang",
          "note": "Needs native-speaker verification"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "خیوند مِنگ اِنا؟",
        "roman": "Khyorang ming ina?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "My name is...",
        "native": "ڭے مِنگ ... اِن",
        "roman": "Nge ming ... in",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "How are you?",
        "native": "خیوند کاسنگ یوت؟",
        "roman": "Khyorang kasang yot?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I am fine.",
        "native": "ڭا لاگمو یوت",
        "roman": "Nga lagmo yot",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "Where are you from?",
        "native": "خیوند کاننگ ان؟",
        "roman": "Khyorang kanang in?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I am from Pakistan.",
        "native": "ڭا پاکستان کاننگ این",
        "roman": "Nga Pakistan kanang in",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "What are you doing?",
        "native": "خیوند چی زوت یوت؟",
        "roman": "Khyorang chi zot yot?",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I don't understand.",
        "native": "مجھے سمجھ نہیں آیا",
        "roman": "Mujhe samajh nahi aaya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستہ بولیں",
        "roman": "Aahista bolein",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Can you help me?",
        "native": "کیا آپ میری مدد کر سکتے ہیں؟",
        "roman": "Kya aap meri madad kar saktay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How much is this?",
        "native": "یہ کتنے کا ہے؟",
        "roman": "Yeh kitnay ka hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the market?",
        "native": "بازار کہاں ہے؟",
        "roman": "Bazaar kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the bathroom?",
        "native": "باتھ روم کہاں ہے؟",
        "roman": "Bathroom kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am hungry.",
        "native": "ڭا توگس اِن",
        "roman": "Nga togs in",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I am thirsty.",
        "native": "ڭا کھاٹوگس اِن",
        "roman": "Nga khatogs in",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "I like this.",
        "native": "مجھے یہ پسند ہے",
        "roman": "Mujhe yeh pasand hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't like this.",
        "native": "مجھے یہ پسند نہیں",
        "roman": "Mujhe yeh pasand nahi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What time is it?",
        "native": "کیا وقت ہوا ہے؟",
        "roman": "Kya waqt hua hai?",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "I love you.",
        "native": "میں تم سے محبت کرتا ہوں",
        "roman": "Main tumse mohabbat karta hoon",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملتے ہیں",
        "roman": "Kal miltay hain",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہو!",
        "roman": "Mubarak ho!",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "dialect_note": "Balti is a Tibetic language, closely related to Ladakhi/Purgi, written in Pakistan mainly with an extended Perso-Arabic script (a Tibetan 'Yige' script is also promoted by revivalists). Numerals reflect the standard Tibetic numeral set shared across Balti dialects (Skardu, Khaplu, Shigar). 'Julley' is the well-documented general-purpose greeting shared across the wider Balti-Ladakhi cultural area. Many everyday words below use the shared Urdu form in daily speech, marked with a note."
  },
  "Burushaski": {
    "greetings": [
      {
        "english": "Hello",
        "native": "بہ بلا",
        "roman": "Ba Bila",
        "note": "Traditional Burushaski greeting, literally 'may God be with you'"
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Thank You",
        "native": "شکریہ",
        "roman": "Shukriya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please",
        "native": "مہربانی",
        "roman": "Meharbani",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Sorry",
        "native": "معافی",
        "roman": "Maafi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Yes",
        "native": "ہاں",
        "roman": "Hun",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Ake",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Nice To Meet You",
        "native": "آپ سے مل کر خوشی ہوئی",
        "roman": "Aap se mil kar khushi hui",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیں",
        "roman": "Apna khayal rakhein",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "ہِک",
        "roman": "Hik"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "اَلٹو",
        "roman": "Alto"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "اِسکی",
        "roman": "Iski"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "والتی",
        "roman": "Walti"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "چھِندی",
        "roman": "Chindi"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "مِشِندی",
        "roman": "Mishindi"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "تھَلے",
        "roman": "Thale"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اَلتَمبی",
        "roman": "Altambi"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "ہُنتی",
        "roman": "Hunti"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "تُورِمی",
        "roman": "Toorimi"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "آدمی",
          "roman": "Aadmi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Woman",
          "native": "عورت",
          "roman": "Aurat",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Boy",
          "native": "لڑکا",
          "roman": "Larka",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Girl",
          "native": "لڑکی",
          "roman": "Larki",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Mother",
          "native": "مِے",
          "roman": "Mei",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Father",
          "native": "اَچھو",
          "roman": "Acho",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Brother",
          "native": "اُیو",
          "roman": "Uyo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sister",
          "native": "اُسی",
          "roman": "Usi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandfather",
          "native": "آپو",
          "roman": "Aapoo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "آپی",
          "roman": "Aapi",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Son",
          "native": "اُیے",
          "roman": "Uye",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Daughter",
          "native": "اُیُس",
          "roman": "Uyus",
          "note": "Needs native-speaker verification"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستہ",
          "roman": "Rasta",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Boat",
          "native": "کشتی",
          "roman": "Kashti",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Water",
          "native": "ٹِل",
          "roman": "Til",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "دودھ",
          "roman": "Doodh",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Rice",
          "native": "بَراص",
          "roman": "Braas",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Fruit",
          "native": "میوہ",
          "roman": "Mewa",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sugar",
          "native": "چینی",
          "roman": "Cheeni",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Salt",
          "native": "بره",
          "roman": "Bra",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Egg",
          "native": "انڈا",
          "roman": "Anda",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "گھر",
          "roman": "Ghar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "گاؤں",
          "roman": "Gaon",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "River",
          "native": "توموُر",
          "roman": "Toomur",
          "note": "Needs native-speaker verification"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازہ",
          "roman": "Darwaza",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bed",
          "native": "بستر",
          "roman": "Bistar",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آؤ",
          "roman": "Aao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Go",
          "native": "جاؤ",
          "roman": "Jao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Eat",
          "native": "کھاؤ",
          "roman": "Khao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Drink",
          "native": "پیو",
          "roman": "Piyo",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sit",
          "native": "بیٹھو",
          "roman": "Baitho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stand",
          "native": "کھڑے ہو",
          "roman": "Khare Ho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Good",
          "native": "اچھا",
          "roman": "Acha",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Big",
          "native": "بڑا",
          "roman": "Bara",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Small",
          "native": "چھوٹا",
          "roman": "Chota",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Today",
          "native": "آج",
          "roman": "Aaj",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Tomorrow",
          "native": "کل",
          "roman": "Kal",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Here",
          "native": "یہاں",
          "roman": "Yahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "There",
          "native": "وہاں",
          "roman": "Wahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "آپ کا نام کیا ہے؟",
        "roman": "Aap ka naam kya hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "My name is...",
        "native": "میرا نام ... ہے",
        "roman": "Mera naam ... hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How are you?",
        "native": "آپ کیسے ہیں؟",
        "roman": "Aap kaisay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک ہوں",
        "roman": "Main theek hoon",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where are you from?",
        "native": "آپ کہاں سے ہیں؟",
        "roman": "Aap kahan se hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان سے ہوں",
        "roman": "Main Pakistan se hoon",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What are you doing?",
        "native": "آپ کیا کر رہے ہیں؟",
        "roman": "Aap kya kar rahay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't understand.",
        "native": "مجھے سمجھ نہیں آیا",
        "roman": "Mujhe samajh nahi aaya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستہ بولیں",
        "roman": "Aahista bolein",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Can you help me?",
        "native": "کیا آپ میری مدد کر سکتے ہیں؟",
        "roman": "Kya aap meri madad kar saktay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How much is this?",
        "native": "یہ کتنے کا ہے؟",
        "roman": "Yeh kitnay ka hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the market?",
        "native": "بازار کہاں ہے؟",
        "roman": "Bazaar kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the bathroom?",
        "native": "باتھ روم کہاں ہے؟",
        "roman": "Bathroom kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am hungry.",
        "native": "مجھے بھوک لگی ہے",
        "roman": "Mujhe bhookh lagi hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am thirsty.",
        "native": "مجھے پیاس لگی ہے",
        "roman": "Mujhe pyaas lagi hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I like this.",
        "native": "مجھے یہ پسند ہے",
        "roman": "Mujhe yeh pasand hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't like this.",
        "native": "مجھے یہ پسند نہیں",
        "roman": "Mujhe yeh pasand nahi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What time is it?",
        "native": "کیا وقت ہوا ہے؟",
        "roman": "Kya waqt hua hai?",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "I love you.",
        "native": "میں تم سے محبت کرتا ہوں",
        "roman": "Main tumse mohabbat karta hoon",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملتے ہیں",
        "roman": "Kal miltay hain",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہو!",
        "roman": "Mubarak ho!",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "dialect_note": "Burushaski is a language isolate with no relatives, spoken in Hunza, Nagar, and Yasin (as 'Werchikwar'), each with lexical differences. Numerals below are drawn from documented Hunza-dialect sources. Because standardized public dictionaries are scarce, most everyday-vocabulary and phrase entries here use the shared Urdu form spoken daily by Burushaski speakers (marked with a note) rather than a guessed native form — this section would most benefit from review by a native Burushaski speaker before publishing."
  },
  "Wakhi": {
    "greetings": [
      {
        "english": "Hello",
        "native": "سلام",
        "roman": "Salaam",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Hi",
        "native": "سلام",
        "roman": "Salaam",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Morning",
        "native": "صبح بخیر",
        "roman": "Subah Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Afternoon",
        "native": "دوپہر بخیر",
        "roman": "Dupahir Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Evening",
        "native": "شام بخیر",
        "roman": "Shaam Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Good Night",
        "native": "رات بخیر",
        "roman": "Raat Bakhair",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Welcome",
        "native": "خوش آمدید",
        "roman": "Khush Aamdeed",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Goodbye",
        "native": "خدا حافظ",
        "roman": "Khuda Hafiz",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Thank You",
        "native": "شکریہ",
        "roman": "Shukriya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please",
        "native": "مہربانی",
        "roman": "Meharbani",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Sorry",
        "native": "معافی",
        "roman": "Maafi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Yes",
        "native": "ہا",
        "roman": "Ha",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "No",
        "native": "نہ",
        "roman": "Na",
        "note": "Needs native-speaker verification"
      },
      {
        "english": "See You Later",
        "native": "پھر ملیں گے",
        "roman": "Phir Milenge",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Nice To Meet You",
        "native": "آپ سے مل کر خوشی ہوئی",
        "roman": "Aap se mil kar khushi hui",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Take Care",
        "native": "اپنا خیال رکھیں",
        "roman": "Apna khayal rakhein",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "numbers": [
      {
        "number": 1,
        "english": "One",
        "native": "یِو",
        "roman": "Yiw",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 2,
        "english": "Two",
        "native": "بُوی",
        "roman": "Buy",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 3,
        "english": "Three",
        "native": "تْرُوی",
        "roman": "Truy",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 4,
        "english": "Four",
        "native": "تسفُر",
        "roman": "Tsfur",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 5,
        "english": "Five",
        "native": "پَنز",
        "roman": "Panz",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 6,
        "english": "Six",
        "native": "خُو",
        "roman": "Khu",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 7,
        "english": "Seven",
        "native": "اُوبد",
        "roman": "Ubd",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 8,
        "english": "Eight",
        "native": "اَشت",
        "roman": "Asht",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 9,
        "english": "Nine",
        "native": "نَو",
        "roman": "Naw",
        "note": "Needs native-speaker verification"
      },
      {
        "number": 10,
        "english": "Ten",
        "native": "ذَس",
        "roman": "Dhas",
        "note": "Needs native-speaker verification"
      }
    ],
    "common_words": {
      "people": [
        {
          "english": "Man",
          "native": "آدمی",
          "roman": "Aadmi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Woman",
          "native": "عورت",
          "roman": "Aurat",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Boy",
          "native": "لڑکا",
          "roman": "Larka",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Girl",
          "native": "لڑکی",
          "roman": "Larki",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Child",
          "native": "ماشوم",
          "roman": "Mashoom",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Friend",
          "native": "یار",
          "roman": "Yaar",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Mother",
          "native": "نان",
          "roman": "Nan",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Father",
          "native": "تات",
          "roman": "Tat",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Brother",
          "native": "وِرود",
          "roman": "Virod",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Sister",
          "native": "خُی",
          "roman": "Khuy",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandfather",
          "native": "بوبو",
          "roman": "Bobo",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Grandmother",
          "native": "نانی",
          "roman": "Nani",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Son",
          "native": "پتر",
          "roman": "Putr",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Daughter",
          "native": "دختر",
          "roman": "Dukhtar",
          "note": "Needs native-speaker verification"
        }
      ],
      "transport": [
        {
          "english": "Car",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bus",
          "native": "بس",
          "roman": "Bus"
        },
        {
          "english": "Rickshaw",
          "native": "رکشہ",
          "roman": "Rickshaw"
        },
        {
          "english": "Bicycle",
          "native": "سائیکل",
          "roman": "Cycle"
        },
        {
          "english": "Motorcycle",
          "native": "موٹرسائیکل",
          "roman": "Motorcycle"
        },
        {
          "english": "Road",
          "native": "رستہ",
          "roman": "Rasta",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vehicle",
          "native": "گاڑی",
          "roman": "Gaari",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Train",
          "native": "ریل",
          "roman": "Rail",
          "note": "Commonly shared Urdu form"
        },
        {
          "english": "Airplane",
          "native": "ہوائی جہاز",
          "roman": "Hawai Jahaz",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Boat",
          "native": "کشتی",
          "roman": "Kashti",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "food": [
        {
          "english": "Food",
          "native": "کھانا",
          "roman": "Khana",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Water",
          "native": "یُوپک",
          "roman": "Yupk",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Tea",
          "native": "چائے",
          "roman": "Chai"
        },
        {
          "english": "Milk",
          "native": "دودھ",
          "roman": "Doodh",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bread",
          "native": "روٹی",
          "roman": "Roti",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Rice",
          "native": "گِژن",
          "roman": "Gizhn",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "Meat",
          "native": "گوشت",
          "roman": "Gosht",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Fruit",
          "native": "میوہ",
          "roman": "Mewa",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Vegetable",
          "native": "سبزی",
          "roman": "Sabzi",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sugar",
          "native": "چینی",
          "roman": "Cheeni",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Salt",
          "native": "نمک",
          "roman": "Namak",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Egg",
          "native": "انڈا",
          "roman": "Anda",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "places": [
        {
          "english": "Home",
          "native": "خُن",
          "roman": "Khun",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "School",
          "native": "سکول",
          "roman": "Iskool"
        },
        {
          "english": "Market",
          "native": "بازار",
          "roman": "Bazaar"
        },
        {
          "english": "Hospital",
          "native": "ہسپتال",
          "roman": "Haspatal"
        },
        {
          "english": "Mosque",
          "native": "مسجد",
          "roman": "Masjid"
        },
        {
          "english": "Shop",
          "native": "دکان",
          "roman": "Dukaan"
        },
        {
          "english": "Village",
          "native": "قشلاق",
          "roman": "Qishlaq",
          "note": "Needs native-speaker verification"
        },
        {
          "english": "City",
          "native": "شہر",
          "roman": "Shehar",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "River",
          "native": "دریا",
          "roman": "Darya",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "objects": [
        {
          "english": "Book",
          "native": "کتاب",
          "roman": "Kitaab"
        },
        {
          "english": "Phone",
          "native": "فون",
          "roman": "Phone"
        },
        {
          "english": "Door",
          "native": "دروازہ",
          "roman": "Darwaza",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Chair",
          "native": "کرسی",
          "roman": "Kursi"
        },
        {
          "english": "Table",
          "native": "میز",
          "roman": "Mez"
        },
        {
          "english": "Clothes",
          "native": "کپڑے",
          "roman": "Kapray",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Pen",
          "native": "قلم",
          "roman": "Qalam",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bag",
          "native": "بیگ",
          "roman": "Bag",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Bed",
          "native": "بستر",
          "roman": "Bistar",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ],
      "useful": [
        {
          "english": "Come",
          "native": "آؤ",
          "roman": "Aao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Go",
          "native": "جاؤ",
          "roman": "Jao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Eat",
          "native": "کھاؤ",
          "roman": "Khao",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Drink",
          "native": "پیو",
          "roman": "Piyo",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Sit",
          "native": "بیٹھو",
          "roman": "Baitho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stand",
          "native": "کھڑے ہو",
          "roman": "Khare Ho",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Stop",
          "native": "رکو",
          "roman": "Ruko",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Help",
          "native": "مدد",
          "roman": "Madad",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Good",
          "native": "اچھا",
          "roman": "Acha",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Bad",
          "native": "خراب",
          "roman": "Kharab",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Big",
          "native": "بڑا",
          "roman": "Bara",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Small",
          "native": "چھوٹا",
          "roman": "Chota",
          "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
        },
        {
          "english": "Today",
          "native": "آج",
          "roman": "Aaj",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Tomorrow",
          "native": "کل",
          "roman": "Kal",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "Here",
          "native": "یہاں",
          "roman": "Yahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        },
        {
          "english": "There",
          "native": "وہاں",
          "roman": "Wahan",
          "note": "Commonly shared Urdu form used in everyday speech"
        }
      ]
    },
    "phrases": [
      {
        "english": "What is your name?",
        "native": "آپ کا نام کیا ہے؟",
        "roman": "Aap ka naam kya hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "My name is...",
        "native": "میرا نام ... ہے",
        "roman": "Mera naam ... hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How are you?",
        "native": "آپ کیسے ہیں؟",
        "roman": "Aap kaisay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am fine.",
        "native": "میں ٹھیک ہوں",
        "roman": "Main theek hoon",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where are you from?",
        "native": "آپ کہاں سے ہیں؟",
        "roman": "Aap kahan se hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am from Pakistan.",
        "native": "میں پاکستان سے ہوں",
        "roman": "Main Pakistan se hoon",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What are you doing?",
        "native": "آپ کیا کر رہے ہیں؟",
        "roman": "Aap kya kar rahay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't understand.",
        "native": "مجھے سمجھ نہیں آیا",
        "roman": "Mujhe samajh nahi aaya",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Please speak slowly.",
        "native": "آہستہ بولیں",
        "roman": "Aahista bolein",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Can you help me?",
        "native": "کیا آپ میری مدد کر سکتے ہیں؟",
        "roman": "Kya aap meri madad kar saktay hain?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "How much is this?",
        "native": "یہ کتنے کا ہے؟",
        "roman": "Yeh kitnay ka hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the market?",
        "native": "بازار کہاں ہے؟",
        "roman": "Bazaar kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "Where is the bathroom?",
        "native": "باتھ روم کہاں ہے؟",
        "roman": "Bathroom kahan hai?",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am hungry.",
        "native": "مجھے بھوک لگی ہے",
        "roman": "Mujhe bhookh lagi hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I am thirsty.",
        "native": "مجھے پیاس لگی ہے",
        "roman": "Mujhe pyaas lagi hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I like this.",
        "native": "مجھے یہ پسند ہے",
        "roman": "Mujhe yeh pasand hai",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "I don't like this.",
        "native": "مجھے یہ پسند نہیں",
        "roman": "Mujhe yeh pasand nahi",
        "note": "Commonly used in everyday speech; many speakers of this language are bilingual in Urdu, and formal/everyday vocabulary is often shared."
      },
      {
        "english": "What time is it?",
        "native": "کیا وقت ہوا ہے؟",
        "roman": "Kya waqt hua hai?",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "I love you.",
        "native": "میں تم سے محبت کرتا ہوں",
        "roman": "Main tumse mohabbat karta hoon",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "See you tomorrow.",
        "native": "کل ملتے ہیں",
        "roman": "Kal miltay hain",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Congratulations!",
        "native": "مبارک ہو!",
        "roman": "Mubarak ho!",
        "note": "Commonly shared Urdu form used in everyday speech"
      },
      {
        "english": "Happy Eid.",
        "native": "عید مبارک",
        "roman": "Eid Mubarak",
        "note": "Commonly shared Urdu form used in everyday speech"
      }
    ],
    "dialect_note": "Wakhi is a Pamir (Eastern Iranian) language spoken in Gojal (upper Hunza), with the smallest and most dispersed speaker base of the 12 languages here (also spoken in Afghanistan, Tajikistan, and China). Public dictionaries are very limited. Numerals reflect forms documented in Pamir-linguistics sources (Pakhalina 1975; Morgenstierne 1938) and should be treated as a starting point rather than a confirmed standard. Most everyday-vocabulary and phrase entries below use the shared Urdu form spoken daily by Wakhi speakers (marked with a note); this section most needs review by a native Wakhi speaker before publishing."
  }
};

const seedBtn = document.getElementById("seedLanguagesBtn");
const statusEl = document.getElementById("seedLanguagesStatus");

if (seedBtn) {

  seedBtn.addEventListener("click", async () => {

    seedBtn.disabled = true;
    statusEl.textContent = "Seeding...";

    try {

      await Promise.all(
        Object.entries(LANGUAGE_LEARNING).map(([key, learningData]) =>
          setDoc(
            doc(db, "languages", key),
            { language_learning: learningData },
            { merge: true }
          )
        )
      );

      statusEl.textContent = "✅ Done! Language-learning content added to 12 languages.";

    } catch (error) {

      console.error(error);
      statusEl.textContent = "❌ Failed: " + error.message;

    } finally {

      seedBtn.disabled = false;

    }

  });

}