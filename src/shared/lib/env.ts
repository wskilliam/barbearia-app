const apiUrl = import.meta.env.VITE_API_URL

if (!apiUrl) {
  throw new Error(
    'VITE_API_URL não definida. Copie .env.example para .env.local e reinicie o servidor.',
  )
}

export const env = {
  apiUrl: apiUrl as string,
  useMock: import.meta.env.VITE_USE_MOCK === 'true',
}
