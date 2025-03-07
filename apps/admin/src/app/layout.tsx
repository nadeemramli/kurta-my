import { AdminAuthProvider } from "@/components/auth/auth-context";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";

export const metadata = {
  title: "Admin Dashboard - Kurta MY",
  description: "Admin dashboard for Kurta MY e-commerce platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${GeistSans.variable} ${GeistMono.variable} font-sans`}
        suppressHydrationWarning
      >
        <AdminAuthProvider>{children}</AdminAuthProvider>
      </body>
    </html>
  );
}
