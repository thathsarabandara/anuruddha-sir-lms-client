import axiosInstance from "./axios";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api/v1';

export const dashboardApi = {
    getAdminDashboardData: () => axiosInstance.get(`${API_BASE_URL}dashboards/admin/`),
    getTeacherDashboardData: () => axiosInstance.get(`${API_BASE_URL}dashboards/teacher/`),
    getDeveloperDashboardData: () => axiosInstance.get(`${API_BASE_URL}dashboards/developer/`),
    getStudentDashboardData: () => axiosInstance.get(`${API_BASE_URL}dashboards/student/`),
}
