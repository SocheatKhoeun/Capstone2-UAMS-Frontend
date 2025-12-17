<template>
    <div class="specializations-page">
<<<<<<< HEAD
        <!-- Header -->
=======
        <!-- Modern Header Section -->
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-school" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Specialization Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
<<<<<<< HEAD
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
=======
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                                <span class="breadcrumb-item active">Specializations</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ specializations.length }}</div>
                            <div class="stat-label">Total Specializations</div>
                        </div>
                        <div class="stat-card">
<<<<<<< HEAD
                            <div class="stat-number">{{specializations.filter(s => s.active).length}}</div>
                            <div class="stat-label">Active</div>
                        </div>
                    </div>
                </div>
                <div class="action-section">
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
=======
                            <div class="stat-number">{{ activeSpecializations.length }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ inactiveSpecializations.length }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <!-- Export Button Component -->
                    <ExportButtons :data="filteredSpecializations" :columns="exportColumns" filename="Specializations_Export"
                        @export-start="handleExportStart" @export-complete="handleExportComplete"
                        @export-error="handleExportError" />

                    <!-- Import Button Component -->
                    <ImportCsv :columns="importColumns" :validate-row="validateImportRow" :transform-row="transformImportRow"
                        @import-start="handleImportStart" @import-complete="handleImportComplete"
                        @import-error="handleImportError" />

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat"
                        @click="openCreateDialog">
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                        Add Specialization
                    </v-btn>
                </div>
            </div>
        </div>

<<<<<<< HEAD
        <!-- Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-table" size="20" class="mr-2" />
                            Specialization Information
                        </h2>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search specializations..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                clearable />
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <v-table class="modern-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="spec in filteredSpecializations" :key="spec.id">
                            <td>{{ spec.id }}</td>
                            <td>{{ spec.name }}</td>
                            <td>{{ getDepartmentName(spec.department_id) }}</td>
                            <td>
                                <v-chip :color="spec.active ? 'success' : 'error'" size="small">
                                    {{ spec.active ? 'Active' : 'Inactive' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-btn icon size="small" @click="openEditDialog(spec)">
                                    <v-icon color="#fde047">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon size="small" @click="deleteSpecialization(spec)" class="ml-1">
                                    <v-icon color="error">mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="500" persistent>
            <v-card>
                <v-card-title>{{ isEdit ? 'Edit Specialization' : 'Add Specialization' }}</v-card-title>
                <v-card-text>
                    <v-form ref="formRef" v-model="formValid">
                        <v-text-field v-model="formData.name" label="Specialization Name *" :rules="nameRules"
                            variant="outlined" density="comfortable" />
                        <v-select v-model="formData.department_id" :items="departments" label="Department *"
                            :rules="departmentRules" variant="outlined" density="comfortable" item-title="name"
                            item-value="id" />
                        <v-switch v-model="formData.active" label="Active" color="primary" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="dialogOpen = false">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!formValid" :loading="formLoading" @click="submitForm">
                        {{ isEdit ? 'Update' : 'Create' }}
=======
        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Table Header with Search and Filters -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-school" size="20" class="mr-2" />
                            Specialization Information
                        </h2>
                        <div class="table-subtitle">Manage and organize academic specializations</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search specializations..." prepend-inner-icon="mdi-magnify"
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
                                        <div class="filter-group">
                                            <label class="filter-label">Department</label>
                                            <v-select v-model="departmentFilter" :items="departmentOptions" variant="outlined" density="compact"
                                                hide-details class="filter-select" />
                                        </div>
                                        <div class="filter-group">
                                            <label class="filter-label">Sort By</label>
                                            <v-select v-model="sortOrder" :items="sortOptions" variant="outlined" density="compact"
                                                hide-details class="filter-select" />
                                        </div>
                                    </div>
                                </v-card-text>
                            </v-card>
                        </v-menu>
                    </div>
                </div>

                <!-- Modern Data Table -->
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
                                    <div class="header-content">Specialization Name</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Department</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Created At</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(specialization, index) in paginatedSpecializations" :key="specialization.id" class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="code-badge">{{ specialization.global_id }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="specialization-info">
                                        <div class="specialization-details">
                                            <div class="specialization-name">{{ specialization.name }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip color="primary" variant="tonal" size="small" class="dept-chip">
                                        {{ getDepartmentName(specialization.department_id) }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="specialization.active === 1 ? 'success' : 'error'" size="small"
                                        class="status-chip">
                                        <v-icon start size="16">{{ specialization.active === 1 ? 'mdi-check-circle' : 'mdi-close-circle' }}</v-icon>
                                        {{ specialization.active === 1 ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="date-info">{{ formatDate(specialization.created_at) }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="handleView(specialization)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="openEditDialog(specialization)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(specialization)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredSpecializations.length === 0" class="empty-state">
                        <v-icon icon="mdi-school-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No specializations found</h3>
                        <p class="empty-subtitle">
                            Create your first specialization to get started with academic program management.
                        </p>
                        <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            Add Specialization
                        </v-btn>
                    </div>
                    
                    <!-- Pagination Footer -->
                    <div v-if="filteredSpecializations.length > 0" class="pagination-section">
                        <v-btn 
                            variant="outlined" 
                            :disabled="currentPage === 1"
                            @click="goToPrevPage"
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
                            @click="goToNextPage"
                            class="pagination-btn"
                        >
                            Next
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- View Details Dialog -->
        <v-dialog v-model="viewDialog" max-width="800" persistent>
            <v-card class="modern-dialog" elevation="24" v-if="selectedSpecialization">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-school" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Specialization Details</h2>
                            <p class="dialog-subtitle">{{ selectedSpecialization.name }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="viewDialog = false" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <div class="class-details">
                        <!-- Basic Information -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-information" size="16" />
                                Basic Information
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Specialization ID</div>
                                    <div class="detail-value">{{ selectedSpecialization.id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Global ID</div>
                                    <div class="detail-value">{{ selectedSpecialization.global_id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Specialization Name</div>
                                    <div class="detail-value">{{ selectedSpecialization.name }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Department</div>
                                    <div class="detail-value">{{ getDepartmentName(selectedSpecialization.department_id) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">
                                        <v-chip :color="selectedSpecialization.active === 1 ? 'success' : 'error'" size="small">
                                            {{ selectedSpecialization.active === 1 ? 'Active' : 'Inactive' }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Created At</div>
                                    <div class="detail-value">{{ formatDate(selectedSpecialization.created_at) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Updated At</div>
                                    <div class="detail-value">{{ formatDate(selectedSpecialization.updated_at) }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Statistics (placeholder for future) -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-chart-box" size="16" />
                                Statistics
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Total Subjects</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Active Subjects</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Total Students</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Total Instructors</div>
                                    <div class="detail-value">0</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="viewDialog = false" class="action-btn">
                        <v-icon start>mdi-close</v-icon>
                        Close
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
<<<<<<< HEAD
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admin'
})

const { $AdminPrivateAxios } = useNuxtApp()

const searchQuery = ref('')
const dialogOpen = ref(false)
const isEdit = ref(false)
const formValid = ref(false)
const formLoading = ref(false)
const formRef = ref(null)
const specializations = ref([])
const departments = ref([])
const selectedSpecialization = ref(null)

const formData = reactive({
    name: '',
    department_id: null,
    active: true
})

const nameRules = [
    v => !!v || 'Specialization name is required',
    v => v.length >= 2 || 'At least 2 characters'
]

const departmentRules = [
    v => v !== null && v !== undefined || 'Department is required'
]

onMounted(async () => {
    await fetchDepartments()
    await fetchSpecializations()
})

const fetchDepartments = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/departments/')
        const data = response.data.data || response.data || []
        departments.value = Array.isArray(data) ? data : data.items || []
    } catch (error) {
        console.error('Error fetching departments:', error)
    }
}

const fetchSpecializations = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/specializations/')
        const data = response.data.data || response.data || []
        specializations.value = Array.isArray(data) ? data : data.items || []
    } catch (error) {
        console.error('Error fetching specializations:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch specializations' })
    }
}

const getDepartmentName = (deptId) => {
    const dept = departments.value.find(d => d.id === deptId)
    return dept?.name || 'N/A'
}

const filteredSpecializations = computed(() => {
    if (!searchQuery.value) return specializations.value
    const q = searchQuery.value.toLowerCase()
    return specializations.value.filter(s => s.name?.toLowerCase().includes(q))
})

const openCreateDialog = () => {
    isEdit.value = false
    Object.assign(formData, { name: '', department_id: null, active: true })
    dialogOpen.value = true
}

const openEditDialog = (spec) => {
    isEdit.value = true
    selectedSpecialization.value = spec
    Object.assign(formData, {
        name: spec.name,
        department_id: spec.department_id,
        active: !!spec.active
    })
    dialogOpen.value = true
}

const submitForm = async () => {
    if (!formValid.value) return
    formLoading.value = true

    try {
        const payload = {
            name: formData.name,
            department_id: formData.department_id,
            active: formData.active
        }

        if (isEdit.value) {
            await $AdminPrivateAxios.patch(`/specializations/${selectedSpecialization.value.global_id}`, payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Specialization updated successfully', timer: 2000 })
        } else {
            await $AdminPrivateAxios.post('/specializations/', payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Specialization created successfully', timer: 2000 })
        }

        await fetchSpecializations()
        dialogOpen.value = false
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to save specialization' })
=======

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="600" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" :color="isEdit ? 'warning' : 'primary'" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Specialization' : 'Add New Specialization' }}</h2>
                            <p class="dialog-subtitle">{{ isEdit ? 'Update specialization information' : 'Create a new specialization' }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <SpecializationForm
                        :model-value="formData"
                        :is-edit="isEdit"
                        :departments="departments"
                        :loading="formLoading"
                        @submit="submitForm"
                        @cancel="closeDialog"
                    />
                </v-card-text>
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
                    <h2 class="delete-title">Delete Specialization</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                You are about to permanently delete the specialization
                                <strong class="specialization-name">{{ selectedSpecialization?.name }}</strong>
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false" :disabled="deleteLoading"
                        class="action-btn cancel-btn">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Specialization
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top right">
            {{ snackbarMessage }}
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive, computed, watch, onMounted } from 'vue'
import SpecializationForm from '~/components/admin/SpecializationForm.vue'
import ExportButtons from '~/components/ui/ExportButtons.vue'
import ImportCsv from '~/components/ui/ImportCsv.vue'
import { useSpecializationStore } from '~/store/useSpecializationStore'
import { useAdminDepartments } from '~/store/adminDepartments'

definePageMeta({
    middleware: ['auth'],
    layout: 'admin'
})

// Initialize stores
const specializationStore = useSpecializationStore()
const departmentStore = useAdminDepartments()

// Access store data directly with proper typing
const specializations = computed<any[]>(() => specializationStore.specializations || [])
const departments = computed<any[]>(() => departmentStore.departments || [])

// Fetch data on mount
onMounted(async () => {
    await Promise.all([
        specializationStore.fetchSpecializations(),
        departmentStore.fetchDepartments()
    ])
})

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('All')
const departmentFilter = ref('All')
const sortOrder = ref('A-Z')
const dialogOpen = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const selectedSpecialization = ref<Record<string, any> | null>(null)
const isEdit = ref(false)
const formValid = ref(false)
const formRef = ref(null)
const formLoading = ref(false)
const deleteLoading = ref(false)
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form data
const formData = reactive({
    global_id: '',
    name: '',
    department_id: null as number | null,
    active: 1
})

// Export/Import Configuration
const exportColumns = [
    { key: 'global_id', header: 'Global ID', width: 15 },
    { key: 'name', header: 'Specialization Name', width: 30 },
    { key: 'department_id', header: 'Department', width: 25, format: (val: number) => getDepartmentName(val) },
    { key: 'active', header: 'Status', width: 12, format: 'status' },
    { key: 'created_at', header: 'Created At', width: 20, format: 'datetime' },
    { key: 'updated_at', header: 'Updated At', width: 20, format: 'datetime' }
]

const importColumns = [
    { key: 'global_id', header: 'Global ID' },
    { key: 'name', header: 'Specialization Name' },
    { key: 'department_id', header: 'Department ID', format: 'number' },
    { key: 'active', header: 'Status', format: 'status' }
]

// Computed properties
const activeSpecializations = computed(() => specializations.value.filter(s => s.active === 1))
const inactiveSpecializations = computed(() => specializations.value.filter(s => s.active === 0))

const filteredSpecializations = computed(() => {
    let result = [...specializations.value]
    
    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(s => 
            s.name.toLowerCase().includes(query) ||
            s.global_id.toLowerCase().includes(query) ||
            getDepartmentName(s.department_id).toLowerCase().includes(query)
        )
    }
    
    // Status filter
    if (statusFilter.value !== 'All') {
        const isActive = statusFilter.value === '1' ? 1 : 0
        result = result.filter(s => s.active === isActive)
    }

    // Department filter
    if (departmentFilter.value !== 'All') {
        const deptName = departmentFilter.value
        result = result.filter(s => getDepartmentName(s.department_id) === deptName)
    }
    
    // Sort
    if (sortOrder.value === 'A-Z') {
        result.sort((a, b) => a.name.localeCompare(b.name))
    } else if (sortOrder.value === 'Z-A') {
        result.sort((a, b) => b.name.localeCompare(a.name))
    } else if (sortOrder.value === 'Newest') {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortOrder.value === 'Oldest') {
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }
    
    return result
})

const totalPages = computed(() => Math.ceil(filteredSpecializations.value.length / itemsPerPage.value))

const paginatedSpecializations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredSpecializations.value.slice(start, end)
})

// Options
const departmentOptions = computed(() => ['All', ...departments.value.map(d => d.name)])
const sortOptions = ['A-Z', 'Z-A', 'Newest', 'Oldest']

// Export Handlers
const handleExportStart = (type: string) => {
    showSnackbar(`Starting ${type} export...`, 'info')
}

const handleExportComplete = (type: string) => {
    showSnackbar(`Successfully exported to ${type.toUpperCase()}!`, 'success')
}

const handleExportError = ({ type, error }: { type: string, error: any }) => {
    console.error(`Export error (${type}):`, error)
    showSnackbar(`Failed to export to ${type}. Please try again.`, 'error')
}

// Import Handlers
const validateImportRow = (row: any, rowIndex: number) => {
    const errors = []
    
    if (!row.global_id || !/^SPEC-\d{3}$/.test(row.global_id)) {
        errors.push(`Row ${rowIndex + 1}: Invalid Global ID format (should be SPEC-001)`)
    }
    
    if (!row.name || row.name.length < 3) {
        errors.push(`Row ${rowIndex + 1}: Specialization name is required and must be at least 3 characters`)
    }
    
    if (!row.department_id || isNaN(parseInt(row.department_id))) {
        errors.push(`Row ${rowIndex + 1}: Valid Department ID is required`)
    }
    
    return errors
}

const transformImportRow = (row: any) => {
    return {
        global_id: row.global_id?.trim(),
        name: row.name?.trim(),
        department_id: parseInt(row.department_id),
        active: row.active === '1' || row.active === 1 || row.active?.toLowerCase() === 'active' ? 1 : 0
    }
}

const handleImportStart = () => {
    showSnackbar('Processing import...', 'info')
}

const handleImportComplete = async (data: any[]) => {
    try {
        // Import each specialization through the API
        const importPromises = data.map(item => 
            specializationStore.createSpecialization(item)
        )
        
        await Promise.all(importPromises)
        
        // Refresh the list
        await specializationStore.fetchSpecializations()
        
        showSnackbar(`Successfully imported ${data.length} specialization(s)!`, 'success')
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to import some specializations'
        showSnackbar(errorMessage, 'error')
    }
}

const handleImportError = (error: any) => {
    console.error('Import error:', error)
    showSnackbar('Failed to import data. Please check the file format.', 'error')
}

// Methods
const getDepartmentName = (departmentId: number) => {
    const dept = departments.value.find(d => d.id === departmentId)
    return dept ? dept.name : 'Unknown'
}

const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const openCreateDialog = () => {
    isEdit.value = false
    formData.global_id = generateNextGlobalId()
    formData.name = ''
    formData.department_id = null
    formData.active = 1
    dialogOpen.value = true
}

const openEditDialog = (specialization: any) => {
    isEdit.value = true
    selectedSpecialization.value = specialization
    Object.assign(formData, {
        global_id: specialization.global_id,
        name: specialization.name,
        department_id: specialization.department_id,
        active: specialization.active
    })
    dialogOpen.value = true
    viewDialog.value = false
}

const closeDialog = () => {
    dialogOpen.value = false
    isEdit.value = false
    formData.global_id = ''
    formData.name = ''
    formData.department_id = null
    formData.active = 1
    selectedSpecialization.value = null
}

const submitForm = async (data: any) => {
    formLoading.value = true
    
    try {
        if (isEdit.value && selectedSpecialization.value) {
            // Update existing specialization
            await specializationStore.updateSpecialization(selectedSpecialization.value.global_id, {
                name: data.name,
                department_id: data.department_id,
                active: data.active
            })
            showSnackbar('Specialization updated successfully!', 'success')
        } else {
            // Create new specialization
            await specializationStore.createSpecialization({
                global_id: data.global_id,
                name: data.name,
                department_id: data.department_id,
                active: data.active
            })
            showSnackbar('Specialization created successfully!', 'success')
        }
        
        closeDialog()
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
        showSnackbar(errorMessage, 'error')
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
    } finally {
        formLoading.value = false
    }
}

<<<<<<< HEAD
const deleteSpecialization = async (spec) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Specialization?',
        text: `Are you sure you want to delete "${spec.name}"? This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            await $AdminPrivateAxios.post(`/specializations/${spec.global_id}/delete`)
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Specialization deleted successfully', timer: 2000 })
            await fetchSpecializations()
        } catch (error) {
            console.error('Error deleting specialization:', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to delete specialization' })
        }
    }
}
=======
const handleView = (specialization: any) => {
    selectedSpecialization.value = specialization
    viewDialog.value = true
}

const confirmDelete = (specialization: any) => {
    selectedSpecialization.value = specialization
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedSpecialization.value) return
    
    deleteLoading.value = true
    
    try {
        await specializationStore.deleteSpecialization(selectedSpecialization.value.global_id)
        showSnackbar('Specialization deleted successfully!', 'success')
        deleteDialog.value = false
        selectedSpecialization.value = null
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
        showSnackbar(errorMessage, 'error')
    } finally {
        deleteLoading.value = false
    }
}

const generateNextGlobalId = () => {
    if (specializations.value.length === 0) return 'SPEC-001'
    
    const ids = specializations.value
        .map(s => {
            const parts = s.global_id.split('-')
            return parseInt(parts[1] || '0')
        })
        .filter(id => !isNaN(id))
        .sort((a, b) => b - a)
    
    const lastId = ids.length > 0 ? ids[0] : 0
    const nextNum = ((lastId ?? 0) + 1).toString().padStart(3, '0')
    return `SPEC-${nextNum}`
}

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

const showSnackbar = (message: string, color: string) => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// Watch for search/filter changes to reset pagination
watch([searchQuery, statusFilter, departmentFilter, sortOrder], () => {
    currentPage.value = 1
})
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
</script>

<style scoped>
.specializations-page {
<<<<<<< HEAD
    padding: 20px;
}

.modern-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 24px;
    color: white;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
=======
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
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.title-wrapper {
    display: flex;
<<<<<<< HEAD
    gap: 16px;
    align-items: center;
=======
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
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.page-title {
    font-size: 28px;
<<<<<<< HEAD
    font-weight: 600;
    margin: 0;
=======
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
    letter-spacing: -0.025em;
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.breadcrumb {
    display: flex;
    align-items: center;
<<<<<<< HEAD
    gap: 8px;
    margin-top: 8px;
    opacity: 0.9;
=======
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
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.stats-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
<<<<<<< HEAD
    background: rgba(255, 255, 255, 0.2);
    padding: 16px 24px;
    border-radius: 8px;
    text-align: center;
}

.stat-number {
    font-size: 32px;
    font-weight: 700;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
    margin-top: 4px;
}

.modern-table-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
=======
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
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
<<<<<<< HEAD
    align-items: center;
    margin-bottom: 20px;
=======
    align-items: flex-start;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.toolbar-left {
    flex: 1;
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

.table-title {
    font-size: 20px;
    font-weight: 600;
<<<<<<< HEAD
=======
    color: #1e293b;
    margin: 0 0 4px 0;
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
    display: flex;
    align-items: center;
}

<<<<<<< HEAD
.search-container {
    width: 300px;
=======
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

.filter-select {
    min-width: 120px;
    background: white;
    border-radius: 8px;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
}

.filter-btn {
    height: 40px;
    width: 40px;
    border-radius: 12px;
}

.filters-content {
    display: flex;
    flex-direction: column;
    gap: 16px;
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
    border-radius: 8px;
    font-weight: 600;
    font-size: 12px;
}

.specialization-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.specialization-details {
    flex: 1;
}

.specialization-name {
    font-weight: 600;
    color: #1f2937;
    font-size: 15px;
}

.code-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #1e293b;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    font-family: 'Courier New', monospace;
}

.dept-chip {
    font-weight: 500 !important;
    text-transform: capitalize !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
}

.date-info {
    color: #1e293b;
    font-size: 14px;
    font-weight: 500;
}

.status-chip {
    font-weight: 500 !important;
    text-transform: capitalize !important;
    border-radius: 16px !important;
    padding: 0 12px !important;
    height: 28px !important;
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

.dialog-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.dialog-actions .action-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 32px;
    transition: all 0.2s ease;
    min-width: 120px;
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

/* Detail View Styles */
.class-details {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

.detail-section {
    background: #f8fafc;
    border-radius: 12px;
    padding: 20px;
}

.section-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 16px 0;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.detail-value {
    font-size: 14px;
    font-weight: 500;
    color: #1e293b;
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
    margin: 0 0 4px 0;
    line-height: 1.4;
}

.specialization-name {
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

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-item.full-width {
        grid-column: 1;
    }
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
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}
</style>
