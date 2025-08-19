export const getUserById = async (id) => {
    try {
        const response = await fetch(`/api/v1/users/${id}`);
        return await response.json();
    } catch (error) {
        console.log(error);
    }
}