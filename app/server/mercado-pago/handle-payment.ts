// app/server/mercado-pago/handle-payment.ts
import "server-only";
import { PaymentResponse } from "mercadopago/dist/clients/payment/commonTypes";
import { createClient } from "@/utils/supabase/server";

export async function handleMercadoPagoPayment(paymentData: PaymentResponse) {
  // Os metadados do Mercado Pago são convertidos para snake_case
  const metadata = paymentData.metadata;
  const userEmail = metadata.user_email; 
  const conviteId = metadata.convite_id;
  const planoId = metadata.plano_id;
  
  // Validar se temos o ID do convite
  if (!conviteId) {
    console.error("Falha no pagamento: conviteId não encontrado nos metadados");
    return;
  }

  try {
    const supabase = await createClient();
    
    // Buscar o plano para obter a quantidade de respostas
    const { data: plano } = await supabase
      .from('planos')
      .select('quantidade_respostas')
      .eq('id', planoId)
      .single();
    
    if (!plano) {
      throw new Error(`Plano com ID ${planoId} não encontrado`);
    }
    
    // Atualizar o convite como pago e definir a quantidade de respostas permitidas
    const { error } = await supabase
      .from('convites')
      .update({
        pago: true,
        respostas_permitidas: plano.quantidade_respostas,
        respostas_utilizadas: 0 // Resetar caso já tenha algum valor
      })
      .eq('id', conviteId);
    
    if (error) {
      throw error;
    }
    
    console.log(`Pagamento processado com sucesso para o convite ${conviteId}`);
    
    // Aqui você poderia adicionar notificações para o usuário, como enviar um email
    // confirmando o pagamento e informando que o convite está ativo
    
  } catch (error) {
    console.error("Erro ao processar pagamento:", error);
  }
}