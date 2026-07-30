'use server'

import { revalidatePath } from 'next/cache'
import { createClient } from '@/lib/supabase/server'

export async function approveUMKM(formData: FormData) {
  const umkm_id = formData.get('umkm_id') as string
  if (!umkm_id) return
  
  const supabase = await createClient()

  // Ubah status UMKM
  await supabase.from('umkm').update({ status: 'APPROVED' }).eq('id', umkm_id)
  
  // Catat di tabel pengajuan
  await supabase.from('pengajuan').insert([{ 
    umkm_id, 
    status: 'APPROVED', 
    catatan: 'Disetujui oleh admin' 
  }])

  revalidatePath('/admin')
}

export async function rejectUMKM(formData: FormData) {
  const umkm_id = formData.get('umkm_id') as string
  if (!umkm_id) return
  
  const supabase = await createClient()

  await supabase.from('umkm').update({ status: 'REJECTED' }).eq('id', umkm_id)
  
  await supabase.from('pengajuan').insert([{ 
    umkm_id, 
    status: 'REJECTED', 
    catatan: 'Ditolak oleh admin' 
  }])

  revalidatePath('/admin')
}
