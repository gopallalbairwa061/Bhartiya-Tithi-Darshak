
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
    
    // 2030 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2030", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2030", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2030", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 22, 2030", icon: "calendar" },
    { name: "होली", date: "मार्च 3, 2030", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 12, 2030", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 26, 2030", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2030", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 22, 2030", icon: "calendar" },
    { name: "जन्माष्टमी", date: "सितंबर 2, 2030", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 20, 2030", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 8, 2030", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 27, 2030", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2030", icon: "calendar" },
    
    // 2031 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2031", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2031", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2031", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 11, 2031", icon: "calendar" },
    { name: "होली", date: "मार्च 21, 2031", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 1, 2031", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 15, 2031", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2031", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 11, 2031", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 22, 2031", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 9, 2031", icon: "calendar" },
    { name: "दशहरा", date: "सितंबर 27, 2031", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 15, 2031", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2031", icon: "calendar" },
    
    // 2032 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2032", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 15, 2032", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2032", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 28, 2032", icon: "calendar" },
    { name: "होली", date: "मार्च 10, 2032", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 20, 2032", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 4, 2032", icon: "calendar" },
    { name: "रक्षा बंधन", date: "जुलाई 30, 2032", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 10, 2032", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2032", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "अगस्त 28, 2032", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 15, 2032", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 3, 2032", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2032", icon: "calendar" },
    
    // 2033 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2033", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2033", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2033", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 17, 2033", icon: "calendar" },
    { name: "होली", date: "फरवरी 27, 2033", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 8, 2033", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 23, 2033", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2033", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 18, 2033", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 30, 2033", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 16, 2033", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 4, 2033", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 23, 2033", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2033", icon: "calendar" },
    
    // 2034 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2034", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2034", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2034", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 7, 2034", icon: "calendar" },
    { name: "होली", date: "मार्च 18, 2034", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 28, 2034", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 11, 2034", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2034", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 7, 2034", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 18, 2034", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 5, 2034", icon: "calendar" },
    { name: "दशहरा", date: "सितंबर 23, 2034", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 11, 2034", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2034", icon: "calendar" },
    
    // 2035 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2035", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2035", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2035", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 25, 2035", icon: "calendar" },
    { name: "होली", date: "मार्च 7, 2035", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 16, 2035", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 30, 2035", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2035", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 27, 2035", icon: "calendar" },
    { name: "जन्माष्टमी", date: "सितंबर 7, 2035", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 25, 2035", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 12, 2035", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 31, 2035", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2035", icon: "calendar" },
    
    // 2036 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2036", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 15, 2036", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2036", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 14, 2036", icon: "calendar" },
    { name: "होली", date: "मार्च 25, 2036", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 4, 2036", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 19, 2036", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2036", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 15, 2036", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 26, 2036", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 13, 2036", icon: "calendar" },
    { name: "दशहरा", date: "सितंबर 30, 2036", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 18, 2036", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2036", icon: "calendar" },
    
    // 2037 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2037", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2037", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2037", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 4, 2037", icon: "calendar" },
    { name: "होली", date: "मार्च 15, 2037", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 25, 2037", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 8, 2037", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2037", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 4, 2037", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 16, 2037", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 2, 2037", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 19, 2037", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 7, 2037", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2037", icon: "calendar" },
    
    // 2038 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2038", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2038", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2038", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 20, 2038", icon: "calendar" },
    { name: "होली", date: "मार्च 4, 2038", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 13, 2038", icon: "calendar" },
    { name: "हनुमान जयंती", date: "मार्च 28, 2038", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2038", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 23, 2038", icon: "calendar" },
    { name: "जन्माष्टमी", date: "सितंबर 3, 2038", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 22, 2038", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 8, 2038", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 27, 2038", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2038", icon: "calendar" },
    
    // 2039 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2039", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2039", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2039", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 10, 2039", icon: "calendar" },
    { name: "होली", date: "मार्च 22, 2039", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 1, 2039", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 16, 2039", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2039", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 12, 2039", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 24, 2039", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 10, 2039", icon: "calendar" },
    { name: "दशहरा", date: "सितंबर 26, 2039", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 15, 2039", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2039", icon: "calendar" },
    
    // 2040 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2040", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 15, 2040", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2040", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 27, 2040", icon: "calendar" },
    { name: "होली", date: "मार्च 11, 2040", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 20, 2040", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 4, 2040", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2040", icon: "calendar" },
    { name: "रक्षा बंधन", date: "जुलाई 31, 2040", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 11, 2040", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "अगस्त 30, 2040", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 14, 2040", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 2, 2040", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2040", icon: "calendar" },
    
    // 2041 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2041", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2041", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2041", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 15, 2041", icon: "calendar" },
    { name: "होली", date: "मार्च 1, 2041", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 10, 2041", icon: "calendar" },
    { name: "हनुमान जयंती", date: "मार्च 24, 2041", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2041", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 20, 2041", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 31, 2041", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 18, 2041", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 4, 2041", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 23, 2041", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2041", icon: "calendar" },
    
    // 2042 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2042", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2042", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2042", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 6, 2042", icon: "calendar" },
    { name: "होली", date: "मार्च 20, 2042", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 29, 2042", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 13, 2042", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2042", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 9, 2042", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 20, 2042", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 7, 2042", icon: "calendar" },
    { name: "दशहरा", date: "सितंबर 23, 2042", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 11, 2042", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2042", icon: "calendar" },
    
    // 2043 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2043", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2043", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2043", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 24, 2043", icon: "calendar" },
    { name: "होली", date: "मार्च 9, 2043", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 18, 2043", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 2, 2043", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2043", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 28, 2043", icon: "calendar" },
    { name: "जन्माष्टमी", date: "सितंबर 8, 2043", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 27, 2043", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 13, 2043", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 1, 2043", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2043", icon: "calendar" },
    
    // 2044 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2044", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 15, 2044", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2044", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 13, 2044", icon: "calendar" },
    { name: "होली", date: "मार्च 27, 2044", icon: "calendar" },
    { name: "राम नवमी", date: "अप्रैल 5, 2044", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 20, 2044", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2044", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 16, 2044", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 27, 2044", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 15, 2044", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 1, 2044", icon: "calendar" },
    { name: "दिवाली", date: "अक्टूबर 20, 2044", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2044", icon: "calendar" },
    
    // 2045 Festivals
    { name: "नव वर्ष", date: "जनवरी 1, 2045", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2045", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2045", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "मार्च 2, 2045", icon: "calendar" },
    { name: "होली", date: "मार्च 16, 2045", icon: "calendar" },
    { name: "राम नवमी", date: "मार्च 26, 2045", icon: "calendar" },
    { name: "हनुमान जयंती", date: "अप्रैल 9, 2045", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2045", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 5, 2045", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 17, 2045", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 4, 2045", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 20, 2045", icon: "calendar" },
    { name: "दिवाली", date: "नवंबर 8, 2045", icon: "diya" },
    { name: "क्रिसमस", date: "दिसंबर 25, 2045", icon: "calendar" },
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

export async function getFestivalsForYear(year: number): Promise<Festival[]> {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100));

    return allFestivals.filter(festival => {
        const festivalDate = parseHindiDate(festival.date);
        if (festivalDate) {
            return getYear(festivalDate) === year;
        }
        return false;
    });
}
