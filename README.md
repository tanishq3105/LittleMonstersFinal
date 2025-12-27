# Little Monsters — Admin Dashboard

Little Monsters Admin is a modern **e-commerce admin panel** designed to help store owners manage products, track sales, and oversee store activity in one place. It focuses on simplicity, security, and scalability, making daily store operations smoother and more efficient.

## Features
- Create, update, and delete products
- View sales and order insights
- Secure authentication and protected routes
- Fast, responsive, and minimal UI
- Hosted on Vercel for reliable performance

## Tech Stack
- **Next.js**
- **Prisma ORM**
- **PostgreSQL**
- **Clerk (Auth)**

## Live Link
https://little-monsters-final.vercel.app/

## Installation

```bash
git clone <your-repo-link>
cd little-monsters-admin
npm install
npx prisma generate
npx prisma migrate dev
npm run dev
