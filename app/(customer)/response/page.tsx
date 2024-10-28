"use client"
import React, { useEffect, useState } from 'react';
import { Button } from 'primereact/button';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import { DataTable } from 'primereact/datatable';
import { Column, ColumnFilterElementTemplateOptions } from 'primereact/column';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { Dialog } from 'primereact/dialog';
import { InputTextarea } from 'primereact/inputtextarea';
import './response.scss'
import { SampleData } from './service/SampleData';
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { Tag } from 'primereact/tag';

interface ResponseType {
    id: number;
    title: string;
    date: string | Date;
    detail: string;
    reply: string | null;
}

export default function ResponsePage() {
    const [prints, setPrints] = useState<ResponseType[]>([]);
    const [title, setTitle] = useState<string>('');
    const [detail, setDetail] = useState<string>('');
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [reply] = useState<String[]>(['Đã trả lời', 'Chưa trả lời']);
    const [displayCreateDialog, setDisplayCreateDialog] = useState<boolean>(false);
    const [displayDetailDialog, setDisplayDetailDialog] = useState<boolean>(false);
    const [selectedDetail, setSelectedDetail] = useState<ResponseType | null>(null);
    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        number: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        date: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    });

    const getReplyStatus = (reply: boolean) => {
        switch (reply) {
            case true:
                return 'success';

            case false:
                return 'danger';
        }
    };

    useEffect(() => {
        SampleData.getFullData().then((data) => setPrints(getPrints(data)));
    }, []);

    const getPrints = (data: ResponseType[]) => {
        return [...(data || [])].map((d) => {
            d.date = new Date(d.date);
            return d;
        });
    };

    const formatDate = (value: string | Date) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const replyFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Dropdown
            value={options.value}
            options={reply}
            onChange={(e: DropdownChangeEvent) => options.filterCallback(e.value, options.index)}
            itemTemplate={replyItemTemplate}
            placeholder="Select One"
            className="p-column-filter"
            showClear />;
    };

    const replyItemTemplate = (option: boolean) => {
        return <Tag value={option} severity={getReplyStatus(option)} />;
    };

    const replyBodyTemplate = (rowData: ResponseType) => {
        return <Tag value={rowData.reply ? "Đã trả lời" : "Chưa trả lời"} severity={getReplyStatus(!!rowData.reply)} />;
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
                <h2 className='mb-4' style={{ color: '#6366f1', fontStyle: 'italic', fontWeight: '700' }}>Phản hồi</h2>
                <div className='header'>
                    <h6 className="mt-3 header-left">Lịch sử phản hồi</h6>
                    <div className='header-right'>
                        <Button label='Tạo phản hồi' className='mr-4 mb-1' onClick={openCreateDialog}></Button>
                        <InputText
                            value={globalFilterValue}
                            onChange={onGlobalFilterChange}
                            placeholder="Tìm kiếm"
                            style={{
                                marginBottom: '4px',
                                borderRadius: '100px',
                            }}
                        />
                    </div>
                </div>
            </div>
        );
    };

    const dateBodyTemplate = (rowData: ResponseType) => {
        return formatDate(rowData.date);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value}
            onChange={(e: any) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const openCreateDialog = (): void => {
        setDisplayCreateDialog(true);
    };

    const closeCreateDialog = (): void => {
        setDisplayCreateDialog(false);
    };

    const handleConfirm = (): void => {
        console.log(`Tiêu đề của phản hồi: ${title}`);
        console.log(`Nội dung của phản hồi: ${detail}`);
        closeCreateDialog();
    };

    const openDetailDialog = (rowData: ResponseType): void => {
        setSelectedDetail(rowData);
        setDisplayDetailDialog(true);
    };

    const closeDetailDialog = (): void => {
        setDisplayDetailDialog(false);
        setSelectedDetail(null);
    };

    const header = renderHeader();

    return (
        <div>
            <div className="card">
                {header}
                <DataTable value={prints} paginator rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]} dataKey="id"
                    filters={filters} filterDisplay="menu" globalFilterFields={['number', 'date']}
                    emptyMessage="Không có phản hồi gần đây." currentPageReportTemplate="">
                    <Column field="title" header="Tiêu đề" sortable filterPlaceholder="Search by string" style={{ minWidth: '6rem' }} />
                    <Column field="date" header="Thời gian tạo" sortable filterField="date" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                    <Column header="Tình trạng" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={replyBodyTemplate} filterElement={replyFilterTemplate} />
                    <Column
                        header="Chi tiết phản hồi"
                        alignHeader='right'
                        body={(rowData: ResponseType) => (
                            <Button label="Chi tiết" onClick={() => openDetailDialog(rowData)} />
                        )}
                        style={{ textAlign: 'end' }}
                    />
                </DataTable>
            </div>

            <Dialog
                header="Tạo phản hồi mới"
                visible={displayCreateDialog}
                onHide={closeCreateDialog}
                style={{
                    width: '400px',
                }}
            >
                <p>Tiêu đề</p>
                <InputText
                    value={title}
                    onChange={(e) => setTitle(e.target.value || '')}
                    placeholder="Nhập..."
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                    }}
                />
                <p>Nội dung phản hồi</p>
                <InputTextarea
                    value={detail}
                    onChange={(e) => setDetail(e.target.value || '')}
                    placeholder="Nhập..."
                    style={{
                        marginBottom: '1rem',
                        width: '100%',
                        minHeight: '150px',
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Button
                        label="Hủy"
                        icon="pi pi-times"
                        onClick={closeCreateDialog}
                        severity="danger"
                        rounded
                    />
                    <Button
                        label="Xác nhận"
                        icon="pi pi-check"
                        onClick={handleConfirm}
                        severity="success"
                        outlined
                        rounded
                    />
                </div>
            </Dialog>

            <Dialog
                header="Chi tiết phản hồi"
                visible={displayDetailDialog}
                onHide={closeDetailDialog}
                style={{
                    width: '400px',
                }}
            >
                <p><strong>Tiêu đề:</strong> {selectedDetail?.title}</p>
                <p><strong>Thời gian tạo:</strong> {selectedDetail ? formatDate(selectedDetail.date) : ''}</p>
                <p><strong>Chi tiết:</strong> {selectedDetail?.detail}</p>
                <p style={{ borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}><strong>Phản hồi:</strong></p>
                <p className='text-center'>{selectedDetail?.reply || 'Chưa có phản hồi'}</p>
            </Dialog>
        </div>
    );
}