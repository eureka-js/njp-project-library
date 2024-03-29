import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { SharedModule } from './shared/shared.module';
import { BookModule } from './book/book.module';
import { AuthModule } from './auth/auth.module';
import { RegisterModule } from './register/register.module';
import { AuthService } from './shared/services/auth.service';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';
import { BookService } from './shared/services/book.service';
import { UserService } from './shared/services/user.service';
import { UserModule } from './user/user.module';
import { AuthorService } from './shared/services/author.service';
import { DatePipe } from '@angular/common';
import { GenreService } from './shared/services/genre.service';


@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    NgbModule,
    AppRoutingModule,
    HttpClientModule,
    SharedModule,
    BookModule,
    AuthModule,
    RegisterModule,
    UserModule],
  providers: [
    AuthService,
    UserService,
    BookService,
    GenreService,
    AuthorService,
    DatePipe,
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
