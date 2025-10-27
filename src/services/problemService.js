
import api from "@/api/axiosInstance";

export const getProblem = async (type) => {
  try {
    // Ensure leading slash so baseURL and path concatenate correctly
    const response = await api.get("/problem", { params: { type : type } });
    return response.data;
  } catch (error) {
    console.error(`Failed to Fetch problem of type ${type}:`, error);
    throw error;
  }
};


export const submitSolution = async (questionId, question, trialAnswer) => {
  try {
    // Ensure leading slash so baseURL and path concatenate correctly
    const response = await api.post("/problem/solve", { questionId, question, trialAnswer });
    return response.data;
  } catch (error) {
    console.error('Failed to submit solution : ', error);
    throw error;
  }
};