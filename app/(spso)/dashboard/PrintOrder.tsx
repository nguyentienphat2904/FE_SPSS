'use client'
import React, { useEffect, useState, useRef } from 'react'

import { FilterMatchMode, FilterOperator } from 'primereact/api'

import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
import { Toast } from 'primereact/toast'
import { Button } from 'primereact/button'
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';


import { searchDocName, searchPrinterOrder } from '@/app/api/spso/dashboard'

import { IPrintOrder, PrintingOrder } from './const'
import { confirmStatus, downloadPrintOrder } from '@/app/api/print/print'

export default function PrintOrder() {
    const toast = useRef<Toast>(null);
    const [PrintingOrder, setPrintingOrder] = useState<PrintingOrder[]>([]);
    const [isPrintingOrderLoaded, setIsPrintingOrderLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const [filters, setFilters] = useState<DataTableFilterMeta>({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        'country.name': { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        representative: { value: null, matchMode: FilterMatchMode.IN },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.DATE_IS }] },
        balance: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        status: { operator: FilterOperator.OR, constraints: [{ value: null, matchMode: FilterMatchMode.EQUALS }] },
        activity: { value: null, matchMode: FilterMatchMode.BETWEEN }
    });
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [statuses] = useState<string[]>([
        'Chưa in',
        'Đã in',
    ]);

    const [detailVisible, setDetailVisible] = useState<boolean>(false);

    const [detail, setDetail] = useState<any>();

    const [confirmPrintDialog, setConfirmPrintDialog] = useState<boolean>(false);
    const [printOrder, setPrintOrder] = useState<PrintingOrder | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await searchPrinterOrder();
                if (response.data) {
                    setPrintingOrder(response.data);
                }
            } catch (error: any) {
                const mes = error.message;
                if (mes === "Request failed with status code 422") {
                    toast.current?.show({
                        severity: "error",
                        summary: "Thất bại",
                        detail: "Thông tin không hợp lệ",
                        life: 3000,
                    });
                }
                console.error("Error fetching groups:", error)
            } finally {
                setIsPrintingOrderLoaded(true);
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        if (!isPrintingOrderLoaded) return;
        const getDocName = async () => {
            try {
                for (const doc of PrintingOrder) {
                    const response = await searchDocName(doc.documentId);
                    doc.documentName = response.data.name;
                }
            } catch (error) {
                console.error("Error fetching document names:", error);
            } finally {
                setIsLoading(true);
            }
        };

        getDocName();
    }, [isPrintingOrderLoaded, PrintingOrder]);

    if (!isLoading) {
        return <div>Loading data...</div>;
    }

    // useEffect(() => {
    //     if (!isPrintingOrderLoaded) return;
    //     const getDocName = async () => {
    //         try {
    //             const updatedOrders = await Promise.all(
    //                 PrintingOrder.map(async (doc) => {
    //                     const response = await searchDocName(doc.documentId);

    //                     // Trả về đối tượng đã được thêm trường mới
    //                     return {
    //                         ...doc,
    //                         documentName: response.data.name,
    //                     };
    //                 })
    //             );

    //             console.log(updatedOrders); // Kiểm tra danh sách đã được cập nhật
    //         } catch (error) {
    //             console.error("Error fetching document names:", error);
    //         } finally {
    //             setIsDocumentNameLoaded(true);
    //             console.log("Printing order", PrintingOrder)
    //         }
    //     };

    //     getDocName();
    // }, [isPrintingOrderLoaded, PrintingOrder]);

    // useEffect(() => {
    //     if (!isDocumentNameLoaded) return;
    //     const transformedData = PrintingOrder.map((order) => ({
    //         id: order.id,
    //         name: order.documentName,
    //         printingStatus: order.printingStatus
    //     }));

    //     setPrintOrder(transformedData);
    // }, [isDocumentNameLoaded, PrintingOrder]);


    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };



    const renderHeader = () => {
        return (
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0 dashboard-body-table-header">Đơn in</h4>
                {/* <IconField iconPosition="left">
                    <InputIcon className="pi pi-search" /> */}
                <InputText
                    className='dashboard-body-search-box'
                    value={globalFilterValue}
                    onChange={onGlobalFilterChange}
                    placeholder="Tìm kiếm"
                />
                {/* </IconField> */}
            </div>
        );
    };

    const getSeverity = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'danger';
            case 'FAILED':
                return 'danger';
            case 'PAID':
                return 'success';
            case 'SUCCESS':
                return 'success';
            case 'PROCESSING':
                return 'warning'
            default:
                return 'warning';
        }
    };

    const renderStatus = (rowData: PrintingOrder) => {
        return (
            <Tag value={rowData.printingStatus} severity={getSeverity(rowData.printingStatus)} />
        );
    }

    const renderPurchase = (rowData: PrintingOrder) => {
        return (
            <Tag value={rowData.purchasingStatus} severity={getSeverity(rowData.purchasingStatus)} />
        );
    }

    const downloadFile = async (rowData: PrintingOrder) => {
        try {
            const documentId = rowData.documentId;
            const response = await downloadPrintOrder(documentId);
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', `${rowData.documentName}.pdf`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: "Tải thành công",
                life: 3000,
            });
            const confirmProcessing = await confirmStatus(rowData.id, 'PROCESSING');
            const updatedOrders = PrintingOrder.map((order) =>
                order.id === confirmProcessing.data.id ? { ...order, printingStatus: 'PROCESSING' } : order
            );
            setPrintingOrder([...updatedOrders]);
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Thất bại",
                detail: error.message,
                life: 3000,
            });
        }
    }

    const confirmPrint = async () => {
        try {
            const confirmPrint = await confirmStatus(printOrder?.id || '', 'SUCCESS');
            toast.current?.show({
                severity: "success",
                summary: "Thành công",
                detail: confirmPrint.message,
                life: 3000,
            });
            const updatedOrders = PrintingOrder.map((order) =>
                order.id === confirmPrint.data.id ? { ...order, printingStatus: 'SUCCESS' } : order
            );
            setPrintingOrder([...updatedOrders]);
            setConfirmPrintDialog(false);
        } catch (error: any) {
            toast.current?.show({
                severity: "error",
                summary: "Thất bại",
                detail: error.message,
                life: 3000,
            });
        }
    }

    const renderAction = (rowData: PrintingOrder) => {
        if (rowData.printingStatus === 'PENDING')
            return (
                <Button size='small' icon='pi pi-print' text rounded onClick={() => downloadFile(rowData)}></Button>
            );
        else if (rowData.printingStatus === 'PROCESSING')
            return (
                <Button size='small' icon='pi pi-check' text rounded
                    onClick={() => {
                        setConfirmPrintDialog(true);
                        setPrintOrder(rowData);
                    }}></Button>
            );
    }

    const statusItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const statusFilterTemplate = (
        options: ColumnFilterElementTemplateOptions
    ) => {
        return (
            <Dropdown
                value={options.value}
                options={statuses}
                onChange={(e: DropdownChangeEvent) =>
                    options.filterCallback(e.value, options.index)
                }
                itemTemplate={statusItemTemplate}
                placeholder="Chọn một"
                className="p-column-filter"
                showClear
            />
        );
    };

    const showDetail = (e: DataTableRowClickEvent) => {
        const data = e.data
        setDetailVisible(true);
        setDetail(data);
    }

    const dialogFooter = (
        <div>
            <Button label="Không" icon="pi pi-times" onClick={() => setConfirmPrintDialog(false)} className="p-button-text" />
            <Button label="Có" icon="pi pi-check" onClick={() => confirmPrint()} autoFocus />
        </div>
    );

    return (
        <div>
            <Toast ref={toast} />
            <DataTable value={PrintingOrder} header={renderHeader} dataKey='id' rows={10}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                    'documentName',
                    'date',
                    'place',
                    'printingStatus',
                ]}
                selectionMode="single"
                removableSort
                emptyMessage="Không có thông tin phù hợp."
                scrollable scrollHeight="350px"
                paginator
                paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}"
                rowsPerPageOptions={[10, 25, 50]}
                onRowClick={showDetail}
            >
                <Column field='documentName' header="Bản in" sortable style={{ minWidth: '10rem' }}></Column>
                {/* <Column field='date' header="Ngày nhận" sortable style={{ minWidth: '8rem' }}></Column>
                <Column field='place' header="Nơi nhận" sortable style={{ minWidth: '8rem' }}></Column> */}
                <Column field='printingStatus' body={renderStatus} header="Trạng thái in" sortable style={{ minWidth: '8rem' }}
                    filter showFilterMatchModes={false} showFilterOperator={false} filterElement={statusFilterTemplate} ></Column>
                <Column field='purchasingStatus' body={renderPurchase} header="Thanh toán" sortable style={{ minWidth: '8rem' }} />
                <Column body={renderAction} header="Thao tác" style={{ minWidth: '8rem' }}></Column>
            </DataTable>
            <Dialog visible={detailVisible} onHide={() => setDetailVisible(false)} header="Thông tin chi tiết"
                className='dashboard-body-dialog' breakpoints={{ '1536px': '50vw', '960px': '75vw', '641px': '100vw' }}>
                <div>
                    {detail ?
                        (
                            <div>
                                <ul>
                                    <li>{detail.customerId}</li>
                                    <li>{detail.documentName}</li>
                                    <li>{detail.printingStatus}</li>
                                    <li>{detail.purchasingStatus}</li>
                                </ul>
                            </div>
                        )
                        :
                        (
                            <div>
                                Không có gì hết
                            </div>
                        )
                    }
                </div>
            </Dialog>
            <Dialog visible={confirmPrintDialog} onHide={() => setConfirmPrintDialog(false)} header="Xác nhận đã in"
                className='dashboard-body-dialog' breakpoints={{ '1536px': '50vw', '960px': '75vw', '641px': '100vw' }}
                footer={dialogFooter}>
                <p>
                    Xác nhận đã in {printOrder?.documentName}?
                </p>
            </Dialog>
        </div>
    )
}
