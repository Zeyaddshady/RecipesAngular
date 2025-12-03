import { Injectable } from '@angular/core';
import { MealSlot, User, Weekday } from '../models/user.model';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private users: User[] = [
    {
      id: 1,
      name: 'Demo Chef',
      email: 'chef@example.com',
      password: 'password',
      avatarUrl: 'https://i.pravatar.cc/150?img=5',
      bio: 'Loves sharing cozy home recipes.',
      followers: [],
      following: [],
      savedRecipeIds: [],
      postedRecipeIds: [1, 2],
      mealPlan: this.emptyMealPlan(),
    },
  ];

  private _currentUser: User | null = this.users[0];

  get currentUser(): User | null {
    return this._currentUser;
  }

  get allUsers(): User[] {
    return this.users;
  }

  login(email: string, password: string): boolean {
    const user = this.users.find((u) => u.email === email && u.password === password);
    this._currentUser = user ?? null;
    return !!user;
  }

  register(name: string, email: string, password: string): boolean {
    const exists = this.users.some((u) => u.email === email);
    if (exists) {
      return false;
    }

    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
      password,
      followers: [],
      following: [],
      savedRecipeIds: [],
      postedRecipeIds: [],
      mealPlan: this.emptyMealPlan(),
    };
    this.users.push(newUser);
    this._currentUser = newUser;
    return true;
  }

  logout(): void {
    this._currentUser = null;
  }

  follow(userId: number): void {
    if (!this._currentUser || this._currentUser.id === userId) return;
    const target = this.users.find((u) => u.id === userId);
    if (!target) return;

    if (!this._currentUser.following.includes(userId)) {
      this._currentUser.following.push(userId);
    }

    if (!target.followers.includes(this._currentUser.id)) {
      target.followers.push(this._currentUser.id);
    }
  }

  unfollow(userId: number): void {
    if (!this._currentUser || this._currentUser.id === userId) return;
    const target = this.users.find((u) => u.id === userId);
    if (!target) return;

    this._currentUser.following = this._currentUser.following.filter(
      (id) => id !== userId,
    );
    target.followers = target.followers.filter((id) => id !== this._currentUser!.id);
  }

  isFollowing(userId: number): boolean {
    return !!this._currentUser?.following.includes(userId);
  }

  toggleSaveRecipe(recipeId: number): void {
    if (!this._currentUser) return;
    const list = this._currentUser.savedRecipeIds;
    const idx = list.indexOf(recipeId);
    if (idx === -1) {
      list.push(recipeId);
    } else {
      list.splice(idx, 1);
    }
  }

  hasSavedRecipe(recipeId: number): boolean {
    return !!this._currentUser?.savedRecipeIds.includes(recipeId);
  }

  addPostedRecipe(recipeId: number): void {
    if (!this._currentUser) return;
    if (!this._currentUser.postedRecipeIds.includes(recipeId)) {
      this._currentUser.postedRecipeIds.push(recipeId);
    }
  }

  setMealPlan(day: Weekday, slot: MealSlot): void {
    if (!this._currentUser) return;
    this._currentUser.mealPlan[day] = slot;
  }

  getUserById(id: number): User | undefined {
    return this.users.find((u) => u.id === id);
  }

  private emptyMealPlan(): Record<Weekday, MealSlot> {
    const base: MealSlot = { breakfast: null, lunch: null, dinner: null, snacks: null };
    return {
      monday: { ...base },
      tuesday: { ...base },
      wednesday: { ...base },
      thursday: { ...base },
      friday: { ...base },
      saturday: { ...base },
      sunday: { ...base },
    };
  }
}
