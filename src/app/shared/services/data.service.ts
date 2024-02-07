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
            for (let key in res) {
                users.push({id: key, ...res[key as keyof typeof res]} as User);
            }

            return users;
        }));
    }

    addUser(userInf: {username: string, password: string, passRepeat: string, name: string, surname: string, email: string}) {
        return this.httpClient.post(this.apiUrl + "/users", { 
            username: userInf.username,
            password: userInf.password,
            name: userInf.name,
            surname: userInf.surname,
            email: userInf.email 
        }).pipe((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            let tmpUser: User = new User(-1, userInf.username, userInf.name, userInf.surname, userInf.email, "");
            tmpUser.id = res.insertedId;
            tmpUser.memType = res.memType;

            return res;
        });
    }

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
        console.log("Book: ", book);
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
};