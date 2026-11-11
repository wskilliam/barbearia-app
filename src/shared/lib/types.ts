export type Usuario = { id: string; nome: string; email: string }
export type Servico = { id: string; nome: string; duracaoMin: number; precoCentavos: number }
export type Agendamento = { id: string; servicoId: string; inicio: string; fim: string } //ISO 8601 date-time format
export type ApiErrorBody = {
  codigo: string
  message: string
  campo?: Record<string, string>
}
