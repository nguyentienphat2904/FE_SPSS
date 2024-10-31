'use client'
import React, { useState, useEffect, useRef } from 'react';
import { classNames } from 'primereact/utils';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton, RadioButtonChangeEvent } from 'primereact/radiobutton';
import { InputNumber, InputNumberValueChangeEvent } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';
import UploadImage from './component/UploadImage';

import './printer.scss'
import { SampleData } from './service/SampleData'

interface Printer {
    id: string | null,
    name: string,
    company: string,
    type: string,
    numOfPrint: number,
    status: boolean,
    activate: boolean
}

export default function PrintsPage() {
    let emptyPrinter: Printer = {
        id: null,
        name: '',
        company: '',
        type: '',
        numOfPrint: 0,
        status: false,
        activate: false
    }

    const [printers, setPrinters] = useState<Printer[]>([]);
    const [printer, setPrinter] = useState<Printer>(emptyPrinter);

    const [newPrinterDialog, setNewPrinterDialog] = useState<boolean>(false);
    const [deletePrinterDialog, setDeletePrinterDialog] = useState<boolean>(false);
    const [deletePrintersDialog, setDeletePrintersDialog] = useState<boolean>(false);

    const [selectedPrinters, setSelectedPrinters] = useState<Printer[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        type: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        numOfPrint: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
    })
    const [globalFilterValue, setGlobalFilterValue] = useState<string>('');

    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<Printer[]>>(null);

    const getSeverity = (status: boolean) => {
        switch (status) {
            case true:
                return 'success';

            case false:
                return 'danger';
        }
    };

    useEffect(() => {
        SampleData.getFullData().then((data) => setPrinters(data));
    }, []);

    const openNew = () => {
        setPrinter(emptyPrinter);
        setSubmitted(false);
        setNewPrinterDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setNewPrinterDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeletePrinterDialog(false);
    };

    const hideDeleteProductsDialog = () => {
        setDeletePrintersDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);

        if (printer.name.trim()) {
            let _printers = [...printers];
            let _printer = { ...printer };

            if (printer.id) {
                const index = findIndexById(printer.id);

                _printers[index] = _printer;
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Cập nhật thông tin thành công',
                    life: 3000
                });
            } else {
                _printer.id = createId();
                // _printer.image = 'product-placeholder.svg';
                _printers.push(_printer);
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Tạo máy in mới thành công',
                    life: 3000
                });
            }

            setPrinters(_printers);
            setNewPrinterDialog(false);
            setPrinter(emptyPrinter);
        }
    };

    const editProduct = (printer: Printer) => {
        setPrinter({ ...printer });
        setNewPrinterDialog(true);
    };

    const confirmDeleteProduct = (printer: Printer) => {
        setPrinter(printer);
        setDeletePrinterDialog(true);
    };

    const deletePrinter = () => {
        let _printers = printers.filter((val) => val.id !== printer.id);

        setPrinters(_printers);
        setDeletePrinterDialog(false);
        setPrinter(emptyPrinter);
        toast.current?.show({
            severity: 'success',
            summary: 'Successful',
            detail: 'Xóa máy in thành công',
            life: 3000
        });
    };

    const findIndexById = (id: string) => {
        let index = -1;

        for (let i = 0; i < printers.length; i++) {
            if (printers[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const createId = (): string => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }

        return id;
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const confirmDeleteSelected = () => {
        setDeletePrintersDialog(true);
    };

    const deleteSelectedProducts = () => {
        let _products = printers.filter((val) => !selectedPrinters.includes(val));

        setPrinters(_products);
        setDeletePrintersDialog(false);
        setSelectedPrinters([]);
        toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    };

    const onCategoryChange = (e: RadioButtonChangeEvent) => {
        let _printer = { ...printer };

        // _printer['category'] = e.value;
        setPrinter(_printer);
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _printer = { ...printer };

        // @ts-ignore
        _printer[name] = val;

        setPrinter(_printer);
    };

    const onInputTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...printer };

        // @ts-ignore
        _product[name] = val;

        setPrinter(_product);
    };

    const onInputNumberChange = (e: InputNumberValueChangeEvent, name: string) => {
        const val = e.value ?? 0;
        let _product = { ...printer };

        // @ts-ignore
        _product[name] = val;

        setPrinter(_product);
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

    const statusBodyTemplate = (rowData: Printer) => {
        return <Tag
            value={rowData.status ? "Đã kích hoạt" : "Chưa kích hoạt"}
            severity={getSeverity(rowData.status)}
        />;
    };

    const actionBodyTemplate = (rowData: Printer) => {
        return (
            <React.Fragment>
                <Button
                    icon="pi pi-pencil"
                    rounded
                    outlined
                    className="mr-2"
                    onClick={() => editProduct(rowData)}
                    style={{
                        padding: '12px',
                        height: '5px',
                        width: '5px'
                    }}
                />
                <Button
                    icon="pi pi-trash"
                    rounded
                    outlined
                    severity="danger"
                    onClick={() => confirmDeleteProduct(rowData)}
                    style={{
                        padding: '12px',
                        height: '5px',
                        width: '5px'
                    }}
                />
            </React.Fragment>
        );
    };

    const header = (
        <div className='mb-4'>
            <h2 className='mb-4' style={{ color: '#6366f1', fontStyle: 'italic', fontWeight: '700' }}>Quản lý máy in</h2>
            <div className='header'>
                <div className='header-left'>
                    <Button
                        label='Mới'
                        icon='pi pi-plus'
                        className='mr-2'
                        severity='success'
                        size='small'
                        onClick={openNew}
                    ></Button>
                    <Button
                        label='Xóa'
                        icon='pi pi-trash'
                        className='mr-2'
                        severity='danger'
                        size='small'
                        onClick={confirmDeleteSelected} disabled={!selectedPrinters || !selectedPrinters.length}
                    ></Button>
                    <Button
                        label="Export"
                        icon="pi pi-upload"
                        className="p-button-help"
                        onClick={exportCSV}
                        size='small'
                    />
                </div>
                <div className='header-right'>
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

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancel" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deletePrinter} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
        </React.Fragment>
    );

    return (
        <div>
            <Toast ref={toast} />
            <div className="card">
                {header}
                <DataTable ref={dt} value={printers} selection={selectedPrinters}
                    onSelectionChange={(e) => {
                        if (Array.isArray(e.value)) {
                            setSelectedPrinters(e.value);
                        }
                    }}
                    dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]}
                    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                    currentPageReportTemplate="Hiển thị {first} tới {last} trên {totalRecords}"
                    emptyMessage="Không có bản in gần đây."
                    globalFilterFields={['name', 'type', 'numOfPrint']}
                    selectionMode="multiple"
                >
                    <Column selectionMode="multiple" exportable={false}></Column>
                    <Column
                        field="name"
                        header="Tên máy in"
                        sortable
                        style={{ minWidth: '8rem' }}
                    />
                    <Column
                        field="company"
                        header="Hãng"
                        sortable
                        style={{ minWidth: '8rem' }}
                    />
                    <Column
                        field="numOfPrint"
                        header="Số bản in"
                        sortable
                        filterPlaceholder="Search by number"
                        style={{ minWidth: '8rem' }} />
                    <Column
                        header="Trạng thái"
                        sortable
                        filterMenuStyle={{ width: '14rem' }}
                        style={{ minWidth: '8rem' }}
                        body={statusBodyTemplate}
                    />
                    <Column
                        body={actionBodyTemplate}
                        exportable={false}
                        style={{ minWidth: '6rem' }}
                    ></Column>
                </DataTable>
            </div>

            <Dialog
                visible={newPrinterDialog}
                style={{ width: '60rem' }}
                breakpoints={{ '960px': '75vw', '641px': '90vw' }}
                header="Máy in"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                }}>
                    <div style={{ width: '49%' }}>
                        <div className="field">
                            <label htmlFor="name" className="font-bold">
                                Tên máy in
                            </label>
                            <InputText
                                id="name"
                                value={printer.name}
                                onChange={(e) => onInputChange(e, 'name')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !printer.name })}
                            />
                            {submitted && !printer.name && <small className="p-error">Tên máy đã tồn tại.</small>}
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="type" className="font-bold">
                                    Loại
                                </label>
                                <InputText
                                    id="type"
                                    value={printer.type}
                                    onChange={(e) => onInputChange(e, 'type')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.type })}
                                />
                            </div>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="company" className="font-bold">
                                    Hãng
                                </label>
                                <InputText
                                    id="company"
                                    value={printer.company}
                                    onChange={(e) => onInputChange(e, 'company')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.company })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="status" className="font-bold">
                                Tình trạng máy
                            </label>
                            <InputText
                                id="company"
                                value={printer.status ? "Đã kích hoạt" : "Chưa kích hoạt"}
                                onChange={(e) => onInputChange(e, 'company')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !printer.status })}
                            />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="type" className="font-bold">
                                    Ngày mua
                                </label>
                                <InputText
                                    id="type"
                                    value={printer.type}
                                    onChange={(e) => onInputChange(e, 'type')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.type })}
                                />
                            </div>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="company" className="font-bold">
                                    Ngày bảo hành
                                </label>
                                <InputText
                                    id="company"
                                    value={printer.company}
                                    onChange={(e) => onInputChange(e, 'company')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.company })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="note" className="font-bold">
                                Ghi chú
                            </label>
                            <InputText
                                onChange={(e) => onInputChange(e, 'note')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !printer.status })}
                            />
                        </div>
                    </div>

                    <div style={{ width: '49%' }}>
                        <UploadImage />
                    </div>
                </div>

            </Dialog >

            <Dialog visible={deletePrinterDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {printer && (
                        <span>
                            Bạn muốn xóa máy in <b>{printer.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>

            <Dialog visible={deletePrintersDialog} style={{ width: '32rem' }} breakpoints={{ '960px': '75vw', '641px': '90vw' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                    {printer && <span>Bạn muốn xóa những máy in này?</span>}
                </div>
            </Dialog>
        </div >
    );
}
