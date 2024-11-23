import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { FileData, PrinterShow } from "@/app/(customer)/print/const";

interface FileState {
    reset: boolean;
    file: FileData | null;
    amount: number;
    range: string;
    size: string;
    orient: string;
    place: PrinterShow;
    date: string;
    oneSide: boolean;
    printColor: boolean;
    note: string;
}

const initialState: FileState = {
    reset: false,
    file: null,
    amount: 1,
    range: '',
    size: '',
    orient: '',
    place: {
        id: '',
        name: ''
    },
    date: '',
    oneSide: false,
    printColor: false,
    note: ''
};

const printSlice = createSlice({
    name: 'print',
    initialState,
    reducers: {
        setFile: (state, action: PayloadAction<FileData | null>) => {
            state.file = action.payload;
        },
        adjustReset: (state, action: PayloadAction<boolean>) => {
            state.reset = action.payload;
        },
        adjustAmount: (state, action: PayloadAction<number>) => {
            state.amount = action.payload;
        },
        adjustRange: (state, action: PayloadAction<string>) => {
            state.range = action.payload;
        },
        adjustSize: (state, action: PayloadAction<string>) => {
            state.size = action.payload;
        },
        adjustOrient: (state, action: PayloadAction<string>) => {
            state.orient = action.payload;
        },
        adjustPlace: (state, action: PayloadAction<PrinterShow>) => {
            state.place = action.payload;
        },
        adjustDate: (state, action: PayloadAction<string>) => {
            state.date = action.payload;
        },
        adjustOneSide: (state) => {
            state.oneSide = !state.oneSide;
        },
        adjustPrintColor: (state) => {
            state.printColor = !state.printColor;
        },
        adjustNote: (state, action: PayloadAction<string>) => {
            state.note = action.payload;
        },
        resetState: (state) => {
            state.amount = initialState.amount;
            state.range = initialState.range;
            state.size = initialState.size;
            state.orient = initialState.orient;
            state.place = initialState.place;
            state.date = initialState.date;
            state.oneSide = initialState.oneSide;
            state.printColor = initialState.printColor;
            state.note = initialState.note;
        }
    }
});

export const {
    setFile,
    adjustReset,
    adjustAmount,
    adjustRange,
    adjustSize,
    adjustOrient,
    adjustPlace,
    adjustDate,
    adjustOneSide,
    adjustPrintColor,
    adjustNote,
    resetState
} = printSlice.actions;

export default printSlice.reducer;