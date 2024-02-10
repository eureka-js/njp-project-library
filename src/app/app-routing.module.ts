import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { RegisterModule } from './register/register.module';
import { authGuard } from './shared/guards/auth.guard';
import { AdminModule } from './admin/admin.module';
import { adminGuard } from './shared/guards/admin-guard';
import { UserModule } from './user/user.module';


const routes: Routes = [
  {path: '', loadChildren: () => BookModule, canActivate: [authGuard]},
  {path: 'login', loadChildren: () => AuthModule},
  {path: 'register', loadChildren: () => RegisterModule},
  {path: 'user', loadChildren: () => UserModule, canActivate: [authGuard]},
  {path: 'admin', loadChildren: () => AdminModule, canActivate: [adminGuard]},
  {path: '**', redirectTo: ''}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
