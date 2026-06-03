import ramen from '@/infrastructure/data/menu/ramen.json';
import beer from '@/infrastructure/data/menu/beer.json';
import japaneseSake from '@/infrastructure/data/menu/japanese-sake.json';
import wine from '@/infrastructure/data/menu/wine.json';
import softDrink from '@/infrastructure/data/menu/soft-drink.json';
import dessert from '@/infrastructure/data/menu/dessert.json';
import ippin from '@/infrastructure/data/menu/ippin.json';
import kaedama from '@/infrastructure/data/menu/kaedama.json';
import lunchSpecial from '@/infrastructure/data/menu/lunch-special.json';
import sunsetSpecial from '@/infrastructure/data/menu/sunset-special.json';
import dinnerSpecial from '@/infrastructure/data/menu/dinner-special.json';
import accessData from '@/infrastructure/data/access.json';
import {
  FoodDrinkItem,
  MenuItem,
  AccessInfo,
} from '../types';

// Combine all per-category menu JSON files
const menuData: MenuItem[] = [
  ...(ramen as MenuItem[]),
  ...(beer as MenuItem[]),
  ...(japaneseSake as MenuItem[]),
  ...(wine as MenuItem[]),
  ...(softDrink as MenuItem[]),
  ...(dessert as MenuItem[]),
  ...(ippin as MenuItem[]),
  ...(kaedama as MenuItem[]),
  ...(lunchSpecial as MenuItem[]),
  ...(sunsetSpecial as MenuItem[]),
  ...(dinnerSpecial as MenuItem[]),
];

export function getMenuItems(): MenuItem[] {
  return menuData;
}

export function getFoodDrinks(): FoodDrinkItem[] {
  return menuData
    .filter((m) => ['Beer', 'JapaneseSake', 'Ramen'].includes(m.category))
    .map((item) => {
      const category =
        item.category === 'Beer' ? 'beer' : item.category === 'JapaneseSake' ? 'sake' : 'ramen';
      const imageUrl =
        item.imageUrl && !item.imageUrl.includes('.DS_Store') ? item.imageUrl : '/placeholder.svg';
      return {
        id: item.id,
        name: item.name,
        category,
        highlight: (item.description || '').split('\n')[0] || '',
        imageUrl,
        description: item.description || '',
      } as FoodDrinkItem;
    });
}

export function getAccessInfo(): AccessInfo {
  return accessData;
}
