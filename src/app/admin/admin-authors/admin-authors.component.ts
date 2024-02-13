import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Author } from 'src/app/shared/models/author.model';
import { AuthorService } from 'src/app/shared/services/author.service';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-admin-authors',
  templateUrl: './admin-authors.component.html',
  styleUrl: './admin-authors.component.css'
})
export class AdminAuthorsComponent {
  authors!: Author[];
  authorsSub!: Subscription;
  message!: string[];
  authorsForm!: FormGroup[];

  constructor(private authorService: AuthorService, private bookService: BookService) {}


  ngOnInit() {
    this.authorsSub = this.authorService.getAuthorsSubject().subscribe(res => {
      this.authors = res;

      this.message = [];
      this.authorsForm = [];
      
      this.authors.forEach(a => {
        this.message?.push("");

        this.authorsForm.push(new FormGroup({
          "name": new FormControl(a.name
            , [Validators.required, this.isValueChangedValidator(a.name)]),
          "surname": new FormControl(a.surname
            , [Validators.required, this.isValueChangedValidator(a.surname)])
        }, {validators: [(form: FormGroup) => Object.values(form.controls).some(c => 
            c.status === "VALID") ? null : { "allControlsInvalid": true }] as ValidatorFn[] }
        ));
      });
    });
  }

  ngOnDestroy() {
    this.authorsSub.unsubscribe();
  }

  isValueChangedValidator(userAtr?: string) { 
    return (control: AbstractControl) => control.value === userAtr ? { "valueMatch": true } : null;
  }

  onUpdate(i: number) {
    let newAuthor = new Author(
      this.authors[i].id,
      this.authorsForm[i].value.name,
      this.authorsForm[i].value.surname
    )

    this.authorService.updateAuthor(newAuthor).subscribe((res: any) => {
      if (res.status === "NOT OK") {
        this.message[i] = res.description;
      } else if (res.status === "OK") {
        this.bookService.updateAuthorLocally(newAuthor);
        this.message[i] = "Successful update";
      }
    });
  }
}
