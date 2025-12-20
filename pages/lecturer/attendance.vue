<template>
    <div class="attendance-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-chart-box" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Class Attendance Overview</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Lecturer</span>
                                <v-icon size="16" class="breadcrumb-divider">mdi-chevron-right</v-icon>
                                <span class="breadcrumb-item active">Attendance</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ overallStats?.total_students || 0 }}</div>
                            <div class="stat-label">Total Students</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ overallStats?.total_present || 0 }}</div>
                            <div class="stat-label">Present</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ overallStats?.total_absent || 0 }}</div>
                            <div class="stat-label">Absent</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ overallStats?.total_classes || 0 }}</div>
                            <div class="stat-label">Total Classes</div>
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
                            <v-icon icon="mdi-google-classroom" size="20" class="mr-2" />
                            Attendance Management
                        </h2>
                        <div class="table-subtitle">Monitor and manage student attendance across all sessions</div>
                    </div>
                    <div class="toolbar-right">
                        <div class="view-controls">
                            <v-btn-toggle v-model="viewMode" mandatory class="view-toggle">
                                <v-btn value="summary" prepend-icon="mdi-view-dashboard">Summary</v-btn>
                                <v-btn value="detailed" prepend-icon="mdi-format-list-bulleted">Detailed</v-btn>
                            </v-btn-toggle>
                        </div>
                        <div class="search-container">
                            <v-text-field 
                                v-model="searchQuery"
                                :placeholder="viewMode === 'summary' ? 'Search classes...' : 'Search attendance records...'"
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

                <!-- Class Summary View -->
                <v-card v-if="viewMode === 'summary'" elevation="2" class="modern-table-card">
                    <v-data-table 
                        :headers="classHeaders" 
                        :items="filteredClasses"
                        :items-per-page="10" 
                        class="modern-data-table elevation-0"
                        item-key="id"
                        @click:row="viewClassDetails"
                    >
                        
                        <!-- Class name with icon -->
                        <template v-slot:item.class="{ item }">
                            <div class="d-flex align-center">
                                <v-avatar size="32" class="class-avatar mr-3" color="primary">
                                    <v-icon size="18">mdi-google-classroom</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="class-name">{{ item.name }}</div>
                                    <div class="class-code">{{ item.code }}</div>
                                </div>
                            </div>
                        </template>
                        
                        <!-- Attendance rate with progress -->
                        <template v-slot:item.attendance_rate="{ item }">
                            <div class="attendance-rate-cell">
                                <v-chip 
                                    :color="getAttendanceColor(item.attendance_rate)" 
                                    size="small" 
                                    variant="flat"
                                    class="rate-chip"
                                >
                                    {{ item.attendance_rate }}%
                                </v-chip>
                                <v-progress-linear 
                                    :model-value="item.attendance_rate"
                                    :color="getAttendanceColor(item.attendance_rate)"
                                    height="4"
                                    rounded
                                    class="mt-1"
                                />
                            </div>
                        </template>

                        <!-- Student count -->
                        <template v-slot:item.students="{ item }">
                            <div class="student-count">
                                <span class="present-count">{{ item.present_today }}</span>
                                <span class="total-count">/{{ item.total_students }}</span>
                            </div>
                        </template>
                        
                        <!-- Last session date -->
                        <template v-slot:item.last_session_date="{ item }">
                            <div class="date-cell">{{ formatTableDate(item.last_session_date) }}</div>
                        </template>
                        
                        <!-- Actions -->
                        <template v-slot:item.actions="{ item }">
                            <div class="action-group">
                                <v-btn
                                    variant="text"
                                    icon
                                    size="small"
                                    @click.stop="viewClassDetails(null, { item })"
                                    class="action-btn"
                                >
                                    <v-icon>mdi-eye</v-icon>
                                    <v-tooltip activator="parent">View Details</v-tooltip>
                                </v-btn>
                                <v-btn
                                    variant="text"
                                    icon
                                    size="small"
                                    @click.stop="viewAnalytics(item.id)"
                                    class="action-btn"
                                >
                                    <v-icon>mdi-chart-line</v-icon>
                                    <v-tooltip activator="parent">Analytics</v-tooltip>
                                </v-btn>
                            </div>
                        </template>

                        <!-- Empty state -->
                        <template v-slot:no-data>
                            <div class="modern-empty-state text-center py-8">
                                <v-icon size="64" color="grey-lighten-1">mdi-google-classroom</v-icon>
                                <h3 class="mt-4">No Classes Found</h3>
                                <p class="text-grey">You don't have any classes assigned yet.</p>
                            </div>
                        </template>
                    </v-data-table>
                </v-card>

                <!-- Detailed Attendance Records View -->
                <v-card v-else elevation="2" class="modern-table-card">
                    <v-data-table 
                        :headers="attendanceHeaders" 
                        :items="filteredAttendanceRecords"
                        :items-per-page="15" 
                        class="modern-data-table elevation-0"
                        item-key="id"
                    >
                        
                        <!-- Student info with avatar -->
                        <template v-slot:item.student="{ item }">
                            <div class="d-flex align-center">
                                <v-avatar size="32" class="student-avatar mr-3" color="primary">
                                    <span class="text-white text-sm">{{ item.student_name?.charAt(0) || '?' }}</span>
                                </v-avatar>
                                <div>
                                    <div class="student-name">{{ item.student_name || 'Unknown' }}</div>
                                    <div class="student-id">ID: {{ item.student_id }}</div>
                                </div>
                            </div>
                        </template>

                        <!-- Global ID -->
                        <template v-slot:item.global_id="{ item }">
                            <span class="global-id">{{ item.global_id }}</span>
                        </template>

                        <!-- Class name -->
                        <template v-slot:item.class_name="{ item }">
                            <div class="class-info">
                                <div class="class-name">{{ item.class_name }}</div>
                                <div class="session-name">{{ item.session_name || 'Regular Session' }}</div>
                            </div>
                        </template>

                        <!-- Check in time -->
                        <template v-slot:item.checkin_time="{ item }">
                            <span class="time-cell">{{ formatTime(item.checkin_time) }}</span>
                        </template>

                        <!-- Check out time -->
                        <template v-slot:item.checkout_time="{ item }">
                            <span class="time-cell">{{ formatTime(item.checkout_time) }}</span>
                        </template>

                        <!-- Status -->
                        <template v-slot:item.status="{ item }">
                            <v-chip 
                                :color="getStatusColor(item.status)"
                                variant="flat"
                                size="small"
                                class="status-chip"
                            >
                                {{ item.status }}
                            </v-chip>
                        </template>

                        <!-- Method -->
                        <template v-slot:item.method="{ item }">
                            <v-chip 
                                color="info"
                                variant="outlined"
                                size="small"
                                class="method-chip"
                            >
                                <v-icon start size="14">
                                    {{ item.method === 'Face Recognition' ? 'mdi-face-recognition' : 
                                       item.method === 'QR Code' ? 'mdi-qrcode' : 
                                       item.method === 'Fingerprint' ? 'mdi-fingerprint' : 
                                       'mdi-account-edit' }}
                                </v-icon>
                                {{ item.method }}
                            </v-chip>
                        </template>

                        <!-- Actions -->
                        <template v-slot:item.actions="{ item }">
                            <div class="action-buttons">
                                <v-btn
                                    icon="mdi-eye"
                                    variant="text"
                                    size="small"
                                    @click="viewAttendanceDetails(item)"
                                    class="action-btn"
                                >
                                    <v-icon size="16">mdi-eye</v-icon>
                                    <v-tooltip activator="parent">View Details</v-tooltip>
                                </v-btn>
                                <v-btn
                                    icon="mdi-pencil"
                                    variant="text"
                                    size="small"
                                    @click="editAttendance(item)"
                                    class="action-btn"
                                >
                                    <v-icon size="16">mdi-pencil</v-icon>
                                    <v-tooltip activator="parent">Edit</v-tooltip>
                                </v-btn>
                                <v-btn
                                    icon="mdi-delete"
                                    variant="text"
                                    size="small"
                                    @click="deleteAttendance(item)"
                                    class="action-btn delete-btn"
                                >
                                    <v-icon size="16">mdi-delete</v-icon>
                                    <v-tooltip activator="parent">Delete</v-tooltip>
                                </v-btn>
                            </div>
                        </template>

                        <!-- Empty state -->
                        <template v-slot:no-data>
                            <div class="modern-empty-state text-center py-8">
                                <v-icon size="64" color="grey-lighten-1">mdi-clipboard-list</v-icon>
                                <h3 class="mt-4">No Attendance Records Found</h3>
                                <p class="text-grey">No attendance records match your search criteria.</p>
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

        <!-- Error Snackbar -->
        <v-snackbar v-model="showError" :timeout="5000" color="error" location="top">
            {{ errorMessage }}
            <template v-slot:actions>
                <v-btn variant="text" @click="showError = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import type { AttendanceRecordDisplay } from '~/types/attendance'
import attendanceData from '~/mock/attendance.json'

// Define layout
definePageMeta({
  layout: 'lecturer'
})

const router = useRouter()

// Load attendance records from mock data
const attendanceRecords = ref<AttendanceRecordDisplay[]>(attendanceData as AttendanceRecordDisplay[])

// Component state
const loading = ref(false)
const showError = ref(false)
const errorMessage = ref('')
const searchQuery = ref('')
const viewMode = ref('summary') // 'summary' or 'detailed'

// Table headers for attendance records
const attendanceHeaders = [
    { title: 'Student', key: 'student', sortable: true },
    { title: 'Global ID', key: 'global_id', sortable: true },
    { title: 'Class', key: 'class_name', sortable: true },
    { title: 'Check In', key: 'checkin_time', sortable: true },
    { title: 'Check Out', key: 'checkout_time', sortable: true },
    { title: 'Status', key: 'status', sortable: true },
    { title: 'Method', key: 'method', sortable: true },
    { title: 'Actions', key: 'actions', sortable: false }
]

// Computed properties for statistics
const overallStats = computed(() => {
    const total = attendanceRecords.value.length
    const present = attendanceRecords.value.filter(r => r.status === 'Present').length
    const absent = attendanceRecords.value.filter(r => r.status === 'Absent').length
    const late = attendanceRecords.value.filter(r => r.status === 'Late').length
    const excused = attendanceRecords.value.filter(r => r.status === 'Excused').length
    
    // Calculate unique classes and students
    const uniqueClasses = new Set(attendanceRecords.value.map(r => r.class_name)).size
    const uniqueStudents = new Set(attendanceRecords.value.map(r => r.student_id)).size
    
    return {
        total_students: uniqueStudents,
        total_present: present,
        total_absent: absent,
        total_late: late,
        total_excused: excused,
        total_classes: uniqueClasses,
        attendance_rate: total > 0 ? Math.round((present / total) * 100) : 0
    }
})

// Filtered attendance records
const filteredAttendanceRecords = computed(() => {
    if (!searchQuery.value) return attendanceRecords.value
    
    const query = searchQuery.value.toLowerCase()
    return attendanceRecords.value.filter(record => 
        record.student_name?.toLowerCase().includes(query) ||
        record.global_id.toLowerCase().includes(query) ||
        record.class_name?.toLowerCase().includes(query) ||
        record.status.toLowerCase().includes(query)
    )
})

// Group attendance records by class for summary view
const classSummary = computed(() => {
    const classMap = new Map()
    
    attendanceRecords.value.forEach(record => {
        if (!record.class_name) return
        
        if (!classMap.has(record.class_name)) {
            classMap.set(record.class_name, {
                id: record.session_id,
                name: record.class_name,
                code: `CS${record.session_id}`, // Generate code from session_id
                total_students: 0,
                present_today: 0,
                absent_today: 0,
                late_today: 0,
                excused_today: 0,
                attendance_rate: 0,
                last_session_date: ''
            })
        }
        
        const classStats = classMap.get(record.class_name)
        classStats.total_students++
        
        switch (record.status) {
            case 'Present':
                classStats.present_today++
                break
            case 'Absent':
                classStats.absent_today++
                break
            case 'Late':
                classStats.late_today++
                break
            case 'Excused':
                classStats.excused_today++
                break
        }
        
        // Update last session date
        if (record.created_at > classStats.last_session_date) {
            classStats.last_session_date = record.created_at.split('T')[0]
        }
    })
    
    // Calculate attendance rates
    classMap.forEach(classStats => {
        const attendedCount = classStats.present_today + classStats.late_today
        classStats.attendance_rate = classStats.total_students > 0 
            ? Math.round((attendedCount / classStats.total_students) * 100) 
            : 0
    })
    
    return Array.from(classMap.values())
})

// Table headers for class summary
const classHeaders = [
    { title: 'Class', key: 'class' },
    { title: 'Students', key: 'students' },
    { title: 'Attendance Rate', key: 'attendance_rate' },
    { title: 'Last Session', key: 'last_session_date' },
    { title: 'Actions', key: 'actions', sortable: false }
]

const filteredClasses = computed(() => {
    if (!searchQuery.value) return classSummary.value
    
    const query = searchQuery.value.toLowerCase()
    return classSummary.value.filter(classItem => 
        classItem.name.toLowerCase().includes(query) ||
        classItem.code.toLowerCase().includes(query)
    )
})

// Methods
const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric'
    })
}

const formatTableDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const getAttendanceColor = (rate: number) => {
    if (rate >= 90) return 'success'
    if (rate >= 80) return 'warning'
    return 'error'
}

const getStatusColor = (status: string) => {
    switch (status) {
        case 'Present': return 'success'
        case 'Late': return 'warning'
        case 'Absent': return 'error'
        case 'Excused': return 'info'
        default: return 'grey'
    }
}

const formatTime = (timeString: string) => {
    if (!timeString) return 'N/A'
    try {
        return new Date(timeString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        })
    } catch {
        return 'N/A'
    }
}

const refreshData = async () => {
    loading.value = true
    try {
        // Simulate API call delay
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        // In a real app, this would fetch from API
        console.log('Refreshing attendance data...')
        
        showErrorMessage('Data refreshed successfully!')
    } catch (err) {
        console.error('Error refreshing data:', err)
        showErrorMessage('Failed to refresh data')
    } finally {
        loading.value = false
    }
}

const exportData = async (format: string) => {
    try {
        console.log(`Exporting attendance data as ${format}...`)
        // In a real app, this would export the actual data
        showErrorMessage(`${format.toUpperCase()} export coming soon!`)
    } catch (err) {
        console.error('Error exporting data:', err)
        showErrorMessage('Failed to export data')
    }
}

const viewClassDetails = (event: any, { item }: any) => {
    // Navigate to detailed class attendance view
    router.push(`/lecturer/classes/${item.id}/attendance`)
}

const viewAnalytics = (classId: number) => {
    // Navigate to class analytics
    router.push(`/lecturer/classes/${classId}/analytics`)
}

const editAttendance = (record: AttendanceRecordDisplay) => {
    console.log('Edit attendance:', record)
    showErrorMessage('Edit functionality coming soon!')
}

const deleteAttendance = (record: AttendanceRecordDisplay) => {
    console.log('Delete attendance:', record)
    showErrorMessage('Delete functionality coming soon!')
}

const viewAttendanceDetails = (record: AttendanceRecordDisplay) => {
    console.log('View attendance details:', record)
    showErrorMessage('Detail view coming soon!')
}

const showErrorMessage = (message: string) => {
    errorMessage.value = message
    showError.value = true
}

// Initialize data
onMounted(async () => {
    await refreshData()
})

// Set page title
useHead({
    title: 'Class Attendance Overview - Lecturer Dashboard'
})
</script>
<style scoped>
.attendance-page {
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
.class-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 0.95rem;
}

.class-code {
  font-size: 0.8rem;
  color: #64748b;
  margin-top: 2px;
}

.class-avatar {
  background: linear-gradient(135deg, #3b82f6, #1d4ed8);
}

.attendance-rate-cell {
  min-width: 120px;
}

.rate-chip {
  font-weight: 600;
  margin-bottom: 4px;
}

.student-count {
  font-weight: 600;
  color: #1e293b;
}

.present-count {
  color: #10b981;
}

.total-count {
  color: #64748b;
  margin-left: 2px;
}

.date-cell {
  font-family: 'Segoe UI', system-ui, sans-serif;
  color: #374151;
  font-size: 0.9rem;
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

/* Loading Overlay */
.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
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
.attendance-page {
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

/* View Toggle Styles */
.view-controls {
  margin-right: 16px;
}

.view-toggle {
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.view-toggle .v-btn {
  font-size: 14px;
  text-transform: none;
  font-weight: 500;
}

/* Detailed View Specific Styles */
.student-avatar {
  background: linear-gradient(135deg, #1976d2 0%, #42a5f5 100%);
}

.student-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.student-id {
  font-size: 12px;
  color: #64748b;
  margin-top: 2px;
}

.global-id {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #1976d2;
  font-size: 13px;
}

.class-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.class-info .class-name {
  font-weight: 600;
  color: #1e293b;
  font-size: 14px;
}

.class-info .session-name {
  font-size: 12px;
  color: #64748b;
  font-style: italic;
}

.time-cell {
  font-family: 'Courier New', monospace;
  font-weight: 600;
  color: #059669;
  font-size: 13px;
}

.status-chip {
  min-width: 70px;
  font-weight: 600;
}

.method-chip {
  min-width: 100px;
  font-weight: 500;
}

.action-buttons {
  display: flex;
  gap: 4px;
  align-items: center;
}

.action-btn {
  color: #64748b;
  transition: all 0.2s ease;
}

.action-btn:hover {
  color: #1976d2;
  background-color: rgba(25, 118, 210, 0.1);
}

.delete-btn:hover {
  color: #dc2626 !important;
  background-color: rgba(220, 38, 38, 0.1) !important;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .toolbar-right {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  
  .view-controls {
    margin-right: 0;
  }
  
  .view-toggle {
    width: 100%;
  }
  
  .search-input {
    width: 100%;
  }
}
</style>