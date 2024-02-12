import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminRoutingModule } from './admin-router.module';
import { SharedModule } from '../shared/shared.module';


@NgModule({
  declarations: [
    AdminBooksComponent,
    AdminUsersComponent
  ],
  imports: [
    CommonModule,
    AdminRoutingModule,
    SharedModule
  ]
})
export class AdminModule { }
