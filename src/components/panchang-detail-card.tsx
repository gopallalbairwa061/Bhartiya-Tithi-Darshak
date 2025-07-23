
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { PanchangData } from "@/services/panchang";
import { Sun, Moon, Star, Link as LinkIcon, CalendarDays, AlertTriangle, Shield, ShieldAlert, ShieldCheck } from "lucide-react";
import { Badge } from "./ui/badge";

interface PanchangDetailCardProps {
  panchang: PanchangData | null;
  isLoading: boolean;
}

const DetailRow = ({ icon, label, value, isLoading }: { icon: React.ReactNode; label: string; value?: string; isLoading: boolean }) => (
  <div className="flex justify-between items-center py-2 text-base">
    <div className="flex items-center gap-3">
      <div className="h-5 w-5 text-secondary flex-shrink-0">{icon}</div>
      <p className="font-semibold text-foreground/90">{label}</p>
    </div>
    {isLoading ? (
      <Skeleton className="h-4 w-32" />
    ) : (
      <p className="text-muted-foreground font-medium text-right">{value || "अनुपलब्ध"}</p>
    )}
  </div>
);

const MuhuratRow = ({ icon, label, value, isLoading, type }: { icon: React.ReactNode; label: string; value?: string; isLoading: boolean, type: 'good' | 'bad' }) => (
    <div className="flex justify-between items-center py-2 text-base">
      <div className="flex items-center gap-3">
        <div className={`h-5 w-5 ${type === 'good' ? 'text-green-500' : 'text-red-500'} flex-shrink-0`}>{icon}</div>
         <p className="font-semibold text-foreground/90">{label}</p>
      </div>
      {isLoading ? (
        <Skeleton className="h-4 w-32" />
      ) : (
        <Badge variant={type === 'good' ? 'default' : 'destructive'} className="bg-opacity-20 text-base">
            {value || "अनुपलब्ध"}
        </Badge>
      )}
    </div>
);


export function PanchangDetailCard({ panchang, isLoading }: PanchangDetailCardProps) {
  return (
    <Card className="w-full shadow-lg">
      <CardHeader>
        <CardTitle className="font-headline text-2xl text-accent">आज का पंचांग</CardTitle>
      </CardHeader>
      <CardContent className="divide-y divide-border/50 -mt-2">
        <DetailRow icon={<Moon size={20} />} label="तिथि" value={panchang?.tithi} isLoading={isLoading} />
        <DetailRow icon={<Star size={20} />} label="नक्षत्र" value={panchang ? `${panchang.nakshatra.name} (${panchang.nakshatra.endTime})` : undefined} isLoading={isLoading} />
        <DetailRow icon={<LinkIcon size={20} />} label="योग" value={panchang ? `${panchang.yoga.name} (${panchang.yoga.endTime})` : undefined} isLoading={isLoading} />
        <DetailRow icon={<CalendarDays size={20} />} label="करण" value={panchang ? `${panchang.karana.name} (${panchang.karana.endTime})` : undefined} isLoading={isLoading} />
        <MuhuratRow icon={<ShieldCheck size={20} />} label="अभिजीत मुहूर्त" value={panchang ? `${panchang.abhijitMuhurat.start} - ${panchang.abhijitMuhurat.end}` : undefined} isLoading={isLoading} type="good" />
        <MuhuratRow icon={<AlertTriangle size={20} />} label="राहु काल" value={panchang ? `${panchang.rahuKaal.start} - ${panchang.rahuKaal.end}` : undefined} isLoading={isLoading} type="bad" />
        <MuhuratRow icon={<ShieldAlert size={20} />} label="यमगण्डम" value={panchang ? `${panchang.yamagandam.start} - ${panchang.yamagandam.end}` : undefined} isLoading={isLoading} type="bad" />
        <MuhuratRow icon={<Shield size={20} />} label="गुलिक काल" value={panchang ? `${panchang.gulikaKaal.start} - ${panchang.gulikaKaal.end}` : undefined} isLoading={isLoading} type="bad" />
      </CardContent>
    </Card>
  );
}
