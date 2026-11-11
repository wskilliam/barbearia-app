POST /auth/login { email, senha } → usuário 200, 401, 422
GET /auth/me Usuário da sessão atual 200, 401
POST /auth/logout Encerra a sessão 204
GET /servicos Lista de serviços e preços 200
GET /agendamentos?data=2026-11-05 Agenda do dia 200, 401
POST /agendamentos { servicoId, inicio } 201, 409 (horário ocupado), 422
DELETE /agendamentos/:id Cancela 204, 404
