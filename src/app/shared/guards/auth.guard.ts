import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const authGuard: CanActivateFn = () => {
    if (localStorage.getItem("token")) {
        return true;
    }

    inject(Router).navigate(['login']);
    return false;
};
