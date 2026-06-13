
# SM Garments Management System

A modern, user-friendly inventory and billing application for SM Garments.

## Features

- **Authentication**: Simple login system with OWNER role
- **Dashboard**: Overview of total products, stock, today's sales, bills, and low stock items
- **Product Management**: Add, edit, delete, search, and filter products with images
- **Inventory Management**: View inventory, update stock levels, low stock alerts
- **Billing System**: Create bills, add products to cart, calculate totals, automatically update stock
- **Sales History**: View all previous bills and details
- **Reports**: Daily, weekly, and monthly sales reports with top-selling products

## Tech Stack

### Backend
- Node.js
- Express.js
- PostgreSQL
- JWT Authentication
- Multer (file uploads)

### Frontend
- React
- TypeScript
- Vite
- Tailwind CSS
- React Query
- React Hook Form
- React Router DOM
- Lucide Icons
- date-fns

## Setup Instructions

### Prerequisites
- Node.js (v18 or later)
- PostgreSQL (v14 or later)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create a PostgreSQL database named `shop_app`:
```sql
CREATE DATABASE shop_app;
```

4. Update `.env` file with your database credentials:
```
PORT=5000
DB_HOST=localhost
DB_PORT=5432
DB_NAME=shop_app
DB_USER=your_username
DB_PASSWORD=your_password
JWT_SECRET=your_jwt_secret_key_here
```

5. Initialize the database:
```bash
npm run init-db
```

6. Start the backend server:
```bash
npm run dev
```

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the frontend development server:
```bash
npm run dev
```

## Default Login Credentials

- **Email**: owner@shop.com
- **Password**: owner123

## Project Structure

```
shop_app/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js
│   │   │   └── init-db.js
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middlewares/
│   │   └── index.js
│   ├── uploads/
│   ├── package.json
│   └── .env
└── frontend/
    ├── src/
    │   ├── components/
    │   ├── pages/
    │   ├── hooks/
    │   ├── lib/
    │   ├── types/
    │   ├── App.tsx
    │   ├── main.tsx
    │   └── index.css
    ├── index.html
    ├── vite.config.ts
    ├── tsconfig.json
    ├── tailwind.config.js
    ├── postcss.config.js
    └── package.json
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products (with search/filter)
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create product (with image upload)
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

### Inventory
- `GET /api/inventory` - Get inventory (with search/filter)
- `POST /api/inventory/update` - Update stock
- `GET /api/inventory/low-stock` - Get low stock products

### Billing
- `GET /api/bills` - Get all bills
- `GET /api/bills/:id` - Get bill by ID
- `POST /api/bills` - Create bill

### Reports
- `GET /api/reports/daily` - Get daily report
- `GET /api/reports/weekly` - Get weekly report
- `GET /api/reports/monthly` - Get monthly report

