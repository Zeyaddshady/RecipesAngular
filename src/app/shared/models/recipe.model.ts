export interface Review {
  id: number;
  userId: number;
  userName: string;
  rating: number;
  text: string;
  createdAt: Date;
}

export interface RecipeComment {
  id: number;
  userId: number;
  userName: string;
  text: string;
  createdAt: Date;
}

export interface Recipe {
  id: number;
  title: string;
  description: string;
  image: string;
  rating: number;
  ingredients: string[];
  steps: string[];
  authorId: number;
  createdAt: Date;
  tags: string[];

  cuisine?: string;
  cookTimeMinutes?: number;
  calories?: number;

  likes: number;
  likedByUserIds: number[];
  reviews: Review[];
  comments: RecipeComment[];
}


