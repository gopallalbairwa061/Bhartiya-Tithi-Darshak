
"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Moon, Star } from "lucide-react";
import { format, getDay, getYear, getMonth } from "date-fns";
import { hi } from "date-fns/locale";
import { DayProps, DayPicker } from "react-day-picker";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";


type Festival = {
  name: string;
  date: string;
  icon: string;
};

interface MonthlyCalendarProps {
  festivals: Festival[];
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


export function MonthlyCalendar({ festivals }: MonthlyCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [panchangData, setPanchangData] = useState<Map<string, PanchangData>>(new Map());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchPanchangData = async () => {
      setIsLoading(true);
      const year = getYear(date);
      const month = getMonth(date);
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
  }, [date]);

  const festivalsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    festivals.forEach((festival) => {
        const d = parseHindiDate(festival.date);
        if (d) {
            const dateStr = format(d, "yyyy-MM-dd");
            if (!map.has(dateStr)) {
                map.set(dateStr, []);
            }
            map.get(dateStr)?.push(festival.name);
        }
    });
    return map;
  }, [festivals]);

  const years = Array.from({ length: 4 }, (_, i) => new Date().getFullYear() - 1 + i); // 2023 to 2026
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i,
    label: format(new Date(2000, i), "LLLL", { locale: hi }),
  }));

  const handleYearChange = (year: string) => {
    const newDate = new Date(date);
    newDate.setFullYear(parseInt(year, 10));
    setDate(newDate);
  };

  const handleMonthChange = (month: string) => {
    const newDate = new Date(date);
    newDate.setMonth(parseInt(month, 10));
    setDate(newDate);
  };
  
  const selectedDayPanchang = panchangData.get(format(date, "yyyy-MM-dd"));

  const DayWithDetails = (props: DayProps) => {
    const dateStr = format(props.date, "yyyy-MM-dd");
    const dayFestivals = festivalsByDate.get(dateStr);
    const dayPanchang = panchangData.get(dateStr);
    const dayNumber = props.date.getDate().toLocaleString('hi-IN');

    return (
      <div className="relative h-full w-full flex flex-col items-center justify-start p-1 gap-0.5">
        <div className="flex-grow-0 font-semibold">{dayNumber}</div>
        {isLoading ? (
            <div className="flex-grow flex flex-col justify-center items-center w-full gap-1">
                <Skeleton className="h-2 w-10/12" />
                <Skeleton className="h-2 w-8/12" />
            </div>
        ) : (
            dayPanchang && (
            <div className="flex-grow text-[10px] text-muted-foreground leading-tight text-center">
              <p className="truncate">{dayPanchang.tithi.split(', ')[1]}</p>
              <p className="truncate">{dayPanchang.nakshatra}</p>
            </div>
          )
        )}
        {dayFestivals && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
            {dayFestivals.slice(0, 3).map((_, index) => (
                <div key={index} className="h-1.5 w-1.5 rounded-full bg-primary" />
            ))}
          </div>
        )}
      </div>
    );
  };
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 rounded-md bg-background/50">
        <Button variant="outline" size="icon" onClick={() => setDate(d => new Date(d.setMonth(d.getMonth() - 1)))}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="flex items-center gap-2">
            <Select value={date.getMonth().toString()} onValueChange={handleMonthChange}>
                <SelectTrigger className="w-[120px] font-semibold text-base">
                    <SelectValue placeholder="माह" />
                </SelectTrigger>
                <SelectContent>
                    {months.map(month => (
                        <SelectItem key={month.value} value={month.value.toString()}>{month.label}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
            <Select value={date.getFullYear().toString()} onValueChange={handleYearChange}>
                <SelectTrigger className="w-[100px] font-semibold text-base">
                    <SelectValue placeholder="वर्ष" />
                </SelectTrigger>
                <SelectContent>
                    {years.map(year => (
                        <SelectItem key={year} value={year.toString()}>{year.toLocaleString('hi-IN')}</SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
        <Button variant="outline" size="icon" onClick={() => setDate(d => new Date(d.setMonth(d.getMonth() + 1)))}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <Calendar
        mode="single"
        selected={date}
        onSelect={(d) => d && setDate(d)}
        month={date}
        onMonthChange={setDate}
        locale={hi}
        className="rounded-md border p-0"
        classNames={{
            months: "p-0",
            month: "p-3",
            caption: "hidden",
            head_cell: "w-12 sm:w-14 md:w-16 text-muted-foreground font-medium",
            cell: "h-20 sm:h-24 md:h-28 text-center text-sm p-0 relative",
            day: "h-full w-full p-1",
            day_selected: "bg-primary/20 text-primary-foreground rounded-md",
            day_today: "bg-accent/50 text-accent-foreground rounded-md",
            day_outside: "text-muted-foreground/50",
        }}
        components={{
            Day: DayWithDetails
        }}
        footer={
            <div className="p-3 border-t text-sm space-y-2">
                <div className="space-y-1">
                    <strong className="font-semibold">{format(date, "d MMMM, yyyy", { locale: hi })}</strong> 
                    {isLoading ? <Skeleton className="h-4 w-48 mt-1" /> : (
                        selectedDayPanchang && (
                        <div className="text-muted-foreground flex flex-wrap items-center gap-x-4 gap-y-1">
                            <span className="flex items-center gap-1.5"><Moon size={14} className="text-primary"/> {selectedDayPanchang.tithi}</span>
                            <span className="flex items-center gap-1.5"><Star size={14} className="text-primary"/> {selectedDayPanchang.nakshatra}</span>
                        </div>
                    ))}
                </div>
                <Separator/>
                <div>
                  <strong className="font-semibold">त्योहार:</strong> 
                  <p className="text-muted-foreground">{festivalsByDate.get(format(date, "yyyy-MM-dd"))?.join(", ") || "कोई नहीं"}</p>
                </div>
            </div>
        }
      />
    </div>
  );
}
