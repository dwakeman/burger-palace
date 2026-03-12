# 🚀 Burger Palace - Setup Guide

This guide will walk you through setting up the Burger Palace application from scratch.

## Prerequisites Checklist

Before you begin, ensure you have the following installed:

- [ ] Node.js 18+ (`node --version`)
- [ ] npm 9+ (`npm --version`)
- [ ] Docker Desktop (`docker --version`)
- [ ] Docker Compose (`docker-compose --version`)
- [ ] Git (`git --version`)

## Step-by-Step Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/dwakeman/burger-palace.git
cd burger-palace

# Install all dependencies (root, backend, frontend, shared)
npm install
```

This will install dependencies for all workspaces in the monorepo.

### 2. Configure Environment Variables

```bash
# Copy the example environment file
cp backend/.env.example backend/.env
```

The default `.env` file should work for local development:
```env
DATABASE_URL="postgresql://burger_admin:burger_password@localhost:5432/burger_palace"
PORT=3001
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

### 3. Start PostgreSQL Database

```bash
# Start PostgreSQL in Docker
docker-compose up -d

# Verify it's running
docker-compose ps
```

You should see the `burger-palace-db` container running.

### 4. Set Up the Database

```bash
# Generate Prisma Client
cd backend
npx prisma generate

# Run database migrations
npx prisma migrate dev

# Seed the database with menu items
npm run seed

# (Optional) Open Prisma Studio to view the data
npx prisma studio
```

### 5. Build Shared Types

```bash
# From the root directory
cd ../shared
npm run build
```

### 6. Start the Application

#### Option A: Start Everything Together

```bash
# From the root directory
cd ..
npm run dev
```

This will start both the backend and frontend concurrently.

#### Option B: Start Separately

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend (in a new terminal)
cd frontend
npm run dev
```

### 7. Verify Everything is Working

Open your browser and check:

- ✅ Frontend: http://localhost:5173
- ✅ Backend API: http://localhost:3001/health
- ✅ API Menu: http://localhost:3001/api/menu

You should see:
- The Burger Palace frontend application
- A health check response: `{"status":"ok","timestamp":"..."}`
- Menu data with burgers, sides, and drinks

## Troubleshooting

### Database Connection Issues

**Problem**: Cannot connect to PostgreSQL

**Solutions**:
```bash
# Check if PostgreSQL is running
docker-compose ps

# View PostgreSQL logs
docker-compose logs postgres

# Restart PostgreSQL
docker-compose restart postgres

# If all else fails, recreate the container
docker-compose down
docker-compose up -d
```

### Port Already in Use

**Problem**: Port 3001 or 5173 is already in use

**Solutions**:
```bash
# Find what's using the port (macOS/Linux)
lsof -i :3001
lsof -i :5173

# Kill the process
kill -9 <PID>

# Or change the port in .env files
```

### Prisma Client Not Generated

**Problem**: `@prisma/client` module not found

**Solution**:
```bash
cd backend
npx prisma generate
```

### Migration Issues

**Problem**: Database schema out of sync

**Solution**:
```bash
cd backend

# Reset database (WARNING: deletes all data)
npx prisma migrate reset

# Or create a new migration
npx prisma migrate dev --name fix_schema
```

### TypeScript Errors

**Problem**: TypeScript compilation errors

**Solution**:
```bash
# Clean and rebuild
rm -rf node_modules package-lock.json
rm -rf backend/node_modules backend/package-lock.json
rm -rf frontend/node_modules frontend/package-lock.json
rm -rf shared/node_modules shared/package-lock.json

# Reinstall
npm install

# Rebuild shared types
cd shared && npm run build
```

### Frontend Not Loading

**Problem**: Frontend shows blank page or errors

**Solutions**:
1. Check browser console for errors
2. Verify backend is running: http://localhost:3001/health
3. Check CORS settings in backend/.env
4. Clear browser cache and reload

## Development Workflow

### Making Database Changes

1. Update `backend/prisma/schema.prisma`
2. Create a migration:
   ```bash
   cd backend
   npx prisma migrate dev --name your_change_description
   ```
3. Prisma Client will be automatically regenerated

### Adding New API Endpoints

1. Create/update service in `backend/src/services/`
2. Create/update controller in `backend/src/controllers/`
3. Add route in `backend/src/routes/`
4. Update types in `shared/src/types/` if needed

### Adding New Frontend Features

1. Create components in `frontend/src/components/`
2. Add pages in `frontend/src/pages/`
3. Update routing in `frontend/src/App.tsx`
4. Use shared types from `@burger-palace/shared`

## Testing the Application

### Manual Testing Checklist

- [ ] View menu items
- [ ] Build a custom burger
- [ ] Add items to cart
- [ ] Create an order
- [ ] View order by order number
- [ ] View order history by customer ID

### API Testing with curl

```bash
# Get menu
curl http://localhost:3001/api/menu

# Create an order
curl -X POST http://localhost:3001/api/orders \
  -H "Content-Type: application/json" \
  -d '{
    "customer": {
      "name": "John Doe",
      "email": "john@example.com",
      "phone": "555-0123"
    },
    "items": [{
      "menuItemId": "BURGER_ID_HERE",
      "quantity": 1,
      "burgerOptionIds": []
    }]
  }'

# Get order by ID
curl http://localhost:3001/api/orders/ORDER_ID_HERE
```

## Production Deployment

### Build for Production

```bash
# Build everything
npm run build

# The built files will be in:
# - backend/dist/
# - frontend/dist/
```

### Environment Variables for Production

Update these in your production environment:

```env
# Backend
DATABASE_URL=postgresql://user:password@production-host:5432/burger_palace
PORT=3001
NODE_ENV=production
CORS_ORIGIN=https://your-domain.com

# Frontend
VITE_API_URL=https://api.your-domain.com/api
```

### Database Migrations in Production

```bash
# Run migrations (doesn't prompt for confirmation)
cd backend
npx prisma migrate deploy
```

## Useful Commands Reference

```bash
# Root level
npm run dev              # Start both frontend and backend
npm run build            # Build both frontend and backend
npm run lint             # Lint all code
npm run format           # Format all code

# Backend
npm run dev:backend      # Start backend in dev mode
npm run build:backend    # Build backend
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
npm run db:studio        # Open Prisma Studio

# Frontend
npm run dev:frontend     # Start frontend in dev mode
npm run build:frontend   # Build frontend

# Database
docker-compose up -d     # Start PostgreSQL
docker-compose down      # Stop PostgreSQL
docker-compose logs -f   # View logs
```

## Next Steps

Once everything is running:

1. Explore the API documentation in ARCHITECTURE.md
2. Review the system design in SYSTEM_DESIGN.md
3. Start building new features!
4. Check out the GitHub issues for enhancement ideas

## Getting Help

- Check the [README.md](./README.md) for general information
- Review [ARCHITECTURE.md](./ARCHITECTURE.md) for technical details
- Open an issue on GitHub for bugs or questions

---

Happy coding! 🍔