import { Injectable } from "@angular/core";
import { Book } from "../models/book.model";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { DataService } from './data.service';
import { Author } from "../models/author.model";
import { Genre } from "../models/genre.model";


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

    updateBook(book: Book) {
        console.log(book);
        return this.dataService.updateBook(book).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            // the new values can hold the values of the old id's.
            // So that the logic in the api is a little bit simpler
            book.genre.id = res.newGenreId;
            book.author.id = res.newAuthorId;
            if (book.checkout) {
                book.checkout.checkoutDate.id = res.newCheckoutDateId;
            }

            this.books[this.books.findIndex(b => b.id === book.id)] = book;
            this.booksSubject.next([...this.books]);

            return res;
        }));
    }

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

    updateGenreLocally(genre: Genre) {
        if (this.books.some(b => b.genre.id === genre.id)) {
            this.books.forEach(b => {
                if (b.genre.id === genre.id) {
                    b.genre.type = genre.type;
                }
            })
            this.booksSubject.next([...this.books]);
        }
    }

    updateAuthorLocally(author: Author) {
        if (this.books.some(b => b.author.id === author.id)) {
            this.books.forEach(b => {
                if (b.author.id === author.id) {
                    b.author.name = author.name;
                    b.author.surname = author.surname;
                }
            })
            this.booksSubject.next([...this.books]);
        }
    }
}
