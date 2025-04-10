
import HeaderAuth from "@/components/header-auth";
import { ThemeSwitcher } from "@/components/theme-switcher";
import Logo from '../public/logo.png'
import { Geist } from "next/font/google";
import { ThemeProvider } from "next-themes";
import Link from "next/link";
import "./globals.css";
import { Toaster } from 'react-hot-toast';
import CookieConsent from "@/components/cookie-consent";
import Image from "next/image";
import Footer from "@/components/ui/Footer";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";


export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Rabicho",
  description: "A maneira mais rápida de convidar alguém.",

};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt_br" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <main className="min-h-screen flex flex-col items-center">
            <div className="flex-1 w-full flex flex-col items-center">
              <nav className="w-full flex justify-center border-b border-b-foreground/10 h-16">
                <div className="w-full max-w-5xl flex justify-between items-center p-3 px-5 text-sm">
                  <div className="flex gap-5 items-center font-semibold">
                    <Link href={"/"}><Image src={Logo} alt="Rabicho" width={120} /></Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              {/* Remove the max-w-sm constraint from here, we'll handle it in page-specific layouts */}
              <div className="flex flex-col gap-20 w-full">
                {children}
              </div>
              <Footer />

            </div>
            <Toaster />
            <CookieConsent />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}