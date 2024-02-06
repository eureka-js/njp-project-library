import { Injectable } from "@angular/core";
import { environment } from '../environment';
import { Observable, Subject } from "rxjs";
import { map } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";
import { Router } from "@angular/router";
import { User } from "../models/user.model";


@Injectable()
export class AuthService {
    private user?: User;
    private token?: string;
    errEmmitter: Subject<string> = new Subject<string>();
    authChange: Subject<boolean> = new Subject<boolean>();
    authUrl: string = environment.API_URL + "/authenticate";

    constructor(private http: HttpClient, private router: Router) {};

    login(loginVals: { username: string, password: string }) {
        this.http.post(this.authUrl, { username: loginVals.username, password: loginVals.password })
            .subscribe((res: any) => {
                    if (res.status === "OK") {
                        this.token = res.token;
                        localStorage.setItem("token", this.token || "");
                        this.user = res.user;
                        this.authChange.next(true);
        
                        this.router.navigate(['/']);
                    } else {
                        this.errEmmitter.next(res.description);
                    }
                });
    }

    logout() {
        this.user = undefined;
        this.token = undefined;
        localStorage.removeItem("token");
        this.authChange.next(false);

        this.router.navigate(['login']);
    }

    getUser() {
        return this.user;
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
                if (res.status == "OK") {
                    this.user = res.user;
                    this.authChange.next(true);
                }

                return res;
            }));
        } else {
            return new Observable(observer => observer.next({ status: "NOT OK" }));
        }
    }
}