export class User {
    id: number;
    username: string;
    name: string;
    surname: string;
    email: string;
    memType: string;
    hashedPass: string;

    constructor(id: number, username: string, name: string, surname: string,
        email: string, memType: string, hashedPass: string) {
        this.id = id;
        this.username = username;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.memType = memType;
        this.hashedPass = hashedPass;
    }
};
