
"use client";

import { useState, useMemo, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Moon, Star, Sun, Sunset, Link as LinkIcon, CalendarDays } from "lucide-react";
import { format, getYear, getMonth, set, getDay } from "date-fns";
import { hi } from "date-fns/locale";
import { DayProps } from "react-day-picker";
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

  const DayWithDetails = (props: DayProps) => {
    const dateStr = format(props.date, "yyyy-MM-dd");
    const dayFestivals = festivalsByDate.get(dateStr);
    const dayPanchang = panchangData.get(dateStr);
    const dayNumber = props.date.getDate();
    const isSunday = getDay(props.date) === 0;

    return (
      <div className="relative h-full w-full flex flex-col justify-between p-1.5 text-left">
        {isLoading ? (
            <div className="flex flex-col gap-1.5">
                <Skeleton className="h-2.5 w-10/12" />
                <Skeleton className="h-8 w-6 mx-auto" />
                <Skeleton className="h-2 w-full" />
                <Skeleton className="h-2 w-8/12" />
            </div>
        ) : dayPanchang && (
            <>
                <div className="text-[10px] text-muted-foreground leading-tight">
                    <span>{dayPanchang.paksha === "शुक्ल पक्ष" ? 'शु' : 'कृ'} {dayPanchang.tithi.split(', ')[1].split(' ')[0]}</span>
                    <span> / {dayPanchang.tithiNumber}</span>
                </div>

                <div className="flex-grow flex flex-col items-center justify-center">
                    <span className="text-xs text-muted-foreground">{format(props.date, 'cccc', { locale: hi })}</span>
                    <span className={cn("text-3xl lg:text-4xl font-bold", isSunday && "text-destructive")}>{dayNumber.toLocaleString('hi-IN')}</span>
                     {dayFestivals && dayFestivals.map(f => (
                        <span key={f.name} className="mt-1 text-[10px] font-semibold text-red-500 leading-tight tracking-tighter text-center">
                           {f.name}
                        </span>
                    ))}
                </div>

                <div className="text-[10px] text-muted-foreground leading-tight text-center">
                    <span>• {dayPanchang.rashi} {dayPanchang.nakshatra.endTime.split(' ')[1]}</span>
                    <span className="font-sans"> ☆ </span>
                    <span>{dayPanchang.nakshatra.name}</span>
                </div>
            </>
        )}
      </div>
    );
  };
  
  const renderPanchangDetail = (icon: React.ReactNode, label: string, value?: string) => {
    if (isLoading && !selectedDayPanchang) return <div className="flex items-start gap-3"><Skeleton className="h-6 w-6 rounded-full" /><div className="space-y-1.5"><Skeleton className="h-4 w-16" /><Skeleton className="h-3 w-32" /></div></div>;
    if (!value) return null;
    return (
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 text-primary">{icon}</div>
        <div>
          <p className="font-semibold text-sm leading-tight">{label}</p>
          <p className="text-muted-foreground text-sm">{value}</p>
        </div>
      </div>
    );
  };

  const formatWeekdayName = (day: Date) => {
    return format(day, 'E', { locale: hi });
  };


  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center p-2 rounded-md bg-background/50">
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
      <Calendar
        mode="single"
        selected={selectedDate}
        onSelect={(d) => d && setSelectedDate(d)}
        month={currentMonth}
        onMonthChange={setCurrentMonth}
        locale={hi}
        formatters={{ formatWeekdayName }}
        className="rounded-md p-0"
        classNames={{
            months: "p-0",
            month: "p-3",
            caption: "hidden",
            head_row: "hidden",
            head_cell: "w-full text-muted-foreground font-medium",
            cell: "h-36 text-center text-sm p-0 relative first:border-l",
            row: "flex w-full border-r",
            day: "h-full w-full p-0",
            day_selected: "bg-primary/20 text-primary-foreground rounded-none",
            day_today: "bg-accent/50 text-accent-foreground rounded-none",
            day_outside: "text-muted-foreground/50 bg-background/50",
        }}
        components={{
            Day: DayWithDetails
        }}
        footer={
          <div className="p-4 border-t space-y-4">
            <div>
              <strong className="font-semibold text-lg">{format(selectedDate, "d MMMM, yyyy", { locale: hi })}</strong>
              <Separator className="my-2" />
              <div className="space-y-1">
                <strong className="font-semibold text-sm">त्योहार:</strong> 
                <p className="text-muted-foreground text-sm">{festivalsByDate.get(format(selectedDate, "yyyy-MM-dd"))?.map(f => f.name).join(", ") || "कोई नहीं"}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-x-4 gap-y-4">
              {renderPanchangDetail(<Moon size={20} />, "तिथि", selectedDayPanchang?.tithi)}
              {renderPanchangDetail(<Star size={20} />, "नक्षत्र", selectedDayPanchang ? `${selectedDayPanchang.nakshatra.name} ${selectedDayPanchang.nakshatra.endTime}`: undefined)}
              {renderPanchangDetail(<LinkIcon size={20} />, "योग", selectedDayPanchang ? `${selectedDayPanchang.yoga.name} ${selectedDayPanchang.yoga.endTime}`: undefined)}
              {renderPanchangDetail(<CalendarDays size={20} />, "करण", selectedDayPanchang ? `${selectedDayPanchang.karana.name} ${selectedDayPanchang.karana.endTime}`: undefined)}
              {renderPanchangDetail(<Sun size={20} />, "सूर्योदय", selectedDayPanchang?.sunrise)}
              {renderPanchangDetail(<Sunset size={20} />, "सूर्यास्त", selectedDayPanchang?.sunset)}
            </div>
          </div>
        }
      />
    </div>
  );
}

    
