import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Drag and Drop Grid - Create and Customize Your Layout",
  description: "Easily create and customize your grid layout with our drag-and-drop interface. Perfect for projects, portfolios, and more.",
  openGraph: {
    title: "Drag and Drop Grid",
    description: "Easily create and customize your grid layout with our drag-and-drop interface.",
    url: "https://draganddropgrid.vercel.app/",
    images: [
      {
        url: "/favicon.ico",
        width: 64,
        height: 64,
        alt: "Drag and Drop Grid",
      },
    ],
  },
  twitter: {
    card: "summary",
    title: "Drag and Drop Grid",
    description: "Easily create and customize your grid layout with our drag-and-drop interface.",
    images: [
      {
        url: "/favicon.ico",
        width: 64,
        height: 64,
        alt: "Drag and Drop Grid",
      },
    ],
  },
  viewport: "width=device-width, initial-scale=1.0",
  robots: "index, follow",
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
      </body>
    </html>
  );
}
