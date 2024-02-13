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

    constructor(private httpClient: HttpClient) {}


    getUsers() {
        return this.httpClient.get(this.apiUrl + "/users").pipe(map((res: any) => {
            const users: User[] = [];
            for (let key in res.users) {
                users.push({id: key, ...res.users[key as keyof typeof res.users]} as User);
            }

            return users;
        }));
    }

    updateUser(user: User) {
        return this.httpClient.put(this.apiUrl + "/user/" + user.id, {
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: user.email,
            memType: user.memType,
            password: user.hashedPass
        }).pipe(map((res: any) => res));
    }

    addUser(user: User) {
        return this.httpClient.post(this.apiUrl + "/users", { 
            username: user.username,
            name: user.name,
            surname: user.surname,
            email: user.email,
            password: user.hashedPass
        }).pipe(map((res: any) => {
            if (res.status === "NOT OK") {
                throw new TypeError(res.description);
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
    }

    getBooks() {
        return this.httpClient.get(this.apiUrl + "/books").pipe(map((res: any) => {
            let cDate: [number, number, number];
            let rDate: [number, number, number];
            return res.books.map((res: any) => {
                if (res.idCheckout) {
                    cDate = res.checkoutDate.split('/').map(Number);
                    rDate = res.returnDate.split('/').map(Number);    
                }

                return new Book(
                res.id,
                new Genre(res.idGenre, res.genreType),
                new Author(res.idAuthor, res.name, res.surname),
                res.title,
                res.idCheckout ? new Checkout(
                    res.idCheckout,
                    new Membership(res.idMembership, res.idMembershipType, res.idUser),
                    new CheckoutDate(
                        res.idCheckoutDate,
                        new Date(cDate[2], cDate[1] - 1, cDate[0]),
                        new Date(rDate[2], rDate[1] - 1, rDate[0])
                    )
                ) : undefined
            )});
        }));
    }

    lendBookById(bookId: number, userId?: number) {
        return this.httpClient.put(this.apiUrl + "/bookLend", { bookId: bookId, userId: userId } )
            .pipe(map((res: any) => {
                if (res.status === "NOT OK") {
                    return throwError(() => new TypeError(res.description));
                }

                // Reformatting the checkout data into the object of class Checkout
                let cDate: [number, number, number] = res.checkout.checkoutDate.split('/').map(Number);
                let rDate: [number, number, number] = res.checkout.returnDate.split('/').map(Number);
                res.checkout = new Checkout(
                    res.checkout.idCheckout,
                    new Membership(
                        res.checkout.idMembership,
                        res.checkout.idMembershipType,
                        res.checkout.idUser
                    ),
                    new CheckoutDate(
                        res.checkout.idCheckoutDate,
                        new Date(cDate[2], cDate[1] - 1, cDate[0]),
                        new Date(rDate[2], rDate[1] - 1, rDate[0])
                    )
                );

                return res;
            })
        );
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

    updateBook(book: Book) {
        return this.httpClient.put(this.apiUrl + "/book/" + book.id, {
            title: book.title,
            genre: {
                id: book.genre.id,
                type: book.genre.type
            },
            author: {
                id: book.author.id,
                name: book.author.name,
                surname: book.author.surname
            },
            checkout: (book.checkout ? {
                id: book.checkout.id,
                membership: {
                    id: book.checkout.membership.id,
                    idMembershipType: book.checkout.membership.idMembershipType,
                    idUser: book.checkout.membership.idUser
                },
                checkoutDate: {
                    id: book.checkout.checkoutDate.id,
                    checkoutDate: book.checkout.checkoutDate.checkoutDate,
                    returnDate: book.checkout.checkoutDate.returnDate
                }
            } : undefined)
         }).pipe(map((res) => res));
    }

    delBookById(id: number) {
        return this.httpClient.delete(this.apiUrl + "/book/" + id);
    }

    getGenres() {
        return this.httpClient.get(this.apiUrl + "/genres").pipe(map((res: any) => {
            const genres: Genre[] = [];
            for (let key in res.genres) {
                genres.push({id: key, ...res.genres[key as keyof typeof res.genres]} as Genre);
            }

            return genres;
        }));
    }

    updateGenre(genre: Genre) {
        return this.httpClient.put(this.apiUrl + "/genre/" + genre.id, { type: genre.type })
            .pipe(map((res) => res));
    }

    getAuthors() {
        return this.httpClient.get(this.apiUrl + "/authors").pipe(map((res: any) => {
            const authors: Author[] = [];
            for (let key in res.authors) {
                authors.push({id: key, ...res.authors[key as keyof typeof res.authors]} as Author);
            }

            return authors;
        }));
    }

    updateAuthor(author: Author) {
        return this.httpClient.put(this.apiUrl + "/author/" + author.id, {
            name: author.name,
            surname: author.surname
         }).pipe(map((res) => res));
    }
}
