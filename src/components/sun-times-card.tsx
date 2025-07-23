import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Sunset } from "lucide-react";

export function SunTimesCard() {
    const sunTimes = {
        sunrise: "सुबह 05:55",
        sunset: "शाम 07:15",
        location: "नई दिल्ली, भारत"
    }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">सूर्योदय और सूर्यास्त</CardTitle>
        <CardDescription>{sunTimes.location}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 text-lg">
        <div className="flex items-center gap-4">
          <Sun className="h-8 w-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">सूर्योदय</p>
            <p className="text-muted-foreground text-base">{sunTimes.sunrise}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Sunset className="h-8 w-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">सूर्यास्त</p>
            <p className="text-muted-foreground text-base">{sunTimes.sunset}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
