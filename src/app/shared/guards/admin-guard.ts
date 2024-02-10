import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";
import { AuthService } from "../services/auth.service";


export const adminGuard: CanActivateFn = () => {
    if (localStorage.getItem("token") && inject(AuthService).isUserAdmin()) {
        return true;
    }

    inject(Router).navigate(['']);
    return false;
};
