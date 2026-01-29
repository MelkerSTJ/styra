"use client";

import "./globals.css";
import Script from "next/script";

import { ThemeProvider } from "next-themes";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Toaster } from "sonner";
import { SessionProvider } from "next-auth/react";

const GTM_ID = process.env.NEXT_PUBLIC_GTM_ID;

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="sv"
      suppressHydrationWarning
      className="bg-gray-50 text-gray-900 dark:bg-[#0a0f1c] dark:text-gray-100 transition-colors duration-500 ease-in-out"
    >
      <head>
        {GTM_ID && (
          <Script
            id="gtm"
            strategy="afterInteractive"
            dangerouslySetInnerHTML={{
              __html: `
                (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
                new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
                j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
                'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
                })(window,document,'script','dataLayer','${GTM_ID}');
              `,
            }}
          />
        )}
      </head>

      <body className="min-h-screen flex flex-col">
        {GTM_ID && (
          <noscript>
            <iframe
              src={`https://www.googletagmanager.com/ns.html?id=${GTM_ID}`}
              height="0"
              width="0"
              style={{ display: "none", visibility: "hidden" }}
            />
          </noscript>
        )}

        <SessionProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="light"
            enableSystem={false}
          >
            <Navbar />

            <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
              <div className="max-w-6xl mx-auto">{children}</div>
            </main>

            <Footer />
            <Toaster richColors position="bottom-center" />
          </ThemeProvider>
        </SessionProvider>
      </body>
    </html>
  );
}
