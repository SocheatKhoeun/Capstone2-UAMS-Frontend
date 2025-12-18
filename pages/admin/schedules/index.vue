<template>
  <div class="schedules-page">
    <!-- Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-calendar-clock" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Schedule Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Schedules</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ schedules.length }}</div>
              <div class="stat-label">Total Schedules</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ activeSchedules.length }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ groupsWithSchedule.length }}</div>
              <div class="stat-label">Groups</div>
            </div>
          </div>
        </div>

        <div class="action-section">

          <!-- Export Button Component -->
          <ExportButtons :data="filteredSchedules" :columns="exportColumns" filename="Schedules_Export"
            @export-start="handleExportStart" @export-complete="handleExportComplete"
            @export-error="handleExportError" />

          <!-- Import Button Component -->
          <ImportCsv :columns="importColumns" :validate-row="validateImportRow" :transform-row="transformImportRow"
            @import-start="handleImportStart" @import-complete="handleImportComplete"
            @import-error="handleImportError" />

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
            @click="openCreateDialog" elevation="2">
            Create Schedule
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Schedule Cards Grid -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Table Header with Search and Filters -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="table-title">
              <v-icon icon="mdi-calendar-clock" size="20" class="mr-2" />
              Schedule Information
            </h2>
            <div class="table-subtitle">Manage and organize your schedules</div>
          </div>

          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field v-model="searchQuery" placeholder="Search schedules..." prepend-inner-icon="mdi-magnify"
                variant="outlined" density="compact" hide-details class="search-input" clearable />
            </div>

            <v-select v-model="generationFilter" :items="generationOptions" label="Generation" variant="outlined"
              density="compact" hide-details class="filter-select" />

            <v-select v-model="yearFilter" :items="yearOptions" label="Year" variant="outlined" density="compact"
              hide-details class="filter-select" />

            <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined" density="compact"
              hide-details class="filter-select" />
          </div>
        </div>

        <!-- Schedule Cards -->
        <div class="cards-content">
          <!-- Loading State -->
          <div v-if="loading" class="loading-state">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-grey">Loading schedules...</p>
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredSchedules.length === 0" class="empty-state">
            <v-icon icon="mdi-calendar-clock" size="64" color="grey-lighten-1" class="mb-4" />
            <h3 class="text-h6 text-grey-darken-1 mb-2">No schedules found</h3>
            <p class="text-body-2 text-grey">
              {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first schedule to get started' }}
            </p>
            <v-btn v-if="!searchQuery" color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
              <v-icon start>mdi-plus</v-icon>
              Create Schedule
            </v-btn>
          </div>

          <!-- Cards Grid -->
          <div v-else class="cards-grid">
            <v-card v-for="schedule in paginatedSchedules" :key="schedule.id" class="schedule-card" elevation="2"
              @click="viewSchedule(schedule)">
              <div class="card-header">
                <div class="group-info">
                  <h3 class="group-name">{{ getGroupName(schedule.group_id) }}</h3>
                  <div class="group-details">
                    <span class="group-id">{{ getSubjectName(schedule.subject_id) }}</span>
                    <v-chip :color="schedule.active ? 'success' : 'error'" size="small" variant="flat">
                      {{ schedule.active ? 'Active' : 'Inactive' }}
                    </v-chip>
                  </div>
                </div>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" v-bind="props" @click.stop></v-btn>
                  </template>
                  <v-list>
                    <v-list-item @click.stop="editSchedule(schedule)">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-pencil" />
                      </template>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="duplicateSchedule(schedule)">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-content-copy" />
                      </template>
                      <v-list-item-title>Duplicate</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="deleteSchedule(schedule)">
                      <template v-slot:prepend>
                        <v-icon icon="mdi-delete" color="error" />
                      </template>
                      <v-list-item-title class="text-error">Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div class="card-content">
                <div class="schedule-info">
                  <div class="info-row">
                    <v-icon icon="mdi-account-school" size="16" class="mr-2" />
                    <span>{{ getGenerationName(schedule.generation_id) }}</span>
                  </div>
                  <div class="info-row">
                    <v-icon icon="mdi-calendar-clock" size="16" class="mr-2" />
                    <span>{{ formatDateRange(schedule.start_time, schedule.end_time) }}</span>
                  </div>
                  <div class="info-row">
                    <v-icon icon="mdi-door" size="16" class="mr-2" />
                    <span>Room: {{ getRoomName(schedule.room_id) }}</span>
                  </div>
                  <div class="info-row">
                    <v-icon icon="mdi-account-tie" size="16" class="mr-2" />
                    <span>Instructor: {{ getInstructorName(schedule.instructor_id) }}</span>
                  </div>
                  <div class="info-row">
                    <v-icon icon="mdi-information" size="16" class="mr-2" />
                    <span>Status: {{ getStatusLabel(schedule.status) }}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <span class="updated-date">Updated {{ formatDate(schedule.updated_at) }}</span>
                <v-btn variant="outlined" size="small" @click.stop="viewSchedule(schedule)">
                  View Schedule
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- Pagination Footer -->
          <div v-if="filteredSchedules.length > 0" class="pagination-section">
            <v-btn variant="outlined" :disabled="currentPage === 1" @click="goToPrevPage" class="pagination-btn">
              Previous
            </v-btn>

            <div class="pagination-info">
              <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
            </div>

            <v-btn variant="outlined" :disabled="currentPage >= totalPages" @click="goToNextPage"
              class="pagination-btn">
              Next
            </v-btn>
          </div>
        </div>
      </div>
    </div>

    <!-- Create/Edit Schedule Dialog -->
    <v-dialog v-model="scheduleDialog" max-width="800" persistent>
      <v-card class="modern-dialog" elevation="24">
        <!-- Dialog Header -->
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" color="#fde047" size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">{{ isEdit ? 'Edit Schedule' : 'Create New Schedule' }}</h2>
              <p class="dialog-subtitle">{{ isEdit ? 'Update schedule information and settings' : 'Set up a new schedule for the group' }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
        </div>

        <v-divider />

        <!-- Dialog Content -->
        <v-card-text class="dialog-content">
          <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
            <v-row>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Group *</label>
                  <v-select v-model="formData.group_id" :items="groupOptions" :rules="requiredRules" variant="outlined"
                    density="comfortable" hide-details="auto" class="form-field" :loading="loadingOptions"
                    placeholder="Select a group" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Subject *</label>
                  <v-select 
                    v-model="formData.subject_id" 
                    :items="subjectOptions" 
                    item-title="title"
                    item-value="value"
                    :rules="requiredRules"
                    variant="outlined" 
                    density="comfortable" 
                    hide-details="auto" 
                    class="form-field"
                    :loading="loadingOptions" 
                    placeholder="Select a subject"
                    @update:model-value="(val) => console.log('Subject v-select updated:', val)" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Term *</label>
                  <v-select 
                    v-model="formData.term_id" 
                    :items="termOptions" 
                    item-title="title"
                    item-value="value"
                    variant="outlined" 
                    density="comfortable"
                    hide-details="auto" 
                    :rules="requiredRules" 
                    class="form-field" 
                    :loading="loadingOptions"
                    placeholder="Select a term"
                    @update:model-value="(val) => console.log('Term v-select updated:', val)" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Generation *</label>
                  <v-select v-model="formData.generation_id" :items="generationOptions" variant="outlined"
                    density="comfortable" hide-details="auto" :rules="requiredRules" class="form-field"
                    :loading="loadingOptions" placeholder="Select a generation" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Instructor *</label>
                  <v-select v-model="formData.instructor_id" :items="instructorOptions" variant="outlined"
                    density="comfortable" hide-details="auto" :rules="requiredRules" class="form-field"
                    :loading="loadingOptions" placeholder="Select an instructor" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Assistant *</label>
                  <v-select v-model="formData.assistant_id" :items="instructorOptions" variant="outlined"
                    density="comfortable" hide-details="auto" :rules="requiredRules" class="form-field"
                    :loading="loadingOptions" placeholder="Select an assistant" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Room</label>
                  <v-select v-model="formData.room_id" :items="roomOptions" variant="outlined" density="comfortable"
                    hide-details="auto" class="form-field" :loading="loadingOptions" clearable
                    placeholder="Select a room (optional)" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Status *</label>
                  <v-select v-model="formData.status" :items="statusItems" variant="outlined" density="comfortable"
                    hide-details="auto" :rules="requiredRules" class="form-field" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">Start Time</label>
                  <v-text-field v-model="formData.start_time" type="datetime-local" variant="outlined"
                    density="comfortable" hide-details="auto" class="form-field" />
                </div>
              </v-col>
              <v-col cols="12" md="6">
                <div class="form-group">
                  <label class="form-label">End Time</label>
                  <v-text-field v-model="formData.end_time" type="datetime-local" variant="outlined"
                    density="comfortable" hide-details="auto" class="form-field" />
                </div>
              </v-col>
              <v-col cols="12">
                <div class="form-group">
                  <label class="form-label">Description</label>
                  <v-textarea v-model="formData.description" variant="outlined" density="comfortable"
                    hide-details="auto" class="form-field" rows="3" placeholder="Additional notes or description" />
                </div>
              </v-col>
              <v-col cols="12">
                <v-checkbox v-model="formData.active" label="Active" hide-details color="primary" />
              </v-col>
            </v-row>
          </v-form>
        </v-card-text>

        <v-divider />

        <!-- Dialog Actions -->
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog" class="action-btn cancel-btn">
            <v-icon start>mdi-close</v-icon>
            Cancel
          </v-btn>

          <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm" :disabled="!formValid"
            :loading="loading" class="action-btn submit-btn">
            <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ isEdit ? 'Update Schedule' : 'Create Schedule' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Schedule Detail View Dialog -->
    <v-dialog v-model="scheduleDetailDialog" max-width="900" persistent>
      <v-card v-if="selectedSchedule" class="detail-dialog-card" elevation="24">
        <!-- Dialog Header -->
        <div class="detail-dialog-header">
          <div class="header-content">
            <div class="header-icon-wrapper">
              <v-icon icon="mdi-calendar-clock" color="white" size="28" />
            </div>
            <div class="header-text">
              <h2 class="detail-dialog-title">Schedule Details</h2>
              <p class="detail-dialog-subtitle">Complete schedule information overview</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="scheduleDetailDialog = false" class="close-btn" />
        </div>

        <v-divider />

        <!-- Dialog Content -->
        <v-card-text class="detail-dialog-content">
          <div class="detail-info-grid">
            <!-- Group -->
            <div class="info-card">
              <div class="info-icon-wrapper group">
                <v-icon icon="mdi-account-group" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Group</div>
                <div class="info-value">{{ getGroupName(selectedSchedule.group_id) }}</div>
              </div>
            </div>

            <!-- Subject -->
            <div class="info-card">
              <div class="info-icon-wrapper subject">
                <v-icon icon="mdi-book-open-variant" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Subject</div>
                <div class="info-value">{{ getSubjectName(selectedSchedule.subject_id) }}</div>
              </div>
            </div>

            <!-- Term -->
            <div class="info-card">
              <div class="info-icon-wrapper term">
                <v-icon icon="mdi-calendar-range" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Term</div>
                <div class="info-value">{{ getTermName(selectedSchedule.term_id) }}</div>
              </div>
            </div>

            <!-- Generation -->
            <div class="info-card">
              <div class="info-icon-wrapper generation">
                <v-icon icon="mdi-account-school" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Generation</div>
                <div class="info-value">{{ getGenerationName(selectedSchedule.generation_id) }}</div>
              </div>
            </div>

            <!-- Instructor -->
            <div class="info-card">
              <div class="info-icon-wrapper instructor">
                <v-icon icon="mdi-account-tie" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Instructor</div>
                <div class="info-value">{{ getInstructorName(selectedSchedule.instructor_id) }}</div>
              </div>
            </div>

            <!-- Assistant -->
            <div class="info-card">
              <div class="info-icon-wrapper assistant">
                <v-icon icon="mdi-account-supervisor" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Assistant</div>
                <div class="info-value">{{ getInstructorName(selectedSchedule.assistant_id) || 'N/A' }}</div>
              </div>
            </div>

            <!-- Room -->
            <div class="info-card">
              <div class="info-icon-wrapper room">
                <v-icon icon="mdi-door" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Room</div>
                <div class="info-value">{{ getRoomName(selectedSchedule.room_id) }}</div>
              </div>
            </div>

            <!-- Status -->
            <div class="info-card">
              <div class="info-icon-wrapper status">
                <v-icon icon="mdi-information" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Status</div>
                <div class="info-value">
                  <v-chip :color="getStatusColor(selectedSchedule.status)" size="small" variant="flat" class="status-chip">
                    {{ getStatusLabel(selectedSchedule.status) }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Active -->
            <div class="info-card">
              <div class="info-icon-wrapper active">
                <v-icon icon="mdi-toggle-switch" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Active</div>
                <div class="info-value">
                  <v-chip :color="selectedSchedule.active ? 'success' : 'error'" size="small" variant="flat" class="status-chip">
                    {{ selectedSchedule.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
              </div>
            </div>

            <!-- Start Time -->
            <div class="info-card">
              <div class="info-icon-wrapper time">
                <v-icon icon="mdi-calendar-clock" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Start Time</div>
                <div class="info-value">{{ formatDateTime(selectedSchedule.start_time) }}</div>
              </div>
            </div>

            <!-- End Time -->
            <div class="info-card">
              <div class="info-icon-wrapper time">
                <v-icon icon="mdi-calendar-clock" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">End Time</div>
                <div class="info-value">{{ formatDateTime(selectedSchedule.end_time) }}</div>
              </div>
            </div>

            <!-- Description -->
            <div class="info-card full-width" v-if="selectedSchedule.description">
              <div class="info-icon-wrapper description">
                <v-icon icon="mdi-text" color="white" size="20" />
              </div>
              <div class="info-content">
                <div class="info-label">Description</div>
                <div class="info-value description-text">{{ selectedSchedule.description || 'N/A' }}</div>
              </div>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Dialog Actions -->
        <v-card-actions class="detail-dialog-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="scheduleDetailDialog = false" class="action-btn cancel-btn">
            <v-icon start>mdi-close</v-icon>
            Close
          </v-btn>
          <v-spacer />
          <!-- <v-btn color="primary" variant="flat" @click="editScheduleFromDetail" class="action-btn submit-btn">
            <v-icon start>mdi-pencil</v-icon>
            Edit Schedule
          </v-btn> -->
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="420" persistent>
      <v-card class="delete-dialog" elevation="24">
        <!-- Delete Header -->
        <div class="delete-header">
          <div class="delete-icon-container">
            <v-icon icon="mdi-delete-alert" color="error" size="48" />
          </div>
          <h2 class="delete-title">Delete Schedule</h2>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>

        <v-divider />

        <!-- Delete Content -->
        <v-card-text class="delete-content">
          <div class="warning-box">
            <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
            <div class="warning-text">
              <p class="warning-message">
                You are about to permanently delete the schedule for
                <strong class="schedule-name">{{ scheduleToDelete ? getGroupName(scheduleToDelete.group_id) : 'this schedule' }}</strong>
              </p>
            </div>
          </div>
        </v-card-text>

        <v-divider />

        <!-- Delete Actions -->
        <v-card-actions class="delete-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false" class="action-btn cancel-btn">
            <v-icon start>mdi-cancel</v-icon>
            Cancel
          </v-btn>

          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleteLoading"
            class="action-btn delete-btn">
            <v-icon start>mdi-delete</v-icon>
            Delete Schedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useScheduleStore } from '~/store/useScheduleStore'
import { storeToRefs } from 'pinia'
import ExportButtons from '~/components/ui/ExportButtons.vue'
import ImportCsv from '~/components/ui/ImportCsv.vue'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

// Store
const scheduleStore = useScheduleStore()
const { schedules, loading } = storeToRefs(scheduleStore)

// Reactive data
const searchQuery = ref('')
const generationFilter = ref('All')
const yearFilter = ref('All')
const statusFilter = ref('All')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const scheduleDialog = ref(false)
const scheduleDetailDialog = ref(false)
const deleteDialog = ref(false)
const selectedSchedule = ref(null)
const scheduleToDelete = ref(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const deleteLoading = ref(false)

// Reference data
const groups = ref([])
const subjects = ref([])
const terms = ref([])
const instructors = ref([])
const rooms = ref([])
const generations = ref([])
const loadingOptions = ref(false)

// Form data - matched to backend CourseOffering model
const formData = reactive({
  group_id: null,
  subject_id: null,
  term_id: null,
  room_id: null,
  instructor_id: null,
  assistant_id: null,
  generation_id: null,
  description: '',
  status: 1, // 1=planned, 2=active, 3=completed, 4=canceled
  active: true,
  start_time: null,
  end_time: null
})

// ...existing code...

// --- EXPORT/IMPORT CONFIGURATION ---

// Export columns for Excel/PDF/CSV
const exportColumns = [
  { label: 'ID', field: 'id' },
  { label: 'Group', field: row => getGroupName(row.group_id) },
  { label: 'Subject', field: row => getSubjectName(row.subject_id) },
  { label: 'Term', field: row => getTermName(row.term_id) },
  { label: 'Generation', field: row => getGenerationName(row.generation_id) },
  { label: 'Room', field: row => getRoomName(row.room_id) },
  { label: 'Instructor', field: row => getInstructorName(row.instructor_id) },
  { label: 'Assistant', field: row => getInstructorName(row.assistant_id) },
  { label: 'Status', field: row => getStatusLabel(row.status) },
  { label: 'Active', field: row => (row.active ? 'Active' : 'Inactive') },
  { label: 'Start Time', field: row => formatDate(row.start_time) },
  { label: 'End Time', field: row => formatDate(row.end_time) },
  { label: 'Description', field: 'description' },
  { label: 'Updated At', field: row => formatDate(row.updated_at) }
]

// Import columns (CSV header mapping)
const importColumns = [
  { label: 'Group', field: 'group_id', required: true },
  { label: 'Subject', field: 'subject_id', required: true },
  { label: 'Term', field: 'term_id', required: true },
  { label: 'Generation', field: 'generation_id', required: true },
  { label: 'Room', field: 'room_id' },
  { label: 'Instructor', field: 'instructor_id', required: true },
  { label: 'Assistant', field: 'assistant_id', required: true },
  { label: 'Status', field: 'status', required: true },
  { label: 'Active', field: 'active' },
  { label: 'Start Time', field: 'start_time' },
  { label: 'End Time', field: 'end_time' },
  { label: 'Description', field: 'description' }
]

// Validate each imported row
function validateImportRow(row) {
  // Check required fields
  const requiredFields = ['group_id', 'subject_id', 'term_id', 'generation_id', 'instructor_id', 'assistant_id', 'status']
  for (const field of requiredFields) {
    if (!row[field] || String(row[field]).trim() === '') {
      return `Missing required field: ${field}`
    }
  }
  // Optionally, add more validation (e.g., check if IDs exist in reference data)
  return true
}

// Transform imported row to match backend model
function transformImportRow(row) {
  // Helper to parse boolean/active
  const parseActive = v => (v === '1' || v === 1 || v === true || String(v).toLowerCase() === 'active')
  // Helper to parse int
  const parseIntOrNull = v => (v === '' || v == null ? null : parseInt(v, 10))

  return {
    group_id: parseIntOrNull(row.group_id),
    subject_id: parseIntOrNull(row.subject_id),
    term_id: parseIntOrNull(row.term_id),
    generation_id: parseIntOrNull(row.generation_id),
    room_id: parseIntOrNull(row.room_id),
    instructor_id: parseIntOrNull(row.instructor_id),
    assistant_id: parseIntOrNull(row.assistant_id),
    status: parseIntOrNull(row.status) || 1,
    active: row.active !== undefined ? parseActive(row.active) : true,
    start_time: row.start_time ? new Date(row.start_time).toISOString() : null,
    end_time: row.end_time ? new Date(row.end_time).toISOString() : null,
    description: row.description || ''
  }
}

function handleExportStart() {
  // Optionally show a loading indicator
}
function handleExportComplete() {
  // Optionally show a success message
}
function handleExportError(e) {
  alert('Export failed: ' + (e?.message || e))
}

async function handleImportStart() {
  // Optionally show a loading indicator
}
async function handleImportComplete(importedRows) {
  // Bulk create schedules
  let successCount = 0
  let failCount = 0
  for (const row of importedRows) {
    try {
      const result = await scheduleStore.createSchedule(row)
      if (result.success) successCount++
      else failCount++
    } catch {
      failCount++
    }
  }
  await scheduleStore.fetchSchedules()
  alert(`Import complete: ${successCount} succeeded, ${failCount} failed`)
}
function handleImportError(e) {
  alert('Import failed: ' + (e?.message || e))
}

// Helper for export columns
function getTermName(termId) {
  const term = terms.value.find(t => t.id === termId)
  return term?.term || 'N/A'
}

// Computed
const activeSchedules = computed(() => schedules.value.filter(s => s.active))
const groupsWithSchedule = computed(() => [...new Set(schedules.value.map(s => s.group_id))])

const filteredSchedules = computed(() => {
  let filtered = schedules.value

  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(s => {
      const groupName = getGroupName(s.group_id).toLowerCase()
      const subjectName = getSubjectName(s.subject_id).toLowerCase()
      return groupName.includes(query) || subjectName.includes(query)
    })
  }

  if (generationFilter.value !== 'All') {
    filtered = filtered.filter(s => String(s.generation_id) === generationFilter.value)
  }

  if (yearFilter.value !== 'All') {
    // Filter by year if you have a year field in the backend
    // filtered = filtered.filter(s => String(s.year) === yearFilter.value)
  }

  if (statusFilter.value !== 'All') {
    const isActive = statusFilter.value === 'active'
    filtered = filtered.filter(s => !!s.active === isActive)
  }

  return filtered
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredSchedules.value.length / itemsPerPage.value))

const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSchedules.value.slice(start, end)
})

// Computed options for dropdowns
const groupOptions = computed(() => {
  const options = groups.value.map(g => ({ title: g.group_name || g.id, value: g.id }))
  console.log('groupOptions sample:', options[0])
  return options
})

const subjectOptions = computed(() => {
  const options = subjects.value.map(s => {
    return { title: `${s.code} - ${s.name}`, value: s.id }
  })
  console.log('subjectOptions:', options.length, 'items, sample:', options[0])
  return options
})

const termOptions = computed(() => {
  const options = terms.value.map(t => {
    return { title: t.term, value: t.id }
  })
  console.log('termOptions:', options.length, 'items, sample:', options[0])
  return options
})
const instructorOptions = computed(() => instructors.value.map(i => ({ title: `${i.first_name} ${i.last_name}`, value: i.id })))
const roomOptions = computed(() => rooms.value.map(r => ({ title: r.room, value: r.id })))
const generationOptions = computed(() => generations.value.map(g => ({ title: g.generation, value: g.id })))
const statusOptions = ['All', 'active', 'inactive']
const statusItems = [
  { title: 'Planned', value: 1 },
  { title: 'Active', value: 2 },
  { title: 'Completed', value: 3 },
  { title: 'Canceled', value: 4 }
]

// Validation rules
const requiredRules = [v => (v !== null && v !== undefined && v !== '') || 'Field is required']

// Methods
const openCreateDialog = () => {
  resetForm()
  isEdit.value = false
  scheduleDialog.value = true
  
  // Debug: Log options available
  console.log('Dialog opened - SubjectOptions:', subjectOptions.value.length, 'items')
  console.log('Dialog opened - TermOptions:', termOptions.value.length, 'items')
  console.log('FormData initial:', { ...formData })
}

const editSchedule = (schedule) => {
  // Only copy the actual model fields, not computed/display fields
  Object.assign(formData, {
    id: schedule.id,
    global_id: schedule.global_id,
    group_id: schedule.group_id,
    subject_id: schedule.subject_id,
    term_id: schedule.term_id,
    room_id: schedule.room_id,
    instructor_id: schedule.instructor_id,
    assistant_id: schedule.assistant_id,
    generation_id: schedule.generation_id,
    description: schedule.description,
    status: schedule.status,
    active: schedule.active,
    start_time: schedule.start_time,
    end_time: schedule.end_time
  })
  isEdit.value = true
  scheduleDialog.value = true
}

const editScheduleFromDetail = () => {
  if (selectedSchedule.value) {
    scheduleDetailDialog.value = false
    editSchedule(selectedSchedule.value)
  }
}

const closeDialog = () => {
  scheduleDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    group_id: null,
    subject_id: null,
    term_id: null,
    room_id: null,
    instructor_id: null,
    assistant_id: null,
    generation_id: null,
    description: '',
    status: 1,
    active: true,
    start_time: null,
    end_time: null
  })
  formRef.value?.resetValidation()
}

const submitForm = async () => {
  // First validate the form
  const { valid } = await formRef.value.validate()
  if (!valid) {
    alert('Please fill in all required fields')
    return
  }

  try {
    // Helper function to ensure ID is valid (number or numeric string)
    const sanitizeId = (value) => {
      if (value === null || value === undefined || value === '') return null
      // If it's already a number, return it
      if (typeof value === 'number') return value
      // If it's a string that's purely numeric, convert to number
      if (typeof value === 'string' && /^\d+$/.test(value.trim())) {
        return parseInt(value.trim(), 10)
      }
      // Otherwise return null (invalid ID)
      return null
    }

    // Create a clean payload that matches the backend API with sanitized IDs
    const payload = {
      group_id: sanitizeId(formData.group_id),
      subject_id: sanitizeId(formData.subject_id),
      term_id: sanitizeId(formData.term_id),
      room_id: sanitizeId(formData.room_id),
      instructor_id: sanitizeId(formData.instructor_id),
      assistant_id: sanitizeId(formData.assistant_id),
      generation_id: sanitizeId(formData.generation_id),
      description: formData.description || '',
      status: formData.status || 1,
      active: formData.active !== undefined ? formData.active : true,
      start_time: formData.start_time ? new Date(formData.start_time).toISOString() : null,
      end_time: formData.end_time ? new Date(formData.end_time).toISOString() : null
    }

    // Validate required fields
    if (!payload.group_id || !payload.subject_id || !payload.term_id ||
      !payload.instructor_id || !payload.assistant_id || !payload.generation_id) {
      alert('Please fill in all required fields with valid values')
      console.log('Validation failed - payload:', payload)
      return
    }

    console.log('Submitting payload:', payload)

    const result = isEdit.value
      ? await scheduleStore.updateSchedule(formData.global_id || formData.id, payload)
      : await scheduleStore.createSchedule(payload)

    if (result.success) {
      scheduleDialog.value = false
      resetForm()
      await scheduleStore.fetchSchedules() // Refresh the list
      // Show success message
      alert(isEdit.value ? 'Schedule updated successfully!' : 'Schedule created successfully!')
    } else {
      alert(`Error: ${result.error || 'Unknown error'}`)
    }
  } catch (error) {
    console.error('Error submitting form:', error)
    alert(`Error: ${error.message}`)
  }
}

const viewSchedule = (schedule) => {
  selectedSchedule.value = schedule
  scheduleDetailDialog.value = true
}

const duplicateSchedule = async (schedule) => {
  const duplicated = {
    group_id: schedule.group_id,
    subject_id: schedule.subject_id,
    term_id: schedule.term_id,
    room_id: schedule.room_id,
    instructor_id: schedule.instructor_id,
    assistant_id: schedule.assistant_id,
    generation_id: schedule.generation_id,
    description: schedule.description ? schedule.description + ' (Copy)' : 'Copy',
    status: 1, // Set to planned
    active: false,
    start_time: schedule.start_time,
    end_time: schedule.end_time
  }
  await scheduleStore.createSchedule(duplicated)
  await scheduleStore.fetchSchedules() // Refresh the list
}

const deleteSchedule = (schedule) => {
  console.log("Opening delete dialog for schedule:", schedule)
  scheduleToDelete.value = schedule
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!scheduleToDelete.value) return

  try {
    deleteLoading.value = true
    const result = await scheduleStore.deleteSchedule(scheduleToDelete.value.id)

    if (result.success) {
      console.log("Schedule deleted successfully, closing dialog")
      deleteDialog.value = false
      scheduleToDelete.value = null
    } else {
      console.error("Delete failed:", result.error)
      alert(`Failed to delete schedule: ${result.error}`)
    }
  } catch (error) {
    console.error('Error deleting schedule:', error)
    alert(`Failed to delete schedule: ${error.message}`)
  } finally {
    deleteLoading.value = false
  }
}

// Export methods
const exportSchedulesPDF = () => {
  console.log('Exporting schedules to PDF...')
}

const exportSchedulesExcel = () => {
  console.log('Exporting schedules to Excel...')
}

// Utility methods
const getGroupName = (groupId) => {
  const group = groups.value.find(g => g.id === groupId)
  return group?.group_name || group?.id || 'Unknown Group'
}

const getSubjectName = (subjectId) => {
  const subject = subjects.value.find(s => s.id === subjectId)
  return subject ? `${subject.code} - ${subject.name}` : 'Unknown Subject'
}

const getRoomName = (roomId) => {
  const room = rooms.value.find(r => r.id === roomId)
  return room?.room || 'TBD'
}

const getGenerationName = (generationId) => {
  const generation = generations.value.find(g => g.id === generationId)
  return generation?.generation || 'N/A'
}

const getInstructorName = (instructorId) => {
  const instructor = instructors.value.find(i => i.id === instructorId)
  return instructor ? `${instructor.first_name} ${instructor.last_name}` : 'N/A'
}

const getStatusLabel = (status) => {
  const statusMap = {
    1: 'Planned',
    2: 'Active',
    3: 'Completed',
    4: 'Canceled'
  }
  return statusMap[status] || 'Unknown'
}

const getStatusColor = (status) => {
  const colorMap = {
    1: 'info',      // Planned
    2: 'success',   // Active
    3: 'primary',    // Completed
    4: 'error'       // Canceled
  }
  return colorMap[status] || 'grey'
}

const formatDateRange = (start, end) => {
  if (!start || !end) return 'No date range'
  try {
    const startDate = new Date(start).toLocaleDateString()
    const endDate = new Date(end).toLocaleDateString()
    return `${startDate} - ${endDate}`
  } catch {
    return 'Invalid date range'
  }
}

const formatDateTime = (datetime) => {
  if (!datetime) return 'Not set'
  try {
    const date = new Date(datetime)
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch {
    return 'Invalid date'
  }
}

const formatDate = (date) => {
  if (!date) return 'Not set'
  try {
    const d = new Date(date)
    const day = String(d.getDate()).padStart(2, '0')
    const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const month = months[d.getMonth()]
    const year = d.getFullYear()
    return `${day}th ${month}, ${year}`
  } catch {
    return 'Invalid date'
  }
}

// Pagination methods
const goToPrevPage = () => {
  if (currentPage.value > 1) currentPage.value--
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// Watch for filter changes and reset pagination
watch([searchQuery, generationFilter, yearFilter, statusFilter], () => {
  currentPage.value = 1
})

// Debug: Watch formData changes for subject_id and term_id
watch(() => formData.subject_id, (newVal, oldVal) => {
  console.log('subject_id changed:', oldVal, '->', newVal)
})

watch(() => formData.term_id, (newVal, oldVal) => {
  console.log('term_id changed:', oldVal, '->', newVal)
})

// Lifecycle
onMounted(async () => {
  await Promise.all([
    scheduleStore.fetchSchedules(),
    fetchReferenceData()
  ])
})

// Fetch all reference data for dropdowns
const fetchReferenceData = async () => {
  loadingOptions.value = true
  try {
    const { $AdminPrivateAxios } = useNuxtApp()

    const [groupsRes, subjectsRes, termsRes, instructorsRes, roomsRes, generationsRes] = await Promise.all([
      $AdminPrivateAxios.get('/groups/'),
      $AdminPrivateAxios.get('/subjects/'),
      $AdminPrivateAxios.get('/terms/'),
      $AdminPrivateAxios.get('/instructors/'),
      $AdminPrivateAxios.get('/rooms/'),
      $AdminPrivateAxios.get('/generations/')
    ])

    groups.value = groupsRes.data?.data || []
    subjects.value = subjectsRes.data?.data || []
    terms.value = termsRes.data?.data || []
    instructors.value = instructorsRes.data?.data || []
    rooms.value = roomsRes.data?.data || []
    generations.value = generationsRes.data?.data || []

    console.log('Reference data loaded:', {
      groups: groups.value.length,
      subjects: subjects.value.length,
      terms: terms.value.length,
      instructors: instructors.value.length,
      rooms: rooms.value.length,
      generations: generations.value.length
    })
    
    // Debug: Check actual data structure
    console.log('First subject:', subjects.value[0])
    console.log('First term:', terms.value[0])
    console.log('SubjectOptions computed:', subjectOptions.value.slice(0, 3))
    console.log('TermOptions computed:', termOptions.value.slice(0, 3))
  } catch (error) {
    console.error('Failed to fetch reference data:', error)
  } finally {
    loadingOptions.value = false
  }
}
</script>

<style scoped>
.schedules-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

/* Header Styles */
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
  flex-wrap: wrap;
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
  flex-wrap: wrap;
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

/* Main Content Styles */
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
  flex-wrap: wrap;
  gap: 16px;
}

.toolbar-left {
  flex: 1;
  min-width: 200px;
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
  flex-wrap: wrap;
}

.search-container {
  min-width: 300px;
}

.search-input :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.filter-select {
  min-width: 120px;
  background: white;
  border-radius: 8px;
}

.filter-select :deep(.v-field) {
  border-radius: 12px;
}

/* Cards Content */
.cards-content {
  padding: 24px;
}

/* Loading State */
.loading-state {
  text-align: center;
  padding: 80px 20px;
}

/* Pagination */
.pagination-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0 0;
  margin-top: 20px;
  border-top: 1px solid #f1f5f9;
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

/* Cards Grid */
.empty-state {
  text-align: center;
  padding: 80px 20px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.schedule-card {
  background: white;
  border-radius: 12px;
  padding: 20px;
  transition: all 0.2s ease;
  cursor: pointer;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.schedule-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
}

.group-info {
  flex: 1;
}

.group-name {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.group-details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.group-id {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.schedule-info {
  margin-bottom: 20px;
}

.info-row {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
  font-size: 14px;
  color: #64748b;
}

.card-content {
  margin-bottom: 16px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f1f5f9;
}

.updated-date {
  font-size: 12px;
  color: #94a3b8;
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
  padding: 24px 24px 20px;
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
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.dialog-subtitle {
  font-size: 14px;
  color: #6b7280;
  margin: 0;
  line-height: 1.3;
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
  margin-bottom: 4px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.form-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

.action-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 24px;
  transition: all 0.2s ease;
}

.cancel-btn {
  min-width: 100px;
}

.submit-btn {
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
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
  background: #fef3c7;
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

.schedule-name {
  color: #dc2626;
  font-weight: 600;
}

.delete-actions {
  padding: 20px 24px 24px !important;
  gap: 12px;
}

.delete-btn {
  min-width: 130px;
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.25);
}

.delete-btn:hover {
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.35);
  transform: translateY(-1px);
}

/* Schedule Detail Dialog */
.schedule-detail-card {
  border-radius: 16px;
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
  background: linear-gradient(135deg, #3b82f6, #1e40af);
  color: white;
}

.header-info {
  flex: 1;
}

.schedule-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0 0 8px 0;
}

.schedule-meta {
  display: flex;
  gap: 8px;
  align-items: center;
}

.header-actions {
  display: flex;
  gap: 8px;
}

.schedule-content {
  flex: 1;
  overflow-y: auto;
}

/* Detail Dialog Styles */
.detail-dialog-card {
  border-radius: 20px !important;
  overflow: hidden;
  background: white;
}

.detail-dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 28px 32px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.2);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.header-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.detail-dialog-title {
  font-size: 24px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
  line-height: 1.2;
  letter-spacing: -0.02em;
}

.detail-dialog-subtitle {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  line-height: 1.4;
  font-weight: 400;
}

.close-btn {
  color: white !important;
  opacity: 0.9;
  transition: all 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.1) !important;
}

.detail-dialog-content {
  padding: 32px !important;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.detail-info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.info-card {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  padding: 20px;
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.info-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: linear-gradient(180deg, var(--card-color, #3b82f6), var(--card-color-dark, #2563eb));
  opacity: 0;
  transition: opacity 0.3s ease;
}

.info-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #cbd5e1;
}

.info-card:hover::before {
  opacity: 1;
}

.info-card.full-width {
  grid-column: 1 / -1;
}

.info-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
}

.info-card:hover .info-icon-wrapper {
  transform: scale(1.1);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.info-icon-wrapper.group {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.info-icon-wrapper.subject {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
}

.info-icon-wrapper.term {
  background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%);
}

.info-icon-wrapper.generation {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.info-icon-wrapper.instructor {
  background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%);
}

.info-icon-wrapper.assistant {
  background: linear-gradient(135deg, #ec4899 0%, #db2777 100%);
}

.info-icon-wrapper.room {
  background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
}

.info-icon-wrapper.status {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.info-icon-wrapper.active {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.info-icon-wrapper.time {
  background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
}

.info-icon-wrapper.description {
  background: linear-gradient(135deg, #64748b 0%, #475569 100%);
}

.info-content {
  flex: 1;
  min-width: 0;
}

.info-label {
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 8px;
  display: block;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  word-break: break-word;
  line-height: 1.5;
}

.description-text {
  line-height: 1.6;
  color: #475569;
  font-weight: 400;
  font-size: 15px;
}

.status-chip {
  font-weight: 600 !important;
  letter-spacing: 0.3px;
}

.detail-dialog-actions {
  padding: 24px 32px !important;
  gap: 12px;
  background: white;
  border-top: 1px solid #e2e8f0;
}

/* Responsive Design */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .title-wrapper {
    flex-direction: column;
    text-align: center;
    gap: 12px;
  }

  .stats-cards {
    justify-content: center;
  }

  .action-section {
    align-self: stretch;
    justify-content: center;
  }

  .toolbar-right {
    width: 100%;
  }

  .search-container {
    min-width: auto;
    width: 100%;
  }

  .filter-select {
    flex: 1;
    min-width: 100px;
  }

  .cards-grid {
    grid-template-columns: 1fr;
  }

  .detail-info-grid {
    grid-template-columns: 1fr;
  }

  .detail-dialog-header {
    padding: 20px 24px;
  }

  .header-icon-wrapper {
    width: 48px;
    height: 48px;
  }

  .detail-dialog-title {
    font-size: 20px;
  }

  .detail-dialog-content {
    padding: 24px !important;
  }

  .info-card {
    padding: 16px;
  }

  .info-icon-wrapper {
    width: 40px;
    height: 40px;
  }

  .info-value {
    font-size: 14px;
  }
}

/* Menu Styles */
.modern-menu {
  border-radius: 8px;
  padding: 8px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.menu-item {
  border-radius: 6px;
  margin-bottom: 4px;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: #f8fafc;
}

/* Animation */
.schedule-card {
  animation: slideInUp 0.3s ease-out;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
