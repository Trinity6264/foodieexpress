
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Footer from "@/components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FoodieExpress",
  keywords: ["Food Delivery", "Restaurants", "Online Ordering", "Ghana"],
  authors: [{ name: "AAMUSTED Students" }],
  creator: "AAMUSTED Students",
  openGraph: {
    title: "FoodieExpress",
    description: "Ghana's leading food delivery platform connecting you with the best local and international restaurants.",
    url: "https://foodieexpress.com",
    siteName: "FoodieExpress",
    images: [
      {
        url: "https://foodieexpress.com/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "FoodieExpress - Food Delivery in Ghana",
      },
    ],
    locale: "en_GH",
    type: "website",
  },
  description: "FoodieExpress is Ghana's leading food delivery platform, connecting you with the best local and international restaurants. Enjoy a seamless online ordering experience with a wide variety of cuisines delivered right to your doorstep.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

        {children}

        {/* Start Footer */}

        <Footer />

        {/* End Footer */}
      </body>
    </html>
  );
}
