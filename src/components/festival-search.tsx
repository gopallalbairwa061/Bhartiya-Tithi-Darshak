
"use client";

import { useState, useMemo, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, CalendarHeart } from "lucide-react";
import { DiyaIcon } from "@/components/icons/diya-icon";
import { MonthlyCalendar } from "./monthly-calendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getFestivalsForMonth, getFestivalsForYear, Festival } from "@/services/festivals";
import { getYear, getMonth, format } from "date-fns";

interface FestivalSearchProps {
  onDateSelect: (date: Date) => void;
}

export function FestivalSearch({ onDateSelect }: FestivalSearchProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [monthlyFestivals, setMonthlyFestivals] = useState<Festival[]>([]);
  const [yearlyFestivals, setYearlyFestivals] = useState<Festival[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isYearlyLoading, setIsYearlyLoading] = useState(true);

  useEffect(() => {
    const fetchMonthlyFestivals = async () => {
        setIsLoading(true);
        try {
            const year = getYear(currentDate);
            const month = getMonth(currentDate);
            const festivals = await getFestivalsForMonth(year, month);
            setMonthlyFestivals(festivals);
        } catch (error) {
            console.error("Failed to fetch monthly festivals:", error);
            setMonthlyFestivals([]);
        } finally {
            setIsLoading(false);
        }
    };
    fetchMonthlyFestivals();
  }, [currentDate]);

  useEffect(() => {
    const fetchYearlyFestivals = async () => {
        setIsYearlyLoading(true);
        try {
            const year = getYear(new Date());
            const festivals = await getFestivalsForYear(year);
            setYearlyFestivals(festivals);
        } catch (error) {
            console.error("Failed to fetch yearly festivals:", error);
            setYearlyFestivals([]);
        } finally {
            setIsYearlyLoading(false);
        }
    };
    fetchYearlyFestivals();
  }, []);


  const filteredFestivals = useMemo(() => {
    if (!searchTerm) {
      return yearlyFestivals;
    }
    return yearlyFestivals.filter((festival) =>
      festival.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, yearlyFestivals]);
  
  const getIcon = (iconName: string) => {
    if (iconName === "diya") {
      return <DiyaIcon className="h-8 w-8 text-chart-5" />;
    }
    return <CalendarHeart className="h-8 w-8 text-chart-4" />;
  };

  return (
    <Card className="w-full h-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">मासिक कैलेंडर और त्यौहार</CardTitle>
      </CardHeader>
      <CardContent>
         <Tabs defaultValue="calendar">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="calendar">मासिक कैलेंडर</TabsTrigger>
            <TabsTrigger value="search">त्योहार खोजें</TabsTrigger>
          </TabsList>
          <TabsContent value="calendar" className="mt-4">
            <MonthlyCalendar 
              festivals={monthlyFestivals} 
              onDateSelect={onDateSelect} 
              onMonthChange={setCurrentDate}
              currentMonth={currentDate}
            />
          </TabsContent>
          <TabsContent value="search" className="mt-4">
            <div className="relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  type="search"
                  aria-label="त्योहारों या कार्यक्रमों के लिए खोजें"
                  placeholder="इस वर्ष के त्यौहार, व्रत और छुट्टियां खोजें..."
                  className="pl-11 h-11 text-base"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <ScrollArea className="h-[calc(100vh-32rem)] min-h-[400px] pr-4 mt-4">
              <ul className="space-y-4">
                {isYearlyLoading ? (
                    <div className="flex flex-col items-center justify-center h-48 text-center">
                        <p className="text-muted-foreground">इस वर्ष के त्यौहार लोड हो रहे हैं...</p>
                    </div>
                ) : filteredFestivals.length > 0 ? (
                  filteredFestivals.map((festival) => (
                    <li key={`${festival.name}-${festival.date}`} className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors duration-200 cursor-pointer">
                      {getIcon(festival.icon)}
                      <div>
                        <p className="font-semibold text-lg text-chart-1">{festival.name}</p>
                        <p className="text-muted-foreground">{festival.date}</p>
                      </div>
                    </li>
                  ))
                ) : (
                  <div className="flex flex-col items-center justify-center h-48 text-center">
                    <Search className="h-12 w-12 text-muted-foreground/50 mb-4" />
                    <p className="text-muted-foreground">
                        {searchTerm ? `"${searchTerm}" से कोई त्यौहार नहीं मिला।` : "इस वर्ष के लिए कोई त्यौहार नहीं मिला।"}
                    </p>
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
