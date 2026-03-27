import client from './client'

export const getRemaining = async () => {
    const { data } = await client.get('/budget/remaining');
    return data
}