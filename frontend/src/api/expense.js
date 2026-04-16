import client from './client'
import { toLocalDateString } from '../utils/date';

export const getExpenseRange = async (startDate, endDate, sort = undefined) => {
    const { data } = await client.get('/api/expense/range', {
        params: {
            start: toLocalDateString(startDate),
            end: toLocalDateString(endDate),
            sort: sort
        }
    });
    return data
}

export const getExpenseRecent = async () => {
    const { data } = await client.get('/api/expense/recent');
    return data
}