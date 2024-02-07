import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Author } from 'src/app/shared/models/author.model';
import { Book } from 'src/app/shared/models/book.model';
import { Genre } from 'src/app/shared/models/genre.model';
import { BookService } from 'src/app/shared/services/book.service';

@Component({
  selector: 'app-book-donate',
  templateUrl: './book-donate.component.html',
  styleUrl: './book-donate.component.css'
})
export class BookDonateComponent {
  message: string = "";
  donateForm!: FormGroup;

  constructor(private bookService: BookService) {};

  ngOnInit() {
    this.donateForm = new FormGroup({
      "title": new FormControl(null, [Validators.required]),
      "genreType": new FormControl(null, [Validators.required]),
      "authorName": new FormControl(null, [Validators.required]),
      "authorSurname": new FormControl(null, [Validators.required])
    });
  }

  onDonate() {
    console.log("donateForm: ", this.donateForm.value);
    try {
      this.bookService.addBook(new Book(
        -1,
        new Genre(-1, this.donateForm.value.genreType),
        new Author(-1, this.donateForm.value.authorName, this.donateForm.value.authorSurname),
        this.donateForm.value.title
      ));

      this.message = "Successful donation";
      this,this.donateForm.reset();
    } catch (err) {
      console.log(err);
    }
  }
}
