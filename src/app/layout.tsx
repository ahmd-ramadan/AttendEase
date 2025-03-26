import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import MainLayout from "@/components/MainLayout";

const cairo = Cairo({ subsets: ['latin'], weight: ["500", "700", "900"] });

export const generateMetadata = async(): Promise<Metadata> => {
  
  const  title = "حضرني";
  const description = "استمتع بسهولة متابعة حضور الطلاب بدقة عالية وتقارير مفصلة تدعم إدارة الوقت وتنظيم الجداول.";

  return {
    title,
    description,
    icons: {
        icon: ['/favicon.ico?v=4'],
        apple: ['/apple-touch-icon.png?v=4'],
        shortcut: ['/apple-touch-icon.png']
    },
    openGraph: {
        title,
        description,
        type: 'website',
        url: process.env.NEXT_PUBLIC_DOMAIN,
        images: [{ url: "/logo.svg", width: 800, height: 600, alt: 'Image description' }]
    },
    twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: ["/logo.svg"]
    }
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="ar" dir="rtl">
      <body
        className={cairo.className}
      >
        <MainLayout children={children} />
        <Toaster />
      </body>
    </html>
  );
}
