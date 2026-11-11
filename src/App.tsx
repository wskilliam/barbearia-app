import { useState } from 'react'
import LoginPage from './features/auth/LoginPage'
import type { Usuario } from './shared/lib/types'

export default function App() {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  if (!usuario) return <LoginPage onSuccess={setUsuario} />
  return <h1 className="p-4 text-xl">Olá, {usuario.nome}!</h1>
}
