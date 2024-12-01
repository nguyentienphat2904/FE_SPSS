"use client"
import React, { useEffect, useState, useRef } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Slider, SliderChangeEvent } from 'primereact/slider';
import { Tag } from 'primereact/tag';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Toast } from 'primereact/toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import './home.scss'

import { PrintingOrder } from '@/app/(spso)/dashboard/const';
import { searchDocName, searchPrinterOrder } from '@/app/api/spso/dashboard';
import { getUserInfo } from '@/app/api/home/home';

const HomePage = () => {
    const userType = useSelector((state: RootState) => state.auth.userInfo?.type);

    const toast = useRef<Toast>(null);
    const [PrintingOrder, setPrintingOrder] = useState<PrintingOrder[]>([]);
    const [isPrintingOrderLoaded, setIsPrintingOrderLoaded] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [countSuccess, setCountSuccess] = useState(0);
    const [extraPages, setExtraPages] = useState<number>(0);

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

    const getSeverity = (status: string) => {
        switch (status) {
            case 'PENDING':
                return 'danger';
            case 'PAID':
                return 'success';
            case 'SUCCESS':
                return 'success';
            default:
                return 'warning';
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await searchPrinterOrder();
                const userInfo = await getUserInfo();
                setExtraPages(userInfo.data.extraPages);
                if (response.data) {
                    setPrintingOrder(response.data);
                    let count = 0;
                    response?.data?.forEach((p: PrintingOrder) => {
                        if (p.printingStatus === 'SUCCESS') count++;
                    })
                    setCountSuccess(count);
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

    if (userType === 'customer') {
        if (!isLoading) return <div></div>
    } else return <div>Không được phép truy cập.</div>

    const getPrints = (data: PrintingOrder[]) => {
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

    const statusItemTemplate = (option: string) => {
        return <Tag value={option} severity={getSeverity(option)} />;
    };

    const paidItemTemplate = (option: string) => {
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

    const dateBodyTemplate = (rowData: PrintingOrder) => {
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

    const statusBodyTemplate = (rowData: PrintingOrder) => {
        return <Tag value={rowData.printingStatus} severity={getSeverity(rowData.printingStatus)} />;
    };

    const paidBodyTemplate = (rowData: PrintingOrder) => {
        return <Tag value={rowData.purchasingStatus} severity={getSeverity(rowData.purchasingStatus)} />;
    };

    const header = renderHeader();

    return (
        <div>
            <Toast ref={toast}></Toast>
            <div className='grid'>
                <div className='col-12 lg:col-6 xl:col-6'>
                    <Card>
                        <div className='flex justify-content-between'>
                            <div>
                                <span className="block text-500 font-medium mb-3">Số bản in hoàn thành</span>
                                <div className="text-900 font-medium text-xl">{countSuccess}</div>
                            </div>
                            <Button icon="pi pi-clone" rounded text severity="help" size='large' />
                        </div>
                    </Card>
                </div>
                <div className='col-12 lg:col-6 xl:col-6'>
                    <Card>
                        <div className='flex justify-content-between'>
                            <div>
                                <span className="block text-500 font-medium mb-3">Số lượng A4</span>
                                <div className="text-900 font-medium text-xl">{extraPages}</div>
                            </div>
                            <div className="flex align-items-center justify-content-center border-round" style={{ width: '2.5rem', height: '2.5rem' }}>
                                <i className="pi pi-clone text-purple-500 text-xl" />
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            <div className="card">
                <DataTable value={PrintingOrder} paginator header={header} rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['documentName', 'status']}
                    emptyMessage="Không có bản in gần đây." currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}">
                    <Column
                        field="documentName"
                        header="Tên bản in"
                        sortable
                        // filter filterPlaceholder="Search by name" 
                        style={{ minWidth: '10rem' }}
                    />
                    <Column
                        field="createdAt"
                        header="Ngày nhận"
                        sortable
                        filterField="date" dataType="date"
                        style={{ minWidth: '8rem' }}
                        body={dateBodyTemplate}
                        // filter 
                        filterElement={dateFilterTemplate}
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