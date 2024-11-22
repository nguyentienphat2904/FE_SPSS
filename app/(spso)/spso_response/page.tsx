"use client"
import React, { useEffect, useState, useRef } from 'react';
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
import { Toast } from 'primereact/toast';

import { IResponse } from './service/const';
import { getResponses, createResponse, updateResponse, getResponseByFeedbackIdAndSPSOId } from '@/app/api/response/response';
import { getFeedbackAndResponse, getFeedbacks } from '@/app/api/feedback/feedback';
import { Feedback } from '@/app/(customer)/response/service/const';

export default function SPSOResponsePage() {
    const [prints, setPrints] = useState<Feedback[]>([]);
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');
    const [reply] = useState<String[]>(['Đã trả lời', 'Chưa trả lời']);
    const [replyInput, setReplyInput] = useState<string>('');
    const [displayDetailDialog, setDisplayDetailDialog] = useState<boolean>(false);
    const [selectedDetail, setSelectedDetail] = useState<Feedback | null>(null);
    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        customerId: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
        createdAt: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.CONTAINS }] },
    });
    const [response, setResponse] = useState<IResponse | null>(null);

    const toast = useRef<Toast | null>(null);

    const getReplyStatus = (reply: boolean | IResponse | null) => {
        switch (reply) {
            case null:
                return 'danger';

            default:
                return 'success';
        }
    };

    useEffect(() => {
        // SampleData.getFullData().then((data) => setPrints(getPrints(data)));
        const getResponseList = async () => {
            try {
                const response = await getFeedbackAndResponse();
                setPrints(response);
            } catch (error: any) {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Lỗi',
                    detail: error.message,
                });
            }
        }
        getResponseList();
    }, []);

    const getPrints = (data: Feedback[]) => {
        return [...(data || [])].map((d) => {
            d.createdAt = new Date(d.createdAt);
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

    const replyBodyTemplate = (rowData: Feedback) => {
        return <Tag value={rowData.response ? "Đã trả lời" : "Chưa trả lời"} severity={getReplyStatus(rowData.response)} />;
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

    const dateBodyTemplate = (rowData: Feedback) => {
        return formatDate(rowData.createdAt);
    };

    const dateFilterTemplate = (options: ColumnFilterElementTemplateOptions) => {
        return <Calendar value={options.value}
            onChange={(e: any) => options.filterCallback(e.value, options.index)}
            dateFormat="mm/dd/yy" placeholder="mm/dd/yyyy" mask="99/99/9999" />;
    };

    const handleConfirm = async () => {
        // console.log(`Tiêu đề của phản hồi: ${selectedDetail?.title}`);
        // console.log(`Nội dung của phản hồi: ${selectedDetail?.content}`);
        try {
            const response = await createResponse(replyInput, selectedDetail?.id || '');
            toast.current?.show({
                severity: 'success',
                summary: 'Thành công',
                detail: response.message,
            });
            const updateFeedbackList = prints.map((feedback: Feedback) => {
                if (feedback.id === response.data.feedbackId) {
                    return {
                        ...feedback,
                        response: response.data
                    }
                }
                return feedback;
            });
            setPrints([...updateFeedbackList]);
            setDisplayDetailDialog(false);
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message,
            });
        }
    };

    const openDetailDialog = async (rowData: Feedback) => {
        try {
            setSelectedDetail(rowData);
            setDisplayDetailDialog(true);
            setResponse(rowData.response);
        } catch (error: any) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: error.message,
            });
        }
    };

    const closeDetailDialog = (): void => {
        setDisplayDetailDialog(false);
        setSelectedDetail(null);
        setReplyInput('');
    };

    const header = renderHeader();
    return (
        <div>
            <Toast ref={toast}></Toast>
            <div className="card">
                {header}
                <DataTable value={prints} paginator rows={10}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    rowsPerPageOptions={[10, 25, 50]}
                    filters={filters} filterDisplay="menu" globalFilterFields={['createdAt', 'customerId']}
                    emptyMessage="Không có phản hồi gần đây." currentPageReportTemplate=""
                    scrollable scrollHeight='500px' removableSort>
                    {/*<Column field="title" header="Tiêu đề" sortable filterPlaceholder="Search by string" style={{ minWidth: '6rem' }} />*/}
                    <Column field="createdAt" header="Thời gian tạo" sortable filterField="createdAt" dataType="date" style={{ minWidth: '12rem' }} body={dateBodyTemplate} filterElement={dateFilterTemplate} />
                    <Column field="customerId" header="Mã người dùng" sortable />
                    <Column header="Tình trạng" sortable filterMenuStyle={{ width: '14rem' }} style={{ minWidth: '12rem' }} body={replyBodyTemplate} filterElement={replyFilterTemplate} />
                    <Column
                        header="Chi tiết phản hồi"
                        alignHeader='right'
                        body={(rowData: Feedback) => (
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
                    minWidth: '50vw',
                    maxWidth: '75vw'
                }}
            >
                {/* <p><strong>Tiêu đề:</strong> {selectedDetail?.title}</p> */}
                <p><strong>Thời gian tạo:</strong> {selectedDetail ? formatDate(selectedDetail.createdAt) : ''}</p>
                <p><strong>Mã khách hàng:</strong> {selectedDetail?.customerId || 'N/A'}</p>
                <p>
                    <strong>Chi tiết:</strong>
                    <br />
                    {selectedDetail?.content
                        ? selectedDetail?.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))
                        : 'N/A'}
                </p>
                <p style={{ borderTop: '1px solid #e0e0e0', paddingTop: '8px' }}><strong>Trả lời:</strong></p>
                <p><strong>Thời gian tạo:</strong> {response ? formatDate(response.createdAt) : 'N/A'}</p>
                <p><strong>SPSO ID:</strong> {response?.spsoId || 'N/A'}</p>
                <p>
                    <strong>Nội dung:</strong>
                    <br />
                    {response?.content
                        ? response.content.split('\n').map((line, index) => (
                            <React.Fragment key={index}>
                                {line}
                                <br />
                            </React.Fragment>
                        ))
                        : 'N/A'}
                </p>

                {!response &&
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
        </div >
    );
}