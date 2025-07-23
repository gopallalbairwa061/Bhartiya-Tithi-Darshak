import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { PanchangData } from "@/services/panchang";
import { Sun, Sunset } from "lucide-react";

interface SunTimesCardProps {
    panchang: PanchangData | null;
    isLoading: boolean;
}

export function SunTimesCard({ panchang, isLoading }: SunTimesCardProps) {
    const location = "नई दिल्ली, भारत";

    const sunTimeItem = (label: string, icon: React.ReactNode, time?: string) => (
        <div className="flex items-center gap-4">
            <div className="h-8 w-8 text-primary flex-shrink-0">{icon}</div>
            <div>
                <p className="font-semibold">{label}</p>
                {isLoading ? (
                    <Skeleton className="h-4 w-24 mt-1" />
                ) : (
                    <p className="text-muted-foreground text-base">{time || "अनुपलब्ध"}</p>
                )}
            </div>
        </div>
    );

    return (
        <Card className="w-full shadow-lg">
            <CardHeader>
                <CardTitle className="font-headline text-2xl text-accent">सूर्योदय और सूर्यास्त</CardTitle>
                <CardDescription>{location}</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-5 text-lg">
                {sunTimeItem("सूर्योदय", <Sun />, panchang?.sunrise)}
                <Separator />
                {sunTimeItem("सूर्यास्त", <Sunset />, panchang?.sunset)}
            </CardContent>
        </Card>
    );
}
