import { UserOperation } from '@/app/api/user';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { setTokenInCookie, getTokenFromCookie, removeTokenFromCookie } from '@/utils/token';
import { getRoleFromCookie, removeRoleFromCookie, setRoleInCookie } from '@/utils/role';

const initialState: AuthState = {
    isAuthenticated: false,
    userInfo: undefined,
    error: undefined,
    loading: false,
};

export const login = createAsyncThunk<CustomerInfo | SPSOInfo, { accountPayload: AccountPayload, userType: 'spso' | 'customer' }, { rejectValue: RejectedValue }>(
    'auth/login',
    async ({ accountPayload, userType }, { rejectWithValue }) => {
        try {
            const userOp = new UserOperation();
            const response = userType === 'spso'
                ? await userOp.loginBySPSO(accountPayload)
                : await userOp.loginByCustomer(accountPayload);

            if (!response.error && response.data) {
                setTokenInCookie(response.data.accessToken);
                setRoleInCookie(userType);
                return response.data as CustomerInfo | SPSOInfo;
            } else {
                return rejectWithValue('Login failed');
            }
        } catch (error) {
            return rejectWithValue(error as RejectedValue);
        }
    }
);

export const fetchUserInfo = createAsyncThunk<CustomerInfo | SPSOInfo, void, { rejectValue: RejectedValue }>(
    'auth/fetchUserInfo',
    async (_, { rejectWithValue }) => {
        const token = getTokenFromCookie();
        if (!token) {
            return rejectWithValue('No token found');
        }

        const role = getRoleFromCookie();
        if (!role) {
            return rejectWithValue('No role found');
        }
        try {
            const userOp = new UserOperation();

            const response = role === 'spso'
                ? await userOp.getSPSOInfo({ token })
                : await userOp.getCustomerInfo({ token });

            if (!response.error && response.data) {
                return response.data as SPSOInfo | CustomerInfo;
            }

            return rejectWithValue('Failed to fetch user info for both SPSO and Customer');
        } catch (error) {
            return rejectWithValue(error as RejectedValue);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logout: (state) => {
            state.isAuthenticated = false;
            state.userInfo = undefined;
            state.error = undefined;
            removeTokenFromCookie();
            removeRoleFromCookie();
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(login.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(login.fulfilled, (state, action: PayloadAction<CustomerInfo | SPSOInfo>) => {
                state.loading = false;
                state.isAuthenticated = true;
                state.userInfo = action.payload;
            })
            .addCase(login.rejected, (state, action: PayloadAction<RejectedValue>) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(fetchUserInfo.pending, (state) => {
                state.loading = true;
                state.error = undefined;
            })
            .addCase(fetchUserInfo.fulfilled, (state, action: PayloadAction<CustomerInfo | SPSOInfo>) => {
                state.loading = false;
                state.userInfo = action.payload;
                state.isAuthenticated = true;
            })
            .addCase(fetchUserInfo.rejected, (state, action: PayloadAction<RejectedValue>) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.error = action.payload;
            });
    },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;