import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent {
  books: Book[] = [];
  booksSub!: Subscription;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.booksSub = this.bookService.getBooksSubject().subscribe((res: Book[]) => this.books = res);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }

  onRemove(id: number) {
    this.bookService.delBookById(id);
  }
}
