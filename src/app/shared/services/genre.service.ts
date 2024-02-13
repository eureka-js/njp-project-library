import { Injectable } from "@angular/core";
import { BehaviorSubject, map, throwError } from "rxjs";
import { DataService } from './data.service';
import { Genre } from "../models/genre.model";


@Injectable({
    providedIn: 'root'
})
export class GenreService {
    private genres: Genre[] = [];
    private genresSubject: BehaviorSubject<Genre[]> = new BehaviorSubject<Genre[]>([]);

    constructor(private dataService: DataService) {
        this.dataService.getGenres().subscribe((res: any) => {
            this.genres = res;
            this.genresSubject.next([...this.genres]);
        });
    }

    getGenresSubject() {
        return this.genresSubject;
    }

    updateGenre(genre: Genre) {
        return this.dataService.updateGenre(genre).pipe(map((res: any) => {
            if (res.status === "OK") {
                this.genres[this.genres.findIndex(g => g.id === genre.id)] = genre;
                this.genresSubject.next([...this.genres]);
            }

            return res;
        }));
    }
}
