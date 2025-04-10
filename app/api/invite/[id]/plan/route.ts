import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { planId } = await request.json();
    const inviteId = (await params).id;

    console.log(`Atualizando plano do convite ${inviteId} para ${planId}`);

    const supabase = await createClient();

    // Atualizar o plano_id do convite
    const { error, data } = await supabase
      .from('convites')
      .update({ plano_id: planId })
      .eq('id', inviteId)
      .select('id, plano_id');
    
    if (error) {
      console.error(`Erro ao atualizar plano:`, error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    console.log(`Plano atualizado com sucesso:`, data);
    return NextResponse.json({ success: true, invite: data?.[0] });
  } catch (error) {
    console.error("Error updating plan:", error);
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}