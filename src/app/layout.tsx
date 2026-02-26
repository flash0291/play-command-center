import type { Metadata } from "next";
import localFont from "next/font/local";
import { OnboardingGuard } from "@/components/auth/onboarding-guard";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "PLAY Command Center | Palm Angels",
  description: "AI-powered campaign management for PLAY by Palm Angels U.S. market launch",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}
      >
        <OnboardingGuard>{children}</OnboardingGuard>
      </body>
    </html>
  );
}
