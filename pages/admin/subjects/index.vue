<template>
  <div class="subjects-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-book-open-page-variant" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Subject Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Admin</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Subjects</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ subjects.length }}</div>
              <div class="stat-label">Total Subjects</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ subjects.filter((s: any) => s.is_active).length }}
              </div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">
                {{ subjects.filter((s: any) => !s.is_active).length }}
              </div>
              <div class="stat-label">Inactive</div>
            </div>
          </div>
        </div>
        <div class="action-section">
          <!-- Export Button Component -->
          <ExportButtons :data="filteredSubjects" :columns="exportColumns" filename="Subjects_Export"
            @export-start="handleExportStart" @export-complete="handleExportComplete"
            @export-error="handleExportError" />

          <!-- Import Button Component -->
          <ImportCsv :columns="importColumns" :validate-row="validateImportRow" :transform-row="transformImportRow"
            @import-start="handleImportStart" @import-complete="handleImportComplete"
            @import-error="handleImportError" />

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat"
            @click="openCreateDialog">
            Add Subject
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
              <v-icon icon="mdi-book-open-variant" size="20" class="mr-2" />
              Subject Information
            </h2>
            <div class="table-subtitle">Manage and organize academic subjects</div>
          </div>
          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field v-model="searchQuery" placeholder="Search subjects..." prepend-inner-icon="mdi-magnify"
                variant="outlined" density="compact" hide-details class="search-input" clearable />
            </div>

            <v-menu v-model="showFilters" offset-y transition="scale-transition" max-width="320">
              <template #activator="{ props }">
                <v-btn v-bind="props" variant="outlined" class="filter-btn" aria-label="Open filters">
                  <v-icon icon="mdi-filter-variant" />
                </v-btn>
              </template>

              <v-card elevation="4" class="pa-2">
                <v-card-text class="py-2 px-3">
                  <div class="filters-content" style="min-width:220px;">
                    <div class="filter-group">
                      <label class="filter-label">Status</label>
                      <v-chip-group v-model="statusFilter" selected-class="text-primary" column>
                        <v-chip value="All" variant="outlined">All</v-chip>
                        <v-chip value="1" variant="outlined" color="success">Active</v-chip>
                        <v-chip value="0" variant="outlined" color="error">Inactive</v-chip>
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
          <v-table class="modern-table">
            <thead>
              <tr class="modern-header-row">
                <th class="modern-header-cell id-column">
                  <div class="header-content">#</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Global ID</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Code</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Name</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Credits</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Department</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Status</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Actions</div>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(subject, index) in paginatedSubjects" :key="subject.global_id" class="modern-table-row">
                <td class="modern-table-cell id-column">
                  <div class="id-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="code-badge">{{ subject.global_id }}</div>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="subject-code">{{ subject.subject_code }}</div>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="subject-info">
                    <div class="subject-details">
                      <div class="subject-name">{{ subject.subject_name }}</div>
                    </div>
                  </div>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="credit-badge">{{ subject.credit_hours }}</div>
                </td>
                <td class="modern-table-cell center-align">
                  <v-chip color="primary" variant="tonal" size="small" class="dept-chip">
                    {{ getDepartmentName(subject.department_id) }}
                  </v-chip>
                </td>
                <td class="modern-table-cell center-align">
                  <v-chip :color="subject.is_active ? 'success' : 'error'" size="small" class="status-chip">
                    <v-icon start size="16">{{ subject.is_active ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                    {{ subject.is_active ? "Active" : "Inactive" }}
                  </v-chip>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="action-group">
                    <v-btn icon class="action-btn" @click="openViewDialog(subject)">
                      <v-icon color="#3b82f6">mdi-eye</v-icon>
                    </v-btn>
                    <v-btn icon class="action-btn" @click="openEditDialog(subject)">
                      <v-icon color="#fde047">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon class="action-btn" @click="confirmDelete(subject)">
                      <v-icon color="#dc2626">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Empty State -->
          <div v-if="filteredSubjects.length === 0" class="empty-state">
            <v-icon icon="mdi-book-off-outline" size="64" color="grey-lighten-1" />
            <h3 class="empty-title">No subjects found</h3>
            <p class="empty-subtitle">
              Create your first subject to get started with academic course management.
            </p>
            <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
              <v-icon start>mdi-plus</v-icon>
              Add Subject
            </v-btn>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="filteredSubjects.length > 0" class="pagination-section">
          <v-btn
            variant="outlined"
            :disabled="currentPage === 1"
            @click="currentPage--"
            class="pagination-btn"
          >
            Previous
          </v-btn>

          <div class="pagination-info">
            <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
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
    <v-dialog v-model="dialog" max-width="600px" persistent class="modern-dialog">
      <v-card class="modern-dialog" elevation="24">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon :icon="isEditMode ? 'mdi-pencil' : 'mdi-plus'" :color="isEditMode ? 'warning' : 'primary'"
                size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">{{ isEditMode ? 'Edit Subject' : 'Create Subject' }}</h2>
              <p class="dialog-subtitle">{{ isEditMode ? 'Update subject information' : 'Add a new subject to the system' }}</p>
            </div>
          </div>
          <v-btn icon variant="text" @click="closeDialog" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text class="dialog-content">
          <SubjectForm 
            v-model="formData" 
            :departmentItems="departmentItems" 
            :isEdit="isEditMode"
            :loading="subjectStore.loading"
            @submit="handleFormSubmit"
            @cancel="closeDialog" 
          />
        </v-card-text>
      </v-card>
    </v-dialog>

    <!-- View Dialog -->
    <v-dialog v-model="viewDialog" max-width="600px" class="modern-dialog">
      <v-card class="modern-dialog" elevation="24">
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon icon="mdi-eye" color="info" size="24" />
            </div>
            <div class="header-text">
              <h2 class="dialog-title">Subject Details</h2>
              <p class="dialog-subtitle">View complete subject information</p>
            </div>
          </div>
          <v-btn icon variant="text" @click="viewDialog = false" class="close-btn">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>
        <v-divider />
        <v-card-text v-if="viewData" class="dialog-content">
          <div class="detail-grid">
            <div class="detail-item">
              <label class="detail-label">Global ID</label>
              <div class="detail-value">{{ viewData.global_id }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Subject Code</label>
              <div class="detail-value">{{ viewData.subject_code }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Subject Name</label>
              <div class="detail-value">{{ viewData.subject_name }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Credit Hours</label>
              <div class="detail-value">{{ viewData.credit_hours }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Department</label>
              <div class="detail-value">{{ getDepartmentName(viewData.department_id) }}</div>
            </div>
            <div class="detail-item">
              <label class="detail-label">Status</label>
              <div class="detail-value">
                <v-chip :color="viewData.is_active ? 'success' : 'error'" size="small">
                  {{ viewData.is_active ? 'Active' : 'Inactive' }}
                </v-chip>
              </div>
            </div>
            <div class="detail-item full-width">
              <label class="detail-label">Description</label>
              <div class="detail-value">{{ viewData.description || 'N/A' }}</div>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="dialog-actions">
          <v-spacer></v-spacer>
          <v-btn color="primary" variant="flat" @click="viewDialog = false">Close</v-btn>
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
          <h2 class="delete-title">Delete Subject</h2>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>
        <v-divider />
        <v-card-text class="delete-content">
          <div class="warning-box">
            <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
            <div class="warning-text">
              <p class="warning-message">
                You are about to permanently delete
                <strong class="subject-name">{{ selectedSubject?.subject_name }}</strong>
              </p>
            </div>
          </div>
        </v-card-text>
        <v-divider />
        <v-card-actions class="delete-actions">
          <v-btn variant="outlined" @click="deleteDialog = false">Cancel</v-btn>
          <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading" class="delete-btn">
            Delete Subject
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSubjectStore } from '~/store/useSubjectStore'
import { useAdminDepartments } from '~/store/adminDepartments'
import SubjectForm from '~/components/admin/SubjectForm.vue'
import ExportButtons from '~/components/ui/ExportButtons.vue'
import ImportCsv from '~/components/ui/ImportCsv.vue'
import Swal from 'sweetalert2'

definePageMeta({
  middleware: ['auth'],
  layout: 'admin'
})

const subjectStore = useSubjectStore()
const departmentStore = useAdminDepartments()

const searchQuery = ref('')
const statusFilter = ref('All')
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

const dialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const isEditMode = ref(false)
const deleteLoading = ref(false)
const selectedSubject = ref<any>(null)

const formData = ref({
  global_id: '',
  subject_code: '',
  subject_name: '',
  credit_hours: 3,
  department_id: null,
  description: '',
  is_active: true
})
const viewData = ref<any>(null)

const subjects = computed<any[]>(() => subjectStore.subjects || [])

const departmentItems = computed(() => {
  return departmentStore.departments.map((dept: any) => ({
    title: dept.department_name || dept.name,
    value: dept.id
  }))
})

const filteredSubjects = computed(() => {
  let filtered = subjects.value

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter((subject: any) =>
      subject.subject_code?.toLowerCase().includes(query) ||
      subject.subject_name?.toLowerCase().includes(query) ||
      subject.global_id?.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    const isActive = statusFilter.value === '1'
    filtered = filtered.filter((subject: any) => subject.is_active === isActive)
  }

  return filtered
})

const totalPages = computed(() => Math.ceil(filteredSubjects.value.length / itemsPerPage.value) || 1)

const paginatedSubjects = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredSubjects.value.slice(start, end)
})

// Export/Import Configuration
const exportColumns = [
  { key: 'global_id', header: 'Global ID', width: 15 },
  { key: 'subject_code', header: 'Subject Code', width: 15 },
  { key: 'subject_name', header: 'Subject Name', width: 30 },
  { key: 'credit_hours', header: 'Credit Hours', width: 12 },
  { key: 'department_id', header: 'Department ID', width: 15 },
  { key: 'description', header: 'Description', width: 40 },
  { key: 'is_active', header: 'Status', width: 12, format: 'status' },
  { key: 'created_at', header: 'Created At', width: 20, format: 'datetime' },
  { key: 'updated_at', header: 'Updated At', width: 20, format: 'datetime' }
]

const importColumns = [
  { key: 'global_id', header: 'Global ID' },
  { key: 'subject_code', header: 'Subject Code' },
  { key: 'subject_name', header: 'Subject Name' },
  { key: 'credit_hours', header: 'Credit Hours' },
  { key: 'department_id', header: 'Department ID' },
  { key: 'description', header: 'Description' },
  { key: 'is_active', header: 'Status', format: 'status' }
]

// Export Handlers
const handleExportStart = (type: string) => {
  console.log(`Starting ${type} export...`)
}

const handleExportComplete = (type: string) => {
  console.log(`Successfully exported to ${type.toUpperCase()}!`)
}

const handleExportError = ({ type, error }: { type: string, error: any }) => {
  console.error(`Export error (${type}):`, error)
  Swal.fire({
    icon: 'error',
    title: 'Export Error',
    text: `Failed to export to ${type.toUpperCase()}`
  })
}

// Import Handlers
const validateImportRow = (row: any) => {
  const errors = []
  if (!row.global_id) errors.push('Global ID is required')
  if (!row.subject_code) errors.push('Subject Code is required')
  if (!row.subject_name) errors.push('Subject Name is required')
  if (!row.credit_hours || row.credit_hours < 1) errors.push('Valid Credit Hours is required')
  return errors
}

const transformImportRow = (row: any) => {
  return {
    global_id: row.global_id,
    subject_code: row.subject_code,
    subject_name: row.subject_name,
    credit_hours: parseInt(row.credit_hours) || 3,
    department_id: row.department_id ? parseInt(row.department_id) : null,
    description: row.description || '',
    is_active: row.is_active === '1' || row.is_active === 'true' || row.is_active === true
  }
}

const handleImportStart = () => {
  console.log('Starting CSV import...')
}

const handleImportComplete = async (rows: any[]) => {
  console.log('Importing rows:', rows)

  let successCount = 0
  let errorCount = 0

  for (const row of rows) {
    try {
      await subjectStore.createSubject(row)
      successCount++
    } catch (error) {
      console.error('Failed to import row:', row, error)
      errorCount++
    }
  }

  await subjectStore.fetchSubjects()

  Swal.fire({
    icon: successCount > 0 ? 'success' : 'error',
    title: 'Import Complete',
    html: `
      <p>Successfully imported: ${successCount}</p>
      <p>Failed: ${errorCount}</p>
    `
  })
}

const handleImportError = (error: any) => {
  console.error('Import error:', error)
  Swal.fire({
    icon: 'error',
    title: 'Import Error',
    text: 'Failed to import CSV file'
  })
}

const getDepartmentName = (departmentId: any) => {
  const dept = departmentStore.departments.find((d: any) => d.id === departmentId) as any
  return dept ? (dept.department_name || dept.name) : 'N/A'
}

const openCreateDialog = () => {
  isEditMode.value = false
  formData.value = {
    global_id: generateNextGlobalId(),
    subject_code: '',
    subject_name: '',
    credit_hours: 3,
    department_id: null,
    description: '',
    is_active: true
  }
  dialog.value = true
}

const generateNextGlobalId = () => {
  if (subjects.value.length === 0) return 'SUB-001'
  
  const ids = subjects.value
    .map((s: any) => {
      const parts = s.global_id?.split('-')
      return parseInt(parts?.[1] || '0')
    })
    .filter((id: number) => !isNaN(id))
    .sort((a: number, b: number) => b - a)
  
  const lastId = ids.length > 0 ? ids[0] : 0
  const nextNum = ((lastId ?? 0) + 1).toString().padStart(3, '0')
  return `SUB-${nextNum}`
}

const openEditDialog = (subject: any) => {
  isEditMode.value = true
  formData.value = {
    global_id: subject.global_id,
    subject_code: subject.subject_code,
    subject_name: subject.subject_name,
    credit_hours: subject.credit_hours,
    department_id: subject.department_id,
    description: subject.description || '',
    is_active: subject.is_active
  }
  dialog.value = true
}

const openViewDialog = (subject: any) => {
  viewData.value = subject
  viewDialog.value = true
}

const confirmDelete = (subject: any) => {
  selectedSubject.value = subject
  deleteDialog.value = true
}

const closeDialog = () => {
  dialog.value = false
  formData.value = {
    global_id: '',
    subject_code: '',
    subject_name: '',
    credit_hours: 3,
    department_id: null,
    description: '',
    is_active: true
  }
}

const handleFormSubmit = async (data: any) => {
  try {
    if (isEditMode.value) {
      await subjectStore.updateSubject(data.global_id, data)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Subject updated successfully!',
        timer: 2000,
        showConfirmButton: false
      })
    } else {
      await subjectStore.createSubject(data)
      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Subject created successfully!',
        timer: 2000,
        showConfirmButton: false
      })
    }
    closeDialog()
    await subjectStore.fetchSubjects()
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Operation failed'
    })
  }
}

const handleDelete = async () => {
  if (!selectedSubject.value) return

  deleteLoading.value = true
  try {
    await subjectStore.deleteSubject(selectedSubject.value.global_id)
    Swal.fire({
      icon: 'success',
      title: 'Deleted!',
      text: 'Subject has been deleted.',
      timer: 2000,
      showConfirmButton: false
    })
    deleteDialog.value = false
    await subjectStore.fetchSubjects()
  } catch (error: any) {
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.response?.data?.message || error.message || 'Delete failed'
    })
  } finally {
    deleteLoading.value = false
  }
}

onMounted(async () => {
  await Promise.all([
    subjectStore.fetchSubjects(),
    departmentStore.fetchDepartments()
  ])
})
</script>

<style scoped>
.subjects-page {
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
