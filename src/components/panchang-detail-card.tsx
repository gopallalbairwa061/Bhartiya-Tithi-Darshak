
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PanchangData } from "@/services/panchang";
import { Sun, Moon, Star, Link as LinkIcon, CalendarDays, AlertTriangle, Shield, ShieldAlert, ShieldCheck, Calendar, Sparkles, UserCircle } from "lucide-react";
import { Badge } from "./ui/badge";
import { isToday, format } from "date-fns";
import { hi } from "date-fns/locale";

interface PanchangDetailCardProps {
  panchang: PanchangData | null;
  isLoading: boolean;
  selectedDate: Date;
}

const DetailRow = ({ icon, label, value, isLoading }: { icon: React.ReactNode; label: string; value?: string; isLoading: boolean }) => (
  <div className="flex justify-between items-center py-2 text-base">
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 text-muted-foreground flex-shrink-0">{icon}</div>
      <p className="font-semibold text-foreground/90 flex-shrink-0">{label}</p>
    </div>
    {isLoading ? (
      <Skeleton className="h-4 w-32" />
    ) : (
      <p className="text-muted-foreground font-medium text-right ml-2">{value || "अनुपलब्ध"}</p>
    )}
  </div>
);

const MuhuratRow = ({ icon, label, value, isLoading, type }: { icon: React.ReactNode; label: string; value?: string; isLoading: boolean, type: 'good' | 'bad' | 'neutral' }) => {
    const typeClasses = {
        good: 'text-green-600 dark:text-green-500',
        bad: 'text-red-600 dark:text-red-500',
        neutral: 'text-yellow-600 dark:text-yellow-500'
    };
    const badgeVariant = {
        good: 'default',
        bad: 'destructive',
        neutral: 'secondary'
    } as const;
    
    return (
        <div className="flex justify-between items-center py-2 text-base">
          <div className="flex items-center gap-3">
            <div className={`h-5 w-5 ${typeClasses[type]} flex-shrink-0`}>{icon}</div>
             <p className="font-semibold text-foreground/90">{label}</p>
          </div>
          {isLoading ? (
            <Skeleton className="h-4 w-32" />
          ) : (
            <Badge variant={badgeVariant[type]} className="bg-opacity-20 text-base font-normal">
                {value || "अनुपलब्ध"}
            </Badge>
          )}
        </div>
    );
}


export function PanchangDetailCard({ panchang, isLoading, selectedDate }: PanchangDetailCardProps) {
  
  const cardTitle = isToday(selectedDate) ? "आज का पंचांग" : "पंचांग विवरण";
  const cardDescription = format(selectedDate, "eeee, d MMMM yyyy", { locale: hi });

  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-primary">{cardTitle}</CardTitle>
        <CardDescription>{cardDescription}</CardDescription>
      </CardHeader>
      <CardContent className="divide-y divide-border/50 -mt-2">
        <DetailRow icon={<Calendar size={20} />} label="मास" value={panchang?.masa} isLoading={isLoading} />
        <DetailRow icon={<Sparkles size={20} />} label="संवत" value={panchang?.samvat} isLoading={isLoading} />
        <DetailRow icon={<Moon size={20} />} label="तिथि" value={panchang?.tithi} isLoading={isLoading} />
        <DetailRow icon={<UserCircle size={20} />} label="राशि" value={panchang?.rashi} isLoading={isLoading} />
        <DetailRow icon={<Star size={20} />} label="नक्षत्र" value={panchang ? `${panchang.nakshatra.name} (${panchang.nakshatra.endTime})` : undefined} isLoading={isLoading} />
        <DetailRow icon={<LinkIcon size={20} />} label="योग" value={panchang ? `${panchang.yoga.name} (${panchang.yoga.endTime})` : undefined} isLoading={isLoading} />
        <DetailRow icon={<CalendarDays size={20} />} label="करण" value={panchang ? `${panchang.karana.name} (${panchang.karana.endTime})` : undefined} isLoading={isLoading} />
        <MuhuratRow icon={<ShieldCheck size={20} />} label="अभिजीत मुहूर्त" value={panchang ? `${panchang.abhijitMuhurat.start} - ${panchang.abhijitMuhurat.end}` : undefined} isLoading={isLoading} type="good" />
        <MuhuratRow icon={<AlertTriangle size={20} />} label="राहु काल" value={panchang ? `${panchang.rahuKaal.start} - ${panchang.rahuKaal.end}` : undefined} isLoading={isLoading} type="bad" />
        <MuhuratRow icon={<ShieldAlert size={20} />} label="यमगण्डम" value={panchang ? `${panchang.yamagandam.start} - ${panchang.yamagandam.end}` : undefined} isLoading={isLoading} type="bad" />
        <MuhuratRow icon={<Shield size={20} />} label="गुलिक काल" value={panchang ? `${panchang.gulikaKaal.start} - ${panchang.gulikaKaal.end}` : undefined} isLoading={isLoading} type="neutral" />
      </CardContent>
    </Card>
  );
}
