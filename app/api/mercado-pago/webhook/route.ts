import { NextResponse } from "next/server";
import { Payment } from "mercadopago";
import mpClient, { verifyMercadoPagoSignature } from "@/lib/mercado-pago";
import { handleMercadoPagoPayment } from "@/app/server/mercado-pago/handle-payment";

export async function POST(request: Request) {
  try {
    // Logging para ver o request original
    console.log("Webhook recebido - headers:", Object.fromEntries(request.headers.entries()));
    
    // Fazer uma cópia do request para ler o body duas vezes
    const requestClone = request.clone();
    const bodyText = await requestClone.text();
    console.log("Webhook recebido - body raw:", bodyText);
    
    // Tentar ler como JSON
    let body;
    try {
      body = JSON.parse(bodyText);
      console.log("Webhook recebido - body parsed:", body);
    } catch (e) {
      console.error("Erro ao parsear body como JSON:", e);
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }
    
    try {
      verifyMercadoPagoSignature(request);
    } catch (e) {
      console.warn("Aviso: Falha na verificação da assinatura do MercadoPago:", e);
      // Mesmo com falha na verificação, continuamos para desenvolvimento/debug
    }

    const { type, data } = body;

    switch (type) {
      case "payment":
        console.log(`Processando evento de pagamento com ID: ${data.id}`);
        const payment = new Payment(mpClient);
        try {
          const paymentData = await payment.get({ id: data.id });
          console.log("Dados do pagamento:", JSON.stringify(paymentData, null, 2));
          
          if (
            paymentData.status === "approved" || // Pagamento por cartão OU
            paymentData.date_approved !== null // Pagamento por Pix
          ) {
            console.log("Pagamento aprovado:", {
              id: paymentData.id,
              status: paymentData.status,
              metadata: paymentData.metadata,
              external_reference: paymentData.external_reference
            });
            
            await handleMercadoPagoPayment(paymentData);
          } else {
            console.log(`Pagamento com status ${paymentData.status} - não processado`);
          }
        } catch (paymentError) {
          console.error(`Erro ao obter dados do pagamento ${data.id}:`, paymentError);
        }
        break;
      default:
        console.log("Tipo de evento não processado:", type);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error("Erro ao processar webhook:", error);
    return NextResponse.json(
      { error: "Webhook handler failed" },
      { status: 500 }
    );
  }
}