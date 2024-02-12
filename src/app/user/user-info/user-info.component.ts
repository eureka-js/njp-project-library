import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Book } from 'src/app/shared/models/book.model';
import { User } from 'src/app/shared/models/user.model';
import { AuthService } from 'src/app/shared/services/auth.service';
import { BookService } from 'src/app/shared/services/book.service';
import { UserService } from 'src/app/shared/services/user.service';


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrl: './user-info.component.css'
})
export class UserInfoComponent {
  user?: User;
  userSub?: Subscription;
  isUserOwingBooks?: boolean;
  booksSub?: Subscription;
  message: string = "";
  userForm!: FormGroup;
  
  constructor(private authService: AuthService, private bookService: BookService
    , private userService: UserService, private router: Router) {}

  ngOnInit() {
    this.user = this.authService.getUser();

    this.userSub = this.authService.getUserSubject().subscribe((res?: User) => {
      this.user = res;
      
      this.userForm = new FormGroup({
        "username": new FormControl(this.user?.username
          , [Validators.required, this.isValueChangedValidator(this.user?.username)]),
        "password": new FormControl("", [Validators.required, () => () => true]),
        "passRepeat": new FormControl("", [Validators.required, () => () => true]),
        "name": new FormControl(this.user?.name
          , [Validators.required, this.isValueChangedValidator(this.user?.name)]),
        "surname": new FormControl(this.user?.surname
          , [Validators.required, this.isValueChangedValidator(this.user?.surname)]),
        "email": new FormControl(this.user?.email
          , [Validators.required, this.isValueChangedValidator(this.user?.email)])
      }, {validators: [(form: FormGroup) => Object.values(form.controls).some(c => 
          c.status === "VALID") ? null : { "allControlsInvalid": true }] as ValidatorFn[] }
      );
    });

    this.booksSub = this.bookService.getBooksSubject()?.subscribe((res: Book[]) =>
      this.isUserOwingBooks = res.some(b => b.checkout?.membership.idUser === this.user?.id));
  }

  ngOnDestroy() {
    this.userSub?.unsubscribe();
  }

  isValueChangedValidator(userAtr?: string) { 
    return (control: AbstractControl) => control.value === userAtr ? { "valueMatch": true } : null;
  }

  onUpdate() {
    if (this.userForm.value.password != this.userForm.value.passRepeat) {
      this.message = "Passwords must match";
    } else if (!new RegExp('^[a-zA-Z0-9_\.-]+@[a-zA-Z0-9-]+\.[a-zA-Z]{2,}$').test(this.userForm.value.email)) {
      this.message = "E-mail format is invalid";
    } else {
      this.authService.updateUser(new User(
        this.user!.id,
        this.userForm.value.username,
        this.userForm.value.name,
        this.userForm.value.surname,
        this.userForm.value.email,
        this.user!.memType,
        this.userForm.value.password || this.user!.hashedPass
      )).subscribe((res: any) => res.status === "OK"
        ? this.authService.login(res.loginVals, this.router.url) : this.message = res.description);
    }
  }

  onDelete() {
    this.userService.delUserById(this.user!.id).subscribe((res) => {
      if (res.status === "OK") {
        this.authService.logout();
      }
    });
  }
}
