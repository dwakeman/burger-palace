import { PrismaClient, BurgerOptionType } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create menu categories
  const burgersCategory = await prisma.menuCategory.create({
    data: {
      name: 'Burgers',
      displayOrder: 1,
    },
  });

  const sidesCategory = await prisma.menuCategory.create({
    data: {
      name: 'Sides',
      displayOrder: 2,
    },
  });

  const drinksCategory = await prisma.menuCategory.create({
    data: {
      name: 'Drinks',
      displayOrder: 3,
    },
  });

  console.log('Created menu categories');

  // Create burger menu items
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: burgersCategory.id,
        name: 'Single Burger',
        description: 'Classic burger with one 1/4 lb patty',
        basePrice: 6.99,
      },
      {
        categoryId: burgersCategory.id,
        name: 'Double Burger',
        description: 'Double the goodness with two 1/4 lb patties',
        basePrice: 9.99,
      },
      {
        categoryId: burgersCategory.id,
        name: 'Triple Burger',
        description: 'Triple threat with three 1/4 lb patties',
        basePrice: 12.99,
      },
    ],
  });

  console.log('Created burger menu items');

  // Create sides menu items
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: sidesCategory.id,
        name: 'French Fries',
        description: 'Crispy golden french fries',
        basePrice: 3.99,
      },
      {
        categoryId: sidesCategory.id,
        name: 'Tater Tots',
        description: 'Crispy bite-sized potato tots',
        basePrice: 4.49,
      },
      {
        categoryId: sidesCategory.id,
        name: 'Onion Rings',
        description: 'Beer-battered onion rings',
        basePrice: 4.99,
      },
      {
        categoryId: sidesCategory.id,
        name: 'Cheese Curds',
        description: 'Wisconsin cheese curds, lightly breaded',
        basePrice: 5.99,
      },
    ],
  });

  console.log('Created sides menu items');

  // Create drinks menu items
  await prisma.menuItem.createMany({
    data: [
      {
        categoryId: drinksCategory.id,
        name: 'Coca-Cola',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Pepsi',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Sprite',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Dr Pepper',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Mountain Dew',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Root Beer',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Lemonade',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
      {
        categoryId: drinksCategory.id,
        name: 'Iced Tea',
        description: '20 oz bottle',
        basePrice: 2.49,
      },
    ],
  });

  console.log('Created drinks menu items');

  // Create burger options - Cheese
  await prisma.burgerOption.createMany({
    data: [
      {
        optionType: BurgerOptionType.CHEESE,
        name: 'American Cheese',
        priceModifier: 1.00,
      },
      {
        optionType: BurgerOptionType.CHEESE,
        name: 'Cheddar Cheese',
        priceModifier: 1.00,
      },
      {
        optionType: BurgerOptionType.CHEESE,
        name: 'Swiss Cheese',
        priceModifier: 1.00,
      },
      {
        optionType: BurgerOptionType.CHEESE,
        name: 'Pepper Jack Cheese',
        priceModifier: 1.00,
      },
      {
        optionType: BurgerOptionType.CHEESE,
        name: 'Blue Cheese',
        priceModifier: 1.00,
      },
    ],
  });

  console.log('Created cheese options');

  // Create burger options - Toppings
  await prisma.burgerOption.createMany({
    data: [
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Lettuce',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Tomato',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Raw Onion',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Grilled Onion',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Pickles',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Jalapeños',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Grilled Mushrooms',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Bacon',
        priceModifier: 2.00,
      },
      {
        optionType: BurgerOptionType.TOPPING,
        name: 'Avocado',
        priceModifier: 1.50,
      },
    ],
  });

  console.log('Created topping options');

  // Create burger options - Condiments
  await prisma.burgerOption.createMany({
    data: [
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'Ketchup',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'Mustard',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'Mayo',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'BBQ Sauce',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'Ranch',
        priceModifier: 0.00,
      },
      {
        optionType: BurgerOptionType.CONDIMENT,
        name: 'Hot Sauce',
        priceModifier: 0.00,
      },
    ],
  });

  console.log('Created condiment options');

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

// Made with Bob
