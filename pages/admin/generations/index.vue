<template>
    <div class="generations-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-calendar-clock" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Generation Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
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
                            <div class="stat-number">{{ generations.filter(g => g.active).length }}</div>
                            <div class="stat-label">Active</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ generations.filter(g => !g.active).length }}</div>
                            <div class="stat-label">Inactive</div>
                        </div>
                    </div>
                </div>
                <div class="action-section">
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Generation
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
                            Generation Information
                        </h2>
                        <div class="table-subtitle">Manage and organize student generations</div>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search generations..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                class="search-input" clearable />
                        </div>

                        <!-- Filter Menu -->
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
                    <v-table class="modern-table" fixed-header height="500">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell text-left id-column">
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell text-left">
                                    <div class="header-content">Generation Name</div>
                                </th>
                                <th class="modern-header-cell text-left">
                                    <div class="header-content">Start Year</div>
                                </th>
                                <th class="modern-header-cell text-left">
                                    <div class="header-content">End Year</div>
                                </th>
                                <th class="modern-header-cell text-center">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell text-center">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="gen in paginatedGenerations" :key="gen.id" class="modern-table-row">
                                <td class="modern-table-cell text-center id-column">
                                    <span class="id-badge">{{ gen.id }}</span>
                                </td>

                                <td class="modern-table-cell">
                                    <div class="generation-info">
                                        <span class="generation-avatar">
                                            <v-icon size="22" color="#1d4ed8">mdi-calendar-clock</v-icon>
                                        </span>
                                        <div class="generation-details">
                                            <div class="generation-name">{{ gen.generation }}</div>
                                        </div>
                                    </div>
                                </td>

                                <td class="modern-table-cell">
                                    <span class="year-badge">{{ gen.start_year || 'N/A' }}</span>
                                </td>

                                <td class="modern-table-cell">
                                    <span class="year-badge">{{ gen.end_year || 'N/A' }}</span>
                                </td>

                                <td class="modern-table-cell text-center">
                                    <v-chip :color="gen.active ? 'success' : 'error'" class="status-chip" size="small">
                                        <v-icon start size="16">mdi-check-circle</v-icon>
                                        {{ gen.active ? 'Active' : 'Inactive' }}
                                    </v-chip>
                                </td>

                                <td class="modern-table-cell text-center">
                                    <div class="action-group">
                                        <v-btn icon size="small" class="action-btn" @click="openEditDialog(gen)">
                                            <v-icon color="#fde047">mdi-pencil</v-icon>
                                        </v-btn>
                                        <v-btn icon size="small" class="action-btn" @click="confirmDelete(gen)">
                                            <v-icon color="#dc2626">mdi-delete</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredGenerations.length === 0" class="empty-state">
                        <v-icon icon="mdi-calendar-clock-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No generations found</h3>
                        <p class="empty-subtitle">
                            {{ searchQuery ? 'Try adjusting your search terms' : 'Create your first generation to get started' }}
                        </p>
                        <v-btn v-if="!searchQuery" color="primary" variant="flat" @click="openCreateDialog" class="mt-4">
                            <v-icon start icon="mdi-plus" />
                            Add First Generation
                        </v-btn>
                    </div>

                    <!-- Pagination -->
                    <div v-if="filteredGenerations.length > 0" class="pagination-section">
                        <v-btn variant="outlined" :disabled="currentPage === 1" @click="goToPrevPage" class="pagination-btn">
                            Previous
                        </v-btn>
                        <div class="pagination-info">
                            <span class="pagination-text">Page {{ currentPage }} of {{ totalPages }}</span>
                        </div>
                        <v-btn variant="outlined" :disabled="currentPage >= totalPages" @click="goToNextPage" class="pagination-btn">
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
                    <div class="header-content-dialog">
                        <div class="header-icon-dialog">
                            <v-icon :icon="isEdit ? 'mdi-pencil-circle' : 'mdi-plus-circle'"
                                :color="isEdit ? '#fde047' : 'primary'" size="28" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">
                                {{ isEdit ? 'Edit Generation' : 'Create New Generation' }}
                            </h2>
                            <p class="dialog-subtitle">
                                {{ isEdit ? 'Modify generation information' : 'Add a new generation to the system' }}
                            </p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeDialog" class="close-btn" />
                </div>
                <v-divider />
                <v-card-text class="dialog-content">
                    <v-form ref="formRef" v-model="formValid" @submit.prevent="submitForm">
                        <v-text-field v-model="formData.generation" label="Generation Name *" :rules="nameRules"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.start_year" label="Start Year" type="number"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.end_year" label="End Year" type="number"
                            variant="outlined" density="comfortable" />
                        <v-switch v-model="formData.active" label="Active" color="primary" />
                    </v-form>
                </v-card-text>
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn @click="closeDialog" variant="outlined">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!formValid" :loading="formLoading" @click="submitForm" variant="flat">
                        {{ isEdit ? 'Update' : 'Create' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="500" persistent>
            <v-card class="modern-dialog" elevation="24">
                <div class="dialog-header error">
                    <div class="header-content-dialog">
                        <div class="header-icon-dialog error">
                            <v-icon icon="mdi-alert-circle" color="error" size="28" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Delete Generation</h2>
                            <p class="dialog-subtitle">This action cannot be undone</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="deleteDialog = false" class="close-btn" />
                </div>
                <v-divider />
                <v-card-text class="dialog-content">
                    <p class="confirm-message">
                        Are you sure you want to delete <strong>{{ selectedGeneration?.generation }}</strong>?
                    </p>
                </v-card-text>
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn @click="deleteDialog = false" variant="outlined">Cancel</v-btn>
                    <v-btn color="error" :loading="deleteLoading" @click="handleDelete" variant="flat">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admin'
})

const { $AdminPrivateAxios } = useNuxtApp()

const searchQuery = ref('')
const statusFilter = ref('All')
const showFilters = ref(false)
const dialogOpen = ref(false)
const deleteDialog = ref(false)
const isEdit = ref(false)
const formValid = ref(false)
const formLoading = ref(false)
const deleteLoading = ref(false)
const formRef = ref(null)
const generations = ref([])
const selectedGeneration = ref(null)
const currentPage = ref(1)
const itemsPerPage = ref(10)

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
    let filtered = [...generations.value]

    if (searchQuery.value) {
        const q = searchQuery.value.toLowerCase()
        filtered = filtered.filter(g => 
            g.generation?.toLowerCase().includes(q) ||
            String(g.start_year || '').includes(q) ||
            String(g.end_year || '').includes(q)
        )
    }

    if (statusFilter.value !== 'All') {
        const active = statusFilter.value === '1'
        filtered = filtered.filter(g => !!g.active === active)
    }

    return filtered
})

const totalPages = computed(() =>
    Math.ceil(filteredGenerations.value.length / itemsPerPage.value)
)

const paginatedGenerations = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    return filteredGenerations.value.slice(start, start + itemsPerPage.value)
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
}

const closeDialog = () => {
    dialogOpen.value = false
    selectedGeneration.value = null
}

const submitForm = async () => {
    if (!formValid.value) return
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
        closeDialog()
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to save generation' })
    } finally {
        formLoading.value = false
    }
}

const confirmDelete = (gen) => {
    selectedGeneration.value = gen
    deleteDialog.value = true
}

const handleDelete = async () => {
    if (!selectedGeneration.value) return
    deleteLoading.value = true

    try {
        await $AdminPrivateAxios.post(`/generations/${selectedGeneration.value.global_id}/delete`)
        Swal.fire({ icon: 'success', title: 'Deleted', text: 'Generation deleted successfully', timer: 2000 })
        await fetchGenerations()
        deleteDialog.value = false
        selectedGeneration.value = null
    } catch (error) {
        console.error('Error deleting generation:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to delete generation' })
    } finally {
        deleteLoading.value = false
    }
}

const goToPrevPage = () => currentPage.value > 1 && currentPage.value--
const goToNextPage = () => currentPage.value < totalPages.value && currentPage.value++

watch([searchQuery, statusFilter], () => (currentPage.value = 1))
</script>

<style scoped>
.generations-page {
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
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
}

.title-content {
    flex: 1;
}

.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    font-size: 14px;
}

.breadcrumb-item {
    color: #64748b;
    font-weight: 500;
}

.breadcrumb-item.active {
    color: #1e293b;
    font-weight: 600;
}

.stats-cards {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.stat-card {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
    padding: 20px 24px;
    border-radius: 12px;
    min-width: 140px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.stat-number {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
}

.stat-label {
    font-size: 13px;
    color: #64748b;
    margin-top: 8px;
    font-weight: 500;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.modern-btn {
    text-transform: none;
    font-weight: 600;
    padding: 0 24px;
    height: 44px;
    border-radius: 10px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

/* Modern Table Section */
.modern-table-section {
    max-width: 1400px;
    margin: 24px auto;
    padding: 0 32px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 24px 20px 24px;
    border-bottom: 1px solid #f1f5f9;
}

.toolbar-left {
    flex: 1;
}

.table-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
    display: flex;
    align-items: center;
}

.table-subtitle {
    font-size: 14px;
    color: #64748b;
    margin-top: 4px;
}

.toolbar-right {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-container {
    min-width: 300px;
}

.search-input {
    border-radius: 10px;
}

.filter-btn {
    width: 44px;
    height: 44px;
    border-radius: 10px;
}

.filter-label {
    font-size: 13px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 8px;
    display: block;
}

/* Modern Table */
.modern-table-wrapper {
    background: white;
}

.modern-table {
    width: 100%;
    border-collapse: collapse;
}

.modern-header-row {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border-bottom: 2px solid #e2e8f0;
}

.modern-header-cell {
    padding: 16px;
    text-align: left;
    border: none;
    font-weight: 600;
    color: #475569;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

.generation-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.generation-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
}

.generation-details {
    flex: 1;
}

.generation-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.year-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #1e293b;
    font-weight: 600;
    font-size: 13px;
    border-radius: 8px;
}

.status-chip {
    font-weight: 600;
    text-transform: capitalize;
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
    padding: 24px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
}

.dialog-header.error {
    background: linear-gradient(135deg, #fee2e2 0%, #fecaca 100%);
}

.header-content-dialog {
    display: flex;
    gap: 16px;
    align-items: flex-start;
    flex: 1;
}

.header-icon-dialog {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    border-radius: 12px;
}

.header-icon-dialog.error {
    background: linear-gradient(135deg, #fecaca 0%, #fca5a5 100%);
}

.header-text {
    flex: 1;
}

.dialog-title {
    font-size: 20px;
    font-weight: 700;
    color: #1e293b;
    margin: 0;
    line-height: 1.2;
}

.dialog-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 4px 0 0 0;
}

.close-btn {
    opacity: 0.7;
}

.close-btn:hover {
    opacity: 1;
}

.dialog-content {
    padding: 24px !important;
}

.confirm-message {
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
}

.dialog-actions {
    padding: 16px 24px !important;
    background: #f8fafc;
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
    .header-container,
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
