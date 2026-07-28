import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "UNTERGRUND — Premium Streetwear",
  description: "Built for the underground. Limited drops. Premium quality. No restocks. Australian luxury streetwear.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-void text-white antialiased">
        <Navigation />
        <SearchModal />
        <CartDrawer />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
