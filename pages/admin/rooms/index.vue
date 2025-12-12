<template>
  <div class="rooms-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-door" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Room Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon
                  icon="mdi-chevron-right"
                  size="16"
                  color="grey"
                  class="breadcrumb-separator"
                />
                <span class="breadcrumb-item active">Rooms</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ rooms.length }}</div>
              <div class="stat-label">Total Rooms</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ rooms.filter((r) => r.active).length }}
              </div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ rooms.filter((r) => !r.active).length }}
              </div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
        </div>
        <div class="action-section">
          <v-btn
            class="modern-btn add-btn"
            prepend-icon="mdi-plus"
            variant="flat"
            color="primary"
            @click="openCreateDialog"
            elevation="2"
          >
            Add Room
          </v-btn>
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
              Room Information
            </h2>
            <div class="table-subtitle">Manage and organize your rooms</div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search rooms..."
                prepend-inner-icon="mdi-magnify"
                variant="outlined"
                density="compact"
                hide-details
                class="search-input"
                clearable
              />
            </div>

            <v-menu
              v-model="showFilters"
              offset-y
              transition="scale-transition"
              max-width="320"
            >
              <template #activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="outlined"
                  class="filter-btn"
                  aria-label="Open filters"
                >
                  <v-icon icon="mdi-filter-variant" />
                </v-btn>
              </template>

              <v-card elevation="4" class="pa-2">
                <v-card-text class="py-2 px-3">
                  <div class="filters-content" style="min-width:220px;">
                    <div class="filter-group">
                      <label class="filter-label">Status</label>
                      <v-chip-group
                        v-model="statusFilter"
                        selected-class="text-primary"
                        column
                      >
                        <v-chip value="All" variant="outlined">All</v-chip>
                        <v-chip value="1" variant="outlined" color="success"
                          >Active</v-chip
                        >
                        <v-chip value="0" variant="outlined" color="error"
                          >Inactive</v-chip
                        >
                      </v-chip-group>
                    </div>
                  </div>
                </v-card-text>
              </v-card>
            </v-menu>
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
                  <div class="header-content">Room Name</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Capacity</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Status</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Created</div>
                </th>
                <th class="modern-header-cell text-left">
                  <div class="header-content">Updated</div>
                </th>
                <th class="modern-header-cell text-center">
                  <div class="header-content">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <!-- Loading State -->
              <tr v-if="loading">
                <td colspan="7" class="text-center pa-8">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                    size="48"
                  />
                  <p class="mt-4 text-medium-emphasis">Loading rooms...</p>
                </td>
              </tr>
              <!-- Data Rows -->
              <tr
                v-else
                v-for="room in paginatedRooms"
                :key="room.id"
                class="modern-table-row"
              >
                <td class="modern-table-cell text-center id-column">
                  <span class="id-badge">{{ room.id }}</span>
                </td>

                <td class="modern-table-cell">
                  <div class="room-info">
                    <span class="room-avatar">
                      <v-icon size="22" color="#1d4ed8">mdi-door</v-icon>
                    </span>
                    <div class="room-details">
                      <div class="room-name">{{ room.room }}</div>
                    </div>
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <div class="capacity-badge">
                    <v-icon size="16" class="mr-1">mdi-seat</v-icon>
                    {{ room.capacity || 'N/A' }}
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <v-chip
                    :color="room.active ? 'success' : 'error'"
                    class="status-chip"
                    size="small"
                  >
                    <v-icon start size="16">mdi-check-circle</v-icon>
                    {{ room.active ? "Active" : "Inactive" }}
                  </v-chip>
                </td>

                <td class="modern-table-cell">
                  <div class="date-info">
                    <div class="date-primary">
                      {{ formatDate(room.created_at) }}
                    </div>
                    <div class="date-secondary">
                      {{ formatTime(room.created_at) }}
                    </div>
                  </div>
                </td>

                <td class="modern-table-cell">
                  <div class="date-info">
                    <div class="date-primary">
                      {{ formatDate(room.updated_at) }}
                    </div>
                    <div class="date-secondary">
                      {{ formatTime(room.updated_at) }}
                    </div>
                  </div>
                </td>

                <td class="modern-table-cell text-center">
                  <div class="action-group">
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="openEditDialog(room)"
                    >
                      <v-icon color="#fde047">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="confirmDelete(room)"
                    >
                      <v-icon color="#dc2626">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Empty State -->
          <div v-if="filteredRooms.length === 0" class="empty-state">
            <v-icon
              icon="mdi-door-open"
              size="64"
              color="grey-lighten-1"
            />
            <h3 class="empty-title">No rooms found</h3>
            <p class="empty-subtitle">
              {{
                searchQuery
                  ? "Try adjusting your search terms"
                  : "Create your first room to get started"
              }}
            </p>
            <v-btn
              v-if="!searchQuery"
              color="primary"
              variant="flat"
              @click="openCreateDialog"
              class="mt-4"
            >
              <v-icon start icon="mdi-plus" />
              Add First Room
            </v-btn>
          </div>

          <!-- Pagination -->
          <div v-if="filteredRooms.length > 0" class="pagination-section">
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

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialogOpen" max-width="550" persistent>
      <v-card class="modern-dialog" elevation="24">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon
                :icon="isEdit ? 'mdi-pencil-circle' : 'mdi-plus-circle'"
                :color="isEdit ? '#fde047' : 'primary'"
                size="28"
              />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">
                {{ isEdit ? "Edit Room" : "Create New Room" }}
              </h2>
              <p class="dialog-subtitle">
                {{
                  isEdit
                    ? "Modify room information"
                    : "Add a new room to the system"
                }}
              </p>
            </div>
          </div>
          <v-btn
            icon="mdi-close"
            variant="text"
            size="small"
            @click="closeDialog"
            class="close-btn"
          />
        </div>
        <v-divider />
        <v-card-text class="dialog-content">
          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="submitForm"
          >
            <div class="form-group">
              <label class="form-label">Room Name</label>
              <v-text-field
                v-model="formData.room"
                placeholder="Enter room name"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-door"
                :rules="roomNameRules"
                hide-details="auto"
              />
            </div>
            <div class="form-group">
              <label class="form-label">Capacity</label>
              <v-text-field
                v-model.number="formData.capacity"
                placeholder="Enter room capacity"
                variant="outlined"
                density="comfortable"
                prepend-inner-icon="mdi-seat"
                type="number"
                :rules="capacityRules"
                hide-details="auto"
              />
            </div>
            <div class="form-group">
              <div class="switch-container">
                <div class="switch-info">
                  <label class="form-label">Status</label>
                  <p class="switch-description">
                    {{
                      formData.active
                        ? "Room is active and available"
                        : "Room is inactive and hidden"
                    }}
                  </p>
                </div>
                <v-switch
                  v-model="formData.active"
                  color="success"
                  inset
                  hide-details
                />
              </div>
            </div>
          </v-form>
        </v-card-text>
        <v-divider />
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog"
            >Cancel</v-btn
          >
          <v-btn
            :color="isEdit ? 'warning' : 'primary'"
            variant="flat"
            @click="submitForm"
            :disabled="!formValid"
            :loading="formLoading"
          >
            {{ isEdit ? "Update Room" : "Create Room" }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="delete-dialog" elevation="24">
        <div class="delete-header">
          <div class="delete-icon-container">
            <v-icon icon="mdi-delete-alert" color="error" size="48" />
          </div>
          <h2 class="delete-title">Delete Room</h2>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>
        <v-divider />
        <v-card-text class="delete-content">
          <div class="warning-box">
            <v-icon
              icon="mdi-alert-circle"
              color="warning"
              class="warning-icon"
            />
            <p class="warning-message">
              You are about to permanently delete
              <strong class="room-name">{{
                selectedRoom?.room
              }}</strong>
            </p>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="delete-actions">
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn
            color="error"
            variant="flat"
            @click="handleDelete"
            :loading="deleteLoading"
          >
            Delete Room
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

import { ref, computed, watch, onMounted, reactive } from "vue";

// Mock store - replace with actual room store when available
const rooms = ref([]);
const loading = ref(false);

const searchQuery = ref("");
const statusFilter = ref("All");
const showFilters = ref(false);
const currentPage = ref(1);
const itemsPerPage = ref(10);
const dialogOpen = ref(false);
const deleteDialog = ref(false);
const selectedRoom = ref(null);
const isEdit = ref(false);
const formValid = ref(false);
const formLoading = ref(false);
const deleteLoading = ref(false);

const formData = reactive({
  global_id: "",
  room: "",
  capacity: null,
  active: true,
});

// Fetch rooms on mount - replace with actual API call
onMounted(async () => {
  loading.value = true;
  console.log("=== FETCHING ROOMS ===");
  try {
    // TODO: Replace with actual API call
    const { $AdminPrivateAxios } = useNuxtApp();
    const response = await $AdminPrivateAxios.get('/rooms/');
    console.log("Rooms API response:", response);
    console.log("Rooms data:", response.data);
    rooms.value = response.data?.data || [];
    console.log("Total rooms loaded:", rooms.value.length);
    console.log("Rooms list:", rooms.value);
    console.log("======================");
  } catch (error) {
    console.error("Failed to fetch rooms:", error);
    // Fallback to empty array
    rooms.value = [];
  } finally {
    loading.value = false;
  }
});

const roomNameRules = [
  (v) => !!v || "Room name is required",
  (v) => v.length >= 2 || "At least 2 characters",
  (v) => v.length <= 50 || "Max 50 characters",
];

const capacityRules = [
  (v) => v === null || v === "" || v >= 0 || "Capacity must be 0 or greater",
];

const filteredRooms = computed(() => {
  let filtered = [...rooms.value];

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    filtered = filtered.filter(
      (r) =>
        String(r.room || "")
          .toLowerCase()
          .includes(q) ||
        String(r.global_id || "")
          .toLowerCase()
          .includes(q)
    );
  }

  if (statusFilter.value !== "All") {
    const active = statusFilter.value === "1";
    filtered = filtered.filter((r) => !!r.active === active);
  }

  return filtered;
});

const totalPages = computed(() =>
  Math.ceil(filteredRooms.value.length / itemsPerPage.value)
);

const paginatedRooms = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  return filteredRooms.value.slice(start, start + itemsPerPage.value);
});

const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "2-digit",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const formatTime = (dateStr) => {
  if (!dateStr) return "";
  try {
    return new Date(dateStr).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
};

const openCreateDialog = () => {
  isEdit.value = false;
  Object.assign(formData, { global_id: "", room: "", capacity: null, active: true });
  dialogOpen.value = true;
};

const openEditDialog = (room) => {
  selectedRoom.value = room;
  isEdit.value = true;
  Object.assign(formData, {
    global_id: room.global_id || "",
    room: room.room || "",
    capacity: room.capacity || null,
    active: !!room.active,
  });
  dialogOpen.value = true;
};

const closeDialog = () => {
  dialogOpen.value = false;
  selectedRoom.value = null;
};

const submitForm = async () => {
  if (!formValid.value) return;
  formLoading.value = true;
  try {
    const { $AdminPrivateAxios } = useNuxtApp();
    
    if (isEdit.value && selectedRoom.value) {
      const identifier = selectedRoom.value.global_id
        ? String(selectedRoom.value.global_id)
        : String(selectedRoom.value.id);
      await $AdminPrivateAxios.patch(`/rooms/${identifier}`, {
        room: formData.room,
        capacity: formData.capacity,
        active: formData.active ? 1 : 0,
      });
    } else {
      await $AdminPrivateAxios.post('/rooms/', {
        room: formData.room,
        capacity: formData.capacity,
        active: formData.active ? 1 : 0,
      });
    }
    
    // Refresh the list
    const response = await $AdminPrivateAxios.get('/rooms/');
    rooms.value = response.data?.data || [];
    closeDialog();
  } catch (e) {
    console.error("Room save error", e);
  } finally {
    formLoading.value = false;
  }
};

const confirmDelete = (room) => {
  selectedRoom.value = room;
  deleteDialog.value = true;
};

const handleDelete = async () => {
  if (!selectedRoom.value) return;
  deleteLoading.value = true;
  
  console.log("=== DELETE OPERATION START ===");
  console.log("Selected room to delete:", selectedRoom.value);
  
  try {
    const { $AdminPrivateAxios } = useNuxtApp();
    const identifier = selectedRoom.value.global_id
      ? String(selectedRoom.value.global_id)
      : String(selectedRoom.value.id);
    
    console.log("Using identifier:", identifier);
    console.log("DELETE request URL:", `/rooms/${identifier}/delete`);
    
    // Delete the room using POST method (backend expects POST to /rooms/{id}/delete)
    const response = await $AdminPrivateAxios.post(`/rooms/${identifier}/delete`);
    
    console.log("DELETE response:", response);
    console.log("DELETE response data:", response.data);
    console.log("DELETE SUCCESS - Room marked as deleted (status = 2)");
    
    // Remove from local state immediately
    const roomsBefore = rooms.value.length;
    rooms.value = rooms.value.filter(r => 
      r.id !== selectedRoom.value.id && r.global_id !== selectedRoom.value.global_id
    );
    const roomsAfter = rooms.value.length;
    
    console.log(`Rooms count before: ${roomsBefore}, after: ${roomsAfter}`);
    console.log("Remaining rooms:", rooms.value);
    console.log("=== DELETE OPERATION END ===");
    
    deleteDialog.value = false;
    selectedRoom.value = null;
  } catch (e) {
    console.error("=== DELETE ERROR ===");
    console.error("Delete room error", e);
    console.error("Error details:", e.response?.data);
    console.error("Error status:", e.response?.status);
    console.error("===================");
    
    // Show error message to user
    alert(`Failed to delete room: ${e.response?.data?.message || e.message}`);
  } finally {
    deleteLoading.value = false;
  }
};

const goToPrevPage = () => currentPage.value > 1 && currentPage.value--;
const goToNextPage = () =>
  currentPage.value < totalPages.value && currentPage.value++;

watch(
  [searchQuery, statusFilter],
  () => (currentPage.value = 1)
);
</script>

<style scoped>
.rooms-page {
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

.add-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  color: white !important;
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

.filter-btn {
  height: 40px;
  width: 40px;
  border-radius: 12px;
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.filter-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
  text-align: left !important;
}

.header-content {
  display: flex;
  align-items: center;
  color: #45474b !important;
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
  text-align: left !important;
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

.room-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.room-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border-radius: 10px;
}

.room-details {
  flex: 1;
}

.room-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.capacity-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  font-size: 13px;
  border-radius: 8px;
}

.date-info {
  text-align: left;
}

.date-primary {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.date-secondary {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.action-group {
  display: flex;
  gap: 4px;
  justify-content: flex-start;
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

/* Modern Dialog Styles */
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

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.switch-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 16px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
}

.switch-info {
  flex: 1;
}

.switch-description {
  font-size: 13px;
  color: #64748b;
  margin: 4px 0 0 0;
  line-height: 1.4;
}

.dialog-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

/* Delete Dialog Styles */
.delete-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.delete-header {
  text-align: center;
  padding: 32px 24px 24px;
  background: linear-gradient(135deg, #fef7f7 0%, #fdf2f2 100%);
}

.delete-icon-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 80px;
  height: 80px;
  background: white;
  border-radius: 50%;
  margin: 0 auto 16px;
  box-shadow: 0 4px 16px rgba(239, 68, 68, 0.15);
}

.delete-title {
  font-size: 22px;
  font-weight: 600;
  color: #dc2626;
  margin: 0 0 4px 0;
}

.delete-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
}

.delete-content {
  padding: 24px !important;
}

.warning-box {
  display: flex;
  gap: 12px;
  padding: 16px;
  background: #fef3c7;
  border: 1px solid #fde047;
  border-radius: 12px;
}

.warning-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-message {
  font-size: 14px;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

.room-name {
  color: black;
  font-weight: 600;
}

.delete-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

/* Status Chip Styles */
.status-chip {
  font-weight: 500 !important;
  text-transform: none !important;
  border-radius: 16px !important;
  padding: 0 12px !important;
  height: 28px !important;
}

/* Animation for dialogs */
.modern-dialog,
.delete-dialog {
  animation: dialogSlideIn 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}

@keyframes dialogSlideIn {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-container {
    flex-direction: column;
    align-items: stretch;
    gap: 24px;
  }
  .action-section {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .header-container {
    padding: 16px 20px;
  }
  .modern-table-section {
    padding: 16px 20px;
  }
  .title-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }
  .stats-cards {
    justify-content: center;
    flex-wrap: wrap;
  }
  .toolbar-right {
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }
  .search-container {
    min-width: auto;
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
