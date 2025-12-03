import { Injectable } from '@angular/core';
import { Recipe, Review } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private recipes: Recipe[] = [
    {
      id: 1,
      title: 'Chicken Alfredo',
      description: 'Creamy pasta with grilled chicken.',
      image: 'assets/recipes/alfredo.jpg',
      rating: 0,
      ingredients: ['Chicken breast', 'Pasta', 'Cream', 'Parmesan cheese', 'Garlic'],
      steps: [
        'Boil the pasta.',
        'Cook the chicken.',
        'Prepare the sauce.',
        'Mix everything.',
        'Serve hot.',
      ],
      authorId: 1,
      createdAt: new Date('2024-01-10'),
      tags: ['pasta', 'chicken'],
      cuisine: 'Italian',
      cookTimeMinutes: 35,
      calories: 650,
      likes: 3,
      likedByUserIds: [1],
      reviews: [],
    },
    {
      id: 2,
      title: 'Avocado Toast Deluxe',
      description: 'Crunchy toast topped with creamy avocado and poached egg.',
      image: 'assets/recipes/avocado-toast.jpg',
      rating: 0,
      ingredients: ['Sourdough bread', 'Avocado', 'Egg', 'Lemon', 'Chili flakes'],
      steps: [
        'Toast the bread.',
        'Mash avocado with lemon and seasoning.',
        'Poach the egg.',
        'Assemble and garnish.',
      ],
      authorId: 1,
      createdAt: new Date('2024-02-05'),
      tags: ['breakfast', 'quick'],
      cuisine: 'Brunch',
      cookTimeMinutes: 15,
      calories: 320,
      likes: 5,
      likedByUserIds: [1],
      reviews: [],
    },
  ];

  getAll(): Recipe[] {
    return this.recipes;
  }

  getById(id: number): Recipe | undefined {
    return this.recipes.find((r) => r.id === id);
  }

  getByAuthor(authorId: number): Recipe[] {
    return this.recipes.filter((r) => r.authorId === authorId);
  }

  getByIds(ids: number[]): Recipe[] {
    return this.recipes.filter((r) => ids.includes(r.id));
  }

  createRecipe(data: Omit<Recipe, 'id' | 'createdAt' | 'likes' | 'likedByUserIds' | 'reviews'>): Recipe {
    const nextId = this.recipes.length
      ? Math.max(...this.recipes.map((r) => r.id)) + 1
      : 1;
    const recipe: Recipe = {
      ...data,
      id: nextId,
      createdAt: new Date(),
      likes: 0,
      likedByUserIds: [],
      reviews: [],
    };
    this.recipes.unshift(recipe);
    return recipe;
  }

  toggleLike(recipeId: number, userId: number): Recipe | undefined {
    const recipe = this.getById(recipeId);
    if (!recipe) return;

    const idx = recipe.likedByUserIds.indexOf(userId);
    if (idx === -1) {
      recipe.likedByUserIds.push(userId);
      recipe.likes += 1;
    } else {
      recipe.likedByUserIds.splice(idx, 1);
      recipe.likes = Math.max(0, recipe.likes - 1);
    }
    return recipe;
  }

  addReview(recipeId: number, payload: Omit<Review, 'id' | 'createdAt'>): Recipe | undefined {
    const recipe = this.getById(recipeId);
    if (!recipe) return;

    const nextId = recipe.reviews.length
      ? Math.max(...recipe.reviews.map((r) => r.id)) + 1
      : 1;
    const review: Review = {
      ...payload,
      id: nextId,
      createdAt: new Date(),
    };
    recipe.reviews.unshift(review);

    const totalRating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
    recipe.rating = Number((totalRating / recipe.reviews.length).toFixed(1));
    return recipe;
  }

  rateRecipe(recipeId: number, userId: number, userName: string, rating: number): Recipe | undefined {
    const recipe = this.getById(recipeId);
    if (!recipe) return;

    const existing = recipe.reviews.find((r) => r.userId === userId);
    if (existing) {
      existing.rating = rating;
    } else {
      const nextId = recipe.reviews.length
        ? Math.max(...recipe.reviews.map((r) => r.id)) + 1
        : 1;
      const review: Review = {
        id: nextId,
        userId,
        userName,
        rating,
        text: '',
        createdAt: new Date(),
      };
      recipe.reviews.push(review);
    }

    const totalRating = recipe.reviews.reduce((sum, r) => sum + r.rating, 0);
    recipe.rating = Number((totalRating / recipe.reviews.length).toFixed(1));
    return recipe;
  }

  search(term: string, maxCookTime?: number, tag?: string): Recipe[] {
    const q = term.toLowerCase();
    return this.recipes.filter((r) => {
      const matchesTerm =
        !term ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.ingredients.some((i) => i.toLowerCase().includes(q)) ||
        r.tags.some((t) => t.toLowerCase().includes(q));

      const matchesCookTime =
        maxCookTime == null || (r.cookTimeMinutes ?? Infinity) <= maxCookTime;

      const matchesTag = !tag || r.tags.includes(tag);

      return matchesTerm && matchesCookTime && matchesTag;
    });
  }
}
