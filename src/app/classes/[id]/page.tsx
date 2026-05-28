import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function ClassPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()

  const { data: classData } = await supabase.from('classes').select('*').eq('id', id).single()
  if (!classData) redirect('/dashboard')

  const isTeacher = profile?.role === 'teacher' && classData.teacher_id === user.id

  const { data: boards } = await supabase.from('boards').select('*').eq('class_id', id).order('created_at', { ascending: false })

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">Boardly</Link>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{profile?.name}</span>
          </div>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/dashboard" className="text-sm text-indigo-600 hover:underline">&larr; Back to Dashboard</Link>
          <div className="flex items-start justify-between mt-2">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{classData.name}</h2>
              {classData.description && <p className="text-gray-500 mt-1">{classData.description}</p>}
            </div>
            {isTeacher && (
              <div className="text-right">
                <p className="text-xs text-gray-400 font-mono">Invite code: {classData.invite_code}</p>
                <Link href={`/classes/${id}/boards/new`}
                  className="inline-block mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
                  + New Board
                </Link>
              </div>
            )}
          </div>
        </div>

        {(!boards || boards.length === 0) ? (
          <div className="text-center py-16 text-gray-500">
            <p className="text-lg">No boards yet.</p>
            {isTeacher && <p className="mt-2">Create your first board for this class!</p>}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {boards.map((board) => (
              <Link key={board.id} href={`/boards/${board.id}`}
                className="block p-5 bg-white rounded-lg border hover:shadow-md transition-shadow">
                <h3 className="font-semibold text-gray-900 text-lg">{board.title}</h3>
                {board.description && <p className="text-sm text-gray-500 mt-1">{board.description}</p>}
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
