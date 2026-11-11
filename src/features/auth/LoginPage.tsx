import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, ApiError } from '../../shared/lib/api'
import type { Usuario } from '../../shared/lib/types'
import { loginSchema, type LoginForm } from './schema'

type Props = { onSuccess: (usuario: Usuario) => void }

export default function LoginPage({ onSuccess }: Props) {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginForm) {
    try {
      const usuario = await api<Usuario>('/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      })
      onSuccess(usuario)
    } catch (err) {
      const mensagem =
        err instanceof ApiError && err.status === 401
          ? err.body.mensagem
          : 'Não foi possível entrar. Tente novamente.'
      setError('root', { message: mensagem })
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center bg-neutral-100 px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        noValidate
        className="w-full max-w-sm space-y-5 rounded-2xl bg-white p-6 shadow"
      >
        <h1 className="text-2xl font-bold">Entrar na barbearia</h1>

        <div className="space-y-1">
          <label htmlFor="email" className="block text-sm font-medium">
            E-mail
          </label>
          <input
            id="email"
            type="email"
            autoComplete="username"
            inputMode="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-erro' : undefined}
            className="h-12 w-full rounded-lg border border-neutral-300 px-3 text-base"
            {...register('email')}
          />
          {errors.email && (
            <p id="email-erro" className="text-sm text-red-700">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label htmlFor="senha" className="block text-sm font-medium">
            Senha
          </label>
          <input
            id="senha"
            type="password"
            autoComplete="current-password"
            aria-invalid={!!errors.senha}
            aria-describedby={errors.senha ? 'senha-erro' : undefined}
            className="h-12 w-full rounded-lg border border-neutral-300 px-3 text-base"
            {...register('senha')}
          />
          {errors.senha && (
            <p id="senha-erro" className="text-sm text-red-700">
              {errors.senha.message}
            </p>
          )}
        </div>

        {errors.root && (
          <p role="alert" className="rounded-lg bg-red-50 p-3 text-sm text-red-800">
            {errors.root.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isSubmitting}
          className="h-12 w-full rounded-lg bg-neutral-900 font-semibold text-white disabled:opacity-60"
        >
          {isSubmitting ? 'Entrando…' : 'Entrar'}
        </button>
      </form>
    </main>
  )
}
