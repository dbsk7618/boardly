'use client'

import { useActionState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from "next/link"
import { login } from "@/lib/actions"

function LoginForm() {
  const searchParams = useSearchParams()
  const justSignedUp = searchParams.get('signed_up')
  const [state, formAction, pending] = useActionState(login, { error: '' })

  return (
    <div className="w-full max-w-sm">
      <div className="text-center mb-8">
        <Link href="/" className="text-2xl font-bold text-indigo-600">Boardly</Link>
        <h2 className="text-xl font-semibold mt-4">Welcome back</h2>
      </div>
      <form action={formAction} className="space-y-4">
        {state?.error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">{state.error}</div>
        )}
        {justSignedUp && (
          <div className="p-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
            Account created! Please log in.
          </div>
        )}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input type="email" name="email" required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
          <input type="password" name="password" required
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <button type="submit" disabled={pending}
          className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium disabled:opacity-50">
          {pending ? 'Logging in...' : 'Log In'}
        </button>
      </form>
      <p className="text-center text-sm text-gray-600 mt-4">
        Don&apos;t have an account? <Link href="/auth/signup" className="text-indigo-600 hover:underline">Sign up</Link>
      </p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <Suspense fallback={<div className="text-gray-500">Loading...</div>}>
        <LoginForm />
      </Suspense>
    </div>
  )
}
