import { configureStore } from "@reduxjs/toolkit";

import printReducer from './print.slice';
import purchaseReducer from './purchase.slice';

export const store = configureStore({
    reducer: {
        print: printReducer,
        purchase: purchaseReducer
    }
});