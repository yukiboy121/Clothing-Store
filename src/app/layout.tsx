import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Navigation } from "@/components/Navigation";
import { CartDrawer } from "@/components/CartDrawer";
import { SearchModal } from "@/components/SearchModal";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Dragon Group LK",
  description: "Premium Custom Apparel, Printing, and Clothing Manufacturer in Sri Lanka.",
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
