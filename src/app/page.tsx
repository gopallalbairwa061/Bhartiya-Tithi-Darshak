"use client";

import { useState, useEffect } from "react";
import { PanchangCard } from "@/components/panchang-card";
import { FestivalSearch } from "@/components/festival-search";
import { SunTimesCard } from "@/components/sun-times-card";
import { ChaughadiyaCard } from "@/components/chaughadiya-card";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");

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

  const vsDateString = "विक्रम संवत २०८१";

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
          <div className="xl:col-span-1 flex flex-col gap-8">
            <PanchangCard />
            <SunTimesCard />
            <ChaughadiyaCard title="दिन का चौघड़िया" />
            <ChaughadiyaCard title="रात का चौघड़िया" />
          </div>
          <div className="xl:col-span-2">
            <FestivalSearch />
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
