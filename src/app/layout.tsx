"use client";

import "./globals.css";
import { ThemeProvider } from "next-themes";
import Navbar from "@/app/components/layout/Navbar";
import Footer from "@/app/components/layout/Footer";
import { Toaster } from "sonner";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="sv" suppressHydrationWarning>
      {/* Lägg ThemeProvider runt allt så att dark/light påverkar html-taggen */}
      <ThemeProvider
        attribute="class"
        defaultTheme="light"
        enableSystem={false}
      >
        <body className="min-h-screen flex flex-col bg-gray-50 text-gray-900 dark:bg-[#0a0f1c] dark:text-gray-100 transition-colors duration-500 ease-in-out">
          {/* Navbar */}
          <Navbar />

          {/* Main content */}
          <main className="flex-1 pt-20 pb-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">{children}</div>
          </main>

          {/* Footer */}
          <Footer />
        </body>
        <Toaster richColors position="bottom-center" />
      </ThemeProvider>
    </html>
  );
}
