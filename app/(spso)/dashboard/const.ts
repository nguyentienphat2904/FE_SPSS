export const PrintOrderData = [
    {
        id: '001',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in',
        paid: 'Chưa thanh toán',
        user: {
            firstName: 'Nguyễn Tiến',
            lastName: 'Phát',
            id: '2212527'
        }
    },
    {
        id: '002',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '003',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '004',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '005',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '006',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '007',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '008',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '009',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '010',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '011',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '012',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '013',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
    {
        id: '014',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '015',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Đã in'
    },
    {
        id: '016',
        name: 'abc.pdf',
        date: '01/11/2024',
        place: 'H6-606',
        status: 'Chưa in'
    },
]

export const BASE_URL = 'https://spss.tiendungcorp.com.vn/v1';
export const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjEyMzQ1Iiwicm9sZSI6IlNQU08iLCJpYXQiOjE3MzEzMjk4MzIsImV4cCI6MTc2Mjg2NTgzMn0.Reitz8hF_-WcZR87REnjULu8m5eSTRgjgytJHPty3Yg'

export interface IPrintOrder {
    id: string,
    name: string,
    printingStatus: string
}

export interface PrintingOrder {
    id: string,
    numFaces: number,
    printingStatus: string,
    purchasingStatus: string,
    orientation: string,
    size: string,
    documentId: string,
    printerId: string,
    customerId: string,
    documentName: string,
}