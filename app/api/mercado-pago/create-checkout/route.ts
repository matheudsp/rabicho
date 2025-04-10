import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { getPlanDetails } from "@/app/server/mercado-pago/get-plan-details";
import { createClient } from "@/utils/supabase/server";

export async function POST(req: NextRequest) {
  try {
    const { conviteId, userEmail } = await req.json();
    
    if (!conviteId) {
      return NextResponse.json({ error: "conviteId é obrigatório" }, { status: 400 });
    }
    
    console.log("Criando checkout para:", { conviteId, userEmail });

    // Verificar se o convite tem um plano associado antes de prosseguir
    const supabase = await createClient();
    const { data: convite, error: conviteError } = await supabase
      .from('convites')
      .select('plano_id')
      .eq('id', conviteId)
      .single();
    
    if (conviteError || !convite) {
      console.error("Erro ao verificar convite:", conviteError);
      return NextResponse.json({ error: "Convite não encontrado" }, { status: 404 });
    }
    
    if (!convite.plano_id) {
      console.error("Convite sem plano associado:", conviteId);
      return NextResponse.json({ 
        error: "Este convite não tem um plano associado. Por favor, selecione um plano primeiro." 
      }, { status: 400 });
    }

    // Buscar detalhes do plano no banco de dados
    try {
      const planDetails = await getPlanDetails(conviteId);
      console.log("Detalhes do plano:", planDetails);

      const preference = new Preference(mpClient);

      const preferenceData = {
        body: {
          external_reference: conviteId,
          metadata: {
            convite_id: conviteId,
            plano_id: planDetails.planoId,
            user_email: userEmail
          },
          ...(userEmail && {
            payer: {
              email: userEmail,
            },
          }),

          items: [
            {
              id: planDetails.planoId.toString(),
              description: planDetails.planoDescricao || `Convite com ${planDetails.quantidadeRespostas} respostas`,
              title: planDetails.planoNome || "Plano de respostas",
              quantity: 1,
              unit_price: Number(planDetails.preco),
              currency_id: "BRL",
              category_id: "payment", 
            },
          ],
          payment_methods: {
            installments: 6,
          },
          auto_return: "approved",
          back_urls: {
            success: `${req.headers.get("origin")}/?status=sucesso`,
            failure: `${req.headers.get("origin")}/?status=falha`,
            pending: `${req.headers.get("origin")}/api/mercado-pago/pending`,
          },
        },
      };
      
      console.log("Dados de preferência a serem enviados:", JSON.stringify(preferenceData, null, 2));
      const createdPreference = await preference.create(preferenceData);
      console.log("Preferência criada:", JSON.stringify(createdPreference, null, 2));

      if (!createdPreference.id) {
        throw new Error("ID da preferência não gerado");
      }

      return NextResponse.json({
        preferenceId: createdPreference.id,
        initPoint: createdPreference.init_point,
      });
    } catch (planError) {
      console.error("Erro ao buscar detalhes do plano:", planError);
      return NextResponse.json({ 
        error: "Não foi possível encontrar o plano para este convite" 
      }, { status: 404 });
    }
  } catch (err) {
    console.error("Erro ao criar checkout:", err);
    return NextResponse.json({ error: "Falha ao criar checkout" }, { status: 500 });
  }
}