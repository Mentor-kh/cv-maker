export interface User {
    firstName: string;
    lastName: string;
    phone: string;
    password: string;
}
export interface UserPost extends User {
    tosAgreement: boolean;
}
