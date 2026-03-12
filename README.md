# 🍔 Burger Palace

A full-stack burger ordering application built with React, TypeScript, Express, and PostgreSQL.

## 📋 Features

- **Menu Browsing**: View burgers, sides, and drinks
- **Custom Burger Builder**: Choose patty count, cheese, toppings, and condiments
- **Shopping Cart**: Add multiple items to your order
- **Order Management**: Create, view, and track orders
- **Order History**: View past orders by customer ID

## 🏗️ Architecture

- **Frontend**: React 18+ with IBM Carbon Design System
- **Backend**: Node.js with Express and TypeScript
- **Database**: PostgreSQL 15+
- **ORM**: Prisma
- **Monorepo**: Shared TypeScript types between frontend and backend

## 📁 Project Structure

```
burger-palace/
├── backend/              # Express API server
│   ├── src/
│   │   ├── config/      # Database configuration
│   │   ├── controllers/ # Request handlers
│   │   ├── services/    # Business logic
│   │   ├── routes/      # API routes
│   │   ├── middleware/  # Express middleware
│   │   ├── utils/       # Utility functions
│   │   └── server.ts    # Entry point
│   └── prisma/
│       ├── schema.prisma # Database schema
│       └── seed.ts       # Seed data
├── frontend/            # React application
│   └── src/
│       ├── components/  # React components
│       ├── pages/       # Page components
│       ├── services/    # API client
│       ├── context/     # React context
│       └── App.tsx      # Main app component
├── shared/              # Shared TypeScript types
│   └── src/types/
└── docker-compose.yml   # PostgreSQL container
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm 9+
- Docker and Docker Compose (for PostgreSQL)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/dwakeman/burger-palace.git
   cd burger-palace
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Backend
   cp backend/.env.example backend/.env
   ```

4. **Start PostgreSQL**
   ```bash
   docker-compose up -d
   ```

5. **Run database migrations**
   ```bash
   npm run db:migrate
   ```

6. **Seed the database**
   ```bash
   npm run db:seed
   ```

### Running the Application

#### Development Mode

Start both frontend and backend in development mode:

```bash
npm run dev
```

Or run them separately:

```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:3001
- API Health Check: http://localhost:3001/health

#### Production Build

```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## 🗄️ Database

### Schema

The database consists of 7 tables:
- `customers` - Customer information
- `menu_categories` - Menu categories (Burgers, Sides, Drinks)
- `menu_items` - Menu items with pricing
- `burger_options` - Customization options (cheese, toppings, condiments)
- `orders` - Order records
- `order_items` - Items in each order
- `order_item_options` - Selected burger options for each item

### Prisma Commands

```bash
# Generate Prisma Client
npm run generate

# Create a new migration
npm run db:migrate

# Open Prisma Studio (database GUI)
npm run db:studio

# Reset database (WARNING: deletes all data)
npx prisma migrate reset
```

## 🔌 API Endpoints

### Menu

- `GET /api/menu` - Get full menu (categories, items, burger options)
- `GET /api/menu/categories` - Get menu categories
- `GET /api/menu/items/:id` - Get specific menu item
- `GET /api/menu/burger-options` - Get burger customization options

### Customers

- `POST /api/customers` - Create a new customer
- `GET /api/customers/:id` - Get customer by ID

### Orders

- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/number/:orderNumber` - Get order by order number
- `GET /api/orders/customer/:customerId` - Get all orders for a customer
- `PATCH /api/orders/:id/status` - Update order status

## 📝 Menu Items

### Burgers
- **Single Burger** (1 patty) - $6.99
- **Double Burger** (2 patties) - $9.99
- **Triple Burger** (3 patties) - $12.99

### Cheese Options (+$1.00 each)
- American, Cheddar, Swiss, Pepper Jack, Blue Cheese

### Toppings (Free)
- Lettuce, Tomato, Onion, Pickles, Jalapeños, Mushrooms

### Premium Toppings
- Bacon (+$2.00)
- Avocado (+$1.50)

### Condiments (Free)
- Ketchup, Mustard, Mayo, BBQ Sauce, Ranch, Hot Sauce

### Sides
- French Fries - $3.99
- Tater Tots - $4.49
- Onion Rings - $4.99
- Cheese Curds - $5.99

### Drinks (20 oz bottles - $2.49)
- Coca-Cola, Pepsi, Sprite, Dr Pepper, Mountain Dew, Root Beer, Lemonade, Iced Tea

## 🧪 Testing

```bash
# Run all tests
npm test

# Run backend tests
npm test --workspace=backend

# Run frontend tests
npm test --workspace=frontend
```

## 🛠️ Development

### Code Formatting

```bash
# Format all code
npm run format

# Lint code
npm run lint
```

### Database Management

```bash
# View database in Prisma Studio
npm run db:studio

# Create a new migration
cd backend
npx prisma migrate dev --name your_migration_name

# Apply migrations in production
npm run db:migrate:deploy
```

## 📦 Tech Stack

### Frontend
- React 18+
- TypeScript
- IBM Carbon Design System
- Vite
- React Router
- Axios

### Backend
- Node.js
- Express.js
- TypeScript
- Prisma ORM
- Zod (validation)
- Winston (logging)
- Helmet (security)
- CORS

### Database
- PostgreSQL 15+

### DevOps
- Docker & Docker Compose
- ESLint & Prettier

## 🔒 Environment Variables

### Backend (.env)

```env
DATABASE_URL=postgresql://burger_admin:burger_password@localhost:5432/burger_palace
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3001/api
```

## 📖 Documentation

- [Architecture Documentation](./ARCHITECTURE.md)
- [System Design](./SYSTEM_DESIGN.md)
- [Implementation Plan](./IMPLEMENTATION_PLAN.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- IBM Carbon Design System for the UI components
- Prisma for the excellent ORM
- The React and TypeScript communities

## 📞 Support

For issues and questions, please open an issue on GitHub.

---

Made with ❤️ and 🍔 by the Burger Palace team