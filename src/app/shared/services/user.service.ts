import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, catchError, throwError } from "rxjs";
import { DataService } from './data.service';



@Injectable({
    providedIn: 'root'
})
export class UserService {
    private users: User[] = [];
    private usersSubject: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

    constructor(private dataService: DataService) {
        this.dataService.getUsers().subscribe((res: any) => {
            this.users = res;
            this.usersSubject.next([...this.users]);
        });
    };


    getUsers() {
        return this.usersSubject;
    };

    addUser(userInf: {username: string, password: string, passRepeat: string, name: string, surname: string, email: string}) {
        this.dataService.addUser(userInf)
            .pipe(catchError((err) => { return throwError(() => new TypeError(err)); }))
            .subscribe((res: any) => {
                this.users.push(res);
                this.usersSubject.next([...this.users]);
            });
    };
};
