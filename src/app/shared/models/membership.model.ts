export class Membership {
    id: number;
    idMembershipType: number;
    idUser: number;

    constructor(id: number, idMembershipType: number, idUser: number) {
        this.id = id;
        this.idMembershipType = idMembershipType;
        this.idUser = idUser;
    }
};
