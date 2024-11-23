'use client'
import React, { useState, useRef } from 'react'

import { Toast } from 'primereact/toast';
import {
    FileUpload,
    FileUploadHandlerEvent,
    FileUploadHeaderTemplateOptions,
    FileUploadProps,
    FileUploadSelectEvent,
    FileUploadUploadEvent,
    ItemTemplateOptions
} from 'primereact/fileupload';
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';

import Link from 'next/link';

import { useDispatch, useSelector } from 'react-redux';
import { setFile } from '@/redux/print.slice';
import { deleteFile, getUserInfo, uploadFile } from '@/app/api/print/print';

export default function PrintViewFile() {

    const dispatch = useDispatch();
    const toast = useRef<Toast>(null);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef<FileUpload>(null);
    const fileRedux = useSelector((state: any) => state.print.file);
    const [notEnoughPage, setNotEnoughPage] = useState<boolean>(false);

    const onTemplateSelect = async (e: FileUploadSelectEvent) => {
        const files = e.files;
        try {
            const selectedFile = e.files[0] as File;
            if (selectedFile.type === 'application/pdf') {
                const response = await uploadFile(selectedFile);
                const userInfo = await getUserInfo();
                if (response.data[0].numPages > userInfo.data.extraPages) {
                    console.log(response.data[0].numPages);
                    const deleteFileResponse = await deleteFile(response.data[0].id);
                    setNotEnoughPage(true);
                    return;
                }

                dispatch(setFile(response.data[0]));
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: response.message });
            }
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: error.message });
        }

        setTotalSize(files[0] ? files[0].size : 0);
    }

    const onTemplateUpload = (e: FileUploadUploadEvent) => {
        let _totalSize = 0;

        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current?.show({ severity: 'info', summary: 'Success', detail: 'File Uploaded' });
    }

    const onTemplateRemove = async (file: File, callback: Function) => {
        try {
            if (fileRedux) {
                const response = await deleteFile(fileRedux.id);
                if (response.success) {
                    dispatch(setFile(null));
                }
                toast.current?.show({ severity: 'success', summary: 'Thành công', detail: response.message });
                setTotalSize(totalSize - file.size);
                callback();
            }
        } catch (error: any) {
            toast.current?.show({ severity: 'error', summary: 'Lỗi', detail: error.message });
        }
    };

    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options: FileUploadHeaderTemplateOptions) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize / 10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{ backgroundColor: 'transparent', display: 'flex', alignItems: 'center' }}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <div className="flex align-items-center gap-3 ml-auto">
                    <span>{formatedValue} / 50 MB</span>
                    <ProgressBar value={value} showValue={false} style={{ width: '10rem', height: '12px' }}></ProgressBar>
                </div>
            </div>
        );
    };

    const itemTemplate = (inFile: object, props: ItemTemplateOptions) => {
        const file = inFile as File;

        if (file.type !== 'application/pdf') return (<></>);

        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center">
                    {/* <img alt={file.name} role="presentation" src={file.objectURL} width={100} /> */}
                    <span className="flex flex-column text-left mx-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        );
    };

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-file mt-3 p-5" style={{ fontSize: '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)' }}></i>
                <span style={{ fontSize: '1.2em', color: 'var(--text-color-secondary)' }} className="my-5">
                    Kéo và thả file tại đây
                </span>
            </div>
        );
    };

    const notEnoughPageFooter = (
        <div>
            <Button label='Huỷ' outlined severity='danger' onClick={() => setNotEnoughPage(false)}></Button>
            <Link href='/purchase'>
                <Button label='Chuyển' severity='info'></Button>
            </Link>
        </div>
    );

    const chooseOptions = { icon: 'pi pi-fw pi-file', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined' };
    const uploadOptions = { icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'hidden' };
    const cancelOptions = { icon: 'pi pi-fw pi-times', iconOnly: true, className: 'hidden' };

    return (
        <div className='print-file-upload-box'>
            <Toast ref={toast}></Toast>

            <FileUpload className='w-full h-full' name="pdfFile" accept="application/pdf"
                ref={fileUploadRef} multiple={false} maxFileSize={50000000}
                onSelect={onTemplateSelect} onError={onTemplateClear} onClear={onTemplateClear}
                headerTemplate={headerTemplate} itemTemplate={itemTemplate} emptyTemplate={emptyTemplate}
                chooseOptions={chooseOptions} uploadOptions={uploadOptions} cancelOptions={cancelOptions} />
            <Dialog header={'Không đủ giấy'} visible={notEnoughPage} onHide={() => setNotEnoughPage(false)}
                footer={notEnoughPageFooter} style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                <div className="print-confirmation-content">
                    <i
                        className="pi pi-exclamation-triangle mr-3"
                        style={{ fontSize: "2rem" }}
                    ></i>
                    <span>
                        Không có đủ giấy in! <br />Chuyển hướng đến trang mua giấy in?
                    </span>
                </div>
            </Dialog>
        </div>
    )
}
