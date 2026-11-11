import type { ApiErrorBody } from './types'
import { env } from './env'

export class ApiError extends Error {
  status: number
  body: ApiErrorBody

  constructor(status: number, body: ApiErrorBody) {
    super(body.mensagem)
    this.status = status
    this.body = body
  }
}

export async function api<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${env.apiUrl}${path}`, {
    ...init,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...init?.headers,
    },
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({ codigo: 'ERRO', mensagem: 'Erro inesperado' }))

    throw new ApiError(res.status, body)
  }
  return res.status === 204 ? (undefined as T) : res.json()
}
