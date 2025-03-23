import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";

const cairo = Cairo({ subsets: ['latin'], weight: ["500", "700", "900"] });


export const metadata: Metadata = {
  title: "حضرني",
  description: "استمتع بسهولة متابعة حضور الطلاب بدقة عالية وتقارير مفصلة تدعم إدارة الوقت وتنظيم الجداول.",
};

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
        {children}
        <Toaster />
      </body>
    </html>
  );
}
