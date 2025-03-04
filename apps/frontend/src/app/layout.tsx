import { GeistSans } from "geist/font/sans";
import { Viewport } from "next";
import { ReactNode } from "react";
import "./globals.css";

export const metadata = {
  title: "Kurta My Store",
  description: "Your one-stop shop for kurtas",
};

export const viewport: Viewport = {
  themeColor: "white",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.className}>
      <body className="bg-white text-black selection:bg-teal-300 dark:bg-black dark:text-white dark:selection:bg-fuchsia-600 dark:selection:text-white">
        {children}
      </body>
    </html>
  );
}
