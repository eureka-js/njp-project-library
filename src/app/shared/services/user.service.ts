import { Injectable } from "@angular/core";
import { User } from "../models/user.model";
import { BehaviorSubject, catchError, map, throwError } from "rxjs";
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
    }


    getUsers() {
        return this.usersSubject;
    }

    addUser(user: User) {
        return this.dataService.addUser(user).pipe(
            catchError((err) => throwError(() => err)),
            map((res) => {
                this.users.push(user);
                this.usersSubject.next([...this.users]);

                return res;
            })
        );
    }

    changeMemTypeById(id: number, memType: string) {
        return this.dataService.changeMemTypeById(id, memType).pipe(map((res: any) => {
            if (res.status === "OK") {
                let userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    this.users[userIndex].memType = res.memType;
                    this.usersSubject.next([...this.users]);
                }
            }

            return res;
        }));
    }

    delUserById(id: number) {
        return this.dataService.delUserById(id).pipe(map((res: any) => {
            if (res.status === "OK") {
                let userIndex = this.users.findIndex(u => u.id === id);
                if (userIndex !== -1) {
                    this.users.splice(userIndex, 1);
                    this.usersSubject.next([...this.users]);
                }
            }

            return res;
        }));
    }
}
