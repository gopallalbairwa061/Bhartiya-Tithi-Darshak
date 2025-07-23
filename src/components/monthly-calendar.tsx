
"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Moon, Star, Sun, Sunset, Link as LinkIcon, CalendarDays } from "lucide-react";
import { format, getYear, getMonth, set, getDay, eachDayOfInterval, startOfMonth, endOfMonth } from "date-fns";
import { hi } from "date-fns/locale";
import { DayProps, useDayPicker, useNavigation } from "react-day-picker";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";


type Festival = {
  name: string;
  date: string;
  icon: string;
};

interface MonthlyCalendarProps {
  festivals: Festival[];
  onDateSelect: (date: Date) => void;
}

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
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  return null;
};


export function MonthlyCalendar({ festivals, onDateSelect }: MonthlyCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [panchangData, setPanchangData] = useState<Map<string, PanchangData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPanchangData = async () => {
      setIsLoading(true);
      const year = getYear(currentMonth);
      const month = getMonth(currentMonth);
      try {
        const data = await getPanchangForMonth(year, month);
        const map = new Map<string, PanchangData>();
        data.forEach(p => map.set(p.date, p));
        setPanchangData(map);
      } catch (error) {
        console.error("Failed to fetch panchang data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPanchangData();
  }, [currentMonth]);

  useEffect(() => {
    onDateSelect(selectedDate);
  }, [selectedDate, onDateSelect]);


  const festivalsByDate = useMemo(() => {
    const map = new Map<string, Festival[]>();
    festivals.forEach((festival) => {
        const d = parseHindiDate(festival.date);
        if (d) {
            const dateStr = format(d, "yyyy-MM-dd");
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)?.push(festival);
        }
    });
    return map;
  }, [festivals]);

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i), "LLLL", { locale: hi }),
  }));

  const handleYearChange = (year: string) => {
    const newDate = new Date(currentMonth);
    newDate.setFullYear(parseInt(year, 10));
    setCurrentMonth(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(month, 10));
    setCurrentMonth(newDate);
  };
  
  const selectedDayPanchang = panchangData.get(format(selectedDate, "yyyy-MM-dd"));

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const DayWithDetails = ({ date }: { date: Date }) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayFestivals = festivalsByDate.get(dateStr);
    const dayPanchang = panchangData.get(dateStr);
    const dayNumber = date.getDate();
    const isSunday = getDay(date) === 0;
    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");

    return (
       <div
        onClick={() => setSelectedDate(date)}
        className={cn(
            "flex w-full border-b p-4 gap-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200",
            isSelected && "bg-primary/20",
            isSunday && !isSelected && "bg-destructive/5"
        )}
      >
        <div className="flex flex-col items-center justify-center w-24">
            <span className={cn("text-5xl font-bold tracking-tighter", isSunday && "text-destructive")}>
                {dayNumber.toLocaleString('hi-IN')}
            </span>
            <span className="text-sm font-medium text-muted-foreground -mt-1">{format(date, 'cccc', { locale: hi })}</span>
        </div>

        <div className="flex-grow space-y-1.5 text-sm">
             {isLoading ? (
                <div className="space-y-2">
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                    <Skeleton className="h-4 w-2/3" />
                </div>
            ) : dayPanchang ? (
                <>
                   <p><strong className="font-semibold">तिथि:</strong> {dayPanchang.tithi}</p>
                   <p><strong className="font-semibold">नक्षत्र:</strong> {dayPanchang.nakshatra.name} ({dayPanchang.nakshatra.endTime})</p>
                   {dayFestivals && dayFestivals.length > 0 && (
                        <p className="font-bold text-primary">{dayFestivals.map(f => f.name).join(', ')}</p>
                    )}
                </>
            ) : (
                <p>कोई डेटा नहीं</p>
            )}
        </div>
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 rounded-md bg-muted/50">
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(d => new Date(d.setMonth(d.getMonth() - 1)))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
            <Select value={currentMonth.getMonth().toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[120px] font-semibold text-base">
                    <SelectValue placeholder="माह" />
                </SelectTrigger>
                <SelectContent>
                    {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={currentMonth.getFullYear().toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px] font-semibold text-base">
                    <SelectValue placeholder="वर्ष" />
                </SelectTrigger>
                <SelectContent>
                    {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year.toLocaleString('hi-IN', { useGrouping: false })}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <Button variant="outline" size="icon" onClick={() => setCurrentMonth(d => new Date(d.setMonth(d.getMonth() + 1)))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border rounded-md max-h-[calc(100vh-32rem)] min-h-[400px] overflow-y-auto">
        {daysInMonth.map((day) => (
            <DayWithDetails key={day.toISOString()} date={day} />
        ))}
      </div>
    </div>
  );
}
