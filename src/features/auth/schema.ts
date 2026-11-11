import * as z from 'zod'

export const loginSchema = z.object({
  email: z.email('Informe um e-mail válido'),
  senha: z.string().min(6, 'A senha deve ter ao menos 6 caracteres'),
})

export type LoginForm = z.infer<typeof loginSchema>
