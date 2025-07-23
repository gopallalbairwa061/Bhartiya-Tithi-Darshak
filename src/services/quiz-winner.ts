
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

    console.log("---------- NEW QUIZ WINNER ----------");
    console.log("Name:   ", validation.data.name);
    console.log("Email:  ", validation.data.email);
    console.log("UPI ID: ", validation.data.upiId);
    console.log("-------------------------------------");

    // In a real application, you would integrate an email service here.
    // Example:
    // await sendEmail({
    //   to: 'myselfmk061@gmail.com',
    //   subject: 'New Quiz Winner!',
    //   body: `Name: ${validation.data.name}\nEmail: ${validation.data.email}\nUPI ID: ${validation.data.upiId}`
    // });
    
    // Simulating success
    return { success: true, message: "विवरण सफलतापूर्वक भेजा गया।" };

  } catch (error) {
    console.error("Error handling quiz winner:", error);
    return { success: false, message: "विवरण भेजने में विफल।" };
  }
}

    