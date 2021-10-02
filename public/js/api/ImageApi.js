const BASE_URL = "/api/image"

class ImageApi {
    static async patchImage(id, data) {        
        try {
            const response = await fetch(`${BASE_URL}?id=${id}`, {
                method: "PATCH",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (response.status === 200 || response.status === 201) 
                return await response.json();
            else
                throw new Error (`Something went wrong. Status code: ${response.status}`);

        } catch (error) {
            throw error;
        }
    }
}

export default ImageApi;