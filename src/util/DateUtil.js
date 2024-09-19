import { format } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';
export class DateUtil {

    /**
     * Function to convert epoch time to formatted date and time
     */
    static convertEpochTime(epochTimeInMillis, timezone, formatString) {
        const date = new Date(epochTimeInMillis);
        //const gmtDate = formatInTimeZone(date, 'Etc/GMT');
        const formattedDate = formatInTimeZone(date, timezone, formatString);
        return formattedDate;
    }

}