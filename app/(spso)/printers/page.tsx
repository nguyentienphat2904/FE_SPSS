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
import { Dropdown, DropdownChangeEvent } from 'primereact/dropdown';
import { InputText } from 'primereact/inputtext';
import { Tag } from 'primereact/tag';
import { FilterMatchMode, FilterOperator } from 'primereact/api';


import UploadImage from './component/UploadImage';

import './printer.scss'

// import { searchPrinter } from './service/printer.js'
import { Printer, Location, formCreate } from './service/const'
import { getLocation, searchPrinter, createPrinter, delPrinter, updatePrinter } from '@/app/api/spso/printer';


export default function PrintsPage() {
    let emptyPrinter: Printer = {
        id: null,
        name: '',
        brand: '',
        active: false,
        locationId: '',
        createdAt: new Date(),
        updatedAt: new Date(),
        location: {
            id: '',
            block: '',
            room: '',
            branch: ''
        }
    }

    let emptyFormData: formCreate = {
        name: '',
        brand: '',
        active: false,
        locationId: ''
    }

    const [printers, setPrinters] = useState<Printer[]>([]);
    const [printer, setPrinter] = useState<Printer>(emptyPrinter);
    const [locations, setLocations] = useState<Location[]>([]);
    const [selectedLocation, setSelectedLocation] = useState<Location>();
    const [customizeLocation, setCustomizeLocation] = useState<Location[]>([]);
    const [openUpdate, setOpenUpdate] = useState<boolean>(false);

    const [newPrinterDialog, setNewPrinterDialog] = useState<boolean>(false);
    const [deletePrinterDialog, setDeletePrinterDialog] = useState<boolean>(false);
    const [deletePrintersDialog, setDeletePrintersDialog] = useState<boolean>(false);

    const [selectedPrinters, setSelectedPrinters] = useState<Printer[]>([]);
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [active, setActive] = useState<boolean>(false);

    const [formData, setFormData] = useState<formCreate>(emptyFormData);

    const optionsActive = [
        { label: 'Đã kích hoạt', value: true },
        { label: 'Chưa kích hoạt', value: false }
    ];

    const [filters, setFilters] = useState<any>({
        global: { value: '', matchMode: FilterMatchMode.CONTAINS },
        name: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
        brand: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
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
        const fetchData = async () => {
            try {
                const response = await searchPrinter();
                if (response.data) {
                    setPrinters(response.data);
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
            }
        }
        fetchData();
    }, [])

    const customizeLocations = (locations: Location[]) => {
        return locations.map(location => ({
            ...location,
            displayName: `${location.room} - ${location.block} - ${location.branch}`
        }));
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getLocation();
                if (response.data) {
                    setLocations(response.data)
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
            }
        }
        fetchData();
    }, [])

    useEffect(() => {
        const updatedLocations = customizeLocations(locations);
        setCustomizeLocation(updatedLocations);
    }, [locations]);

    // console.log(customizeLocation);
    // console.log(printers[0]?.createdAt, locations);



    // const customizedLocations = locations.map(location => ({
    //     ...location,
    //     displayName: `${location.room} - ${location.block} - ${location.branch}`
    // }));

    const formatDate = (value: string | Date) => {
        return new Date(value).toLocaleDateString('en-US', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

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

    const saveProduct = async () => {
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

        if (!openUpdate) {
            // console.log("formData: ", formData);
            const create = await createPrinter(formData);
            if (create.data) {
                setFormData(emptyFormData);
            }
        } else {
            // console.log("data hienn tai: ", printer);
            const { id, name, brand, active, locationId } = printer;
            const newData = { id, name, brand, active, locationId }
            // console.log("Sua: ", newData);
            const update = await updatePrinter(newData?.id, newData);
            setOpenUpdate(false);
        }
    };

    const editProduct = (rowData: Printer) => {
        setPrinter({ ...rowData });

        const matchedLocation = customizeLocation?.find(location => location.id === rowData.location.id);
        setSelectedLocation(matchedLocation);
        setActive(rowData.active);
        setOpenUpdate(true);
        setNewPrinterDialog(true);
    };


    const confirmDeleteProduct = (printer: Printer) => {
        setPrinter(printer);
        setDeletePrinterDialog(true);
    };

    const deletePrinter = async () => {
        let _printers = printers.filter((val) => val.id !== printer.id);
        let _id = printer.id;
        let response = await delPrinter(_id);
        if (response) {

        }
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

    // const deleteSelectedProducts = () => {
    //     let _products = printers.filter((val) => !selectedPrinters.includes(val));

    //     setPrinters(_products);
    //     setDeletePrintersDialog(false);
    //     setSelectedPrinters([]);
    //     toast.current?.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    // };

    const deleteSelectedProducts = async () => {
        try {
            // Thực hiện các request xóa và bỏ qua lỗi
            const results = await Promise.allSettled(
                selectedPrinters.map(async (_printer) => delPrinter(_printer.id))
            );

            // Lọc danh sách local sau khi hoàn thành
            const _products = printers.filter((val) => !selectedPrinters.includes(val));
            setPrinters(_products);
            setDeletePrintersDialog(false);
            setSelectedPrinters([]);

            // Hiển thị thông báo thành công
            toast.current?.show({
                severity: "success",
                summary: "Successful",
                detail: "Products Deleted",
                life: 3000
            });
        } catch (error) {
            console.error("Unexpected error:", error);
        }
    };

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _printer = { ...printer };
        let _form = { ...formData };

        // @ts-ignore
        _printer[name] = val;

        setPrinter(_printer);

        // @ts-ignore
        _form[name] = val;
        setFormData(_form);
    };

    const onInputTextAreaChange = (e: React.ChangeEvent<HTMLTextAreaElement>, name: string) => {
        const val = (e.target && e.target.value) || '';
        let _product = { ...printer };

        // @ts-ignore
        _product[name] = val;

        setPrinter(_product);
    };

    const handleActiveChange = (e: DropdownChangeEvent) => {
        setActive(e.value);
        const data = e.value;
        // console.log(data);
        let _product = { ...printer };
        let _form = { ...formData }

        // @ts-ignore
        const activeID = 'active';
        _product[activeID] = data;
        _form[activeID] = data;

        setPrinter(_product);
        setFormData(_form);
    };

    const handleLocationChange = (e: DropdownChangeEvent) => {
        setSelectedLocation(e.value);
        const data = e.value;
        const { branch, ...rest } = data;

        let _product = { ...printer };
        let _form = { ...formData };

        // @ts-ignore
        // _product[locationId] = rest.id;
        // _product[location] = rest;

        // Đảm bảo locationId và location là các biến được khai báo
        const locationIdKey = 'locationId'; // Thay bằng key thực tế nếu cần
        const locationKey = 'location'; // Thay bằng key thực tế nếu cần

        // Cập nhật printer với rest.id và rest
        _product[locationIdKey] = rest.id;
        _product[locationKey] = rest;
        setPrinter(_product);

        _form[locationIdKey] = rest.id;
        setFormData(_form);
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

    const locationBodyTemplate = (rowData: Printer) => {
        return rowData.location.room + " - " + rowData.location.block;
    };

    const statusBodyTemplate = (rowData: Printer) => {
        return <Tag
            value={rowData.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
            severity={getSeverity(rowData.active)}
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
                        label="Xuất"
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
            <Button label="Hủy bỏ" icon="pi pi-times" outlined onClick={hideDialog} />
            <Button label="Lưu" icon="pi pi-check" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="Thoát" icon="pi pi-times" outlined onClick={hideDeleteProductDialog} />
            <Button label="Đồng ý" icon="pi pi-check" severity="danger" onClick={deletePrinter} />
        </React.Fragment>
    );
    const deleteProductsDialogFooter = (
        <React.Fragment>
            <Button label="Thoát" icon="pi pi-times" outlined onClick={hideDeleteProductsDialog} />
            <Button label="Đồng ý" icon="pi pi-check" severity="danger" onClick={deleteSelectedProducts} />
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
                    globalFilterFields={['name', 'brand', 'location.room', 'location.branch', 'location.block']} filters={filters}
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
                        field="brand"
                        header="Hãng"
                        sortable
                        style={{ minWidth: '8rem' }}
                    />
                    <Column
                        header="Vị trí"
                        sortable
                        filterPlaceholder="Search by number"
                        style={{ minWidth: '8rem' }}
                        body={locationBodyTemplate} />
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
                header="Máy in"
                modal
                className="p-fluid"
                footer={productDialogFooter}
                onHide={hideDialog}
            >
                <div className='popup-info'>
                    <div className='popup-info-left'>
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
                                <label htmlFor="location" className="font-bold">
                                    Vị trí
                                </label>
                                {/* <InputText
                                    id="location"
                                    value={printer.location.room + " - " + printer.location.block + " - " + printer.location.branch}
                                    onChange={(e) => onInputChange(e, 'location')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.type })}
                                /> */}
                                <Dropdown
                                    value={selectedLocation}
                                    onChange={handleLocationChange}
                                    options={customizeLocation}
                                    optionLabel="displayName"
                                />
                            </div>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="brand" className="font-bold">
                                    Hãng
                                </label>
                                <InputText
                                    id="brand"
                                    value={printer.brand}
                                    onChange={(e) => onInputChange(e, 'brand')}
                                    required
                                    autoFocus
                                    className={classNames({ 'p-invalid': submitted && !printer.brand })}
                                />
                            </div>
                        </div>

                        <div className="field">
                            <label htmlFor="status" className="font-bold">
                                Tình trạng máy
                            </label>
                            {/* <InputText
                                id="company"
                                value={printer.active ? "Đã kích hoạt" : "Chưa kích hoạt"}
                                onChange={(e) => onInputChange(e, 'company')}
                                required
                                autoFocus
                                className={classNames({ 'p-invalid': submitted && !printer.active })}
                            /> */}

                            <Dropdown
                                value={active}
                                options={optionsActive}
                                onChange={handleActiveChange}
                                placeholder="Chọn trạng thái"
                                optionLabel="label" // Hiển thị nhãn (label) trong dropdown
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
                                    id="create"
                                    value={formatDate(printer.createdAt)}
                                    required
                                    autoFocus
                                />
                            </div>
                            <div className="field" style={{ width: '48%' }}>
                                <label htmlFor="company" className="font-bold">
                                    Ngày bảo hành
                                </label>
                                <InputText
                                    id="update"
                                    value={formatDate(printer.updatedAt)}
                                    onChange={(e) => onInputChange(e, 'company')}
                                    required
                                    autoFocus
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
                            />
                        </div>
                    </div>

                    <div className='popup-info-right'>
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
