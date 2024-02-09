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
  borrowedBooks: Book[] = [];
  borrowedBooksSub!: Subscription;

  constructor(private bookService: BookService, private authService: AuthService) {};

  ngOnInit() {
    this.borrowedBooksSub = this.bookService.getBooks().subscribe((res) => 
      this.borrowedBooks = res.filter(b => b.checkout?.membership.idUser === this.authService.getUser()?.id));
  }

  ngOnDestroy() {
    this.borrowedBooksSub.unsubscribe();
  }

  onReturn(bookId: number) {
    this.bookService.returnBookById(bookId);
  }
}
