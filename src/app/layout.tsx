import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import Navbar from "@/components/Navbar/Navbar";
import Footer from "@/components/Footer/Footer";

const inter = Inter({
  variable: "--font-body",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Desa Winong | Portal UMKM & Pemberdayaan Ekonomi",
  description: "Website Resmi Desa Winong, Kec. Gemarang, Kab. Madiun. Temukan informasi profil desa dan direktori UMKM lokal.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <Navbar />
        <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
          <main style={{ flex: 1 }}>{children}</main>
        </div>
        <Footer />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"
          strategy="beforeInteractive"
        />
        <Script
          src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js"
          strategy="beforeInteractive"
        />
      </body>
    </html>
  );
}
