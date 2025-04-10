import Link from "next/link";
import { ThemeSwitcher } from "../theme-switcher";

export default function Footer() {
  return (
    <footer className="bg-background py-8 px-4 border-t w-full">
      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between gap-8">
          <div>
            <h3 className="font-bold text-xl mb-2">Rabicho</h3>
            <p className="text-sm text-muted-foreground max-w-xs">
              Convites digitais que conectam pessoas e tornam seus eventos ainda mais especiais.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
            {/* <div>
            <h4 className="font-medium mb-3">Produto</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Recursos</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Preços</Link></li>
              <li><Link href="#" className="text-muted-foreground hover:text-foreground">Exemplos</Link></li>
            </ul>
          </div> */}

            <div>
              <h4 className="font-medium mb-3">Sobre</h4>
              <ul className="space-y-2 text-sm">
                {/* <li><Link href="#" className="text-muted-foreground hover:text-foreground">Sobre nós</Link></li> */}
                <li><Link href="/about/support" className="text-muted-foreground hover:text-foreground">Suporte</Link></li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-3">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/about/terms" className="text-muted-foreground hover:text-foreground">Termos</Link></li>
                <li><Link href="/about/privacy" className="text-muted-foreground hover:text-foreground">Privacidade</Link></li>
                <li><Link href="/about/cookies" className="text-muted-foreground hover:text-foreground">Cookies</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* <div className="mt-8 pt-6 border-t text-sm text-center text-muted-foreground">
      
        © {new Date().getFullYear()} Rabicho. Todos os direitos reservados.
      </div> */}
        <div className="mt-8 pt-6 border-t text-sm text-center text-muted-foreground flex flex-wrap items-center justify-center gap-6">
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
  )
}