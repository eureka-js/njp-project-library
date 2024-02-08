import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';



const routes: Routes = [
  {path: '', component: AdminBooksComponent},
  {path: 'admin-users', component: AdminUsersComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
