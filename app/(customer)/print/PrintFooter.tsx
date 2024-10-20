'use client'
import React, { useRef, useState } from 'react'

import { Toast } from 'primereact/toast'
import { Dialog } from 'primereact/dialog'
import { Button } from 'primereact/button'

export default function PrintFooter() {

    const toast = useRef<Toast | null>(null);

    const [visible, setVisible] = useState(false);
    const [action, setAction] = useState('CONFIRM');

    const cancelConfig = () => {
        toast.current?.show({ severity: 'warn', summary: 'Huỷ', detail: 'Huỷ đăng ký in', life: 3000 });
    }

    const confirmConfig = () => {
        toast.current?.show({ severity: 'success', summary: 'Thành công', detail: 'Thành công đăng ký in', life: 3000 });
    }

    return (
        <div>
            <Toast ref={toast}></Toast>
            <Dialog visible={visible} onHide={() => setVisible(false)} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
                {action === 'CANCEL' ?
                    (
                        <div>
                            CANCEL
                        </div>
                    ) : (
                        <div>
                            CONFIRM
                        </div>
                    )
                }
            </Dialog>
            <div className='print-footer'>
                <Button label="Huỷ" severity="danger" outlined onClick={cancelConfig} />
                <Button label="Xác nhận" severity="info" outlined onClick={confirmConfig} />
                {/* <Button label="Huỷ" severity="danger" outlined onClick={() => { setVisible(true); setAction('CANCEL'); }} />
                <Button label="Xác nhận" severity="info" outlined onClick={() => { setVisible(true); setAction('CONFIRM'); }} /> */}
            </div>
        </div>
    )
}
