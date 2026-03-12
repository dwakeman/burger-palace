export interface CustomerDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateCustomerDto {
  name: string;
  email: string;
  phone: string;
}

// Made with Bob
