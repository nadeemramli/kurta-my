import { GeistSans } from "geist/font/sans";
import { ReactNode } from "react";
import "./globals.css";
import { baseUrl } from "@kurta-my/utils";
import { ClientComponents } from "./client-components";

const SITE_NAME = process.env.NEXT_PUBLIC_SITE_NAME || "Kurta MY";

export const metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  robots: {
    follow: true,
    index: true,
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={GeistSans.variable}>
      <body
        suppressHydrationWarning
        className="bg-neutral-50 text-black selection:bg-teal-300 dark:bg-neutral-900 dark:text-white dark:selection:bg-pink-500 dark:selection:text-white"
      >
        <ClientComponents>
          <main>{children}</main>
        </ClientComponents>
      </body>
    </html>
  );
}
