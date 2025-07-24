
"use client";

import { useState, useMemo, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, getYear, getMonth, getDay, eachDayOfInterval, startOfMonth, endOfMonth, isSameMonth, isToday } from "date-fns";
import { hi } from "date-fns/locale";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Festival } from "@/services/festivals";
import { CalendarHeart, Star, Moon } from "lucide-react";
import { DiyaIcon } from "./icons/diya-icon";


interface MonthlyCalendarProps {
  festivals: Festival[];
  onDateSelect: (date: Date) => void;
  onMonthChange: (date: Date) => void;
  currentMonth: Date;
}

// This was moved from festivals.ts to avoid the server action error
const parseHindiDate = (dateString: string): Date | null => {
  const monthMap: { [key: string]: number } = {
    'जनवरी': 0, 'फरवरी': 1, 'मार्च': 2, 'अप्रैल': 3, 'मई': 4, 'जून': 5,
    'जुलाई': 6, 'अगस्त': 7, 'सितंबर': 8, 'अक्टूबर': 9, 'नवंबर': 10, 'दिसंबर': 11
  };
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


export function MonthlyCalendar({ festivals, onDateSelect, onMonthChange, currentMonth }: MonthlyCalendarProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [panchangData, setPanchangData] = useState<Map<string, PanchangData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only fetch if the new month is different from the current panchang month
    const currentPanchangMonth = panchangData.size > 0 ? new Date(panchangData.keys().next().value) : null;
    if (!currentPanchangMonth || !isSameMonth(currentMonth, currentPanchangMonth)) {
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
    }
  }, [currentMonth, panchangData]);

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
    onMonthChange(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(currentMonth);
    newDate.setMonth(parseInt(month, 10));
    onMonthChange(newDate);
  };
  
  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getFestivalIcon = (iconName: string) => {
    if (iconName === "diya") {
      return <DiyaIcon className="h-4 w-4 text-chart-5" />;
    }
    return <CalendarHeart className="h-4 w-4 text-chart-4" />;
  };

  const DayWithDetails = ({ date }: { date: Date }) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayFestivals = festivalsByDate.get(dateStr);
    const dayPanchang = panchangData.get(dateStr);
    const dayNumber = date.getDate();
    const isSunday = getDay(date) === 0;
    const isSelected = format(date, "yyyy-MM-dd") === format(selectedDate, "yyyy-MM-dd");
    const isCurrentDate = isToday(date);

    return (
       <div
        onClick={() => setSelectedDate(date)}
        className={cn(
            "flex w-full border-b border-border/50 p-4 gap-4 cursor-pointer hover:bg-muted/50 transition-colors duration-200",
            isSelected && "bg-primary/10",
            isSunday && !isSelected && "bg-destructive/5",
            isCurrentDate && "bg-accent/10"
        )}
      >
        <div className="flex flex-col items-center justify-center w-24">
            <span className={cn("text-5xl font-bold tracking-tighter text-chart-1", isSunday && "text-destructive", isCurrentDate && "text-accent")}>
                {dayNumber.toLocaleString('hi-IN')}
            </span>
            <span className="text-sm font-medium text-muted-foreground -mt-1">{format(date, 'cccc', { locale: hi })}</span>
        </div>

        <div className="flex-grow space-y-1.5 text-base">
             {isLoading ? (
                <div className="space-y-2 py-1">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-5 w-2/3" />
                </div>
            ) : dayPanchang ? (
                <>
                   <p className="flex items-center gap-2 text-chart-2"><Moon size={16}/> <strong className="font-semibold text-foreground/80">तिथि:</strong> {dayPanchang.tithi}</p>
                   <p className="flex items-center gap-2 text-chart-3"><Star size={16}/> <strong className="font-semibold text-foreground/80">नक्षत्र:</strong> {dayPanchang.nakshatra.name}</p>
                   {dayFestivals && dayFestivals.length > 0 && (
                        <div className="flex flex-wrap gap-2 pt-1">
                            {dayFestivals.map(f => (
                                <div key={f.name} className="flex items-center gap-1.5 p-1 px-2 text-sm rounded-full bg-primary/10 text-chart-5 font-bold">
                                    {getFestivalIcon(f.icon)}
                                    <span>{f.name}</span>
                                </div>
                            ))}
                        </div>
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
        <Button variant="outline" size="icon" onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() - 1)))}>
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
        <Button variant="outline" size="icon" onClick={() => onMonthChange(new Date(currentMonth.setMonth(currentMonth.getMonth() + 1)))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      
      <div className="border border-border/50 rounded-md max-h-[calc(100vh-32rem)] min-h-[400px] overflow-y-auto">
        {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="flex w-full border-b border-border/50 p-4 gap-4">
                    <div className="flex flex-col items-center justify-center w-24">
                        <Skeleton className="h-12 w-16" />
                        <Skeleton className="h-4 w-20 mt-2" />
                    </div>
                    <div className="flex-grow space-y-2 py-1">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-5 w-1/2" />
                        <Skeleton className="h-5 w-2/3" />
                    </div>
                </div>
            ))
        ) : (
            daysInMonth.map((day) => (
                <DayWithDetails key={day.toISOString()} date={day} />
            ))
        )}
      </div>
    </div>
  );
}
