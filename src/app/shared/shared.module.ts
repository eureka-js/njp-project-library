import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NavbarComponent } from './navbar/navbar.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MainNavbarComponent } from './main-navbar/main-navbar.component';
import { MainHeaderComponent } from './main-header/main-header.component';
import { AdminNavbarComponent } from './admin-navbar/admin-navbar.component';
import { AdminHeaderComponent } from './admin-header/admin-header.component';


@NgModule({
  declarations: [
    NavbarComponent,
    AdminNavbarComponent,
    AdminHeaderComponent,
    MainNavbarComponent,
    MainHeaderComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ],
  exports: [
    CommonModule,
    AdminNavbarComponent,
    AdminHeaderComponent,
    HeaderComponent,
    FooterComponent,
    MainNavbarComponent,
    MainHeaderComponent
]
})
export class SharedModule { }
