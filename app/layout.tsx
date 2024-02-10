import type { Metadata } from "next";
import { IBM_Plex_Sans_Thai_Looped } from "next/font/google";
import "./globals.css";
import { Providers } from './providers'

const ibm = IBM_Plex_Sans_Thai_Looped({ weight: ["100", "200", "300", "400", "500", "600", "700"],subsets: ["thai", "latin", "latin-ext"] });

export const metadata: Metadata = {
  title: "Weird To-Do List",
  description: "Welcome to the weird to-do list app.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers><body className={ibm.className}>{children}</body></Providers>
    </html>
  );
}
