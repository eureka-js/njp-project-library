import { Injectable } from "@angular/core";
import { Book } from "../models/book.model";
import { BehaviorSubject, catchError, throwError } from "rxjs";
import { DataService } from './data.service';



@Injectable({
    providedIn: 'root'
})
export class BookService {
    private books: Book[] = [];
    private booksSubject: BehaviorSubject<Book[]> = new BehaviorSubject<Book[]>([]);

    constructor(private dataService: DataService) {
        this.dataService.getBooks().subscribe((res: any) => {
            this.books = res;
            this.booksSubject.next([...this.books]);
        });
    };


    getBooks() {
        return this.booksSubject;
    };
    
    addBook(book: Book) {
        this.dataService.addBook(book)
            .pipe(catchError((err) => { return throwError(() => new TypeError(err)) }))
            .subscribe(() => {
                this.books.push(book);
                this.booksSubject.next([...this.books]);
            });
    }

    delBookById(id: number) {
        this.dataService.delBookById(id).subscribe((res: any) => {
            if (res.status === "OK") {
                let bookIndex = this.books.findIndex(b => b.id === id);
                if (bookIndex !== -1) {
                    this.books.splice(bookIndex, 1)
                    this.booksSubject.next([...this.books]);
                }
            }
        });
    }
};
