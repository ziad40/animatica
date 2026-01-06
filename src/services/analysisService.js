import api from "@/api/axiosInstance";

export const getStudentAnalysis = async (username) => {
  try {
    const response = await api.get(`/students/${username}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch student analysis for ${username}:`, error);
    throw error;
  }
};

export const getStudentQuestionAnalysis = async (username, questionId) => {
  try {
    const response = await api.get(`/students/${username}/${questionId}`);
    return response.data;
  } catch (error) {
    console.error(`Failed to fetch question analysis for ${username} and question ${questionId}:`, error);
    throw error;
  }
};

export const getAllStudents = async () => {
  try {
    const response = await api.get(`/teacher/students`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all students:", error);
    throw error;
  }
};

export const getAllStudentsStatistics = async () => {
  try {
    const response = await api.get(`/teacher/students/statistics`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch all students statistics:", error);
    throw error;
  }
};