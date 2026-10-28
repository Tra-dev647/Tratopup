import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "Tratopup | MLBB Top-Up",
    template: "%s | Tratopup",
  },
  description:
    "Top up game credits in seconds. Pick your game, enter your player details, choose a package and pay securely.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="text-slate-100 antialiased">
        <Navbar />
        <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-6 sm:px-6 lg:px-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
