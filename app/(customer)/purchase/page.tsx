"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { DataTableFilterMeta } from 'primereact/datatable';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { ProgressBar } from 'primereact/progressbar';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Dialog } from 'primereact/dialog';
import { InputNumber } from 'primereact/inputnumber';
import { Toast } from 'primereact/toast';

import { useDispatch, useSelector } from 'react-redux';
import { adjustPurchaseHistory } from '@/redux/purchase.slice';

import './purchase.scss'
import { SampleData } from './service/SampleData';
import { createPurchase, getPurchase } from '@/app/api/purchase/purchase';
import { Purchase } from './service/const';

export default function BuyPaper() {
    const [prints, setPrints] = useState<Purchase[]>(useSelector((state: any) => state.purchase.purchaseHistory));
    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        paid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    })
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [paids] = useState<String[]>(['Đã thanh toán', 'Chưa thanh toán']);

    const [displayDialog, setDisplayDialog] = useState<boolean>(false);
    const [quantity, setQuantity] = useState<number>(1);

    const toast = useRef<Toast | null>(null);

    const dispatch = useDispatch()

    const getSeverity = (paid: string) => {
        switch (paid) {
            case 'PAID':
                return 'success';

            case 'UNPAID':
                return 'danger';
        }
    };

    useEffect(() => {
        // SampleData.getFullData().then((data) => setPrints(getPrints(data)));
        const getPurchaseList = async () => {
            try {
                const response = await getPurchase();
                setPrints(response.data)
                dispatch(adjustPurchaseHistory(response.data));
            } catch (error: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: error.message,
                });
            }
        }
        getPurchaseList()
    }, []);

    const getPrints = (data: Purchase[]) => {
        return [...(data || [])].map((d) => {
            d.createdAt = new Date(d.createdAt);
            return d;
        })
    }

    const formatDate = (value: string | Date) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const paidFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown
            value={options.value}
            options={paids}
            onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
            itemTemplate={paidItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear />;
    };

    const paidItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        if (_filters['global']) {
            _filters['global'].value = value;
        }

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const renderHeader = () => {
        return (
            <div className='mb-4'>
                <h2 className='mb-4' style={{ color: '#6366f1', fontStyle: 'italic', fontWeight: '700' }}>Mua giấy in</h2>
                <div className='header'>
                    <h6 className="mt-3 header-left">Lịch sử mua giấy</h6>
                    <div className='header-right'>
                        <Button label='Mua giấy' className='mr-4' onClick={openDialog}></Button>
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Tìm kiếm"
                            style={{
                                borderRadius: '100px',
                            }} />
                    </div>
                </div>
            </div>

        );
    };

    const dateBodyTemplate = (rowData: Purchase) => {
        return formatDate(rowData.createdAt);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value}
            onChange={(e: any) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const activityFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return (
            <>
                <Slider value={options.value} onChange={(e: SliderChangeEvent) => options.filterCallback(e.value)} range className="m-3"></Slider>
                <div className="flex align-items-center justify-content-between px-2">
                    <span>{options.value ? options.value[0] : 0}</span>
                    <span>{options.value ? options.value[1] : 100}</span>
                </div>
            </>
        );
    };

    const paidBodyTemplate = (rowData: Purchase) => {
        return <Tag value={rowData.status ? "Đã thanh toán" : "Chưa thanh toán"} severity={getSeverity(rowData.status)} />;
    };

    const openDialog = (): void => {
        setDisplayDialog(true);
    };

    const closeDialog = (): void => {
        setDisplayDialog(false);
    };

    const handleConfirm = async () => {
        try {
            const response = await createPurchase(quantity);
            const newPurchase = response.data;
            setPrints(prev => [newPurchase, ...prev]);
            dispatch(adjustPurchaseHistory([newPurchase, ...prints]));
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: response.message,
            });
            closeDialog();
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message,
            });
        }
    };

    const header = renderHeader();

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
    };

    return (
        <div>
            <Toast ref={toast}></Toast>
            <div className="card">
                {header}
                <DataTable value={prints} paginator rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]}
                    filters={filters} filterDisplay="menu" globalFilterFields={['numPages', 'createdAt', 'cost', 'status']}
                    emptyMessage="Không có bản in gần đây." currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}"
                    scrollable scrollHeight='400px' removableSort>
                    <Column field="numPages" header="Số lượng" sortable filterPlaceholder="Search by number" style={{ minWidth: '14rem' }} />
                    <Column field="createdAt" header="Thời gian mua" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                    <Column field="cost" header="Thành tiền" sortable style={{ minWidth: '12rem' }} body={(rowData) => formatCurrency(rowData.cost)} />
                    <Column header="Thanh toán" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={paidBodyTemplate} filterElement={paidFilterTemplate} />
                </DataTable>
            </div>
            <Dialog
                header="Mua giấy in"
                visible={displayDialog}
                onHide={closeDialog}
                style={{
                    width: '400px',
                }}
            >
                <p>Số lượng</p>
                <InputNumber
                    value={quantity}
                    onValueChange={(e) => setQuantity(e.value || 1)}
                    showButtons
                    min={1}
                    max={10000}
                    placeholder="Số lượng"
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        onClick={closeDialog}
                        severity="danger" rounded
                        className='mr-1'
                    />
                    <Button
                        label="Xác nhận"
                        icon="pi pi-check"
                        onClick={handleConfirm}
                        severity="success" outlined rounded
                    />
                </div>
            </Dialog>
        </div>
    );
};