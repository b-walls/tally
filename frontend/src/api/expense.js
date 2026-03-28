import client from './client'

export const getExpenseRange = async (startDate, endDate) => {
    const { data } = await client.get('/expense/range', {
        params: {
            start: startDate.toISOString().slice(0, 10),
            end: endDate.toISOString().slice(0, 10)
        }
    });
    return data
}

export const getExpenseRecent = async (max = 30) => {
    const { data } = await client.get('/expense/recent', {
        params: {
            max: max
        }
    });
    return data
}