import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-comment-input',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comment-input.html',
  styleUrl: './comment-input.css',
})
export class CommentInputComponent {
  commentText: string = '';

  @Output() submitComment = new EventEmitter<string>();

  onSubmit() {
    if (!this.commentText.trim()) return;
    this.submitComment.emit(this.commentText);
    this.commentText = '';
  }
}
