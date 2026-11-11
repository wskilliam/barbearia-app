import { http, HttpResponse } from 'msw'

const API = import.meta.env.VITE_API_URL

let logado = false
const usuario = { id: '1', nome: 'Cliente Teste', email: 'cliente@teste.com' }
const servicos = [
  { id: 's1', nome: 'Corte', duracaoMin: 30, precoCentavos: 4000 },
  { id: 's2', nome: 'Barba', duracaoMin: 20, precoCentavos: 3000 },
]
let agendamentos: { id: string; servicoId: string; inicio: string; fim: string }[] = []

export const handlers = [
  http.post(`${API}/auth/login`, async ({ request }) => {
    const { email, senha } = (await request.json()) as { email: string; senha: string }
    if (email === usuario.email && senha === '123456') {
      logado = true
      return HttpResponse.json(usuario)
    }
    return HttpResponse.json(
      { codigo: 'CREDENCIAIS_INVALIDAS', mensagem: 'E-mail ou senha incorretos' },
      { status: 401 },
    )
  }),

  http.get(`${API}/auth/me`, () =>
    logado
      ? HttpResponse.json(usuario)
      : HttpResponse.json({ codigo: 'NAO_AUTENTICADO', mensagem: 'Faça login' }, { status: 401 }),
  ),

  http.post(`${API}/auth/logout`, () => {
    logado = false
    return new HttpResponse(null, { status: 204 })
  }),

  http.get(`${API}/servicos`, () => HttpResponse.json(servicos)),

  http.get(`${API}/agendamentos`, ({ request }) => {
    const data = new URL(request.url).searchParams.get('data') ?? ''
    return HttpResponse.json(agendamentos.filter((a) => a.inicio.startsWith(data)))
  }),

  http.post(`${API}/agendamentos`, async ({ request }) => {
    const { servicoId, inicio } = (await request.json()) as { servicoId: string; inicio: string }
    if (agendamentos.some((a) => a.inicio === inicio)) {
      return HttpResponse.json(
        { codigo: 'HORARIO_OCUPADO', mensagem: 'Este horário já foi reservado' },
        { status: 409 },
      )
    }
    const servico = servicos.find((s) => s.id === servicoId)!
    const fim = new Date(new Date(inicio).getTime() + servico.duracaoMin * 60000).toISOString()
    const novo = { id: crypto.randomUUID(), servicoId, inicio, fim }
    agendamentos.push(novo)
    return HttpResponse.json(novo, { status: 201 })
  }),

  http.delete(`${API}/agendamentos/:id`, ({ params }) => {
    agendamentos = agendamentos.filter((a) => a.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
