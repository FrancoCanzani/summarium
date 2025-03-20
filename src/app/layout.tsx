import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Geist_Mono } from "next/font/google";

import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Summarium",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      {/* <head>
        <script src="https://unpkg.com/react-scan/dist/auto.global.js" />
      </head> */}
      <body
        className={`${geistMono.variable} font-[family-name:var(--font-geist-mono)] antialiased`}
      >
        {children}
        <Toaster />
      </body>
    </html>
  );
}
