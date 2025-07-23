
import { Metadata } from 'next';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { LogoIcon } from '@/components/icons/logo-icon';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export const metadata: Metadata = {
  title: 'हमारे बारे में | भारतीय तिथि दर्शक',
  description: 'भारतीय तिथि दर्शक के मिशन और विशेषताओं के बारे में जानें।',
};

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-body">
      <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
        <div className="max-w-2xl w-full">
          <Card className="shadow-lg animate-fade-in border-primary/20">
            <CardHeader className="text-center">
              <div className="flex justify-center mb-4">
                  <LogoIcon className="h-20 w-20" />
              </div>
              <CardTitle className="font-headline text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3">
                हमारे बारे में
              </CardTitle>
            </CardHeader>
            <CardContent className="text-lg text-center text-muted-foreground space-y-6 px-8">
              <p>
                <strong>भारतीय तिथि दर्शक</strong> एक आधुनिक वेब एप्लीकेशन है जिसे हिंदू पंचांग और भारतीय त्योहारों की जानकारी को सभी के लिए सुलभ बनाने के लिए डिज़ाइन किया गया है। 
                हमारा उद्देश्य परंपरा और प्रौद्योगिकी को एक साथ लाना है, जिससे आप आसानी से महत्वपूर्ण तिथियों, शुभ मुहूर्तों और सांस्कृतिक कार्यक्रमों से जुड़े रह सकें।
              </p>
              <p>
                इस ऐप में आप दैनिक पंचांग, मासिक त्योहार कैलेंडर, और एक मजेदार प्रश्नोत्तरी जैसी सुविधाएँ पाएंगे जो आपके ज्ञान का परीक्षण करती हैं और आपको पुरस्कार जीतने का मौका देती हैं।
              </p>
            </CardContent>
            <CardFooter className="flex justify-center pt-6">
                <Button asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        होम पेज पर वापस जाएं
                    </Link>
                </Button>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  );
}

    