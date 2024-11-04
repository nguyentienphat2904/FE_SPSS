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
import './styles/response.scss'
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

export default function SPSOResponsePage() {
    const [prints, setPrints] = useState<ResponseType[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [reply] = useState<String[]>(['Đã trả lời', 'Chưa trả lời']);
    const [replyInput, setReplyInput] = useState<string>('');
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
                    <h6 className="mt-3 header-left">Danh sách phản hồi</h6>
                    <div className='header-right'>
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

    const handleConfirm = (): void => {
        console.log(`Tiêu đề của phản hồi: ${selectedDetail?.title}`);
        console.log(`Nội dung của phản hồi: ${selectedDetail?.detail}`);
    };

    const openDetailDialog = (rowData: ResponseType): void => {
        setSelectedDetail(rowData);
        setDisplayDetailDialog(true);
    };

    const closeDetailDialog = (): void => {
        setDisplayDetailDialog(false);
        setSelectedDetail(null);
        setReplyInput('');
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
                header="Chi tiết phản hồi"
                visible={displayDetailDialog}
                onHide={closeDetailDialog}
                style={{
                    width: '400px',
                }}
            >
                <p><strong>Tiêu đề:</strong> {selectedDetail?.title}</p>
                <p><strong>Thời gian tạo:</strong> {selectedDetail ? formatDate(selectedDetail.date) : ''}</p>
                <p><strong>Phản hồi:</strong> {selectedDetail?.detail}</p>
                <p style={{ borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}><strong>Trả lời:</strong></p>
                <p className='text-center'>{selectedDetail?.reply}</p>

                {!selectedDetail?.reply && selectedDetail &&
                    <>
                        <InputTextarea value={replyInput} onChange={(e) => { setReplyInput(e.target.value) }} className='mb-3 w-full' autoResize rows={10} />
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Button
                                label="Hủy"
                                icon="pi pi-times"
                                onClick={closeDetailDialog}
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
                    </>
                }
            </Dialog>
        </div>
    );
}