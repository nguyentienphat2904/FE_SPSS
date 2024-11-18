import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Purchase } from "@/app/api/purchase/purchase";
import { adjustAmount } from "./print.slice";

const initialState: { purchaseHistory: Purchase[] } = {
    purchaseHistory: []
};

const purchaseSlice = createSlice({
    name: 'purchase',
    initialState,
    reducers: {
        adjustPurchaseHistory: (state, action: PayloadAction<Purchase[]>) => {
            state.purchaseHistory = action.payload;
        }
    }
});

export const {
    adjustPurchaseHistory
} = purchaseSlice.actions;

export default purchaseSlice.reducer;