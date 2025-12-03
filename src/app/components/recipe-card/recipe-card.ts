import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Recipe } from '../../shared/models/recipe.model';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-recipe-card',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './recipe-card.html',
  styleUrl: './recipe-card.css',
})
export class RecipeCardComponent implements OnChanges {
  @Input() recipe!: Recipe;
  authorName = 'Unknown chef';
  authorId?: number;

  constructor(private auth: AuthService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if ('recipe' in changes && this.recipe) {
      const author = this.auth.getUserById(this.recipe.authorId);
      this.authorName = author?.name ?? 'Unknown chef';
      this.authorId = author?.id;
    }
  }
}
