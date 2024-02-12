import {HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from "@angular/common/http";
import {Observable} from "rxjs";
import {Injectable} from "@angular/core";
import {AuthService} from "../shared/services/auth.service";


@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private auth: AuthService) {}

    intercept(req : HttpRequest<any>, next: HttpHandler) : Observable<HttpEvent<any>> {
        const token = this.auth.getToken();
        if (token){
            req = req.clone({setHeaders: { Authorization: token }});
        }

        return next.handle(req);
    }
}
