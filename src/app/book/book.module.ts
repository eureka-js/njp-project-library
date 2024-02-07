import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BooksComponent } from './books/books.component';
import { BookDetailComponent } from './book-detail/book-detail.component';
import { SharedModule } from '../shared/shared.module';
import { BookRoutingModule } from './book-routing.module';
import { BookDonateComponent } from './book-donate/book-donate.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    BooksComponent,
    BookDetailComponent,
    BookDonateComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    BookRoutingModule
  ]
})
export class BookModule { }
