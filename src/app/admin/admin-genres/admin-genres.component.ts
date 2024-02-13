import { Component } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Genre } from 'src/app/shared/models/genre.model';
import { BookService } from 'src/app/shared/services/book.service';
import { GenreService } from 'src/app/shared/services/genre.service';


@Component({
  selector: 'app-admin-genres',
  templateUrl: './admin-genres.component.html',
  styleUrl: './admin-genres.component.css'
})
export class AdminGenresComponent {
  genres!: Genre[];
  genresSub!: Subscription;
  message!: string[];
  genresForm!: FormGroup[];

  constructor(private genreService: GenreService, private bookService: BookService) {}


  ngOnInit() {
    this.genresSub = this.genreService.getGenresSubject().subscribe(res => {
      this.genres = res;

      this.message = [];
      this.genresForm = [];
      
      this.genres.forEach(g => {
        this.message?.push("");

        this.genresForm.push(new FormGroup({
          "type": new FormControl(g.type
            , [Validators.required, this.isValueChangedValidator(g.type)])
        }, {validators: [(form: FormGroup) => Object.values(form.controls).some(c => 
            c.status === "VALID") ? null : { "allControlsInvalid": true }] as ValidatorFn[] }
        ));
      });
    });
  }

  isValueChangedValidator(userAtr?: string) { 
    return (control: AbstractControl) => control.value === userAtr ? { "valueMatch": true } : null;
  }

  ngOnDestroy() {
    this.genresSub.unsubscribe();
  }


  onUpdate(i: number) {
    let newGenre = new Genre(this.genres[i].id, this.genresForm[i].value.type)

    this.genreService.updateGenre(newGenre).subscribe((res: any) => {
      if (res.status === "NOT OK") {
        this.message[i] = res.description;
      } else if (res.status === "OK") {
        this.bookService.updateGenreLocally(newGenre);
        this.message[i] = "Successful update";
      }
    });
  }
}
