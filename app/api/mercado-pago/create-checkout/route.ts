// app/api/mercado-pago/create-checkout/route.ts
import { NextRequest, NextResponse } from "next/server";
import { Preference } from "mercadopago";
import mpClient from "@/lib/mercado-pago";
import { getPlanDetails } from "@/app/server/mercado-pago/get-plan-details";

export async function POST(req: NextRequest) {
  const { conviteId, userEmail } = await req.json();

  try {
    // Buscar detalhes do plano no banco de dados
    const planDetails = await getPlanDetails(conviteId);
    
    const preference = new Preference(mpClient);

    const createdPreference = await preference.create({
      body: {
        external_reference: conviteId,
        metadata: {
          conviteId,
          planoId: planDetails.planoId,
          userEmail
        },
        ...(userEmail && {
          payer: {
            email: userEmail,
          },
        }),

        items: [
          {
            id: conviteId,
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
    });

    if (!createdPreference.id) {
      throw new Error("No preferenceID");
    }

    return NextResponse.json({
      preferenceId: createdPreference.id,
      initPoint: createdPreference.init_point,
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Falha ao criar checkout" }, { status: 500 });
  }
}