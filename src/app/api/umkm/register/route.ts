import { NextResponse } from "next/server"
import { createClient } from "@/lib/supabase/server"

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    
    // Identitas
    const owner_name = formData.get("owner_name") as string
    const nik = formData.get("nik") as string
    const phone = formData.get("phone") as string
    
    // Data Usaha
    const business_name = formData.get("business_name") as string
    const category_id = formData.get("category_id") as string
    const description = formData.get("description") as string
    const jam_operasional = formData.get("jam_operasional") as string
    const nib = formData.get("nib") as string | null
    const social_media_link = formData.get("social_media") as string | null
    
    // Foto Logo, Banner, Menu, Lokasi
    const logo = formData.get("logo") as File | null
    const banner = formData.get("banner") as File | null
    const foto_menu = formData.get("foto_menu") as File | null
    const foto_lokasi = formData.get("foto_lokasi") as File | null
    
    // Lokasi
    const alamat = formData.get("alamat") as string
    const dusun = formData.get("dusun") as string
    const latitude = formData.get("latitude") ? parseFloat(formData.get("latitude") as string) : null
    const longitude = formData.get("longitude") ? parseFloat(formData.get("longitude") as string) : null
    
    // Jumlah Produk Dinamis
    const productCountStr = formData.get("product_count") as string
    const productCount = productCountStr ? parseInt(productCountStr) : 1

    if (!owner_name || !nik || !business_name || !category_id || !alamat) {
      return NextResponse.json({ error: "Mohon isi semua kolom yang wajib." }, { status: 400 })
    }

    if (!foto_lokasi || foto_lokasi.size === 0) {
      return NextResponse.json({ error: "Foto Lokasi / Tempat Usaha wajib diunggah." }, { status: 400 })
    }

    const supabase = await createClient()

    // 1. Upload Logo jika ada
    let logo_url = null
    if (logo && logo.size > 0) {
      const fileExt = logo.name.split('.').pop()
      const fileName = `logo-${Date.now()}.${fileExt}`
      const buffer = await logo.arrayBuffer()
      const { error: uploadError } = await supabase.storage
        .from('umkm-storage')
        .upload(`logos/${fileName}`, buffer, { contentType: logo.type })
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('umkm-storage').getPublicUrl(`logos/${fileName}`)
        logo_url = publicUrlData.publicUrl
      } else {
        console.error("Supabase Storage Error (Logo):", uploadError)
      }
    }

    // Upload Banner jika ada
    let banner_url = null
    if (banner && banner.size > 0) {
      const fileExt = banner.name.split('.').pop()
      const fileName = `banner-${Date.now()}.${fileExt}`
      const buffer = await banner.arrayBuffer()
      const { error: uploadError } = await supabase.storage
        .from('umkm-storage')
        .upload(`galeri/${fileName}`, buffer, { contentType: banner.type })
      
      if (!uploadError) {
        const { data: publicUrlData } = supabase.storage.from('umkm-storage').getPublicUrl(`galeri/${fileName}`)
        banner_url = publicUrlData.publicUrl
      } else {
        console.error("Supabase Storage Error (Banner):", uploadError)
      }
    }

    let social_media = null
    if (social_media_link) {
      social_media = { link: social_media_link }
    }

    // 2. Insert into UMKM table
    const { data: umkmData, error: umkmError } = await supabase
      .from("umkm")
      .insert([{
        owner_name, nik, phone, business_name, category_id,
        description, jam_operasional, nib: nib || null,
        social_media, alamat, dusun, latitude, longitude,
        logo_url, status: "PENDING"
      }])
      .select().single()

    if (umkmError) {
      console.error("Supabase Insert Error (UMKM):", umkmError)
      if (umkmError.code === '23505') return NextResponse.json({ error: "NIK tersebut sudah terdaftar." }, { status: 400 })
      return NextResponse.json({ error: umkmError.message }, { status: 500 })
    }

    // 3. Upload Foto Menu (Khusus Warkop/Kuliner) -> Masuk ke Galeri
    if (foto_menu && foto_menu.size > 0) {
      const fileExt = foto_menu.name.split('.').pop()
      const fileName = `menu-${umkmData.id}-${Date.now()}.${fileExt}`
      const buffer = await foto_menu.arrayBuffer()
      const { error: menuUploadError } = await supabase.storage
        .from('umkm-storage')
        .upload(`galeri/${fileName}`, buffer, { contentType: foto_menu.type })
      
      if (!menuUploadError) {
        const { data: menuPublicUrl } = supabase.storage.from('umkm-storage').getPublicUrl(`galeri/${fileName}`)
        // Simpan ke tabel galeri
        await supabase.from("galeri").insert([{
          umkm_id: umkmData.id,
          image: menuPublicUrl.publicUrl
        }])
      } else {
        console.error("Supabase Storage Error (Foto Menu):", menuUploadError)
      }
    }

    // 3.5 Upload Foto Lokasi -> Masuk ke Galeri
    if (foto_lokasi && foto_lokasi.size > 0) {
      const fileExt = foto_lokasi.name.split('.').pop()
      const fileName = `lokasi-${umkmData.id}-${Date.now()}.${fileExt}`
      const buffer = await foto_lokasi.arrayBuffer()
      const { error: lokasiUploadError } = await supabase.storage
        .from('umkm-storage')
        .upload(`galeri/${fileName}`, buffer, { contentType: foto_lokasi.type })
      
      if (!lokasiUploadError) {
        const { data: lokasiPublicUrl } = supabase.storage.from('umkm-storage').getPublicUrl(`galeri/${fileName}`)
        await supabase.from("galeri").insert([{
          umkm_id: umkmData.id,
          image: lokasiPublicUrl.publicUrl
        }])
      } else {
        console.error("Supabase Storage Error (Foto Lokasi):", lokasiUploadError)
      }
    }

    // 3.8 Insert Banner ke Galeri jika ada
    if (banner_url) {
      await supabase.from("galeri").insert([{
        umkm_id: umkmData.id,
        image: banner_url
      }])
    }

    // 4. Proses Produk Dinamis
    const productsToInsert = []
    for (let i = 1; i <= productCount; i++) {
      const p_nama = formData.get(`produk_${i}_nama`) as string
      const p_harga = formData.get(`produk_${i}_harga`) as string
      const p_deskripsi = formData.get(`produk_${i}_deskripsi`) as string
      const p_foto = formData.get(`produk_${i}_foto`) as File | null

      if (p_nama) {
        let foto_url = null
        if (p_foto && p_foto.size > 0) {
          const fileExt = p_foto.name.split('.').pop()
          const fileName = `produk-${umkmData.id}-${i}-${Date.now()}.${fileExt}`
          const buffer = await p_foto.arrayBuffer()
          const { error: pUploadError } = await supabase.storage
            .from('umkm-storage')
            .upload(`produk/${fileName}`, buffer, { contentType: p_foto.type })
          
          if (!pUploadError) {
            const { data: pPublicUrl } = supabase.storage.from('umkm-storage').getPublicUrl(`produk/${fileName}`)
            foto_url = pPublicUrl.publicUrl
          } else {
            console.error(`Supabase Storage Error (Produk ${i}):`, pUploadError)
          }
        }
        
        productsToInsert.push({
          umkm_id: umkmData.id,
          nama: p_nama,
          harga: p_harga ? parseFloat(p_harga) : null,
          deskripsi: p_deskripsi || null,
          foto: foto_url
        })
      }
    }

    if (productsToInsert.length > 0) {
      const { error: productError } = await supabase.from("produk").insert(productsToInsert)
      if (productError) console.error("Error insert produk:", productError)
    }

    // 5. Insert into pengajuan table (Tracking)
    await supabase.from("pengajuan").insert([{ umkm_id: umkmData.id, status: "PENDING" }])

    return NextResponse.json({ success: true, data: umkmData })
  } catch (error: any) {
    console.error("API Error:", error)
    return NextResponse.json({ error: "Terjadi kesalahan pada server saat memproses data." }, { status: 500 })
  }
}
