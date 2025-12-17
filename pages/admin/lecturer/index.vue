<template>
  <div class="lecturers-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-account-tie" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Lecturer Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon
                  icon="mdi-chevron-right"
                  size="16"
                  color="grey"
                  class="breadcrumb-separator"
                />
                <span class="breadcrumb-item active">Lecturers</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ lecturers.length }}</div>
              <div class="stat-label">Total</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ activeCount }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ inactiveCount }}</div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-btn
            class="modern-btn add-btn"
            prepend-icon="mdi-plus"
            variant="flat"
            @click="openCreateDialog"
          >
            Add Lecturer
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
              <v-icon icon="mdi-account-group" size="20" class="mr-2" />
              Lecturer Information
            </h2>
            <div class="table-subtitle">
              Manage and organize lecturer accounts
            </div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field
                v-model="searchQuery"
                placeholder="Search lecturers..."
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
                <v-btn v-bind="props" variant="outlined" class="filter-btn">
                  <v-icon icon="mdi-filter-variant" />
                </v-btn>
              </template>

              <v-card elevation="4" class="pa-2">
                <v-card-text class="py-2 px-3">
                  <div class="filters-content">
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
        <div class="table-scroll-wrapper">
          <v-table class="modern-table">
            <thead>
              <tr class="modern-header-row">
                <th class="modern-header-cell">#</th>
                <th class="modern-header-cell">Full Name</th>
                <th class="modern-header-cell">Email</th>
                <th class="modern-header-cell">Phone</th>
                <th class="modern-header-cell">Position</th>
                <th class="modern-header-cell">Status</th>
                <th class="modern-header-cell">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(lecturer, index) in paginatedLecturers"
                :key="lecturer.global_id"
                class="modern-table-row"
              >
                <td class="modern-table-cell">
                  <div class="id-badge">
                    {{ (currentPage - 1) * itemsPerPage + index + 1 }}
                  </div>
                </td>
                <td class="modern-table-cell">
                  <div class="lecturer-name">
                    {{ lecturer.first_name }} {{ lecturer.last_name }}
                  </div>
                </td>
                <td class="modern-table-cell">{{ lecturer.email }}</td>
                <td class="modern-table-cell">
                  {{ lecturer.phone_number || "N/A" }}
                </td>
                <td class="modern-table-cell">
                  <v-chip
                    size="small"
                    variant="tonal"
                    :color="positionColor(lecturer.position)"
                  >
                    {{ capitalize(lecturer.position || "Lecturer") }}
                  </v-chip>
                </td>
                <td class="modern-table-cell">
                  <v-chip
                    :color="lecturer.active === 1 ? 'success' : 'error'"
                    size="small"
                    class="status-chip"
                  >
                    <v-icon start size="16">
                      {{
                        lecturer.active === 1
                          ? "mdi-check-circle"
                          : "mdi-close-circle"
                      }}
                    </v-icon>
                    {{ lecturer.active === 1 ? "Active" : "Inactive" }}
                  </v-chip>
                </td>
                <td class="modern-table-cell">
                  <div class="action-group">
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="openViewDialog(lecturer)"
                    >
                      <v-icon size="18" color="#3b82f6">mdi-eye</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="openEditDialog(lecturer)"
                    >
                      <v-icon size="18" color="#f59e0b">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn
                      icon
                      size="small"
                      class="action-btn"
                      @click="toggleStatus(lecturer)"
                    >
                      <v-icon
                        size="18"
                        :color="lecturer.active === 1 ? '#dc2626' : '#10b981'"
                      >
                        {{
                          lecturer.active === 1
                            ? "mdi-account-off"
                            : "mdi-account-check"
                        }}
                      </v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Empty State -->
          <div v-if="filteredLecturers.length === 0" class="empty-state">
            <v-icon
              icon="mdi-account-tie-outline"
              size="64"
              color="grey-lighten-1"
            />
            <h3 class="empty-title">No lecturers found</h3>
            <p class="empty-subtitle">
              Create your first lecturer to get started with teaching staff
              management.
            </p>
            <v-btn
              color="primary"
              variant="flat"
              @click="openCreateDialog"
              class="mt-4"
            >
              <v-icon start>mdi-plus</v-icon>
              Add Lecturer
            </v-btn>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredLecturers.length > 0" class="pagination-section">
          <v-btn
            variant="outlined"
            :disabled="currentPage === 1"
            @click="currentPage--"
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
            @click="currentPage++"
            class="pagination-btn"
          >
            Next
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="700px" persistent>
      <v-card class="modern-dialog" elevation="24">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">
                {{ isEdit ? "Edit Lecturer" : "Create Lecturer" }}
              </h2>
              <p class="dialog-subtitle">
                {{
                  isEdit
                    ? "Update lecturer information"
                    : "Add a new lecturer to the system"
                }}
              </p>
            </div>
          </div>
          <v-btn icon variant="text" @click="closeDialog" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-divider />

        <!-- Dialog Form -->
        <v-card-text class="dialog-content">
          <v-form
            ref="formRef"
            v-model="formValid"
            @submit.prevent="submitForm"
          >
            <v-row dense>
              <!-- First Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.first_name"
                  label="First Name *"
                  placeholder="John"
                  :rules="requiredRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Last Name -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.last_name"
                  label="Last Name *"
                  placeholder="Doe"
                  :rules="requiredRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Email -->
              <v-col cols="12" md="8">
                <v-text-field
                  v-model="formData.email"
                  label="Email Address *"
                  type="email"
                  placeholder="john.doe@example.com"
                  :rules="emailRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Phone -->
              <v-col cols="12" md="4">
                <v-text-field
                  v-model="formData.phone_number"
                  label="Phone Number"
                  placeholder="+855 12 345 678"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Position -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.position"
                  label="Position *"
                  :items="positionOptions"
                  :rules="requiredRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Password (only on create) -->
              <v-col cols="12" md="6">
                <v-text-field
                  v-model="formData.password"
                  label="Password"
                  type="password"
                  placeholder="Min 8 characters"
                  :rules="passwordRules"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>

              <!-- Status -->
              <v-col cols="12" md="6">
                <v-select
                  v-model="formData.active"
                  label="Status *"
                  :items="statusItems"
                  item-title="title"
                  item-value="value"
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                />
              </v-col>
            </v-row>

            <!-- Actions -->
            <div class="form-actions mt-6 d-flex justify-space-between w-100">
              <v-btn
                variant="outlined"
                @click="closeDialog"
                :disabled="loading"
              >
                Cancel
              </v-btn>
              <v-btn
                type="submit"
                color="primary"
                variant="flat"
                :loading="loading"
                :disabled="!formValid"
              >
                {{ isEdit ? "Update" : "Create" }} Lecturer
              </v-btn>
            </div>
          </v-form>
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600px">
      <v-card class="modern-dialog" elevation="24">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon icon="mdi-eye" color="info" size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">Lecturer Details</h2>
              <p class="dialog-subtitle">View complete lecturer information</p>
            </div>
          </div>
          <v-btn
            icon
            variant="text"
            @click="viewDialog = false"
            class="close-btn"
          >
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text v-if="selectedLecturer" class="dialog-content">
          <div class="detail-grid">
            <div class="detail-item">
              <label class="detail-label">Full Name</label>
              <div class="detail-value">
                {{ selectedLecturer.first_name }}
                {{ selectedLecturer.last_name }}
              </div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Email</label>
              <div class="detail-value">{{ selectedLecturer.email }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Phone</label>
              <div class="detail-value">
                {{ selectedLecturer.phone_number || "N/A" }}
              </div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Position</label>
              <div class="detail-value">
                <v-chip
                  size="small"
                  variant="tonal"
                  :color="positionColor(selectedLecturer.position)"
                >
                  {{ capitalize(selectedLecturer.position || "Lecturer") }}
                </v-chip>
              </div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Status</label>
              <div class="detail-value">
                <v-chip
                  :color="selectedLecturer.active === 1 ? 'success' : 'error'"
                  size="small"
                >
                  {{ selectedLecturer.active === 1 ? "Active" : "Inactive" }}
                </v-chip>
              </div>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="viewDialog = false">
            Close
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { useLecturerStore } from "@/store/admins/LecturerStore";
import Swal from "sweetalert2";

interface Lecturer {
  global_id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number?: string;
  position: string;
  active: number;
}

definePageMeta({
  layout: "admin",
  middleware: ["auth"],
});

const lecturerStore = useLecturerStore();

const searchQuery = ref("");
const statusFilter = ref("All");
const showFilters = ref(false);
const currentPage = ref(1);
const itemsPerPage = 10;

const dialog = ref(false);
const viewDialog = ref(false);
const isEdit = ref(false);
const loading = ref(false);
const selectedLecturer = ref<any>(null);
const formValid = ref(false);

const formData = ref({
  first_name: "",
  last_name: "",
  email: "",
  phone_number: "",
  position: "lecturer",
  password: "",
  active: true,
});

const requiredRules = [(v: any) => !!v || "This field is required"];
const emailRules = [
  ...requiredRules,
  (v: string) => /.+@.+\..+/.test(v) || "Valid email required",
];
const passwordRules = [
  (v: any) => !!v || "Password required",
  (v: string) => v.length >= 8 || "Min 8 characters",
];

const positionOptions = [
  { title: "Professor", value: "professor" },
  { title: "Lecturer", value: "lecturer" },
  { title: "Assistant", value: "assistant" },
];

const statusItems = [
  { title: "Active", value: true },
  { title: "Inactive", value: false },
];

const lecturers = computed<Lecturer[]>(() => lecturerStore.lecturers);

const activeCount = computed(
  () => lecturers.value.filter((l) => l.active === 1).length
);
const inactiveCount = computed(
  () => lecturers.value.filter((l) => l.active === 0).length
);

const filteredLecturers = computed<Lecturer[]>(() => {
  let list = lecturers.value;

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase();
    list = list.filter(
      (l) =>
        `${l.first_name} ${l.last_name}`.toLowerCase().includes(q) ||
        l.email.toLowerCase().includes(q)
    );
  }

  if (statusFilter.value !== "All") {
    list = list.filter((l) => l.active === Number(statusFilter.value));
  }

  return list;
});

const totalPages = computed(
  () => Math.ceil(filteredLecturers.value.length / itemsPerPage) || 1
);
const paginatedLecturers = computed<Lecturer[]>(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  return filteredLecturers.value.slice(start, start + itemsPerPage);
});

const capitalize = (s: string) =>
  s ? s.charAt(0).toUpperCase() + s.slice(1) : "";
const positionColor = (pos: string) => {
  if (pos === "professor") return "purple";
  if (pos === "assistant") return "blue";
  return "green";
};

onMounted(async () => {
  await lecturerStore.fetchLecturers();
});

const openCreateDialog = () => {
  isEdit.value = false;
  formData.value = {
    first_name: "",
    last_name: "",
    email: "",
    phone_number: "",
    position: "lecturer",
    password: "",
    active: true,
  };
  dialog.value = true;
};

const openEditDialog = (lecturer: any) => {
  selectedLecturer.value = lecturer;
  isEdit.value = true;
  formData.value = {
    first_name: lecturer.first_name,
    last_name: lecturer.last_name,
    email: lecturer.email,
    phone_number: lecturer.phone_number || "",
    position: lecturer.position || "lecturer",
    active: lecturer.active === 1,
    password: "",
  };
  dialog.value = true;
};

const openViewDialog = (lecturer: any) => {
  selectedLecturer.value = lecturer;
  viewDialog.value = true;
};

const closeDialog = () => {
  dialog.value = false;
  selectedLecturer.value = null;
};

const submitForm = async () => {
  if (!formValid.value) return;
  loading.value = true;

  try {
    const payload = { ...formData.value };
    if (!isEdit.value && !payload.password) {
      throw new Error("Password is required for new lecturer");
    }

    if (isEdit.value) {
      await lecturerStore.updateLecturer(
        selectedLecturer.value.global_id,
        payload
      );
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Lecturer updated successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    } else {
      await lecturerStore.createLecturer(payload);
      Swal.fire({
        icon: "success",
        title: "Success!",
        text: "Lecturer created successfully!",
        timer: 2000,
        showConfirmButton: false,
      });
    }

    closeDialog();
    await lecturerStore.fetchLecturers();
  } catch (err: any) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: err.message || "Operation failed",
    });
  } finally {
    loading.value = false;
  }
};

const toggleStatus = async (lecturer: any) => {
  const newActive = lecturer.active === 1 ? 0 : 1; // numeric 1/0
  try {
    await lecturerStore.toggleLecturerStatus(lecturer.global_id, newActive);

    Swal.fire({
      icon: "success",
      title: "Success!",
      text: `Lecturer is now ${newActive === 1 ? "active" : "inactive"}`,
      timer: 2000,
      showConfirmButton: false,
    });
  } catch (err) {
    Swal.fire({
      icon: "error",
      title: "Error",
      text: "Failed to update status",
    });
  }
};

</script>

<style scoped>
/* Use the exact same beautiful styles from your Subjects page */
.lecturers-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 0;
  overflow-x: hidden;
  width: 100%;
}

/* Modern Header Styles */
.modern-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  width: 100%;
}

.header-container {
  max-width: 100%;
  margin: 0 auto;
  padding: 20px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 24px;
  flex-wrap: wrap;
}

.title-section {
  flex: 1;
  min-width: 0;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;
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
  flex-shrink: 0;
}

.title-content {
  flex: 1;
  min-width: 0;
}

.page-title {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
  flex-wrap: wrap;
}

.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: #3b82f6;
}

.stats-cards {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 12px 16px;
  min-width: 80px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 11px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-section {
  display: flex;
  gap: 10px;
  align-items: center;
  flex-wrap: wrap;
}

.modern-btn {
  height: 40px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 18px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
  white-space: nowrap;
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
  background: #f9fafb;
}

.modern-header-cell {
  padding: 20px 16px !important;
  font-weight: 600 !important;
  color: #45474b !important;
  text-transform: uppercase !important;
  font-size: 13px !important;
  letter-spacing: 0.05em !important;
  border: none !important;
  border-bottom: 1px solid #f1f5f9 !important;
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
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
  padding: 16px !important;
  color: #1e293b;
  font-size: 14px;
  border: none !important;
  vertical-align: middle;
}

.id-column {
  width: 80px;
}

.center-align {
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

.code-badge {
  display: inline-flex;
  align-items: center;
  padding: 6px 12px;
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 8px;
}

.subject-code {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
  font-family: monospace;
}

.subject-info {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.subject-details {
  flex: 1;
}

.subject-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.credit-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  color: #92400e;
  font-weight: 700;
  font-size: 14px;
  border-radius: 8px;
}

.dept-chip {
  font-weight: 500 !important;
  text-transform: none !important;
}

.action-group {
  display: flex;
  gap: 8px;
  justify-content: center;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  transition: all 0.2s ease;
  background: transparent !important;
  box-shadow: none !important;
}

.action-btn:hover {
  transform: scale(1.15);
  background: rgba(0, 0, 0, 0.04) !important;
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

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.detail-item.full-width {
  grid-column: 1 / -1;
}

.detail-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.detail-value {
  font-size: 15px;
  font-weight: 500;
  color: #1e293b;
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
  border: 1px solid #fde047;
  border-radius: 12px;
  background: #f9fafb;
}

.warning-icon {
  flex-shrink: 0;
  margin-top: 2px;
}

.warning-text {
  flex: 1;
}

.warning-message {
  font-size: 14px;
  color: #92400e;
  margin: 0;
  line-height: 1.4;
}

.subject-name {
  color: black;
  font-weight: 600;
}

.delete-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}

.delete-btn {
  min-width: 130px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  transform: translateY(-1px);
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

  .detail-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .modern-header {
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
    min-width: 900px;
  }
}
</style>
