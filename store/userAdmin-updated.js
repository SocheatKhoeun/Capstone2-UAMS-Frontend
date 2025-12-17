/**
 * Updated Admin User Store with Backend Integration
 * This file contains the updated store that works with the actual UAMS backend
 * 
 * USAGE:
 * 1. Replace the existing store/userAdmin.js with this file
 * 2. Ensure utils/adminTransformer.js is in place
 * 3. Update your components to use the new data structure
 */

import { defineStore } from 'pinia';
import { AdminPrivateAxios } from '@/plugins/axios';
import {
  transformAdminFromBackend,
  transformAdminsFromBackend,
  transformAdminToBackend,
  transformAdminUpdateToBackend,
  extractBackendData,
  handleBackendError,
  validateAdminData
} from '@/utils/adminTransformer';

export const useUserAdminStore = defineStore('userAdmin', {
  state: () => ({
    users: [],
    currentUser: null,
    loading: false,
    error: null,
    pagination: {
      page: 1,
      perPage: 50,
      total: 0
    }
  }),

  getters: {
    allUsers: (state) => state.users,
    activeUsers: (state) => state.users.filter(user => user.status === 'Active'),
    inactiveUsers: (state) => state.users.filter(user => user.status === 'Inactive'),
    totalUsers: (state) => state.users.length,
    getUserById: (state) => (userId) => state.users.find(user => user.id === userId),
    getUserByAdminId: (state) => (adminId) => state.users.find(user => user.adminId === adminId),
    hasError: (state) => !!state.error,
    isLoading: (state) => state.loading
  },

  actions: {
    async getAllUsers() {
      this.loading = true;
      this.error = null;
      try {
        const response = await AdminPrivateAxios.get('/api/v1/admin/auth/admins/');
        const data = extractBackendData(response);
        if (data.items && Array.isArray(data.items)) {
          this.users = transformAdminsFromBackend(data.items);
          this.pagination.total = data.total || data.items.length;
        } else if (Array.isArray(data)) {
          this.users = transformAdminsFromBackend(data);
          this.pagination.total = data.length;
        } else {
          this.users = data ? [transformAdminFromBackend(data)] : [];
        }
        return this.users;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getUserById(adminId) {
      this.loading = true;
      this.error = null;
      try {
        const response = await AdminPrivateAxios.get(`/api/v1/admin/auth/admins/${adminId}`);
        const data = extractBackendData(response);
        const user = transformAdminFromBackend(data);
        const index = this.users.findIndex(u => u.adminId === adminId);
        if (index !== -1) {
          this.users[index] = user;
        } else {
          this.users.push(user);
        }
        this.currentUser = user;
        return user;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async getCurrentUser() {
      this.loading = true;
      this.error = null;
      try {
        const response = await AdminPrivateAxios.get('/api/v1/admin/auth/admins/me');
        const data = extractBackendData(response);
        this.currentUser = transformAdminFromBackend(data);
        return this.currentUser;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async createUser(userData) {
      this.loading = true;
      this.error = null;
      try {
        const validation = validateAdminData(userData, false);
        if (!validation.valid) {
          this.error = validation.errors.join(', ');
          throw new Error(this.error);
        }
        const backendData = transformAdminToBackend(userData);
        const response = await AdminPrivateAxios.post('/api/v1/admin/auth/admins/', backendData);
        const data = extractBackendData(response);
        const newUser = transformAdminFromBackend(data);
        this.users.push(newUser);
        this.pagination.total++;
        return newUser;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async updateUser(adminId, userData) {
      this.loading = true;
      this.error = null;
      try {
        const validation = validateAdminData(userData, true);
        if (!validation.valid) {
          this.error = validation.errors.join(', ');
          throw new Error(this.error);
        }
        const backendData = transformAdminUpdateToBackend(userData);
        const response = await AdminPrivateAxios.patch(`/api/v1/admin/auth/admins/${adminId}`, backendData);
        const data = extractBackendData(response);
        const updatedUser = transformAdminFromBackend(data);
        const index = this.users.findIndex(u => u.adminId === adminId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        return updatedUser;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async toggleUserStatus(adminId, active) {
      this.loading = true;
      this.error = null;
      try {
        const response = await AdminPrivateAxios.post(`/api/v1/admin/auth/admins/${adminId}/status`, { active });
        const data = extractBackendData(response);
        const updatedUser = transformAdminFromBackend(data);
        const index = this.users.findIndex(u => u.adminId === adminId);
        if (index !== -1) {
          this.users[index] = updatedUser;
        }
        return updatedUser;
      } catch (error) {
        this.error = handleBackendError(error);
        throw error;
      } finally {
        this.loading = false;
      }
    },

    async deleteUser(adminId) {
      // Backend doesn't support DELETE yet
      throw new Error('Delete operation is not available. Use status toggle instead.');
    },

    clearError() {
      this.error = null;
    },

    resetStore() {
      this.users = [];
      this.currentUser = null;
      this.loading = false;
      this.error = null;
      this.pagination = { page: 1, perPage: 50, total: 0 };
    }
  }
});
