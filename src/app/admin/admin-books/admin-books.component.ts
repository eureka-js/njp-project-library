import { DatePipe } from '@angular/common';
import { Component } from '@angular/core';
import { AbstractControl,  FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Author } from 'src/app/shared/models/author.model';
import { Book } from 'src/app/shared/models/book.model';
import { CheckoutDate } from 'src/app/shared/models/checkout-date.model';
import { Checkout } from 'src/app/shared/models/checkout.model';
import { Genre } from 'src/app/shared/models/genre.model';
import { Membership } from 'src/app/shared/models/membership.model';
import { BookService } from 'src/app/shared/services/book.service';


@Component({
  selector: 'app-admin-books',
  templateUrl: './admin-books.component.html',
  styleUrl: './admin-books.component.css'
})
export class AdminBooksComponent {
  dateFormat: string = "yyyy-MM-dd";
  books: Book[] = [];
  booksSub!: Subscription;
  message!: string[];
  booksForm!: FormGroup[];

  constructor(private bookService: BookService, private datePipe: DatePipe) {}

  ngOnInit() {
    this.booksSub = this.bookService.getBooksSubject().subscribe((res: Book[]) => {
      this.books = res;
      this.message = [];
      this.booksForm = [];
      this.books.forEach(b => {
        this.message.push("");

        let checkoutDate = b.checkout ? this.datePipe.transform(b.checkout.checkoutDate.checkoutDate, this.dateFormat) : "";
        let returnDate = b.checkout ? this.datePipe.transform(b.checkout.checkoutDate.returnDate, this.dateFormat) : "";
        this.booksForm.push(new FormGroup({
          "title": new FormControl(b.title
            , [Validators.required, this.isValueChangedValidator(b.title)]),
          "genre": new FormControl(b.genre.type
            , [Validators.required, this.isValueChangedValidator(b.genre.type)]),
          "authorName": new FormControl(b.author.name
            , [Validators.required, this.isValueChangedValidator(b.author.name)]),
          "authorSurname": new FormControl(b.author.surname
            , [Validators.required, this.isValueChangedValidator(b.author.surname)]),
          "checkoutDate": new FormControl(checkoutDate
            , [Validators.required, this.isValueChangedValidator(checkoutDate?.toString())]),
          "returnDate": new FormControl(returnDate
            , [Validators.required, this.isValueChangedValidator(returnDate?.toString())])
        }, {validators: [(form: FormGroup) => Object.values(form.controls).some(c => 
            c.status === "VALID") ? null : { "allControlsInvalid": true }] as ValidatorFn[] }
        ));
      })
    });
  }

  isValueChangedValidator(userAtr?: string) { 
    return (control: AbstractControl) => control.value === userAtr ? { "valueMatch": true } : null;
  }

  ngOnDestroy() {
    this.booksSub.unsubscribe();
  }

  onUpdate(i: number) {
    try {
      let book;
      if (this.books[i].checkout) {
        let checkDate: Date = new Date(this.booksForm[i].value.checkoutDate);
        let retDate: Date = new Date(this.booksForm[i].value.returnDate);
        if (retDate.getTime() < checkDate.getTime()) {
          this.message[i] = "Return date cannot be older that checkout date";
  
          return;
        }
  
        book = new Book(
          this.books[i].id,
          new Genre(this.books[i].genre.id, this.booksForm[i].value.genre),
          new Author(this.books[i].author.id, this.booksForm[i].value.authorName, this.booksForm[i].value.authorSurname),
          this.booksForm[i].value.title,
          new Checkout(
            this.books[i].checkout!.id,
            new Membership(this.books[i].checkout!.membership.id
              , this.books[i].checkout!.membership.idMembershipType, this.books[i].checkout!.membership.idUser),
            new CheckoutDate(this.books[i].checkout!.checkoutDate.id, checkDate, retDate)
          )
        );
      } else {
        book = new Book(
          this.books[i].id,
          new Genre(this.books[i].genre.id, this.booksForm[i].value.genre),
          new Author(this.books[i].author.id, this.booksForm[i].value.authorName, this.booksForm[i].value.authorSurname),
          this.booksForm[i].value.title,
          undefined
        );
      }
      
      this.bookService.updateBook(book).subscribe((res: any) => {
        if (res.status === "NOT OK") {
          this.message[i] = res.description;
        } else if (res.status === "OK") {
          this.message[i] = "Successful update";
        }
      });
    } catch (err) {
      console.log(err);
    }
  }

  onRemove(id: number) {
    this.bookService.delBookById(id);
  }
}
