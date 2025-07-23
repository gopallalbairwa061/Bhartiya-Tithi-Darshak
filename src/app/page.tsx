
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
import { BrainCircuit, RefreshCw } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { askPanchang } from "@/ai/flows/ask-panchang-flow";
import { generateQuestion, evaluateAnswer, QuizQuestion } from "@/ai/flows/panchang-quiz-flow";

export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPanchang, setSelectedPanchang] = useState<PanchangData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  const [quizState, setQuizState] = useState<'idle' | 'loading' | 'question' | 'evaluating' | 'result'>('idle');
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion | null>(null);
  const [userAnswer, setUserAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<{ isCorrect: boolean; summary: string } | null>(null);


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

  useEffect(() => {
    if (isQuizOpen && quizState === 'idle') {
      handleGenerateQuestion();
    }
  }, [isQuizOpen, quizState]);

  const handleGenerateQuestion = async () => {
    setQuizState('loading');
    setUserAnswer("");
    setQuizResult(null);
    try {
      const question = await generateQuestion();
      setCurrentQuestion(question);
      setQuizState('question');
    } catch (error) {
      console.error("Error generating question:", error);
      setQuizState('idle');
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || !currentQuestion) return;
    setQuizState('evaluating');
    try {
      const result = await evaluateAnswer({
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        userAnswer: userAnswer,
      });
      setQuizResult(result);
      setQuizState('result');
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setQuizState('question');
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
                        <SheetTitle>पंचांग और संस्कृति प्रश्नोत्तरी</SheetTitle>
                        <SheetDescription>
                          भारतीय संस्कृति और पंचांग के बारे में अपने ज्ञान का परीक्षण करें।
                        </SheetDescription>
                      </SheetHeader>
                      <div className="grid gap-4 py-4 h-full">
                        {quizState === 'loading' && <p>प्रश्न लोड हो रहा है...</p>}
                        
                        {quizState === 'question' || quizState === 'evaluating' ? (
                          <>
                            <p className="font-semibold text-lg">{currentQuestion?.question}</p>
                             <Textarea 
                              placeholder="आपका उत्तर यहाँ लिखें..." 
                              value={userAnswer}
                              onChange={(e) => setUserAnswer(e.target.value)}
                              rows={4}
                            />
                            <Button onClick={handleEvaluateAnswer} disabled={quizState === 'evaluating' || !userAnswer.trim()}>
                              {quizState === 'evaluating' ? "जाँच हो रही है..." : "उत्तर दें"}
                            </Button>
                          </>
                        ) : null}

                        {quizState === 'result' && quizResult && (
                           <div className="p-4 bg-muted/50 rounded-md border border-border/80 space-y-4">
                              <div>
                                <p className={`font-bold text-lg ${quizResult.isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                  {quizResult.isCorrect ? "सही जवाब!" : "पुनः प्रयास करें"}
                                </p>
                                <p className="text-muted-foreground mt-1">{currentQuestion?.question}</p>
                                <p className="font-semibold mt-1">आपका उत्तर: <span className="font-normal">{userAnswer}</span></p>
                              </div>
                             
                              <div className="space-y-1">
                                <p className="font-semibold">सारांश:</p>
                                <p>{quizResult.summary}</p>
                              </div>
                              <Button onClick={handleGenerateQuestion} variant="outline" className="w-full">
                                  <RefreshCw className="mr-2 h-4 w-4"/>
                                  अगला प्रश्न
                              </Button>
                           </div>
                        )}
                        
                        {(quizState === 'question' || quizState === 'result') && (
                            <Button onClick={handleGenerateQuestion} variant="ghost" size="sm" className="mt-auto">
                                <RefreshCw className="mr-2 h-4 w-4"/>
                                दूसरा प्रश्न पूछें
                            </Button>
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
