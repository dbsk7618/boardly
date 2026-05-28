'use client'

import { Suspense } from 'react'
import { useActionState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { signup } from "@/lib/actions"

function SignupForm() {
  const searchParams = useSearchParams()
  const defaultRole = searchParams.get('role') || 'student'
  const [state, formAction, pending] = useActionState(signup, { error: '' })

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-indigo-600">Boardly</Link>
        <h2 className="text-xl font-semibold mt-4">Create an account</h2>
      </div>
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{state.error}</div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input type="text" name="name" required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required minLength={6}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">I am a...</label>
          <select name="role" defaultValue={defaultRole}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white">
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>
        <button type="submit" disabled={pending}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
          {pending ? 'Signing up...' : 'Sign Up'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Already have an account? <Link href="/auth/login" className="text-indigo-600 hover:underline">Log in</Link>
      </p>
    </div>
  )
}

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <SignupForm />
      </Suspense>
    </div>
  )
}
