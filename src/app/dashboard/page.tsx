'use client'

import { useState, useEffect } from 'react'
import { logout, joinClass } from "@/lib/actions"
import Link from "next/link"
import { useRouter } from 'next/navigation'

export default function DashboardPage() {
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [classes, setClasses] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    async function load() {
      try {
        const res = await fetch('/api/dashboard')
        if (res.status === 401) { router.push('/auth/login'); return }
        const data = await res.json()
        if (cancelled) return
        setProfile(data.profile)
        setClasses(data.classes || [])
        setLoading(false)
      } catch (e: any) {
        if (!cancelled) {
          setError(e.message || String(e))
          setLoading(false)
        }
      }
    }
    load()
    return () => { cancelled = true }
  }, [router])

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Loading...</p></div>

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
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
            Debug: {error}
          </div>
        )}
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
