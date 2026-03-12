import prisma from '../config/database';
import { OrderDto, CreateOrderDto, OrderSummaryDto } from '@burger-palace/shared';
import { AppError } from '../middleware/errorHandler';
import { generateOrderNumber } from '../utils/orderNumber';
import { calculateOrderItemPrice, calculateOrderTotals } from '../utils/priceCalculator';
import customerService from './customerService';
import { Decimal } from '@prisma/client/runtime/library';

export class OrderService {
  async createOrder(data: CreateOrderDto): Promise<OrderDto> {
    // Find or create customer
    const customer = await customerService.findOrCreateCustomer(data.customer);

    // Validate menu items and burger options exist
    const menuItemIds = data.items.map((item) => item.menuItemId);
    const menuItems = await prisma.menuItem.findMany({
      where: { id: { in: menuItemIds }, available: true },
    });

    if (menuItems.length !== menuItemIds.length) {
      throw new AppError('One or more menu items not found or unavailable', 400);
    }

    // Collect all burger option IDs
    const allBurgerOptionIds = data.items
      .flatMap((item) => item.burgerOptionIds || [])
      .filter((id) => id);

    const burgerOptions = await prisma.burgerOption.findMany({
      where: { id: { in: allBurgerOptionIds }, available: true },
    });

    if (burgerOptions.length !== allBurgerOptionIds.length) {
      throw new AppError('One or more burger options not found or unavailable', 400);
    }

    // Calculate prices for each item
    const itemSubtotals: Decimal[] = [];
    const orderItemsData = data.items.map((item) => {
      const menuItem = menuItems.find((mi) => mi.id === item.menuItemId)!;
      const itemOptions = burgerOptions.filter((opt) =>
        item.burgerOptionIds?.includes(opt.id)
      );
      const optionPrices = itemOptions.map((opt) => opt.priceModifier);

      const { unitPrice, subtotal } = calculateOrderItemPrice(
        menuItem.basePrice,
        item.quantity,
        optionPrices
      );

      itemSubtotals.push(subtotal);

      return {
        menuItemId: item.menuItemId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
        specialInstructions: item.specialInstructions,
        burgerOptionIds: item.burgerOptionIds || [],
      };
    });

    // Calculate order totals
    const { subtotal, tax, total } = calculateOrderTotals(itemSubtotals);

    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      const newOrder = await tx.order.create({
        data: {
          customerId: customer.id,
          orderNumber: generateOrderNumber(),
          subtotal,
          tax,
          total,
        },
      });

      // Create order items
      for (const itemData of orderItemsData) {
        const orderItem = await tx.orderItem.create({
          data: {
            orderId: newOrder.id,
            menuItemId: itemData.menuItemId,
            quantity: itemData.quantity,
            unitPrice: itemData.unitPrice,
            subtotal: itemData.subtotal,
            specialInstructions: itemData.specialInstructions,
          },
        });

        // Create order item options
        if (itemData.burgerOptionIds.length > 0) {
          await tx.orderItemOption.createMany({
            data: itemData.burgerOptionIds.map((optionId) => ({
              orderItemId: orderItem.id,
              burgerOptionId: optionId,
            })),
          });
        }
      }

      return newOrder;
    });

    // Fetch complete order with relations
    return this.getOrderById(order.id);
  }

  async getOrderById(id: string): Promise<OrderDto> {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: {
          include: {
            menuItem: true,
            options: {
              include: {
                burgerOption: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order as unknown as OrderDto;
  }

  async getOrderByOrderNumber(orderNumber: string): Promise<OrderDto> {
    const order = await prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        items: {
          include: {
            menuItem: true,
            options: {
              include: {
                burgerOption: true,
              },
            },
          },
        },
      },
    });

    if (!order) {
      throw new AppError('Order not found', 404);
    }

    return order as unknown as OrderDto;
  }

  async getOrdersByCustomerId(customerId: string): Promise<OrderSummaryDto[]> {
    const orders = await prisma.order.findMany({
      where: { customerId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        orderNumber: true,
        status: true,
        total: true,
        createdAt: true,
      },
    });

    return orders as OrderSummaryDto[];
  }

  async updateOrderStatus(id: string, status: string): Promise<OrderDto> {
    const order = await prisma.order.update({
      where: { id },
      data: { status: status as any },
      include: {
        customer: true,
        items: {
          include: {
            menuItem: true,
            options: {
              include: {
                burgerOption: true,
              },
            },
          },
        },
      },
    });

    return order as unknown as OrderDto;
  }
}

export default new OrderService();

// Made with Bob
