import Link from "next/link"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b bg-white">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-indigo-600">Boardly</h1>
          <div className="flex gap-3">
            <Link href="/auth/login" className="px-4 py-2 text-gray-700 hover:text-indigo-600 font-medium">
              Log In
            </Link>
            <Link href="/auth/signup" className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-medium">
              Sign Up
            </Link>
          </div>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-5xl font-bold text-gray-900 mb-4 max-w-3xl">
          Collaborate in the Classroom
        </h2>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl">
          Teachers create boards. Students share ideas. Learning becomes interactive.
        </p>
        <div className="flex gap-4">
          <Link href="/auth/signup?role=teacher" className="px-8 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-lg font-medium">
            I&apos;m a Teacher
          </Link>
          <Link href="/auth/signup?role=student" className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg hover:border-indigo-300 text-lg font-medium">
            I&apos;m a Student
          </Link>
        </div>
      </main>
    </div>
  )
}
