import { Routes } from '@angular/router';
import { RecipeFeedComponent } from './pages/recipe-feed/recipe-feed';
import { RecipeDetailsComponent } from './pages/recipe-details/recipe-details';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { UserProfileComponent } from './pages/user-profile/user-profile';
import { RecipeCreateComponent } from './pages/recipe-create/recipe-create';
import { MealPlannerComponent } from './pages/meal-planner/meal-planner';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'feed', component: RecipeFeedComponent, canActivate: [authGuard] },
  { path: 'recipes/:id', component: RecipeDetailsComponent, canActivate: [authGuard] },
  { path: 'recipes/new', component: RecipeCreateComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'profile', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'users/:id', component: UserProfileComponent, canActivate: [authGuard] },
  { path: 'planner', component: MealPlannerComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: 'feed' },
];
