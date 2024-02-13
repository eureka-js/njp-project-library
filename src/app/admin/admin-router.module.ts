import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { adminGuard } from '../shared/guards/admin-guard';
import { AdminBooksComponent } from './admin-books/admin-books.component';
import { AdminUsersComponent } from './admin-users/admin-users.component';
import { AdminAuthorsComponent } from './admin-authors/admin-authors.component';
import { AdminGenresComponent } from './admin-genres/admin-genres.component';


const routes: Routes = [
  {path: '', component: AdminBooksComponent, canActivate: [adminGuard]},
  {path: 'admin-authors', component: AdminAuthorsComponent, canActivate: [adminGuard]},
  {path: 'admin-genres', component: AdminGenresComponent, canActivate: [adminGuard]},
  {path: 'admin-users', component: AdminUsersComponent, canActivate: [adminGuard]},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
