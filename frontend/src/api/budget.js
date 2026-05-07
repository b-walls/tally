import client from './client'

export const getRemaining = async () => {
    const { data } = await client.get('/api/budget/remaining');
    return data
}

export const updateBudget = async (id, name, icon, color, limit, period) => {
    const { data } = await client.patch(`/api/budget/${id}`, {
        name: name,
        icon: icon,
        color: color,
        limit: limit,
        period: period
    })
    return data
}