import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthModule } from './auth/auth.module';
import { BookModule } from './book/book.module';
import { RegisterModule } from './register/register.module';
import { authGuard } from './shared/auth.guard';


const routes: Routes = [
  {path: 'login', loadChildren: () => AuthModule},
  {path: 'register', loadChildren: () => RegisterModule},
  {path: '**', loadChildren: () => BookModule},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
