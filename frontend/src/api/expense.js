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

export const createExpense = async (merchant, category_id, jsDate, total, note="") => {
    const date = `${jsDate.getFullYear()}-${String(jsDate.getMonth() + 1).padStart(2, '0')}-${String(jsDate.getDate()).padStart(2, '0')}`
    const { data } = await client.post('/api/expense/', {
        merchant: merchant,
        category_id: category_id,
        date: date,
        total: total,
        note: note
    })
    return data;
}