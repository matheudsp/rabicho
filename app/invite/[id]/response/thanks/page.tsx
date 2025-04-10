"use client";

import { use, useEffect, useState } from "react";
import { createClient } from '@/utils/supabase/client';
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

export default function Agradecimento({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { id: conviteId } = use(params);
  const [convite, setConvite] = useState<any>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const supabase = createClient();

  // Obter o nome do respondente dos parâmetros de pesquisa
  const nomeRespondente = searchParams.get('name');

  useEffect(() => {
    if (!conviteId) {
      router.push('/home');
      return;
    }

    const fetchConvite = async () => {
      const { data, error } = await supabase
        .from('convites')
        .select('*')
        .eq('id', conviteId)
        .single();

      if (error || !data) {
        console.error('Erro ao buscar convite:', error);
        router.push('/');
        return;
      }

      setConvite(data);
      setIsLoading(false);
    };

    fetchConvite();
  }, [conviteId, router, supabase]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col border border-border">
      {/* Header */}
      <header className="bg-primary text-primary-foreground p-4 text-center shadow-md">
        <h1 className="text-xl font-bold">Obrigado!</h1>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-card border border-border rounded-lg p-8 shadow-lg text-center">
          <div className="bg-green-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-card-foreground mb-4">Sua Resposta Foi Registrada!</h2>

          <p className="text-muted-foreground mb-6">
            Obrigado, {nomeRespondente}! Sua resposta foi enviada com sucesso.
          </p>

          <div className="border-t border-border pt-6 mt-6">
            <Link href="/" className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 inline-block">
              Voltar à Página Inicial
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}