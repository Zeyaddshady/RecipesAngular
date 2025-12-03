import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { AuthService } from '../../shared/services/auth.service';
import { RecipeService } from '../../shared/services/recipe';
import { Recipe } from '../../shared/models/recipe.model';
import { RecipeCardComponent } from '../../components/recipe-card/recipe-card';
import { User } from '../../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, RecipeCardComponent],
  templateUrl: './user-profile.html',
  styleUrl: './user-profile.css',
})
export class UserProfileComponent implements OnInit, OnDestroy {
  postedRecipes: Recipe[] = [];
  savedRecipes: Recipe[] = [];
  viewingUser?: User;
  isOwnProfile = false;
  isFollowing = false;
  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    this.sub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const user = this.auth.getUserById(Number(idParam));
        this.setViewingUser(user ?? undefined);
      } else {
        this.setViewingUser(this.auth.currentUser ?? undefined);
      }
    });
  }

  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  toggleFollow(): void {
    if (!this.viewingUser || !this.auth.currentUser || this.isOwnProfile) return;
    if (this.isFollowing) {
      this.auth.unfollow(this.viewingUser.id);
    } else {
      this.auth.follow(this.viewingUser.id);
    }
    this.isFollowing = this.auth.isFollowing(this.viewingUser.id);
  }

  private setViewingUser(user: User | undefined): void {
    this.viewingUser = user;
    this.isOwnProfile =
      !!user && !!this.auth.currentUser && user.id === this.auth.currentUser.id;

    if (!user) {
      this.postedRecipes = [];
      this.savedRecipes = [];
      this.isFollowing = false;
      return;
    }

    this.postedRecipes = this.recipeService.getByAuthor(user.id);
    this.savedRecipes = this.isOwnProfile
      ? this.recipeService.getByIds(user.savedRecipeIds)
      : [];
    this.isFollowing = !this.isOwnProfile && this.auth.isFollowing(user.id);
  }
}
