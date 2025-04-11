import type { Metadata } from "next";
import { Toaster } from "@/components/ui/sonner";
import { Noto_Sans } from "next/font/google";
import Providers from "@/components/providers";

import "./globals.css";

const noto = Noto_Sans({ subsets: ["cyrillic"] });

export const metadata: Metadata = {
  title: "Summarium",
  description: "Productivity is simple again",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${noto.className} antialiased`}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
