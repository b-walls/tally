import client from './client'
import { toLocalDateString } from '../utils/date';

export const getExpenseRange = async (startDate, endDate, sort = undefined) => {
    console.log(startDate, endDate);
    const { data } = await client.get('/api/expense/range', {
        params: {
            start: toLocalDateString(startDate),
            end: toLocalDateString(endDate),
            sort: sort
        }
    });
    return data
}

export const getExpenseRecent = async (max = 30, sort = undefined) => {
    const { data } = await client.get('/api/expense/recent', {
        params: {
            max: max,
            sort: sort
        }
    });
    return data
}