import { Injectable } from "@angular/core";
import { Book } from "../models/book.model";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
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
    }
    

    getBooks() {
        return this.books;
    }

    getBooksSubject() {
        return this.booksSubject;
    }
    
    addBook(book: Book) {
        return this.dataService.addBook(book).pipe(
            tap((res) => {
                this.books.push(book);
                this.booksSubject.next([...this.books]);

                return res;
            }),
            catchError((err) => throwError(() => new TypeError(err)))
        );
    }

    lendBookById(bookId: number, userId?: number) {
        this.dataService.lendBookById(bookId, userId).subscribe((res: any) => {
            if (res.status === "OK") {
                let bIndex = this.books.findIndex(b => b.id === bookId);
                if (bIndex !== -1) {
                    this.books[bIndex].checkout = res.checkout;
                    this.booksSubject.next([...this.books]);
                }
            }
        });
    }

    returnBookById(bookId: number) {
        this.dataService.returnBookById(bookId).subscribe((res: any) => {
            if (res.status === "OK") {
                let bIndex = this.books.findIndex(b => b.id === bookId);
                if (bIndex !== -1) {
                    this.books[bIndex].checkout = undefined;
                    this.booksSubject.next([...this.books]);
                }
            }
        });
    };

    delBookById(id: number) {
        this.dataService.delBookById(id).subscribe((res: any) => {
            if (res.status === "OK") {
                let bIndex = this.books.findIndex(b => b.id === id);
                if (bIndex !== -1) {
                    this.books.splice(bIndex, 1)
                    this.booksSubject.next([...this.books]);
                }
            }
        });
    }
}
