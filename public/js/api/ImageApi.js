const BASE_URL = "/api/image"

class ImageApi {
    static async patchImage(id, data) {
        
        console.log(JSON.stringify(data));
        
        try {
            const response = await fetch(`${BASE_URL}?id=${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            return await response.json();
        } catch (error) {
            throw error;
        }
    }
}

export default ImageApi;