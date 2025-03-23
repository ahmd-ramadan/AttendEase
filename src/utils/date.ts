export const formatDate = ({
    locale = 'ar',
    date,
    withTime = false, 
    timeZone = 'Africa/Cairo'
} : {
    locale?: string;
    date: string;
    withTime?: boolean;
    timeZone?: string;
}) => {
    const toDate = new Date(date);
    if (isNaN(toDate.getTime())) {
        // console.error("Invalid Date");
        return;
    }

    const options: Intl.DateTimeFormatOptions = withTime ?  {  
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone
    } : {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    };

    const localeMapping: Record<string, string> = {
        ar: 'ar-EG',
        en: 'en-US'
    };

    const localeTime = localeMapping[locale] || 'ar-EG';
    const formatter = new Intl.DateTimeFormat(localeTime, options);

    return formatter.format(toDate);
};