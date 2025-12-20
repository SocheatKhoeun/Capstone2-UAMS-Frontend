/**
 * Lecturer Service
 * Handles all API calls related to lecturers/instructors
 */

import { useNuxtApp } from "#app";
import type { AxiosInstance, AxiosError } from "axios";

interface ApiResponse<T = any> {
  status: string;
  code: number;
  message: string;
  data: T;
}

export class LecturerService {
  private axios: AxiosInstance;
  private baseURL: string;

  constructor(axios: AxiosInstance) {
    this.axios = axios;
    this.baseURL = "/api/v1/admins/instructors";
  }

  /**
   * Get all lecturers
   */
  async getAllLecturers(): Promise<any[]> {
    try {
      const response = await this.axios.get<ApiResponse<any[]>>(
        `${this.baseURL}/`
      );
      return response.data.data || [];
    } catch (error) {
      console.error("Failed to fetch lecturers:", error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get single lecturer by global_id
   */
  async getLecturerById(globalId: string): Promise<any> {
    try {
      const response = await this.axios.get<ApiResponse>(
        `${this.baseURL}/${globalId}`
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to fetch lecturer ${globalId}:`, error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Create new lecturer
   */
  async createLecturer(data: any): Promise<any> {
    try {
      const response = await this.axios.post<ApiResponse>(
        `${this.baseURL}/`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to create lecturer:", error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update existing lecturer
   */
  async updateLecturer(globalId: string, data: any): Promise<any> {
    try {
      const response = await this.axios.patch<ApiResponse>(
        `${this.baseURL}/${globalId}`,
        data
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update lecturer ${globalId}:`, error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Update lecturer status (activate/deactivate)
   */
  async updateLecturerStatus(
    globalId: string,
    status: number | boolean
  ): Promise<any> {
    try {
      const response = await this.axios.post<ApiResponse>(
        `${this.baseURL}/${globalId}/status`,
        {
          value: status ? 1 : 0,
        }
      );
      return response.data.data;
    } catch (error) {
      console.error(`Failed to update lecturer status ${globalId}:`, error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get lecturer's classes/courses
   */
  async getLecturerClasses(lecturerId: string): Promise<any[]> {
    try {
      const response = await this.axios.get<ApiResponse<any[]>>(
        `/api/v1/lecturers/${lecturerId}/classes`
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch lecturer classes ${lecturerId}:`, error);
      return [];
    }
  }

  /**
   * Get lecturer's schedule
   */
  async getLecturerSchedule(lecturerId: string): Promise<any[]> {
    try {
      const response = await this.axios.get<ApiResponse<any[]>>(
        `/api/v1/lecturers/${lecturerId}/schedule`
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch lecturer schedule ${lecturerId}:`, error);
      return [];
    }
  }

  /**
   * Get attendance for lecturer's class
   */
  async getClassAttendance(
    classId: string,
    params: Record<string, any> = {}
  ): Promise<any[]> {
    try {
      const response = await this.axios.get<ApiResponse<any[]>>(
        `/api/v1/lecturers/classes/${classId}/attendance`,
        {
          params,
        }
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch class attendance ${classId}:`, error);
      return [];
    }
  }

  /**
   * Mark attendance for students
   */
  async markAttendance(data: any): Promise<any> {
    try {
      const response = await this.axios.post<ApiResponse>(
        "/api/v1/lecturers/attendance",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to mark attendance:", error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Get lecturer's leave requests
   */
  async getLecturerLeaveRequests(lecturerId: string): Promise<any[]> {
    try {
      const response = await this.axios.get<ApiResponse<any[]>>(
        `/api/v1/lecturers/${lecturerId}/leave-requests`
      );
      return response.data.data || [];
    } catch (error) {
      console.error(`Failed to fetch leave requests ${lecturerId}:`, error);
      return [];
    }
  }

  /**
   * Submit leave request
   */
  async submitLeaveRequest(data: any): Promise<any> {
    try {
      const response = await this.axios.post<ApiResponse>(
        "/api/v1/lecturers/leave-requests",
        data
      );
      return response.data.data;
    } catch (error) {
      console.error("Failed to submit leave request:", error);
      throw this.handleError(error as AxiosError);
    }
  }

  /**
   * Handle API errors
   */
  private handleError(error: AxiosError): Error {
    if (error.response) {
      const errorData = error.response.data as any;

      // Handle validation errors
      if (errorData.data && Array.isArray(errorData.data)) {
        const messages = errorData.data.map(
          (err: any) =>
            `${err.loc ? err.loc.join(".") + ": " : ""}${
              err.msg || err.message
            }`
        );
        return new Error(messages.join("\n"));
      }

      // Handle detail errors
      if (errorData.detail) {
        if (Array.isArray(errorData.detail)) {
          const messages = errorData.detail.map(
            (err: any) =>
              `${err.loc ? err.loc.join(".") + ": " : ""}${
                err.msg || err.message
              }`
          );
          return new Error(messages.join("\n"));
        }
        return new Error(errorData.detail);
      }

      // Handle message errors
      if (errorData.message) {
        return new Error(errorData.message);
      }
    }

    return error as Error;
  }
}

// Export singleton instance
let lecturerServiceInstance: LecturerService | null = null;

export const useLecturerService = (): LecturerService => {
  if (!lecturerServiceInstance) {
    const { $AdminPrivateAxios } = useNuxtApp();
    lecturerServiceInstance = new LecturerService(
      $AdminPrivateAxios as AxiosInstance
    );
  }
  return lecturerServiceInstance;
};
