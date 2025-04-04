"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

const CookieConsent = () => {
  const [showConsent, setShowConsent] = useState(false);

  useEffect(() => {
    // Verificar se o usuário já deu consentimento
    const hasConsent = localStorage.getItem("cookieConsent");
    if (!hasConsent) {
      setShowConsent(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookieConsent", "true");
    setShowConsent(false);
  };

  if (!showConsent) {
    return null;
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t p-4 z-50 shadow-lg">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm">
          <p>
            Usamos cookies para melhorar sua experiência. Ao continuar navegando, você concorda com nossa{" "}
            <Link href="/cookies" className="text-primary hover:underline">
              Política de Cookies
            </Link>.
          </p>
        </div>
        <div className="flex gap-2">
          <Link
            href="/cookies"
            className="px-4 py-2 text-sm border rounded-md hover:bg-muted transition-colors"
          >
            Saiba mais
          </Link>
          <button
            onClick={acceptCookies}
            className="px-4 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            Aceitar
          </button>
        </div>
      </div>
    </div>
  );
};

export default CookieConsent;