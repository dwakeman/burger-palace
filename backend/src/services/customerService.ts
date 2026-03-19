import prisma from '../config/database';
import { CustomerDto, CreateCustomerDto } from '@burger-palace/shared';
import { AppError } from '../middleware/errorHandler';

export class CustomerService {
  async createCustomer(data: CreateCustomerDto): Promise<CustomerDto> {
    // Check if customer with email already exists
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      return existingCustomer as CustomerDto;
    }

    const customer = await prisma.customer.create({
      data,
    });

    return customer as CustomerDto;
  }

  async getCustomerById(id: string): Promise<CustomerDto | null> {
    const customer = await prisma.customer.findUnique({
      where: { id },
    });

    if (!customer) {
      throw new AppError('Customer not found', 404);
    }

    return customer as CustomerDto;
  }

  async getAllCustomers(): Promise<CustomerDto[]> {
    const customers = await prisma.customer.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return customers as CustomerDto[];
  }

  async findOrCreateCustomer(data: CreateCustomerDto): Promise<CustomerDto> {
    const existingCustomer = await prisma.customer.findUnique({
      where: { email: data.email },
    });

    if (existingCustomer) {
      return existingCustomer as CustomerDto;
    }

    return this.createCustomer(data);
  }
}

export default new CustomerService();

// Made with Bob
