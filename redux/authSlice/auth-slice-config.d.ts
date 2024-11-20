declare type AuthState = {
    isAuthenticated: boolean,
    userInfo?: CustomerInfo | SPSOInfo,
    error?: boolean,
    loading: boolean,
}

declare type RejectedValue = string | SerializedError;