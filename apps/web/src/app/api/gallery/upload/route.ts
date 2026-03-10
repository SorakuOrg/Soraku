import { adminDb, createAdminClient } from '@/lib/supabase/admin'
import { getSession } from '@/lib/auth'
import { ok, err, UNAUTHORIZED, SERVER_ERROR } from '@/lib/api'
import { NextRequest } from 'next/server'

// POST /api/gallery/upload — FormData: { file, title?, description?, tags? }
export async function POST(req: NextRequest) {
  try {
    const session = await getSession()
    if (!session) return UNAUTHORIZED

    const form        = await req.formData()
    const file        = form.get('file') as File | null
    const title       = (form.get('title') as string) || null
    const description = (form.get('description') as string) || null
    const tagsRaw     = (form.get('tags') as string) || ''
    const tags        = tagsRaw.split(',').map(t => t.trim()).filter(Boolean)

    if (!file) return err('File wajib ada')

    const allowed = ['image/jpeg','image/png','image/webp','image/gif']
    if (!allowed.includes(file.type)) return err('Format tidak didukung (jpg/png/webp/gif)')
    if (file.size > 5 * 1024 * 1024)  return err('Ukuran maksimal 5MB')

    const ext      = file.name.split('.').pop() ?? 'jpg'
    const filename = `${session.id}/${Date.now()}.${ext}`
    const buffer   = await file.arrayBuffer()

    const { error: storageErr } = await createAdminClient()
      .storage.from('gallery')
      .upload(filename, buffer, { contentType: file.type, upsert: false })

    if (storageErr) return err(storageErr.message)

    const imageurl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/gallery/${filename}`

    const { data, error } = await adminDb()
      .from('gallery')
      .insert({ uploadedby: session.id, imageurl, title, description, tags, status: 'pending' })
      .select().single()

    if (error) return err(error.message)
    return ok(data, 201)
  } catch { return SERVER_ERROR }
}
