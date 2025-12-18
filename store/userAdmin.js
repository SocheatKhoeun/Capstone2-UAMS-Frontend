import { defineStore } from "pinia";
import { useNuxtApp } from "#app";
import {
  transformAdminFromBackend,
  transformAdminsFromBackend,
  transformAdminToBackend,
  transformAdminUpdateToBackend,
} from "~/utils/adminTransformer";

export const userAdminStore = defineStore("userAdminStore", {
  state: () => ({
    users: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeUsers: (state) =>
      state.users.filter((user) => user.status === "Active"),
    inactiveUsers: (state) =>
      state.users.filter(
        (user) => user.status === "Inactive" || user.status === "inactive"
      ),
    totalUsers: (state) => state.users.length,
  },

  actions: {
    // Get all admins
    async getAllUsers() {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get("/admins/");
        // Backend wraps data in {status, data, message} format
        // data could be array or {items, total, ...} depending on backend
        let backendAdmins = response.data.data || response.data || [];

        // Handle paginated response if backend returns {items: [...]}
        if (
          backendAdmins &&
          typeof backendAdmins === "object" &&
          Array.isArray(backendAdmins.items)
        ) {
          backendAdmins = backendAdmins.items;
        }

        // Ensure it's an array
        if (!Array.isArray(backendAdmins)) {
          backendAdmins = [];
        }

        this.users = transformAdminsFromBackend(backendAdmins);
        console.log("Admins fetched:", this.users);
        return this.users;
      } catch (error) {
        console.error("Failed to fetch admins", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch admins";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get single admin by global_id
    async getUserById(adminId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get(`/admins/${adminId}`);
        const backendAdmin = response.data.data || response.data;
        return transformAdminFromBackend(backendAdmin);
      } catch (error) {
        console.error(`Failed to fetch admin ${adminId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch admin";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Create new admin (superadmin only)
    async createUser(userData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformAdminToBackend(userData);
        const response = await $AdminPrivateAxios.post("/admins/", backendData);
        const backendAdmin = response.data.data || response.data;
        const newUser = transformAdminFromBackend(backendAdmin);

        // Add to local state
        this.users.push(newUser);

        console.log("Admin created:", newUser);
        return newUser;
      } catch (error) {
        console.error("Failed to create admin", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to create admin";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Update existing admin (superadmin only)
    async updateUser(adminId, userData) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const backendData = transformAdminUpdateToBackend(userData);
        const response = await $AdminPrivateAxios.patch(
          `/admins/${adminId}`,
          backendData
        );
        const backendAdmin = response.data.data || response.data;
        const updatedUser = transformAdminFromBackend(backendAdmin);

        // Update in local state
        const index = this.users.findIndex((u) => u.adminId === adminId);
        if (index > -1) {
          this.users[index] = updatedUser;
        }

        console.log("Admin updated:", updatedUser);
        return updatedUser;
      } catch (error) {
        console.error(`Failed to update admin ${adminId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to update admin";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Toggle admin status (superadmin only)
    async toggleUserStatus(adminId, active) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        // Use POST /status endpoint to update admin status
        // Backend expects value as integer (1 for active, 0 for inactive)
        const response = await $AdminPrivateAxios.post(
          `/admins/${adminId}/status`,
          {
            value: active ? 1 : 0,
          }
        );
        const backendAdmin = response.data.data || response.data;
        const updatedUser = transformAdminFromBackend(backendAdmin);

        // Update in local state
        const index = this.users.findIndex((u) => u.adminId === adminId);
        if (index > -1) {
          this.users[index] = updatedUser;
        }

        console.log("Admin status toggled:", updatedUser);
        return updatedUser;
      } catch (error) {
        console.error(`Failed to toggle admin status ${adminId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to toggle admin status";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Delete admin (superadmin only)
    async deleteUser(adminId) {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.post(
          `/admins/${adminId}/delete`
        );

        console.log("Delete response:", response.data);

        // Verify deletion was successful before removing from local state
        if (response.data.status === "success" || response.status === 200) {
          // Refresh the list from backend to ensure sync
          await this.getAllUsers();
          console.log("Admin deleted and list refreshed:", adminId);
        }

        return response.data;
      } catch (error) {
        console.error(`Failed to delete admin ${adminId}`, error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to delete admin";
        throw error;
      } finally {
        this.loading = false;
      }
    },

    // Get current logged-in admin info
    async getCurrentAdmin() {
      const { $AdminPrivateAxios } = useNuxtApp();
      this.loading = true;
      this.error = null;

      try {
        const response = await $AdminPrivateAxios.get("/admins/me");
        const backendAdmin = response.data.data || response.data;
        return transformAdminFromBackend(backendAdmin);
      } catch (error) {
        console.error("Failed to fetch current admin", error);
        this.error =
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch current admin";
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
