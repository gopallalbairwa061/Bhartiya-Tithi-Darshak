
'use server';
import { getYear, getMonth } from 'date-fns';

export type Festival = {
    name: string;
    date: string; // Hindi date string
    icon: string;
};

const monthMap: { [key: string]: number } = {
  'जनवरी': 0, 'फरवरी': 1, 'मार्च': 2, 'अप्रैल': 3, 'मई': 4, 'जून': 5,
  'जुलाई': 6, 'अगस्त': 7, 'सितंबर': 8, 'अक्टूबर': 9, 'नवंबर': 10, 'दिसंबर': 11
};

const parseHindiDate = (dateString: string): Date | null => {
  const parts = dateString.replace(/,/g, '').split(' ');
  if (parts.length === 3) {
    const monthName = parts[0];
    const day = parseInt(parts[1], 10);
    const year = parseInt(parts[2], 10);
    
    const month = monthMap[monthName];
    if (month !== undefined && !isNaN(day) && !isNaN(year)) {
      return new Date(year, month, day);
    }
  }
  // Fallback for standard date strings
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  return null;
};


const allFestivals: Festival[] = [
    // 2024 Festivals
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2024", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 19, 2024", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 26, 2024", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 7, 2024", icon: "calendar" },
    { name: "गांधी जयंती", date: "अक्टूबर 2, 2024", icon: "calendar" },
    { name: "नवरात्रि", date: "अक्टूबर 3, 2024", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 12, 2024", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 1, 2024", icon: "diya" },
    { name: "गुरु नानक जयंती", date: "नवंबर 15, 2024", icon: "calendar" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2024", icon: "calendar" },

    // 2025 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2025", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2025", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2025", icon: "calendar" },
    { name: "वसंत पंचमी", date: "फरवरी 3, 2025", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 26, 2025", icon: "calendar" },
    { name: "होलिका दहन", date: "मार्च 13, 2025", icon: "calendar" },
    { name: "होली", date: "मार्च 14, 2025", icon: "calendar" },
    { name: "गुड़ी पड़वा", date: "मार्च 30, 2025", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 6, 2025", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 20, 2025", icon: "calendar" },
    { name: "अक्षय तृतीया", date: "अप्रैल 30, 2025", icon: "calendar" },
    { name: "बुद्ध पूर्णिमा", date: "मई 12, 2025", icon: "calendar" },
    { name: "वट सावित्री व्रत", date: "मई 26, 2025", icon: "calendar" },
    { name: "जगन्नाथ रथ यात्रा", date: "जून 26, 2025", icon: "calendar" },
    { name: "गुरु पूर्णिमा", date: "जुलाई 11, 2025", icon: "calendar" },
    { name: "नाग पंचमी", date: "अगस्त 5, 2025", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2025", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 19, 2025", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 26, 2025", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 7, 2025", icon: "calendar" },
    { name: "ओणम", date: "सितंबर 7, 2025", icon: "calendar" },
    { name: "अनंत चतुर्दशी", date: "सितंबर 7, 2025", icon: "calendar" },
    { name: "नवरात्रि प्रारंभ", date: "सितंबर 22, 2025", icon: "calendar" },
    { name: "गांधी जयंती", date: "अक्टूबर 2, 2025", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 1, 2025", icon: "calendar" },
    { name: "शरद पूर्णिमा", date: "अक्टूबर 6, 2025", icon: "calendar" },
    { name: "करवा चौथ", date: "अक्टूबर 10, 2025", icon: "calendar" },
    { name: "धनतेरस", date: "अक्टूबर 20, 2025", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 21, 2025", icon: "diya" },
    { name: "गोवर्धन पूजा", date: "अक्टूबर 22, 2025", icon: "calendar" },
    { name: "भाई दूज", date: "अक्टूबर 23, 2025", icon: "calendar" },
    { name: "छठ पूजा", date: "अक्टूबर 27, 2025", icon: "calendar" },
    { name: "देवउठनी एकादशी", date: "नवंबर 2, 2025", icon: "calendar" },
    { name: "गुरु नानक जयंती", date: "नवंबर 5, 2025", icon: "calendar" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2025", icon: "calendar" },
];

export async function getFestivalsForMonth(year: number, month: number): Promise<Festival[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    return allFestivals.filter(festival => {
        const festivalDate = parseHindiDate(festival.date);
        if (festivalDate) {
            return getYear(festivalDate) === year && getMonth(festivalDate) === month;
        }
        return false;
    });
}
