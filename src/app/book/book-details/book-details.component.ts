import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-book-details',
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  book?: Book;
  booksSub!: Subscription;

  constructor(private route: ActivatedRoute, private bookService: BookService
    , private authService: AuthService) {}

  ngOnInit() {
    this.booksSub = this.bookService.getBooksSubject().subscribe((res) =>
      this.book = res.find(b => b.title === this.route.snapshot.params['title']));
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }

  onLend(bookId: number) {
    this.bookService.lendBookById(bookId, this.authService.getUser()?.id);
  };
}
