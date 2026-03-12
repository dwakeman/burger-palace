import prisma from '../config/database';
import { MenuDto, MenuCategoryDto, MenuItemDto, BurgerOptionDto } from '@burger-palace/shared';

export class MenuService {
  async getFullMenu(): Promise<MenuDto> {
    const [categories, items, burgerOptions] = await Promise.all([
      prisma.menuCategory.findMany({
        orderBy: { displayOrder: 'asc' },
      }),
      prisma.menuItem.findMany({
        where: { available: true },
        include: { category: true },
      }),
      prisma.burgerOption.findMany({
        where: { available: true },
      }),
    ]);

    return {
      categories: categories as MenuCategoryDto[],
      items: items as MenuItemDto[],
      burgerOptions: burgerOptions as BurgerOptionDto[],
    };
  }

  async getMenuCategories(): Promise<MenuCategoryDto[]> {
    const categories = await prisma.menuCategory.findMany({
      orderBy: { displayOrder: 'asc' },
    });
    return categories as MenuCategoryDto[];
  }

  async getMenuItemById(id: string): Promise<MenuItemDto | null> {
    const item = await prisma.menuItem.findUnique({
      where: { id },
      include: { category: true },
    });
    return item as MenuItemDto | null;
  }

  async getBurgerOptions(): Promise<BurgerOptionDto[]> {
    const options = await prisma.burgerOption.findMany({
      where: { available: true },
      orderBy: [{ optionType: 'asc' }, { name: 'asc' }],
    });
    return options as BurgerOptionDto[];
  }
}

export default new MenuService();

// Made with Bob
