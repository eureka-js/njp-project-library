import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { User } from 'src/app/shared/models/user.model';
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

  constructor(private userService: UserService, private bookService: BookService) {};

  ngOnInit() {
    console.log("Admin-users");
    this.usersSub = this.userService.getUsers().subscribe((res: User[]) => {
      this.users = res;
      console.log(this.users);
    });
    this.booksSub = this.bookService.getBooks().subscribe((res: Book[]) => this.books = res);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
    this.booksSub.unsubscribe();
  }

  isUserOwingBooks(i: number) {
    return this.books.some(b => b.checkout?.membership.idUser === this.users[i].id);
  }

  changeMemTypeById(id: number,  memType: string) {
    this.userService.changeMemTypeById(id, memType);
  }

  onDelete(id: number) {
    console.log("onDelete");
    this.userService.delUserById(id);
  }
}
