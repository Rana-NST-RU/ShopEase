# ShopEase

Full-stack e-commerce template.

## Stack

- Frontend: React + React Router + Tailwind + Axios (Vite)
- Backend: Node + Express + Prisma + MySQL
- Auth: JWT (user/admin)

## Getting Started

### Backend

```bash
cd backend
cp env.example .env
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Set `VITE_API_URL` in `frontend/.env` if backend is not on `http://localhost:4000`.

## Features

- JWT login/signup with roles (User/Admin)
- Products CRUD (admin) and listing (public)
- Orders CRUD-lite with mock Stripe checkout and confirmation
- Filtering, search, sorting, pagination on products
- Admin dashboard with analytics and out-of-stock cleanup

## Deployment

- Backend compatible with Render/Railway.
- Use `npm run start` on backend; ensure `DATABASE_URL` and `JWT_SECRET` are set.


