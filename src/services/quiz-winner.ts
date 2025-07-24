
'use server';

import { z } from 'zod';

const WinnerDetailsSchema = z.object({
  name: z.string().min(2, 'कम से कम 2 अक्षर का नाम आवश्यक है।'),
  email: z.string().email('अमान्य ईमेल पता।'),
  upiId: z.string().regex(/^[\w.-]+@[\w.-]+$/, 'अमान्य UPI ID।'),
});

export type WinnerDetails = z.infer<typeof WinnerDetailsSchema>;

export async function handleQuizWinner(details: WinnerDetails): Promise<{ success: boolean; message: string }> {
  try {
    const validation = WinnerDetailsSchema.safeParse(details);
    if (!validation.success) {
      console.error("Invalid winner details:", validation.error.flatten());
      return { success: false, message: "अमान्य डेटा।" };
    }

    const { name, email, upiId } = validation.data;
    
    // Since email sending is removed, we just log the details to the server console.
    // In a real application, you would integrate with a reliable email service or save to a database.
    console.log("*******************************************");
    console.log("********** NEW QUIZ WINNER **********");
    console.log("*******************************************");
    console.log("Name:   ", name);
    console.log("Email:  ", email);
    console.log("UPI ID: ", upiId);
    console.log("*******************************************");

    return { success: true, message: "विवरण सफलतापूर्वक प्राप्त हुआ।" };

  } catch (error) {
    console.error("Error handling quiz winner:", error);
    return { success: false, message: "विवरण को संसाधित करने में विफल।" };
  }
}
