import client from './client'

export const getExpenseRange = async (startDate, endDate, sort = undefined) => {
    const { data } = await client.get('/expense/range', {
        params: {
            start: startDate.toISOString().slice(0, 10),
            end: endDate.toISOString().slice(0, 10),
            sort: sort
        }
    });
    return data
}

export const getExpenseRecent = async (max = 30, sort = undefined) => {
    const { data } = await client.get('/expense/recent', {
        params: {
            max: max,
            sort: sort
        }
    });
    return data
}