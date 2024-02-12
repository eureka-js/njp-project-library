export class CheckoutDate {
    id: number;
    checkoutDate: Date;
    returnDate: Date;

    constructor(id: number, checkoutDate: Date, returnDate: Date) {
        this.id = id;
        this.checkoutDate = checkoutDate,
        this.returnDate = returnDate;
    }
};
