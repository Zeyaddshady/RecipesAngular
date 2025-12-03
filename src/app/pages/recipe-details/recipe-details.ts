import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RecipeService } from '../../shared/services/recipe';
import { Recipe, Review } from '../../shared/models/recipe.model';
import { RatingComponent } from '../../components/rating/rating';
import { CommentInputComponent } from '../../components/comment-input/comment-input';
import { CommentListComponent } from '../../components/comment-list/comment-list';
import { AuthService } from '../../shared/services/auth.service';
import { RouterLink } from '@angular/router';
import { User } from '../../shared/models/user.model';

@Component({
  selector: 'app-recipe-details',
  standalone: true,
  imports: [
    CommonModule,
    RatingComponent,
    CommentInputComponent,
    CommentListComponent,
    FormsModule,
    RouterLink,
  ],
  templateUrl: './recipe-details.html',
  styleUrl: './recipe-details.css',
})
export class RecipeDetailsComponent implements OnInit {
  recipe!: Recipe;
  isSaved = false;
  author?: User;
  comments: { text: string; date: Date; userName?: string }[] = [];
  reviews: Review[] = [];
  newReviewText = '';
  newReviewRating = 5;

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
    // prepare comments for the comment-list component
    this.comments = (this.recipe.comments ?? []).map(c => ({ text: c.text, date: c.createdAt, userName: c.userName }));
    // prepare reviews for display
    this.reviews = this.recipe.reviews ?? [];
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

  onSubmitComment(text: string): void {
    const user = this.auth.currentUser;
    if (!user) return;
    this.recipe = this.recipeService.addComment(this.recipe.id, { userId: user.id, userName: user.name, text }) ?? this.recipe;
    this.comments = (this.recipe.comments ?? []).map(c => ({ text: c.text, date: c.createdAt, userName: c.userName }));
  }

  submitReview(): void {
    const user = this.auth.currentUser;
    if (!user) return;
    const payload = { userId: user.id, userName: user.name, rating: this.newReviewRating, text: this.newReviewText };
    this.recipe = this.recipeService.addReview(this.recipe.id, payload) ?? this.recipe;
    this.reviews = this.recipe.reviews ?? [];
    this.newReviewText = '';
    this.newReviewRating = 5;
  }
}
