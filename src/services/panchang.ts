
'use server';

import { format, eachDayOfInterval, startOfMonth, endOfMonth, addMonths, getDaysInMonth } from 'date-fns';
import { hi } from 'date-fns/locale';

export interface PanchangData {
  date: string; // "yyyy-MM-dd"
  tithi: string;
  nakshatra: string;
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


// This is a simplified mock data generator. 
// For a real application, you'd use a proper astronomical library.
export async function getPanchangForMonth(year: number, month: number): Promise<PanchangData[]> {
  const startDate = new Date(year, month, 1);
  const endDate = endOfMonth(startDate);
  const daysInMonth = getDaysInMonth(startDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  // A simple pseudo-random starting point to make the data look varied
  const tithiStartIndex = (year + month * 12) % tithis.length;
  const nakshatraStartIndex = (year + month * 12) % nakshatras.length;

  return dates.map((date, index) => {
    const tithiIndex = (tithiStartIndex + index) % tithis.length;
    const nakshatraIndex = (nakshatraStartIndex + index) % nakshatras.length;
    
    // Determine Paksha based on tithi index
    const paksha = tithiIndex < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    return {
      date: format(date, 'yyyy-MM-dd'),
      tithi: `${paksha}, ${tithis[tithiIndex]}`,
      nakshatra: nakshatras[nakshatraIndex],
    };
  });
}
