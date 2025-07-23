import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, Star, Moon, Link as LinkIcon } from "lucide-react";

export function PanchangCard() {
  const panchang = {
    tithi: "Krishna Paksha, Dwitiya",
    nakshatra: "Revati until 08:04 PM",
    yoga: "Ganda until 05:46 PM",
    karana: "Taitila until 02:22 PM",
  };

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">Daily Panchang</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 text-lg">
        <div className="flex items-center gap-4">
          <Moon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Tithi</p>
            <p className="text-muted-foreground text-base">{panchang.tithi}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Star className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Nakshatra</p>
            <p className="text-muted-foreground text-base">{panchang.nakshatra}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <LinkIcon className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Yoga</p>
            <p className="text-muted-foreground text-base">{panchang.yoga}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <CalendarDays className="h-6 w-6 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Karana</p>
            <p className="text-muted-foreground text-base">{panchang.karana}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
