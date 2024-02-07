import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-books',
  templateUrl: './books.component.html',
  styleUrls: ['./books.component.css']
})
export class BooksComponent {
  books: Book[] = [];
  booksSub!: Subscription;

  constructor(private bookService: BookService) {};

  ngOnInit() {
    this.booksSub = this.bookService.getBooks().subscribe((res) => this.books = res);
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }
}
