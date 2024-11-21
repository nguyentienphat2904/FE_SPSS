export const setRoleInCookie = (role: 'customer' | 'spso') => {
    document.cookie = `role=${role}; path=/; secure; samesite=strict; max-age=${60 * 60 * 24 * 7}`;
};

export const getRoleFromCookie = (): 'customer' | 'spso' | null => {
    const name = 'role=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length) as 'customer' | 'spso';
        }
    }
    return null;
};

export const removeRoleFromCookie = () => {
    document.cookie = `role=; path=/; max-age=0; secure; samesite=strict`;
};