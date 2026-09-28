export type User = {
  id: number
  name: string
  age: number
  city: string
  state: string
  pincode: string
}

export type UserForm = Omit<User, 'id' | 'age'> & { age: string }
export type UserRequest = Omit<User, 'id'>

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, options)
  if (!response.ok) {
    const body = await response.json().catch(() => null)
    const message = body?.title || body?.detail || `Request failed (${response.status})`
    throw new Error(message)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export function getUsers(signal?: AbortSignal) {
  return request<User[]>('/api/users', { signal })
}

export function createUser(user: UserRequest, accessToken?: string) {
  return request<User>('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(user),
  })
}