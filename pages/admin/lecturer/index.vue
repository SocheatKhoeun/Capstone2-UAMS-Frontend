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
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Lecturers</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ lecturers.length }}</div>
              <div class="stat-label">Total Lecturers</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ activeLecturerCount }}</div>
              <div class="stat-label">Active</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ inactiveLecturerCount }}</div>
              <div class="stat-label">Inactive</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ uniqueDepartments }}</div>
              <div class="stat-label">Departments</div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn import-btn" prepend-icon="mdi-download" variant="outlined" v-bind="props">
                Import
                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-excel" color="success" />
                </template>
                <v-list-item-title>Import from CSV/Excel</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn export-btn" prepend-icon="mdi-upload" variant="outlined" v-bind="props">
                Export
                <v-icon icon="mdi-chevron-down" size="16" class="ml-1" />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-excel" color="success" />
                </template>
                <v-list-item-title>Export to Excel</v-list-item-title>
              </v-list-item>
              <v-list-item class="menu-item">
                <template v-slot:prepend>
                  <v-icon icon="mdi-file-pdf-box" color="error" />
                </template>
                <v-list-item-title>Export to PDF</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
            @click="openCreateDialog" elevation="2">
            Add Lecturer
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Modern Table Section -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Table Header with Search and Filters -->
        <div class="table-toolbar">
          <div class="toolbar-left">
            <h2 class="table-title">
              <v-icon icon="mdi-table" size="20" class="mr-2" />
              Lecturer Information
            </h2>
            <!-- <div class="table-subtitle">Manage and organize lecturer accounts</div> -->
          </div>

          <div class="toolbar-right">
            <div class="search-container">
              <v-text-field v-model="searchQuery" prepend-inner-icon="mdi-magnify" label="Search lecturers..."
                variant="outlined" density="compact" hide-details class="search-input" clearable />
            </div>

            <v-select v-model="tableSortOrder" :items="tableSortOptions" label="Sort By" variant="outlined"
              density="compact" hide-details class="sort-select" />

            <v-btn icon="mdi-filter-variant" variant="outlined" density="comfortable" class="filter-btn"
              :class="{ 'active': showFilters }" @click="showFilters = !showFilters" />
          </div>
        </div>

        <!-- Collapsible Filters -->
        <v-expand-transition>
          <div v-show="showFilters" class="filters-section">
            <div class="filters-grid">
              <div class="filter-item">
                <label class="filter-label">Department</label>
                <v-select v-model="departmentFilter" :items="departmentOptions" variant="outlined" density="compact"
                  hide-details clearable />
              </div>
              <div class="filter-item">
                <label class="filter-label">Specialization</label>
                <v-select v-model="specializationFilter" :items="specializationOptions" variant="outlined"
                  density="compact" hide-details clearable />
              </div>
              <div class="filter-item">
                <label class="filter-label">Status</label>
                <v-select v-model="statusFilter" :items="statusOptions" variant="outlined" density="compact"
                  hide-details clearable />
              </div>
              <div class="filter-item">
                <label class="filter-label" style="opacity: 0;">Actions</label>
                <v-btn class="reset-btn" prepend-icon="mdi-refresh" variant="outlined" block @click="resetFilters">
                  Reset
                </v-btn>
              </div>
            </div>
          </div>
        </v-expand-transition>

        <!-- Modern Table -->
        <div class="modern-table-wrapper">
          <v-table class="modern-table">
            <thead>
              <tr class="modern-header-row">
                <th class="modern-header-cell id-column">
                  <div class="header-content">ID</div>
                </th>
                <th class="modern-header-cell">
                  <div class="header-content">Lecturer Name</div>
                </th>
                <th class="modern-header-cell">
                  <div class="header-content">Employee ID</div>
                </th>
                <th class="modern-header-cell">
                  <div class="header-content">Email</div>
                </th>
                <th class="modern-header-cell">
                  <div class="header-content">Phone</div>
                </th>
                <th class="modern-header-cell">
                  <div class="header-content">Position</div>
                </th>
                <th class="modern-header-cell center-align">
                  <div class="header-content">Courses</div>
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
              <tr v-for="(lecturer, index) in paginatedLecturers" :key="lecturer.id" class="modern-table-row">
                <td class="modern-table-cell id-column">
                  <span class="">{{ index + 1 }}</span>
                </td>
                <td class="modern-table-cell">
                  <div class="group-info">
                    <!-- <v-avatar size="36" class="group-avatar" color="green">
                      <span class="text-white text-subtitle-2 font-weight-medium">
                        {{ lecturer.name.charAt(0) }}
                      </span>
                    </v-avatar> -->
                    <div class="group-name">{{ lecturer.name }}</div>
                  </div>
                </td>
                <td class="modern-table-cell">
                  <span class="">{{ lecturer.employeeId }}</span>
                </td>
                <td class="modern-table-cell">{{ lecturer.email }}</td>
                <td class="modern-table-cell">{{ lecturer.phone || 'N/A' }}</td>
                <td class="modern-table-cell">
                  <v-chip size="small" variant="tonal"
                    :color="lecturer.position === 'professor' ? 'purple' : lecturer.position === 'assistant' ? 'blue' : 'green'">
                    {{ lecturer.position || 'Lecturer' }}
                  </v-chip>
                </td>
                <td class="modern-table-cell center-align">
                  <v-chip size="small" variant="outlined" color="primary">
                    {{ lecturer.courseCount || 0 }} courses
                  </v-chip>
                </td>
                <td class="modern-table-cell center-align">
                  <v-chip :color="lecturer.status === 'Active' ? 'success' : 'warning'" class="status-chip"
                    size="small">
                    <v-icon start size="16">mdi-check-circle</v-icon>
                    {{ lecturer.status === 'Active' ? 'active' : 'on leave' }}
                  </v-chip>
                </td>
                <td class="modern-table-cell center-align">
                  <div class="action-group">
                    <v-btn icon class="action-btn" @click="openEditDialog(lecturer)">
                      <v-icon color="#fde047">mdi-pencil</v-icon>
                    </v-btn>
                    <v-btn icon class="action-btn" @click="confirmDelete(lecturer)">
                      <v-icon color="#dc2626">mdi-delete</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>

              <!-- Empty State -->
              <tr v-if="filteredLecturers.length === 0">
                <td colspan="7" class="modern-table-cell">
                  <div class="empty-state">
                    <v-icon size="64" color="grey-lighten-1">mdi-account-tie-outline</v-icon>
                    <p class="empty-title">No lecturers found</p>
                    <p class="empty-subtitle">Try adjusting your filters or add a new lecturer</p>
                  </div>
                </td>
              </tr>
            </tbody>
          </v-table>

          <!-- Pagination Footer -->
          <div v-if="filteredLecturers.length > 0" class="pagination-section">
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

    <!-- Create/Edit Dialog -->
    <v-dialog v-model="dialogOpen" max-width="700px" persistent class="modern-dialog">
      <v-card>
        <div class="dialog-header">
          <div class="header-content">
            <div class="header-icon">
              <v-icon color="white" size="24">{{ isEdit ? 'mdi-pencil' : 'mdi-plus' }}</v-icon>
            </div>
            <div class="header-text">
              <h3 class="dialog-title">{{ isEdit ? 'Edit Lecturer' : 'Add New Lecturer' }}</h3>
              <p class="dialog-subtitle">
                {{ isEdit ? 'Update lecturer information' : 'Fill in the lecturer details below' }}
              </p>
            </div>
          </div>
          <v-btn icon variant="text" class="close-btn" @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </div>

        <v-card-text class="dialog-content">
          <v-form ref="formRef" v-model="formValid">
            <div class="form-group">
              <label class="form-label">Employee ID *</label>
              <v-text-field v-model="formData.employeeId" :rules="employeeIdRules" variant="outlined"
                density="comfortable" placeholder="e.g., EMP001" class="form-field" />
            </div>

            <div class="form-group">
              <label class="form-label">Full Name *</label>
              <v-text-field v-model="formData.name" :rules="nameRules" variant="outlined" density="comfortable"
                placeholder="Enter lecturer full name" class="form-field" />
            </div>

            <v-row>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Email *</label>
                  <v-text-field v-model="formData.email" :rules="emailRules" variant="outlined" density="comfortable"
                    placeholder="lecturer@example.com" class="form-field" />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Phone *</label>
                  <v-text-field v-model="formData.phone" :rules="phoneRules" variant="outlined" density="comfortable"
                    placeholder="+855 11 234 567" class="form-field" />
                </div>
              </v-col>
            </v-row>

            <v-row v-if="!isEdit">
              <v-col cols="12">
                <div class="form-group">
                  <label class="form-label">Password *</label>
                  <v-text-field v-model="formData.password" :rules="passwordRules" type="password" variant="outlined"
                    density="comfortable" placeholder="Min 8 characters" class="form-field" />
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Position *</label>
                  <v-select v-model="formData.position" :items="[
                    { title: 'Professor', value: 'professor' },
                    { title: 'Lecturer', value: 'lecturer' },
                    { title: 'Assistant', value: 'assistant' }
                  ]" :rules="positionRules" variant="outlined" density="comfortable" class="form-field"
                    item-title="title" item-value="value" />
                </div>
              </v-col>
              <v-col cols="6">
                <div class="form-group">
                  <label class="form-label">Department</label>
                  <v-select v-model="formData.department_id" :items="departments" item-title="name" item-value="id"
                    variant="outlined" density="comfortable" class="form-field" clearable />
                </div>
              </v-col>
            </v-row>

            <v-row>
              <v-col cols="12">
                <div class="form-group">
                  <label class="form-label">Specialization</label>
                  <v-select v-model="formData.specialization_id" :items="specializations" item-title="name"
                    item-value="id" variant="outlined" density="comfortable" class="form-field" clearable />
                </div>
              </v-col>
            </v-row>

            <div class="form-group">
              <div class="switch-container">
                <v-switch v-model="formData.active" color="green-darken-1" hide-details>
                  <template v-slot:label>
                    <div class="switch-info">
                      <span class="form-label">Active Status</span>
                      <span class="switch-description">Lecturer is currently active</span>
                    </div>
                  </template>
                </v-switch>
              </div>
            </div>
          </v-form>
        </v-card-text>

        <v-card-actions class="dialog-actions">
          <v-spacer />
          <v-btn variant="outlined" class="action-btn cancel-btn" @click="closeDialog" :disabled="formLoading">
            Cancel
          </v-btn>
          <v-btn :color="isEdit ? 'warning' : 'primary'" class="action-btn submit-btn" @click="submitForm"
            :loading="formLoading" :disabled="!formValid">
            {{ isEdit ? 'Update' : 'Create' }} Lecturer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px" persistent class="delete-dialog">
      <v-card>
        <div class="delete-header">
          <div class="delete-icon-container">
            <v-icon size="48" color="error">mdi-alert-circle-outline</v-icon>
          </div>
          <h3 class="delete-title">Delete Lecturer</h3>
          <p class="delete-subtitle">This action cannot be undone</p>
        </div>

        <v-card-text class="delete-content">
          <div class="warning-box">
            <v-icon class="warning-icon" color="warning">mdi-alert</v-icon>
            <div class="warning-text">
              <p class="warning-message">
                Are you sure you want to delete
                <strong class="group-name">{{ selectedLecturer?.name }}</strong>?
              </p>
              <p class="warning-details">
                All associated data will be permanently removed from the system.
              </p>
            </div>
          </div>
        </v-card-text>

        <v-card-actions class="delete-actions">
          <v-spacer />
          <v-btn variant="outlined" @click="deleteDialog = false" :disabled="deleteLoading">
            Cancel
          </v-btn>
          <v-btn color="error" class="delete-btn" @click="handleDelete" :loading="deleteLoading">
            Delete Lecturer
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { useLecturerStore } from '@/store/lecturerStore'
import Swal from 'sweetalert2'

definePageMeta({
  layout: 'admin',
})

const lecturerStore = useLecturerStore()
const pageLoading = ref(false)

// Reactive data
const showFilters = ref(false)
const dialogOpen = ref(false)
const deleteDialog = ref(false)
const selectedLecturer = ref(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)

// Search and filters
const searchQuery = ref('')
const statusFilter = ref('All')
const departmentFilter = ref('All')
const specializationFilter = ref('All')
const tableSortOrder = ref('A-Z')

// Pagination
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Form data
const formData = reactive({
  employeeId: '',
  name: '',
  email: '',
  phone: '',
  password: '',
  position: 'lecturer', // professor, lecturer, or assistant
  department_id: null,
  specialization_id: null,
  active: true
})

// Validation rules
const employeeIdRules = [
  v => !!v || 'Employee ID is required',
  v => (v && v.length >= 3) || 'Employee ID must be at least 3 characters'
]

const nameRules = [
  v => !!v || 'Name is required',
  v => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const emailRules = [
  v => !!v || 'Email is required',
  v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
  v => !!v || 'Password is required',
  v => (v && v.length >= 8) || 'Password must be at least 8 characters'
]

const phoneRules = [v => !!v || 'Phone is required']
const positionRules = [v => !!v || 'Position is required']
const departmentRules = [] // Optional
const specializationRules = [] // Optional

// Dynamic data from database
const specializations = ref([])
const departments = ref([])

// Filter options - dynamic from database
const departmentOptions = computed(() => {
  const depts = departments.value.map(d => d.name)
  return ['All', ...depts]
})
const specializationOptions = computed(() => {
  const specs = specializations.value.map(s => s.name)
  return ['All', ...specs]
})
const statusOptions = ['All', 'Active', 'Inactive']
const tableSortOptions = ['A-Z', 'Z-A', 'Active First', 'Department']

// Lecturer data from store
const lecturers = computed(() => lecturerStore.lecturers)

// Fetch lecturers on mount
onMounted(async () => {
  await Promise.all([
    fetchLecturers(),
    fetchSpecializations(),
    fetchDepartments()
  ])
})

const fetchLecturers = async () => {
  pageLoading.value = true
  try {
    await lecturerStore.getAllLecturers()
  } catch (error) {
    console.error('Error fetching lecturers:', error)
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'Failed to load lecturers. Please try again.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    pageLoading.value = false
  }
}

const fetchSpecializations = async () => {
  try {
    specializations.value = await lecturerStore.fetchSpecializations()
  } catch (error) {
    console.error('Failed to fetch specializations:', error)
  }
}

const fetchDepartments = async () => {
  try {
    departments.value = await lecturerStore.fetchDepartments()
  } catch (error) {
    console.error('Failed to fetch departments:', error)
  }
}

// Pagination computed
const totalPages = computed(() => {
  return Math.ceil(filteredLecturers.value.length / itemsPerPage.value)
})

const paginatedLecturers = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredLecturers.value.slice(start, end)
})

const goToPrevPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

const goToNextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}

// Computed filtered lecturers
const filteredLecturers = computed(() => {
  let filtered = [...lecturers.value]

  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(l =>
      l.name.toLowerCase().includes(query) ||
      l.email.toLowerCase().includes(query) ||
      l.employeeId.toLowerCase().includes(query)
    )
  }

  // Status filter
  if (statusFilter.value !== 'All') {
    filtered = filtered.filter(l => l.status === statusFilter.value)
  }

  // Department filter
  if (departmentFilter.value !== 'All') {
    filtered = filtered.filter(l => l.department === departmentFilter.value)
  }

  // Specialization filter
  if (specializationFilter.value !== 'All') {
    filtered = filtered.filter(l => l.specialization === specializationFilter.value)
  }

  // Sort
  filtered.sort((a, b) => {
    if (tableSortOrder.value === 'Z-A') {
      return b.name.localeCompare(a.name)
    } else if (tableSortOrder.value === 'Active First') {
      return a.status === 'Active' ? -1 : b.status === 'Active' ? 1 : 0
    } else if (tableSortOrder.value === 'Department') {
      return a.department.localeCompare(b.department)
    }
    return a.name.localeCompare(b.name)
  })

  return filtered
})

// Computed stats
const activeLecturerCount = computed(() => {
  return lecturers.value.filter(l => l.status === 'Active').length
})

const inactiveLecturerCount = computed(() => {
  return lecturers.value.filter(l => l.status === 'Inactive').length
})

const uniqueDepartments = computed(() => {
  const uniqueDepts = new Set(lecturers.value.map(l => l.department))
  return uniqueDepts.size
})

// Dialog methods
const openCreateDialog = () => {
  selectedLecturer.value = null
  isEdit.value = false
  formData.employeeId = ''
  formData.name = ''
  formData.email = ''
  formData.phone = ''
  formData.password = ''
  formData.position = 'lecturer'
  formData.department_id = null
  formData.specialization_id = null
  formData.active = true
  dialogOpen.value = true
}

const openEditDialog = (lecturer) => {
  selectedLecturer.value = lecturer
  isEdit.value = true
  formData.employeeId = lecturer.employeeId
  formData.name = lecturer.name
  formData.email = lecturer.email
  formData.phone = lecturer.phone
  formData.password = ''
  formData.position = lecturer.position || 'lecturer'
  formData.department_id = lecturer.department_id || null
  formData.specialization_id = lecturer.specialization_id || null
  formData.active = lecturer.status === 'Active'
  dialogOpen.value = true
}

const closeDialog = () => {
  dialogOpen.value = false
  selectedLecturer.value = null
  isEdit.value = false
}

// Form submission
const submitForm = async () => {
  if (!formValid.value) return

  formLoading.value = true

  try {
    const lecturerData = {
      employeeId: formData.employeeId,
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      position: formData.position,
      department_id: formData.department_id,
      specialization_id: formData.specialization_id,
      active: formData.active
    }

    // Include password only when creating
    if (!isEdit.value && formData.password) {
      lecturerData.password = formData.password
    }

    if (isEdit.value && selectedLecturer.value) {
      await lecturerStore.updateLecturer(selectedLecturer.value.lecturerId, lecturerData)

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Lecturer updated successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
    } else {
      await lecturerStore.createLecturer(lecturerData)

      Swal.fire({
        icon: 'success',
        title: 'Success',
        text: 'Lecturer created successfully!',
        confirmButtonColor: '#3b82f6',
        timer: 2000
      })
    }

    closeDialog()
  } catch (error) {
    console.error('Error submitting form:', error)

    let errorMessage = 'Failed to save lecturer. Please try again.'
    if (error.message) {
      errorMessage = error.message
    } else if (error.response?.data) {
      const errorData = error.response.data
      if (errorData.detail && Array.isArray(errorData.detail)) {
        errorMessage = errorData.detail.map(err => `${err.loc ? err.loc.join('.') + ': ' : ''}${err.msg || err.message}`).join('\n')
      } else if (errorData.detail) {
        errorMessage = errorData.detail
      } else if (errorData.message) {
        errorMessage = errorData.message
      }
    }

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: errorMessage,
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    formLoading.value = false
  }
}

// Filter methods
const resetFilters = () => {
  statusFilter.value = 'All'
  departmentFilter.value = 'All'
  specializationFilter.value = 'All'
  currentPage.value = 1
}

// Delete methods
const confirmDelete = (lecturer) => {
  selectedLecturer.value = lecturer
  deleteDialog.value = true
}

const handleDelete = async () => {
  if (!selectedLecturer.value) return

  deleteLoading.value = true

  try {
    await lecturerStore.deleteLecturer(selectedLecturer.value.lecturerId)

    Swal.fire({
      icon: 'success',
      title: 'Success',
      text: 'Lecturer deleted successfully!',
      confirmButtonColor: '#3b82f6',
      timer: 2000
    })

    deleteDialog.value = false
    selectedLecturer.value = null
  } catch (error) {
    console.error('Error deleting lecturer:', error)

    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: error.message || 'Failed to delete lecturer. Please try again.',
      confirmButtonColor: '#3b82f6'
    })
  } finally {
    deleteLoading.value = false
  }
}
</script>

<style scoped>
.lecturers-page {
  background: #f5f5f5;
  min-height: 100vh;
  padding: 0;
}

/* Modern Header Styles */
.modern-header {
  background: white;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: none;
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;
}

.title-section {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
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
  gap: 12px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 12px 16px;
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
  height: 38px;
  border-radius: 10px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 16px;
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

.modern-menu {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.menu-item {
  padding: 10px 14px;
  border-radius: 6px;
  margin: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f8fafc;
}

/* Modern Table Section */
.modern-table-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 16px 24px;
}

.table-container {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  border: 1px solid #e0e0e0;
}

.table-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  padding: 16px 20px 12px;
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

.sort-select {
  min-width: 140px;
}

.sort-select :deep(.v-field) {
  border-radius: 12px;
}

.filter-btn {
  height: 40px;
  width: 40px;
  border-radius: 12px;
}

.filter-btn.active {
  background: #3b82f6 !important;
  color: white !important;
  border-color: #3b82f6 !important;
}

.filters-section {
  padding: 12px 20px;
  background: #f8fafc;
  border-bottom: 1px solid #f1f5f9;
}

.filters-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  align-items: end;
}

.filter-item {
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

.reset-btn {
  text-transform: none;
  font-weight: 600;
  letter-spacing: 0.025em;
  border-radius: 8px;
  height: 36px;
  padding: 0 16px;
  border: 1.5px solid #e2e8f0;
  color: #64748b;
}

.reset-btn:hover {
  background: #f8fafc;
  border-color: #cbd5e1;
}

/* Modern Table Styles */
.modern-table-wrapper {
  position: relative;
  overflow: hidden;
}

.modern-table {
  width: 100%;
}

.modern-header-cell {
  padding: 14px 12px;
  border: none;
  position: relative;
  text-align: left !important;
}

.modern-header-cell.center-align {
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
}

.modern-table-row {
  transition: background-color 0.2s ease;
  border-bottom: 1px solid #f0f0f0;
}

.modern-table-row:hover {
  background: #fafafa;
}

.modern-table-cell {
  padding: 12px;
  border: none;
  vertical-align: middle;
  text-align: left !important;
}

.modern-table-cell.center-align {
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
  width: 28px;
  height: 28px;
  background: linear-gradient(135deg, #e0e7ff 0%, #c7d2fe 100%);
  color: #3730a3;
  font-weight: 600;
  font-size: 12px;
  border-radius: 6px;
}

.group-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.group-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
  color: #1d4ed8;
  border-radius: 10px;
}

.group-details {
  flex: 1;
}

.group-name {
  font-weight: 500;
  color: #1e293b;
  font-size: 14px;
  line-height: 1.2;
}

.group-meta {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.global-id-badge {
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #f1f5f9;
  color: #1e293b;
  font-weight: 600;
  font-size: 13px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  border-radius: 6px;
}

.action-group {
  display: flex;
  gap: 4px;
  justify-content: flex-start;
}

.action-btn {
  width: 32px;
  height: 32px;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.action-btn:hover {
  transform: scale(1.1);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 48px 24px;
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

/* Modern Dialog Styles */
.modern-dialog {
  border-radius: 16px !important;
  overflow: hidden;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 12px;
  flex: 1;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 10px;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
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
  padding: 20px !important;
}

.form-group {
  margin-bottom: 16px;
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

.form-field {
  margin-bottom: 0 !important;
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

.switch-container {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
}

.switch-info {
  flex: 1;
}

.switch-description {
  font-size: 13px;
  color: #64748b;
  display: block;
  margin-top: 4px;
}

.dialog-actions {
  padding: 16px 20px 20px !important;
  gap: 10px;
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
  padding: 20px !important;
}

.warning-box {
  display: flex;
  gap: 12px;
  padding: 12px;
  background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%);
  border: 1px solid #fde047;
  border-radius: 10px;
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
  margin: 0 0 4px 0;
  line-height: 1.4;
}

.warning-details {
  font-size: 13px;
  color: #a16207;
  margin: 0;
  line-height: 1.4;
}

.delete-actions {
  padding: 16px 20px 20px !important;
  gap: 10px;
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
  text-transform: lowercase !important;
  border-radius: 16px !important;
  padding: 0 12px !important;
  height: 28px !important;
}

/* Animation for dialogs */
.pagination-section {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  gap: 12px;
  border-top: 1px solid #e0e0e0;
}

.pagination-btn {
  min-width: 90px;
  height: 36px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  color: #666;
  letter-spacing: 0;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
}

.pagination-btn:disabled {
  opacity: 0.3;
  background: #fafafa;
}

.pagination-info {
  padding: 0 20px;
}

.pagination-text {
  font-size: 14px;
  color: #666;
  font-weight: 500;
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

  .filters-grid {
    grid-template-columns: 1fr;
  }
}
</style>
