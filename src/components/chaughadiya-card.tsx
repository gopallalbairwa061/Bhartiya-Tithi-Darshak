"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type Chaughadiya = {
  name: string;
  type: "शुभ" | "अशुभ" | "मध्यम";
  time: string;
};

const dayChaughadiya: Chaughadiya[] = [
  { name: "उद्वेग", type: "अशुभ", time: "05:55 - 07:32" },
  { name: "चर", type: "मध्यम", time: "07:32 - 09:09" },
  { name: "लाभ", type: "शुभ", time: "09:09 - 10:46" },
  { name: "अमृत", type: "शुभ", time: "10:46 - 12:23" },
  { name: "काल", type: "अशुभ", time: "12:23 - 14:00" },
  { name: "शुभ", type: "शुभ", time: "14:00 - 15:37" },
  { name: "रोग", type: "अशुभ", time: "15:37 - 17:14" },
  { name: "उद्वेग", type: "अशुभ", time: "17:14 - 18:51" },
];

const nightChaughadiya: Chaughadiya[] = [
  { name: "शुभ", type: "शुभ", time: "18:51 - 20:14" },
  { name: "अमृत", type: "शुभ", time: "20:14 - 21:37" },
  { name: "चर", type: "मध्यम", time: "21:37 - 23:00" },
  { name: "रोग", type: "अशुभ", time: "23:00 - 00:23" },
  { name: "काल", type: "अशुभ", time: "00:23 - 01:46" },
  { name: "लाभ", type: "शुभ", time: "01:46 - 03:09" },
  { name: "उद्वेग", type: "अशुभ", time: "03:09 - 04:32" },
  { name: "शुभ", type: "शुभ", time: "04:32 - 05:55" },
];

const getBadgeVariant = (type: Chaughadiya["type"]) => {
  switch (type) {
    case "शुभ":
      return "default";
    case "अशुभ":
      return "destructive";
    case "मध्यम":
      return "secondary";
    default:
      return "outline";
  }
};

interface ChaughadiyaCardProps {
    title: string;
}

export function ChaughadiyaCard({ title }: ChaughadiyaCardProps) {
  const data = title.includes("दिन") ? dayChaughadiya : nightChaughadiya;

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-3 text-base">
        {data.map((muhurat, index) => (
          <div key={index}>
            <div className="flex justify-between items-center py-1">
              <div className="flex items-center gap-3">
                <Badge variant={getBadgeVariant(muhurat.type)} className="w-16 justify-center">{muhurat.name}</Badge>
                <p className="font-semibold text-muted-foreground">{muhurat.time}</p>
              </div>
              <p className="font-semibold">{muhurat.type}</p>
            </div>
            {index < data.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
