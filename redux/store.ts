import { configureStore } from "@reduxjs/toolkit";
import authReducer from './authSlice/auth.slice';
import printReducer from './print.slice';
import purchaseReducer from './purchase.slice';

export const store = configureStore({
    reducer: {
        print: printReducer,
        purchase: purchaseReducer,
        auth: authReducer,
    }
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;