import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { map, throwError } from "rxjs";
import { environment } from "../environment";
import { Book } from "../models/book.model";
import { Genre } from "../models/genre.model";
import { Author } from "../models/author.model";


@Injectable({
    providedIn: 'root'
})
export class DataService {
    private apiUrl: string = environment.API_URL + "/api";

    constructor(private httpClient: HttpClient) {};


    getUsers() {
        return this.httpClient.get(this.apiUrl + "/users").pipe(map((res: any) => {
            const users: User[] = [];
            for (let key in res.users) {
                users.push({id: key, ...res.users[key as keyof typeof res.users]} as User);
            }

            return users;
        }));
    }

    addUser(user: User, pass: string) {
        return this.httpClient.post(this.apiUrl + "/users", { 
            username: user.username,
            password: pass,
            name: user.name,
            surname: user.surname,
            email: user.email 
        }).pipe((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            user.id = res.insertId;
            user.memType = res.memType;

            return res;
        });
    }

    changeMemTypeById(id: number, memType: string) {
        return this.httpClient.put(this.apiUrl + "/userMemType/" + id, { memType: memType});
    }

    delUserById(id: number) {
        return this.httpClient.delete(this.apiUrl + "/user/" + id);
    };

    getBooks() {
        return this.httpClient.get(this.apiUrl + "/books").pipe(map((res: any) => {
            return res.books.map((bookRaw: any) => new Book(
                bookRaw.id,
                new Genre(bookRaw.idGenre, bookRaw.type),
                new Author(bookRaw.idAuthor, bookRaw.name, bookRaw.surname),
                bookRaw.title
            ));
        }));
    }

    addBook(book: Book) {
        return this.httpClient.post(this.apiUrl + "/books", { 
            bookTitle: book.title,
            genreType: book.genre.type,
            authorName: book.author.name,
            authorSurname: book.author.surname
         }).pipe((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            book.id = res.insertBookId;
            book.genre.id = res.insertGenreId;
            book.author.id = res.insertAuthorId;

            return res;
        });
    }

    delBookById(id: number) {
        return this.httpClient.delete(this.apiUrl + "/book/" + id);
    }
};