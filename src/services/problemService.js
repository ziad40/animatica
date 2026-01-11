
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


export const submitSolution = async (questionId, question, trialAnswer, time) => {
  try {
    let response;
    if (questionId == null) {
        response = await api.post("/problem/solve", { question, trialAnswer, time });
      } else {
        response = await api.post("/problem/solve", { questionId, trialAnswer, time });
      }

    return response.data;
  } catch (error) {
    console.error('Failed to submit solution : ', error);
    throw error;
  }
};