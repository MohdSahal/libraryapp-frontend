/**
 * Formats an ISO date string into DD-MM-YYYY in local time (IST).
 */
export const formatDateLocal = (dateStr: string) => {
    if (!dateStr || dateStr === 'null') return '---';
    try {
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;

        // Using Intl.DateTimeFormat for robust local formatting
        return new Intl.DateTimeFormat('en-IN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            timeZone: 'Asia/Kolkata'
        }).format(date).replace(/\//g, '-');
    } catch (e) {
        return dateStr;
    }
};

/**
 * Returns today's date in YYYY-MM-DD format for input[type="date"].
 */
export const getTodayDateString = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};
