// app/api/convites/[id]/plano/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  const { planoId } = await req.json();
  const conviteId = params.id;

  const supabase = await createClient();
  
  const { error } = await supabase
    .from('convites')
    .update({ plano_id: planoId })
    .eq('id', conviteId);
  
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  return NextResponse.json({ success: true });
}