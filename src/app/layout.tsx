
import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export const metadata: Metadata = {
  title: 'भारतीय तिथि दर्शक',
  description: 'हिंदू कैलेंडर और त्योहारों के लिए आपका दैनिक गाइड।',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="hi" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Literata:ital,opsz,wght@0,7..72,200..900;1,7..72,200..900&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
        </ThemeProvider>
        <script
          type="module"
          dangerouslySetInnerHTML={{
            __html: `
              // Import the functions you need from the SDKs you need
              import { initializeApp } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-app.js";
              import { getAnalytics } from "https://www.gstatic.com/firebasejs/12.0.0/firebase-analytics.js";
              // TODO: Add SDKs for Firebase products that you want to use
              // https://firebase.google.com/docs/web/setup#available-libraries

              // Your web app's Firebase configuration
              // For Firebase JS SDK v7.20.0 and later, measurementId is optional
              const firebaseConfig = {
                apiKey: "AIzaSyDygAFpVjw0HyvWKbt8WPP-oZNabIz5ob0",
                authDomain: "bhartiya-tithi-darshak.firebaseapp.com",
                projectId: "bhartiya-tithi-darshak",
                storageBucket: "bhartiya-tithi-darshak.firebasestorage.app",
                messagingSenderId: "1052160218081",
                appId: "1:1052160218081:web:f234e1dc5b3655e56378a0",
                measurementId: "G-FQ6SF66JXM"
              };

              // Initialize Firebase
              const app = initializeApp(firebaseConfig);
              const analytics = getAnalytics(app);
            `,
          }}
        />
      </body>
    </html>
  );
}
