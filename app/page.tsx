import Link from "next/link";
import { ThemeSwitcher } from "@/components/theme-switcher";
import { Check } from "lucide-react";
import React from "react";
import ConvitesDemo from "@/components/convitesDemo";

// Define button props interface
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  className?: string;
  size?: "default" | "sm" | "lg";
  variant?: "default" | "outline";
  asChild?: boolean;
}

// Simple Button component to replace the missing UI component
const Button: React.FC<ButtonProps> = ({
  children,
  className = "",
  size = "default",
  variant = "default",
  asChild = false,
  ...props
}) => {
  const sizeClasses: Record<string, string> = {
    default: "py-2 px-4",
    sm: "py-1 px-3 text-sm",
    lg: "py-3 px-6 text-lg"
  };

  const variantClasses: Record<string, string> = {
    default: "bg-blue-600 hover:bg-blue-700 text-white",
    outline: "border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800"
  };

  const baseClasses = "inline-flex items-center justify-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2";

  const classes = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className}`;

  if (asChild) {
    return (
      <div className={classes}>
        {children}
      </div>
    );
  }

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

// Define card props interfaces
interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

// Simple Card component to replace the missing UI component
const Card: React.FC<CardProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden ${className}`} {...props}>
      {children}
    </div>
  );
};

interface CardContentProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

const CardContent: React.FC<CardContentProps> = ({ children, className = "", ...props }) => {
  return (
    <div className={`p-6 ${className}`} {...props}>
      {children}
    </div>
  );
};

export default function LandingPage(): React.ReactElement {
  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full py-12 md:py-24 lg:py-32 flex flex-col items-center text-center px-4">
        <div className="max-w-3xl mx-auto space-y-4">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">
            Convites digitais personalizados para suas ocasiões especiais
          </h1>
          <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400">
            Crie convites únicos com temas personalizados, música ambiente e formulários interativos para seus convidados.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <Link href="/register" className="py-3 px-6 text-lg bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
              Começar agora
            </Link>
            <Link href="#exemplos" className="py-3 px-6 text-lg border border-gray-300 hover:bg-gray-100 dark:border-gray-700 dark:hover:bg-gray-800 rounded-md font-medium transition-colors">
              Ver exemplos
            </Link>
          </div>
        </div>

        {/* Hero Image */}
        <div className="mt-12 relative w-full max-w-3xl h-64 md:h-96 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950 dark:to-purple-900 rounded-xl overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="p-6 bg-white/90 dark:bg-black/80 rounded-lg shadow-lg max-w-md text-center">
              <h3 className="text-xl font-bold mb-2">Convite para Festa de Aniversário</h3>
              <p className="mb-4">Você está convidado para celebrar comigo!</p>
              <div className="flex justify-center">
                <Link href="#" className="py-1 px-3 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                  Confirmar presença
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-gray-900" id="recursos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Recursos que transformam seus convites</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardContent>
                <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path>
                    <line x1="4" x2="4" y1="22" y2="15"></line>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Temas Personalizados</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Escolha entre diversos temas ou personalize um exclusivo para sua ocasião especial.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M9 18V5l12-2v13"></path>
                    <circle cx="6" cy="18" r="3"></circle>
                    <circle cx="18" cy="16" r="3"></circle>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Música Ambiente</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Adicione uma trilha sonora ao seu convite para criar a atmosfera perfeita.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <div className="mb-4 p-2 bg-blue-100 dark:bg-blue-900 rounded-full w-12 h-12 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600 dark:text-blue-400">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                    <polyline points="22 4 12 14.01 9 11.01"></polyline>
                  </svg>
                </div>
                <h3 className="text-xl font-bold mb-2">Formulários Interativos</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Crie perguntas personalizadas para seus convidados e colete todas as respostas em um só lugar.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="w-full py-12 md:py-24" id="precos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-6">Planos acessíveis para qualquer ocasião</h2>
          <p className="text-center text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-12">
            Preços simples e transparentes baseados na quantidade de pessoas que você precisa convidar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all">
              <CardContent>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Convite Básico</h3>
                  <div className="text-4xl font-bold">R$ 3,49</div>
                  <p className="text-sm text-gray-500 mt-1">por convite</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>1 convite personalizado</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Todos os temas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Biblioteca músicas</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Formulários ilimitados</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Relatório de respostas</span>
                  </li>
                </ul>

                <div className="mt-6">
                  <Link href="/register?plan=basic" className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                    Escolher plano
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-blue-600 relative">
              <div className="absolute -top-4 left-0 right-0 flex justify-center">
                <span className="bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">Popular</span>
              </div>
              <CardContent className="flex-col flex justify-between">
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Convite Grupo</h3>
                  <div className="text-4xl font-bold">R$ 9,90</div>
                  <p className="text-sm text-gray-500 mt-1">até 10 respostas</p>
                </div>

                <ul className="space-y-3">
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Todos os recursos do convite Básico</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>10 convites personalizados</span>
                  </li>

                  
                </ul>

                <div className="mt-6">
                  <Link href="/register?plan=group" className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                    Escolher plano
                  </Link>
                </div>
              </CardContent>
            </Card>

            <Card className="border-2 border-gray-200 hover:border-blue-500 transition-all">
              <CardContent>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-medium mb-2">Convite Evento</h3>
                  <div className="text-4xl font-bold">R$ 19,90</div>
                  <p className="text-sm text-gray-500 mt-1">até 100 respostas</p>
                </div>

                <ul className="space-y-3">
                <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>Todos recursos do plano Grupo</span>
                  </li>
                  <li className="flex items-center">
                    <Check className="h-5 w-5 text-green-500 mr-2" />
                    <span>100 convites personalizados</span>
                  </li>
                 
                
                </ul>

                <div className="mt-6 flex self-end">
                  <Link href="/register?plan=event" className="block w-full text-center py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-md font-medium transition-colors">
                    Escolher plano
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Examples Section */}
      <section className="w-full py-12 md:py-16 bg-gray-50 dark:bg-gray-900" id="exemplos">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-center mb-12">Exemplos de convites</h2>

          <div className="flex justify-center items-center">
           <ConvitesDemo />
          </div>
        </div>
      </section>
    </div>
  );
}