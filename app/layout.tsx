import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/react";
import Layout from "@/components/layout";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Clutch",
  description: "Number one social media app focused on communities",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Layout>{children}</Layout>
        <Analytics />
      </body>
    </html>
  );
}
