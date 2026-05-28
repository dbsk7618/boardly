import { createClient } from "@/lib/supabase-server"
import { cookies } from "next/headers"
import Link from "next/link"

export default async function TestPage() {
  const cookieStore = await cookies()
  const allCookies = cookieStore.getAll()
  const supabaseAuthCookies = allCookies.filter(c => c.name.startsWith('sb-'))

  const supabase = await createClient()
  const { data: { user }, error: userErr } = await supabase.auth.getUser()

  let profile = null
  let classes: any[] = []
  let profileErr = null
  let classesErr = null

  if (user) {
    const profileResult = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()
    profile = profileResult.data
    profileErr = profileResult.error

    const classesResult = await supabase
      .from('classes')
      .select('*')
      .eq('teacher_id', user.id)
      .order('created_at', { ascending: false })
    classes = classesResult.data || []
    classesErr = classesResult.error
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h1 className="text-2xl font-bold mb-4">Debug Info</h1>
      <Link href="/dashboard" className="text-indigo-600 hover:underline">← Dashboard</Link>

      <div className="mt-6 space-y-4">
        <div className="p-4 bg-white rounded-lg border">
          <h2 className="font-semibold mb-2">Supabase Auth Cookies ({supabaseAuthCookies.length})</h2>
          <pre className="text-sm bg-gray-100 p-2 rounded overflow-auto">
            {supabaseAuthCookies.map(c => `${c.name}: ${c.value.substring(0, 50)}...`).join('\n') || 'None found'}
          </pre>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h2 className="font-semibold mb-2">Auth</h2>
          <p className="text-sm">User: {user ? `${user.id} (${user.email})` : 'None'}</p>
          <p className="text-sm text-red-500">Error: {userErr ? userErr.message : 'None'}</p>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h2 className="font-semibold mb-2">Profile</h2>
          <p className="text-sm">Role: {profile?.role || 'None'}</p>
          <p className="text-sm text-red-500">Error: {profileErr ? profileErr.message : 'None'}</p>
        </div>

        <div className="p-4 bg-white rounded-lg border">
          <h2 className="font-semibold mb-2">Classes ({classes.length})</h2>
          <p className="text-sm text-red-500">Error: {classesErr ? classesErr.message : 'None'}</p>
          {classes.length > 0 ? (
            <ul className="text-sm mt-2 space-y-1">
              {classes.map(c => <li key={c.id}>{c.name} ({c.invite_code})</li>)}
            </ul>
          ) : (
            <p className="text-sm mt-2">No classes found</p>
          )}
        </div>
      </div>
    </div>
  )
}
