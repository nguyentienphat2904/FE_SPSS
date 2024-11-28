export const BASE_URL = 'http://localhost:3010/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IlNQU08iLCJpYXQiOjE3MzEzMjk4MzIsImV4cCI6MTc2Mjg2NTgzMn0.Reitz8hF_-WcZR87REnjULu8m5eSTRgjgytJHPty3Yg'

export interface Printer {
    id: string | null,
    name: string,
    brand: string,
    active: boolean,
    locationId: string,
    createdAt: string | Date,
    updatedAt: string | Date,
    location: {
        id: string | null;
        block: string,
        room: string,
        branch: string
    }
}

export interface CreatePrinter {
    success: boolean,
    message: string,
    data: Printer | null
}

export interface SearchPrinter {
    success: boolean,
    message: string,
    data: Printer[]
}

export interface UpdatePrinter {
    success: boolean,
    message: string,
    data: null
}

export interface DeletePrinter {
    success: boolean,
    message: string,
    data: null
}

export interface Location {
    id: string | null,
    branch: string,
    block: string,
    room: string
}

export interface CreateLocation {
    success: boolean,
    message: string,
    data: Printer | null
}

export interface DeleteLocation {
    success: boolean,
    message: string,
    data: null
}

export interface GetLocation {
    success: boolean,
    message: string,
    data: Location[]
}

export interface formCreate {
    name: string,
    brand: string,
    active: boolean,
    locationId: string
}
