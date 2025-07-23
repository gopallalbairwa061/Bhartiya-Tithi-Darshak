
'use server';

import { z } from 'zod';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'myselfmk061@gmail.com',
      subject: 'New Quiz Winner on Bharatiya Tithi Darshak!',
      html: `
        <h1>New Quiz Winner!</h1>
        <p>A user has scored 10/10 on the daily quiz.</p>
        <h2>Winner Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>UPI ID:</strong> ${upiId}</li>
        </ul>
      `
    });

    console.log("---------- NEW QUIZ WINNER (Email Sent) ----------");
    console.log("Name:   ", name);
    console.log("Email:  ", email);
    console.log("UPI ID: ", upiId);
    console.log("-------------------------------------------------");

    return { success: true, message: "विवरण सफलतापूर्वक भेजा गया।" };

  } catch (error) {
    console.error("Error handling quiz winner:", error);
    return { success: false, message: "विवरण भेजने में विफल।" };
  }
}
