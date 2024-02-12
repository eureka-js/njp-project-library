import { Component, inject } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookService } from 'src/app/shared/services/book.service';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  users: User[] = [];
  usersSub!: Subscription;
  books: Book[] = [];
  booksSub!: Subscription;

  constructor(private userService: UserService, private authService: AuthService, private bookService: BookService) {};

  ngOnInit() {
    this.usersSub = this.userService.getUsers().subscribe((res: User[]) => this.users = res);
    this.booksSub = this.bookService.getBooksSubject().subscribe((res: Book[]) => this.books = res);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.booksSub.unsubscribe();
  }

  isUserOwingBooks(i: number) {
    return this.books.some(b => b.checkout?.membership.idUser === this.users[i].id);
  }

  changeMemTypeById(id: number,  memType: string) {
    this.userService.changeMemTypeById(id, memType).subscribe((res) => {
      let user = this.authService.getUser()!;
      if (id === user.id) {
        this.authService.login({ username: user.username, password: user.hashedPass }, "/");
      }
    });
  }

  onDelete(id: number) {
    this.userService.delUserById(id).subscribe(() => {
      if (id === this.authService.getUser()?.id) {
        this.authService.logout();
      }
    });
  }
}
