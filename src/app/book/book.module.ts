import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './books/books.component';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';
import { BookDonateComponent } from './book-donate/book-donate.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BooksBorrowedComponent } from './books-borrowed/books-borrowed.component';
import { FilterPipe } from '../shared/pipes/filter.pipe';


@NgModule({
  declarations: [
    BooksComponent,
    BookDonateComponent,
    BooksBorrowedComponent,
    FilterPipe
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BookRoutingModule,
  ]
})
export class BookModule { }
