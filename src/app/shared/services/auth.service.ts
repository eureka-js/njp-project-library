import { Injectable } from "@angular/core";
import { environment } from '../environment';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";
import { DataService } from "./data.service";


@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private user?: User;
    private userSubject?: Subject<User | undefined> = new Subject<User | undefined>();
    private isUserAdminSubject: Subject<boolean> = new Subject<boolean>();
    private token?: string;
    errEmmitter: Subject<string> = new Subject<string>();
    private authUrl: string = environment.API_URL + "/authenticate";

    constructor(private http: HttpClient, private router: Router, private dataService: DataService) {};

    login(loginVals: { username: string, password: string }) {
        this.http.post(this.authUrl, { username: loginVals.username, password: loginVals.password })
            .subscribe((res: any) => {
                    if (res.status === "OK") {
                        this.token = res.token;
                        localStorage.setItem("token", this.token || "");
                        this.user = new User(
                            res.user.id,
                            res.user.username,
                            res.user.name,
                            res.user.surname,
                            res.user.email,
                            res.user.memType,
                            res.user.hashedPass
                        );
                        this.userSubject?.next(this.user);
                        this.isUserAdminSubject.next(this.user.memType === "admin");

                        this.router.navigate(['/']);
                    } else {
                        this.errEmmitter.next(res.description);
                    }
                });
    }

    updateUser(user: User) {
        return this.dataService.updateUser(user).pipe(map(() => this.user = user));
    }

    logout() {
        this.user = undefined;
        this.userSubject?.next(undefined);
        this.token = undefined;
        localStorage.removeItem("token");

        this.router.navigate(['login']);
    }

    getUser() {
        return this.user;
    }

    getUserSubject() {
        return this.userSubject;
    }

    getIsUserAdminSubject() {
        return this.isUserAdminSubject;
    }

    isUserAdmin() {
        return this.user?.memType === "admin";
    }

    getToken() {
        if (localStorage.getItem("token")) {
            this.token = localStorage.getItem("token")!;
        }

        return this.token;
    }

    isAuthenticated() {
        return this.user != undefined;
    }

    whoAmI() {
        if (this.getToken()) {
            return this.http.get(environment.API_URL + "/api/me").pipe(map((res: any) => {
                if (res.status == "NOT OK" && res.description == "Token expired") {
                    this.logout();
                } else if (res.status == "OK") {
                    this.user = res.user;
                    this.userSubject?.next(this.user);
                    this.isUserAdminSubject.next(this.user?.memType === "admin");
                }

                return res;
            }));
        } else {
            return new Observable(observer => observer.next({ status: "NOT OK" }));
        }
    }
};
