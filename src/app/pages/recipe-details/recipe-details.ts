import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { RecipeService } from '../../shared/services/recipe';
import { Recipe } from '../../shared/models/recipe.model';
import { RatingComponent } from '../../components/rating/rating';
import { AuthService } from '../../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent,
    RouterLink,
  ],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe!: Recipe;
  isSaved = false;
  author?: User;

  constructor(
    private route: ActivatedRoute,
    private recipeService: RecipeService,
    private auth: AuthService,
  ) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.recipe = this.recipeService.getById(id) ?? this.recipeService.getAll()[0];
    this.isSaved = this.auth.hasSavedRecipe(this.recipe.id);
    this.author = this.auth.getUserById(this.recipe.authorId) ?? undefined;
  }

  onRatingChanged(newRating: number) {
    const user = this.auth.currentUser;
    if (!user) {
      return;
    }
    this.recipe =
      this.recipeService.rateRecipe(this.recipe.id, user.id, user.name, newRating) ??
      this.recipe;
  }

  toggleLike(): void {
    const user = this.auth.currentUser;
    if (!user) return;
    this.recipe = this.recipeService.toggleLike(this.recipe.id, user.id) ?? this.recipe;
  }

  toggleSave(): void {
    this.auth.toggleSaveRecipe(this.recipe.id);
    this.isSaved = this.auth.hasSavedRecipe(this.recipe.id);
  }
}
