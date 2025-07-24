
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { generateApiKey } from "@/ai/flows/api-key-flow";
import { Loader2, Copy, Check } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export function ApiKeyManager() {
    const [apiKey, setApiKey] = useState<string>("");
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasCopied, setHasCopied] = useState<boolean>(false);
    const { toast } = useToast();

    const handleGenerateKey = async () => {
        setIsLoading(true);
        setApiKey("");
        try {
            const newKey = await generateApiKey();
            setApiKey(newKey);
        } catch (error) {
            console.error("Failed to generate API key:", error);
            toast({
                title: "त्रुटि",
                description: "API कुंजी बनाने में विफल रहा। कृपया पुनः प्रयास करें।",
                variant: "destructive",
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleCopy = () => {
        if (!apiKey) return;
        navigator.clipboard.writeText(apiKey);
        setHasCopied(true);
        toast({
            title: "सफलता!",
            description: "API कुंजी क्लिपबोर्ड पर कॉपी की गई।",
        });
        setTimeout(() => setHasCopied(false), 2000);
    };

    return (
        <div className="grid gap-6">
            <div className="space-y-2">
                <Button onClick={handleGenerateKey} disabled={isLoading}>
                    {isLoading ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}
                    {apiKey ? "नई कुंजी बनाएं" : "नई API कुंजी बनाएं"}
                </Button>
                <p className="text-sm text-muted-foreground">
                    यह एक नई API कुंजी बनाएगा। मौजूदा कुंजियाँ रद्द नहीं की जाएंगी।
                </p>
            </div>

            {isLoading && (
                 <div className="flex items-center justify-center h-10">
                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                 </div>
            )}

            {apiKey && (
                <div className="space-y-4">
                    <Alert>
                        <AlertTitle className="font-bold">कृपया इस कुंजी को सुरक्षित रूप से सहेजें!</AlertTitle>
                        <AlertDescription>
                            यह आपकी गुप्त API कुंजी है। इसे किसी के साथ साझा न करें। सुरक्षा कारणों से आप इसे फिर से नहीं देख पाएंगे।
                        </AlertDescription>
                    </Alert>
                    <div className="relative">
                        <Input
                            readOnly
                            value={apiKey}
                            className="pr-10 font-mono text-sm"
                        />
                        <Button
                            variant="ghost"
                            size="icon"
                            className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8"
                            onClick={handleCopy}
                        >
                            {hasCopied ? (
                                <Check className="h-4 w-4 text-green-600" />
                            ) : (
                                <Copy className="h-4 w-4" />
                            )}
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}

