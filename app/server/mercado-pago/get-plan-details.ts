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
  console.log(`Buscando detalhes do plano para o convite: ${conviteId}`);
  
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
  
  if (error) {
    console.error(`Erro ao buscar convite ${conviteId}:`, error);
    throw new Error(`Falha ao buscar detalhes do plano: ${error.message}`);
  }
  
  if (!data) {
    console.error(`Nenhum convite encontrado com ID ${conviteId}`);
    throw new Error('Convite não encontrado');
  }
  
  console.log(`Dados do convite obtidos:`, data);
  
  // Garantir que temos os dados corretos
  const conviteData = data as unknown as ConviteWithPlano;
  
  if (!conviteData.plano_id) {
    console.error(`Convite ${conviteId} não tem um plano associado`);
    throw new Error('Este convite não tem um plano associado');
  }
  
  if (!conviteData.planos) {
    console.error(`Plano ${conviteData.plano_id} associado ao convite ${conviteId} não encontrado`);
    throw new Error('Plano não encontrado para este convite');
  }
  
  const result = {
    conviteId: conviteData.id,
    planoId: conviteData.plano_id,
    planoNome: conviteData.planos.nome,
    planoDescricao: conviteData.planos.descricao,
    quantidadeRespostas: conviteData.planos.quantidade_respostas,
    preco: conviteData.planos.preco
  };
  
  console.log(`Detalhes do plano obtidos:`, result);
  return result;
}