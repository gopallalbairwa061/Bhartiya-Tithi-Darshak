import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Sun, Sunset } from "lucide-react";

export function SunTimesCard() {
    const sunTimes = {
        sunrise: "05:55 AM",
        sunset: "07:15 PM",
        location: "New Delhi, India"
    }

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">Sunrise & Sunset</CardTitle>
        <CardDescription>{sunTimes.location}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-5 text-lg">
        <div className="flex items-center gap-4">
          <Sun className="h-8 w-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Sunrise</p>
            <p className="text-muted-foreground text-base">{sunTimes.sunrise}</p>
          </div>
        </div>
        <Separator />
        <div className="flex items-center gap-4">
          <Sunset className="h-8 w-8 text-primary flex-shrink-0" />
          <div>
            <p className="font-semibold">Sunset</p>
            <p className="text-muted-foreground text-base">{sunTimes.sunset}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
