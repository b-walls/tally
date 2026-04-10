import client from './client'

export const getRemaining = async () => {
    const { data } = await client.get('/api/budget/remaining');
    return data
}