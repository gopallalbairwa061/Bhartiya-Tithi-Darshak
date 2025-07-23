
'use server';

import { z } from 'zod';
import nodemailer from 'nodemailer';

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
    
    // Create a transporter object using the default SMTP transport
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: Number(process.env.SMTP_PORT) === 465, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    await transporter.sendMail({
      from: `"भारतीय तिथि दर्शक" <${process.env.SMTP_USER}>`, // sender address
      to: 'myselfmk061@gmail.com', // list of receivers
      subject: `🎉 भारतीय तिथि दर्शक पर नए प्रश्नोत्तरी विजेता! (New Quiz Winner!)`,
      html: `
        <!DOCTYPE html>
        <html lang="hi">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>🎉 भारतीय तिथि दर्शक - नए प्रश्नोत्तरी विजेता!</title>
          <style>
            body { font-family: 'Arial', sans-serif; background-color: #fdfaf6; color: #333; line-height: 1.6; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border: 1px solid #e0e0e0; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 15px rgba(0,0,0,0.05); }
            .header { background: linear-gradient(135deg, #FF9933, #FFC300); padding: 25px; text-align: center; color: white; }
            .header h1 { margin: 0; font-size: 26px; font-weight: bold; }
            .content { padding: 25px 30px; }
            .content h2 { color: #d63384; font-size: 20px; border-bottom: 2px solid #fce4ec; padding-bottom: 5px; margin-bottom: 20px;}
            .content p { font-size: 16px; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #888; background-color: #f9f9f9; }
            ul { list-style-type: none; padding: 0; }
            li { background-color: #f8f9fa; margin-bottom: 10px; padding: 12px 15px; border-radius: 8px; border-left: 4px solid #17a2b8; }
            strong { color: #343a40; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🏆 बधाई हो! एक नए विजेता! 🏆</h1>
            </div>
            <div class="content">
              <p>नमस्ते,</p>
              <p>भारतीय तिथि दर्शक पर एक उपयोगकर्ता ने दैनिक प्रश्नोत्तरी में 10/10 अंक प्राप्त किए हैं और पुरस्कार के लिए अपना विवरण प्रस्तुत किया है।</p>
              <h2>विजेता का विवरण (Winner's Details):</h2>
              <ul>
                <li><strong>नाम (Name):</strong> ${name}</li>
                <li><strong>ईमेल (Email):</strong> ${email}</li>
                <li><strong>UPI ID:</strong> ${upiId}</li>
              </ul>
              <p>कृपया पुरस्कार राशि भेजने के लिए विवरण सत्यापित करें।</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} भारतीय तिथि दर्शक। सर्वाधिकार सुरक्षित।</p>
            </div>
          </div>
        </body>
        </html>
      `
    });

    console.log("---------- NEW QUIZ WINNER (Email Sent via SMTP) ----------");
    console.log("Name:   ", name);
    console.log("Email:  ", email);
    console.log("UPI ID: ", upiId);
    console.log("---------------------------------------------------------");

    return { success: true, message: "विवरण सफलतापूर्वक भेजा गया।" };

  } catch (error) {
    console.error("Error handling quiz winner via SMTP:", error);
    // Check for specific SMTP errors if needed
    if (error instanceof Error && 'code' in error) {
        const smtpError = error as { code: string, message: string };
        if (smtpError.code === 'EAUTH') {
            return { success: false, message: "SMTP प्रमाणीकरण विफल। कृपया अपनी क्रेडेन्शियल जांचें।" };
        }
    }
    return { success: false, message: "ईमेल भेजने में विफल। कृपया अपनी SMTP सेटिंग्स जांचें।" };
  }
}
