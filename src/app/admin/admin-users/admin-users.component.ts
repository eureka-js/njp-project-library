import { Component } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/shared/models/user.model';
import { UserService } from 'src/app/shared/services/user.service';

@Component({
  selector: 'app-admin-users',
  templateUrl: './admin-users.component.html',
  styleUrl: './admin-users.component.css'
})
export class AdminUsersComponent {
  users: User[] = [];
  usersSub!: Subscription;

  constructor(private userService: UserService) {};

  ngOnInit() {
    this.usersSub = this.userService.getUsers().subscribe((res) => this.users = res);
  }

  ngOnDestroy() {
    this.usersSub.unsubscribe();
  }

  changeMemTypeById(id: number,  memType: string) {
    this.userService.changeMemTypeById(id, memType);
  }

  onDelete(id: number) {
    this.userService.delUserById(id);
  }
}
