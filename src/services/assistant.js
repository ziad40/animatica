import api from "@/api/axiosInstance";

export const getHelp = async (type, answer, solution) => {
    try {
        // Ensure leading slash so baseURL and path concatenate correctly
        const response = await api.post("/bot/hint", { type, answer, solution });
        
        return response.data.content;
    } catch (error) {
        console.error("Failed to get help:", error);
        throw error;
    }
};

