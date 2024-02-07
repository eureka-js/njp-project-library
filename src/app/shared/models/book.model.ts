import { Author } from "./author.model";
import { Genre } from "./genre.model";

export class Book {
    id: number;
    genre: Genre;
    author: Author;
    title: string;

    constructor(id: number, genre: Genre, author: Author, title: string) {
        this.id = id;
        this.genre = genre;
        this.author = author;
        this.title = title;
    }
};
