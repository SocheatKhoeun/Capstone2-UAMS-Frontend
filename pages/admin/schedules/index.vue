<template>
  <div class="schedules-page">
    <!-- Header -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-calendar-clock" size="28" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Schedule Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon icon="mdi-chevron-right" size="14" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Schedules</span>
              </div>
            </div>
          </div>

          <div class="stats-cards">
            <div class="stat-card stat-card-primary">
              <div class="stat-icon">
                <v-icon icon="mdi-calendar-multiple" size="20" color="white" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ schedules.length }}</div>
                <div class="stat-label">Total Schedules</div>
              </div>
            </div>
            <div class="stat-card stat-card-success">
              <div class="stat-icon">
                <v-icon icon="mdi-check-circle" size="20" color="white" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ activeSchedules.length }}</div>
                <div class="stat-label">Active</div>
              </div>
            </div>
            <div class="stat-card stat-card-info">
              <div class="stat-icon">
                <v-icon icon="mdi-account-group" size="20" color="white" />
              </div>
              <div class="stat-content">
                <div class="stat-number">{{ groupsWithSchedule.length }}</div>
                <div class="stat-label">Groups</div>
              </div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-btn class="action-btn primary-btn" prepend-icon="mdi-plus" variant="flat" @click="openCreateDialog">
            Create Schedule
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Content -->
    <div class="content-wrapper">
      <div class="content-container">
        <!-- Toolbar -->
        <div class="toolbar-section">
          <div class="toolbar-header">
            <div class="toolbar-title">
              <v-icon icon="mdi-filter-variant" size="18" class="mr-2" color="primary" />
              <span>Filter & Search</span>
            </div>
            <v-chip v-if="filteredSchedules.length !== schedules.length" size="small" color="primary" variant="tonal">
              {{ filteredSchedules.length }} of {{ schedules.length }}
            </v-chip>
          </div>
          <div class="toolbar-controls">
            <div class="filters-row">
              <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="solo"
                density="comfortable" hide-details flat class="filter-field" />
              <div class="search-wrapper">
                <v-text-field v-model="searchQuery" placeholder="Search schedules..." prepend-inner-icon="mdi-magnify"
                  variant="solo" density="comfortable" hide-details flat class="search-field" clearable />
              </div>
            </div>
          </div>
        </div>

        <!-- Cards -->
        <div class="cards-section">
          <!-- Loading -->
          <div v-if="loading" class="state-container">
            <div class="loading-content">
              <v-progress-circular indeterminate color="primary" size="56" width="4" />
              <p class="state-text">Loading schedules...</p>
            </div>
          </div>

          <!-- Empty -->
          <div v-else-if="filteredSchedules.length === 0" class="state-container">
            <div class="empty-content">
              <div class="empty-icon">
                <v-icon icon="mdi-calendar-remove" size="72" color="grey-lighten-2" />
              </div>
              <h3 class="empty-title">No schedules found</h3>
              <p class="empty-text">
                {{ searchQuery ? "Try adjusting your search or filters" : "Create your first schedule to get started" }}
              </p>
              <v-btn v-if="!searchQuery" color="primary" variant="flat" size="large" @click="openCreateDialog"
                class="mt-6">
                <v-icon start>mdi-plus</v-icon>
                Create Schedule
              </v-btn>
            </div>
          </div>

          <!-- Schedules Grid -->
          <div v-else class="cards-grid">
            <v-card v-for="schedule in paginatedSchedules" :key="schedule.id" class="schedule-card"
              @click="openDetailDialog(schedule)">
              <div class="card-header">
                <div class="header-left">
                  <v-chip :color="schedule.active ? 'success' : 'red'" size="small" variant="flat" class="status-chip">
                    <v-icon start size="14">{{ schedule.active ? 'mdi-check-circle' : 'mdi-circle-outline' }}</v-icon>
                    {{ schedule.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
                <v-menu>
                  <template v-slot:activator="{ props }">
                    <v-btn icon="mdi-dots-vertical" variant="text" size="small" density="comfortable" v-bind="props"
                      @click.stop />
                  </template>
                  <v-list class="action-menu" density="compact">
                    <v-list-item @click.stop="editSchedule(schedule)" class="menu-item">
                      <template v-slot:prepend><v-icon icon="mdi-pencil" size="18" /></template>
                      <v-list-item-title>Edit</v-list-item-title>
                    </v-list-item>
                    <v-list-item @click.stop="deleteSchedule(schedule)" class="menu-item danger">
                      <template v-slot:prepend><v-icon icon="mdi-delete" size="18" color="error" /></template>
                      <v-list-item-title class="text-error">Delete</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </div>

              <div class="card-content">
                <h3 class="card-title">{{ getSubjectName(schedule.subject_id) }}</h3>
                <p class="card-subtitle">{{ schedule.course_type === 'lab' ? 'Laboratory' : 'Lecture' }}</p>
                <div class="info-grid">
                  <div class="info-item">
                    <v-icon icon="mdi-account-group" size="16" color="primary" />
                    <span>{{ schedule.groups && schedule.groups.length > 0 ? schedule.groups[0].name :
                      getGroupName(schedule.group_id) }}</span>
                  </div>
                  <div class="info-item">
                    <v-icon icon="mdi-school" size="16" color="primary" />
                    <span>{{ getGenerationName(schedule.generation_id) }}</span>
                  </div>
                  <div class="info-item">
                    <v-icon icon="mdi-door" size="16" color="primary" />
                    <span>{{ getRoomName(schedule.room_id) }}</span>
                  </div>
                  <div class="info-item">
                    <v-icon icon="mdi-account-tie" size="16" color="primary" />
                    <span>{{ getInstructorName(schedule.instructor_id) }}</span>
                  </div>
                  <div class="info-item">
                    <v-icon icon="mdi-clock-outline" size="16" color="primary" />
                    <span>{{ formatDateRange(schedule.start_time, schedule.end_time) }}</span>
                  </div>
                </div>
              </div>

              <div class="card-footer">
                <span class="footer-text">
                  <v-icon icon="mdi-update" size="14" />
                  {{ formatDate(schedule.updated_at) }}
                </span>
                <v-btn variant="tonal" size="small" color="primary" @click.stop="openDetailDialog(schedule)"
                  class="view-btn">
                  View Details
                  <v-icon end size="16">mdi-arrow-right</v-icon>
                </v-btn>
              </div>
            </v-card>
          </div>

          <!-- Pagination -->
          <div v-if="filteredSchedules.length > 0" class="pagination-container">
            <div class="pagination-info">
              <span class="info-text">
                Showing {{ (currentPage - 1) * itemsPerPage + 1 }} to
                {{ Math.min(currentPage * itemsPerPage, filteredSchedules.length) }}
                of {{ filteredSchedules.length }} schedules
              </span>
            </div>
            <div class="pagination-controls">
              <v-btn variant="outlined" :disabled="currentPage === 1" @click="currentPage--" icon="mdi-chevron-left"
                size="small" />
              <div class="page-numbers">
                <v-btn v-for="page in visiblePages" :key="page" :variant="page === currentPage ? 'flat' : 'text'"
                  :color="page === currentPage ? 'primary' : 'default'" size="small" @click="currentPage = page"
                  class="page-btn">
                  {{ page }}
                </v-btn>
              </div>
              <v-btn variant="outlined" :disabled="currentPage >= totalPages" @click="currentPage++"
                icon="mdi-chevron-right" size="small" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Create / Edit Dialog -->
    <v-dialog v-model="scheduleDialog" max-width="900" persistent scrollable>
      <v-card class="dialog-card">
        <div class="dialog-header">
          <div class="header-left">
            <div class="header-icon-wrapper">
              <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" size="24" color="white" />
            </div>
            <div>
              <h2 class="dialog-title">{{ isEdit ? 'Edit Schedule' : 'Create New Schedule' }}</h2>
              <p class="dialog-subtitle">{{ isEdit ? 'Update schedule information' : 'Add a new schedule' }}</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
        </div>
        <v-divider />

        <v-card-text class="dialog-body">
          <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
            <!-- Basic Information -->
            <div class="form-section">
              <h3 class="section-title">Basic Information</h3>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.group_id" :items="groupOptions" item-title="title" item-value="value"
                    :rules="requiredRules" label="Group *" variant="outlined" density="comfortable" hide-details="auto"
                    :loading="loadingOptions" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.subject_id" :items="subjectOptions" item-title="title" item-value="value"
                    :rules="requiredRules" label="Subject *" variant="outlined" density="comfortable"
                    hide-details="auto" :loading="loadingOptions" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="formData.term_id" :items="termOptions" item-title="title" item-value="value"
                    :rules="requiredRules" label="Term *" variant="outlined" density="comfortable" hide-details="auto"
                    :loading="loadingOptions" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="formData.generation_id" :items="generationOptions" item-title="title"
                    item-value="value" :rules="requiredRules" label="Generation *" variant="outlined"
                    density="comfortable" hide-details="auto" :loading="loadingOptions" />
                </v-col>
                <v-col cols="12" md="4">
                  <v-select v-model="formData.room_id" :items="roomOptions" item-title="title" item-value="value"
                    label="Room" variant="outlined" density="comfortable" hide-details="auto" :loading="loadingOptions"
                    clearable />
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-6" />

            <!-- Staff Assignment -->
            <div class="form-section">
              <h3 class="section-title">Staff Assignment</h3>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.instructor_id" :items="instructorOptions" item-title="title"
                    item-value="value" :rules="requiredRules" label="Instructor *" variant="outlined"
                    density="comfortable" hide-details="auto" :loading="loadingOptions" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.assistant_id" :items="instructorOptions" item-title="title"
                    item-value="value" :rules="requiredRules" label="Assistant *" variant="outlined"
                    density="comfortable" hide-details="auto" :loading="loadingOptions" />
                </v-col>
              </v-row>
            </div>

            <v-divider class="my-6" />

            <!-- Schedule Details -->
            <div class="form-section">
              <h3 class="section-title">Schedule Details</h3>
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.course_type" :items="courseTypeOptions" item-title="title"
                    item-value="value" :rules="requiredRules" label="Course Type *" variant="outlined"
                    density="comfortable" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select v-model="formData.status" :items="statusItems" item-title="title" item-value="value"
                    :rules="requiredRules" label="Status *" variant="outlined" density="comfortable"
                    hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.start_time" type="datetime-local" label="Start Time"
                    variant="outlined" density="comfortable" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field v-model="formData.end_time" type="datetime-local" label="End Time" variant="outlined"
                    density="comfortable" hide-details="auto" />
                </v-col>
                <v-col cols="12" md="6" class="d-flex align-center">
                  <v-switch v-model="formData.active" label="Active Schedule" color="success" hide-details inset />
                </v-col>
                <v-col cols="12">
                  <v-textarea v-model="formData.description" label="Description" rows="3" variant="outlined"
                    density="comfortable" hide-details="auto" />
                </v-col>
              </v-row>
            </div>
          </v-form>
        </v-card-text>

        <v-divider />
        <v-card-actions class="dialog-actions">
          <v-btn variant="outlined" @click="closeDialog" :disabled="loading">Cancel</v-btn>
          <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm"
            :disabled="!formValid || loading" :loading="loading">
            <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
            {{ isEdit ? 'Update Schedule' : 'Create Schedule' }}
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Schedule Detail View Dialog -->
    <v-dialog v-model="scheduleDetailDialog" max-width="800" persistent scrollable>
      <v-card v-if="selectedSchedule" class="modern-detail-dialog" elevation="24">
        <!-- Dialog Header -->
        <div class="detail-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon icon="mdi-calendar-clock" size="28" />
            </div>
            <div class="header-text">
              <h2 class="detail-title">Schedule Details</h2>
              <p class="detail-subtitle">Complete schedule information</p>
            </div>
          </div>
          <v-btn icon="mdi-close" variant="text" size="small" @click="closeDetailDialog" class="close-btn" />
        </div>

        <v-divider />

        <!-- Dialog Content -->
        <v-card-text class="detail-content">
          <!-- Primary Info Section -->
          <div class="info-section">
            <div class="section-header">
              <v-icon icon="mdi-information" size="20" color="primary" />
              <h3 class="section-title">Basic Information</h3>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-account-group" size="16" class="mr-1" />
                  Group
                </label>
                <div class="detail-value">
                  {{ selectedSchedule.groups && selectedSchedule.groups.length > 0 ? selectedSchedule.groups[0].name :
                    getGroupName(selectedSchedule.group_id) }}
                </div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-book-open-variant" size="16" class="mr-1" />
                  Subject
                </label>
                <div class="detail-value">{{ getSubjectName(selectedSchedule.subject_id) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-calendar-range" size="16" class="mr-1" />
                  Term
                </label>
                <div class="detail-value">{{ getTermName(selectedSchedule.term_id) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-account-school" size="16" class="mr-1" />
                  Generation
                </label>
                <div class="detail-value">{{ getGenerationName(selectedSchedule.generation_id) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-door" size="16" class="mr-1" />
                  Room
                </label>
                <div class="detail-value">{{ getRoomName(selectedSchedule.room_id) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-school" size="16" class="mr-1" />
                  Course Type
                </label>
                <div class="detail-value">
                  <v-chip :color="selectedSchedule.course_type === 'lab' ? 'success' : 'info'" size="small"
                    variant="tonal">
                    <v-icon :icon="selectedSchedule.course_type === 'lab' ? 'mdi-flask' : 'mdi-book-open-page-variant'"
                      size="14" start />
                    {{ selectedSchedule.course_type === 'lab' ? 'Lab' : 'Lecture' }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <v-divider class="my-5" />

          <!-- Staff Section -->
          <div class="info-section">
            <div class="section-header">
              <v-icon icon="mdi-account-tie" size="20" color="primary" />
              <h3 class="section-title">Teaching Staff</h3>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-account-tie" size="16" class="mr-1" />
                  Instructor
                </label>
                <div class="detail-value">{{ getInstructorName(selectedSchedule.instructor_id) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-account-supervisor" size="16" class="mr-1" />
                  Assistant
                </label>
                <div class="detail-value">{{ getInstructorName(selectedSchedule.assistant_id) || 'N/A' }}</div>
              </div>
            </div>
          </div>

          <v-divider class="my-5" />

          <!-- Schedule Section -->
          <div class="info-section">
            <div class="section-header">
              <v-icon icon="mdi-clock-outline" size="20" color="primary" />
              <h3 class="section-title">Schedule & Status</h3>
            </div>
            <div class="detail-grid">
              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-calendar-start" size="16" class="mr-1" />
                  Start Time
                </label>
                <div class="detail-value">{{ formatDateTime(selectedSchedule.start_time) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-calendar-end" size="16" class="mr-1" />
                  End Time
                </label>
                <div class="detail-value">{{ formatDateTime(selectedSchedule.end_time) }}</div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-information" size="16" class="mr-1" />
                  Status
                </label>
                <div class="detail-value">
                  <v-chip :color="getStatusColor(selectedSchedule.status)" size="small" variant="flat">
                    {{ getStatusLabel(selectedSchedule.status) }}
                  </v-chip>
                </div>
              </div>

              <div class="detail-item">
                <label class="detail-label">
                  <v-icon icon="mdi-toggle-switch" size="16" class="mr-1" />
                  Active
                </label>
                <div class="detail-value">
                  <v-chip :color="selectedSchedule.active ? 'success' : 'error'" size="small" variant="flat">
                    <v-icon :icon="selectedSchedule.active ? 'mdi-check-circle' : 'mdi-close-circle'" size="14" start />
                    {{ selectedSchedule.active ? 'Active' : 'Inactive' }}
                  </v-chip>
                </div>
              </div>
            </div>
          </div>

          <!-- Description Section (if exists) -->
          <template v-if="selectedSchedule.description">
            <v-divider class="my-5" />
            <div class="info-section">
              <div class="section-header">
                <v-icon icon="mdi-text" size="20" color="primary" />
                <h3 class="section-title">Description</h3>
              </div>
              <div class="description-box">
                <p class="description-text">{{ selectedSchedule.description }}</p>
              </div>
            </div>
          </template>
        </v-card-text>

        <v-divider />

        <!-- Dialog Actions -->
        <v-card-actions class="detail-actions">
          <v-btn variant="outlined" color="grey-darken-1" @click="closeDetailDialog" class="action-btn">
            <v-icon start>mdi-close</v-icon>
            Close
          </v-btn>
          <v-spacer />
          <v-btn color="primary" variant="flat" @click="editFromDetail" class="action-btn">
            <v-icon start>mdi-pencil</v-icon>
            Edit Schedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation -->
    <v-dialog v-model="deleteDialog" max-width="480" persistent>
      <v-card class="delete-card">
        <div class="delete-header">
          <div class="delete-icon-wrapper">
            <v-icon icon="mdi-alert-circle" size="48" color="error" />
          </div>
          <h2 class="delete-title">Delete Schedule?</h2>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>
        <v-card-text class="delete-body">
          <div class="warning-banner">
            <v-icon icon="mdi-information" color="warning" class="banner-icon" />
            <div class="banner-content">
              <p class="banner-text">
                You're about to permanently delete the schedule for
                <strong>{{ scheduleToDelete ? getGroupName(scheduleToDelete.group_id) : 'this schedule' }}</strong>
              </p>
            </div>
          </div>
        </v-card-text>
        <v-card-actions class="delete-actions">
          <v-btn variant="outlined" @click="deleteDialog = false" :disabled="deleteLoading">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="confirmDelete" :loading="deleteLoading">
            <v-icon start>mdi-delete</v-icon>
            Delete Schedule
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { storeToRefs } from 'pinia'
import Swal from 'sweetalert2'
import { useScheduleStore } from '@/store/useScheduleStore'

definePageMeta({
  layout: 'admin',
  middleware: ['auth']
})

const scheduleStore = useScheduleStore()
const { schedules, loading } = storeToRefs(scheduleStore)

const searchQuery = ref('')
const statusFilter = ref('All')
const currentPage = ref(1)
const itemsPerPage = ref(9)

const scheduleDialog = ref(false)
const scheduleDetailDialog = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const deleteLoading = ref(false)

const selectedSchedule = ref(null)
const scheduleToDelete = ref(null)

const groups = ref([])
const subjects = ref([])
const terms = ref([])
const instructors = ref([])
const rooms = ref([])
const generations = ref([])
const loadingOptions = ref(false)

const formData = reactive({
  global_id: null,
  group_id: null,
  subject_id: null,
  term_id: null,
  room_id: null,
  instructor_id: null,
  assistant_id: null,
  generation_id: null,
  course_type: 'lecture',
  description: '',
  status: 1,
  active: true,
  start_time: null,
  end_time: null
})

const statusOptions = ['All', 'Active', 'Inactive']
const statusItems = [
  { title: 'Planned', value: 1 },
  { title: 'Active', value: 2 },
  { title: 'Completed', value: 3 },
  { title: 'Canceled', value: 4 }
]
const courseTypeOptions = [
  { title: 'Lecture', value: 'lecture' },
  { title: 'Lab', value: 'lab' }
]

const requiredRules = [(v) => (v !== null && v !== undefined && v !== '') || 'Field is required']

// Computed
const activeSchedules = computed(() => schedules.value.filter(s => s.active))
const groupsWithSchedule = computed(() => [...new Set(schedules.value.map(s => s.group_id))])

const filteredSchedules = computed(() => {
  let list = schedules.value
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    list = list.filter(s => {
      const groupName = s.groups && s.groups.length > 0 ? s.groups[0].name : getGroupName(s.group_id)
      return groupName.toLowerCase().includes(q) ||
        getSubjectName(s.subject_id).toLowerCase().includes(q)
    })
  }
  if (statusFilter.value !== 'All') {
    const active = statusFilter.value === 'Active'
    list = list.filter(s => s.active === active)
  }
  return list
})

const totalPages = computed(() => Math.ceil(filteredSchedules.value.length / itemsPerPage.value))
const paginatedSchedules = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  return filteredSchedules.value.slice(start, start + itemsPerPage.value)
})
const visiblePages = computed(() => {
  const pages = []
  const max = 5
  let start = Math.max(1, currentPage.value - Math.floor(max / 2))
  let end = Math.min(totalPages.value, start + max - 1)
  if (end - start < max - 1) start = Math.max(1, end - max + 1)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const groupOptions = computed(() => {
  const options = groups.value.map(g => ({ title: g.group_name || g.id, value: g.id }))
  console.log('groupOptions sample:', options[0])
  return options
})

const subjectOptions = computed(() => {
  const options = subjects.value.map(s => {
    return { title: `${s.name}`, value: s.id }
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
const roomOptions = computed(() => rooms.value.map(r => ({ title: r.room || 'No Room', value: r.id })))
const generationOptions = computed(() => generations.value.map(g => ({ title: g.generation, value: g.id })))

// Functions
const openCreateDialog = () => {
  resetForm()
  isEdit.value = false
  scheduleDialog.value = true

  // Debug: Log options available
  console.log('Dialog opened - SubjectOptions:', subjectOptions.value.length, 'items')
  console.log('Dialog opened - TermOptions:', termOptions.value.length, 'items')
  console.log('FormData initial:', { ...formData })
}

const openDetailDialog = (schedule) => {
  selectedSchedule.value = schedule
  scheduleDetailDialog.value = true
}

const editFromDetail = () => {
  scheduleDetailDialog.value = false
  editSchedule(selectedSchedule.value)
}

const closeDetailDialog = () => {
  scheduleDetailDialog.value = false
  selectedSchedule.value = null
}

const editSchedule = async (schedule) => {
  if (loadingOptions.value || groups.value.length === 0) {
    await fetchReferenceData()
  }

  const toLocalDateTime = (iso) => {
    if (!iso) return null
    const d = new Date(iso)
    return d.toISOString().slice(0, 16)
  }

  Object.assign(formData, {
    global_id: schedule.global_id,
    group_id: schedule.group_id || (schedule.groups && schedule.groups.length > 0 ? schedule.groups[0].id : null),
    subject_id: schedule.subject_id,
    term_id: schedule.term_id,
    room_id: schedule.room_id || null,
    instructor_id: schedule.instructor_id,
    assistant_id: schedule.assistant_id,
    generation_id: schedule.generation_id,
    course_type: schedule.course_type || 'lecture',
    description: schedule.description || '',
    status: schedule.status || 1,
    active: !!schedule.active,
    start_time: toLocalDateTime(schedule.start_time),
    end_time: toLocalDateTime(schedule.end_time)
  })

  isEdit.value = true
  scheduleDialog.value = true
}

const closeDialog = () => {
  scheduleDialog.value = false
  resetForm()
}

const resetForm = () => {
  Object.assign(formData, {
    global_id: null,
    group_id: null,
    subject_id: null,
    term_id: null,
    room_id: null,
    instructor_id: null,
    assistant_id: null,
    generation_id: null,
    course_type: 'lecture',
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
    const groupId = sanitizeId(formData.group_id)
    const payload = {
      group_ids: groupId ? [groupId] : [], // Backend expects array of group IDs
      subject_id: sanitizeId(formData.subject_id),
      term_id: sanitizeId(formData.term_id),
      room_id: sanitizeId(formData.room_id),
      instructor_id: sanitizeId(formData.instructor_id),
      assistant_id: sanitizeId(formData.assistant_id),
      generation_id: sanitizeId(formData.generation_id),
      course_type: formData.course_type || 'lecture', // Required field
      description: formData.description || '',
      status: formData.status || 1,
      active: formData.active !== undefined ? formData.active : true,
      start_time: formData.start_time,
      end_time: formData.end_time
    }
    console.log("===========================================")
    console.log('Submitting form with payload:', payload)
    console.log("===========================================")

    // Validate required fields
    if (!payload.group_ids || payload.group_ids.length === 0 || !payload.subject_id || !payload.term_id ||
      !payload.instructor_id || !payload.assistant_id || !payload.generation_id || !payload.course_type) {
      alert('Please fill in all required fields with valid values')
      return
    }

    let result
    if (isEdit.value) {
      result = await scheduleStore.updateSchedule(formData.global_id, payload)
    } else {
      result = await scheduleStore.createSchedule(payload)
    }

    if (result.success) {
      closeDialog()
      await scheduleStore.fetchSchedules()
      Swal.fire({
        icon: 'success',
        title: 'Success!',
        text: isEdit.value ? 'Schedule updated successfully!' : 'Schedule created successfully!',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      throw new Error(result.error || 'Update failed')
    }
  } catch (err) {
    console.error('Submit error:', err)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: err.message || 'Failed to save schedule'
    })
  }
}

const deleteSchedule = (schedule) => {
  scheduleToDelete.value = schedule
  deleteDialog.value = true
}

const confirmDelete = async () => {
  if (!scheduleToDelete.value) return
  deleteLoading.value = true
  const result = await scheduleStore.deleteSchedule(scheduleToDelete.value.global_id)
  deleteLoading.value = false

  if (result.success) {
    deleteDialog.value = false
    scheduleToDelete.value = null
    await scheduleStore.fetchSchedules()
    Swal.fire({ icon: 'success', title: 'Deleted!', timer: 2000, showConfirmButton: false })
  } else {
    Swal.fire({ icon: 'error', title: 'Failed', text: result.error })
  }
}

// Helpers
const getGroupName = (id) => groups.value.find(g => g.id === id)?.group_name || 'Unknown Group'
const getSubjectName = (id) => subjects.value.find(s => s.id === id)?.name || 'Unknown Subject'
const getTermName = (id) => terms.value.find(t => t.id === id)?.term || 'Unknown Term'
const getRoomName = (id) => rooms.value.find(r => r.id === id)?.room || 'No Room'
const getGenerationName = (id) => generations.value.find(g => g.id === id)?.generation || 'N/A'
const getInstructorName = (id) => {
  const i = instructors.value.find(x => x.id === id)
  return i ? `${i.first_name} ${i.last_name}` : 'N/A'
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

const getStatusLabel = (status) => ({
  1: 'Planned', 2: 'Active', 3: 'Completed', 4: 'Canceled'
}[status] || 'Unknown')

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
// watch([searchQuery, generationFilter, yearFilter, statusFilter], () => {
//   currentPage.value = 1
// })

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
    const [
      g, s, t, i, r, gen
    ] = await Promise.all([
      $AdminPrivateAxios.get('/groups/'),
      $AdminPrivateAxios.get('/subjects/'),
      $AdminPrivateAxios.get('/terms/'),
      $AdminPrivateAxios.get('/instructors/'),
      $AdminPrivateAxios.get('/rooms/'),
      $AdminPrivateAxios.get('/generations/')
    ])
    groups.value = g.data?.data || []
    subjects.value = s.data?.data || []
    terms.value = t.data?.data || []
    instructors.value = i.data?.data || []
    rooms.value = r.data?.data || []
    generations.value = gen.data?.data || []
  } catch (e) {
    console.error('Failed to load reference data', e)
  } finally {
    loadingOptions.value = false
  }
}

watch([searchQuery, statusFilter], () => { currentPage.value = 1 })

onMounted(async () => {
  await Promise.all([scheduleStore.fetchSchedules(), fetchReferenceData()])
})
</script>

<style scoped>
.schedules-page {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
}

/* Header Styles */
.modern-header {
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  border-bottom: 1px solid #e2e8f0;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 28px 32px;
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
  margin-bottom: 24px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(59, 130, 246, 0.3);
}

.title-content {
  flex: 1;
}

.page-title {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.02em;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
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

/* Enhanced Stats Cards */
.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 16px;
}

.stat-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 16px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.04);
}

.stat-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 12px 24px rgba(0, 0, 0, 0.12);
}

.stat-card-primary .stat-icon {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-card-success .stat-icon {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card-info .stat-icon {
  background: linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.stat-content {
  flex: 1;
  min-width: 0;
}

.stat-number {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 13px;
  font-weight: 600;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Action Section */
.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
  flex-wrap: wrap;
}

.action-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 600;
  font-size: 14px;
  padding: 0 24px;
  transition: all 0.2s ease;
  letter-spacing: 0.01em;
}

.primary-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%) !important;
  color: white !important;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.primary-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(59, 130, 246, 0.4);
}

/* Content Wrapper */
.content-wrapper {
  padding: 24px 32px;
  max-width: 1400px;
  margin: 0 auto;
}

.content-container {
  background: white;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
}

/* Toolbar Section */
.toolbar-section {
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.toolbar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.toolbar-title {
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
}

.toolbar-controls {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.search-wrapper {
  width: 100%;
}

.search-field {
  border-radius: 12px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.search-field :deep(.v-field) {
  border-radius: 12px;
}

.filters-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 12px;
}

.filter-field {
  background: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.filter-field :deep(.v-field) {
  border-radius: 12px;
}

/* Cards Section */
.cards-section {
  padding: 32px 24px;
}

.state-container {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.loading-content,
.empty-content {
  text-align: center;
  padding: 40px 20px;
}

.state-text,
.empty-text {
  margin-top: 16px;
  font-size: 15px;
  color: #64748b;
}

.empty-icon {
  margin-bottom: 16px;
}

.empty-title {
  font-size: 22px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 8px;
}

/* Cards Grid */
.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.schedule-card {
  background: white;
  border-radius: 16px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  cursor: pointer;
  position: relative;
}

.schedule-card::before {
  content: "";
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #3b82f6, #8b5cf6);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.schedule-card:hover {
  transform: translateY(-6px);
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
  border-color: #3b82f6;
}

.schedule-card:hover::before {
  opacity: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.status-chip {
  font-weight: 600;
  font-size: 12px;
}

.menu-btn {
  opacity: 0.6;
  transition: opacity 0.2s ease;
}

.menu-btn:hover {
  opacity: 1;
}

.action-menu {
  border-radius: 12px;
  padding: 8px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
}

.menu-item {
  border-radius: 8px;
  margin-bottom: 4px;
  transition: all 0.2s ease;
}

.menu-item:last-child {
  margin-bottom: 0;
}

.menu-item:hover {
  background: #f8fafc;
}

.menu-item.danger:hover {
  background: #fef2f2;
}

.card-content {
  padding: 20px;
}

.card-title {
  font-size: 18px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 6px 0;
}

.card-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 16px 0;
}

.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 12px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #64748b;
  padding: 8px;
  background: #f8fafc;
  border-radius: 8px;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.footer-text {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #94a3b8;
}

.view-btn {
  font-weight: 600;
  text-transform: none;
}

/* Pagination */
.pagination-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 32px;
  padding-top: 24px;
  border-top: 1px solid #e2e8f0;
}

.pagination-info {
  flex: 1;
}

.info-text {
  font-size: 14px;
  color: #64748b;
}

.pagination-controls {
  display: flex;
  align-items: center;
  gap: 8px;
}

.page-numbers {
  display: flex;
  gap: 4px;
}

.page-btn {
  min-width: 40px;
  height: 40px;
  border-radius: 8px;
  font-weight: 600;
}

/* Dialog Styles */
.dialog-card {
  border-radius: 20px;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 28px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 1px solid #e2e8f0;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon-wrapper {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 6px 16px rgba(59, 130, 246, 0.3);
}

.dialog-title {
  font-size: 22px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.dialog-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-btn {
  opacity: 0.7;
  transition: opacity 0.2s ease;
}

.close-btn:hover {
  opacity: 1;
}

.dialog-body {
  padding: 32px 28px !important;
  max-height: 65vh;
  overflow-y: auto;
}

.form-section {
  margin-bottom: 24px;
}

.form-section:last-child {
  margin-bottom: 0;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 16px 0;
  display: flex;
  align-items: center;
  gap: 8px;
}

.section-title::before {
  content: "";
  width: 4px;
  height: 18px;
  background: linear-gradient(135deg, #3b82f6, #2563eb);
  border-radius: 2px;
}

.dialog-actions {
  padding: 20px 28px !important;
  gap: 12px;
  background: #f8fafc;
  border-top: 1px solid #e2e8f0;
}

.dialog-actions .action-btn {
  min-width: 140px;
  height: 44px;
  font-weight: 600;
  text-transform: none;
  border-radius: 10px;
}

/* Delete Dialog */
.delete-card {
  border-radius: 20px;
  overflow: hidden;
}

.delete-header {
  text-align: center;
  padding: 40px 28px 28px;
  background: linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%);
}

.delete-icon-wrapper {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: white;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 16px;
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.2);
}

.delete-title {
  font-size: 24px;
  font-weight: 700;
  color: #dc2626;
  margin: 0 0 6px 0;
}

.delete-subtitle {
  font-size: 14px;
  color: #991b1b;
  margin: 0;
}

.delete-body {
  padding: 28px !important;
}

.warning-banner {
  display: flex;
  gap: 14px;
  padding: 18px;
  background: #fffbeb;
  border: 2px solid #fef3c7;
  border-radius: 12px;
}

.banner-icon {
  flex-shrink: 0;
}

.banner-content {
  flex: 1;
}

.banner-text {
  font-size: 14px;
  color: #92400e;
  margin: 0;
  line-height: 1.5;
}

.delete-actions {
  padding: 20px 28px 28px !important;
  gap: 12px;
}

.delete-actions .v-btn {
  height: 44px;
  font-weight: 600;
  text-transform: none;
  border-radius: 10px;
}

.delete-btn {
  background: white;
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
}

.detail-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 24px;
}

.header-info {
  flex: 1;
}

.schedule-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 8px 0;
}

.schedule-meta {
  display: flex;
  gap: 8px;
  align-items: center;
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

/* Modern Detail Dialog Styles */
.modern-detail-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.detail-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 28px;
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
  color: white;
}

.detail-header .header-content {
  display: flex;
  align-items: center;
  gap: 16px;
  flex: 1;
}

.detail-header .header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

.detail-header .header-text {
  flex: 1;
}

.detail-title {
  font-size: 22px;
  font-weight: 700;
  color: white;
  margin: 0 0 4px 0;
  line-height: 1.2;
}

.detail-subtitle {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.9);
  margin: 0;
  font-weight: 400;
}

.detail-header .close-btn {
  color: white !important;
  opacity: 0.9;
}

.detail-header .close-btn:hover {
  opacity: 1;
  background-color: rgba(255, 255, 255, 0.15) !important;
}

.detail-content {
  padding: 28px !important;
  background: #fafbfc;
}

.info-section {
  margin-bottom: 0;
}

.info-section:last-child {
  margin-bottom: 0;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 20px;
  padding-bottom: 10px;
  border-bottom: 2px solid #e2e8f0;
}

.section-header .section-title {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
}

.detail-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 16px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  transition: all 0.2s ease;
}

.detail-item:hover {
  border-color: #3b82f6;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.1);
  transform: translateY(-2px);
}

.detail-label {
  display: flex;
  align-items: center;
  font-size: 12px;
  font-weight: 600;
  color: #6b7280;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.detail-value {
  font-size: 15px;
  font-weight: 500;
  color: #111827;
  line-height: 1.5;
}

.description-box {
  padding: 20px;
  background: white;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
}

.description-text {
  font-size: 14px;
  line-height: 1.7;
  color: #4b5563;
  margin: 0;
  white-space: pre-wrap;
}

.detail-actions {
  padding: 20px 28px !important;
  gap: 12px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
}

.detail-actions .action-btn {
  min-width: 120px;
  height: 42px;
  font-weight: 600;
  text-transform: none;
  border-radius: 8px;
  letter-spacing: 0.3px;
}

/* Responsive Detail Dialog */
@media (max-width: 768px) {
  .detail-grid {
    grid-template-columns: 1fr;
  }

  .detail-header {
    padding: 20px;
  }

  .detail-content {
    padding: 20px !important;
  }

  .detail-title {
    font-size: 18px;
  }
}

/* Legacy Detail Dialog Styles - Can be removed later */
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
