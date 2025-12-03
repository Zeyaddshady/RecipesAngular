import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../shared/services/auth.service';
import { RecipeService } from '../../shared/services/recipe';
import { MealSlot, Weekday } from '../../shared/models/user.model';
import { Recipe } from '../../shared/models/recipe.model';

@Component({
  selector: 'app-meal-planner',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meal-planner.html',
  styleUrl: './meal-planner.css',
})
export class MealPlannerComponent {
  days: Weekday[] = [
    'monday',
    'tuesday',
    'wednesday',
    'thursday',
    'friday',
    'saturday',
    'sunday',
  ];

  allRecipes: Recipe[] = [];

  constructor(public auth: AuthService, private recipeService: RecipeService) {
    this.allRecipes = this.recipeService.getAll();
  }

  getMealSlot(day: Weekday): MealSlot | null {
    return this.auth.currentUser?.mealPlan[day] ?? null;
  }

  updateSlot(day: Weekday, field: keyof MealSlot, recipeId: number | null): void {
    const current = this.getMealSlot(day) ?? {
      breakfast: null,
      lunch: null,
      dinner: null,
      snacks: null,
    };
    const next: MealSlot = { ...current, [field]: recipeId };
    this.auth.setMealPlan(day, next);
  }

  recipeOptions(): Recipe[] {
    return this.allRecipes;
  }

  shoppingList(): string[] {
    const user = this.auth.currentUser;
    if (!user) return [];

    const ingredientSet = new Set<string>();
    this.days.forEach((d) => {
      const slot = user.mealPlan[d];
      ['breakfast', 'lunch', 'dinner', 'snacks'].forEach((key) => {
        const id = (slot as any)[key] as number | null | undefined;
        if (id) {
          const recipe = this.recipeService.getById(id);
          recipe?.ingredients.forEach((ing) => ingredientSet.add(ing));
        }
      });
    });

    return Array.from(ingredientSet);
  }
}


