import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type"); // 'galeri' or 'produk'
    const id = searchParams.get("id"); // ID from table
    const imageUrl = searchParams.get("image_url");

    if (!type || !id || !imageUrl) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const supabase = await createClient();

    // 1. Hapus file dari Supabase Storage
    // Asumsi public URL format: https://.../storage/v1/object/public/umkm-storage/folder/filename
    // Kita ekstrak path setelah "umkm-storage/"
    const storagePathMatch = imageUrl.match(/umkm-storage\/(.+)$/);
    if (storagePathMatch && storagePathMatch[1]) {
      const storagePath = storagePathMatch[1];
      const { error: storageError } = await supabase.storage
        .from('umkm-storage')
        .remove([storagePath]);
      
      if (storageError) {
        console.error("Storage delete error:", storageError);
        // Kita tidak mereturn error 500 karena file mungkin sudah tidak ada, lanjutkan hapus data DB
      }
    }

    // 2. Hapus record dari Database
    if (type === "galeri") {
      const { error: dbError } = await supabase.from("galeri").delete().eq("id", id);
      if (dbError) throw dbError;
    } else if (type === "produk") {
      const { error: dbError } = await supabase.from("produk").delete().eq("id", id);
      if (dbError) throw dbError;
    } else {
      return NextResponse.json({ error: "Invalid type" }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error: any) {
    console.error("Delete Media API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to delete media" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const type = formData.get("type") as string; // 'galeri' or 'produk'
    const umkm_id = formData.get("umkm_id") as string;
    const file = formData.get("file") as File | null;

    if (!type || !umkm_id || !file) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 });
    }

    const supabase = await createClient();
    
    // 1. Upload File
    const fileExt = file.name.split('.').pop();
    const folder = type === "galeri" ? "galeri" : type === "logo" ? "logos" : "produk";
    const fileName = `${folder}-${umkm_id}-${Date.now()}.${fileExt}`;
    const buffer = await file.arrayBuffer();
    
    const { error: uploadError } = await supabase.storage
      .from('umkm-storage')
      .upload(`${folder}/${fileName}`, buffer, { contentType: file.type });
    
    if (uploadError) {
      console.error("Upload error:", uploadError);
      return NextResponse.json({ error: "Failed to upload image" }, { status: 500 });
    }

    const { data: publicUrlData } = supabase.storage.from('umkm-storage').getPublicUrl(`${folder}/${fileName}`);
    const publicUrl = publicUrlData.publicUrl;

    // 2. Insert into Database or Return for Logo
    if (type === "logo") {
      return NextResponse.json({ success: true, data: { image: publicUrl } });
      
    } else if (type === "galeri") {
      const { data, error: dbError } = await supabase.from("galeri").insert([{
        umkm_id,
        image: publicUrl
      }]).select().single();
      
      if (dbError) throw dbError;
      return NextResponse.json({ success: true, data });
      
    } else if (type === "produk") {
      const nama = formData.get("nama") as string;
      const hargaStr = formData.get("harga") as string;
      const harga = hargaStr ? parseFloat(hargaStr) : null;
      const deskripsi = formData.get("deskripsi") as string;

      if (!nama) {
        return NextResponse.json({ error: "Nama produk harus diisi" }, { status: 400 });
      }

      const { data, error: dbError } = await supabase.from("produk").insert([{
        umkm_id,
        foto: publicUrl,
        nama,
        harga,
        deskripsi
      }]).select().single();
      
      if (dbError) throw dbError;
      return NextResponse.json({ success: true, data });
    }

    return NextResponse.json({ error: "Invalid type" }, { status: 400 });
  } catch (error: any) {
    console.error("Upload Media API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to process media" }, { status: 500 });
  }
}
