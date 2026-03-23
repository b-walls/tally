import client from './client'

export const scanReceipt = async (imageFile) => {
  const form = new FormData()
  form.append('image', imageFile)
  const { data } = await client.post('/receipts/scan', form, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })
  return data // { id, merchant, date, total, items }
}

export const getReceipt = async (id) => {
  const { data } = await client.get(`/receipts/${id}`)
  return data
}

export const updateReceipt = async (id, payload) => {
  // payload: { merchant?, date?, total? }
  const { data } = await client.patch(`/receipts/${id}`, payload)
  return data
}

export const updateReceiptItem = async (itemId, payload) => {
  // payload: { category?, amount?, name?, confirmed? }
  const { data } = await client.patch(`/receipts/items/${itemId}`, payload)
  return data
}
