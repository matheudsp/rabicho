
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const inviteId = (await params).id;
    const supabase = await createClient();

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
      .eq('id', inviteId)
      .single();
    
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Error checking plan:", error);
    return NextResponse.json({ error: "Failed to check plan" }, { status: 500 });
  }
}