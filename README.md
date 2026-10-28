# Clothing-Store

A modern full-stack clothing eCommerce platform with user authentication, admin dashboard, product management, shopping cart, wishlist, secure checkout, and responsive design.

## Database setup

Everything the app needs is in one copy-paste file: [`database.sql`](./database.sql).

```bash
psql "postgresql://user:password@host:5432/dbname" -f database.sql
```

It creates all 9 tables + indexes and seeds 12 demo products, 2 coupons and an admin user
(`admin@untergrund.com` / `Admin@123` — change it after first login). It is safe to run more than once.

Set `DATABASE_URL` in `.env` to the same connection string before starting the app.
