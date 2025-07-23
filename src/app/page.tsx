
"use client";

import { useState, useEffect } from "react";
import { PanchangDetailCard } from "@/components/panchang-detail-card";
import { FestivalSearch } from "@/components/festival-search";
import { SunTimesCard } from "@/components/sun-times-card";
import { ChaughadiyaCard } from "@/components/chaughadiya-card";
import { getPanchangForMonth, PanchangData } from "@/services/panchang";
import { format, getYear, getMonth, isToday } from "date-fns";
import { LoadingScreen } from "@/components/loading-screen";
import { LogoIcon } from "@/components/icons/logo-icon";
import { SubscribeBanner } from "@/components/subscribe-banner";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { BrainCircuit, RefreshCw, PartyPopper, Home as HomeIcon, CheckCircle, XCircle, ShieldQuestion, FileText, Info } from "lucide-react";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Textarea } from "@/components/ui/textarea";
import { askPanchang } from "@/ai/flows/ask-panchang-flow";
import { generateQuestions, evaluateAnswer, QuizQuestion, EvaluateAnswerOutput } from "@/ai/flows/panchang-quiz-flow";
import { WinnerDetailsForm, WinnerDetails } from "@/components/winner-details-form";
import { handleQuizWinner } from "@/services/quiz-winner";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { SecureWrapper } from "@/components/secure-wrapper";
import Link from 'next/link';


const QUIZ_STORAGE_KEY = 'dailyQuiz';

type DailyQuiz = {
  date: string; // YYYY-MM-DD
  questions: QuizQuestion[];
  answers: (null | { userAnswer: string; result: EvaluateAnswerOutput })[];
  completed: boolean;
  submittedDetails: boolean;
  failed: boolean;
};


export default function Home() {
  const [currentDateTime, setCurrentDateTime] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedPanchang, setSelectedPanchang] = useState<PanchangData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isQuizOpen, setIsQuizOpen] = useState(false);
  
  const [quizState, setQuizState] = useState<'instructions' | 'idle' | 'loading' | 'question' | 'evaluating' | 'result' | 'congratulations' | 'collect-details' | 'finished'>('instructions');
  const [dailyQuiz, setDailyQuiz] = useState<DailyQuiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswer, setUserAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<EvaluateAnswerOutput | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);

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

  // Load or generate quiz on open
  useEffect(() => {
    // Reset to instructions when sheet is closed
    if (!isQuizOpen) {
      setQuizState('instructions');
      setAcceptedTerms(false);
    }
  }, [isQuizOpen]);
  
  // Auto-advance after 5 seconds on the result screen
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (quizState === 'result') {
      timer = setTimeout(() => {
        handleNextQuestion();
      }, 5000);
    }
    return () => clearTimeout(timer);
  }, [quizState]);
  
  const loadOrGenerateQuiz = async () => {
    setQuizState('loading');
    const todayStr = format(new Date(), 'yyyy-MM-dd');
    const storedQuiz = localStorage.getItem(QUIZ_STORAGE_KEY);
    
    if (storedQuiz) {
        const parsedQuiz: DailyQuiz = JSON.parse(storedQuiz);
        if (parsedQuiz.date === todayStr) {
            setDailyQuiz(parsedQuiz);
            const firstUnanswered = parsedQuiz.answers.findIndex(a => a === null);
            setCurrentQuestionIndex(firstUnanswered === -1 ? 0 : firstUnanswered);

            if (parsedQuiz.completed) {
                if (parsedQuiz.failed) {
                    setQuizState('finished');
                } else if(parsedQuiz.submittedDetails){
                    setQuizState('finished');
                }
                else {
                    setQuizState('congratulations');
                }
            } else if (parsedQuiz.failed) {
                setQuizState('finished');
            }
            else {
                setQuizState('question');
            }
            return;
        }
    }

    try {
        const questions = await generateQuestions();
        const newQuiz: DailyQuiz = {
            date: todayStr,
            questions,
            answers: Array(10).fill(null),
            completed: false,
            submittedDetails: false,
            failed: false,
        };
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(newQuiz));
        setDailyQuiz(newQuiz);
        setCurrentQuestionIndex(0);
        setQuizState('question');
    } catch (error) {
        console.error("Error generating questions:", error);
        setQuizState('idle');
    }
  };

  const handleEvaluateAnswer = async () => {
    if (!userAnswer.trim() || !dailyQuiz) return;
    setQuizState('evaluating');
    
    const currentQuestion = dailyQuiz.questions[currentQuestionIndex];
    try {
      const result = await evaluateAnswer({
        question: currentQuestion.question,
        answer: currentQuestion.answer,
        userAnswer: userAnswer,
      });

      const newAnswers = [...dailyQuiz.answers];
      newAnswers[currentQuestionIndex] = { userAnswer, result };
      let updatedQuiz = { ...dailyQuiz, answers: newAnswers };

      if (!result.isCorrect) {
          updatedQuiz.failed = true;
          updatedQuiz.completed = true; // Mark as completed even on failure
          setDailyQuiz(updatedQuiz);
          localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updatedQuiz));
          setQuizState('finished');
      } else {
          setQuizResult(result);
          setDailyQuiz(updatedQuiz);
          localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updatedQuiz));
          setQuizState('result');
      }
      
    } catch (error) {
      console.error("Error evaluating answer:", error);
      setQuizState('question');
    }
  };

  const handleNextQuestion = () => {
    setUserAnswer("");
    setQuizResult(null);

    if (dailyQuiz && currentQuestionIndex < dailyQuiz.questions.length - 1) {
        setCurrentQuestionIndex(prev => prev + 1);
        setQuizState('question');
    } else if (dailyQuiz) {
        const updatedQuiz = { ...dailyQuiz, completed: true };
        setDailyQuiz(updatedQuiz);
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updatedQuiz));
        
        const allCorrect = updatedQuiz.answers.every(a => a?.result.isCorrect);
        if (allCorrect) {
          setQuizState('congratulations');
        } else {
          setQuizState('finished');
        }
    }
  };
  

   const handleWinnerFormSubmit = async (data: WinnerDetails) => {
    console.log("Winner details:", data);
    const result = await handleQuizWinner(data);

    if (result.success && dailyQuiz) {
        const updatedQuiz = { ...dailyQuiz, submittedDetails: true };
        setDailyQuiz(updatedQuiz);
        localStorage.setItem(QUIZ_STORAGE_KEY, JSON.stringify(updatedQuiz));
        setQuizState('finished');
    }
    return result;
  };
  
  const resetQuiz = () => {
      localStorage.removeItem(QUIZ_STORAGE_KEY);
      setDailyQuiz(null);
      setCurrentQuestionIndex(0);
      setUserAnswer("");
      setQuizResult(null);
      setAcceptedTerms(false);
      setQuizState('instructions');
  }
  
  const currentQuestion = dailyQuiz?.questions[currentQuestionIndex];
  const vsDateString = selectedPanchang ? `${selectedPanchang.masa}, ${selectedPanchang.samvat}` : "विक्रम संवत २०८१";

  if (initialLoad) {
    return <LoadingScreen />;
  }

  const renderQuizContent = () => {
    switch (quizState) {
        case 'instructions':
            return (
                <div className="flex flex-col h-full gap-6 text-center">
                    <div className="flex-grow flex flex-col items-center justify-center gap-4">
                        <ShieldQuestion className="h-24 w-24 text-primary" />
                        <h2 className="text-2xl font-bold">प्रश्नोत्तरी के नियम</h2>
                        <ul className="text-muted-foreground list-disc list-inside text-left space-y-2">
                            <li>आपको 10 प्रश्नों के उत्तर देने होंगे।</li>
                            <li>सभी प्रश्नों के सही उत्तर देने पर आप पुरस्कार जीत सकते हैं।</li>
                            <li>कृपया उत्तर कहीं और से खोजने का प्रयास न करें।</li>
                            <li>ईमानदारी से खेलें और अपने ज्ञान का परीक्षण करें।</li>
                        </ul>
                    </div>
                    <div className="space-y-4">
                        <div className="flex items-center space-x-2 justify-center">
                            <Checkbox id="terms" checked={acceptedTerms} onCheckedChange={(checked) => setAcceptedTerms(checked as boolean)} />
                            <label
                                htmlFor="terms"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                मैं नियमों और शर्तों से सहमत हूँ।
                            </label>
                        </div>
                        <Button onClick={loadOrGenerateQuiz} disabled={!acceptedTerms} className="w-full">
                            प्रश्नोत्तरी शुरू करें
                        </Button>
                    </div>
                </div>
            );

        case 'loading':
            return <div className="flex justify-center items-center h-full"><p>प्रश्नोत्तरी लोड हो रही है...</p></div>;
        
        case 'question':
        case 'evaluating':
            return (
                <div className="flex flex-col gap-4">
                  <p className="text-sm text-muted-foreground text-center">प्रश्न {currentQuestionIndex + 1} / 10</p>
                  <p className="font-semibold text-lg">{currentQuestion?.question}</p>
                   <Textarea 
                    placeholder="आपका उत्तर यहाँ लिखें..." 
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    rows={4}
                    disabled={quizState === 'evaluating'}
                  />
                  <Button onClick={handleEvaluateAnswer} disabled={quizState === 'evaluating' || !userAnswer.trim()}>
                    {quizState === 'evaluating' ? "जाँच हो रही है..." : "उत्तर दें"}
                  </Button>
                </div>
            );

        case 'result':
            return quizResult && (
                 <div className="p-4 bg-muted/50 rounded-md border border-border/80 space-y-4">
                    <div>
                      <p className={`font-bold text-lg text-green-600`}>
                        सही जवाब!
                      </p>
                      <p className="text-muted-foreground mt-1">{currentQuestion?.question}</p>
                      <p className="font-semibold mt-1">आपका उत्तर: <span className="font-normal">{userAnswer}</span></p>
                    </div>
                   
                    <div className="space-y-1">
                      <p className="font-semibold">सारांश:</p>
                      <p>{quizResult.summary}</p>
                    </div>
                    <Button onClick={handleNextQuestion} className="w-full">
                        {currentQuestionIndex === 9 ? 'परिणाम देखें' : 'अगला प्रश्न'}
                    </Button>
                 </div>
            );
            
        case 'congratulations':
            return (
                <div className="flex flex-col items-center justify-center text-center h-full gap-4">
                    <PartyPopper className="h-24 w-24 text-primary animate-bounce"/>
                    <h2 className="text-2xl font-bold">बधाई हो!</h2>
                    <p className="text-muted-foreground">आपने आज की प्रश्नोत्तरी पूरी कर ली है और सभी उत्तर सही हैं!</p>
                    {dailyQuiz?.submittedDetails ? (
                       <div className="p-4 bg-green-100/50 dark:bg-green-900/30 rounded-md text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800 w-full flex items-center justify-center gap-2">
                           <CheckCircle className="h-5 w-5"/>
                           <p>आप आज के लिए अपना पुरस्कार का दावा कर चुके हैं!</p>
                       </div>
                    ) : (
                       <Button onClick={() => setQuizState('collect-details')} className="w-full">पुरस्कार का दावा करें</Button>
                    )}
                     <Button onClick={resetQuiz} variant="outline" className="w-full">
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        {"पुनः प्रश्नोत्तरी खेलें"}
                    </Button>
                </div>
            );
        
         case 'collect-details':
            return <WinnerDetailsForm onSubmit={handleWinnerFormSubmit} />;

        case 'finished':
            const isFailure = dailyQuiz?.failed;
            const hasSubmitted = dailyQuiz?.submittedDetails;

            let message = "आप आज का क्विज पूरा कर चुके हैं। नई प्रश्नोत्तरी के लिए कल फिर आएं।";
            if(isFailure){
                message = "आपका एक या अधिक उत्तर गलत था। बेहतर भाग्य अगली बार!";
            } else if (hasSubmitted) {
                message = "आपका विवरण सफलतापूर्वक सबमिट हो गया है। हम जल्द ही आपसे संपर्क करेंगे।";
            }

            return (
                <div className="flex flex-col items-center justify-center text-center h-full gap-4">
                    <h2 className="text-2xl font-bold">भाग लेने के लिए धन्यवाद!</h2>
                    <p className="text-muted-foreground">{message}</p>
                    <div className="w-full flex flex-col gap-2">
                        <Button onClick={resetQuiz} className="w-full">
                          <RefreshCw className="mr-2 h-4 w-4"/>
                          {isFailure ? "पुनः प्रयास करें" : "पुनः प्रश्नोत्तरी खेलें"}
                        </Button>
                      <Button onClick={() => setIsQuizOpen(false)} variant="outline" className="w-full">
                          <HomeIcon className="mr-2 h-4 w-4"/>
                          होम पेज पर जाएं
                      </Button>
                    </div>
                </div>
            )

        default:
             return (
                <div className="flex flex-col items-center justify-center h-full gap-4">
                    <p className="text-muted-foreground">कुछ गलत हो गया।</p>
                    <Button onClick={resetQuiz}>
                        <RefreshCw className="mr-2 h-4 w-4"/>
                        पुनः आरंभ करें
                    </Button>
                </div>
            );
    }
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
                      <SecureWrapper isSecured={isQuizOpen}>
                          <div className="py-4 h-[calc(100%-80px)]">
                            {renderQuizContent()}
                          </div>
                      </SecureWrapper>
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
        <div className="flex justify-center items-center gap-4">
            <p>&copy; {new Date().getFullYear()} भारतीय तिथि दर्शक। सर्वाधिकार सुरक्षित।</p>
            <Link href="/about" className="text-primary hover:underline flex items-center gap-1">
                <Info size={16} /> हमारे बारे में
            </Link>
        </div>
        <p className="mt-2">भारत में निर्मित महेंद्र बैरवा द्वारा</p>
      </footer>
      <SubscribeBanner />
    </div>
  );
}

    

    