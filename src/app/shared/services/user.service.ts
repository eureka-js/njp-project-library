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

    addUser(user: User, pass: string) {
        this.dataService.addUser(user, pass)
            .pipe(catchError((err) => { return throwError(() => new TypeError(err)) }))
            .subscribe(() => {
                this.users.push(user);
                this.usersSubject.next([...this.users]);
            });
    };

    changeMemTypeById(id: number, memType: string) {
        this.dataService.changeMemTypeById(id, memType).subscribe((res: any) => {
            if (res.status === "OK") {
                let userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    this.users[userIndex].memType = res.memType;
                    this.usersSubject.next([...this.users]);
                }
            }
        });
    }

    delUserById(id: number) {
        this.dataService.delUserById(id).subscribe((res: any) => {
            if (res.status === "OK") {
                let userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    this.users.splice(userIndex, 1);
                    this.usersSubject.next([...this.users]);
                }
            }
        });
    }
};
