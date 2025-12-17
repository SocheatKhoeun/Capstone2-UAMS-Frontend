<template>
    <div class="terms-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-calendar-clock" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Term Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Terms</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ terms.length }}</div>
                            <div class="stat-label">Total Terms</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ activeTerms.length }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ inactiveTerms.length }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <!-- Export Button Component -->
                    <ExportButtons :data="filteredTerms" :columns="exportColumns" filename="Terms_Export"
                        @export-start="handleExportStart" @export-complete="handleExportComplete"
                        @export-error="handleExportError" />

                    <!-- Import Button Component -->
                    <ImportCsv :columns="importColumns" :validate-row="validateImportRow"
                        :transform-row="transformImportRow" @import-start="handleImportStart"
                        @import-complete="handleImportComplete" @import-error="handleImportError" />

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" @click="openCreateDialog">
                        Add Term
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
                            <v-icon icon="mdi-calendar-clock" size="20" class="mr-2" />
                            Term Information
                        </h2>
                        <div class="table-subtitle">Manage and organize your academic terms</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search terms..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                class="search-input" clearable />
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
                                            <label class="filter-label">Sort By</label>
                                            <v-select v-model="sortOrder" :items="sortOptions" variant="outlined"
                                                density="compact" hide-details class="filter-select" />
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
                                    <div class="header-content">Term Name</div>
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
                            <tr v-for="(term, index) in paginatedTerms" :key="term.id" class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="term-info">
                                        <div class="term-details">
                                            <div class="term-name">{{ term.term }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip :color="term.active === 1 ? 'success' : 'error'" size="small"
                                        class="status-chip">
                                        <v-icon start size="16">{{ term.active === 1 ? 'mdi-check-circle' :
                                            'mdi-close-circle'
                                            }}</v-icon>
                                        {{ term.active === 1 ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="date-info">{{ formatDate(term.created_at) }}</div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="handleView(term)">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="openEditDialog(term)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon class="action-btn" @click="confirmDelete(term)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredTerms.length === 0" class="empty-state">
                        <v-icon icon="mdi-calendar-clock-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No terms found</h3>
                        <p class="empty-subtitle">
                            Create your first term to get started with academic term management.
                        </p>
                        <v-btn color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start>mdi-plus</v-icon>
                            Add Term
                        </v-btn>
                    </div>

                    <!-- Pagination Footer -->
                    <div v-if="filteredTerms.length > 0" class="pagination-section">
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
            <v-card class="modern-dialog" elevation="24" v-if="selectedTerm">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-calendar-clock" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Term Details</h2>
                            <p class="dialog-subtitle">{{ selectedTerm.term }}</p>
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
                                    <div class="detail-label">Term ID</div>
                                    <div class="detail-value">{{ selectedTerm.id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Term Name</div>
                                    <div class="detail-value">{{ selectedTerm.term }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">
                                        <v-chip :color="selectedTerm.active === 1 ? 'success' : 'error'" size="small">
                                            {{ selectedTerm.active === 1 ? 'Active' : 'Inactive' }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Created At</div>
                                    <div class="detail-value">{{ formatDate(selectedTerm.created_at) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Updated At</div>
                                    <div class="detail-value">{{ formatDate(selectedTerm.updated_at) }}</div>
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
                                    <div class="detail-label">Total Course Offerings</div>
                                    <div class="detail-value">0</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Active Sessions</div>
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
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

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
                            <h2 class="dialog-title">{{ isEdit ? 'Edit Term' : 'Add New Term' }}</h2>
                            <p class="dialog-subtitle">{{ isEdit ? 'Update term information' : 'Create a new term' }}
                            </p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <TermForm ref="termFormRef" v-model="formData" :is-edit="isEdit" :loading="formLoading"
                        @submit="handleFormSubmit" @cancel="closeDialog" />
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
                    <h2 class="delete-title">Delete Term</h2>
                    <p class="delete-subtitle">This action cannot be undone</p>
                </div>

                <v-divider />

                <!-- Delete Content -->
                <v-card-text class="delete-content">
                    <div class="warning-box">
                        <v-icon icon="mdi-alert-circle" color="warning" class="warning-icon" />
                        <div class="warning-text">
                            <p class="warning-message">
                                You are about to permanently delete the term
                                <strong class="term-name">{{ selectedTerm?.term }}</strong>
                            </p>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Delete Actions -->
                <v-card-actions class="delete-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="deleteDialog = false"
                        :disabled="deleteLoading" class="action-btn cancel-btn">
                        <v-icon start>mdi-cancel</v-icon>
                        Cancel
                    </v-btn>

                    <v-btn color="error" variant="flat" @click="handleDelete" :loading="deleteLoading"
                        class="action-btn delete-btn">
                        <v-icon start>mdi-delete</v-icon>
                        Delete Term
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
import ExportButtons from '~/components/ui/ExportButtons.vue'
import ImportCsv from '~/components/ui/ImportCsv.vue'
import TermForm from '~/components/admin/TermForm.vue'
import { useTermStore } from '~/store/useTermStore'

definePageMeta({
    middleware: ['auth'],
    layout: 'admin'
})

// Initialize store
const termStore = useTermStore()

// Access store data with proper typing
const terms = computed<any[]>(() => termStore.terms || [])

// Fetch data on mount
onMounted(async () => {
    await termStore.fetchTerms()
})

// Reactive data
const searchQuery = ref('')
const statusFilter = ref('All')
const sortOrder = ref('A-Z')
const dialogOpen = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const selectedTerm = ref<Record<string, any> | null>(null)
const isEdit = ref(false)
const termFormRef = ref(null)
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
    term: '',
    active: 1
})

// Export/Import Configuration
const exportColumns = [
    { key: 'global_id', header: 'Global ID', width: 15 },
    { key: 'term', header: 'Term Name', width: 30 },
    { key: 'active', header: 'Status', width: 12, format: 'status' },
    { key: 'created_at', header: 'Created At', width: 20, format: 'datetime' },
    { key: 'updated_at', header: 'Updated At', width: 20, format: 'datetime' }
]

const importColumns = [
    { key: 'global_id', header: 'Global ID' },
    { key: 'term', header: 'Term Name' },
    { key: 'active', header: 'Status', format: 'status' }
]

// Computed properties
const activeTerms = computed(() => terms.value.filter(t => t.active === 1))
const inactiveTerms = computed(() => terms.value.filter(t => t.active === 0))

const filteredTerms = computed(() => {
    let result = [...terms.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(t =>
            t.term.toLowerCase().includes(query) ||
            t.global_id.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (statusFilter.value !== 'All') {
        const isActive = statusFilter.value === '1' ? 1 : 0
        result = result.filter(t => t.active === isActive)
    }

    // Sort
    if (sortOrder.value === 'A-Z') {
        result.sort((a, b) => a.term.localeCompare(b.term))
    } else if (sortOrder.value === 'Z-A') {
        result.sort((a, b) => b.term.localeCompare(a.term))
    } else if (sortOrder.value === 'Newest') {
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
    } else if (sortOrder.value === 'Oldest') {
        result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
    }

    return result
})

const totalPages = computed(() => Math.ceil(filteredTerms.value.length / itemsPerPage.value))

const paginatedTerms = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredTerms.value.slice(start, end)
})

// Options
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

    if (!row.global_id || !/^TERM-\d{3}$/.test(row.global_id)) {
        errors.push(`Row ${rowIndex + 1}: Invalid Global ID format (should be TERM-001)`)
    }

    if (!row.term || row.term.length < 3) {
        errors.push(`Row ${rowIndex + 1}: Term name is required and must be at least 3 characters`)
    }

    return errors
}

const transformImportRow = (row: any) => {
    return {
        global_id: row.global_id?.trim(),
        term: row.term?.trim(),
        active: row.active === '1' || row.active === 1 || row.active?.toLowerCase() === 'active' ? 1 : 0
    }
}

const handleImportStart = () => {
    showSnackbar('Processing import...', 'info')
}

const handleImportComplete = async (data: any[]) => {
    try {
        // Import each term through the API
        const importPromises = data.map(item =>
            termStore.createTerm(item)
        )

        await Promise.all(importPromises)

        // Refresh the list
        await termStore.fetchTerms()

        showSnackbar(`Successfully imported ${data.length} term(s)!`, 'success')
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'Failed to import some terms'
        showSnackbar(errorMessage, 'error')
    }
}

const handleImportError = (error: any) => {
    console.error('Import error:', error)
    showSnackbar('Failed to import data. Please check the file format.', 'error')
}

// Methods
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
    formData.term = ''
    formData.active = 1
    dialogOpen.value = true
}

const openEditDialog = (term: any) => {
    isEdit.value = true
    selectedTerm.value = term
    Object.assign(formData, {
        global_id: term.global_id,
        term: term.term,
        active: term.active
    })
    dialogOpen.value = true
    viewDialog.value = false
}

const closeDialog = () => {
    dialogOpen.value = false
    isEdit.value = false
    formData.global_id = ''
    formData.term = ''
    formData.active = 1
    selectedTerm.value = null
    if (termFormRef.value) {
        (termFormRef.value as any).reset()
    }
}

const handleFormSubmit = async (data: any) => {
    formLoading.value = true

    try {
        if (isEdit.value && selectedTerm.value) {
            // Update existing term
            await termStore.updateTerm(selectedTerm.value.global_id, {
                term: data.term,
                active: data.active
            })
            showSnackbar('Term updated successfully!', 'success')
        } else {
            // Create new term
            await termStore.createTerm({
                global_id: data.global_id,
                term: data.term,
                active: data.active
            })
            showSnackbar('Term created successfully!', 'success')
        }

        closeDialog()
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
        showSnackbar(errorMessage, 'error')
    } finally {
        formLoading.value = false
    }
}

const handleView = (term: any) => {
    selectedTerm.value = term
    viewDialog.value = true
}

const confirmDelete = (term: any) => {
    selectedTerm.value = term
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedTerm.value) return

    deleteLoading.value = true

    try {
        await termStore.deleteTerm(selectedTerm.value.global_id)
        showSnackbar('Term deleted successfully!', 'success')
        deleteDialog.value = false
        selectedTerm.value = null
    } catch (error: any) {
        const errorMessage = error.response?.data?.message || error.message || 'An error occurred. Please try again.'
        showSnackbar(errorMessage, 'error')
    } finally {
        deleteLoading.value = false
    }
}

const generateNextGlobalId = () => {
    if (terms.value.length === 0) return 'TERM-001'

    const ids = terms.value
        .map(t => {
            const parts = t.global_id.split('-')
            return parseInt(parts[1] || '0')
        })
        .filter(id => !isNaN(id))
        .sort((a, b) => b - a)

    const lastId = ids.length > 0 ? ids[0] : 0
    const nextNum = ((lastId ?? 0) + 1).toString().padStart(3, '0')
    return `TERM-${nextNum}`
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
watch([searchQuery, statusFilter, sortOrder], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.terms-page {
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

.term-info {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 12px;
}

.term-details {
    flex: 1;
}

.term-name {
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

.dialog-content {
    padding: 24px !important;
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

.term-name {
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
}
</style>