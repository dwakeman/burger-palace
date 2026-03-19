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

## Summary

**Total Issues Fixed**: 3
- **Critical**: 1 (Blank screen)
- **Medium**: 1 (Order number undefined)
- **Enhancement**: 1 (Missing API endpoint)

All issues have been resolved and included in the initial application release (commit `9cb7d0e`).