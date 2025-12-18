/**
 * Student API Service
 * Handles all HTTP requests to the backend student endpoints
 * Base URL: /api/v1/admin/auth/students
 *
 * All requests automatically include:
 * Authorization: Bearer <access_token>
 * (configured in plugins/axios.js via AdminPrivateAxios)
 */

import type {
  StudentOut,
  StudentCreateInput,
  StudentUpdateInput,
  StudentStatusUpdate,
} from "~/types/student";

/**
 * Get all students
 * @endpoint GET /students
 * @roles admin, superadmin
 * @returns Array of students
 */
export const getAllStudents = async (
  $AdminPrivateAxios: any
): Promise<StudentOut[]> => {
  const response = await $AdminPrivateAxios.get("/students/");
  return response.data.data || response.data || [];
};

/**
 * Get single student by global_id
 * @endpoint GET /students/{global_id}
 * @roles admin, superadmin
 * @param globalId - Student's global_id
 * @returns Single student object
 */
export const getStudentById = async (
  $AdminPrivateAxios: any,
  globalId: string
): Promise<StudentOut> => {
  const response = await $AdminPrivateAxios.get(`/students/${globalId}`);
  return response.data.data || response.data;
};

/**
 * Create a new student
 * @endpoint POST /students
 * @roles superadmin
 * @param studentData - Student creation data
 * @returns Created student object
 */
export const createStudent = async (
  $AdminPrivateAxios: any,
  studentData: StudentCreateInput
): Promise<StudentOut> => {
  const response = await $AdminPrivateAxios.post("/students/", studentData);
  return response.data.data || response.data;
};

/**
 * Update existing student
 * @endpoint PATCH /students/{global_id}
 * @roles superadmin
 * @param globalId - Student's global_id
 * @param studentData - Partial student data to update
 * @returns Updated student object
 */
export const updateStudent = async (
  $AdminPrivateAxios: any,
  globalId: string,
  studentData: StudentUpdateInput
): Promise<StudentOut> => {
  const response = await $AdminPrivateAxios.patch(
    `/students/${globalId}`,
    studentData
  );
  return response.data.data || response.data;
};

/**
 * Activate or deactivate a student
 * @endpoint POST /students/{global_id}/status
 * @roles superadmin
 * @param globalId - Student's global_id
 * @param active - 1 for active, 0 for inactive
 * @returns Updated student object
 */
export const toggleStudentStatus = async (
  $AdminPrivateAxios: any,
  globalId: string,
  active: number
): Promise<StudentOut> => {
  const response = await $AdminPrivateAxios.post(
    `/students/${globalId}/status`,
    { active }
  );
  return response.data.data || response.data;
};

/**
 * Create a new student with profile image
 * @endpoint POST /students/with-image
 * @roles superadmin
 * @param formData - FormData containing student data and profile image
 * @returns Created student object with image URL
 */
export const createStudentWithImage = async (
  $AdminPrivateAxios: any,
  formData: FormData
): Promise<StudentOut> => {
  const response = await $AdminPrivateAxios.post(
    "/students/with-image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data.data || response.data;
};

/**
 * Soft delete a student
 * @endpoint POST /students/{global_id}/delete
 * @roles superadmin
 * @param globalId - Student's global_id
 * @returns Deleted student object or success message
 */
export const deleteStudent = async (
  $AdminPrivateAxios: any,
  globalId: string
): Promise<any> => {
  const response = await $AdminPrivateAxios.post(
    `/students/${globalId}/delete`
  );
  return response.data.data || response.data;
};

/**
 * Error handler utility
 * Extracts user-friendly error messages from API responses
 */
export const handleApiError = (error: any): string => {
  if (error.response?.data?.detail) {
    return error.response.data.detail;
  }
  if (error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error.message) {
    return error.message;
  }
  return "An unexpected error occurred";
};
