declare type TokenPayload = {
    token: string;
};

declare type AccountPayload = {
    username: string;
    password: string;
};

declare type UserBase = {
    id: string;
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
};

declare type CustomerInfo = UserBase & {
    extraPages?: number;
    type: 'customer';
};

declare type SPSOInfo = UserBase & {
    phoneNumber?: string;
    type: 'spso';
};

declare type CustomerInfoLogin = CustomerInfo & {
    accessToken: string;
};

declare type SPSOInfoLogin = SPSOInfo & {
    accessToken: string;
};