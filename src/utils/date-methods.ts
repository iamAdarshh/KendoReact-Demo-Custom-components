import { format, parseISO, parse } from 'date-fns';

export const defaultDateFormat = "dd-MM-yy";
export const defaultTimeFormat = "HH:mm";

export const toDateTimeString =
    (value?: Date | undefined) => value && format(value, 'yyyy-MM-dd\'T\'HH:mm:ss.T');
export const toDateString =
    (value?: Date | undefined) => value && format(value, 'yyyy-MM-dd');


export const normalize = (dateValue?: string | Date | null | undefined, formatString: string = defaultDateFormat) => {
    if (!dateValue) return;

    if (typeof dateValue === "string") {
        return parseISO(dateValue);
    }

    return parse(
        format(dateValue, formatString),
        formatString,
        new Date());
}


// Assuming segment.departure?.date is a valid date string or Date object
export const formattedDate = (isoDateString: string) => {
    if (!isoDateString) {
        return '';
    }
    return format(new Date(isoDateString), 'dd MMM yyyy');
}
