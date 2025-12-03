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
  followers: User[] = [];
  following: User[] = [];
  viewingUser?: User;
  isOwnProfile = false;
  isFollowing = false;
  activeTab: 'recipes' | 'followers' | 'following' | 'saved' = 'recipes';
  private sub?: Subscription;

  constructor(
    public auth: AuthService,
    private recipeService: RecipeService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    // This handles navigation to /profile/:id
    this.sub = this.route.paramMap.subscribe((params) => {
      const idParam = params.get('id');
      if (idParam) {
        const user = this.auth.getUserById(Number(idParam));
        this.setViewingUser(user ?? undefined);
      }
    });

    // This handles navigation to the base /profile route for the current user
    if (!this.route.snapshot.paramMap.has('id')) {
      this.setViewingUser(this.auth.currentUser ?? undefined);
    }
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

  deleteRecipe(recipeId: number): void {
    // We only allow deleting from one's own profile
    if (!this.isOwnProfile) return;

    // Assuming RecipeService has a delete method
    this.recipeService.delete(recipeId);
    // Refresh the list of posted recipes
    this.postedRecipes = this.recipeService.getByAuthor(this.viewingUser!.id);
  }
  private setViewingUser(user: User | undefined): void {
    this.viewingUser = user;
    this.isOwnProfile =
      !!user && !!this.auth.currentUser && user.id === this.auth.currentUser.id;

    if (!user) {
      this.postedRecipes = [];
      this.savedRecipes = [];
      this.isFollowing = false;
      this.followers = [];
      this.following = [];
      return;
    }

    this.postedRecipes = this.recipeService.getByAuthor(user.id);
    this.savedRecipes = this.isOwnProfile
      ? this.recipeService.getByIds(user.savedRecipeIds)
      : [];
    this.isFollowing = !this.isOwnProfile && this.auth.isFollowing(user.id);

    this.followers = this.auth.getFollowers(user.id);
    this.following = this.auth.getFollowing(user.id);
  }
}
