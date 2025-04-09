// app/server/mercado-pago/get-plan-details.ts
import "server-only";
import { createClient } from "@/utils/supabase/server";

interface PlanoData {
  id: number;
  nome: string;
  descricao: string;
  quantidade_respostas: number;
  preco: number;
}

interface ConviteWithPlano {
  id: string;
  plano_id: number;
  planos: PlanoData;
}

export async function getPlanDetails(conviteId: string) {
  const supabase = await createClient();
  
  // Buscar o convite e o plano associado
  const { data, error } = await supabase
    .from('convites')
    .select(`
      id,
      plano_id,
      planos (
        id,
        nome,
        descricao,
        quantidade_respostas,
        preco
      )
    `)
    .eq('id', conviteId)
    .single();
  
  if (error || !data) {
    throw new Error('Falha ao buscar detalhes do plano');
  }
  
  // Garantir que temos os dados corretos
  const conviteData = data as unknown as ConviteWithPlano;
  
  if (!conviteData.planos) {
    throw new Error('Plano não encontrado para este convite');
  }
  
  return {
    conviteId: conviteData.id,
    planoId: conviteData.plano_id,
    planoNome: conviteData.planos.nome,
    planoDescricao: conviteData.planos.descricao,
    quantidadeRespostas: conviteData.planos.quantidade_respostas,
    preco: conviteData.planos.preco
  };
}