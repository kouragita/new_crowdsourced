import axios from 'axios';

const API_URL = 'http://127.0.0.1:5555/api/admin';

const getAuthHeaders = () => {
  const token = localStorage.getItem("authToken");
  return { Authorization: `Bearer ${token}` };
};

// Learning Paths
export const getLearningPaths = () => {
  return axios.get(`${API_URL}/learning_paths`, { headers: getAuthHeaders() });
};

export const createLearningPath = (data) => {
  return axios.post(`${API_URL}/learning_paths`, data, { headers: getAuthHeaders() });
};

export const updateLearningPath = (id, data) => {
  return axios.put(`${API_URL}/learning_paths/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteLearningPath = (id) => {
  return axios.delete(`${API_URL}/learning_paths/${id}`, { headers: getAuthHeaders() });
};

export const getLearningPath = (id) => {
    return axios.get(`${API_URL}/learning_paths/${id}`, { headers: getAuthHeaders() });
};

export const getModulesForPath = (pathId) => {
    return axios.get(`${API_URL}/learning_paths/${pathId}/modules`, { headers: getAuthHeaders() });
};

// Modules
export const createModule = (data) => {
  return axios.post(`${API_URL}/modules`, data, { headers: getAuthHeaders() });
};

export const updateModule = (id, data) => {
  return axios.put(`${API_URL}/modules/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteModule = (id) => {
  return axios.delete(`${API_URL}/modules/${id}`, { headers: getAuthHeaders() });
};

// Resources
export const getResourcesForModule = (moduleId) => {
    return axios.get(`${API_URL}/modules/${moduleId}/resources`, { headers: getAuthHeaders() });
};

export const createResource = (data) => {
  return axios.post(`${API_URL}/resources`, data, { headers: getAuthHeaders() });
};

export const updateResource = (id, data) => {
  return axios.put(`${API_URL}/resources/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteResource = (id) => {
  return axios.delete(`${API_URL}/resources/${id}`, { headers: getAuthHeaders() });
};

// Quizzes
export const getQuizzesForModule = (moduleId) => {
    return axios.get(`${API_URL}/modules/${moduleId}/quizzes`, { headers: getAuthHeaders() });
};

export const createQuiz = (moduleId, data) => {
  return axios.post(`${API_URL}/modules/${moduleId}/quizzes`, data, { headers: getAuthHeaders() });
};

export const updateQuiz = (id, data) => {
  return axios.put(`${API_URL}/quizzes/${id}`, data, { headers: getAuthHeaders() });
};

export const deleteQuiz = (id) => {
  return axios.delete(`${API_URL}/quizzes/${id}`, { headers: getAuthHeaders() });
};

export const generateQuizWithAI = (content, num_questions) => {
    return axios.post(`${API_URL}/ai/generate-quiz`, { content, num_questions }, { headers: getAuthHeaders() });
};

// Signature
export const getUploadSignature = () => {
  return axios.get(`${API_URL}/upload/signature`, { headers: getAuthHeaders() });
};

// Integrations
export const getUssdLogs = (page = 1, per_page = 10) => {
  return axios.get(`${API_URL}/integrations/ussd-logs?page=${page}&per_page=${per_page}`, { headers: getAuthHeaders() });
};

export const getSmsLogs = (page = 1, per_page = 10) => {
  return axios.get(`${API_URL}/integrations/sms-logs?page=${page}&per_page=${per_page}`, { headers: getAuthHeaders() });
};

export const sendBroadcast = (message) => {
  return axios.post(`${API_URL}/integrations/broadcast`, { message }, { headers: getAuthHeaders() });
};

// Resources
// ... resource functions will be added here
