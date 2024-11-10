'use client'
import React, { useState } from 'react'

import { FilterMatchMode, FilterOperator } from 'primereact/api'

import { DataTable, DataTableFilterMeta, DataTableRowClickEvent } from 'primereact/datatable'
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column'
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag'
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown'
import { Dialog } from 'primereact/dialog'
// import { IconField } from 'primereact/iconfield';
// import { InputIcon } from 'primereact/inputicon';

import { PrintOrderData } from './const'
import { Button } from 'primereact/button'

interface IPrintOrder {
    id: string,
    name: string,
    date: string | Date,
    place: string,
    status: string
}

export default function PrintOrder() {

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

    const onGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };

    const [statuses] = useState<string[]>([
        'Chưa in',
        'Đã in',
    ]);

    const [detailVisible, setDetailVisible] = useState<boolean>(false);

    const [detail, setDetail] = useState<any>();

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
            case 'Đã in':
                return 'success';

            case 'Chưa in':
                return 'danger';

            default:
                return null;
        }
    };

    const renderStatus = (rowData: IPrintOrder) => {
        return (
            <Tag value={rowData.status} severity={getSeverity(rowData.status)} />
        );
    }

    const renderAction = (rowData: IPrintOrder) => {
        if (rowData.status === 'Chưa in')
            return (
                <Button size='small' icon='pi pi-print' text rounded></Button>
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

    return (
        <div>
            <DataTable value={PrintOrderData} header={renderHeader} dataKey='id' rows={10}
                filters={filters}
                filterDisplay="menu"
                globalFilterFields={[
                    'name',
                    'date',
                    'place',
                    'status',
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
                <Column field='name' header="Bản in" sortable style={{ minWidth: '10rem' }}></Column>
                <Column field='date' header="Ngày nhận" sortable style={{ minWidth: '8rem' }}></Column>
                <Column field='place' header="Nơi nhận" sortable style={{ minWidth: '8rem' }}></Column>
                <Column field='status' body={renderStatus} header="Trạng thái in" sortable style={{ minWidth: '8rem' }}
                    filter showFilterMatchModes={false} showFilterOperator={false} filterElement={statusFilterTemplate} ></Column>
                <Column body={renderAction} header="Thao tác" style={{ minWidth: '8rem' }}></Column>
            </DataTable>
            <Dialog visible={detailVisible} onHide={() => setDetailVisible(false)} header="Thông tin chi tiết"
                className='dashboard-body-dialog' breakpoints={{ '1536px': '50vw', '960px': '75vw', '641px': '100vw' }}>
                <div>
                    {detail ?
                        (
                            <div>
                                <ul>
                                    <li>{detail.user?.firstName} {detail.user?.lastName}</li>
                                    <li>{detail.name}</li>
                                    <li>{detail.date}</li>
                                    <li>{detail.place}</li>
                                    <li>{detail.status}</li>
                                    <li>{detail.paid}</li>
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
        </div>
    )
}
