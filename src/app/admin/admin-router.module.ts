import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { adminGuard } from '../shared/guards/admin-guard';



const routes: Routes = [
  {path: '', component:  AdminBooksComponent, canActivate: [adminGuard]},
  {path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard]}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
