import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Star, Moon, Link as LinkIcon } from "lucide-react";

export function PanchangCard() {
  const panchang = {
    tithi: "कृष्ण पक्ष, द्वितीया",
    nakshatra: "रेवती रात 08:04 बजे तक",
    yoga: "गण्ड शाम 05:46 बजे तक",
    karana: "तैतिल दोपहर 02:22 बजे तक",
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">दैनिक पंचांग</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 text-lg">
        <div className="flex items-center gap-4">
          <Moon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">तिथि</p>
            <p className="text-muted-foreground text-base">{panchang.tithi}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Star className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">नक्षत्र</p>
            <p className="text-muted-foreground text-base">{panchang.nakshatra}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <LinkIcon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">योग</p>
            <p className="text-muted-foreground text-base">{panchang.yoga}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <CalendarDays className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">करण</p>
            <p className="text-muted-foreground text-base">{panchang.karana}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
