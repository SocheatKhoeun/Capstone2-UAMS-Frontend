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
                            <h1 class="page-title">Dashboard Overview</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Dashboard</span>
                            </div>
                        </div>
                    </div>
                    <!-- <div class="welcome-message">
                        <span class="greeting">Hello, Admin 👋</span>
                        <span class="sub-greeting">Welcome back to your dashboard</span>
                    </div> -->
                </div>

                <div class="action-section">
                    <v-text-field v-model="search" prepend-inner-icon="mdi-magnify" placeholder="Search ..."
                        variant="outlined" density="compact" hide-details class="search-field" />
                </div>
            </div>
        </div>

        <!-- Modern Content Section -->
        <div class="modern-content-section">
            <div class="content-container">
                <!-- Filters Panel -->
                <div class="filters-panel-wrapper">
                    <div class="filters-content">
                        <div class="filters-row">
                            <div class="filter-item">
                                <v-select v-model="filters.generation" :items="generationOptions" label="Generation"
                                    variant="outlined" density="compact" clearable prepend-inner-icon="mdi-school"
                                    hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.year" :items="yearOptions" label="Academic Year"
                                    variant="outlined" density="compact" clearable prepend-inner-icon="mdi-calendar"
                                    hide-details class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined"
                                    density="compact" clearable prepend-inner-icon="mdi-account-group" hide-details
                                    class="filter-select" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialization"
                                    variant="outlined" density="compact" clearable
                                    prepend-inner-icon="mdi-school-outline" hide-details class="filter-select" />
                            </div>
                            <div class="filter-actions">
                                <v-btn color="primary" variant="flat" prepend-icon="mdi-magnify" @click="applyFilters"
                                    class="search-btn">
                                    Search
                                </v-btn>
                                <v-btn variant="outlined" prepend-icon="mdi-refresh" @click="resetFilters"
                                    class="reset-btn">
                                    Reset
                                </v-btn>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Stats Cards -->
                <div class="stats-grid">
                    <div class="stat-card stat-card-0">
                        <div class="stat-header">
                            <v-avatar size="56" color="#3b82f6" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-group</v-icon>
                            </v-avatar>
                            <v-chip color="blue" size="x-small" variant="flat" class="stat-trend">
                                +5%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Total Students</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>

                    <div class="stat-card stat-card-1">
                        <div class="stat-header">
                            <v-avatar size="56" color="#22c55e" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-check</v-icon>
                            </v-avatar>
                            <v-chip color="green" size="x-small" variant="flat" class="stat-trend">
                                +8%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Present Today</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>

                    <div class="stat-card stat-card-2">
                        <div class="stat-header">
                            <v-avatar size="56" color="#f59e0b" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-remove</v-icon>
                            </v-avatar>
                            <v-chip color="orange" size="x-small" variant="flat" class="stat-trend">
                                -2%
                            </v-chip>
                        </div>
                        <div class="stat-value">45</div>
                        <div class="stat-label">Absent Today</div>
                        <div class="stat-details">Female: 23 • Male: 22</div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-grid">
                    <!-- Attendance Distribution Chart -->
                    <v-card class="pa-6" elevation="2" rounded="xl">
                        <v-card-title class="d-flex align-center justify-space-between">
                            <div class="chart-title-section">
                                <v-icon icon="mdi-chart-donut" size="20" class="mr-2" color="primary" />
                                <span class="font-weight-bold">Attendance Distribution</span>
                            </div>
                            <v-select v-model="attendanceFilter" :items="['This Week', 'This Month', 'This Year']"
                                density="compact" max-width="150" variant="solo-filled" flat hide-details single-line />
                        </v-card-title>

                        <v-pie :key="attendanceFilter" :items="attendanceItems"
                            :legend="{ position: $vuetify.display.mdAndUp ? 'right' : 'bottom' }"
                            :tooltip="{ subtitleFormat: '[value]%' }" class="pa-3 mt-3 justify-center" gap="2"
                            inner-cut="70" item-key="id" rounded="2" size="300" animation hide-slice reveal>
                            <template v-slot:center>
                                <div class="text-center">
                                    <div class="text-h3">{{ attendanceTotal }}</div>
                                    <div class="opacity-70 mt-1 mb-n1">Students</div>
                                </div>
                            </template>

                            <template v-slot:legend="{ items, toggle, isActive }">
                                <v-list class="py-0 mb-n5 mb-md-0 bg-transparent" density="compact" width="300">
                                    <v-list-item v-for="item in items" :key="item.key"
                                        :class="['my-1', { 'opacity-40': !isActive(item) }]" :title="item.title"
                                        rounded="lg" link @click="toggle(item)">
                                        <template v-slot:prepend>
                                            <v-avatar :color="item.color" :size="16"></v-avatar>
                                        </template>
                                        <template v-slot:append>
                                            <div class="font-weight-bold">{{ item.value }}%</div>
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </template>
                        </v-pie>
                    </v-card>

                    <!-- Gender Distribution Chart -->
                    <v-card class="pa-6" elevation="2" rounded="xl">
                        <v-card-title class="d-flex align-center justify-space-between">
                            <div class="chart-title-section">
                                <v-icon icon="mdi-gender-male-female" size="20" class="mr-2" color="secondary" />
                                <span class="font-weight-bold">Gender Distribution</span>
                            </div>
                        </v-card-title>

                        <v-pie :items="genderItems" :legend="{ position: 'bottom' }"
                            :tooltip="{ subtitleFormat: '[value] students' }" class="pa-3 mt-3 justify-center" gap="3"
                            item-key="id" rounded="3" size="280" animation>
                            <template v-slot:center>
                                <div class="text-center">
                                    <div class="text-h3">{{ genderTotal }}</div>
                                    <div class="opacity-70 mt-1 mb-n1">Total</div>
                                </div>
                            </template>
                        </v-pie>
                    </v-card>
                </div>

                <!-- Hidden SVG patterns -->
                <div class="h-0">
                    <svg height="0" version="1.1" width="0" xmlns="http://www.w3.org/2000/svg">
                        <defs>
                            <pattern id="pattern-0" height="20" patternTransform="rotate(145) scale(.2)"
                                patternUnits="userSpaceOnUse" width="20">
                                <path d="M0 10h20zm0 20h20zm0 20h20zm0 20h20z" fill="none"
                                    stroke="rgb(var(--v-theme-surface))" stroke-width="3" />
                            </pattern>
                        </defs>
                    </svg>
                </div>
                <!-- <div class="table-header">
                        <div class="table-title-section">
                            <h3 class="table-title">
                                <v-icon icon="mdi-account-multiple" size="20" class="mr-2" />
                                Student Lists
                            </h3>
                            <span class="table-subtitle">Attendance tracking records</span>
                        </div>
                        <div class="table-actions">
                            <v-text-field v-model="studentSearch" prepend-inner-icon="mdi-magnify"
                                placeholder="Search ..." variant="outlined" density="compact" hide-details
                                class="search-field-small" />
                            <v-select v-model="studentOrder" :items="['A-Z', 'Z-A']" label="Order" variant="outlined"
                                density="compact" hide-details class="order-select" />
                        </div>
                    </div>
                    <div class="table-content">
                        <v-table class="attendance-table">
                            <thead>
                                <tr>
                                    <th class="text-left font-weight-bold">Student name</th>
                                    <th class="text-center font-weight-bold">Gender</th>
                                    <th class="text-center font-weight-bold">Generation</th>
                                    <th class="text-center font-weight-bold">DOB</th>
                                    <th class="text-center font-weight-bold">Status</th>
                                    <th class="text-center font-weight-bold" colspan="14">Attendance record</th>
                                </tr>
                                <tr>
                                    <th colspan="5"></th>
                                    <th class="text-center week-header" colspan="2">W1</th>
                                    <th class="text-center week-header" colspan="2">W2</th>
                                    <th class="text-center week-header" colspan="2">W3</th>
                                </tr>
                                <tr>
                                    <th colspan="5"></th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                    <th class="text-center day-header">D3</th>
                                    <th class="text-center day-header">D4</th>
                                    <th class="text-center day-header">D5</th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                    <th class="text-center day-header">D3</th>
                                    <th class="text-center day-header">D4</th>
                                    <th class="text-center day-header">D5</th>
                                    <th class="text-center day-header">D1</th>
                                    <th class="text-center day-header">D2</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="student in filteredStudents" :key="student.id">
                                    <td>{{ student.name }}</td>
                                    <td class="text-center">{{ student.gender }}</td>
                                    <td class="text-center">{{ student.generation }}</td>
                                    <td class="text-center">{{ student.dob }}</td>
                                    <td class="text-center">
                                        <v-chip :color="student.status === 'Active' ? 'success' : 'grey'" size="small">
                                            {{ student.status }}
                                        </v-chip>
                                    </td>
                                    <td v-for="(attendance, index) in student.attendanceRecord" :key="index"
                                        :class="['text-center attendance-cell', getAttendanceClass(attendance)]">
                                        {{ attendance }}
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </div> -->
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
    middleware: ['auth']
})

// Search and filters
const search = ref('')

const filters = ref({
    generation: null,
    year: null,
    group: null,
    specialize: null
})

const generationOptions = ['9', '10', '11', '12']
const yearOptions = ['2023', '2024', '2025', '2026']
const groupOptions = ['G1', 'G2', 'G3', 'G4']
const specializeOptions = ['CS', 'IT', 'IS', 'SE']

// Filter actions
const applyFilters = () => {
    console.log('Applying filters:', filters.value)
    // TODO: Add your filter logic here
}

const resetFilters = () => {
    filters.value = {
        generation: null,
        year: null,
        group: null,
        specialize: null
    }
    console.log('Filters reset')
}

// Chart data and filters
const attendanceFilter = ref('This Week')

// Attendance Distribution Data
const attendanceTotal = computed(() => {
    const total = attendanceItems.value.reduce((sum, item) => sum + item.value, 0)
    return Math.round((total / 100) * 45) // Based on percentage
})

const attendanceItems = computed(() => [
    { id: 1, title: 'Present', value: 75, color: '#22c55e' },
    { id: 2, title: 'Absent', value: 15, color: '#ef4444' },
    { id: 3, title: 'Leave', value: 10, color: '#f59e0b' }
])

// Gender Distribution Data
const genderTotal = computed(() => {
    return genderItems.value.reduce((sum, item) => sum + item.value, 0)
})

const genderItems = ref([
    { id: 1, title: 'Male', value: 23, color: '#3b82f6' },
    { id: 2, title: 'Female', value: 22, color: '#ec4899' }
])
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
    margin-bottom: 8px;
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

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-field {
    min-width: 300px;
}

.search-field :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

/* Modern Content Section */
.modern-content-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 16px 24px;
}

.content-container {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

/* Filters Panel */
.filters-panel-wrapper {
    background: white;
    border-radius: 12px;
    padding: 12px 16px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    border: 1px solid #e2e8f0;
    margin-bottom: 16px;
}

.filters-content {
    width: 100%;
}

.filters-row {
    display: grid;
    grid-template-columns: repeat(4, 1fr) auto;
    gap: 12px;
    align-items: end;
}

.filter-item {
    width: 100%;
}

.filter-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-btn,
.reset-btn {
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.025em;
    border-radius: 8px;
    height: 36px;
    padding: 0 16px;
}

.search-btn {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.reset-btn {
    border-width: 1.5px;
}

.filter-select {
    width: 100%;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
    background-color: #f8fafc;
    transition: all 0.2s ease;
}

.filter-select :deep(.v-field:hover) {
    background-color: #f1f5f9;
}

.filter-select :deep(.v-field--focused) {
    background-color: white;
}

/* Stats Grid */
.stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
    gap: 12px;
}

.stat-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(63, 81, 181, 0.1);
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 20px rgba(63, 81, 181, 0.12);
}

.stat-card-0 {
    border-left: 4px solid #3b82f6;
}

.stat-card-1 {
    border-left: 4px solid #22c55e;
}

.stat-card-2 {
    border-left: 4px solid #f59e0b;
}

.stat-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 12px;
}

.stat-icon {
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.25);
}

.stat-trend {
    font-weight: 600;
    font-size: 11px;
}

.stat-value {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 6px;
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

/* Charts Grid */
.charts-grid {
    display: grid;
    grid-template-columns: 65% 35%;
    gap: 12px;
}

.chart-title-section {
    display: flex;
    align-items: center;
    font-size: 16px;
}

/* Table Card */
.table-card {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
    border: 1px solid #e2e8f0;
    overflow: hidden;
}

.table-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px;
    border-bottom: 1px solid #f1f5f9;
}

.table-title-section {
    flex: 1;
}

.table-title {
    font-size: 18px;
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

.table-actions {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-field-small {
    max-width: 250px;
}

.search-field-small :deep(.v-field) {
    border-radius: 12px;
}

.order-select {
    max-width: 120px;
}

.order-select :deep(.v-field) {
    border-radius: 12px;
}

.table-content {
    padding: 0;
}

/* Attendance Table Styles */
.attendance-table {
    width: 100%;
}

.attendance-table th {
    background-color: #1e293b;
    color: white !important;
    padding: 16px 12px;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border: none;
}

.week-header {
    background-color: #22c55e !important;
    border: 1px solid #16a34a;
    color: white !important;
}

.day-header {
    background-color: #334155 !important;
    font-size: 11px;
    color: white !important;
}

.attendance-table tbody tr {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.attendance-table tbody tr:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.attendance-table tbody td {
    padding: 16px 12px;
    font-size: 14px;
    border: none;
}

.attendance-cell {
    padding: 8px;
    font-weight: 600;
    font-size: 13px;
    text-align: center;
}

.attendance-cell.present {
    background-color: #dcfce7;
    color: #15803d;
}

.attendance-cell.absent {
    background-color: #fee2e2;
    color: #b91c1c;
}

.attendance-cell.leave {
    background-color: #fed7aa;
    color: #c2410c;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        flex-direction: column;
        align-items: stretch;
        gap: 24px;
    }

    .charts-grid {
        grid-template-columns: 1fr;
    }
}

@media (max-width: 992px) {
    .charts-grid {
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

    .title-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .stats-grid {
        grid-template-columns: 1fr;
    }

    .filters-row {
        grid-template-columns: 1fr;
    }

    .filter-actions {
        width: 100%;
    }

    .search-btn,
    .reset-btn {
        flex: 1;
    }
}
</style>