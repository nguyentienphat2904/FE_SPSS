import { configureStore } from "@reduxjs/toolkit";

import printReducer from './print.slice';

export const store = configureStore({
    reducer: {
        print: printReducer,
    }
});