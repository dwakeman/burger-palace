import { Decimal } from '@prisma/client/runtime/library';

export function calculateOrderItemPrice(
  basePrice: Decimal,
  quantity: number,
  optionPrices: Decimal[]
): { unitPrice: Decimal; subtotal: Decimal } {
  const optionsTotal = optionPrices.reduce(
    (sum, price) => sum.add(price),
    new Decimal(0)
  );
  
  const unitPrice = new Decimal(basePrice).add(optionsTotal);
  const subtotal = unitPrice.mul(quantity);
  
  return { unitPrice, subtotal };
}

export function calculateOrderTotals(itemSubtotals: Decimal[]): {
  subtotal: Decimal;
  tax: Decimal;
  total: Decimal;
} {
  const subtotal = itemSubtotals.reduce(
    (sum, itemSubtotal) => sum.add(itemSubtotal),
    new Decimal(0)
  );
  
  // 8% tax rate
  const taxRate = new Decimal(0.08);
  const tax = subtotal.mul(taxRate);
  const total = subtotal.add(tax);
  
  return { subtotal, tax, total };
}

// Made with Bob
