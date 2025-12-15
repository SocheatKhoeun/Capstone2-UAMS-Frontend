<template>
    <div class="dashboard-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-view-dashboard" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Student Dashboard</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Student</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Dashboard</span>
                            </div>
                        </div>
                    </div>
                    <div class="welcome-message">
                        <span class="greeting">Welcome back, {{ studentName }}! 👋</span>
                        <span class="sub-greeting">Student ID: {{ studentId }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Modern Content Section -->
        <div class="modern-content-section">
            <div class="content-container">
                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card stat-card-0">
                        <div class="stat-header">
                            <v-avatar size="56" color="#22c55e" class="stat-icon">
                                <v-icon size="32" color="white">mdi-check-circle</v-icon>
                            </v-avatar>
                            <v-chip color="green" size="x-small" variant="flat" class="stat-trend">
                                +5%
                            </v-chip>
                        </div>
                        <div class="stat-value">{{ attendanceRate }}%</div>
                        <div class="stat-label">Attendance Rate</div>
                        <div class="stat-details">{{ presentDays }} days present this month</div>
                    </div>

                    <div class="stat-card stat-card-1">
                        <div class="stat-header">
                            <v-avatar size="56" color="#3b82f6" class="stat-icon">
                                <v-icon size="32" color="white">mdi-calendar</v-icon>
                            </v-avatar>
                            <v-chip color="blue" size="x-small" variant="flat" class="stat-trend">
                                Today
                            </v-chip>
                        </div>
                        <div class="stat-value">{{ todayClasses }}</div>
                        <div class="stat-label">Today's Classes</div>
                        <div class="stat-details">{{ completedClasses }} completed • {{ upcomingClasses }} upcoming</div>
                    </div>

                    <div class="stat-card stat-card-2">
                        <div class="stat-header">
                            <v-avatar size="56" color="#f59e0b" class="stat-icon">
                                <v-icon size="32" color="white">mdi-calendar-remove</v-icon>
                            </v-avatar>
                            <v-chip color="orange" size="x-small" variant="flat" class="stat-trend">
                                Pending
                            </v-chip>
                        </div>
                        <div class="stat-value">{{ pendingLeaves }}</div>
                        <div class="stat-label">Leave Requests</div>
                        <div class="stat-details">{{ approvedLeaves }} approved • {{ rejectedLeaves }} rejected</div>
                    </div>
                </div>

                <!-- Main Content Grid -->
                <div class="main-content-grid">
                    <!-- Today's Schedule Card -->
                    <v-card class="schedule-card" elevation="2" rounded="xl">
                        <v-card-title class="d-flex align-center justify-space-between">
                            <div class="card-title-section">
                                <v-icon icon="mdi-calendar-clock" size="20" class="mr-2" color="primary" />
                                <span class="font-weight-bold">Today's Schedule</span>
                            </div>
                            <v-btn variant="text" size="small" color="primary" to="/student/schedules">
                                View All
                            </v-btn>
                        </v-card-title>
                        <v-card-text class="pa-0">
                            <div class="schedule-list">
                                <div v-for="class_item in todaySchedule" :key="class_item.id" class="schedule-item">
                                    <div class="schedule-time">
                                        <div class="time-badge">{{ formatTime(class_item.time) }}</div>
                                    </div>
                                    <div class="schedule-divider">
                                        <div class="divider-dot" :class="class_item.status"></div>
                                        <div class="divider-line"></div>
                                    </div>
                                    <div class="schedule-content">
                                        <div class="schedule-header">
                                            <h4 class="schedule-subject">{{ class_item.subject }}</h4>
                                            <v-chip 
                                                :color="class_item.status === 'completed' ? 'success' : 'primary'" 
                                                size="small"
                                                class="text-capitalize"
                                            >
                                                {{ class_item.status }}
                                            </v-chip>
                                        </div>
                                        <div class="schedule-details">
                                            <div class="detail-item">
                                                <v-icon size="14" class="mr-1">mdi-map-marker</v-icon>
                                                {{ class_item.room }}
                                            </div>
                                            <div class="detail-item">
                                                <v-icon size="14" class="mr-1">mdi-account-tie</v-icon>
                                                {{ class_item.lecturer }}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </v-card-text>
                    </v-card>

                    <!-- Quick Actions & Progress Card -->
                    <div class="sidebar-cards">
                        <!-- Quick Actions -->
                        <v-card class="actions-card" elevation="2" rounded="xl">
                            <v-card-title class="card-title-section">
                                <v-icon icon="mdi-lightning-bolt" size="20" class="mr-2" color="warning" />
                                <span class="font-weight-bold">Quick Actions</span>
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <div class="action-buttons">
                                    <v-btn 
                                        block 
                                        class="action-btn mb-3" 
                                        color="primary" 
                                        variant="flat"
                                        prepend-icon="mdi-check-circle"
                                        to="/student/attendance"
                                    >
                                        View Attendance
                                    </v-btn>
                                    <v-btn 
                                        block 
                                        class="action-btn mb-3" 
                                        color="secondary" 
                                        variant="flat"
                                        prepend-icon="mdi-calendar"
                                        to="/student/schedules"
                                    >
                                        Full Schedule
                                    </v-btn>
                                    <v-btn 
                                        block 
                                        class="action-btn" 
                                        color="warning" 
                                        variant="flat"
                                        prepend-icon="mdi-calendar-remove"
                                        to="/student/leave"
                                    >
                                        Request Leave
                                    </v-btn>
                                </div>
                            </v-card-text>
                        </v-card>

                        <!-- Attendance Progress -->
                        <v-card class="progress-card" elevation="2" rounded="xl">
                            <v-card-title class="card-title-section">
                                <v-icon icon="mdi-chart-arc" size="20" class="mr-2" color="success" />
                                <span class="font-weight-bold">Monthly Progress</span>
                            </v-card-title>
                            <v-card-text class="pa-4">
                                <div class="progress-circle">
                                    <v-progress-circular
                                        :model-value="attendanceRate"
                                        :size="140"
                                        :width="12"
                                        color="success"
                                    >
                                        <div class="progress-center">
                                            <div class="progress-value">{{ attendanceRate }}%</div>
                                            <div class="progress-label">Attendance</div>
                                        </div>
                                    </v-progress-circular>
                                </div>
                                <div class="progress-stats">
                                    <div class="progress-stat-item">
                                        <div class="stat-dot present"></div>
                                        <span>Present: {{ presentDays }}</span>
                                    </div>
                                    <div class="progress-stat-item">
                                        <div class="stat-dot absent"></div>
                                        <span>Absent: {{ absentDays }}</span>
                                    </div>
                                    <div class="progress-stat-item">
                                        <div class="stat-dot leave"></div>
                                        <span>Leave: {{ leaveDays }}</span>
                                    </div>
                                </div>
                            </v-card-text>
                        </v-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'student',
    middleware: ['auth']
})

const studentName = ref('John Doe')
const studentId = ref('STU-2024-001')
const attendanceRate = ref(87)
const todayClasses = ref(4)
const pendingLeaves = ref(1)
const presentDays = ref(23)
const absentDays = ref(2)
const leaveDays = ref(1)
const approvedLeaves = ref(3)
const rejectedLeaves = ref(0)
const completedClasses = ref(2)
const upcomingClasses = ref(2)

const todaySchedule = ref([
    {
        id: 1,
        subject: 'Mathematics',
        time: '08:00 - 10:00',
        room: 'Room A101',
        lecturer: 'Dr. Smith',
        status: 'completed'
    },
    {
        id: 2,
        subject: 'Computer Science',
        time: '10:30 - 12:30',
        room: 'Lab B201',
        lecturer: 'Prof. Johnson',
        status: 'completed'
    },
    {
        id: 3,
        subject: 'Physics',
        time: '14:00 - 16:00',
        room: 'Room C301',
        lecturer: 'Dr. Brown',
        status: 'upcoming'
    },
    {
        id: 4,
        subject: 'English',
        time: '16:30 - 18:30',
        room: 'Room D401',
        lecturer: 'Ms. Davis',
        status: 'upcoming'
    }
])

const formatTime = (timeRange) => {
    const [start] = timeRange.split(' - ')
    return start
}
</script>

<style scoped>
.dashboard-page {
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
    padding: 20px 24px;
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

.welcome-message {
    display: flex;
    flex-direction: column;
    gap: 4px;
    margin-top: 8px;
}

.greeting {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
}

.sub-greeting {
    font-size: 14px;
    color: #64748b;
}

/* Modern Content Section */
.modern-content-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
}

.content-container {
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 16px;
}

.stat-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(63, 81, 181, 0.1);
    border-radius: 16px;
    padding: 20px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.12);
}

.stat-card-0 {
    border-left: 4px solid #22c55e;
}

.stat-card-1 {
    border-left: 4px solid #3b82f6;
}

.stat-card-2 {
    border-left: 4px solid #f59e0b;
}

.stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 16px;
}

.stat-icon {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.stat-trend {
    font-weight: 600;
    font-size: 11px;
}

.stat-value {
    font-size: 36px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 8px;
}

.stat-label {
    font-size: 15px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 4px;
}

.stat-details {
    font-size: 13px;
    color: #64748b;
    line-height: 1.4;
}

/* Main Content Grid */
.main-content-grid {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 20px;
}

/* Schedule Card */
.schedule-card {
    height: fit-content;
}

.card-title-section {
    display: flex;
    align-items: center;
    font-size: 16px;
}

.schedule-list {
    padding: 16px 24px;
}

.schedule-item {
    display: grid;
    grid-template-columns: 80px 40px 1fr;
    gap: 16px;
    margin-bottom: 24px;
}

.schedule-item:last-child {
    margin-bottom: 0;
}

.schedule-time {
    display: flex;
    align-items: flex-start;
    padding-top: 2px;
}

.time-badge {
    font-size: 13px;
    font-weight: 600;
    color: #64748b;
    background: #f1f5f9;
    padding: 6px 12px;
    border-radius: 8px;
}

.schedule-divider {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
}

.divider-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    border: 3px solid #3b82f6;
    background: white;
    z-index: 1;
}

.divider-dot.completed {
    border-color: #22c55e;
    background: #22c55e;
}

.divider-line {
    width: 2px;
    flex: 1;
    background: #e2e8f0;
    margin-top: 4px;
}

.schedule-item:last-child .divider-line {
    display: none;
}

.schedule-content {
    flex: 1;
}

.schedule-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 8px;
}

.schedule-subject {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.schedule-details {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.detail-item {
    display: flex;
    align-items: center;
    font-size: 13px;
    color: #64748b;
}

/* Sidebar Cards */
.sidebar-cards {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.actions-card,
.progress-card {
    height: fit-content;
}

.action-buttons {
    display: flex;
    flex-direction: column;
}

.action-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.025em;
    border-radius: 12px;
    height: 48px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

/* Progress Card */
.progress-circle {
    display: flex;
    justify-content: center;
    margin: 24px 0;
}

.progress-center {
    text-align: center;
}

.progress-value {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
}

.progress-label {
    font-size: 12px;
    color: #64748b;
    margin-top: 4px;
}

.progress-stats {
    display: flex;
    flex-direction: column;
    gap: 12px;
    margin-top: 20px;
}

.progress-stat-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #475569;
}

.stat-dot {
    width: 12px;
    height: 12px;
    border-radius: 50%;
}

.stat-dot.present {
    background: #22c55e;
}

.stat-dot.absent {
    background: #ef4444;
}

.stat-dot.leave {
    background: #f59e0b;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .main-content-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .modern-content-section {
        padding: 16px 20px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .title-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .schedule-item {
        grid-template-columns: 70px 30px 1fr;
        gap: 12px;
    }

    .time-badge {
        font-size: 11px;
        padding: 4px 8px;
    }

    .schedule-details {
        flex-direction: column;
        gap: 8px;
    }
}
</style>