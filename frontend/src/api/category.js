import client from "./client";

export const getCategories = async () => {
    const { data } = await client.get('/category/');
    return data
}
