
'use server';

import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, getDaysInMonth } from 'date-fns';
import { hi } from 'date-fns/locale';

interface Detail {
  name: string;
  endTime: string;
}

export interface PanchangData {
  date: string; // "yyyy-MM-dd"
  tithi: string;
  nakshatra: Detail;
  yoga: Detail;
  karana: Detail;
  sunrise: string;
  sunset: string;
}

const tithis = [
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
  "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "पूर्णिमा",
  "प्रतिपदा", "द्वितीया", "तृतीया", "चतुर्थी", "पंचमी", "षष्ठी", "सप्तमी", "अष्टमी", "नवमी", "दशमी",
  "एकादशी", "द्वादशी", "त्रयोदशी", "चतुर्दशी", "अमावस्या"
];

const nakshatras = [
  "अश्विनी", "भरणी", "कृत्तिका", "रोहिणी", "मृगशिरा", "आर्द्रा", "पुनर्वसु", "पुष्य", "आश्लेषा", "मघा",
  "पूर्वा फाल्गुनी", "उत्तरा फाल्गुनी", "हस्त", "चित्रा", "स्वाति", "विशाखा", "अनुराधा", "ज्येष्ठा", "मूल",
  "पूर्वाषाढ़ा", "उत्तराषाढ़ा", "श्रवण", "धनिष्ठा", "शतभिषा", "पूर्व भाद्रपद", "उत्तर भाद्रपद", "रेवती"
];

const yogas = [
    "विष्कुम्भ", "प्रीति", "आयुष्मान", "सौभाग्य", "शोभन", "अतिगण्ड", "सुकर्मा", "धृति", "शूल", "गण्ड", 
    "वृद्धि", "ध्रुव", "व्याघात", "हर्षण", "वज्र", "सिद्धि", "व्यतिपात", "वरीयान", "परिघ", "शिव", 
    "सिद्ध", "साध्य", "शुभ", "शुक्ल", "ब्रह्म", "इन्द्र", "वैधृति"
];

const karanas = [
    "बव", "बालव", "कौलव", "तैतिल", "गर", "वणिज", "विष्टि", "शकुनि", "चतुष्पाद", "नाग", "किंस्तुघ्न"
];

const formatTime = (hour: number, minute: number, period: "सुबह" | "शाम" | "दोपहर" | "रात") => {
    return `${period} ${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')} तक`;
};

// This is a simplified mock data generator. 
// For a real application, you'd use a proper astronomical library.
export async function getPanchangForMonth(year: number, month: number): Promise<PanchangData[]> {
  const startDate = new Date(year, month, 1);
  const endDate = endOfMonth(startDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  // A simple pseudo-random starting point to make the data look varied
  const seed = year + month * 12;

  return dates.map((date, index) => {
    const daySeed = seed + index;

    const tithiIndex = daySeed % tithis.length;
    const nakshatraIndex = daySeed % nakshatras.length;
    const yogaIndex = daySeed % yogas.length;
    const karanaIndex = daySeed % karanas.length;
    
    // Determine Paksha based on tithi index
    const paksha = tithiIndex < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    const sunriseHour = 5 + ((daySeed * 3) % 2); // 5 or 6
    const sunriseMinute = (daySeed * 7) % 60;
    const sunsetHour = 6 + ((daySeed * 5) % 2); // 6 or 7
    const sunsetMinute = (daySeed * 11) % 60;

    return {
      date: format(date, 'yyyy-MM-dd'),
      tithi: `${paksha}, ${tithis[tithiIndex]}`,
      nakshatra: {
        name: nakshatras[nakshatraIndex],
        endTime: formatTime((daySeed % 24), (daySeed*2 % 60), "रात")
      },
      yoga: {
        name: yogas[yogaIndex],
        endTime: formatTime((daySeed*3 % 12), (daySeed*4 % 60), "शाम")
      },
      karana: {
        name: karanas[karanaIndex],
        endTime: formatTime((daySeed*5 % 12), (daySeed*6 % 60), "दोपहर")
      },
      sunrise: `सुबह ${sunriseHour.toString().padStart(2, '0')}:${sunriseMinute.toString().padStart(2, '0')}`,
      sunset: `शाम 0${sunsetHour}:${sunsetMinute.toString().padStart(2, '0')}`,
    };
  });
}
