import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { map, throwError } from "rxjs";
import { environment } from "../environment";
import { Book } from "../models/book.model";
import { Genre } from "../models/genre.model";
import { Author } from "../models/author.model";
import { Checkout } from "../models/checkout.model";
import { Membership } from "../models/membership.model";
import { CheckoutDate } from "../models/checkout-date.model";


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
        }).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            user.id = res.insertId;
            user.memType = res.memType;

            return res;
        }));
    }

    changeMemTypeById(id: number, memType: string) {
        return this.httpClient.put(this.apiUrl + "/userMemType/" + id, { memType: memType });
    }

    delUserById(id: number) {
        return this.httpClient.delete(this.apiUrl + "/user/" + id);
    };

    getBooks() {
        return this.httpClient.get(this.apiUrl + "/books").pipe(map((res: any) => {
            return res.books.map((res: any) => new Book(
                res.id,
                new Genre(res.idGenre, res.genreType),
                new Author(res.idAuthor, res.name, res.surname),
                res.title,
                res.idCheckout ? new Checkout(
                    res.idCheckout,
                    new Membership(res.idMembership, res.idMembershipType, res.idUser),
                    new CheckoutDate(res.idCheckoutDate, res.checkoutDate, res.returnDate)
                ) : undefined
            ));
        }));
    }

    lendBookById(bookId: number, userId?: number) {
        return this.httpClient.put(
            this.apiUrl + "/bookLend", { bookId: bookId, userId: userId }
        ).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            // Reformatting the checkout data into the object of class Checkout
            res.checkout = new Checkout(
                res.checkout.idCheckout,
                new Membership(
                    res.checkout.idMembership,
                    res.checkout.idMembershipType,
                    res.checkout.idUser
                ),
                new CheckoutDate(
                    res.checkout.idCheckoutDate,
                    res.checkout.checkoutDate,
                    res.checkout.returnDate
                )
            );


            return res;
        }));
    }

    returnBookById(bookId: number) {
        return this.httpClient.delete(this.apiUrl + "/bookCheckout/" + bookId);
    }

    addBook(book: Book) {
        return this.httpClient.post(this.apiUrl + "/books", { 
            bookTitle: book.title,
            genreType: book.genre.type,
            authorName: book.author.name,
            authorSurname: book.author.surname
         }).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                return throwError(() => new TypeError(res.description));
            }

            book.id = res.insertBookId;
            book.genre.id = res.insertGenreId;
            book.author.id = res.insertAuthorId;

            return res;
        }));
    }

    delBookById(id: number) {
        return this.httpClient.delete(this.apiUrl + "/book/" + id);
    }
};