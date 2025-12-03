import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe';
import { Recipe } from '../../shared/models/recipe.model';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card';

@Component({
  selector: 'app-recipe-feed',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RecipeCardComponent],
  templateUrl: './recipe-feed.html',
  styleUrl: './recipe-feed.css',
})
export class RecipeFeedComponent {
  recipes: Recipe[] = [];
  filteredRecipes: Recipe[] = [];

  searchTerm = '';
  maxCookTime?: number;

  constructor(private recipeService: RecipeService) {
    this.recipes = this.recipeService.getAll();
    this.filteredRecipes = this.recipes;
  }

  onSearchChange(): void {
    this.filteredRecipes = this.recipeService.search(
      this.searchTerm,
      this.maxCookTime,
    );
  }
}
