"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { BellRing, Mail, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function SubscribeBanner() {
  const [isVisible, setIsVisible] = useState(true);
  const { toast } = useToast();

  const handleSubscribe = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsVisible(false);
    toast({
      title: "सदस्यता के लिए धन्यवाद!",
      description: "आपको अब त्योहारों और महत्वपूर्ण तिथियों के लिए सूचनाएं प्राप्त होंगी।",
      variant: "default",
    });
  };

  if (!isVisible) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 w-full max-w-sm">
        <Card className="shadow-2xl">
            <Button
                variant="ghost"
                size="icon"
                className="absolute top-2 right-2 h-6 w-6 text-muted-foreground"
                onClick={() => setIsVisible(false)}
            >
                <X size={18} />
                <span className="sr-only">Close</span>
            </Button>
            <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/20 rounded-full">
                        <BellRing className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-lg font-headline text-primary">सूचित रहें</CardTitle>
                        <CardDescription className="text-sm">त्योहारों की सूचनाएं पाएं।</CardDescription>
                    </div>
                </div>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubscribe} className="flex gap-2">
                    <div className="relative flex-grow">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input 
                            type="email" 
                            placeholder="आपका ईमेल" 
                            required 
                            className="pl-10 h-10"
                            aria-label="ईमेल पता"
                        />
                    </div>
                    <Button type="submit" variant="default">सदस्य बनें</Button>
                </form>
            </CardContent>
        </Card>
    </div>
  );
}
