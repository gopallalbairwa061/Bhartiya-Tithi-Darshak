
"use client";

import { useState, useEffect } from "react";
import { PanchangDetailCard } from "@/components/panchang-detail-card";
import { FestivalSearch } from "@/components/festival-search";
import { SunTimesCard } from "@/components/sun-times-card";
import { ChaughadiyaCard } from "@/components/chaughadiya-card";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { format, getYear, getMonth } from "date-fns";
import { LoadingScreen } from "@/components/loading-screen";
import { LogoIcon } from "@/components/icons/logo-icon";
import { SubscribeBanner } from "@/components/subscribe-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrainCircuit } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { askPanchang } from "@/ai/flows/ask-panchang-flow";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPanchang, setSelectedPanchang] = useState<PanchangData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  const [quizQuestion, setQuizQuestion] = useState("");
  const [quizAnswer, setQuizAnswer] = useState("");
  const [isAsking, setIsAsking] = useState(false);

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
        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    };
    fetchPanchang();
  }, [selectedDate, initialLoad]);

  const handleAskQuestion = async () => {
    if (!quizQuestion.trim() || !selectedPanchang) return;
    setIsAsking(true);
    setQuizAnswer("");
    try {
      const answer = await askPanchang({ question: quizQuestion, panchang: selectedPanchang });
      setQuizAnswer(answer);
    } catch (error) {
      console.error("Error getting answer:", error);
      setQuizAnswer("माफ़ कीजिये, मुझे इसका उत्तर नहीं पता।");
    } finally {
      setIsAsking(false);
    }
  };


  const vsDateString = selectedPanchang ? `${selectedPanchang.masa}, ${selectedPanchang.samvat}` : "विक्रम संवत २०८१";

  if (initialLoad) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto px-4 py-8 pb-32">
        <header className="mb-12">
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center gap-4">
                    <LogoIcon className="h-12 w-12" />
                    <h1 className="text-3xl md:text-4xl font-headline font-bold text-transparent bg-clip-text bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3">
                        भारतीय तिथि दर्शक
                    </h1>
                </div>
                <div className="flex items-center gap-2">
                   <Sheet open={isQuizOpen} onOpenChange={setIsQuizOpen}>
                    <SheetTrigger asChild>
                         <Button variant="outline">
                           <BrainCircuit className="mr-2 h-4 w-4" />
                           प्रश्नोत्तरी
                         </Button>
                    </SheetTrigger>
                    <SheetContent>
                      <SheetHeader>
                        <SheetTitle>पंचांग प्रश्नोत्तरी</SheetTitle>
                        <SheetDescription>
                          आज के पंचांग के बारे में कोई भी प्रश्न पूछें।
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4">
                        <Textarea 
                          placeholder="आपका प्रश्न यहाँ लिखें..." 
                          value={quizQuestion}
                          onChange={(e) => setQuizQuestion(e.target.value)}
                          rows={4}
                        />
                        <Button onClick={handleAskQuestion} disabled={isAsking || !quizQuestion.trim()}>
                          {isAsking ? "पूछ रहा है..." : "प्रश्न पूछें"}
                        </Button>
                        {quizAnswer && (
                          <div className="p-4 bg-muted/50 rounded-md border border-border/80">
                            <p className="font-semibold">उत्तर:</p>
                            <p>{quizAnswer}</p>
                          </div>
                        )}
                      </div>
                    </SheetContent>
                  </Sheet>
                  <ThemeToggle />
                </div>
            </div>
          <p className="text-center text-base md:text-lg text-muted-foreground animate-fade-in">
            {currentDateTime ? `${currentDateTime} | ${vsDateString}` : <span className="inline-block h-6 w-96 bg-primary/20 rounded animate-pulse"></span>}
          </p>
        </header>
        
        <div className="max-w-md mx-auto w-full mb-8">
            <PanchangDetailCard panchang={selectedPanchang} isLoading={isLoading} />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 items-start">
          <div className="xl:col-span-2">
            <FestivalSearch onDateSelect={setSelectedDate} />
          </div>
          <div className="xl:col-span-1 flex flex-col gap-8">
            <SunTimesCard panchang={selectedPanchang} isLoading={isLoading} />
            <ChaughadiyaCard title="दिन का चौघड़िया" />
            <ChaughadiyaCard title="रात का चौघड़िया" />
          </div>
        </div>
      </main>
      <footer className="container mx-auto px-4 py-6 text-center text-muted-foreground border-t border-border/50">
        <p>&copy; {new Date().getFullYear()} भारतीय तिथि दर्शक। सर्वाधिकार सुरक्षित।</p>
        <p className="mt-2">भारत में निर्मित महेंद्र बैरवा द्वारा</p>
      </footer>
      <SubscribeBanner />
    </div>
  );
}
