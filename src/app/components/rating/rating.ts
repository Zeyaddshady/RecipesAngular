import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './rating.html',
  styleUrl: './rating.css',
})
export class RatingComponent {
  @Input() score: number = 0;
  @Output() scoreChange = new EventEmitter<number>();

  stars = [1, 2, 3, 4, 5];

  setRating(value: number) {
    this.score = value;
    this.scoreChange.emit(this.score);
  }
}
