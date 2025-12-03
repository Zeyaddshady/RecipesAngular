import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recipe-create',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './recipe-create.html',
  styleUrl: './recipe-create.css',
})
export class RecipeCreateComponent {
  title = '';
  description = '';
  imageData: string | null = null;
  ingredientsText = '';
  stepsText = '';
  tagsText = '';
  cuisine = '';
  cookTimeMinutes?: number;
  calories?: number;
  imageError = '';

  errorMessage = '';

  constructor(
    private recipeService: RecipeService,
    private auth: AuthService,
    private router: Router,
  ) {}

  save(): void {
    this.errorMessage = '';
    const user = this.auth.currentUser;
    if (!user) {
      this.errorMessage = 'You need to be logged in to post a recipe.';
      return;
    }

    if (!this.title || !this.description || !this.ingredientsText || !this.stepsText) {
      this.errorMessage = 'Please fill in the title, description, ingredients and steps.';
      return;
    }

    const ingredients = this.ingredientsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const steps = this.stepsText
      .split('\n')
      .map((l) => l.trim())
      .filter(Boolean);

    const tags = this.tagsText
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const recipe = this.recipeService.createRecipe({
      title: this.title,
      description: this.description,
      image: this.imageData || 'assets/recipes/placeholder.jpg',
      ingredients,
      steps,
      authorId: user.id,
      tags,
      cuisine: this.cuisine || undefined,
      cookTimeMinutes: this.cookTimeMinutes,
      calories: this.calories,
      rating: 0,
    });

    this.auth.addPostedRecipe(recipe.id);
    this.router.navigate(['/recipes', recipe.id]);
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) {
      this.imageData = null;
      return;
    }

    if (!file.type.startsWith('image/')) {
      this.imageError = 'Please select an image file.';
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      this.imageData = reader.result as string;
      this.imageError = '';
    };
    reader.readAsDataURL(file);
  }
}


