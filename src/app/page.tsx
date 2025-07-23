"use client";

import { useState, useEffect } from "react";
import { PanchangCard } from "@/components/panchang-card";
import { FestivalSearch } from "@/components/festival-search";
import { SunTimesCard } from "@/components/sun-times-card";

export default function Home() {
  const [currentDate, setCurrentDate] = useState("");

  useEffect(() => {
    const today = new Date();
    const dateString = today.toLocaleDateString('en-GB', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    setCurrentDate(dateString);
  }, []);

  const vsDateString = "Vikram Samvat 2081"; // Mock data

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-headline font-bold text-accent tracking-tight">
            Bharatiya Tithi Darshak
          </h1>
          <p className="text-lg md:text-xl text-primary mt-2 animate-fade-in">
            {currentDate ? `${currentDate} | ${vsDateString}` : <span className="inline-block h-6 w-64 bg-primary/20 rounded animate-pulse"></span>}
          </p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-1 flex flex-col gap-8">
            <PanchangCard />
            <SunTimesCard />
          </div>
          <div className="xl:col-span-2">
            <FestivalSearch />
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground border-t border-border/50 mt-8">
        <p>&copy; {new Date().getFullYear()} Bharatiya Tithi Darshak. All rights reserved.</p>
      </footer>
    </div>
  );
}
