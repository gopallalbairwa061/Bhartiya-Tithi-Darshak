"use client";

import { useState, useEffect } from "react";
import { PanchangDetailCard } from "@/components/panchang-detail-card";
import { FestivalSearch } from "@/components/festival-search";
import { SunTimesCard } from "@/components/sun-times-card";
import { ChaughadiyaCard } from "@/components/chaughadiya-card";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { format, getYear, getMonth } from "date-fns";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPanchang, setSelectedPanchang] = useState<PanchangData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setInterval(() => {
      const today = new Date();
      const dateString = today.toLocaleDateString('hi-IN', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
      const timeString = today.toLocaleTimeString('hi-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
      setCurrentDateTime(`${dateString} | ${timeString}`);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const fetchPanchang = async () => {
      setIsLoading(true);
      try {
        const year = getYear(selectedDate);
        const month = getMonth(selectedDate);
        const monthData = await getPanchangForMonth(year, month);
        const dayPanchang = monthData.find(p => p.date === format(selectedDate, "yyyy-MM-dd"));
        setSelectedPanchang(dayPanchang || null);
      } catch (error) {
        console.error("Failed to fetch panchang data for selected date:", error);
        setSelectedPanchang(null);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPanchang();
  }, [selectedDate]);


  const vsDateString = selectedPanchang ? `${selectedPanchang.masa}, ${selectedPanchang.samvat}` : "विक्रम संवत २०८१";

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-accent tracking-tight">
            भारतीय तिथि दर्शक
          </h1>
          <p className="text-lg md:text-xl text-primary mt-2 animate-fade-in">
            {currentDateTime ? `${currentDateTime} | ${vsDateString}` : <span className="inline-block h-6 w-96 bg-primary/20 rounded animate-pulse"></span>}
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            <FestivalSearch onDateSelect={setSelectedDate} />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-8">
            <PanchangDetailCard panchang={selectedPanchang} isLoading={isLoading} />
            <SunTimesCard panchang={selectedPanchang} isLoading={isLoading} />
            <ChaughadiyaCard title="दिन का चौघड़िया" />
            <ChaughadiyaCard title="रात का चौघड़िया" />
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground border-t border-border/50 mt-8">
        <p>&copy; {new Date().getFullYear()} भारतीय तिथि दर्शक। सर्वाधिकार सुरक्षित।</p>
        <p className="mt-2">भारत में निर्मित महेंद्र बैरवा द्वारा</p>
      </footer>
    </div>
  );
}
