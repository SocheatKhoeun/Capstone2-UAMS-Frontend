import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import {
  transformLecturerFromBackend,
  transformLecturersFromBackend,
  transformLecturerToBackend,
  transformLecturerUpdateToBackend,
} from "~/utils/lecturerTransformer";

export const useLecturerStore = defineStore("lecturerStore", {
  state: () => ({
    lecturers: [],
    specializations: [],
    departments: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeLecturers: (state) =>
      state.lecturers.filter((lecturer) => lecturer.status === "Active"),
    inactiveLecturers: (state) =>
      state.lecturers.filter((lecturer) => lecturer.status === "Inactive"),
    totalLecturers: (state) => state.lecturers.length,
    getLecturerById: (state) => (globalId) =>
      state.lecturers.find((lecturer) => lecturer.lecturerId === globalId),
  },

  actions: {
    // Fetch specializations from database
    async fetchSpecializations() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        const response = await $AdminPrivateAxios.get('/specializations');
        let specs = response.data.data;
        if (specs && specs.items) {
          specs = specs.items;
        }
        if (!Array.isArray(specs)) {
          specs = [];
        }
        this.specializations = specs.filter(s => s.active === 1).map(s => ({
          id: s.id,
          global_id: s.global_id,
          name: s.name,
          department_id: s.department_id
        }));
        return this.specializations;
      } catch (error) {
        console.error('Failed to fetch specializations', error);
        return [];
      }
    },

    // Fetch departments from database
    async fetchDepartments() {
      const { $AdminPrivateAxios } = useNuxtApp();
      try {
        const response = await $AdminPrivateAxios.get('/departments');
        let depts = response.data.data;
        if (depts && depts.items) {
          depts = depts.items;
        }
        if (!Array.isArray(depts)) {
          depts = [];
        }
        this.departments = depts.filter(d => d.active === 1).map(d => ({
          id: d.id,
          global_id: d.global_id,
          name: d.name
        }));
        return this.departments;
      } catch (error) {
        console.error('Failed to fetch departments', error);
        return [];
      }
    },

    // Get all lecturers
    async getAllLecturers(page = 1, limit = 50) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get("/instructors/", {
          params: { page, limit },
        });
        const backendLecturers = response.data.data || response.data || [];
        this.lecturers = transformLecturersFromBackend(backendLecturers);
        console.log("Lecturers fetched:", this.lecturers);
        return this.lecturers;
      } catch (error) {
        console.error("Failed to fetch lecturers", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturers";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get single lecturer by global_id
    async getLecturerByGlobalId(globalId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get(
          `/instructors/${globalId}`
        );
        const backendLecturer = response.data.data || response.data;
        return transformLecturerFromBackend(backendLecturer);
      } catch (error) {
        console.error(`Failed to fetch lecturer ${globalId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturer";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new lecturer (admin only)
    async createLecturer(lecturerData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformLecturerToBackend(lecturerData);
        console.log("Creating lecturer with data:", backendData);

        const response = await $AdminPrivateAxios.post(
          "/instructors/",
          backendData
        );
        const backendLecturer = response.data.data || response.data;
        const newLecturer = transformLecturerFromBackend(backendLecturer);

        // Add to local state
        this.lecturers.push(newLecturer);

        console.log("Lecturer created successfully:", newLecturer);
        return newLecturer;
      } catch (error) {
        console.error("Failed to create lecturer:", error);
        console.error("Error response:", error.response);
        console.error("Error details:", error.response?.data);

        // Extract detailed error message
        let errorMessage = "Failed to create lecturer";

        if (error.response?.data) {
          const errorData = error.response.data;

          // Handle validation errors (422) - check data array
          if (errorData.data && Array.isArray(errorData.data)) {
            console.error("Validation errors:", errorData.data);
            errorMessage = errorData.data
              .map(
                (err) =>
                  `${err.loc ? err.loc.join(".") + ": " : ""}${
                    err.msg || err.message || JSON.stringify(err)
                  }`
              )
              .join("\n");
          } else if (errorData.detail && Array.isArray(errorData.detail)) {
            console.error("Detail errors:", errorData.detail);
            errorMessage = errorData.detail
              .map(
                (err) =>
                  `${err.loc ? err.loc.join(".") + ": " : ""}${
                    err.msg || err.message || JSON.stringify(err)
                  }`
              )
              .join("\n");
          } else if (errorData.detail) {
            errorMessage = errorData.detail;
          } else if (errorData.message) {
            errorMessage = errorData.message;
          }
        } else if (error.message) {
          errorMessage = error.message;
        }

        this.error = errorMessage;
        throw new Error(errorMessage);
      } finally {
        this.loading = false;
      }
    },

    // Update existing lecturer (admin only)
    async updateLecturer(globalId, lecturerData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformLecturerUpdateToBackend(lecturerData);
        const response = await $AdminPrivateAxios.patch(
          `/instructors/${globalId}`,
          backendData
        );
        const backendLecturer = response.data.data || response.data;
        const updatedLecturer = transformLecturerFromBackend(backendLecturer);

        // Update in local state
        const index = this.lecturers.findIndex(
          (l) => l.lecturerId === globalId
        );
        if (index > -1) {
          this.lecturers[index] = updatedLecturer;
        }

        console.log("Lecturer updated:", updatedLecturer);
        return updatedLecturer;
      } catch (error) {
        console.error(`Failed to update lecturer ${globalId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to update lecturer";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Toggle lecturer status (admin only)
    async toggleLecturerStatus(globalId, active) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        // Use PATCH endpoint to update lecturer status
        // Backend expects active as integer (1 or 0)
        const response = await $AdminPrivateAxios.patch(
          `/instructors/${globalId}`,
          {
            active: active ? 1 : 0,
          }
        );
        const backendLecturer = response.data.data || response.data;
        const updatedLecturer = transformLecturerFromBackend(backendLecturer);

        // Update in local state
        const index = this.lecturers.findIndex(
          (l) => l.lecturerId === globalId
        );
        if (index > -1) {
          this.lecturers[index] = updatedLecturer;
        }

        console.log("Lecturer status toggled:", updatedLecturer);
        return updatedLecturer;
      } catch (error) {
        console.error(`Failed to toggle lecturer status ${globalId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to toggle lecturer status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete lecturer (admin only)
    async deleteLecturer(globalId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.post(
          `/instructors/${globalId}/delete`
        );

        console.log("Delete response:", response.data);

        // Verify deletion was successful before removing from local state
        if (response.data.status === "success" || response.status === 200) {
          // Refresh the list from backend to ensure sync
          await this.getAllLecturers();
          console.log("Lecturer deleted and list refreshed:", globalId);
        }

        return response.data;
      } catch (error) {
        console.error(`Failed to delete lecturer ${globalId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete lecturer";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get lecturer's courses
    async getLecturerCourses(lecturerId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get(
          `/instructors/${lecturerId}/courses`
        );
        const courses = response.data.data || response.data || [];
        console.log("Lecturer courses fetched:", courses);
        return courses;
      } catch (error) {
        console.error(
          `Failed to fetch courses for lecturer ${lecturerId}`,
          error
        );
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturer courses";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get lecturer's schedule
    async getLecturerSchedule(lecturerId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get(
          `/instructors/${lecturerId}/schedule`
        );
        const schedule = response.data.data || response.data || [];
        console.log("Lecturer schedule fetched:", schedule);
        return schedule;
      } catch (error) {
        console.error(
          `Failed to fetch schedule for lecturer ${lecturerId}`,
          error
        );
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch lecturer schedule";
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
