import client from './client'

export const getBudgets = async () => {
  const { data } = await client.get('/budget/')
  return data // [{ id, category, limit }]
}

export const getBudgetRemaining = async () => {
  const { data } = await client.get('/budget/remaining')
  return data // [{ id, category, limit, remaining }]
}

export const updateBudget = async (id, limit) => {
  const { data } = await client.patch(`/budget/${id}`, { limit })
  return data
}
