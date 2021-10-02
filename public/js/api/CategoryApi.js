const BASE_URL = "/api/categories"

class CategoryApi {
    static async searchAllCategories(limit) {
        try {
            const response = await fetch(`${BASE_URL}?limit=${limit}`);
            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export default CategoryApi;