<template>
  <div class="roles-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-shield-account" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Role Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon
                  icon="mdi-chevron-right"
                  size="16"
                  color="grey"
                  class="breadcrumb-separator"
                />
                <span class="breadcrumb-item active">Roles</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ roles.length }}</div>
              <div class="stat-label">Total Roles</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ roles.filter((r) => r.is_active).length }}
              </div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ roles.filter((r) => !r.is_active).length }}
              </div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
        </div>
        <div class="action-section">
          <v-chip color="info" size="large" variant="tonal" prepend-icon="mdi-eye">
            View Only Mode
          </v-chip>
        </div>
      </div>
    </div>

    <!-- Modern Table Section -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Toolbar -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="table-title">
              <v-icon icon="mdi-table" size="20" class="mr-2" />
              Role Information
            </h2>
            <div class="table-subtitle">Manage and organize user roles</div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search roles..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                class="search-input"
                clearable
              />
            </div>
          </div>
        </div>

        <!-- Table -->
        <div class="modern-table-wrapper">
          <v-table class="modern-table" fixed-header height="500">
            <thead>
              <tr class="modern-header-row">
                <th class="modern-header-cell text-left id-column">
                  <div class="header-content">ID</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Role Name</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Status</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Level</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Type</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Permissions</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Users</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="role in paginatedRoles"
                :key="role.id"
                class="modern-table-row"
              >
                <td class="modern-table-cell text-center id-column">
                  <span class="id-badge">{{ role.id }}</span>
                </td>

                <td class="modern-table-cell">
                  <div class="role-info">
                    <span class="role-avatar" :style="{ background: getRoleGradient(role.level) }">
                      <v-icon size="22" color="white">{{ getRoleIcon(role.level) }}</v-icon>
                    </span>
                    <div class="role-details">
                      <div class="role-name">{{ role.name }}</div>
                      <div class="role-meta">{{ role.description }}</div>
                    </div>
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <v-chip
                    :color="role.is_active ? 'success' : 'error'"
                    class="status-chip"
                    size="small"
                  >
                    <v-icon start size="16">mdi-check-circle</v-icon>
                    {{ role.is_active ? "Active" : "Inactive" }}
                  </v-chip>
                </td>

                <td class="modern-table-cell">
                  <v-chip
                    :color="getRoleColor(role.level)"
                    size="small"
                    variant="outlined"
                  >
                    {{ role.level }}
                  </v-chip>
                </td>

                <td class="modern-table-cell">
                  <v-chip color="info" size="small" variant="tonal">
                    {{ role.type }}
                  </v-chip>
                </td>

                <td class="modern-table-cell">
                  <div class="permissions-list">
                    <v-chip
                      v-for="permission in role.permissions.slice(0, 2)"
                      :key="permission"
                      size="x-small"
                      variant="outlined"
                      color="grey"
                      class="mr-1 mb-1"
                    >
                      {{ permission.split('.')[0] }}
                    </v-chip>
                    <v-chip
                      v-if="role.permissions.length > 2"
                      size="x-small"
                      variant="outlined"
                      color="grey"
                    >
                      +{{ role.permissions.length - 2 }}
                    </v-chip>
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <div class="user-count">
                    <v-icon size="16" color="grey">mdi-account</v-icon>
                    <span>{{ role.user_count || 0 }}</span>
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <div class="action-group">
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="viewRole(role)"
                    >
                      <v-icon color="#3b82f6">mdi-eye</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Empty State -->
          <div v-if="filteredRoles.length === 0" class="empty-state">
            <v-icon
              icon="mdi-shield-account-outline"
              size="64"
              color="grey-lighten-1"
            />
            <h3 class="empty-title">No roles found</h3>
            <p class="empty-subtitle">
              {{
                searchQuery
                  ? "Try adjusting your search terms"
                  : "No roles available to display"
              }}
            </p>
          </div>

          <!-- Pagination -->
          <div v-if="filteredRoles.length > 0" class="pagination-section">
            <v-btn
              variant="outlined"
              :disabled="currentPage === 1"
              @click="goToPrevPage"
              class="pagination-btn"
            >
              Previous
            </v-btn>
            <div class="pagination-info">
              <span class="pagination-text"
                >Page {{ currentPage }} of {{ totalPages }}</span
              >
            </div>
            <v-btn
              variant="outlined"
              :disabled="currentPage >= totalPages"
              @click="goToNextPage"
              class="pagination-btn"
            >
              Next
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Role View Dialog -->
    <v-dialog v-model="dialog" max-width="700" persistent>
      <v-card class="modern-dialog" elevation="24">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon icon="mdi-shield-account" color="primary" size="32" />
            </div>
            <div class="header-text">
              <h3 class="dialog-title">Role Details</h3>
              <p class="dialog-subtitle">View role information</p>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            class="close-btn"
            @click="closeDialog"
          />
        </div>
        
        <v-card-text v-if="selectedRole" class="dialog-content pa-6">
          <div class="detail-row">
            <span class="detail-label">Role Name:</span>
            <span class="detail-value">{{ selectedRole.name }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Description:</span>
            <span class="detail-value">{{ selectedRole.description }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Level:</span>
            <v-chip :color="getRoleColor(selectedRole.level)" size="small" variant="outlined">
              {{ selectedRole.level }}
            </v-chip>
          </div>
          <div class="detail-row">
            <span class="detail-label">Type:</span>
            <v-chip color="info" size="small" variant="tonal">
              {{ selectedRole.type }}
            </v-chip>
          </div>
          <div class="detail-row">
            <span class="detail-label">Status:</span>
            <v-chip :color="selectedRole.is_active ? 'success' : 'error'" size="small">
              {{ selectedRole.is_active ? 'Active' : 'Inactive' }}
            </v-chip>
          </div>
          <div class="detail-row">
            <span class="detail-label">User Count:</span>
            <span class="detail-value">{{ selectedRole.user_count || 0 }}</span>
          </div>
          <div class="detail-row">
            <span class="detail-label">Permissions:</span>
            <div class="permissions-grid">
              <v-chip
                v-for="permission in selectedRole.permissions"
                :key="permission"
                size="small"
                variant="outlined"
                color="grey"
                class="ma-1"
              >
                {{ permission }}
              </v-chip>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="dialog-actions pa-6">
          <v-spacer />
          <v-btn
            variant="outlined"
            @click="closeDialog"
            class="cancel-btn"
          >
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import { useRoleStore } from '~/store/roles'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const roleStore = useRoleStore()
const { roles, loading } = storeToRefs(roleStore)

// Reactive data
const dialog = ref(false)
const selectedRole = ref(null)
const searchQuery = ref('')
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Computed filtered roles
const filteredRoles = computed(() => {
  if (!roles.value) return []

  let filtered = [...roles.value]

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(role =>
      role.name?.toLowerCase().includes(query) ||
      role.level?.toLowerCase().includes(query) ||
      role.type?.toLowerCase().includes(query) ||
      role.description?.toLowerCase().includes(query)
    )
  }

  return filtered
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredRoles.value.length / itemsPerPage.value))

const paginatedRoles = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredRoles.value.slice(start, end)
})

// Methods
const viewRole = (role) => {
  selectedRole.value = role
  dialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  selectedRole.value = null
}

const getRoleColor = (level) => {
  const colors = {
    Admin: 'error',
    Staff: 'warning',
    User: 'info',
    Student: 'success'
  }
  return colors[level] || 'grey'
}

const getRoleGradient = (level) => {
  const gradients = {
    Admin: 'linear-gradient(135deg, #dc2626 0%, #ef4444 100%)',
    Staff: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
    User: 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
    Student: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)'
  }
  return gradients[level] || 'linear-gradient(135deg, #6b7280 0%, #9ca3af 100%)'
}

const getRoleIcon = (level) => {
  const icons = {
    Admin: 'mdi-shield-crown',
    Staff: 'mdi-account-tie',
    User: 'mdi-account',
    Student: 'mdi-school'
  }
  return icons[level] || 'mdi-account'
}

// Pagination methods
const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Watch for search query and reset to first page
watch(searchQuery, () => {
  currentPage.value = 1
})

onMounted(async () => {
  await roleStore.fetchRoles()
})
</script>

<style scoped>
/* Roles Page Styles - Matching Groups Page */
.roles-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 0;
}

/* Modern Header Styles */
.modern-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.title-section {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: #3b82f6;
}

.breadcrumb-separator {
  opacity: 0.5;
}

.stats-cards {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modern-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

/* Modern Table Section */
.modern-table-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px 24px 16px;
  border-bottom: 1px solid #f1f5f9;
}

.toolbar-left {
  flex: 1;
}

.table-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  display: flex;
  align-items: center;
}

.table-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.toolbar-right {
  display: flex;
  gap: 12px;
  align-items: center;
}

.search-container {
  min-width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Modern Table Styles */
.modern-table-wrapper {
  position: relative;
  overflow: hidden;
}

.modern-table {
  width: 100%;
}

.modern-header-row {
  background: linear-gradient(135deg, #1e293b 0%, #334155 100%);
}

.modern-header-cell {
  padding: 20px 16px;
  border: none;
  position: relative;
  text-align: left !important;
}

.modern-header-cell.id-column {
  width: 80px;
  text-align: center !important;
}

.header-content {
  display: flex;
  align-items: center;
  color: #ffffff !important;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-left: 4px;
}

.modern-table-row {
  transition: all 0.2s ease;
  border-bottom: 1px solid #f1f5f9;
}

.modern-table-row:hover {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  transform: scale(1.001);
}

.modern-table-cell {
  padding: 16px;
  border: none;
  vertical-align: middle;
  text-align: left !important;
}

.modern-table-cell.id-column {
  width: 80px;
  text-align: center !important;
}

.id-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  font-weight: 600;
  font-size: 12px;
  border-radius: 8px;
}

.role-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.role-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
}

.role-details {
  flex: 1;
}

.role-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.role-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.status-chip {
  font-weight: 500;
}

.permissions-list {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  align-items: center;
}

.user-count {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
}

.action-group {
  display: flex;
  gap: 4px;
  justify-content: center;
}

.action-btn {
  width: 36px;
  height: 36px;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 64px 32px;
  color: #64748b;
}

.empty-title {
  font-size: 18px;
  font-weight: 600;
  color: #475569;
  margin: 16px 0 8px 0;
}

.empty-subtitle {
  font-size: 14px;
  margin: 0;
  line-height: 1.5;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  border-top: 1px solid #f1f5f9;
  margin-top: 0;
}

.pagination-btn {
  min-width: 100px;
  height: 40px;
  border-radius: 8px;
  font-weight: 500;
  text-transform: none;
}

.pagination-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.pagination-info {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}

.pagination-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

/* Dialog Styles */
.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
  flex: 1;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
  line-height: 1.3;
}

.dialog-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 2px 0 0 0;
  line-height: 1.4;
}

.close-btn {
  opacity: 0.7;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.04);
}

.dialog-content {
  padding: 24px !important;
}

.detail-row {
  display: flex;
  align-items: flex-start;
  padding: 12px 0;
  border-bottom: 1px solid #f1f5f9;
  gap: 16px;
}

.detail-row:last-child {
  border-bottom: none;
}

.detail-label {
  font-weight: 600;
  color: #374151;
  min-width: 140px;
  font-size: 14px;
}

.detail-value {
  color: #1e293b;
  flex: 1;
  font-size: 14px;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  flex: 1;
}

.dialog-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

.cancel-btn {
  min-width: 100px;
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-container {
    flex-wrap: wrap;
  }

  .action-section {
    flex-wrap: wrap;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
  }

  .modern-table-section {
    padding: 16px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
  }

  .stats-cards {
    flex-wrap: wrap;
    width: 100%;
  }

  .toolbar-right {
    flex-direction: column;
    width: 100%;
  }

  .search-container {
    width: 100%;
  }

  .table-toolbar {
    flex-direction: column;
    gap: 16px;
  }

  .modern-table-wrapper {
    overflow-x: auto;
  }

  .modern-table {
    min-width: 800px;
  }
}
</style>
