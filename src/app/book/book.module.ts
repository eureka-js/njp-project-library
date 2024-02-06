import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';


@NgModule({
  declarations: [
    BooksComponent,
    BookDetailComponent,
  ],
  imports: [
    CommonModule,
    SharedModule,
    BookRoutingModule
  ]
})
export class BookModule { }
