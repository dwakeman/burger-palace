export enum MenuCategory {
  BURGERS = 'BURGERS',
  SIDES = 'SIDES',
  DRINKS = 'DRINKS',
}

export enum BurgerOptionType {
  PATTY_COUNT = 'PATTY_COUNT',
  CHEESE = 'CHEESE',
  TOPPING = 'TOPPING',
  CONDIMENT = 'CONDIMENT',
}

export interface MenuCategoryDto {
  id: string;
  name: string;
  displayOrder: number;
}

export interface MenuItemDto {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  basePrice: number;
  available: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BurgerOptionDto {
  id: string;
  optionType: BurgerOptionType;
  name: string;
  priceModifier: number;
  available: boolean;
}

export interface MenuDto {
  categories: MenuCategoryDto[];
  items: MenuItemDto[];
  burgerOptions: BurgerOptionDto[];
}

// Made with Bob
