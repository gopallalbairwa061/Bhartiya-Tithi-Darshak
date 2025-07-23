
'use server';

import { format, eachDayOfInterval, startOfMonth, endOfMonth, differenceInDays, startOfYear, getDay } from 'date-fns';
import { hi } from 'date-fns/locale';

interface Detail {
  name: string;
  endTime: string;
}

interface Muhurat {
    name: string;
    start: string;
    end: string;
}

export interface PanchangData {
  date: string; // "yyyy-MM-dd"
  samvat: string;
  masa: string;
  tithi: string;
  paksha: string;
  nakshatra: Detail;
  yoga: Detail;
  karana: Detail;
  sunrise: string;
  sunset: string;
  rahuKaal: Muhurat;
  gulikaKaal: Muhurat;
  yamagandam: Muhurat;
  abhijitMuhurat: Muhurat;
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

const purnimantaMasas = [
    "चैत्र", "वैशाख", "ज्येष्ठ", "आषाढ़", "श्रावण", "भाद्रपद",
    "अश्विन", "कार्तिक", "मार्गशीर्ष", "पौष", "माघ", "फाल्गुन"
];

const aharGanaBaseDate = new Date(2024, 0, 1);
const baseTithiIndex = 19;
const baseNakshatraIndex = 13;
const baseYogaIndex = 3;
const baseMasaIndex = 9; // Pausha
const baseSamvat = 2080;

const tithiDuration = 0.98;
const nakshatraDuration = 1.02;
const yogaDuration = 0.95;

const formatTime = (decimalHours: number) => {
    const totalMinutes = Math.floor(decimalHours * 60);
    const hours = Math.floor(totalMinutes / 60) % 24;
    const minutes = totalMinutes % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
};

const formatMuhuratTime = (decimalHours: number) => {
    let period = "सुबह";
    if (decimalHours >= 12) period = "दोपहर";
    if (decimalHours >= 16) period = "शाम";
    if (decimalHours >= 20 || decimalHours < 4) period = "रात";
    
    const displayHour = Math.floor(decimalHours) % 12 === 0 ? 12 : Math.floor(decimalHours) % 12;
    const minutes = Math.floor((decimalHours % 1) * 60);

    return `${period} ${displayHour.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

const formatEndTime = (decimalHours: number) => {
    return `${formatMuhuratTime(decimalHours)} तक`;
};

// Calculates muhurats based on sunrise, sunset and day of the week
const calculateMuhurats = (date: Date, sunrise: number, sunset: number) => {
    const dayOfWeek = getDay(date); // Sunday is 0
    const dayDuration = sunset - sunrise;
    const partDuration = dayDuration / 8;

    const rahukalamMap = [10.5, 7.5, 12, 13.5, 9, 6, 4.5]; // in hours from sunrise for Sun to Sat
    const yamagandamMap = [12, 10.5, 9, 7.5, 6, 4.5, 3];
    const gulikakalamMap = [9, 7.5, 6, 4.5, 3, 1.5, 0];

    const rahuStart = sunrise + rahukalamMap[dayOfWeek];
    const rahuEnd = rahuStart + 1.5;

    const yamaStart = sunrise + yamagandamMap[dayOfWeek];
    const yamaEnd = yamaStart + 1.5;

    const gulikaStart = sunrise + gulikakalamMap[dayOfWeek];
    const gulikaEnd = gulikaStart + 1.5;
    
    const abhijitStart = sunrise + (dayDuration / 2) - (partDuration / 2);
    const abhijitEnd = abhijitStart + partDuration;

    return {
        rahuKaal: { name: "राहु काल", start: formatTime(rahuStart), end: formatTime(rahuEnd) },
        yamagandam: { name: "यमगण्डम", start: formatTime(yamaStart), end: formatTime(yamaEnd) },
        gulikaKaal: { name: "गुलिक काल", start: formatTime(gulikaStart), end: formatTime(gulikaEnd) },
        abhijitMuhurat: { name: "अभिजीत मुहूर्त", start: formatTime(abhijitStart), end: formatTime(abhijitEnd) },
    };
};


export async function getPanchangForMonth(year: number, month: number): Promise<PanchangData[]> {
  const startDate = startOfMonth(new Date(year, month));
  const endDate = endOfMonth(startDate);
  const dates = eachDayOfInterval({ start: startDate, end: endDate });

  return dates.map((date) => {
    const daysSinceBase = differenceInDays(date, aharGanaBaseDate);

    const tithiProgress = daysSinceBase / tithiDuration;
    const tithiIndex = Math.floor(baseTithiIndex + tithiProgress) % tithis.length;
    const nakshatraIndex = Math.floor(baseNakshatraIndex + (daysSinceBase / nakshatraDuration)) % nakshatras.length;
    const yogaIndex = Math.floor(baseYogaIndex + (daysSinceBase / yogaDuration)) % yogas.length;
    
    const samvatYearsPassed = Math.floor((baseTithiIndex + tithiProgress) / tithis.length / 12);
    const samvat = baseSamvat + samvatYearsPassed;
    const masaIndex = Math.floor(baseMasaIndex + ((baseTithiIndex + tithiProgress) / tithis.length)) % purnimantaMasas.length;

    const karanaBaseIndex = tithiIndex * 2;
    const karanaIndex1 = karanaBaseIndex % karanas.length;
    const karanaIndex2 = (karanaBaseIndex + 1) % karanas.length;

    const paksha = tithiIndex < 15 ? "शुक्ल पक्ष" : "कृष्ण पक्ष";

    const dayOfYear = differenceInDays(date, startOfYear(date));
    const seasonalFactor = Math.sin((dayOfYear - 80) * (2 * Math.PI) / 365.25);
    
    const sunriseBase = 6.0;
    const sunsetBase = 18.0;
    const sunriseHour = sunriseBase - seasonalFactor;
    const sunsetHour = sunsetBase + seasonalFactor;
    
    const muhurats = calculateMuhurats(date, sunriseHour, sunsetHour);

    const tithiEndTimeDecimal = (tithiProgress % 1) * 24;
    const nakshatraEndTimeDecimal = ((daysSinceBase / nakshatraDuration) % 1) * 24;
    const yogaEndTimeDecimal = ((daysSinceBase / yogaDuration) % 1) * 24;
    const karanaEndTimeDecimal = ((tithiProgress * 2) % 1) * 12;

    return {
      date: format(date, 'yyyy-MM-dd'),
      samvat: `विक्रम संवत ${samvat.toLocaleString('hi-IN', { useGrouping: false })}`,
      masa: purnimantaMasas[masaIndex],
      paksha: paksha,
      tithi: `${paksha}, ${tithis[tithiIndex]}`,
      nakshatra: {
        name: nakshatras[nakshatraIndex],
        endTime: formatEndTime(nakshatraEndTimeDecimal)
      },
      yoga: {
        name: yogas[yogaIndex],
        endTime: formatEndTime(yogaEndTimeDecimal)
      },
      karana: {
        name: `${karanas[karanaIndex1]}, ${karanas[karanaIndex2]}`,
        endTime: formatEndTime(karanaEndTimeDecimal)
      },
      sunrise: formatMuhuratTime(sunriseHour),
      sunset: formatMuhuratTime(sunsetHour),
      ...muhurats
    };
  });
}
