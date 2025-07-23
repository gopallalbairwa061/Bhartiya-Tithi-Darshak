
"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

const WinnerDetailsSchema = z.object({
  name: z.string().min(2, { message: "कम से कम 2 अक्षर का नाम आवश्यक है।" }),
  email: z.string().email({ message: "अमान्य ईमेल पता।" }),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, { message: "अमान्य UPI ID।" }),
});

export type WinnerDetails = z.infer<typeof WinnerDetailsSchema>;

interface WinnerDetailsFormProps {
  onSubmit: (data: WinnerDetails) => Promise<{ success: boolean; message: string }>;
}

export function WinnerDetailsForm({ onSubmit }: WinnerDetailsFormProps) {
  const { toast } = useToast();
  const form = useForm<WinnerDetails>({
    resolver: zodResolver(WinnerDetailsSchema),
    defaultValues: {
      name: "",
      email: "",
      upiId: "",
    },
  });

  const { isSubmitting } = form.formState;

  const handleFormSubmit = async (data: WinnerDetails) => {
    try {
      const result = await onSubmit(data);
      if (result.success) {
        toast({
            title: "सफलतापूर्वक सबमिट किया गया!",
            description: "आपका विवरण हमें मिल गया है। हम जल्द ही आपसे संपर्क करेंगे।",
        });
      } else {
        toast({
            title: "एक त्रुटि हुई",
            description: result.message || "आपका विवरण सबमिट करने में विफल रहा। कृपया पुनः प्रयास करें।",
            variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "एक अप्रत्याशित त्रुटि हुई",
        description: "आपका विवरण सबमिट करने में विफल रहा। कृपया पुनः प्रयास करें।",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col text-center h-full gap-4">
        <h2 className="text-xl font-bold">पुरस्कार का दावा करें!</h2>
        <p className="text-muted-foreground text-sm">
            पुरस्कार प्राप्त करने के लिए कृपया अपना विवरण भरें।
        </p>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4 text-left">
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>पूरा नाम</FormLabel>
                            <FormControl>
                                <Input placeholder="आपका नाम" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>ईमेल</FormLabel>
                            <FormControl>
                                <Input placeholder="आपका ईमेल पता" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="upiId"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>UPI ID</FormLabel>
                            <FormControl>
                                <Input placeholder="आपकी UPI ID" {...field} />
                            </FormControl>
                             <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                    सबमिट करें
                </Button>
            </form>
        </Form>
    </div>
  );
}
