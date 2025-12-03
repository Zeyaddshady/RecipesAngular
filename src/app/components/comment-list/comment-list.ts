import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';

@Component({
  selector: 'app-comment-list',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comment-list.html',
  styleUrl: './comment-list.css',
})
export class CommentListComponent {
  @Input() comments: { text: string; date: Date; userName?: string }[] = [];
}
