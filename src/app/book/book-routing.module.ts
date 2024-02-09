import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './books/books.component';
import { BookDonateComponent } from './book-donate/book-donate.component';
import { BooksBorrowedComponent } from './books-borrowed/books-borrowed.component';


const routes: Routes = [
  {path: '', component: BooksComponent},
  {path: 'donate', component: BookDonateComponent},
  {path: 'books-borrowed', component: BooksBorrowedComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
