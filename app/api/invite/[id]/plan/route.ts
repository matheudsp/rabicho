import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

type RouteParams = {
  params: {
    id: string;
  };
};

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { planId } = await request.json();
    const inviteId = (await params).id;

    const supabase = await createClient();

    const { error } = await supabase
      .from('invites')
      .update({ plan_id: planId })
      .eq('id', inviteId);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update plan" }, { status: 500 });
  }
}