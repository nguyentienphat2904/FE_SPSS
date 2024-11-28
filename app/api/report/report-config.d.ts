declare type TokenPayload = {
    token: string;
};

declare type GetReportPayload = {
    printerId: string;
    day?: string;
    month?: string;
}

declare type ReportData = {
    printerId: string;
    documentsCount: number;
    totalOrders: number;
    ordersGroupedByStatus: {
        printingStatus: "PENDING" | "PROCESSING" | "SUCCESS";
        orderCount: number;
    }[];
};