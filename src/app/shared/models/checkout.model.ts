import { CheckoutDate } from "./checkout-date.model";
import { Membership } from "./membership.model";


export class Checkout {
    id: number;
    membership: Membership;
    checkoutDate: CheckoutDate;

    constructor(id: number, membership: Membership, checkoutDate: CheckoutDate) {
        this.id = id;
        this.membership = membership;
        this.checkoutDate = checkoutDate;
    }
};
