# Burger Palace - System Design

## System Architecture Diagram

```mermaid
graph TB
    subgraph Client["Client Layer"]
        Browser[Web Browser]
    end
    
    subgraph Frontend["Frontend - React + Carbon"]
        Pages[Pages]
        Components[Components]
        Services[API Services]
        Context[Cart Context]
    end
    
    subgraph Backend["Backend - Express + TypeScript"]
        API[REST API]
        Controllers[Controllers]
        BizLogic[Business Logic]
        Validation[Validation Layer]
    end
    
    subgraph Data["Data Layer"]
        Prisma[Prisma ORM]
        DB[(PostgreSQL)]
    end
    
    Browser --> Pages
    Pages --> Components
    Components --> Context
    Components --> Services
    Services --> API
    API --> Controllers
    Controllers --> Validation
    Controllers --> BizLogic
    BizLogic --> Prisma
    Prisma --> DB
```

## Database Entity Relationship Diagram

```mermaid
erDiagram
    CUSTOMERS ||--o{ ORDERS : places
    ORDERS ||--|{ ORDER_ITEMS : contains
    ORDER_ITEMS ||--o{ ORDER_ITEM_OPTIONS : has
    ORDER_ITEM_OPTIONS }o--|| BURGER_OPTIONS : references
    MENU_ITEMS ||--o{ ORDER_ITEMS : ordered_as
    MENU_CATEGORIES ||--o{ MENU_ITEMS : contains
    
    CUSTOMERS {
        uuid id PK
        varchar name
        varchar email
        varchar phone
        timestamp created_at
        timestamp updated_at
    }
    
    MENU_CATEGORIES {
        uuid id PK
        varchar name
        int display_order
    }
    
    MENU_ITEMS {
        uuid id PK
        uuid category_id FK
        varchar name
        text description
        decimal base_price
        boolean available
        timestamp created_at
        timestamp updated_at
    }
    
    BURGER_OPTIONS {
        uuid id PK
        enum option_type
        varchar name
        decimal price_modifier
        boolean available
    }
    
    ORDERS {
        uuid id PK
        uuid customer_id FK
        varchar order_number
        enum status
        decimal subtotal
        decimal tax
        decimal total
        timestamp created_at
        timestamp updated_at
    }
    
    ORDER_ITEMS {
        uuid id PK
        uuid order_id FK
        uuid menu_item_id FK
        int quantity
        decimal unit_price
        decimal subtotal
        text special_instructions
    }
    
    ORDER_ITEM_OPTIONS {
        uuid id PK
        uuid order_item_id FK
        uuid burger_option_id FK
    }
```

## User Flow - Create Order

```mermaid
sequenceDiagram
    actor Customer
    participant UI as Frontend UI
    participant Cart as Cart Context
    participant API as Backend API
    participant DB as Database
    
    Customer->>UI: Browse Menu
    UI->>API: GET /api/menu
    API->>DB: Query menu items
    DB-->>API: Menu data
    API-->>UI: Menu items
    UI-->>Customer: Display menu
    
    Customer->>UI: Build burger
    UI->>Cart: Add to cart
    
    Customer->>UI: Add sides/drinks
    UI->>Cart: Add to cart
    
    Customer->>UI: Proceed to checkout
    UI-->>Customer: Show cart summary
    
    Customer->>UI: Enter customer info
    Customer->>UI: Submit order
    
    UI->>API: POST /api/orders
    API->>DB: Create customer
    DB-->>API: Customer ID
    API->>DB: Create order
    DB-->>API: Order ID
    API->>DB: Create order items
    DB-->>API: Success
    API-->>UI: Order confirmation
    UI-->>Customer: Display order ID
```

## User Flow - View Order

```mermaid
sequenceDiagram
    actor Customer
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    
    Customer->>UI: Enter order ID
    UI->>API: GET /api/orders/:id
    API->>DB: Query order
    DB-->>API: Order data
    API->>DB: Query order items
    DB-->>API: Items data
    API-->>UI: Complete order
    UI-->>Customer: Display order details
```

## User Flow - View Order History

```mermaid
sequenceDiagram
    actor Customer
    participant UI as Frontend UI
    participant API as Backend API
    participant DB as Database
    
    Customer->>UI: Enter customer ID
    UI->>API: GET /api/customers/:id/orders
    API->>DB: Query orders by customer
    DB-->>API: Orders list
    API-->>UI: Order history
    UI-->>Customer: Display past orders
    
    Customer->>UI: Click on order
    UI->>API: GET /api/orders/:id
    API->>DB: Query order details
    DB-->>API: Order data
    API-->>UI: Order details
    UI-->>Customer: Display full order
```

## Component Hierarchy

```mermaid
graph TD
    App[App]
    App --> Header[Header]
    App --> Router[Router]
    App --> Footer[Footer]
    
    Router --> HomePage[HomePage]
    Router --> MenuPage[MenuPage]
    Router --> CheckoutPage[CheckoutPage]
    Router --> OrderViewPage[OrderViewPage]
    Router --> OrderHistoryPage[OrderHistoryPage]
    
    MenuPage --> MenuGrid[MenuGrid]
    MenuGrid --> BurgerBuilder[BurgerBuilder]
    MenuGrid --> SideSelector[SideSelector]
    MenuGrid --> DrinkSelector[DrinkSelector]
    
    CheckoutPage --> ShoppingCart[ShoppingCart]
    ShoppingCart --> CartItem[CartItem]
    CheckoutPage --> CartSummary[CartSummary]
    CheckoutPage --> CustomerForm[CustomerForm]
    CheckoutPage --> OrderConfirmation[OrderConfirmation]
    
    OrderViewPage --> OrderView[OrderView]
    OrderHistoryPage --> OrderHistory[OrderHistory]
    OrderHistory --> OrderView
```

## API Request/Response Flow

```mermaid
graph LR
    Client[Client Request]
    Client --> Middleware[Middleware]
    Middleware --> Validation[Validation]
    Validation --> Controller[Controller]
    Controller --> Service[Service Layer]
    Service --> Prisma[Prisma ORM]
    Prisma --> DB[(Database)]
    
    DB --> Prisma
    Prisma --> Service
    Service --> Controller
    Controller --> Response[JSON Response]
    Response --> Client
    
    Validation -.Error.-> ErrorHandler[Error Handler]
    Controller -.Error.-> ErrorHandler
    Service -.Error.-> ErrorHandler
    ErrorHandler --> Response
```

## Deployment Architecture

```mermaid
graph TB
    subgraph Production["Production Environment"]
        LB[Load Balancer]
        
        subgraph AppServers["Application Servers"]
            App1[Node.js Instance 1]
            App2[Node.js Instance 2]
        end
        
        subgraph Database["Database Cluster"]
            Primary[(PostgreSQL Primary)]
            Replica[(PostgreSQL Replica)]
        end
        
        subgraph Static["Static Assets"]
            CDN[CDN / S3]
        end
    end
    
    Users[Users] --> LB
    LB --> App1
    LB --> App2
    App1 --> Primary
    App2 --> Primary
    Primary --> Replica
    Users --> CDN
```

## Data Flow - Order Creation

```mermaid
flowchart TD
    Start([Customer starts order])
    Start --> Browse[Browse menu items]
    Browse --> Select[Select burger options]
    Select --> AddCart{Add to cart?}
    AddCart -->|Yes| Cart[Update cart]
    AddCart -->|No| Browse
    Cart --> More{Add more items?}
    More -->|Yes| Browse
    More -->|No| Checkout[Proceed to checkout]
    Checkout --> CustomerInfo[Enter customer info]
    CustomerInfo --> Validate{Valid info?}
    Validate -->|No| CustomerInfo
    Validate -->|Yes| Submit[Submit order]
    Submit --> CreateCustomer[Create/find customer]
    CreateCustomer --> CreateOrder[Create order record]
    CreateOrder --> CreateItems[Create order items]
    CreateItems --> Calculate[Calculate totals]
    Calculate --> Save[Save to database]
    Save --> OrderID[Generate order ID]
    OrderID --> Confirm([Show confirmation])
```

## Technology Stack Details

### Frontend Stack
- **React 18+**: Component-based UI framework
- **IBM Carbon Design System**: Enterprise-grade UI components
- **TypeScript**: Type-safe JavaScript
- **Vite**: Fast build tool and dev server
- **React Router**: Client-side routing
- **Axios**: HTTP client for API calls
- **Context API**: State management for cart

### Backend Stack
- **Node.js**: JavaScript runtime
- **Express.js**: Web application framework
- **TypeScript**: Type-safe development
- **Prisma**: Modern ORM with type safety
- **Zod**: Schema validation
- **Winston**: Logging
- **Helmet**: Security middleware
- **CORS**: Cross-origin resource sharing

### Database
- **PostgreSQL 14+**: Relational database
- **Prisma Migrate**: Database migrations
- **UUID**: Primary key generation

### Development Tools
- **ESLint**: Code linting
- **Prettier**: Code formatting
- **Jest**: Unit testing
- **Supertest**: API testing
- **Docker**: Containerization
- **Docker Compose**: Multi-container orchestration

## Security Considerations

1. **Input Validation**: All user inputs validated with Zod schemas
2. **SQL Injection Prevention**: Prisma ORM parameterized queries
3. **CORS Configuration**: Restricted to frontend domain
4. **Rate Limiting**: Prevent API abuse
5. **Error Handling**: No sensitive data in error messages
6. **Environment Variables**: Sensitive config in .env files
7. **HTTPS**: SSL/TLS in production
8. **Helmet.js**: Security headers

## Performance Optimization

1. **Database Indexing**: Indexes on frequently queried fields
2. **Connection Pooling**: Efficient database connections
3. **Caching**: Redis for menu items (future enhancement)
4. **Code Splitting**: Lazy loading React components
5. **Image Optimization**: Compressed images for menu items
6. **CDN**: Static assets served from CDN
7. **Pagination**: Large result sets paginated
8. **Database Queries**: Optimized with proper joins and selects

## Monitoring and Logging

1. **Application Logs**: Winston for structured logging
2. **Error Tracking**: Log errors with stack traces
3. **API Metrics**: Response times and error rates
4. **Database Monitoring**: Query performance
5. **Health Checks**: Endpoint for service health