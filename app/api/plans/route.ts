// app/api/plans/route.ts
import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

export async function GET() {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('planos')
    .select('*')
    .order('preco');
  
  if (error) {
    console.error("Supabase error fetching plans:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  
  // Ensure we always return an array
  return NextResponse.json(data || []);
}