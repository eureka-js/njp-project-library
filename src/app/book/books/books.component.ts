import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
  books: Book[] = [];
  booksSub!: Subscription;
  lendButtText!: string;

  constructor(private bookService: BookService, private authService: AuthService) {}

  
  ngOnInit() {
    this.booksSub = this.bookService.getBooksSubject().subscribe((res) => this.books = res);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }

  onLend(bookId: number) {
    this.bookService.lendBookById(bookId, this.authService.getUser()?.id);
  };
}
