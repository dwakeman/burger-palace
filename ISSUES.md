# GitHub Issues for Fixed Defects

This document contains the issues that were identified and fixed during development. These should be created as GitHub issues and marked as closed.

---

## Issue #2: Bug - Order number showing as undefined after checkout

**Labels**: `bug`, `frontend`, `fixed`

### Description
After completing checkout and submitting an order, the order confirmation page displays 'undefined' instead of the actual order number.

### Steps to Reproduce
1. Add items to cart
2. Go to checkout page
3. Fill in customer information
4. Submit order
5. Observe order number on confirmation page shows 'undefined'

### Root Cause
The backend API wraps responses in a `{ status: 'success', data: order }` structure, but the frontend was accessing `response.data` directly instead of `response.data.data`.

### Fix
Updated `CheckoutPage.tsx` to correctly access the nested data structure:
```typescript
const order = response.data.data; // Access nested data property
```

### Impact
- **Severity**: Medium
- **User Experience**: Confusing, users cannot see their order number
- **Workaround**: Order is still created successfully in database

### Status
✅ **Fixed** in commit `9cb7d0e`

---

## Issue #3: Bug - Frontend blank screen due to shared package module format

**Labels**: `bug`, `frontend`, `build`, `fixed`

### Description
After implementing Order View and Order History pages, the frontend displayed a blank screen with no error messages in the browser console. The application failed to load completely.

### Steps to Reproduce
1. Start the frontend development server
2. Navigate to any page
3. Observe blank screen with no content

### Root Cause
The shared TypeScript package was compiling to CommonJS format (`module: "commonjs"` in tsconfig.json), but Vite requires ES modules for proper bundling and hot module replacement.

### Error Details
- Vite cannot properly handle CommonJS modules from local packages
- No visible error in browser console
- Build process completed without errors

### Fix
Updated `shared/tsconfig.json` to compile to ES2020 modules:
```json
{
  "compilerOptions": {
    "module": "ES2020",
    "target": "ES2020"
  }
}
```

Then rebuilt the shared package:
```bash
cd shared && npm run build
```

### Impact
- **Severity**: Critical
- **User Experience**: Complete application failure
- **Workaround**: None - application unusable

### Status
✅ **Fixed** in commit `9cb7d0e`

---

## Issue #4: Missing API endpoint - GET /api/customers

**Labels**: `enhancement`, `backend`, `api`, `fixed`

### Description
The backend API was missing a GET endpoint to retrieve all customers. This made it difficult for users to find their customer ID for order history lookup.

### Steps to Reproduce
1. Try to access `GET http://localhost:3001/api/customers`
2. Receive "Cannot GET /api/customers" error

### Expected Behavior
Should return a list of all customers with their IDs, names, emails, and phone numbers.

### Implementation
Added three components:

1. **Service method** (`backend/src/services/customerService.ts`):
```typescript
export const getAllCustomers = async () => {
  return await prisma.customer.findMany({
    orderBy: { createdAt: 'desc' }
  });
};
```

2. **Controller function** (`backend/src/controllers/customerController.ts`):
```typescript
export const getAllCustomers = async (req: Request, res: Response) => {
  const customers = await customerService.getAllCustomers();
  res.json({ status: 'success', data: customers });
};
```

3. **Route** (`backend/src/routes/customerRoutes.ts`):
```typescript
router.get('/', getAllCustomers);
```

### Response Format
```json
{
  "status": "success",
  "data": [
    {
      "id": "uuid",
      "name": "Customer Name",
      "email": "email@example.com",
      "phone": "555-1234",
      "createdAt": "2026-03-19T21:07:24.026Z",
      "updatedAt": "2026-03-19T21:07:24.026Z"
    }
  ]
}
```

### Impact
- **Severity**: Low
- **User Experience**: Inconvenient to find customer ID
- **Workaround**: Query database directly or check backend logs

### Status
✅ **Fixed** in commit `9cb7d0e`

---

## Issue #5: Feature - Customer Lookup by Email

**Labels**: `enhancement`, `feature`, `backend`, `frontend`, `completed`

### Description
Added functionality to allow users to look up their customer information by email address, making it easier to access their account and order history without needing to remember their customer ID.

### User Story
As a customer, I want to search for my account using my email address so that I can easily access my customer information and order history without needing to remember my customer ID.

### Implementation

#### Backend Changes

1. **Service Method** (`backend/src/services/customerService.ts`):
```typescript
async getCustomerByEmail(email: string): Promise<CustomerDto | null> {
  const customer = await prisma.customer.findUnique({
    where: { email },
  });

  if (!customer) {
    throw new AppError('Customer not found with that email address', 404);
  }

  return customer as CustomerDto;
}
```

2. **Controller Function** (`backend/src/controllers/customerController.ts`):
```typescript
export const getCustomerByEmail = asyncHandler(async (req: Request, res: Response) => {
  const email = req.query.email as string;
  
  if (!email) {
    return res.status(400).json({
      status: 'error',
      message: 'Email query parameter is required'
    });
  }

  const customer = await customerService.getCustomerByEmail(email);
  
  res.json({
    status: 'success',
    data: customer,
  });
});
```

3. **API Route** (`backend/src/routes/customerRoutes.ts`):
```typescript
router.get('/search', getCustomerByEmail);
```

**API Endpoint**: `GET /api/customers/search?email={email}`

#### Frontend Changes

1. **Customer Lookup Page** (`frontend/src/pages/CustomerLookupPage.tsx`):
   - Email search form with validation
   - Real-time customer information display
   - Customer details: ID, name, email, phone, member since date
   - Direct navigation to order history
   - Error handling for not found cases
   - Help section for users

2. **Styling** (`frontend/src/styles/CustomerLookupPage.css`):
   - Clean, professional design
   - Responsive layout for mobile and desktop
   - Highlighted customer information cards
   - Accessible form controls

3. **Navigation Integration**:
   - Added "My Account" link to header navigation
   - Route configured at `/account`
   - Accessible from any page in the application

4. **Enhanced Order History Page** (`frontend/src/pages/OrderHistoryPage.tsx`):
   - Auto-search functionality when `customerId` is provided in URL query params
   - Seamless integration with customer lookup page
   - "View Order History" button passes customer ID automatically

### Features

- **Email-based search**: Users can find their account using their email address
- **Complete customer information display**: Shows all relevant customer details
- **Quick access to order history**: One-click navigation to view all orders
- **Error handling**: Clear error messages for invalid or not found emails
- **Responsive design**: Works seamlessly on desktop and mobile devices
- **Help section**: Provides guidance for users having trouble finding their account

### API Response Format
```json
{
  "status": "success",
  "data": {
    "id": "0cc956a9-f586-4e7a-907b-ae633bdadc5a",
    "name": "Dave Wakeman",
    "email": "dwakeman@us.ibm.com",
    "phone": "515-988-8628",
    "createdAt": "2026-03-19T21:07:24.026Z",
    "updatedAt": "2026-03-19T21:07:24.026Z"
  }
}
```

### User Flow

1. User clicks "My Account" in header navigation
2. User enters their email address in the search form
3. System searches for customer by email
4. Customer information is displayed with details
5. User can click "View Order History" to see all their orders
6. Order history page automatically loads with customer's orders

### Impact
- **User Experience**: Significantly improved - no need to remember customer IDs
- **Accessibility**: Makes the system more user-friendly
- **Integration**: Seamlessly connects customer lookup with order history

### Status
✅ **Completed** in commit `cc8ccca`

---

## Summary

**Total Issues/Features**: 4
- **Critical Bug**: 1 (Blank screen) - Fixed
- **Medium Bug**: 1 (Order number undefined) - Fixed
- **Enhancement**: 2 (Missing API endpoint, Customer lookup by email) - Completed

All issues have been resolved and features implemented:
- Initial release: commit `9cb7d0e`
- Customer lookup feature: commit `cc8ccca`