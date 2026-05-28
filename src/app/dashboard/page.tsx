import { createClient } from "@/lib/supabase-server"
import { logout, joinClass } from "@/lib/actions"
import Link from "next/link"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  let classes: any[] = []

  if (profile?.role === 'teacher') {
    const { data } = await supabase.from('classes').select('*').eq('teacher_id', user.id).order('created_at', { ascending: false })
    classes = data || []
  } else {
    const { data } = await supabase
      .from('class_members')
      .select('classes(*)')
      .eq('student_id', user.id)
    classes = (data || []).map((cm: any) => cm.classes).filter(Boolean)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">Boardly</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{profile?.name} ({profile?.role})</span>
            <form action={logout}>
              <button type="submit" className="text-sm text-gray-500 hover:text-red-600">Log out</button>
            </form>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">My Classes</h2>
          {profile?.role === 'teacher' && (
            <Link href="/classes/new" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
              + New Class
            </Link>
          )}
        </div>

        {profile?.role === 'student' && (
          <div className="mb-8 p-4 bg-white rounded-lg border">
            <h3 className="font-medium text-gray-900 mb-2">Join a Class</h3>
            <form action={joinClass} className="flex gap-2">
              <input type="text" name="invite_code" placeholder="Enter invite code" required
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              <button type="submit"
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                Join
              </button>
            </form>
          </div>
        )}

        {classes.length === 0 ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No classes yet.</p>
            {profile?.role === 'teacher' ? (
              <p className="mt-2">Create your first class to get started!</p>
            ) : (
              <p className="mt-2">Ask your teacher for an invite code to join.</p>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {classes.map((cls) => (
              <Link key={cls.id} href={`/classes/${cls.id}`}
                className="block p-5 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 text-lg">{cls.name}</h3>
                {cls.description && <p className="text-sm text-gray-500 mt-1">{cls.description}</p>}
                {profile?.role === 'teacher' && (
                  <p className="text-xs text-gray-400 mt-3 font-mono">Invite: {cls.invite_code}</p>
                )}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
