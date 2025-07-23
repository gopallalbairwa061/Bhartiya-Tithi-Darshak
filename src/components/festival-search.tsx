
"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, CalendarHeart } from "lucide-react";
import { DiyaIcon } from "@/components/icons/diya-icon";
import { MonthlyCalendar } from "./monthly-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const festivals = [
    // 2024 Festivals (Existing + Additions)
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

    // 2025 Festivals (Comprehensive List)
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

interface FestivalSearchProps {
  onDateSelect: (date: Date) => void;
}

export function FestivalSearch({ onDateSelect }: FestivalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredFestivals = useMemo(() => {
    if (!searchTerm) return festivals;
    return festivals.filter((festival) =>
      festival.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm]);
  
  const getIcon = (iconName: string) => {
    if (iconName === "diya") {
      return <DiyaIcon className="h-8 w-8 text-primary" />;
    }
    return <CalendarHeart className="h-8 w-8 text-primary" />;
  };

  return (
    <Card className="w-full h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">मासिक कैलेंडर</CardTitle>
      </CardHeader>
      <CardContent>
         <Tabs defaultValue="calendar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">मासिक कैलेंडर</TabsTrigger>
            <TabsTrigger value="search">त्योहार खोजें</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-4">
            <MonthlyCalendar festivals={festivals} onDateSelect={onDateSelect} />
          </TabsContent>
          <TabsContent value="search" className="mt-4">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  aria-label="त्योहारों या कार्यक्रमों के लिए खोजें"
                  placeholder="त्योहार या कार्यक्रम खोजें..."
                  className="pl-11 h-11 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ScrollArea className="h-[calc(100vh-32rem)] min-h-[400px] pr-4 mt-4">
              <ul className="space-y-4">
                {filteredFestivals.length > 0 ? (
                  filteredFestivals.map((festival) => (
                    <li key={`${festival.name}-${festival.date}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                      {getIcon(festival.icon)}
                      <div>
                        <p className="font-semibold text-lg">{festival.name}</p>
                        <p className="text-muted-foreground">{festival.date}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">आपकी खोज से कोई त्योहार मेल नहीं खाता।</p>
                  </div>
                )}
              </ul>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
