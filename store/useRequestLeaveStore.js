import { defineStore } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "#app";

export const useRequestLeaveStore = defineStore("requestLeave", {
  state: () => ({
    leaveRequests: [],
    loading: false,
    error: null,
  }),

  getters: {
    pendingRequests: (state) =>
      state.leaveRequests.filter((r) => r.status === "Pending"),
    approvedRequests: (state) =>
      state.leaveRequests.filter((r) => r.status === "Approved"),
    rejectedRequests: (state) =>
      state.leaveRequests.filter((r) => r.status === "Rejected"),

    getRequestById: (state) => (id) =>
      state.leaveRequests.find((r) => r.leave_id === id),

    getRequestsByStudent: (state) => (studentId) =>
      state.leaveRequests.filter((r) => r.student_id === studentId),

    getRequestsByGeneration: (state) => (generation) =>
      state.leaveRequests.filter((r) => r.generation === generation),

    requestStats: (state) => ({
      total: state.leaveRequests.length,
      pending: state.leaveRequests.filter((r) => r.status === "Pending").length,
      approved: state.leaveRequests.filter((r) => r.status === "Approved")
        .length,
      rejected: state.leaveRequests.filter((r) => r.status === "Rejected")
        .length,
    }),
  },

  actions: {
    _client(scope = "user") {
      const nuxtApp = useNuxtApp();
      const config = useRuntimeConfig();
      if (scope === "admin") {
        return {
          client: nuxtApp.$AdminPrivateAxios,
          base: (config.public?.ADMIN_PRIVATE_API || "").replace(/\/+$/, ""),
          scope: "admin",
        };
      }
      return {
        client: nuxtApp.$UserPrivateAxios,
        base: (
          config.public?.USER_PRIVATE_API ||
          config.public?.API_BASE_URL ||
          ""
        ).replace(/\/+$/, ""),
        scope: "user",
      };
    },
    async fetchLeaveRequests(options = { scope: "user" }) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests/" : "/user/leave-requests/";
        const response = await client.get(`${base}${path}`);

        this.leaveRequests = response.data?.data || [];

        if (process.env.NODE_ENV === "development") {
          console.log("Leave requests loaded:", this.leaveRequests.length);
        }

        return { success: true, data: this.leaveRequests };
      } catch (error) {
        console.error(
          "Failed to fetch leave requests:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async createLeaveRequest(requestData, options = { scope: "user" }) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests/" : "/user/leave-requests/";
        const response = await client.post(`${base}${path}`, requestData);

        // Add to local state
        if (response.data?.data) {
          this.leaveRequests.push(response.data.data);
        }

        return { success: true, data: response.data?.data };
      } catch (error) {
        console.error(
          "Failed to create leave request:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async updateLeaveRequest(id, requestData, options = { scope: "admin" }) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests" : "/user/leave-requests";
        const response = await client.patch(
          `${base}${path}/${id}`,
          requestData,
        );

        // Update in local state
        const index = this.leaveRequests.findIndex((r) => r.leave_id === id);
        if (index !== -1 && response.data?.data) {
          this.leaveRequests[index] = response.data.data;
        }

        return { success: true, data: response.data?.data };
      } catch (error) {
        console.error(
          "Failed to update leave request:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async deleteLeaveRequest(id, options = { scope: "admin" }) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests" : "/user/leave-requests";
        await client.delete(`${base}${path}/${id}`);

        // Remove from local state
        this.leaveRequests = this.leaveRequests.filter(
          (r) => r.leave_id !== id,
        );

        return { success: true };
      } catch (error) {
        console.error(
          "Failed to delete leave request:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async approveLeaveRequest(
      id,
      approvedBy,
      notes = "",
      options = { scope: "admin" },
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests" : "/user/leave-requests";
        const response = await client.post(`${base}${path}/${id}/approve`, {
          approved_by: approvedBy,
          notes,
        });

        // Update in local state
        const index = this.leaveRequests.findIndex((r) => r.leave_id === id);
        if (index !== -1 && response.data?.data) {
          this.leaveRequests[index] = response.data.data;
        }

        return { success: true, data: response.data?.data };
      } catch (error) {
        console.error(
          "Failed to approve leave request:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async rejectLeaveRequest(
      id,
      rejectedBy,
      rejectionReason,
      options = { scope: "admin" },
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests" : "/user/leave-requests";
        const response = await client.post(`${base}${path}/${id}/reject`, {
          rejected_by: rejectedBy,
          rejection_reason: rejectionReason,
        });

        // Update in local state
        const index = this.leaveRequests.findIndex((r) => r.leave_id === id);
        if (index !== -1 && response.data?.data) {
          this.leaveRequests[index] = response.data.data;
        }

        return { success: true, data: response.data?.data };
      } catch (error) {
        console.error(
          "Failed to reject leave request:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    async getLeaveRequestsByDateRange(
      startDate,
      endDate,
      options = { scope: "admin" },
    ) {
      this.loading = true;
      this.error = null;

      try {
        const { client, base, scope } = this._client(options.scope);
        const path =
          scope === "admin" ? "/leave-requests/" : "/user/leave-requests/";
        const response = await client.get(`${base}${path}`, {
          params: { start_date: startDate, end_date: endDate },
        });

        return { success: true, data: response.data?.data || [] };
      } catch (error) {
        console.error(
          "Failed to fetch leave requests by date:",
          error.response?.data?.message || error.message,
        );
        this.error = error.response?.data?.message || error.message;
        return { success: false, error: this.error };
      } finally {
        this.loading = false;
      }
    },

    // Helper method to calculate duration in days
    calculateDuration(startDate, endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const diffTime = Math.abs(end - start);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      return diffDays + 1; // Include both start and end date
    },

    // Clear error state
    clearError() {
      this.error = null;
    },
  },
});
