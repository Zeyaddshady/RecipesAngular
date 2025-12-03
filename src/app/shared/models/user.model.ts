export interface MealSlot {
  breakfast?: number | null;
  lunch?: number | null;
  dinner?: number | null;
  snacks?: number | null;
}

export type Weekday =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  bio?: string;

  followers: number[];
  following: number[];
  savedRecipeIds: number[];
  postedRecipeIds: number[];
  mealPlan: Record<Weekday, MealSlot>;
}

