"use client"
import React, { useEffect, useState } from 'react';
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


import './purchase.scss'
import { SampleData } from './service/SampleData';

interface Buy {
    id: number;
    number: number;
    date: string | Date;
    paid: boolean
}
export default function BuyPaper() {
    const [prints, setPrints] = useState<Buy[]>([]);
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

    const getSeverity = (paid: boolean) => {
        switch (paid) {
            case true:
                return 'success';

            case false:
                return 'danger';
        }
    };

    useEffect(() => {
        SampleData.getFullData().then((data) => setPrints(getPrints(data)));
    }, []);

    const getPrints = (data: Buy[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
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

    const paidItemTemplate = (option: boolean) => {
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
                    <h6 className="">Lịch sử mua giấy</h6>
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

    const dateBodyTemplate = (rowData: Buy) => {
        return formatDate(rowData.date);
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

    const paidBodyTemplate = (rowData: Buy) => {
        return <Tag value={rowData.paid ? "Đã thanh toán" : "Chưa thanh toán"} severity={getSeverity(rowData.paid)} />;
    };

    const openDialog = (): void => {
        setDisplayDialog(true);
    };

    const closeDialog = (): void => {
        setDisplayDialog(false);
    };

    const handleConfirm = (): void => {
        console.log(`Số lượng giấy muốn mua: ${quantity}`);
        closeDialog();
    };

    const header = renderHeader();

    return (
        <div>
            <div className="card">
                {header}
                <DataTable value={prints} paginator rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['number', 'date', 'paid']}
                    emptyMessage="Không có bản in gần đây." currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}">
                    <Column field="number" header="Số lượng" sortable filterPlaceholder="Search by number" style={{ minWidth: '14rem' }} />
                    <Column field="date" header="Thời gian mua" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                    <Column header="Thành tiền" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={paidBodyTemplate} filterElement={paidFilterTemplate} /></DataTable>

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