import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PanchangData } from "@/services/panchang";
import { CalendarDays, Star, Moon, Link as LinkIcon } from "lucide-react";

interface PanchangCardProps {
  panchang: PanchangData | null;
  isLoading: boolean;
}

const DetailItem = ({ icon, label, value, isLoading }: { icon: React.ReactNode, label: string, value?: string, isLoading: boolean }) => (
    <>
      <div className="flex items-center gap-4">
        <div className="h-6 w-6 text-primary flex-shrink-0">{icon}</div>
        <div>
          <p className="font-semibold">{label}</p>
          {isLoading ? (
            <Skeleton className="h-4 w-48 mt-1" />
          ) : (
            <p className="text-muted-foreground text-base">{value || "अनुपलब्ध"}</p>
          )}
        </div>
      </div>
      <Separator />
    </>
);

export function PanchangCard({ panchang, isLoading }: PanchangCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">पंचांग</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-5 text-lg">
        <DetailItem icon={<Moon />} label="तिथि" value={panchang?.tithi} isLoading={isLoading} />
        <DetailItem icon={<Star />} label="नक्षत्र" value={panchang ? `${panchang.nakshatra.name} (${panchang.nakshatra.endTime})` : undefined} isLoading={isLoading} />
        <DetailItem icon={<LinkIcon />} label="योग" value={panchang ? `${panchang.yoga.name} (${panchang.yoga.endTime})`: undefined} isLoading={isLoading} />
        <div className="flex items-center gap-4">
            <div className="h-6 w-6 text-primary flex-shrink-0"><CalendarDays /></div>
            <div>
                <p className="font-semibold">करण</p>
                {isLoading ? (
                    <Skeleton className="h-4 w-48 mt-1" />
                ) : (
                    <p className="text-muted-foreground text-base">{panchang ? `${panchang.karana.name} (${panchang.karana.endTime})`: "अनुपलब्ध"}</p>
                )}
            </div>
        </div>
      </CardContent>
    </Card>
  );
}
