
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
                    <Link href={"/home"}><Image src={Logo} alt="Rabicho" width={120} /></Link>
                  </div>
                  <HeaderAuth />
                </div>
              </nav>
              {/* Remove the max-w-sm constraint from here, we'll handle it in page-specific layouts */}
              <div className="flex flex-col gap-20 w-full">
                {children}
              </div>

              <footer className="w-full border-t mx-auto text-center text-xs py-10">
                <div className="max-w-5xl mx-auto px-5">
                  <div className="flex flex-wrap justify-center gap-6 mb-4">
                    <Link href="/about/terms" className="hover:underline">Termos de Uso</Link>
                    <Link href="/about/privacy" className="hover:underline">Política de Privacidade</Link>
                    <Link href="/about/cookies" className="hover:underline">Política de Cookies</Link>
                    <Link href="/about/support" className="hover:underline">Suporte</Link>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-6">
                    <p>
                      Powered by{" "}
                      <a
                        href="https://www.instagram.com/matheudsp"
                        target="_blank"
                        className="font-bold hover:underline"
                        rel="noreferrer"
                      >
                        matheudsp
                      </a>
                    </p>
                    <p>© {new Date().getFullYear()} Rabicho.</p>
                    <ThemeSwitcher />
                  </div>
                </div>
              </footer>
            </div>
            <Toaster />
            <CookieConsent />
          </main>
        </ThemeProvider>
      </body>
    </html>
  );
}