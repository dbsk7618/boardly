import { createBoard } from "@/lib/actions"
import { createClient } from "@/lib/supabase-server"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function NewBoardPage(props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  if (profile?.role !== 'teacher') redirect('/dashboard')

  const { data: classData } = await supabase.from('classes').select('name').eq('id', id).single()
  if (!classData) redirect('/dashboard')

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">Boardly</Link>
        </div>
      </header>
      <main className="max-w-lg mx-auto px-4 py-12">
        <Link href={`/classes/${id}`} className="text-sm text-indigo-600 hover:underline">&larr; Back to Class</Link>
        <h2 className="text-2xl font-bold text-gray-900 mt-4 mb-6">New Board in &ldquo;{classData.name}&rdquo;</h2>
        <form action={createBoard} className="space-y-4">
          <input type="hidden" name="class_id" value={id} />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Board Title</label>
            <input type="text" name="title" required
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description (optional)</label>
            <textarea name="description" rows={3}
              className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <button type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Create Board
          </button>
        </form>
      </main>
    </div>
  )
}
