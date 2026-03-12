# Burger Palace - Architecture Plan

## Project Overview
A burger ordering application with React frontend, TypeScript backend, and PostgreSQL database.

## Architecture Decisions

### Project Structure
- **Monorepo**: Frontend and backend in same repository with shared types
- **Authentication**: Simple customer ID input (no authentication required)

### Technology Stack

#### Frontend
- **Framework**: React 18+
- **UI Library**: IBM Carbon Design System
- **State Management**: React Context API or Redux Toolkit
- **HTTP Client**: Axios or Fetch API
- **Build Tool**: Vite or Create React App

#### Backend
- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **ORM**: Prisma (recommended for TypeScript integration)
- **Validation**: Zod or Joi
- **API Documentation**: OpenAPI/Swagger

#### Database
- **Database**: PostgreSQL 14+
- **Migration Tool**: Prisma Migrate

## Database Schema

### Tables

#### customers
- `id` (UUID, Primary Key)
- `name` (VARCHAR, NOT NULL)
- `email` (VARCHAR, UNIQUE)
- `phone` (VARCHAR)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### menu_categories
- `id` (UUID, Primary Key)
- `name` (VARCHAR, NOT NULL) - e.g., "Burgers", "Sides", "Drinks"
- `display_order` (INTEGER)

#### menu_items
- `id` (UUID, Primary Key)
- `category_id` (UUID, Foreign Key -> menu_categories)
- `name` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `base_price` (DECIMAL(10,2), NOT NULL)
- `available` (BOOLEAN, DEFAULT true)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### burger_options
- `id` (UUID, Primary Key)
- `option_type` (ENUM: 'patty_count', 'cheese', 'topping', 'condiment')
- `name` (VARCHAR, NOT NULL)
- `price_modifier` (DECIMAL(10,2), DEFAULT 0.00)
- `available` (BOOLEAN, DEFAULT true)

#### orders
- `id` (UUID, Primary Key)
- `customer_id` (UUID, Foreign Key -> customers)
- `order_number` (VARCHAR, UNIQUE, NOT NULL) - Human-readable order number
- `status` (ENUM: 'pending', 'preparing', 'ready', 'completed', 'cancelled')
- `subtotal` (DECIMAL(10,2), NOT NULL)
- `tax` (DECIMAL(10,2), NOT NULL)
- `total` (DECIMAL(10,2), NOT NULL)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

#### order_items
- `id` (UUID, Primary Key)
- `order_id` (UUID, Foreign Key -> orders)
- `menu_item_id` (UUID, Foreign Key -> menu_items)
- `quantity` (INTEGER, NOT NULL)
- `unit_price` (DECIMAL(10,2), NOT NULL)
- `subtotal` (DECIMAL(10,2), NOT NULL)
- `special_instructions` (TEXT)

#### order_item_options
- `id` (UUID, Primary Key)
- `order_item_id` (UUID, Foreign Key -> order_items)
- `burger_option_id` (UUID, Foreign Key -> burger_options)

## Menu Items

### Burgers
- **Single Burger** (1 patty) - Base price: $6.99
- **Double Burger** (2 patties) - Base price: $9.99
- **Triple Burger** (3 patties) - Base price: $12.99

### Cheese Options (add $1.00 each)
- American
- Cheddar
- Swiss
- Pepper Jack
- Blue Cheese

### Toppings (included)
- Lettuce
- Tomato
- Onion (raw or grilled)
- Pickles
- Jalapeños
- Bacon (+$2.00)
- Avocado (+$1.50)
- Mushrooms (grilled)

### Condiments (included)
- Ketchup
- Mustard
- Mayo
- BBQ Sauce
- Ranch
- Hot Sauce

### Sides
- **French Fries** - $3.99
- **Tater Tots** - $4.49
- **Onion Rings** - $4.99
- **Cheese Curds** - $5.99

### Drinks (20 oz bottles)
- **Coca-Cola** - $2.49
- **Pepsi** - $2.49
- **Sprite** - $2.49
- **Dr Pepper** - $2.49
- **Mountain Dew** - $2.49
- **Root Beer** - $2.49
- **Lemonade** - $2.49
- **Iced Tea** - $2.49

## API Endpoints

### Menu Endpoints
- `GET /api/menu` - Get all menu items grouped by category
- `GET /api/menu/categories` - Get all menu categories
- `GET /api/menu/items/:id` - Get specific menu item details
- `GET /api/burger-options` - Get all burger customization options

### Customer Endpoints
- `POST /api/customers` - Create a new customer
- `GET /api/customers/:id` - Get customer details

### Order Endpoints
- `POST /api/orders` - Create a new order
- `GET /api/orders/:id` - Get order by order ID
- `GET /api/customers/:customerId/orders` - Get all orders for a customer
- `PATCH /api/orders/:id/status` - Update order status (for future admin features)

## Frontend Components Structure

```
src/
├── components/
│   ├── common/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── LoadingSpinner.tsx
│   ├── menu/
│   │   ├── MenuGrid.tsx
│   │   ├── BurgerBuilder.tsx
│   │   ├── SideSelector.tsx
│   │   └── DrinkSelector.tsx
│   ├── cart/
│   │   ├── ShoppingCart.tsx
│   │   ├── CartItem.tsx
│   │   └── CartSummary.tsx
│   ├── order/
│   │   ├── OrderForm.tsx
│   │   ├── OrderConfirmation.tsx
│   │   ├── OrderView.tsx
│   │   └── OrderHistory.tsx
│   └── customer/
│       └── CustomerForm.tsx
├── pages/
│   ├── HomePage.tsx
│   ├── MenuPage.tsx
│   ├── CheckoutPage.tsx
│   ├── OrderViewPage.tsx
│   └── OrderHistoryPage.tsx
├── services/
│   ├── api.ts
│   ├── menuService.ts
│   ├── orderService.ts
│   └── customerService.ts
├── context/
│   └── CartContext.tsx
├── types/
│   └── index.ts (shared types from backend)
└── utils/
    ├── formatters.ts
    └── validators.ts
```

## Backend Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.ts
│   ├── controllers/
│   │   ├── menuController.ts
│   │   ├── orderController.ts
│   │   └── customerController.ts
│   ├── services/
│   │   ├── menuService.ts
│   │   ├── orderService.ts
│   │   └── customerService.ts
│   ├── models/
│   │   └── (Prisma generated models)
│   ├── routes/
│   │   ├── menuRoutes.ts
│   │   ├── orderRoutes.ts
│   │   └── customerRoutes.ts
│   ├── middleware/
│   │   ├── errorHandler.ts
│   │   └── validator.ts
│   ├── utils/
│   │   ├── orderNumber.ts
│   │   └── priceCalculator.ts
│   └── server.ts
├── prisma/
│   ├── schema.prisma
│   ├── migrations/
│   └── seed.ts
└── tests/
    ├── unit/
    └── integration/
```

## Shared Types Structure

```
shared/
└── types/
    ├── menu.ts
    ├── order.ts
    ├── customer.ts
    └── index.ts
```

## User Flows

### 1. Create Order Flow
1. Customer browses menu
2. Customer builds burger (selects patty count, cheese, toppings, condiments)
3. Customer adds sides and drinks
4. Items added to cart
5. Customer proceeds to checkout
6. Customer enters name, email, phone
7. Order is created and customer receives order ID
8. Order confirmation displayed

### 2. View Order Flow
1. Customer enters order ID
2. System retrieves and displays order details
3. Shows items, prices, status, and total

### 3. View Order History Flow
1. Customer enters customer ID
2. System retrieves all orders for that customer
3. Displays list of past orders with dates and totals
4. Customer can click to view details of any order

## Development Phases

### Phase 1: Foundation
- Set up monorepo structure
- Initialize backend with Express and Prisma
- Create database schema and migrations
- Initialize React frontend with Carbon Design

### Phase 2: Backend API
- Implement menu endpoints
- Implement order endpoints
- Implement customer endpoints
- Add validation and error handling
- Create seed data

### Phase 3: Frontend Core
- Set up routing
- Create menu browsing components
- Implement burger builder
- Create shopping cart functionality

### Phase 4: Order Management
- Implement checkout flow
- Create order view component
- Create order history component
- Connect all components to backend APIs

### Phase 5: Polish & Testing
- Add loading states and error handling
- Improve UI/UX with Carbon components
- Test end-to-end flows
- Write documentation

## Environment Variables

### Backend (.env)
```
DATABASE_URL=postgresql://user:password@localhost:5432/burger_palace
PORT=3001
NODE_ENV=development
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:3001/api
```

## Running the Application

### Development
```bash
# Install dependencies
npm install

# Start PostgreSQL (Docker)
docker-compose up -d

# Run database migrations
npm run db:migrate

# Seed database
npm run db:seed

# Start backend
npm run dev:backend

# Start frontend (in another terminal)
npm run dev:frontend
```

### Production Build
```bash
# Build both frontend and backend
npm run build

# Start production server
npm start
```

## Future Enhancements (Out of Scope)
- User authentication and accounts
- Order tracking in real-time
- Admin dashboard for managing menu and orders
- Payment processing
- Delivery/pickup options
- Loyalty program
- Order customization limits
- Nutritional information