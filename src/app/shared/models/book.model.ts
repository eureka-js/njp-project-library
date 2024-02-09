import { Author } from "./author.model";
import { Checkout } from "./checkout.model";
import { Genre } from "./genre.model";

export class Book {
    id: number;
    genre: Genre;
    author: Author;
    title: string;
    checkout?: Checkout;

    constructor(id: number, genre: Genre, author: Author, title: string, checkout?: Checkout) {
        this.id = id;
        this.genre = genre;
        this.author = author;
        this.title = title;
        this.checkout = checkout;
    }
};
