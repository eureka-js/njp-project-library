import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BooksComponent } from './books/books.component';
import { BookDonateComponent } from './book-donate/book-donate.component';
import { BooksBorrowedComponent } from './books-borrowed/books-borrowed.component';
import { AdminModule } from '../admin/admin.module';
import { adminGuard } from '../shared/guards/admin-guard';


const routes: Routes = [
  {path: '', component: BooksComponent},
  {path: 'donate', component: BookDonateComponent},
  {path: 'books-borrowed', component: BooksBorrowedComponent},
  {path: 'admin', loadChildren: () => AdminModule, canActivate: [adminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BookRoutingModule { }
