import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    
    if (!id) {
      return NextResponse.json({ error: "Missing product ID" }, { status: 400 });
    }

    const body = await request.json();
    const { nama, harga, deskripsi } = body;

    const supabase = await createClient();

    const { data, error } = await supabase
      .from("produk")
      .update({ nama, harga, deskripsi })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Update Produk API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to update produk" }, { status: 500 });
  }
}
