# Burger Palace - End-to-End Testing Guide

This document provides comprehensive testing procedures for the Burger Palace application.

## Test Environment Setup

### Prerequisites
- Backend server running on http://localhost:3001
- Frontend server running on http://localhost:5173
- PostgreSQL database running in Docker
- Clean browser cache (recommended)

### Starting the Application
```bash
# Terminal 1 - Backend
npm run dev:backend

# Terminal 2 - Frontend
npm run dev:frontend
```

---

## Test Suite 1: Menu Browsing

### Test 1.1: View Menu Page
**Objective**: Verify menu items are displayed correctly

**Steps**:
1. Navigate to http://localhost:5173/menu
2. Verify page loads without errors
3. Check that menu categories are displayed (Burgers, Sides, Drinks)
4. Verify all menu items show:
   - Name
   - Description
   - Price
   - "Add to Cart" button

**Expected Results**:
- ✅ 3 burger options (Single $6.99, Double $9.99, Triple $12.99)
- ✅ 4 sides options ($3.99 - $5.99)
- ✅ 8 drink options ($2.49 each)
- ✅ All items have proper formatting and styling

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 1.2: Add Item to Cart from Menu
**Objective**: Verify "Add to Cart" functionality

**Steps**:
1. On menu page, click "Add to Cart" for "Single Burger"
2. Observe cart badge in header
3. Click "Add to Cart" for "French Fries"
4. Click "Add to Cart" for "Coca-Cola"

**Expected Results**:
- ✅ Cart badge shows "3" items
- ✅ Success notification appears for each addition
- ✅ Items are added without page reload

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 2: Burger Builder

### Test 2.1: Access Burger Builder
**Objective**: Verify burger builder page loads correctly

**Steps**:
1. Click "Build a Burger" in navigation
2. Verify page loads at http://localhost:5173/build

**Expected Results**:
- ✅ Page displays 4 sections: Base, Cheese, Toppings, Condiments
- ✅ Summary panel shows on right side
- ✅ Default burger (Single) is pre-selected
- ✅ Total price shows $6.99

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 2.2: Customize Burger
**Objective**: Verify burger customization and price calculation

**Steps**:
1. Select "Double Burger" as base
2. Select "Cheddar Cheese"
3. Check "Bacon" and "Avocado" toppings
4. Check "Lettuce", "Tomato", "Pickles"
5. Check "Ketchup" and "Mustard"
6. Observe price updates in real-time

**Expected Results**:
- ✅ Base price: $9.99
- ✅ Cheese: +$1.00
- ✅ Bacon: +$2.00
- ✅ Avocado: +$1.50
- ✅ Total: $14.49
- ✅ Summary panel shows all selections

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 2.3: Add Custom Burger to Cart
**Objective**: Verify custom burger is added to cart

**Steps**:
1. With customized burger from Test 2.2
2. Click "Add to Cart" button
3. Verify success notification
4. Check cart badge count

**Expected Results**:
- ✅ Success message appears
- ✅ Cart count increases
- ✅ Can continue building more burgers

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 3: Shopping Cart & Checkout

### Test 3.1: View Cart in Checkout
**Objective**: Verify cart items display correctly

**Steps**:
1. Click cart icon or navigate to http://localhost:5173/checkout
2. Verify all items from previous tests are shown

**Expected Results**:
- ✅ All added items are displayed
- ✅ Quantities are correct
- ✅ Prices are accurate
- ✅ Subtotal is calculated correctly
- ✅ Tax (8%) is calculated
- ✅ Total is correct

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 3.2: Modify Cart Quantities
**Objective**: Verify quantity adjustment works

**Steps**:
1. On checkout page, increase quantity of "French Fries" to 2
2. Decrease quantity of "Coca-Cola" to 0 (remove)
3. Observe price updates

**Expected Results**:
- ✅ Quantities update correctly
- ✅ Prices recalculate
- ✅ Item with 0 quantity is removed
- ✅ Totals update automatically

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 3.3: Submit Order
**Objective**: Verify order submission process

**Steps**:
1. Fill in customer information:
   - Name: "Test User"
   - Email: "test@example.com"
   - Phone: "555-1234"
2. Click "Place Order" button
3. Wait for order confirmation

**Expected Results**:
- ✅ Form validation works
- ✅ Order submits successfully
- ✅ Redirects to order confirmation page
- ✅ Order number is displayed (format: ORD-YYYYMMDD-XXXX)
- ✅ Cart is cleared

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 4: Order Management

### Test 4.1: View Order Confirmation
**Objective**: Verify order details are displayed correctly

**Steps**:
1. After order submission, verify confirmation page
2. Check all order details

**Expected Results**:
- ✅ Order number is displayed
- ✅ Customer information is shown
- ✅ All ordered items are listed
- ✅ Selected burger options are shown
- ✅ Prices match checkout
- ✅ Order status is "PENDING"
- ✅ Order date/time is displayed

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 4.2: Access Order by URL
**Objective**: Verify direct order access works

**Steps**:
1. Copy order number from confirmation page
2. Navigate to http://localhost:5173/order/{orderNumber}
3. Verify order loads

**Expected Results**:
- ✅ Order details display correctly
- ✅ All information matches original order
- ✅ Page loads without errors

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 5: Customer Account

### Test 5.1: Customer Lookup by Email
**Objective**: Verify customer search functionality

**Steps**:
1. Navigate to http://localhost:5173/account
2. Enter email used in Test 3.3: "test@example.com"
3. Click "Search" button

**Expected Results**:
- ✅ Customer information is displayed
- ✅ Shows: Customer ID, Name, Email, Phone
- ✅ Shows "Member Since" date
- ✅ "View Order History" button is available

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 5.2: View Order History from Customer Lookup
**Objective**: Verify order history integration

**Steps**:
1. From customer lookup results (Test 5.1)
2. Click "View Order History" button
3. Verify redirect to order history page

**Expected Results**:
- ✅ Redirects to /orders with customer ID in URL
- ✅ Orders load automatically
- ✅ All customer's orders are displayed
- ✅ Most recent orders appear first

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 6: Order History

### Test 6.1: Search Order History by Customer ID
**Objective**: Verify order history search

**Steps**:
1. Navigate to http://localhost:5173/orders
2. Enter customer ID from Test 5.1
3. Click "Search" button

**Expected Results**:
- ✅ All orders for customer are displayed
- ✅ Shows: Order number, date, total, status
- ✅ Orders are sorted by date (newest first)
- ✅ "View Details" button for each order

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 6.2: View Order Details from History
**Objective**: Verify order detail navigation

**Steps**:
1. From order history list
2. Click "View Details" on any order
3. Verify navigation to order detail page

**Expected Results**:
- ✅ Navigates to /order/{orderNumber}
- ✅ Full order details are displayed
- ✅ All information is accurate

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 7: API Endpoints

### Test 7.1: Health Check
**Objective**: Verify API is running

**Command**:
```bash
curl http://localhost:3001/health
```

**Expected Response**:
```json
{
  "status": "ok",
  "timestamp": "2026-03-20T01:00:00.000Z"
}
```

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 7.2: Get Menu
**Objective**: Verify menu endpoint

**Command**:
```bash
curl http://localhost:3001/api/menu
```

**Expected Response**:
- ✅ Status: 200
- ✅ Returns categories, items, and burger options
- ✅ All menu items are present

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 7.3: Get Burger Options
**Objective**: Verify burger options endpoint

**Command**:
```bash
curl http://localhost:3001/api/menu/burger-options
```

**Expected Response**:
- ✅ Status: 200
- ✅ Returns cheese, toppings, and condiments
- ✅ Prices are correct

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 7.4: Search Customer by Email
**Objective**: Verify customer search endpoint

**Command**:
```bash
curl "http://localhost:3001/api/customers/search?email=test@example.com"
```

**Expected Response**:
- ✅ Status: 200
- ✅ Returns customer data
- ✅ Email matches search query

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 7.5: Get Customer Orders
**Objective**: Verify customer orders endpoint

**Command**:
```bash
curl http://localhost:3001/api/orders/customer/{customerId}
```

**Expected Response**:
- ✅ Status: 200
- ✅ Returns array of orders
- ✅ Orders belong to specified customer

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 8: Error Handling

### Test 8.1: Invalid Customer Email
**Objective**: Verify error handling for not found

**Steps**:
1. Navigate to /account
2. Enter "nonexistent@example.com"
3. Click "Search"

**Expected Results**:
- ✅ Error message displayed
- ✅ Message: "No customer found with that email address"
- ✅ No crash or blank screen

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 8.2: Invalid Order Number
**Objective**: Verify error handling for invalid order

**Steps**:
1. Navigate to /order/INVALID-ORDER-123
2. Observe error handling

**Expected Results**:
- ✅ Error message displayed
- ✅ User-friendly error message
- ✅ Option to return to home or search orders

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 8.3: Empty Cart Checkout
**Objective**: Verify validation for empty cart

**Steps**:
1. Clear browser localStorage
2. Navigate to /checkout
3. Attempt to place order

**Expected Results**:
- ✅ Message indicating cart is empty
- ✅ Button to return to menu
- ✅ Cannot submit order

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 9: Data Persistence

### Test 9.1: Cart Persistence
**Objective**: Verify cart survives page refresh

**Steps**:
1. Add items to cart
2. Refresh browser (F5)
3. Check cart contents

**Expected Results**:
- ✅ Cart items are preserved
- ✅ Quantities are correct
- ✅ Cart badge shows correct count

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 9.2: Database Persistence
**Objective**: Verify orders are saved to database

**Command**:
```bash
docker exec -it burger-palace-db psql -U burger_admin -d burger_palace -c "SELECT order_number, total, status FROM orders ORDER BY created_at DESC LIMIT 5;"
```

**Expected Results**:
- ✅ Recent orders are in database
- ✅ Data matches application display
- ✅ All fields are populated correctly

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Suite 10: Responsive Design

### Test 10.1: Mobile View (375px)
**Objective**: Verify mobile responsiveness

**Steps**:
1. Open browser DevTools
2. Set viewport to 375px width
3. Navigate through all pages

**Expected Results**:
- ✅ All pages are readable
- ✅ Navigation works
- ✅ Forms are usable
- ✅ No horizontal scrolling
- ✅ Buttons are tappable

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

### Test 10.2: Tablet View (768px)
**Objective**: Verify tablet responsiveness

**Steps**:
1. Set viewport to 768px width
2. Test all major features

**Expected Results**:
- ✅ Layout adapts appropriately
- ✅ All features work correctly
- ✅ Good use of screen space

**Status**: ⬜ Not Tested | ✅ Passed | ❌ Failed

---

## Test Summary

### Test Results Overview

| Test Suite | Total Tests | Passed | Failed | Not Tested |
|------------|-------------|--------|--------|------------|
| Menu Browsing | 2 | 0 | 0 | 2 |
| Burger Builder | 3 | 0 | 0 | 3 |
| Shopping Cart | 3 | 0 | 0 | 3 |
| Order Management | 2 | 0 | 0 | 2 |
| Customer Account | 2 | 0 | 0 | 2 |
| Order History | 2 | 0 | 0 | 2 |
| API Endpoints | 5 | 0 | 0 | 5 |
| Error Handling | 3 | 0 | 0 | 3 |
| Data Persistence | 2 | 0 | 0 | 2 |
| Responsive Design | 2 | 0 | 0 | 2 |
| **TOTAL** | **26** | **0** | **0** | **26** |

### Critical Issues Found
- None (testing not yet performed)

### Non-Critical Issues Found
- None (testing not yet performed)

### Recommendations
1. Complete all test suites
2. Document any issues found
3. Retest after fixes
4. Consider automated testing implementation

---

## Automated Testing (Future Enhancement)

### Recommended Tools
- **Frontend**: Jest + React Testing Library
- **E2E**: Cypress or Playwright
- **API**: Supertest
- **Load Testing**: k6 or Artillery

### Test Coverage Goals
- Unit Tests: 80%+ coverage
- Integration Tests: Key user flows
- E2E Tests: Critical paths
- API Tests: All endpoints

---

**Testing Document Version**: 1.0  
**Last Updated**: 2026-03-20  
**Tested By**: [Your Name]  
**Test Environment**: Development