'use client'
import React, { useState } from 'react'

import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { InputTextarea } from 'primereact/inputtextarea'

import { sizes, orientations, places } from './const'

export default function PrintConfig() {

    const [amount, setAmount] = useState<number>(1);
    const [range, setRange] = useState<string>('');
    const [size, setSize] = useState<string>('');
    const [orient, setOrient] = useState<string>();
    const [place, setPlace] = useState<string>();
    const [date, setDate] = useState<Date | null>();
    const [oneSide, setOneSide] = useState(false);
    const [printColor, setPrintColor] = useState(false);
    const [note, setNote] = useState("");

    return (
        <div>
            <div className='print-config-box'>
                <div className="flex flex-column gap-2">
                    <label htmlFor="amount">Số lượng</label>
                    <InputText placeholder='Chọn số bản in' id="amount" type='number' min={1} value={amount.toString()} onChange={(e) => setAmount(parseInt(e.target.value))} />
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="range">Trang in</label>
                    <InputText placeholder='Chọn các trang in' id="range" value={range} onChange={(e) => setRange(e.target.value)} />
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="size">Khổ giấy</label>
                    <Dropdown id='size' options={sizes} placeholder='Chọn khổ giấy' value={size} onChange={(e) => setSize(e.value)}></Dropdown>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="orientation">Hướng giấy</label>
                    <Dropdown id="orientation" options={orientations} placeholder='Chọn hướng giấy' value={orient} onChange={(e) => setOrient(e.value)}></Dropdown>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="place">Nơi nhận</label>
                    <Dropdown id="place" options={places} placeholder='Chọn nơi nhận' value={place} onChange={(e) => setPlace(e.value)}></Dropdown>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="date">Ngày nhận</label>
                    <Calendar id="date" placeholder='Chọn ngày nhận' value={date} onChange={(e) => setDate(e.value)} showButtonBar showTime hourFormat="12"></Calendar>
                </div>
                <div className="flex flex-column">
                    <div className="checkbox-group">
                        <Checkbox inputId="numPage" value="1 page" checked={oneSide} onChange={() => setOneSide(prev => !prev)} />
                        <label htmlFor="numPage" className="ml-2">In 1 mặt</label>
                    </div>
                    <div className="print-label-second">Mặc định in 2 mặt</div>
                </div>
                <div className="flex flex-column">
                    <div className="checkbox-group">
                        <Checkbox inputId="color" value="1 page" checked={printColor} onChange={() => setPrintColor(prev => !prev)} />
                        <label htmlFor="color" className="ml-2">In màu</label>
                    </div>
                    <div className="print-label-second">Tuỳ chọn</div>
                </div>
            </div >
            <div className="flex flex-column gap-2">
                <label htmlFor="note">Ghi chú</label>
                <InputTextarea placeholder='Ghi chú' autoResize value={note} onChange={(e) => setNote(e.target.value)}></InputTextarea>
            </div>
        </div>
    )
}
