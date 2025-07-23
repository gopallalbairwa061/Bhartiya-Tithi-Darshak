"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, CalendarHeart } from "lucide-react";
import { DiyaIcon } from "@/components/icons/diya-icon";

const festivals = [
    { name: "दिवाली", date: "नवंबर 1, 2024", icon: "diya" },
    { name: "होली", date: "मार्च 25, 2025", icon: "calendar" },
    { name: "स्वतंत्रता दिवस", date: "अगस्त 15, 2024", icon: "calendar" },
    { name: "जन्माष्टमी", date: "अगस्त 26, 2024", icon: "calendar" },
    { name: "गणेश चतुर्थी", date: "सितंबर 7, 2024", icon: "calendar" },
    { name: "नवरात्रि", date: "अक्टूबर 3, 2024", icon: "calendar" },
    { name: "दशहरा", date: "अक्टूबर 12, 2024", icon: "calendar" },
    { name: "मकर संक्रांति", date: "जनवरी 14, 2025", icon: "calendar" },
    { name: "गणतंत्र दिवस", date: "जनवरी 26, 2025", icon: "calendar" },
    { name: "महा शिवरात्रि", date: "फरवरी 26, 2025", icon: "calendar" },
    { name: "रक्षा बंधन", date: "अगस्त 19, 2024", icon: "calendar" },
];

export function FestivalSearch() {
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
        <CardTitle className="font-headline text-2xl text-accent">त्योहार और कार्यक्रम</CardTitle>
        <div className="relative mt-2">
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
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[430px] pr-4">
          <ul className="space-y-4">
            {filteredFestivals.length > 0 ? (
              filteredFestivals.map((festival) => (
                <li key={festival.name} className="flex items-center gap-4 p-3 rounded-lg hover:bg-background/80 transition-colors duration-200 cursor-pointer">
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
      </CardContent>
    </Card>
  );
}
