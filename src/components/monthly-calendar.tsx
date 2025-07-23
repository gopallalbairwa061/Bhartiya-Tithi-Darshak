
"use client";

import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import { hi } from "date-fns/locale";

type Festival = {
  name: string;
  date: string;
  icon: string;
};

interface MonthlyCalendarProps {
  festivals: Festival[];
}

// Helper to parse dates like "नवंबर 1, 2024" which is not standard
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
  // Try standard parsing as a fallback
  const parsedDate = new Date(dateString);
  if (!isNaN(parsedDate.getTime())) {
    return parsedDate;
  }
  return null;
};


export function MonthlyCalendar({ festivals }: MonthlyCalendarProps) {
  const [date, setDate] = useState<Date>(new Date());

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

  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i);
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

  const DayWithFestival = ({ date, ...props }: { date: Date } & any) => {
    const dateStr = format(date, "yyyy-MM-dd");
    const dayFestivals = festivalsByDate.get(dateStr);

    return (
      <div {...props} className="relative">
        {props.children}
        {dayFestivals && (
          <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 flex space-x-0.5">
            {dayFestivals.slice(0, 3).map((_, index) => (
                <div key={index} className="h-1 w-1 rounded-full bg-primary" />
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
                        <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
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
            head_cell: "w-10 sm:w-12 md:w-14",
            cell: "h-12 sm:h-14 md:h-16 text-center text-sm p-0 relative",
            day: "h-full w-full p-1",
        }}
        components={{
            Day: DayWithFestival
        }}
        footer={
            <div className="p-3 border-t text-sm">
                <strong>आज के त्यौहार:</strong> {festivalsByDate.get(format(date, "yyyy-MM-dd"))?.join(", ") || "कोई नहीं"}
            </div>
        }
      />
    </div>
  );
}
