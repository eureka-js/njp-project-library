import { inject } from "@angular/core";
import { CanActivateFn, Router } from "@angular/router";


export const authGuard: CanActivateFn = () => {
    if (localStorage.getItem("token")) {
        return true;
    }

    const route = inject(Router);
    route.navigate(['login']);
    return false;
};
