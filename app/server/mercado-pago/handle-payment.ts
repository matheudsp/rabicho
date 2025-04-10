import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { createClient } from "@/utils/supabase/server";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  // Logging completo para depuração
  console.log("Processando pagamento:", JSON.stringify(paymentData, null, 2));
  
  // Os metadados do Mercado Pago são convertidos para snake_case
  const metadata = paymentData.metadata || {};
  
  // Extrair os metadados necessários usando várias abordagens para aumentar a robustez
  let conviteId = metadata.convite_id || metadata.conviteId || paymentData.external_reference;
  const planoId = metadata.plano_id || metadata.planoId;
  const userEmail = metadata.user_email || metadata.userEmail;
  
  console.log("Metadados extraídos:", { conviteId, planoId, userEmail });
  
  // Tentar extrair external_reference como backup se conviteId não for encontrado
  if (!conviteId && paymentData.external_reference) {
    conviteId = paymentData.external_reference;
    console.log("Usando external_reference como conviteId:", conviteId);
  }
  
  // Validar se temos o ID do convite
  if (!conviteId) {
    console.error("Falha no pagamento: conviteId não encontrado nos metadados ou external_reference");
    return;
  }

  try {
    const supabase = await createClient();
    
    // Se não temos o planoId nos metadados, tentamos buscar do convite
    let quantidadeRespostas;
    
    if (planoId) {
      // Buscar o plano para obter a quantidade de respostas
      const { data: plano, error: planoError } = await supabase
        .from('planos')
        .select('quantidade_respostas')
        .eq('id', planoId)
        .single();
      
      if (planoError || !plano) {
        console.error(`Erro ao buscar plano com ID ${planoId}:`, planoError);
        
        // Tentar buscar o plano diretamente do convite como fallback
        const { data: convite, error: conviteError } = await supabase
          .from('convites')
          .select(`
            id,
            plano_id,
            planos (quantidade_respostas)
          `)
          .eq('id', conviteId)
          .single();
        
        if (conviteError || !convite) {
          console.error(`Erro ao buscar convite com ID ${conviteId}:`, conviteError);
          throw new Error(`Não foi possível obter as informações do plano ou do convite`);
        }
        
        // Corrigido: planos é um array, precisamos acessar o primeiro elemento
        quantidadeRespostas = convite.planos?.[0]?.quantidade_respostas;
      } else {
        quantidadeRespostas = plano.quantidade_respostas;
      }
    } else {
      // Se não temos o planoId, buscamos diretamente do convite
      const { data: convite, error: conviteError } = await supabase
        .from('convites')
        .select(`
          id,
          plano_id,
          planos (quantidade_respostas)
        `)
        .eq('id', conviteId)
        .single();
      
      if (conviteError || !convite) {
        console.error(`Erro ao buscar convite com ID ${conviteId}:`, conviteError);
        throw new Error(`Convite com ID ${conviteId} não encontrado`);
      }
      
      // Corrigido: planos é um array, precisamos acessar o primeiro elemento
      quantidadeRespostas = convite.planos?.[0]?.quantidade_respostas;
    }
    
    if (!quantidadeRespostas) {
      throw new Error(`Não foi possível determinar a quantidade de respostas permitidas`);
    }
    
    // Adicionando logs para depuração
    console.log(`Atualizando convite ${conviteId} com: pago=true, respostas_permitidas=${quantidadeRespostas}`);
    
    // Atualizar o convite como pago e definir a quantidade de respostas permitidas
    const { data: updateData, error: updateError } = await supabase
      .from('convites')
      .update({
        pago: true,
        respostas_permitidas: quantidadeRespostas,
        respostas_utilizadas: 0 // Resetar caso já tenha algum valor
      })
      .eq('id', conviteId)
      .select(); // Adicionando .select() para retornar os dados atualizados
    
    if (updateError) {
      console.error(`Erro ao atualizar convite ${conviteId}:`, updateError);
      throw updateError;
    }
    
    console.log(`Pagamento processado com sucesso para o convite ${conviteId}`);
    console.log(`Convite atualizado:`, updateData);
    
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
  }
}