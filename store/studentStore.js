import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import { useUploadStore } from "~/store/uploadStore";
import {
  transformStudentFromBackend,
  transformStudentsFromBackend,
  transformStudentToBackend,
  transformStudentUpdateToBackend,
} from "~/utils/studentTransformer";

export const useStudentStore = defineStore("studentStore", {
  state: () => ({
    students: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeStudents: (state) =>
      state.students.filter((student) => student.status === "Active"),
    inactiveStudents: (state) =>
      state.students.filter(
        (student) =>
          student.status === "Inactive" || student.status === "inactive"
      ),
    totalStudents: (state) => state.students.length,
  },

  actions: {
    // Get all students
    async getAllStudents() {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get("/students/");
        const backendStudents = response.data.data || response.data || [];
        this.students = transformStudentsFromBackend(backendStudents);
        console.log("Students fetched:", this.students);
        return this.students;
      } catch (error) {
        console.error("Failed to fetch students", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch students";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get single student by global_id
    async getStudentById(studentId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get(`/students/${studentId}`);
        const backendStudent = response.data.data || response.data;
        return transformStudentFromBackend(backendStudent);
      } catch (error) {
        console.error(`Failed to fetch student ${studentId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch student";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new student
    async createStudent(studentData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformStudentToBackend(studentData);

        // Debug: Log the data being sent
        console.log("Sending student data:", backendData);

        const response = await $AdminPrivateAxios.post(
          "/students/",
          backendData
        );
        const backendStudent = response.data.data || response.data;
        const newStudent = transformStudentFromBackend(backendStudent);

        // Add to local state
        this.students.push(newStudent);

        console.log("Student created:", newStudent);
        return newStudent;
      } catch (error) {
        // Enhanced error logging for validation errors
        if (error.response?.status === 422) {
          console.error("❌ 422 Validation Error");
          console.error("Full Error Response:", error.response?.data);

          // Log each validation error individually
          if (
            error.response?.data?.data &&
            Array.isArray(error.response.data.data)
          ) {
            console.error("📋 Validation Errors:");
            error.response.data.data.forEach((err, index) => {
              console.error(
                `  ${index + 1}. Field: ${err.loc?.join(".") || "unknown"}`
              );
              console.error(`     Message: ${err.msg}`);
              console.error(`     Type: ${err.type}`);
              console.error(`     Input:`, err.input);
            });
          }

          console.error("📤 Original Form Data:", studentData);
          console.error(
            "🔄 Transformed Backend Data:",
            transformStudentToBackend(studentData)
          );

          // Format validation errors for user
          if (
            error.response?.data?.data &&
            Array.isArray(error.response.data.data)
          ) {
            const errors = error.response.data.data
              .map((err) => `${err.loc?.join(".") || "unknown"}: ${err.msg}`)
              .join("\n");
            this.error = `Validation failed:\n${errors}`;
          } else if (error.response?.data?.detail) {
            const errors = error.response.data.detail
              .map((err) => `${err.loc.join(".")}: ${err.msg}`)
              .join("\n");
            this.error = `Validation failed:\n${errors}`;
          }
        } else {
          console.error("Failed to create student", error);
          this.error =
            error.response?.data?.message ||
            error.message ||
            "Failed to create student";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new student with profile image
    async createStudentWithImage(formData) {
      const { $AdminPrivateAxios, $UserPrivateAxios } = useNuxtApp();
      const uploadStore = useUploadStore();
      this.loading = true;
      this.error = null;

      try {
        console.log("Uploading profile image to uploads endpoint...");

        // Find the file entry in the provided FormData
        let file = null
        let fileKey = null
        for (let [key, value] of formData.entries()) {
          if (
            (typeof File !== 'undefined' && value instanceof File) ||
            (value && value.size && value.name)
          ) {
            file = value
            fileKey = key
            break
          }
        }

        if (!file) {
          throw new Error('No file found in formData to upload')
        }

        const uploadForm = new FormData()
        uploadForm.append('file', file)

        // Upload via central uploadStore (it will prefer USER_PRIVATE_API from env)
        const uploadResp = await uploadStore.uploadImage(uploadForm)

        const uploadData = uploadResp.data?.data || uploadResp.data || uploadResp
        const imageUrl = uploadData?.url || uploadData?.secure_url || null

        if (!imageUrl) {
          console.warn('Upload completed but no URL returned', uploadData)
        }

        // Build backend payload from original FormData (skip the file entry)
        const backendPayload = {}
        for (let [key, value] of formData.entries()) {
          if (key === fileKey) continue
          backendPayload[key] = value
        }

        // Attach uploaded image URL so backend can persist it
        if (imageUrl) backendPayload.profile_image = imageUrl

        // Create student using regular student creation endpoint
        const response = await $AdminPrivateAxios.post('/students/', backendPayload)
        const backendStudent = response.data?.data || response.data
        const newStudent = transformStudentFromBackend(backendStudent)

        // Add to local state
        this.students.push(newStudent)

        console.log('Student created with image:', newStudent)
        return newStudent
      } catch (error) {
        console.error("Failed to create student with image", error);
        console.error("Error response:", error.response?.data);

        // Handle validation errors
        if (error.response?.status === 422 || error.response?.status === 400) {
          const errors =
            error.response?.data?.data || error.response?.data?.detail;
          if (Array.isArray(errors)) {
            const errorMessages = errors
              .map((err) => `${err.loc?.join(".") || "unknown"}: ${err.msg}`)
              .join("\n");
            this.error = `Validation failed:\n${errorMessages}`;
          }
        } else {
          this.error =
            error.response?.data?.message ||
            error.message ||
            "Failed to create student with image";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update existing student
    async updateStudent(studentId, studentData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformStudentUpdateToBackend(studentData);

        // Debug: Log the update data
        console.log("Updating student with data:", backendData);

        const response = await $AdminPrivateAxios.patch(
          `/students/${studentId}`,
          backendData
        );
        const backendStudent = response.data.data || response.data;
        const updatedStudent = transformStudentFromBackend(backendStudent);

        // Update in local state (search by globalId)
        const index = this.students.findIndex(
          (s) => s.globalId === studentId || s.studentId === studentId
        );
        if (index > -1) {
          this.students[index] = updatedStudent;
        }

        console.log("Student updated:", updatedStudent);
        return updatedStudent;
      } catch (error) {
        if (error.response?.status === 422) {
          console.error("Validation Error Details:", error.response?.data);
          if (error.response?.data?.detail) {
            const errors = error.response.data.detail
              .map((err) => `${err.loc.join(".")}: ${err.msg}`)
              .join("\n");
            this.error = `Validation failed:\n${errors}`;
          }
        } else {
          console.error(`Failed to update student ${studentId}`, error);
          this.error =
            error.response?.data?.message ||
            error.message ||
            "Failed to update student";
        }
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Toggle student status
    async toggleStudentStatus(studentId, active) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.post(
          `/students/${studentId}/status`,
          {
            value: active ? 1 : 0,
          }
        );
        const backendStudent = response.data.data || response.data;
        const updatedStudent = transformStudentFromBackend(backendStudent);

        // Update in local state
        const index = this.students.findIndex((s) => s.studentId === studentId);
        if (index > -1) {
          this.students[index] = updatedStudent;
        }

        console.log("Student status toggled:", updatedStudent);
        return updatedStudent;
      } catch (error) {
        console.error(`Failed to toggle student status ${studentId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to toggle student status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Soft delete student using backend endpoint
    async deleteStudent(studentId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.post(
          `/students/${studentId}/delete`
        );
        const backendStudent = response.data.data || response.data;

        // Remove from local state
        const index = this.students.findIndex((s) => s.studentId === studentId);
        if (index > -1) {
          this.students.splice(index, 1);
        }

        console.log("Student soft deleted:", studentId);
        return backendStudent;
      } catch (error) {
        console.error(`Failed to delete student ${studentId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete student";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Clear error
    clearError() {
      this.error = null;
    },
  },
});
