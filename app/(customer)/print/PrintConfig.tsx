'use client'
import React, { useEffect, useState } from 'react'
import { format } from 'date-fns';
import { useDispatch, useSelector } from 'react-redux'

import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { Calendar } from 'primereact/calendar'
import { Checkbox } from 'primereact/checkbox'
import { InputTextarea } from 'primereact/inputtextarea'

import { sizes, orientations, places, PrinterShow } from './const'

import { adjustReset, adjustAmount, adjustDate, adjustNote, adjustOneSide, adjustOrient, adjustRange, adjustPlace, adjustPrintColor, adjustSize } from '@/redux/print.slice'
import { getPlace } from '@/app/api/print/print';

export default function PrintConfig() {

    const dispatch = useDispatch();

    const reset = useSelector((state: any) => state.print.reset);
    const [amount, setAmount] = useState<number>(useSelector((state: any) => state.print.amount));
    const [range, setRange] = useState<string>(useSelector((state: any) => state.print.range));
    const [size, setSize] = useState<string>(useSelector((state: any) => state.print.size));
    const [orient, setOrient] = useState<string>(useSelector((state: any) => state.print.orient));
    const [place, setPlace] = useState<string>(useSelector((state: any) => state.print.place));
    const [date, setDate] = useState<Date | null>(useSelector((state: any) => state.print.date));
    const [oneSide, setOneSide] = useState(useSelector((state: any) => state.print.oneSide));
    const [printColor, setPrintColor] = useState(useSelector((state: any) => state.print.printColor));
    const [note, setNote] = useState(useSelector((state: any) => state.print.note));

    const [placeList, setPlaceList] = useState<PrinterShow[]>([]);

    useEffect(() => {
        const fetchPlace = async () => {
            try {
                const response = await getPlace();
                setPlaceList(response);
            } catch (error) {
                console.error(error);
            }
        }
        fetchPlace();
    }, []);

    useEffect(() => {
        if (reset) {
            dispatch(adjustReset(false));
            setAmount(1);
            setRange('');
            setSize('');
            setOrient('');
            setPlace('');
            setDate(null);
            setOneSide(false);
            setPrintColor(false);
            setNote("");
        }
    }, [reset]);

    return (
        <div>
            <div className='print-config-box'>
                <div className="flex flex-column gap-2">
                    <label htmlFor="amount">Số lượng</label>
                    <InputText placeholder='Chọn số bản in' id="amount" type='number' min={1} value={amount.toString()}
                        onChange={(e) => {
                            setAmount(parseInt(e.target.value));
                            dispatch(adjustAmount(parseInt(e.target.value)));
                        }} />
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="size">Khổ giấy</label>
                    <Dropdown id='size' options={sizes} placeholder='Chọn khổ giấy' value={size} onChange={(e) => {
                        setSize(e.value);
                        dispatch(adjustSize(e.value));
                    }}></Dropdown>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="orientation">Hướng giấy</label>
                    <Dropdown id="orientation" options={orientations} placeholder='Chọn hướng giấy' value={orient} onChange={(e) => {
                        setOrient(e.value);
                        dispatch(adjustOrient(e.value));
                    }}></Dropdown>
                </div>
                <div className="flex flex-column gap-2">
                    <label htmlFor="place">Nơi nhận</label>
                    <Dropdown id="place" options={placeList} placeholder='Chọn nơi nhận' value={place} optionLabel='name' onChange={(e) => {
                        setPlace(e.value);
                        dispatch(adjustPlace(e.value));
                    }}></Dropdown>
                </div>
                <div className="flex flex-column">
                    <div className="checkbox-group">
                        <Checkbox inputId="numPage" value="1 page" checked={oneSide} onChange={() => {
                            setOneSide((prev: boolean) => !prev);
                            dispatch(adjustOneSide());
                        }} />
                        <label htmlFor="numPage" className="ml-2">In 1 mặt</label>
                    </div>
                    <div className="print-label-second">Mặc định in 2 mặt</div>
                </div>
            </div >
        </div >
    )
}
