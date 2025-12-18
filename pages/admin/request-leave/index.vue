<!-- filepath: e:\CADT Year4\Capstone II\Full-Stack\Capstone2-UAMS-Frontend\pages\admin\request-leave\index.vue -->
<template>
    <div class="request-leave-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-calendar-clock" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Leave Requests Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Leave Requests</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ leaveRequests?.length || 0 }}</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{leaveRequests?.filter(r => r.status === 'Pending').length || 0
                            }}</div>
                            <div class="stat-label">Pending</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{leaveRequests?.filter(r => r.status === 'Approved').length || 0
                            }}</div>
                            <div class="stat-label">Approved</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{leaveRequests?.filter(r => r.status === 'Rejected').length || 0
                            }}</div>
                            <div class="stat-label">Rejected</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <!-- Export Button Component -->
                    <ExportButtons :data="filteredGroups" :columns="exportColumns" filename="Groups_Export"
                        @export-start="handleExportStart" @export-complete="handleExportComplete"
                        @export-error="handleExportError" />

                    <!-- Import Button Component -->
                    <ImportCsv :columns="importColumns" :validate-row="validateImportRow"
                        :transform-row="transformImportRow" @import-start="handleImportStart"
                        @import-complete="handleImportComplete" @import-error="handleImportError" />
                </div>
            </div>
        </div>

        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <!-- Loading State -->
            <div v-if="loading || storeLoading" class="loading-state">
                <v-progress-circular indeterminate color="primary" size="64" />
                <p class="loading-text">Loading leave requests...</p>
            </div>

            <div v-else class="table-container">
                <!-- Table Header with Search and Filters -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-format-list-bulleted" size="20" class="mr-2" />
                            Leave Requests
                        </h2>
                        <div class="table-subtitle">View and monitor all leave requests</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search by student name, ID, or reason..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable"
                                class="search-input" clearable />
                        </div>

                        <v-select v-model="statusFilter" :items="statusOptions" label="Status" variant="outlined"
                            density="comfortable" class="filter-select" />

                        <v-select v-model="leaveTypeFilter" :items="leaveTypeOptions" label="Leave Type"
                            variant="outlined" density="comfortable" class="filter-select" />

                        <v-select v-model="tableSortOrder" :items="tableSortOptions" label="Sort by" variant="outlined"
                            density="comfortable" class="sort-select" />

                        <v-btn icon="mdi-filter-variant" variant="outlined" class="filter-btn"
                            @click="showFilters = !showFilters" :color="showFilters ? 'primary' : 'grey'" />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <div class="filter-label">Duration</div>
                                <v-select v-model="durationFilter" :items="durationOptions" variant="outlined"
                                    density="comfortable" class="filter-input" />
                            </div>
                            <div class="filter-group">
                                <div class="filter-label">Date Range</div>
                                <v-text-field v-model="dateRangeFilter" type="date" variant="outlined"
                                    density="comfortable" class="filter-input" />
                            </div>
                            <div class="filter-group">
                                <div class="filter-label">Generation</div>
                                <v-select v-model="generationFilter" :items="generationOptions" variant="outlined"
                                    density="comfortable" class="filter-input" />
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
                                <th class="modern-header-cell">
                                    <div class="header-content">Student</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Leave Type</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Duration</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Requested On</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="request in paginatedLeaveRequests" :key="request.leave_id"
                                class="modern-table-row">
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">{{ request.leave_id }}</div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="student-info">
                                        <div class="student-avatar">
                                            {{ request.student_name?.charAt(0)?.toUpperCase() }}
                                        </div>
                                        <div class="student-details">
                                            <div class="student-name">{{ request.student_name }}</div>
                                            <div class="student-meta">ID: {{ request.student_id }} • Gen {{
                                                request.generation
                                            }}</div>
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip :color="getLeaveTypeColor(request.leave_type)" variant="flat" size="small"
                                        class="leave-type-chip">
                                        <v-icon :icon="getLeaveTypeIcon(request.leave_type)" start size="16" />
                                        {{ request.leave_type }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="duration-info">
                                        <div class="duration-primary">{{ request.duration_days }} {{
                                            request.duration_days === 1
                                                ? 'day' : 'days' }}</div>
                                        <div class="duration-secondary">{{ formatDate(request.start_date) }} - {{
                                            formatDate(request.end_date) }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <v-chip :color="getStatusColor(request.status)" variant="tonal" size="small"
                                        class="status-chip">
                                        <v-icon :icon="getStatusIcon(request.status)" start size="16" />
                                        {{ request.status }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="date-info">
                                        <div class="date-primary">{{ formatDate(request.created_on) }}</div>
                                        <div class="date-secondary">{{ formatTime(request.created_on) }}</div>
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn icon class="action-btn" @click="viewRequest(request)" size="small">
                                            <v-icon color="#3b82f6">mdi-eye</v-icon>
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredLeaveRequests.length === 0" class="empty-state">
                        <v-icon icon="mdi-calendar-clock-outline" size="64" color="grey-lighten-1" />
                        <h3 class="empty-title">No leave requests found</h3>
                        <p class="empty-subtitle">
                            {{ searchQuery ? 'Try adjusting your search criteria or filters.' : 'No leave requests have been submitted yet.' }}
                        </p>
                    </div>

                    <!-- Pagination Footer -->
                    <div v-if="filteredLeaveRequests.length > 0" class="pagination-section">
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

        <!-- View Request Dialog -->
        <v-dialog v-model="viewDialog" max-width="700" persistent>
            <v-card class="modern-dialog" elevation="24">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon icon="mdi-calendar-clock" color="primary" size="24" />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Leave Request Details</h2>
                            <p class="dialog-subtitle">Request ID: {{ selectedRequest?.leave_id }}</p>
                        </div>
                    </div>
                    <v-btn icon="mdi-close" variant="text" size="small" @click="closeViewDialog" class="close-btn" />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content" v-if="selectedRequest">
                    <div class="request-details">
                        <!-- Student Information -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-view-grid" color="primary" />
                                Student Information
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Student Name</div>
                                    <div class="detail-value">{{ selectedRequest.student_name }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Student ID</div>
                                    <div class="detail-value">{{ selectedRequest.student_id }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Generation</div>
                                    <div class="detail-value">{{ selectedRequest.generation }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Specialization</div>
                                    <div class="detail-value">{{ selectedRequest.specialize }}</div>
                                </div>
                            </div>
                        </div>

                        <!-- Leave Details -->
                        <div class="detail-section">
                            <div class="section-title">
                                <v-icon icon="mdi-calendar-clock" color="warning" />
                                Leave Details
                            </div>
                            <div class="detail-grid">
                                <div class="detail-item">
                                    <div class="detail-label">Leave Type</div>
                                    <div class="detail-value">
                                        <v-chip :color="getLeaveTypeColor(selectedRequest.leave_type)" variant="flat"
                                            size="small">
                                            <v-icon :icon="getLeaveTypeIcon(selectedRequest.leave_type)" start
                                                size="16" />
                                            {{ selectedRequest.leave_type }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Status</div>
                                    <div class="detail-value">
                                        <v-chip :color="getStatusColor(selectedRequest.status)" variant="flat"
                                            size="small">
                                            <v-icon :icon="getStatusIcon(selectedRequest.status)" start size="16" />
                                            {{ selectedRequest.status }}
                                        </v-chip>
                                    </div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Start Date</div>
                                    <div class="detail-value">{{ formatDate(selectedRequest.start_date) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">End Date</div>
                                    <div class="detail-value">{{ formatDate(selectedRequest.end_date) }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Duration</div>
                                    <div class="detail-value">{{ selectedRequest.duration_days }} {{
                                        selectedRequest.duration_days === 1 ? 'day' : 'days' }}</div>
                                </div>
                                <div class="detail-item">
                                    <div class="detail-label">Requested On</div>
                                    <div class="detail-value">{{ formatDate(selectedRequest.created_on) }}</div>
                                </div>
                                <div class="detail-item full-width">
                                    <div class="detail-label">Reason</div>
                                    <div class="detail-value">{{ selectedRequest.reason || 'No reason provided' }}</div>
                                </div>
                                <div class="detail-item full-width" v-if="selectedRequest.notes">
                                    <div class="detail-label">Additional Notes</div>
                                    <div class="detail-value">{{ selectedRequest.notes }}</div>
                                </div>
                                <div class="detail-item full-width"
                                    v-if="selectedRequest.status === 'Approved' && selectedRequest.approved_by">
                                    <div class="detail-label">Approved By</div>
                                    <div class="detail-value">{{ selectedRequest.approved_by }}</div>
                                </div>
                                <div class="detail-item full-width"
                                    v-if="selectedRequest.status === 'Rejected' && selectedRequest.rejection_reason">
                                    <div class="detail-label">Rejection Reason</div>
                                    <div class="detail-value rejected-reason">{{ selectedRequest.rejection_reason }}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-spacer />
                    <v-btn variant="outlined" color="grey-darken-1" @click="closeViewDialog" class="action-btn">
                        <v-icon start>mdi-close</v-icon>
                        Close
                    </v-btn>

                    <v-btn color="primary" variant="flat" @click="downloadRequest(selectedRequest)" class="action-btn">
                        <v-icon start>mdi-download</v-icon>
                        Download
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    // middleware: ['auth', 'role-admin'] // Uncomment if you want to enable middleware
})

import { ref, computed, watch, onMounted } from 'vue'
import { useRequestLeaveStore } from '@/store/useRequestLeaveStore'
import { storeToRefs } from 'pinia'
import ExportButtons from '@/components/ui/ExportButtons.vue'

// Import composables
const { exportToExcel, exportToPDF } = useExport()

// Initialize store
const requestLeaveStore = useRequestLeaveStore()
const { leaveRequests, loading: storeLoading, error } = storeToRefs(requestLeaveStore)

const loading = ref(false)
const searchQuery = ref('')
const statusFilter = ref('All')
const leaveTypeFilter = ref('All')
const durationFilter = ref('All')
const dateRangeFilter = ref('')
const generationFilter = ref('All')
const tableSortOrder = ref('Newest')
const viewDialog = ref(false)
const selectedRequest = ref(null)
const showFilters = ref(false)
const currentPage = ref(1)
const itemsPerPage = ref(10)

// Filter options
const statusOptions = [
    { title: 'All', value: 'All' },
    { title: 'Pending', value: 'Pending' },
    { title: 'Approved', value: 'Approved' },
    { title: 'Rejected', value: 'Rejected' }
]

const exportColumns = [
  { key: 'leave_id', header: 'Leave ID' },
  { key: 'student_name', header: 'Student Name' },
  { key: 'student_id', header: 'Student ID' },
  { key: 'generation', header: 'Generation' },
  { key: 'specialize', header: 'Specialization' },
  { key: 'leave_type', header: 'Leave Type' },
  { key: 'reason', header: 'Reason' },
  { key: 'start_date', header: 'Start Date', format: 'date' },
  { key: 'end_date', header: 'End Date', format: 'date' },
  { key: 'duration_days', header: 'Duration' },
  { key: 'status', header: 'Status' },
  { key: 'created_on', header: 'Requested On', format: 'date' },
  { key: 'approved_by', header: 'Approved By' },
  { key: 'notes', header: 'Notes' }
]

const leaveTypeOptions = [
    'All', 'Sick Leave', 'Medical Leave', 'Personal Leave', 'Emergency Leave', 'Family Leave'
]

const durationOptions = [
    'All', '1 day', '2-3 days', '4-7 days', 'More than 1 week'
]

const generationOptions = [
    'All', '8', '9', '10', '11', '12'
]

const tableSortOptions = [
    'Newest', 'Oldest', 'A-Z', 'Z-A'
]

// Computed filtered requests
const filteredLeaveRequests = computed(() => {
    let filtered = [...leaveRequests.value]

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        filtered = filtered.filter(request =>
            request.student_name?.toLowerCase().includes(query) ||
            request.student_id?.toLowerCase().includes(query) ||
            request.reason?.toLowerCase().includes(query) ||
            request.leave_type?.toLowerCase().includes(query)
        )
    }

    // Status filter
    if (statusFilter.value !== 'All') {
        filtered = filtered.filter(request => request.status === statusFilter.value)
    }

    // Leave type filter
    if (leaveTypeFilter.value !== 'All') {
        filtered = filtered.filter(request => request.leave_type === leaveTypeFilter.value)
    }

    // Duration filter
    if (durationFilter.value !== 'All') {
        filtered = filtered.filter(request => {
            const days = request.duration_days
            switch (durationFilter.value) {
                case '1 day':
                    return days === 1
                case '2-3 days':
                    return days >= 2 && days <= 3
                case '4-7 days':
                    return days >= 4 && days <= 7
                case 'More than 1 week':
                    return days > 7
                default:
                    return true
            }
        })
    }

    // Generation filter
    if (generationFilter.value !== 'All') {
        filtered = filtered.filter(request => request.generation.toString() === generationFilter.value)
    }

    // Sort
    filtered.sort((a, b) => {
        switch (tableSortOrder.value) {
            case 'Newest':
                return new Date(b.created_on) - new Date(a.created_on)
            case 'Oldest':
                return new Date(a.created_on) - new Date(b.created_on)
            case 'A-Z':
                return a.student_name?.localeCompare(b.student_name) || 0
            case 'Z-A':
                return b.student_name?.localeCompare(a.student_name) || 0
            default:
                return 0
        }
    })

    return filtered
})

// Pagination computed properties
const totalPages = computed(() => Math.ceil(filteredLeaveRequests.value.length / itemsPerPage.value))

const paginatedLeaveRequests = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredLeaveRequests.value.slice(start, end)
})

// Utility functions
const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric'
        })
    } catch (error) {
        return 'Invalid Date'
    }
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return ''
    }
}

const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return 'success'
        case 'rejected':
            return 'error'
        case 'pending':
            return 'warning'
        default:
            return 'grey'
    }
}

const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
        case 'approved':
            return 'mdi-check-circle'
        case 'rejected':
            return 'mdi-close-circle'
        case 'pending':
            return 'mdi-clock'
        default:
            return 'mdi-help-circle'
    }
}

const getLeaveTypeColor = (leaveType) => {
    // Return light blue for all leave types
    return 'light-blue'
}

const getLeaveTypeIcon = (leaveType) => {
    switch (leaveType?.toLowerCase()) {
        case 'sick leave':
            return 'mdi-thermometer'
        case 'medical leave':
            return 'mdi-medical-bag'
        case 'personal leave':
            return 'mdi-account'
        case 'emergency leave':
            return 'mdi-alert'
        case 'family leave':
            return 'mdi-account-group'
        default:
            return 'mdi-calendar'
    }
}

// Dialog methods
const viewRequest = (request) => {
    selectedRequest.value = request
    viewDialog.value = true
}

const closeViewDialog = () => {
    viewDialog.value = false
    selectedRequest.value = null
}

// Action methods
const refreshData = async () => {
    loading.value = true
    try {
        await requestLeaveStore.fetchLeaveRequests()
    } catch (error) {
        console.error('Failed to refresh data:', error)
    } finally {
        loading.value = false
    }
}

// Fetch data on mount
onMounted(async () => {
    await refreshData()
})

const downloadRequest = (request) => {
    // Implement download functionality
    console.log('Downloading request:', request.leave_id)
}

// Export functions
const handleExportExcel = () => {
    try {
        const exportData = filteredLeaveRequests.value.map(request => ({
            'Leave ID': request.leave_id,
            'Student Name': request.student_name,
            'Student ID': request.student_id,
            'Generation': request.generation,
            'Specialization': request.specialize,
            'Leave Type': request.leave_type,
            'Reason': request.reason,
            'Start Date': formatDate(request.start_date),
            'End Date': formatDate(request.end_date),
            'Duration': `${request.duration_days} ${request.duration_days === 1 ? 'day' : 'days'}`,
            'Status': request.status,
            'Requested On': formatDate(request.created_on),
            'Approved By': request.approved_by || 'N/A',
            'Notes': request.notes || 'N/A'
        }))

        exportToExcel(exportData, 'leave_requests')
        alert('Leave requests exported to Excel successfully!')
    } catch (error) {
        alert('Export failed: ' + error.message)
    }
}

const handleExportPDF = () => {
    try {
        const exportData = filteredLeaveRequests.value.map(request => ({
            leave_id: request.leave_id,
            student_name: request.student_name,
            student_id: request.student_id,
            leave_type: request.leave_type,
            duration_days: request.duration_days,
            status: request.status,
            created_on: formatDate(request.created_on)
        }))

        exportToPDF(exportData, 'leave_requests')
        alert('Leave requests exported to PDF successfully!')
    } catch (error) {
        alert('Export failed: ' + error.message)
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
watch([searchQuery, statusFilter, leaveTypeFilter, durationFilter, generationFilter, tableSortOrder], () => {
    currentPage.value = 1
})
</script>

<style scoped>
.request-leave-page {
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
    gap: 8px;
}

.title-icon {
    color: #3b82f6;
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
    min-width: 140px;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
}

.sort-select {
    min-width: 120px;
}

.sort-select :deep(.v-field) {
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

.filter-input {
    min-width: 150px;
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
    padding: 20px 16px;
    border: none;
    position: relative;
    text-align: left !important;
}

.modern-header-cell.center-align {
    text-align: center !important;
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

.modern-table-cell.center-align {
    text-align: center !important;
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

.student-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.student-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
    font-weight: 600;
    font-size: 16px;
}

.student-details {
    flex: 1;
}

.student-name {
    font-weight: 600;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.student-meta {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.leave-type-chip {
    text-transform: none;
    font-weight: 500;
    background-color: #e3f2fd !important;
    color: #1565c0 !important;
}

.duration-info {
    text-align: left;
}

.duration-primary {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.duration-secondary {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.status-chip {
    text-transform: none;
    font-weight: 500;
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
    max-height: 500px;
    overflow-y: auto;
}

.request-details {
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
    grid-template-columns: 1fr 1fr;
    gap: 16px;
}

.detail-item {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.detail-item.full-width {
    grid-column: 1 / -1;
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

.rejected-reason {
    color: #dc2626;
    padding: 8px 12px;
    background: #fee2e2;
    border-radius: 6px;
    border: 1px solid #fca5a5;
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
        min-width: 1000px;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }

    .detail-item.full-width {
        grid-column: 1;
    }
}

/* Animation for dialogs */
.modern-dialog {
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
