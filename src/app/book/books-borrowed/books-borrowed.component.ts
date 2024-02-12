import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-books-borrowed',
  templateUrl: './books-borrowed.component.html',
  styleUrls: ['./books-borrowed.component.css']
})
export class BooksBorrowedComponent {
  books: Book[] = [];
  booksSub!: Subscription;

  constructor(private bookService: BookService, private authService: AuthService) {}

  
  ngOnInit() {
    this.booksSub = this.bookService.getBooksSubject().subscribe((res) => this.books = res);
  }

  getUser() {
    return this.authService.getUser();
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }

  onReturn(bookId: number) {
    this.bookService.returnBookById(bookId);
  }
}
