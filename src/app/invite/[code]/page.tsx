import { createClient } from "@/lib/supabase-server"
import { joinClass } from "@/lib/actions"
import { redirect } from "next/navigation"
import Link from "next/link"

export default async function InvitePage(props: { params: Promise<{ code: string }> }) {
  const { code } = await props.params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect(`/auth/login?redirect=/invite/${code}`)

  const { data: classData } = await supabase.from('classes').select('id, name').eq('invite_code', code).single()

  if (!classData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-gray-900">Invalid Invite Code</h2>
          <p className="text-gray-500 mt-2">This invite code doesn&apos;t match any class.</p>
          <Link href="/dashboard" className="inline-block mt-4 text-indigo-600 hover:underline">Go to Dashboard</Link>
        </div>
      </div>
    )
  }

  const { data: existing } = await supabase
    .from('class_members')
    .select('id')
    .eq('class_id', classData.id)
    .eq('student_id', user.id)
    .single()

  if (existing) {
    redirect(`/classes/${classData.id}`)
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="w-full max-w-sm text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Join Class</h2>
        <p className="text-gray-600 mb-6">You&apos;ve been invited to join <strong>{classData.name}</strong></p>
        <form action={joinClass}>
          <input type="hidden" name="invite_code" value={code} />
          <button type="submit"
            className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
            Join Class
          </button>
        </form>
        <Link href="/dashboard" className="inline-block mt-4 text-sm text-gray-500 hover:underline">Cancel</Link>
      </div>
    </div>
  )
}
