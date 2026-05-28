'use client'

import { useActionState, useState, useEffect } from 'react'
import { use } from 'react'
import { addPost, deletePost } from "@/lib/actions"
import Link from "next/link"

export default function BoardPage(props: { params: Promise<{ id: string }> }) {
  const { id } = use(props.params)
  const [state, formAction, pending] = useActionState(addPost, { error: '' })
  const [board, setBoard] = useState<any>(null)
  const [posts, setPosts] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { createClient } = await import('@/lib/supabase')
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) { window.location.href = '/auth/login'; return }

      const { data: p } = await supabase.from('profiles').select('*').eq('id', user.id).single()
      setProfile(p)

      const { data: b } = await supabase.from('boards').select('*, classes(name)').eq('id', id).single()
      setBoard(b)

      const { data: po } = await supabase
        .from('posts')
        .select('*, profiles(name)')
        .eq('board_id', id)
        .order('created_at', { ascending: false })
      setPosts(po || [])
      setLoading(false)
    }
    load()
  }, [id])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>
  if (!board) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Board not found</p></div>

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/dashboard" className="text-xl font-bold text-indigo-600">Boardly</Link>
          <span className="text-sm text-gray-600">{profile?.name}</span>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-4 py-8">
        <Link href={`/classes/${board.class_id}`} className="text-sm text-indigo-600 hover:underline">
          &larr; {board.classes?.name}
        </Link>
        <h2 className="text-2xl font-bold text-gray-900 mt-2 mb-1">{board.title}</h2>
        {board.description && <p className="text-gray-500 mb-6">{board.description}</p>}

        <form action={formAction} className="mb-8 p-4 bg-white rounded-lg border">
          <input type="hidden" name="board_id" value={id} />
          <textarea name="content" rows={3} placeholder="Share your thoughts..." required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
          <button type="submit" disabled={pending}
            className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium disabled:opacity-50">
            {pending ? 'Posting...' : 'Post'}
          </button>
        </form>

        <div className="space-y-3">
          {posts.length === 0 ? (
            <p className="text-center py-12 text-gray-500">No posts yet. Be the first!</p>
          ) : (
            posts.map((post: any) => (
              <div key={post.id} className="p-4 bg-white rounded-lg border">
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-sm font-medium text-indigo-600">{post.profiles?.name}</p>
                    <p className="text-gray-900 mt-1 whitespace-pre-wrap">{post.content}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(post.created_at).toLocaleString()}
                    </p>
                  </div>
                  {post.user_id === profile?.id && (
                    <form action={deletePost}>
                      <input type="hidden" name="post_id" value={post.id} />
                      <input type="hidden" name="board_id" value={id} />
                      <button type="submit" className="text-xs text-gray-400 hover:text-red-500">Delete</button>
                    </form>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  )
}
