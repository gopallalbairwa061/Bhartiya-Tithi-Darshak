
'use server';

import { format, eachDayOfInterval, startOfMonth, endOfMonth, differenceInDays, startOfYear } from 'date-fns';
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

// Base values for a known date (e.g., Jan 1, 2024) to make calculations look real
const aharGanaBaseDate = new Date(2024, 0, 1);
// These are reference indices for the base date. In a real scenario, these would be accurately calculated.
const baseTithiIndex = 19; // Example: Krishna Paksha Panchami
const baseNakshatraIndex = 13; // Example: Hasta
const baseYogaIndex = 3; // Example: Saubhagya

// Approximate durations in decimal days
const tithiDuration = 0.98;
const nakshatraDuration = 1.02;
const yogaDuration = 0.95;


const formatTime = (decimalHours: number) => {
    const totalMinutes = Math.floor(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    let period = "सुबह";
    if (hours >= 12) period = "दोपहर";
    if (hours >= 16) period = "शाम";
    if (hours >= 20 || hours < 4) period = "रात";
    
    const displayHour = hours % 12 === 0 ? 12 : hours % 12;

    return `${period} ${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')} तक`;
};

// This is a more realistic mock data generator. 
// It simulates the progression of panchang elements.
export async function getPanchangForMonth(year: number, month: number): Promise<PanchangData[]> {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(startDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  return dates.map((date) => {
    const daysSinceBase = differenceInDays(date, aharGanaBaseDate);

    // Calculate indices based on progression
    const tithiIndex = Math.floor(baseTithiIndex + (daysSinceBase / tithiDuration)) % tithis.length;
    const nakshatraIndex = Math.floor(baseNakshatraIndex + (daysSinceBase / nakshatraDuration)) % nakshatras.length;
    const yogaIndex = Math.floor(baseYogaIndex + (daysSinceBase / yogaDuration)) % yogas.length;
    
    // Karanas are two per tithi
    const karanaBaseIndex = tithiIndex * 2;
    const karanaIndex1 = karanaBaseIndex % karanas.length;
    const karanaIndex2 = (karanaBaseIndex + 1) % karanas.length;

    // Determine Paksha based on tithi index
    const paksha = tithiIndex < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    // Simulate sunrise/sunset variation
    const dayOfYear = differenceInDays(date, startOfYear(date));
    const seasonalFactor = Math.sin((dayOfYear - 80) * (2 * Math.PI) / 365.25); // Simple sine wave for seasonal change
    
    const sunriseBase = 6.0; // 6:00 AM
    const sunsetBase = 18.0; // 6:00 PM
    const sunriseHour = sunriseBase - seasonalFactor;
    const sunsetHour = sunsetBase + seasonalFactor;

    const sunriseMinutes = Math.floor((sunriseHour % 1) * 60);
    const sunsetMinutes = Math.floor((sunsetHour % 1) * 60);

    const tithiEndTimeDecimal = (daysSinceBase / tithiDuration) % 1 * 24;
    const nakshatraEndTimeDecimal = (daysSinceBase / nakshatraDuration) % 1 * 24;
    const yogaEndTimeDecimal = (daysSinceBase / yogaDuration) % 1 * 24;
    const karanaEndTimeDecimal = ((daysSinceBase / tithiDuration) * 2 % 1) * 12;

    return {
      date: format(date, 'yyyy-MM-dd'),
      tithi: `${paksha}, ${tithis[tithiIndex]}`,
      nakshatra: {
        name: nakshatras[nakshatraIndex],
        endTime: formatTime(nakshatraEndTimeDecimal)
      },
      yoga: {
        name: yogas[yogaIndex],
        endTime: formatTime(yogaEndTimeDecimal)
      },
      karana: {
        name: `${karanas[karanaIndex1]}, ${karanas[karanaIndex2]}`,
        endTime: formatTime(karanaEndTimeDecimal)
      },
      sunrise: `सुबह ${Math.floor(sunriseHour).toString().padStart(2, '0')}:${sunriseMinutes.toString().padStart(2, '0')}`,
      sunset: `शाम ${Math.floor(sunsetHour).toString().padStart(2, '0')}:${sunsetMinutes.toString().padStart(2, '0')}`,
    };
  });
}
