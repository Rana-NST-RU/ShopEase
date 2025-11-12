# ShopEase Backend

Express + Prisma + MySQL + JWT

## Env

Copy `env.example` to `.env` and fill values:

- `DATABASE_URL`
- `JWT_SECRET`
- `PORT`

## Commands

```bash
npm install
npm run prisma:generate
npm run prisma:migrate -- --name init
npm run seed # or: npx prisma db seed
npm run dev
```

## Routes

- Auth: `POST /api/auth/signup`, `POST /api/auth/login`
- Products: `GET /api/products`, `GET /api/products/:id` (public)
  - Admin: `POST /api/products`, `PUT /api/products/:id`, `DELETE /api/products/:id`
- Orders: `GET /api/orders`, `GET /api/orders/:id`, `POST /api/orders`, `POST /api/orders/:id/confirm`
- Admin: `GET /api/admin/analytics`, `POST /api/admin/cleanup/out-of-stock`

Filtering/search/sort/pagination on `GET /api/products` via query params:
- `q`, `category`, `minPrice`, `maxPrice`, `sortBy` in {`price`,`popularity`,`createdAt`}, `order` in {`asc`,`desc`}, `page`, `limit`


