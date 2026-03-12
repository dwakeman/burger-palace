import api from './api';
import { MenuDto, BurgerOptionDto } from '@burger-palace/shared';

export const menuService = {
  async getFullMenu(): Promise<MenuDto> {
    const response = await api.get<{ status: string; data: MenuDto }>('/menu');
    return response.data.data;
  },

  async getBurgerOptions(): Promise<BurgerOptionDto[]> {
    const response = await api.get<{ status: string; data: BurgerOptionDto[] }>('/menu/burger-options');
    return response.data.data;
  },
};

// Made with Bob
