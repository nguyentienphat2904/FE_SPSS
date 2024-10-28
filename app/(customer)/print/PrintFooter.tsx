'use client'
import React, { useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

import { resetState, adjustReset } from '@/redux/print.slice'

export default function PrintFooter() {

    const toast = useRef<Toast | null>(null);

    const dispatch = useDispatch();
    const reset = useSelector((state: any) => state.print.reset);
    const amount = useSelector((state: any) => state.print.amount);
    const range = useSelector((state: any) => state.print.range);
    const size = useSelector((state: any) => state.print.size);
    const orient = useSelector((state: any) => state.print.orient);
    const place = useSelector((state: any) => state.print.place);
    const date = useSelector((state: any) => state.print.date);
    const oneSide = useSelector((state: any) => state.print.oneSide);
    const printColor = useSelector((state: any) => state.print.printColor);

    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState('CONFIRM');
    const [dialogHeader, setDialogHeader] = useState('Xác nhận cấu hình');

    const handleCancleBtn = () => {
        setVisible(true);
        setAction('CANCEL');
        setDialogHeader('Huỷ cấu hình');
    }

    const handleConfirmBtn = () => {
        if (!size || !orient || !place || !date) {
            toast.current?.show({
                severity: 'error',
                summary: 'Lỗi',
                detail: `Thiếu 
                    ${(size) ? '' : 'Khổ giấy '}
                    ${(orient) ? '' : 'Hướng giấy '}
                    ${(place) ? '' : 'Nơi nhận '}
                    ${(date) ? '' : 'Ngày nhận '}
                    `,
                life: 3000
            });
            return;
        }
        setVisible(true);
        setAction('CONFIRM');
        setDialogHeader('Xác nhận cấu hình');
    }

    const cancelConfig = () => {
        dispatch(adjustReset(true));
        dispatch(resetState());
        toast.current?.show({ severity: 'warn', summary: 'Huỷ', detail: 'Huỷ đăng ký in', life: 3000 });
    }

    const confirmConfig = () => {
        dispatch(adjustReset(true));
        dispatch(resetState());
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Thành công đăng ký in', life: 3000 });
    }

    const yesOnClick = () => {
        switch (action) {
            case 'CONFIRM':
                confirmConfig();
                setVisible(false);
                break;

            case 'CANCEL':
                cancelConfig();
                setVisible(false);
                break;

            default:
                break;
        }
    }

    const dialogFooter = (
        <div>
            <Button label="Không" icon="pi pi-times" onClick={() => setVisible(false)} className="p-button-text" />
            <Button label="Có" icon="pi pi-check" onClick={yesOnClick} autoFocus />
        </div>
    );

    return (
        <div>
            <Toast ref={toast}></Toast>
            <Dialog
                header={dialogHeader} visible={visible} onHide={() => setVisible(false)}
                className="print-dialog" breakpoints={{ '1536px': '50vw', '960px': '75vw', '641px': '100vw' }}
                footer={dialogFooter}>
                {action === 'CANCEL' ?
                    (
                        <div className="print-confirmation-content">
                            <i
                                className="pi pi-exclamation-triangle mr-3"
                                style={{ fontSize: "2rem" }}
                            ></i>
                            <span>
                                Bạn có muốn huỷ các cấu hình?
                            </span>
                        </div>
                    ) : (
                        <div>
                            <div className="print-confirmation-content">
                                <i
                                    className="pi pi-exclamation-triangle mr-3"
                                    style={{ fontSize: "2rem" }}
                                ></i>
                                <span>
                                    Bạn có muốn xác nhận các cấu hình?
                                </span>
                            </div>
                            <div className="print-confirm-data ml-6 mt-3">
                                <div className="print-confirm-row">
                                    <label>Số lượng</label> <span>{amount}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>Trang in</label> <span>{range}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>Khổ giấy</label> <span>{size}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>Hướng giấy</label> <span>{orient}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>Nơi nhận</label> <span>{place}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>Ngày nhận</label> <span>{date}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>In 1 mặt</label> <span>{oneSide ? 'Có' : 'Không'}</span>
                                </div>
                                <div className="print-confirm-row">
                                    <label>In màu</label> <span>{printColor ? 'Có' : 'Không'}</span>
                                </div>
                            </div>
                        </div>
                    )
                }
            </Dialog>
            <div className='print-footer'>
                <Button label="Huỷ" severity="danger" outlined onClick={handleCancleBtn} />
                <Button label="Xác nhận" severity="info" outlined onClick={handleConfirmBtn} />
            </div>
        </div>
    )
}
