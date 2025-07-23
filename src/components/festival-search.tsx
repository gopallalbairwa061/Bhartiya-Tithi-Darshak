"use client";

import { useState, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, CalendarHeart } from "lucide-react";
import { DiyaIcon } from "@/components/icons/diya-icon";

const festivals = [
    { name: "Diwali", date: "November 1, 2024", icon: "diya" },
    { name: "Holi", date: "March 25, 2025", icon: "calendar" },
    { name: "Independence Day", date: "August 15, 2024", icon: "calendar" },
    { name: "Janmashtami", date: "August 26, 2024", icon: "calendar" },
    { name: "Ganesh Chaturthi", date: "September 7, 2024", icon: "calendar" },
    { name: "Navratri", date: "October 3, 2024", icon: "calendar" },
    { name: "Dussehra", date: "October 12, 2024", icon: "calendar" },
    { name: "Makar Sankranti", date: "January 14, 2025", icon: "calendar" },
    { name: "Republic Day", date: "January 26, 2025", icon: "calendar" },
    { name: "Maha Shivaratri", date: "February 26, 2025", icon: "calendar" },
    { name: "Raksha Bandhan", date: "August 19, 2024", icon: "calendar" },
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
        <CardTitle className="font-headline text-2xl text-accent">Festivals & Events</CardTitle>
        <div className="relative mt-2">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <Input
              type="search"
              aria-label="Search for festivals or events"
              placeholder="Search for a festival or event..."
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
                <p className="text-muted-foreground">No festivals found matching your search.</p>
              </div>
            )}
          </ul>
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
