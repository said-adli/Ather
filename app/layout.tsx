import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { BottomNav } from "@/components/layout/BottomNav";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const viewport: Viewport = {
  themeColor: "#ffffff",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "أثر — تطبيق إسلامي",
  description: "تطبيق إسلامي شامل: القرآن الكريم، الأذكار، تتبع العادات، وختمة القرآن",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "أثر",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl" className="h-full antialiased">
      <body className={`${inter.className} h-full overflow-hidden bg-slate-50 text-slate-900`}>
        <div className="flex flex-col h-full mx-auto max-w-md bg-white shadow-2xl overflow-hidden relative">
          
          {/* Main Content Area */}
          <main className="flex-1 overflow-y-auto pb-24 scroll-smooth">
            {children}
          </main>

          {/* Bottom Navigation Bar */}
          <BottomNav />
          
        </div>
      </body>
    </html>
  );
}
