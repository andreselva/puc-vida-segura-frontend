# VidaSegura Frontend

Frontend em React + Vite ajustado para consumir o backend NestJS do projeto VidaSegura.

## Como rodar

```bash
npm install
cp .env.example .env
npm run dev
```

## Variáveis de ambiente

```env
VITE_API_URL=http://localhost:3000/api
```

## Fluxos integrados

- login em `POST /auth/login`
- cadastro em `POST /auth/register`
- dados demo em `GET /auth/demo-access`
- leitura do usuário autenticado em `GET /users/me`
- atualização das informações clínicas em `PUT /users/:id/clinical-info`
- acesso médico em `POST /profiles/:profileId/access`

## Observações

- o token JWT fica salvo em `localStorage`
- o QR continua sendo um mock visual, mas o link público do perfil funciona com o backend
- os estilos foram corrigidos para Tailwind 4 usando `@import "tailwindcss"`
