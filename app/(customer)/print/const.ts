export const sizes = ['A5', 'A4', 'A3', 'A2', 'A1', 'A0'];

export const orientations = ['Dọc', 'Ngang'];

export const places = ['H1-101', 'H2-202', 'H3-303', 'H6-606'];

export const fileTypes = [
    'application/pdf',
    'image/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/csv'
];

export const baseUrl = 'http://localhost:3010/v1';

export interface FileData {
    id: string;
    name: string;
    mimeType: string;
    numPages: number,
    path: string,
    customerId: string,
    createdAt: Date | string,
    updatedAt: Date | string
}

export interface PrinterResponse {
    id: string,
    name: string,
    brand: string,
    active: boolean,
    locationId: string,
    createdAt: Date | string,
    updatedAt: Date | string,
    location: {
        id: string,
        branch: string,
        block: string,
        room: string,
        createdAt: Date | string,
        updatedAt: Date | string
    }
}

export interface PrinterShow {
    id: string,
    name: string // name + location.branch + location.block + location.room
}