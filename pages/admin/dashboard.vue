<template>
    <div class="dashboard-page">
        <!-- Loading Overlay -->
        <v-overlay v-model="loading" class="align-center justify-center" persistent>
            <v-progress-circular color="primary" indeterminate size="64"></v-progress-circular>
        </v-overlay>

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
                                    hide-details class="filter-select" item-title="title" item-value="value" />
                            </div>
                            <!-- <div class="filter-item">
                                <v-select v-model="filters.year" :items="yearOptions" label="Academic Year"
                                    variant="outlined" density="compact" clearable prepend-inner-icon="mdi-calendar"
                                    hide-details class="filter-select" />
                            </div> -->
                            <div class="filter-item">
                                <v-select v-model="filters.group" :items="groupOptions" label="Group" variant="outlined"
                                    density="compact" clearable prepend-inner-icon="mdi-account-group" hide-details
                                    class="filter-select" item-title="title" item-value="value" />
                            </div>
                            <div class="filter-item">
                                <v-select v-model="filters.specialize" :items="specializeOptions" label="Specialization"
                                    variant="outlined" density="compact" clearable
                                    prepend-inner-icon="mdi-school-outline" hide-details class="filter-select"
                                    item-title="title" item-value="value" />
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
                            <v-chip v-if="!loading" color="blue" size="x-small" variant="flat" class="stat-trend">
                                {{ totalStudentsCount }}
                            </v-chip>
                        </div>
                        <div class="stat-value">
                            <span v-if="loading">...</span>
                            <span v-else>{{ totalStudentsCount }}</span>
                        </div>
                        <div class="stat-label">Total Students</div>
                        <div class="stat-details">
                            <span v-if="loading">Loading...</span>
                            <span v-else>Female: {{ totalFemaleStudents }} • Male: {{ totalMaleStudents }}</span>
                        </div>
                    </div>

                    <div class="stat-card stat-card-1">
                        <div class="stat-header">
                            <v-avatar size="56" color="#22c55e" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-check</v-icon>
                            </v-avatar>
                            <v-chip v-if="!loading" color="green" size="x-small" variant="flat" class="stat-trend">
                                {{ activeStudentsCount }}
                            </v-chip>
                        </div>
                        <div class="stat-value">
                            <span v-if="loading">...</span>
                            <span v-else>{{ activeStudentsCount }}</span>
                        </div>
                        <div class="stat-label">Active Students</div>
                        <div class="stat-details">
                            <span v-if="loading">Loading...</span>
                            <span v-else>Currently enrolled</span>
                        </div>
                    </div>

                    <div class="stat-card stat-card-2">
                        <div class="stat-header">
                            <v-avatar size="56" color="#f59e0b" class="stat-icon">
                                <v-icon size="32" color="white">mdi-account-remove</v-icon>
                            </v-avatar>
                            <v-chip v-if="!loading" color="orange" size="x-small" variant="flat" class="stat-trend">
                                {{ inactiveStudentsCount }}
                            </v-chip>
                        </div>
                        <div class="stat-value">
                            <span v-if="loading">...</span>
                            <span v-else>{{ inactiveStudentsCount }}</span>
                        </div>
                        <div class="stat-label">Inactive Students</div>
                        <div class="stat-details">
                            <span v-if="loading">Loading...</span>
                            <span v-else>Not currently enrolled</span>
                        </div>
                    </div>
                </div>

                <!-- Charts Section -->
                <div class="charts-grid">
                    <!-- Status Distribution Chart -->
                    <v-card class="pa-6" elevation="2" rounded="xl">
                        <v-card-title class="d-flex align-center justify-space-between mb-4">
                            <div class="chart-title-section">
                                <v-icon icon="mdi-chart-donut" size="20" class="mr-2" color="primary" />
                                <span class="font-weight-bold">Student Status Distribution</span>
                            </div>
                        </v-card-title>

                        <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
                            <v-progress-circular color="primary" indeterminate></v-progress-circular>
                        </div>

                        <div v-else-if="totalStudentsCount === 0" class="d-flex justify-center align-center flex-column"
                            style="height: 400px;">
                            <v-icon icon="mdi-account-off" size="64" color="grey-lighten-2"></v-icon>
                            <div class="text-h6 mt-4 text-grey">No Students Data</div>
                        </div>

                        <div v-else class="d-flex flex-column align-center py-4">
                            <!-- SVG Donut Chart -->
                            <div class="position-relative" style="width: 300px; height: 300px;">
                                <svg viewBox="0 0 200 200" style="transform: rotate(-90deg);">
                                    <!-- Background circle -->
                                    <circle cx="100" cy="100" r="80" fill="none" stroke="#f0f0f0" stroke-width="40" />

                                    <!-- Active segment -->
                                    <circle v-if="activeStudentsCount > 0" cx="100" cy="100" r="80" fill="none"
                                        stroke="#22c55e" stroke-width="40"
                                        :stroke-dasharray="`${(activeStudentsCount / totalStudentsCount) * 502.4} 502.4`"
                                        class="chart-segment" />

                                    <!-- Inactive segment -->
                                    <circle v-if="inactiveStudentsCount > 0" cx="100" cy="100" r="80" fill="none"
                                        stroke="#ef4444" stroke-width="40"
                                        :stroke-dasharray="`${(inactiveStudentsCount / totalStudentsCount) * 502.4} 502.4`"
                                        :stroke-dashoffset="`-${(activeStudentsCount / totalStudentsCount) * 502.4}`"
                                        class="chart-segment" />
                                </svg>

                                <!-- Center text -->
                                <div class="chart-center-text">
                                    <div class="text-h3 font-weight-bold">{{ totalStudentsCount }}</div>
                                    <div class="text-caption text-grey">Total</div>
                                </div>
                            </div>

                            <!-- Legend -->
                            <v-list class="bg-transparent mt-4" density="compact" width="100%">
                                <v-list-item v-for="item in attendanceItems" :key="item.key" class="mb-2">
                                    <template v-slot:prepend>
                                        <div :style="{
                                            backgroundColor: item.key === 1 ? '#22c55e' : '#ef4444',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            marginRight: '12px'
                                        }"></div>
                                    </template>
                                    <v-list-item-title>
                                        <div class="d-flex justify-space-between align-center">
                                            <span class="font-weight-medium">{{ item.title }}</span>
                                            <span class="font-weight-bold">{{ item.value }} ({{ Math.round((item.value /
                                                totalStudentsCount) * 100)
                                            }}%)</span>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </div>
                    </v-card>

                    <!-- Gender Distribution Chart -->
                    <v-card class="pa-6" elevation="2" rounded="xl">
                        <v-card-title class="d-flex align-center justify-space-between mb-4">
                            <div class="chart-title-section">
                                <v-icon icon="mdi-gender-male-female" size="20" class="mr-2" color="secondary" />
                                <span class="font-weight-bold">Gender Distribution</span>
                            </div>
                        </v-card-title>

                        <div v-if="loading" class="d-flex justify-center align-center" style="height: 400px;">
                            <v-progress-circular color="primary" indeterminate></v-progress-circular>
                        </div>

                        <div v-else-if="totalStudentsCount === 0" class="d-flex justify-center align-center flex-column"
                            style="height: 400px;">
                            <v-icon icon="mdi-account-off" size="64" color="grey-lighten-2"></v-icon>
                            <div class="text-h6 mt-4 text-grey">No Students Data</div>
                        </div>

                        <div v-else class="d-flex flex-column align-center py-4">
                            <!-- SVG Pie Chart -->
                            <div class="position-relative" style="width: 280px; height: 280px;">
                                <svg viewBox="0 0 200 200" style="transform: rotate(-90deg);">
                                    <!-- Background circle -->
                                    <circle cx="100" cy="100" r="90" fill="none" stroke="#f0f0f0" stroke-width="20" />

                                    <!-- Male segment -->
                                    <circle v-if="totalMaleStudents > 0" cx="100" cy="100" r="90" fill="none"
                                        stroke="#3b82f6" stroke-width="20"
                                        :stroke-dasharray="`${(totalMaleStudents / totalStudentsCount) * 565.2} 565.2`"
                                        class="chart-segment" />

                                    <!-- Female segment -->
                                    <circle v-if="totalFemaleStudents > 0" cx="100" cy="100" r="90" fill="none"
                                        stroke="#ec4899" stroke-width="20"
                                        :stroke-dasharray="`${(totalFemaleStudents / totalStudentsCount) * 565.2} 565.2`"
                                        :stroke-dashoffset="`-${(totalMaleStudents / totalStudentsCount) * 565.2}`"
                                        class="chart-segment" />

                                    <!-- Other segment if exists -->
                                    <circle v-if="(totalStudentsCount - totalMaleStudents - totalFemaleStudents) > 0"
                                        cx="100" cy="100" r="90" fill="none" stroke="#8b5cf6" stroke-width="20"
                                        :stroke-dasharray="`${((totalStudentsCount - totalMaleStudents - totalFemaleStudents) / totalStudentsCount) * 565.2} 565.2`"
                                        :stroke-dashoffset="`-${((totalMaleStudents + totalFemaleStudents) / totalStudentsCount) * 565.2}`"
                                        class="chart-segment" />
                                </svg>

                                <!-- Center text -->
                                <div class="chart-center-text">
                                    <div class="text-h3 font-weight-bold">{{ totalStudentsCount }}</div>
                                    <div class="text-caption text-grey">Students</div>
                                </div>
                            </div>

                            <!-- Legend -->
                            <v-list class="bg-transparent mt-4" density="compact" width="100%">
                                <v-list-item v-for="item in genderItems" :key="item.key" class="mb-2">
                                    <template v-slot:prepend>
                                        <div :style="{
                                            backgroundColor: item.key === 1 ? '#3b82f6' : item.key === 2 ? '#ec4899' : '#8b5cf6',
                                            width: '16px',
                                            height: '16px',
                                            borderRadius: '4px',
                                            marginRight: '12px'
                                        }"></div>
                                    </template>
                                    <v-list-item-title>
                                        <div class="d-flex justify-space-between align-center">
                                            <span class="font-weight-medium">{{ item.title }}</span>
                                            <span class="font-weight-bold">{{ item.value }} ({{ Math.round((item.value /
                                                totalStudentsCount)
                                                * 100) }}%)</span>
                                        </div>
                                    </v-list-item-title>
                                </v-list-item>
                            </v-list>
                        </div>
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
import { useStudentStore } from '~/store/studentStore'
import { useGenerationStore } from '~/store/useGenerationStore'
import { useAdminGroups } from '~/store/adminGroups'
import { useSpecializationStore } from '~/store/useSpecializationStore'

definePageMeta({
    layout: 'admin',
    middleware: ['auth']
})

// Stores
const studentStore = useStudentStore()
const generationStore = useGenerationStore()
const groupStore = useAdminGroups()
const specializationStore = useSpecializationStore()

// State
const loading = ref(false)
const search = ref('')

const filters = ref({
    generation: null,
    year: null,
    group: null,
    specialize: null
})

// Fetch data on mount
onMounted(async () => {
    await fetchDashboardData()
})

// Watch for generation store changes
watch(() => generationStore.generations, (newVal) => {
    console.log('Generations updated:', newVal?.length || 0)
}, { deep: true })

// Fetch all required data
const fetchDashboardData = async () => {
    loading.value = true
    try {
        await Promise.all([
            studentStore.getAllStudents(),
            generationStore.fetchGenerations(),
            groupStore.fetchGroups(),
            specializationStore.fetchSpecializations()
        ])

        // Debug log
        console.log('Dashboard data loaded:', {
            students: studentStore.students?.length || 0,
            generations: generationStore.generations?.length || 0,
            activeGenerations: generationStore.activeGenerations?.length || 0,
            groups: groupStore.groups?.length || 0,
            specializations: specializationStore.specializations?.length || 0
        })

        // Log generation details for debugging
        console.log('Generation details:', generationStore.generations.map(g => ({
            id: g.id,
            generation: g.generation,
            generation_name: g.generation_name,
            active: g.active
        })))
    } catch (error) {
        console.error('Error fetching dashboard data:', error)
    } finally {
        loading.value = false
    }
}

// Filter options from stores
const generationOptions = computed(() => {
    // Use all generations if activeGenerations is empty, otherwise use activeGenerations
    const generations = generationStore.activeGenerations.length > 0
        ? generationStore.activeGenerations
        : generationStore.generations

    return generations.map(g => ({
        title: g.generation || g.generation_name || `Generation ${g.id}`,
        value: g.id
    }))
})

const yearOptions = computed(() => {
    // Get unique years from generations
    const years = new Set()
    generationStore.generations.forEach(g => {
        if (g.start_year) years.add(g.start_year)
        if (g.end_year) years.add(g.end_year)
    })
    return Array.from(years).sort().reverse()
})

const groupOptions = computed(() => {
    return groupStore.groups
        .filter(g => g.active)
        .map(g => ({
            title: g.group_name,
            value: g.id
        }))
})

const specializeOptions = computed(() => {
    return specializationStore.specializations
        .filter(s => s.active === 1)
        .map(s => ({
            title: s.name || s.specialization_name,
            value: s.id
        }))
})

// Filtered students based on filters
const filteredStudents = computed(() => {
    let students = studentStore.students || []

    if (filters.value.generation) {
        students = students.filter(s => s.generationId === filters.value.generation)
    }
    if (filters.value.group) {
        students = students.filter(s => s.groupId === filters.value.group)
    }
    if (filters.value.specialize) {
        students = students.filter(s => s.specializationId === filters.value.specialize)
    }

    return students
})

// Statistics computed from real data
const totalStudentsCount = computed(() => filteredStudents.value.length)

const totalMaleStudents = computed(() => {
    return filteredStudents.value.filter(s =>
        s.gender && (s.gender.toLowerCase() === 'male' || s.gender.toLowerCase() === 'm')
    ).length
})

const totalFemaleStudents = computed(() => {
    return filteredStudents.value.filter(s =>
        s.gender && (s.gender.toLowerCase() === 'female' || s.gender.toLowerCase() === 'f')
    ).length
})

const activeStudentsCount = computed(() => {
    return filteredStudents.value.filter(s => s.active === true || s.status === 'Active').length
})

const inactiveStudentsCount = computed(() => {
    return filteredStudents.value.filter(s => s.active === false || s.status === 'Inactive').length
})

// Filter actions
const applyFilters = async () => {
    console.log('Applying filters:', filters.value)
    // Data is already filtered via computed property
}

const resetFilters = () => {
    filters.value = {
        generation: null,
        year: null,
        group: null,
        specialize: null
    }
}

// Chart data and filters
const attendanceFilter = ref('This Week')

// Attendance Distribution Data (using active/inactive students as proxy)
const attendanceTotal = computed(() => {
    return totalStudentsCount.value
})

const attendanceItems = computed(() => {
    const total = totalStudentsCount.value
    if (total === 0) return []

    const active = activeStudentsCount.value
    const inactive = inactiveStudentsCount.value

    return [
        {
            key: 1,
            title: 'Active',
            value: active
        },
        {
            key: 2,
            title: 'Inactive',
            value: inactive
        }
    ].filter(item => item.value > 0) // Only show items with data
})

// Gender Distribution Data from real data
const genderTotal = computed(() => {
    return totalStudentsCount.value
})

const genderItems = computed(() => {
    const total = totalStudentsCount.value
    if (total === 0) return []

    const male = totalMaleStudents.value
    const female = totalFemaleStudents.value
    const other = total - male - female

    const items = [
        {
            key: 1,
            title: 'Male',
            value: male
        },
        {
            key: 2,
            title: 'Female',
            value: female
        }
    ]

    // Add "Other" category if there are students without male/female gender
    if (other > 0) {
        items.push({
            key: 3,
            title: 'Other',
            value: other
        })
    }

    return items.filter(item => item.value > 0) // Only show items with data
})
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

.chart-circle {
    position: relative;
}

.chart-circle :deep(.v-progress-circular__underlay) {
    opacity: 0.3;
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

/* Chart Styles */
.chart-center-text {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
}

.chart-segment {
    transition: opacity 0.3s ease;
}

.chart-segment:hover {
    opacity: 0.8;
}

.position-relative {
    position: relative;
}
</style>