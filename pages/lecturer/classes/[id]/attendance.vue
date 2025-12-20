

<template>
    <div class="class-detail-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-google-classroom" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">{{ classInfo?.name || 'Class Details' }}</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item" @click="goBack" style="cursor: pointer; color: #1976d2;">Lecturer</span>
                                <v-icon size="16" class="breadcrumb-divider">mdi-chevron-right</v-icon>
                                <span class="breadcrumb-item">Attendance</span>
                                <v-icon size="16" class="breadcrumb-divider">mdi-chevron-right</v-icon>
                                <span class="breadcrumb-item active">{{ classInfo?.code || 'Class' }}</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ classInfo?.total_students || 0 }}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ classInfo?.present_today || 0 }}</div>
                            <div class="stat-label">Present</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ classInfo?.absent_today || 0 }}</div>
                            <div class="stat-label">Absent</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ classInfo?.attendance_rate || 0 }}%</div>
                            <div class="stat-label">Rate</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn export-btn" prepend-icon="mdi-download" variant="outlined" v-bind="props">
                                Export
                                <v-icon size="16">mdi-chevron-down</v-icon>
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item" @click="exportData('pdf')">
                                <v-list-item-title>Export as PDF</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="menu-item" @click="exportData('excel')">
                                <v-list-item-title>Export as Excel</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn 
                        class="modern-btn refresh-btn" 
                        prepend-icon="mdi-refresh" 
                        variant="flat" 
                        color="primary"
                        @click="refreshData" 
                        :loading="loading" 
                        elevation="2"
                    >
                        Refresh Data
                    </v-btn>
                    
                    <v-btn 
                        class="modern-btn analytics-btn" 
                        prepend-icon="mdi-chart-line" 
                        variant="outlined"
                        @click="viewAnalytics"
                    >
                        Analytics
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Table Header -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-calendar-clock" size="20" class="mr-2" />
                            Recent Attendance Sessions
                        </h2>
                        <div class="table-subtitle">Track attendance history and session details for {{ classInfo?.name }}</div>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field 
                                v-model="searchQuery"
                                placeholder="Search sessions..."
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                density="compact"
                                hide-details
                                clearable
                                class="search-input"
                            />
                        </div>
                    </div>
                </div>

                <v-card elevation="2" class="modern-table-card">
                    <v-data-table 
                        :headers="sessionHeaders" 
                        :items="filteredSessions"
                        :items-per-page="10" 
                        class="modern-data-table elevation-0"
                        item-key="id"
                    >
                        
                        <!-- Date with icon -->
                        <template v-slot:item.date="{ item }">
                            <div class="d-flex align-center">
                                <v-avatar size="32" class="session-avatar mr-3" :color="getSessionColor(item.attendance_rate)">
                                    <v-icon size="18">mdi-calendar</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="session-date">{{ item.date }}</div>
                                    <div class="session-time">{{ item.time }}</div>
                                </div>
                            </div>
                        </template>
                        
                        <!-- Attendance with progress -->
                        <template v-slot:item.attendance="{ item }">
                            <div class="attendance-cell">
                                <div class="attendance-numbers">
                                    <span class="present-count">{{ item.present }}</span>
                                    <span class="total-count">/{{ item.total }}</span>
                                </div>
                                <v-progress-linear 
                                    :model-value="item.attendance_rate"
                                    :color="getSessionColor(item.attendance_rate)"
                                    height="4"
                                    rounded
                                    class="mt-1"
                                />
                            </div>
                        </template>

                        <!-- Attendance rate chip -->
                        <template v-slot:item.attendance_rate="{ item }">
                            <v-chip 
                                :color="getSessionColor(item.attendance_rate)" 
                                size="small" 
                                variant="flat"
                                class="rate-chip"
                            >
                                {{ item.attendance_rate }}%
                            </v-chip>
                        </template>
                        
                        <!-- Actions -->
                        <template v-slot:item.actions="{ item }">
                            <div class="action-group">
                                <v-btn
                                    variant="text"
                                    icon
                                    size="small"
                                    @click="viewSessionDetails(item.id)"
                                    class="action-btn"
                                >
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent">View Details</v-tooltip>
                                </v-btn>
                                <v-btn
                                    variant="text"
                                    icon
                                    size="small"
                                    @click="editSession(item.id)"
                                    class="action-btn"
                                >
                                    <v-icon>mdi-pencil</v-icon>
                                    <v-tooltip activator="parent">Edit Session</v-tooltip>
                                </v-btn>
                            </div>
                        </template>

                        <!-- Empty state -->
                        <template v-slot:no-data>
                            <div class="modern-empty-state text-center py-8">
                                <v-icon size="64" color="grey-lighten-1">mdi-calendar-clock</v-icon>
                                <h3 class="mt-4">No Sessions Found</h3>
                                <p class="text-grey">No attendance sessions recorded for this class yet.</p>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>
            </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="loading-overlay">
            <v-progress-circular
                indeterminate
                size="64"
                color="primary"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'

// Define layout
definePageMeta({
    layout: 'lecturer'
})

const router = useRouter()
const route = useRoute()

// Get class ID from route params
const classId = computed(() => route.params.id)

// Component state
const loading = ref(false)
const searchQuery = ref('')

// Mock data
const classInfo = ref({
    id: 1,
    name: 'Introduction to Programming',
    code: 'CS101',
    total_students: 25,
    present_today: 23,
    absent_today: 2,
    attendance_rate: 92,
    last_session_date: '2024-11-21'
})

// Table headers
const sessionHeaders = [
    { title: 'Session Date', key: 'date' },
    { title: 'Attendance', key: 'attendance' },
    { title: 'Rate', key: 'attendance_rate' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const recentSessions = ref([
    {
        id: 1,
        date: 'November 21, 2024',
        time: '8:00 AM - 10:00 AM',
        present: 23,
        total: 25,
        attendance_rate: 92
    },
    {
        id: 2,
        date: 'November 19, 2024',
        time: '8:00 AM - 10:00 AM',
        present: 24,
        total: 25,
        attendance_rate: 96
    },
    {
        id: 3,
        date: 'November 17, 2024',
        time: '8:00 AM - 10:00 AM',
        present: 22,
        total: 25,
        attendance_rate: 88
    }
])

// Computed properties
const filteredSessions = computed(() => {
    if (!searchQuery.value) return recentSessions.value
    
    const query = searchQuery.value.toLowerCase()
    return recentSessions.value.filter(session => 
        session.date.toLowerCase().includes(query) ||
        session.time.toLowerCase().includes(query)
    )
})

// Methods
const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const getSessionColor = (rate: number) => {
    if (rate >= 90) return 'success'
    if (rate >= 80) return 'warning'
    return 'error'
}

const goBack = () => {
    router.push('/lecturer/attendance')
}

const viewAnalytics = () => {
    router.push(`/lecturer/classes/${classId.value}/analytics`)
}

const refreshData = async () => {
    try {
        loading.value = true
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        console.log('Refreshing class details...')
    } catch (err) {
        console.error('Error refreshing data:', err)
    } finally {
        loading.value = false
    }
}

const exportData = async (format: string) => {
    try {
        console.log(`Exporting attendance data as ${format}...`)
        // Export functionality would go here
    } catch (err) {
        console.error('Error exporting data:', err)
    }
}

const viewSessionDetails = (sessionId: number) => {
    console.log('Viewing session details:', sessionId)
    // Navigate to session details
}

const editSession = (sessionId: number) => {
    console.log('Editing session:', sessionId)
    // Open edit dialog
}

// Initialize data
onMounted(async () => {
    console.log('Loading class details for ID:', classId.value)
    await refreshData()
})

// Set page title
useHead({
    title: `${classInfo.value?.name || 'Class Details'} - Lecturer Dashboard`
})
</script>

<style scoped>
.class-detail-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
}

/* Modern Header Styles */
.modern-header {
    background: white;
    padding: 32px 0;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.header-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 24px;
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
    width: 60px;
    height: 60px;
    background: linear-gradient(135deg, #1976d2, #2196f3);
    border-radius: 16px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

.title-content h1.page-title {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
}

.breadcrumb-item {
    font-size: 14px;
    color: #64748b;
}

.breadcrumb-item.active {
    color: #1976d2;
    font-weight: 500;
}

.breadcrumb-divider {
    color: #cbd5e1;
}

.stats-cards {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.stat-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    text-align: center;
    min-width: 120px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    color: #64748b;
    text-transform: uppercase;
    font-weight: 500;
    letter-spacing: 0.5px;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.modern-btn {
    border-radius: 10px;
    font-weight: 500;
    letter-spacing: 0.25px;
    text-transform: none;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modern-btn:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
}

.refresh-btn {
    background: linear-gradient(135deg, #1976d2, #2196f3) !important;
    color: white !important;
}

.modern-menu {
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.menu-item {
    padding: 12px 16px;
    border-radius: 6px;
    margin: 4px;
}

.menu-item:hover {
    background-color: #f5f5f5;
}

/* Modern Table Section */
.modern-table-section {
    max-width: 1200px;
    margin: 0 auto;
    padding: 32px 24px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
    overflow: hidden;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    border-bottom: 1px solid #e2e8f0;
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
    border-radius: 8px;
}

.modern-table-card {
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.08);
}

.modern-data-table {
    border-radius: 16px;
    font-size: 1rem;
    background: white;
}

.modern-empty-state {
    text-align: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

/* Table Cell Styles */
.session-date {
    font-weight: 600;
    color: #1e293b;
    font-size: 0.95rem;
}

.session-time {
    font-size: 0.8rem;
    color: #64748b;
    margin-top: 2px;
}

.session-avatar {
    flex-shrink: 0;
}

.attendance-cell {
    min-width: 120px;
}

.attendance-numbers {
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 4px;
}

.present-count {
    color: #10b981;
}

.total-count {
    color: #64748b;
    margin-left: 2px;
}

.rate-chip {
    font-weight: 600;
    margin-bottom: 4px;
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

/* Loading */
.loading-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.8);
    z-index: 9999;
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

    .table-toolbar {
        flex-direction: column;
        align-items: stretch;
        gap: 16px;
    }

    .toolbar-right {
        justify-content: stretch;
    }

    .search-container {
        min-width: auto;
    }

    .modern-table-section {
        padding: 20px 16px;
    }
}

/* Enhanced hover effects */
.modern-data-table :deep(tbody tr:hover) {
    background-color: #f8fafc !important;
    cursor: pointer;
}

.modern-data-table :deep(.v-data-table__td) {
    padding: 16px 12px;
}

.modern-data-table :deep(.v-data-table__th) {
    background-color: #f8fafc;
    color: #374151;
    font-weight: 600;
    text-transform: uppercase;
    font-size: 0.8rem;
    letter-spacing: 0.05em;
}

/* Animation for page load */
.class-detail-page {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
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