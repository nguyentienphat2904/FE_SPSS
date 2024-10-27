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

import { SampleData } from './service/SampleData';
import './home.scss'

interface Print {
    id: number;
    name: string;
    date: string | Date;
    location: string;
    paid: boolean;
    status: boolean
}
const HomePage = () => {
    const [prints, setPrints] = useState<Print[]>([]);
    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        location: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        paid: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        status: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    })
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [statuses] = useState<String[]>(['Đã in', 'Chưa in']);
    const [paids] = useState<String[]>(['Đã thanh toán', 'Chưa thanh toán']);

    const getSeverity = (status: boolean) => {
        switch (status) {
            case true:
                return 'success';

            case false:
                return 'danger';
        }
    };

    useEffect(() => {
        SampleData.getFullData().then((data) => setPrints(getPrints(data)));
    }, []);

    const getPrints = (data: Print[]) => {
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

    const statusFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown
            value={options.value}
            options={statuses}
            onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
            itemTemplate={statusItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear />;
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

    const statusItemTemplate = (option: boolean) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const paidItemTemplate = (option: boolean) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    // const activityBodyTemplate = (rowData: Print) => {
    //     return <ProgressBar value={rowData.status} showValue={false} style={{ height: '6px' }}></ProgressBar>;
    // };

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
            <div className="flex flex-wrap gap-2 justify-content-between align-items-center">
                <h4 className="m-0" style={{ fontSize: '16px' }}>Lịch sử in</h4>
                <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Tìm kiếm" />
            </div>
        );
    };

    const dateBodyTemplate = (rowData: Print) => {
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

    const statusBodyTemplate = (rowData: Print) => {
        return <Tag value={rowData.status ? "Đã in" : "Chưa in"} severity={getSeverity(rowData.status)} />;
    };

    const paidBodyTemplate = (rowData: Print) => {
        return <Tag value={rowData.paid ? "Đã thanh toán" : "Chưa thanh toán"} severity={getSeverity(rowData.paid)} />;
    };

    const header = renderHeader();

    return (
        <div>
            <div className='grid'>
                <div className='col-12 lg:col-6 xl:col-6'>
                    <Card>
                        <div className='flex justify-content-between'>
                            <div>
                                <span className="block text-500 font-medium mb-3">Số bản in hoàn thành</span>
                                <div className="text-900 font-medium text-xl">10</div>
                            </div>
                            <Button icon="pi pi-clone" rounded text severity="help" size='large' />
                        </div>
                        <p style={{
                            color: 'white',
                            fontSize: '14px',
                            marginTop: '5px',
                            fontStyle: 'italic'
                        }}>Đã sử dụng 10</p>
                    </Card>
                </div>
                <div className='col-12 lg:col-6 xl:col-6'>
                    <Card>
                        <div className='flex justify-content-between'>
                            <div>
                                <span className="block text-500 font-medium mb-3">Số lượng A4</span>
                                <div className="text-900 font-medium text-xl">50</div>
                            </div>
                            <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-clone text-purple-500 text-xl" />
                            </div>
                        </div>
                        <p style={{
                            fontSize: '14px',
                            marginTop: '5px',
                            fontStyle: 'italic',
                            color: 'green'
                        }}>Đã sử dụng 10</p>
                    </Card>
                </div>
            </div>

            <div className="card">
                <DataTable value={prints} paginator header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['name', 'status']}
                    emptyMessage="Không có bản in gần đây." currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}">
                    <Column
                        field="name"
                        header="Tên bản in"
                        sortable
                        // filter filterPlaceholder="Search by name" 
                        style={{ minWidth: '10rem' }}
                    />
                    <Column
                        field="date"
                        header="Ngày nhận"
                        sortable
                        filterField="date" dataType="date"
                        style={{ minWidth: '8rem' }}
                        body={dateBodyTemplate}
                        // filter 
                        filterElement={dateFilterTemplate}
                    />
                    <Column
                        field="location"
                        header="Địa điểm nhận"
                        sortable
                        // filter filterPlaceholder="Search by name" 
                        style={{ minWidth: '8rem' }}
                    />
                    <Column
                        header="Thanh toán"
                        sortable
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '8rem' }}
                        body={paidBodyTemplate}
                    // filter filterElement={paidFilterTemplate} 
                    />
                    <Column
                        header="Trạng thái"
                        sortable
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '8rem' }}
                        body={statusBodyTemplate}
                    // filter filterElement={statusFilterTemplate} 
                    />
                </DataTable>

            </div>
        </div >
    );
};

export default HomePage;