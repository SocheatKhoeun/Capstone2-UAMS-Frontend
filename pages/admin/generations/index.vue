<template>
    <div class="generations-page">
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
<<<<<<< HEAD
                            <v-icon icon="mdi-calendar-clock" size="32" color="white" />
=======
                            <v-icon icon="mdi-school-outline" size="32" color="white" />
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Generation Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
<<<<<<< HEAD
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
=======
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                                <span class="breadcrumb-item active">Generations</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ generations.length }}</div>
                            <div class="stat-label">Total Generations</div>
                        </div>
                        <div class="stat-card">
<<<<<<< HEAD
                            <div class="stat-number">{{generations.filter(g => g.active).length}}</div>
                            <div class="stat-label">Active</div>
                        </div>
                    </div>
                </div>
                <div class="action-section">
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
=======
                            <div class="stat-number">{{ activeGenerations.length }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ inactiveGenerations.length }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <!-- Export Button Component -->
                    <ExportButtons :data="filteredGenerations" :columns="exportColumns" filename="Generations_Export"
                        @export-start="handleExportStart" @export-complete="handleExportComplete"
                        @export-error="handleExportError" />

                    <!-- Import Button Component -->
                    <ImportCsv :columns="importColumns" :validate-row="validateImportRow"
                        :transform-row="transformImportRow" @import-start="handleImportStart"
                        @import-complete="handleImportComplete" @import-error="handleImportError" />

                    <!-- Add Generation Button -->
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" @click="openCreateDialog">
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                        Add Generation
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
                            Generation Information
                        </h2>
                    </div>
=======
        <!-- Rest of your existing template remains the same... -->
        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Table Header with Search and Filters -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-school-outline" size="20" class="mr-2" />
                            Generation Information
                        </h2>
                        <div class="table-subtitle">Manage and organize student generations</div>
                    </div>

>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search generations..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
<<<<<<< HEAD
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
                            <th>Start Year</th>
                            <th>End Year</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="gen in filteredGenerations" :key="gen.id">
                            <td>{{ gen.id }}</td>
                            <td>{{ gen.generation }}</td>
                            <td>{{ gen.start_year || 'N/A' }}</td>
                            <td>{{ gen.end_year || 'N/A' }}</td>
                            <td>
                                <v-chip :color="gen.active ? 'success' : 'error'" size="small">
                                    {{ gen.active ? 'Active' : 'Inactive' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-btn icon size="small" @click="openEditDialog(gen)">
                                    <v-icon color="#fde047">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon size="small" @click="deleteGeneration(gen)" class="ml-1">
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
                <v-card-title>{{ isEdit ? 'Edit Generation' : 'Add Generation' }}</v-card-title>
                <v-card-text>
                    <v-form ref="formRef" v-model="formValid">
                        <v-text-field v-model="formData.generation" label="Generation Name *" :rules="nameRules"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.start_year" label="Start Year" type="number"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.end_year" label="End Year" type="number"
                            variant="outlined" density="comfortable" />
                        <v-switch v-model="formData.active" label="Active" color="primary" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="dialogOpen = false">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!formValid" :loading="formLoading" @click="submitForm">
                        {{ isEdit ? 'Update' : 'Create' }}
=======
                                class="search-input" clearable />
                        </div>

                        <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined"
                            density="compact" hide-details class="filter-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" class="filter-btn"
                            @click="showFilters = !showFilters" />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <label class="filter-label">Sort By</label>
                                <v-select v-model="sortOrder" :items="sortOptions" variant="outlined" density="compact"
                                    hide-details class="filter-select" />
                            </div>
                        </div>
                    </div>
                </v-expand-transition>

                <!-- Modern Data Table -->
                <div class="modern-table-wrapper">
                    <v-table class="modern-table">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell id-column">
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Global ID</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Generation</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Start Year</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">End Year</div>
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
                            <tr v-for="(generation, index) in paginatedGenerations" :key="generation.id"
                                class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="code-badge">{{ generation.global_id }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="generation-info">
                                        <div class="generation-details">
                                            <div class="generation-name">{{ generation.generation }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="year-badge">{{ generation.start_year || 'N/A' }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="year-badge">{{ generation.end_year || 'N/A' }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="generation.active === 1 ? 'success' : 'error'" size="small"
                                        class="status-chip">
                                        <v-icon start size="16">{{ generation.active === 1 ? 'mdi-check-circle' :
                                            'mdi-close-circle' }}</v-icon>
                                        {{ generation.active === 1 ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="date-info">{{ formatDate(generation.created_at) }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="handleView(generation)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="openEditDialog(generation)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(generation)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredGenerations.length === 0" class="empty-state">
                        <v-icon icon="mdi-school-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No generations found</h3>
                        <p class="empty-subtitle">
                            Create your first generation to get started with student batch management.
                        </p>
                        <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            Add Generation
                        </v-btn>
                    </div>

                    <!-- Pagination Footer -->
                    <div v-if="filteredGenerations.length > 0" class="pagination-section">
                        <v-btn variant="outlined" :disabled="currentPage === 1" @click="goToPrevPage"
                            class="pagination-btn">
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

        <!-- View Details Dialog -->
        <v-dialog v-model="viewDialog" max-width="800" persistent>
            <v-card class="modern-dialog" elevation="24" v-if="selectedGeneration">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-school-outline" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Generation Details</h2>
                            <p class="dialog-subtitle">{{ selectedGeneration.generation }}</p>
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
                                    <div class="detail-label">Generation ID</div>
                                    <div class="detail-value">{{ selectedGeneration.id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Global ID</div>
                                    <div class="detail-value">{{ selectedGeneration.global_id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Generation Name</div>
                                    <div class="detail-value">{{ selectedGeneration.generation }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Start Year</div>
                                    <div class="detail-value">{{ selectedGeneration.start_year || 'N/A' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">End Year</div>
                                    <div class="detail-value">{{ selectedGeneration.end_year || 'N/A' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">
                                        <v-chip :color="selectedGeneration.active === 1 ? 'success' : 'error'"
                                            size="small">
                                            {{ selectedGeneration.active === 1 ? 'Active' : 'Inactive' }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Created At</div>
                                    <div class="detail-value">{{ formatDate(selectedGeneration.created_at) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Updated At</div>
                                    <div class="detail-value">{{ formatDate(selectedGeneration.updated_at) }}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="viewDialog = false">
                        Close
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
<<<<<<< HEAD
=======

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="600" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :icon="isEdit ? 'mdi-pencil' : 'mdi-plus'" :color="isEdit ? 'warning' : 'primary'"
                                size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Generation' : 'Add New Generation' }}</h2>
                            <p class="dialog-subtitle">{{ isEdit ? 'Update generation information' : 'Create a new generation' }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
                        <div class="form-group">
                            <label class="form-label">Global ID <span class="text-red">*</span></label>
                            <v-text-field v-model="formData.global_id" :rules="globalIdRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="GEN-001"
                                :disabled="isEdit" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Generation Name <span class="text-red">*</span></label>
                            <v-text-field v-model="formData.generation" :rules="generationRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" placeholder="Batch 2025" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Start Year</label>
                            <v-text-field v-model.number="formData.start_year" :rules="startYearRules"
                                variant="outlined" density="comfortable" hide-details="auto" class="form-field"
                                type="number" placeholder="2024" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">End Year</label>
                            <v-text-field v-model.number="formData.end_year" :rules="endYearRules" variant="outlined"
                                density="comfortable" hide-details="auto" class="form-field" type="number"
                                placeholder="2028" />
                        </div>

                        <div class="form-group">
                            <label class="form-label">Status</label>
                            <v-select v-model="formData.active" :items="statusItems" item-title="text"
                                item-value="value" variant="outlined" density="comfortable" hide-details="auto"
                                class="form-field" />
                        </div>
                    </v-form>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="closeDialog" :disabled="formLoading">
                        Cancel
                    </v-btn>
                    <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="submitForm"
                        :loading="formLoading" :disabled="!formValid">
                        {{ isEdit ? 'Update Generation' : 'Create Generation' }}
                    </v-btn>
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
                    <h2 class="delete-title">Delete Generation</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <p class="warning-message">
                            You are about to permanently delete
                            <strong class="generation-name">{{ selectedGeneration?.generation }}</strong>
                        </p>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false"
                        :disabled="deleteLoading">
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading">
                        Delete Generation
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Snackbar for notifications -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000" location="top right">
            {{ snackbarMessage }}
        </v-snackbar>
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
    </div>
</template>

<script setup>
<<<<<<< HEAD
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
const generations = ref([])
const selectedGeneration = ref(null)

const formData = reactive({
    generation: '',
    start_year: null,
    end_year: null,
    active: true
})

const nameRules = [
    v => !!v || 'Generation name is required',
    v => v.length >= 2 || 'At least 2 characters'
]

onMounted(async () => {
    await fetchGenerations()
})

const fetchGenerations = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/generations/')
        generations.value = response.data.data || response.data || []
    } catch (error) {
        console.error('Error fetching generations:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch generations' })
    }
}

const filteredGenerations = computed(() => {
    if (!searchQuery.value) return generations.value
    const q = searchQuery.value.toLowerCase()
    return generations.value.filter(g => g.generation?.toLowerCase().includes(q))
})

const openCreateDialog = () => {
    isEdit.value = false
    Object.assign(formData, { generation: '', start_year: null, end_year: null, active: true })
    dialogOpen.value = true
}

const openEditDialog = (gen) => {
    isEdit.value = true
    selectedGeneration.value = gen
    Object.assign(formData, {
        generation: gen.generation,
        start_year: gen.start_year,
        end_year: gen.end_year,
        active: gen.active === 1
    })
    dialogOpen.value = true
=======
import { useGenerationStore } from '~/store/useGenerationStore'
import { storeToRefs } from 'pinia'
import ExportButtons from '~/components/ui/ExportButtons.vue'
import ImportCsv from '~/components/ui/ImportCsv.vue'

definePageMeta({
    middleware: ['auth'],
    layout: 'admin'
})

// Store
const generationStore = useGenerationStore()
const { generations, loading } = storeToRefs(generationStore)

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('All')
const sortOrder = ref('Newest')
const dialogOpen = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const selectedGeneration = ref(null)
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
    generation: '',
    start_year: null,
    end_year: null,
    active: 1
})

// Export/Import Configuration
const exportColumns = [
    { key: 'global_id', header: 'Global ID', width: 15 },
    { key: 'generation', header: 'Generation Name', width: 25 },
    { key: 'start_year', header: 'Start Year', width: 12, format: 'number' },
    { key: 'end_year', header: 'End Year', width: 12, format: 'number' },
    { key: 'active', header: 'Status', width: 12, format: 'status' },
    { key: 'created_at', header: 'Created At', width: 20, format: 'datetime' },
    { key: 'updated_at', header: 'Updated At', width: 20, format: 'datetime' }
]

const importColumns = [
    { key: 'global_id', header: 'Global ID' },
    { key: 'generation', header: 'Generation Name' },
    { key: 'start_year', header: 'Start Year', format: 'number' },
    { key: 'end_year', header: 'End Year', format: 'number' },
    { key: 'active', header: 'Status', format: 'status' }
]

// Computed properties
const activeGenerations = computed(() => generations.value.filter(g => g.active === 1))
const inactiveGenerations = computed(() => generations.value.filter(g => g.active === 0))

const filteredGenerations = computed(() => {
    let result = [...generations.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(g =>
            g.generation.toLowerCase().includes(query) ||
            g.global_id.toLowerCase().includes(query) ||
            (g.start_year && g.start_year.toString().includes(query)) ||
            (g.end_year && g.end_year.toString().includes(query))
        )
    }

    // Status filter
    if (statusFilter.value !== 'All') {
        const isActive = statusFilter.value === 'Active' ? 1 : 0
        result = result.filter(g => g.active === isActive)
    }

    // Sort
    if (sortOrder.value === 'A-Z') {
        result.sort((a, b) => a.generation.localeCompare(b.generation))
    } else if (sortOrder.value === 'Z-A') {
        result.sort((a, b) => b.generation.localeCompare(a.generation))
    } else if (sortOrder.value === 'Newest') {
        result.sort((a, b) => (b.start_year || 0) - (a.start_year || 0))
    } else if (sortOrder.value === 'Oldest') {
        result.sort((a, b) => (a.start_year || 0) - (b.start_year || 0))
    }

    return result
})

const totalPages = computed(() => Math.ceil(filteredGenerations.value.length / itemsPerPage.value))

const paginatedGenerations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredGenerations.value.slice(start, end)
})

// Options
const statusOptions = ['All', 'Active', 'Inactive']
const sortOptions = ['A-Z', 'Z-A', 'Newest', 'Oldest']
const statusItems = [
    { text: 'Active', value: 1 },
    { text: 'Inactive', value: 0 }
]

// Validation rules
const globalIdRules = [
    (v) => !!v || 'Global ID is required',
    (v) => /^GEN-\d{3}$/.test(v) || 'Global ID must be in format: GEN-001'
]

const generationRules = [
    (v) => !!v || 'Generation name is required',
    (v) => v.length >= 3 || 'Generation name must be at least 3 characters',
    (v) => v.length <= 100 || 'Generation name must not exceed 100 characters'
]

const startYearRules = [
    (v) => {
        if (!v) return true // Optional field
        return (v >= 2000 && v <= 2100) || 'Start year must be between 2000 and 2100'
    }
]

const endYearRules = [
    (v) => {
        if (!v) return true // Optional field
        if (v < 2000 || v > 2100) return 'End year must be between 2000 and 2100'
        if (formData.start_year && v < formData.start_year) {
            return 'End year must be greater than or equal to start year'
        }
        return true
    }
]

// Export Handlers
const handleExportStart = (type) => {
    console.log(`Starting ${type} export...`)
}

const handleExportComplete = (type) => {
    showSnackbar(`Successfully exported to ${type.toUpperCase()}!`, 'success')
}

const handleExportError = ({ type, error }) => {
    console.error(`Export error (${type}):`, error)
    showSnackbar(`Failed to export to ${type.toUpperCase()}`, 'error')
}

// Import Handlers
const handleImportStart = () => {
    console.log('Starting CSV import...')
}

const handleImportComplete = async (rows) => {
    console.log('Importing rows:', rows)

    let successCount = 0
    let errorCount = 0

    for (const row of rows) {
        try {
            await generationStore.createGeneration(row)
            successCount++
        } catch (error) {
            console.error('Failed to import row:', row, error)
            errorCount++
        }
    }

    if (successCount > 0) {
        showSnackbar(
            `Successfully imported ${successCount} generation(s)${errorCount > 0 ? `, ${errorCount} failed` : ''}!`,
            errorCount > 0 ? 'warning' : 'success'
        )
    } else {
        showSnackbar('Failed to import generations', 'error')
    }
}

const handleImportError = ({ error }) => {
    console.error('Import error:', error)
    showSnackbar('Failed to import CSV file', 'error')
}

// Validate imported row
const validateImportRow = (row, rowNumber) => {
    // Validate Global ID format
    if (!row.global_id || !/^GEN-\d{3}$/.test(row.global_id)) {
        return {
            valid: false,
            error: 'Invalid Global ID format (must be GEN-001)'
        }
    }

    // Check if Global ID already exists
    if (generations.value.some(g => g.global_id === row.global_id)) {
        return {
            valid: false,
            error: `Global ID ${row.global_id} already exists`
        }
    }

    // Validate Generation Name
    if (!row.generation || row.generation.length < 3) {
        return {
            valid: false,
            error: 'Generation name must be at least 3 characters'
        }
    }

    // Validate years if provided
    if (row.start_year && (row.start_year < 2000 || row.start_year > 2100)) {
        return {
            valid: false,
            error: 'Start year must be between 2000 and 2100'
        }
    }

    if (row.end_year && (row.end_year < 2000 || row.end_year > 2100)) {
        return {
            valid: false,
            error: 'End year must be between 2000 and 2100'
        }
    }

    if (row.start_year && row.end_year && row.end_year < row.start_year) {
        return {
            valid: false,
            error: 'End year must be greater than or equal to start year'
        }
    }

    return { valid: true }
}

// Transform imported row before validation
const transformImportRow = (row) => {
    return {
        ...row,
        // Ensure years are integers or null
        start_year: row.start_year ? parseInt(row.start_year) : null,
        end_year: row.end_year ? parseInt(row.end_year) : null,
        // Ensure active is 0 or 1
        active: row.active === 1 || row.active === '1' ? 1 : 0
    }
}

// Methods
const formatDate = (dateString) => {
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
    formData.generation = ''
    formData.start_year = null
    formData.end_year = null
    formData.active = 1
    dialogOpen.value = true
}

const openEditDialog = (generation) => {
    isEdit.value = true
    selectedGeneration.value = generation

    // Only copy valid model fields
    Object.assign(formData, {
        global_id: generation.global_id,
        generation: generation.generation,
        start_year: generation.start_year,
        end_year: generation.end_year,
        active: generation.active
    })

    dialogOpen.value = true
    viewDialog.value = false
}

const closeDialog = () => {
    dialogOpen.value = false
    isEdit.value = false
    formData.global_id = ''
    formData.generation = ''
    formData.start_year = null
    formData.end_year = null
    formData.active = 1
    selectedGeneration.value = null
    if (formRef.value) {
        formRef.value.reset()
    }
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
}

const submitForm = async () => {
    if (!formValid.value) return
<<<<<<< HEAD
    formLoading.value = true

    try {
        const payload = {
            generation: formData.generation,
            start_year: formData.start_year,
            end_year: formData.end_year,
            active: formData.active ? 1 : 0
        }

        if (isEdit.value) {
            await $AdminPrivateAxios.patch(`/generations/${selectedGeneration.value.global_id}`, payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Generation updated successfully', timer: 2000 })
        } else {
            await $AdminPrivateAxios.post('/generations/', payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Generation created successfully', timer: 2000 })
        }

        await fetchGenerations()
        dialogOpen.value = false
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to save generation' })
=======

    formLoading.value = true

    try {
        // Prepare data with only valid fields
        const dataToSubmit = {
            global_id: formData.global_id,
            generation: formData.generation,
            start_year: formData.start_year || null,
            end_year: formData.end_year || null,
            active: formData.active
        }

        if (isEdit.value && selectedGeneration.value) {
            // Update existing generation
            await generationStore.updateGeneration(selectedGeneration.value.global_id, dataToSubmit)
            showSnackbar('Generation updated successfully!', 'success')
        } else {
            // Create new generation
            await generationStore.createGeneration(dataToSubmit)
            showSnackbar('Generation created successfully!', 'success')
        }

        closeDialog()
    } catch (error) {
        console.error('Form submission error:', error)
        showSnackbar(error.response?.data?.message || 'An error occurred. Please try again.', 'error')
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
    } finally {
        formLoading.value = false
    }
}

<<<<<<< HEAD
const deleteGeneration = async (gen) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Generation?',
        text: `Are you sure you want to delete "${gen.generation}"? This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            await $AdminPrivateAxios.post(`/generations/${gen.global_id}/delete`)
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Generation deleted successfully', timer: 2000 })
            await fetchGenerations()
        } catch (error) {
            console.error('Error deleting generation:', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to delete generation' })
        }
    }
}
=======
const handleView = (generation) => {
    selectedGeneration.value = generation
    viewDialog.value = true
}

const confirmDelete = (generation) => {
    selectedGeneration.value = generation
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedGeneration.value) return

    deleteLoading.value = true

    try {
        await generationStore.deleteGeneration(selectedGeneration.value.global_id)
        showSnackbar('Generation deleted successfully!', 'success')
        deleteDialog.value = false
        selectedGeneration.value = null
    } catch (error) {
        console.error('Delete error:', error)
        showSnackbar(error.response?.data?.message || 'An error occurred. Please try again.', 'error')
    } finally {
        deleteLoading.value = false
    }
}

const generateNextGlobalId = () => {
    if (generations.value.length === 0) return 'GEN-001'

    const ids = generations.value
        .map(g => {
            const parts = g.global_id.split('-')
            return parseInt(parts[1] || '0')
        })
        .filter(id => !isNaN(id))
        .sort((a, b) => b - a)

    const lastId = ids.length > 0 ? ids[0] : 0
    const nextNum = ((lastId ?? 0) + 1).toString().padStart(3, '0')
    return `GEN-${nextNum}`
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

const showSnackbar = (message, color) => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// Watch for search/filter changes to reset pagination
watch([searchQuery, statusFilter, sortOrder], () => {
    currentPage.value = 1
})

// Fetch generations on mount
onMounted(() => {
    generationStore.fetchGenerations()
})
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
</script>

<style scoped>
.generations-page {
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

.modern-menu {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
}

.menu-item {
    padding: 12px 16px;
    border-radius: 8px;
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

.filters-panel {
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #f1f5f9;
}

.filters-content {
    display: flex;
    gap: 24px;
    align-items: center;
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

.generation-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.generation-details {
    flex: 1;
}

.generation-name {
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

.year-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 6px 12px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1e40af;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
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

/* Loading State */
.loading-state {
    text-align: center;
    padding: 64px 32px;
    color: #64748b;
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

.form-field {
    width: 100%;
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

.generation-name {
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
