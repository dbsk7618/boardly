import { createClient } from "@/lib/supabase-server"

export async function GET() {
  const supabase = await createClient()
  const { data: { user }, error: userErr } = await supabase.auth.getUser()

  if (!user || userErr) {
    return Response.json({ error: 'Not authenticated' }, { status: 401 })
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  let classes: any[] = []

  if (profile?.role === 'teacher') {
    const { data } = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })
    classes = data || []
  } else {
    const { data } = await supabase
      .from('class_members')
      .select('classes(*)')
      .eq('student_id', user.id)
    classes = (data || []).map((cm: any) => cm.classes).filter(Boolean)
  }

  return Response.json({
    user: { id: user.id, email: user.email },
    profile,
    classes,
  })
}
