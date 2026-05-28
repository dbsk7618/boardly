'use server'

import { createClient } from './supabase-server'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { v4 as uuidv4 } from 'uuid'

export async function signup(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const name = formData.get('name') as string
  const role = formData.get('role') as string

  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) return { error: error.message }

  if (data.user) {
    await supabase.from('profiles').insert({
      id: data.user.id,
      name,
      role,
    })
  }

  redirect('/dashboard')
}

export async function login(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) return { error: error.message }

  redirect('/dashboard')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/')
}

export async function createClass(formData: FormData) {
  const supabase = await createClient()
  const name = formData.get('name') as string
  const description = formData.get('description') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const inviteCode = uuidv4().slice(0, 8)

  await supabase.from('classes').insert({
    name,
    description,
    teacher_id: user.id,
    invite_code: inviteCode,
  })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function createBoard(formData: FormData) {
  const supabase = await createClient()
  const title = formData.get('title') as string
  const description = formData.get('description') as string
  const classId = formData.get('class_id') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  await supabase.from('boards').insert({
    title,
    description,
    class_id: classId,
    created_by: user.id,
  })

  revalidatePath(`/classes/${classId}`)
  redirect(`/classes/${classId}`)
}

export async function addPost(prevState: { error: string }, formData: FormData) {
  const supabase = await createClient()
  const content = formData.get('content') as string
  const boardId = formData.get('board_id') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Not authenticated' }

  const { error } = await supabase.from('posts').insert({
    content,
    board_id: boardId,
    user_id: user.id,
  })
  if (error) return { error: error.message }

  revalidatePath(`/boards/${boardId}`)
  return { error: '' }
}

export async function joinClass(formData: FormData) {
  const supabase = await createClient()
  const inviteCode = formData.get('invite_code') as string

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: classData } = await supabase
    .from('classes')
    .select('id')
    .eq('invite_code', inviteCode)
    .single()

  if (!classData) redirect('/dashboard')

  await supabase.from('class_members').insert({
    class_id: classData.id,
    student_id: user.id,
  })

  revalidatePath('/dashboard')
  redirect('/dashboard')
}

export async function deletePost(formData: FormData) {
  const supabase = await createClient()
  const postId = formData.get('post_id') as string
  const boardId = formData.get('board_id') as string

  await supabase.from('posts').delete().eq('id', postId)

  revalidatePath(`/boards/${boardId}`)
}
