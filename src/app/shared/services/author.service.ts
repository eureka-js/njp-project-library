import { Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, throwError } from "rxjs";
import { DataService } from './data.service';
import { Author } from "../models/author.model";


@Injectable({
    providedIn: 'root'
})
export class AuthorService {
    private authors: Author[] = [];
    private authorsSubject: BehaviorSubject<Author[]> = new BehaviorSubject<Author[]>([]);

    constructor(private dataService: DataService) {
        this.dataService.getAuthors().subscribe((res: any) => {
            this.authors = res;
            this.authorsSubject.next([...this.authors]);
        });
    }

    getAuthorsSubject() {
        return this.authorsSubject;
    }

    updateAuthor(author: Author) {
        return this.dataService.updateAuthor(author).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            this.authors[this.authors.findIndex(a => a.id === author.id)] = author;
            this.authorsSubject.next([...this.authors]);

            return res;
        }));
    }
}
