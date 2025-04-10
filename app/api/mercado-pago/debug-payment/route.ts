
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

// Apenas para testes - REMOVER em produção
export async function POST(request: NextRequest) {
  if (process.env.NODE_ENV === "production") {
    return NextResponse.json({ error: "Not available in production" }, { status: 403 });
  }
  
  try {
    const { conviteId, planoId } = await request.json();
    
    if (!conviteId) {
      return NextResponse.json({ error: "conviteId is required" }, { status: 400 });
    }
    
    // Simulação básica de um pagamento aprovado
    const mockPaymentData = {
      id: "test_" + Date.now(),
      status: "approved",
      date_approved: new Date().toISOString(),
      external_reference: conviteId,
      metadata: {
        convite_id: conviteId,
        plano_id: planoId
      }
    };
    
    await handleMercadoPagoPayment(mockPaymentData as any);
    
    // Verificar se a atualização foi realizada
    const supabase = await createClient();
    const { data: convite, error } = await supabase
      .from('convites')
      .select('id, pago, respostas_permitidas, respostas_utilizadas')
      .eq('id', conviteId)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    
    return NextResponse.json({ 
      message: "Debug payment processed", 
      updatedConvite: convite 
    });
    
  } catch (error) {
    console.error("Error in debug payment:", error);
    return NextResponse.json({ error: "Failed to process debug payment" }, { status: 500 });
  }
}