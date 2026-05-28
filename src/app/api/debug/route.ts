import { createClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: userError } = await supabase.auth.getUser()
  
  if (!user) {
    return Response.json({ error: 'Not authenticated', userError })
  }

  const { data: profile, error: profileError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: classes, error: classesError } = await supabase
    .from('classes')
    .select('*')
    .eq('teacher_id', user.id)
    .order('created_at', { ascending: false })

  return Response.json({
    user: { id: user.id, email: user.email },
    profile,
    profileError,
    classes,
    classesError,
    classesCount: classes?.length || 0,
  })
}
