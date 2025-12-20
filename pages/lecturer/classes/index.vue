<template>
    <div class="classes-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-google-classroom" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Class Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Lecturer</span>
                                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Classes</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ classes.length }}</div>
                            <div class="stat-label">TOTAL CLASSES</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{classes.filter(c => c.status === 'active').length}}</div>
                            <div class="stat-label">ACTIVE</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{classes.filter(c => c.status === 'inactive').length}}</div>
                            <div class="stat-label">INACTIVE</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn" prepend-icon="mdi-import" variant="outlined" color="grey"
                                v-bind="props" elevation="0">
                                Import
                                <v-icon icon="mdi-chevron-down" end />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleImportCSV" class="menu-item">
                                <v-icon icon="mdi-file-excel" class="mr-2" color="green" />
                                Import from CSV
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn" prepend-icon="mdi-export" variant="outlined" color="grey"
                                v-bind="props" elevation="0">
                                Export
                                <v-icon icon="mdi-chevron-down" end />
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item @click="handleExportExcel" class="menu-item">
                                <v-icon icon="mdi-file-excel" class="mr-2" color="green" />
                                Export to Excel
                            </v-list-item>
                            <v-list-item @click="handleExportPDF" class="menu-item">
                                <v-icon icon="mdi-file-pdf-box" class="mr-2" color="red" />
                                Export to PDF
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openAddClassDialog" elevation="0">
                        Add Class
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
                            <v-icon icon="mdi-format-list-bulleted" size="20" class="mr-2" />
                            My Classes
                        </h2>
                        <div class="table-subtitle">Manage your classes, students, and attendance</div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search classes..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" hide-details
                                class="search-input" />
                        </div>

                        <v-select v-model="filterSemester" :items="semesters" label="Semester" variant="outlined"
                            density="comfortable" class="filter-select" />

                        <v-select v-model="filterStatus" :items="statusOptions" label="Status" variant="outlined"
                            density="comfortable" class="filter-select" />

                        <v-btn-toggle v-model="viewMode" mandatory color="primary" variant="outlined" divided
                            class="view-toggle">
                            <v-btn value="grid" icon="mdi-view-grid"></v-btn>
                            <v-btn value="list" icon="mdi-view-list"></v-btn>
                        </v-btn-toggle>
                    </div>
                </div>
            </div>

            <!-- Grid View -->
            <v-row v-if="viewMode === 'grid'" class="mt-4">
                <v-col v-for="classItem in filteredClasses" :key="classItem.id" cols="12" md="6" lg="4">
                    <v-card elevation="2" class="class-card" hover @click="viewClassDetails(classItem)">
                        <div class="class-card-header pa-4" :style="{ background: classItem.color }">
                            <div class="d-flex justify-space-between align-center">
                                <div class="text-white">
                                    <div class="text-overline">{{ classItem.code }}</div>
                                    <div class="text-h6 font-weight-bold">{{ classItem.subject }}</div>
                                </div>
                                <v-menu>
                                    <template v-slot:activator="{ props }">
                                        <v-btn icon="mdi-dots-vertical" variant="text" color="white" size="small"
                                            v-bind="props" @click.stop></v-btn>
                                    </template>
                                    <v-list>
                                        <v-list-item @click="editClass(classItem)">
                                            <template v-slot:prepend>
                                                <v-icon>mdi-pencil</v-icon>
                                            </template>
                                            <v-list-item-title>Edit</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="duplicateClass(classItem)">
                                            <template v-slot:prepend>
                                                <v-icon>mdi-content-copy</v-icon>
                                            </template>
                                            <v-list-item-title>Duplicate</v-list-item-title>
                                        </v-list-item>
                                        <v-list-item @click="archiveClass(classItem)">
                                            <template v-slot:prepend>
                                                <v-icon>mdi-archive</v-icon>
                                            </template>
                                            <v-list-item-title>Archive</v-list-item-title>
                                        </v-list-item>
                                        <v-divider></v-divider>
                                        <v-list-item @click="deleteClass(classItem)" class="text-error">
                                            <template v-slot:prepend>
                                                <v-icon color="error">mdi-delete</v-icon>
                                            </template>
                                            <v-list-item-title>Delete</v-list-item-title>
                                        </v-list-item>
                                    </v-list>
                                </v-menu>
                            </div>
                        </div>

                        <v-card-text class="pa-4">
                            <!-- Class Info -->
                            <div class="mb-3">
                                <div class="d-flex align-center mb-2">
                                    <v-icon size="small" class="mr-2">mdi-account-group</v-icon>
                                    <span class="text-body-2">{{ classItem.group }} • {{ classItem.students }}
                                        students</span>
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <v-icon size="small" class="mr-2">mdi-calendar</v-icon>
                                    <span class="text-body-2">{{ classItem.schedule }}</span>
                                </div>
                                <div class="d-flex align-center mb-2">
                                    <v-icon size="small" class="mr-2">mdi-map-marker</v-icon>
                                    <span class="text-body-2">{{ classItem.room }}</span>
                                </div>
                            </div>

                            <!-- Progress Bar -->
                            <div class="mb-3">
                                <div class="d-flex justify-space-between mb-1">
                                    <span class="text-caption text-grey">Attendance Rate</span>
                                    <span class="text-caption font-weight-bold">{{ classItem.attendance }}%</span>
                                </div>
                                <v-progress-linear :model-value="classItem.attendance"
                                    :color="getAttendanceColor(classItem.attendance)" height="6"
                                    rounded></v-progress-linear>
                            </div>

                            <!-- Status Badge -->
                            <div class="d-flex justify-space-between align-center">
                                <v-chip :color="classItem.status === 'active' ? 'success' : 'grey'" size="small">
                                    {{ classItem.status }}
                                </v-chip>
                                <div class="text-caption text-grey">
                                    {{ classItem.semester }}
                                </div>
                            </div>
                        </v-card-text>

                        <v-divider></v-divider>

                        <!-- Quick Actions -->
                        <v-card-actions class="pa-3">
                            <v-btn size="small" variant="text" prepend-icon="mdi-checkbox-marked-circle"
                                @click.stop="takeAttendance(classItem)">
                                Attendance
                            </v-btn>
                            <v-btn size="small" variant="text" prepend-icon="mdi-account-multiple"
                                @click.stop="viewStudents(classItem)">
                                Students
                            </v-btn>
                            <v-btn size="small" variant="text" prepend-icon="mdi-chart-line"
                                @click.stop="viewInsights(classItem)">
                                Insights
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-col>
            </v-row>

            <!-- List View -->
            <div class="modern-table-wrapper" v-if="viewMode === 'list'">
                <v-table class="modern-table">
                    <thead>
                        <tr class="modern-header-row">
                            <th class="modern-header-cell">
                                <div class="header-content">Class</div>
                            </th>
                            <th class="modern-header-cell">
                                <div class="header-content">Group</div>
                            </th>
                            <th class="modern-header-cell">
                                <div class="header-content">Schedule</div>
                            </th>
                            <th class="modern-header-cell">
                                <div class="header-content">Room</div>
                            </th>
                            <th class="modern-header-cell center-align">
                                <div class="header-content">Students</div>
                            </th>
                            <th class="modern-header-cell center-align">
                                <div class="header-content">Attendance</div>
                            </th>
                            <th class="modern-header-cell center-align">
                                <div class="header-content">Status</div>
                            </th>
                            <th class="modern-header-cell center-align">
                                <div class="header-content">Actions</div>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="classItem in filteredClasses" :key="classItem.id" class="modern-table-row"
                            @click="viewClassDetails(classItem)">
                            <td class="modern-table-cell">
                                <div class="class-info">
                                    <div class="color-indicator mr-3" :style="{ background: classItem.color }"></div>
                                    <div class="class-details">
                                        <div class="class-name">{{ classItem.subject }}</div>
                                        <div class="class-code">{{ classItem.code }}</div>
                                    </div>
                                </div>
                            </td>
                            <td class="modern-table-cell">
                                <div class="group-info">{{ classItem.group }}</div>
                            </td>
                            <td class="modern-table-cell">
                                <div class="schedule-info">{{ classItem.schedule }}</div>
                            </td>
                            <td class="modern-table-cell">
                                <div class="room-info">{{ classItem.room }}</div>
                            </td>
                            <td class="modern-table-cell center-align">
                                <v-chip size="small" variant="tonal" color="primary" class="students-chip">
                                    {{ classItem.students }}
                                </v-chip>
                            </td>
                            <td class="modern-table-cell center-align">
                                <div class="attendance-progress">
                                    <v-progress-linear :model-value="classItem.attendance"
                                        :color="getAttendanceColor(classItem.attendance)" height="8" rounded
                                        class="mr-2" style="max-width: 80px;"></v-progress-linear>
                                    <span class="attendance-text">{{ classItem.attendance }}%</span>
                                </div>
                            </td>
                            <td class="modern-table-cell center-align">
                                <v-chip :color="classItem.status === 'active' ? 'success' : 'grey'" size="small"
                                    class="status-chip">
                                    {{ classItem.status }}
                                </v-chip>
                            </td>
                            <td class="modern-table-cell center-align">
                                <div class="action-group">
                                    <v-btn icon size="small" variant="text" @click.stop="takeAttendance(classItem)"
                                        class="action-btn" color="success">
                                        <v-icon>mdi-checkbox-marked-circle</v-icon>
                                        <v-tooltip activator="parent" location="top">Take Attendance</v-tooltip>
                                    </v-btn>
                                    <v-btn icon size="small" variant="text" @click.stop="viewStudents(classItem)"
                                        class="action-btn" color="primary">
                                        <v-icon>mdi-account-multiple</v-icon>
                                        <v-tooltip activator="parent" location="top">View Students</v-tooltip>
                                    </v-btn>
                                    <v-btn icon size="small" variant="text" @click.stop="editClass(classItem)"
                                        class="action-btn" color="info">
                                        <v-icon>mdi-pencil</v-icon>
                                        <v-tooltip activator="parent" location="top">Edit</v-tooltip>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>

            <!-- Empty State -->
            <v-card v-if="filteredClasses.length === 0" elevation="1" class="text-center pa-8">
                <v-icon size="64" color="grey-lighten-1">mdi-google-classroom</v-icon>
                <div class="text-h6 mt-4 mb-2">No Classes Found</div>
                <div class="text-grey mb-4">Start by creating your first class</div>
                <v-btn color="primary" prepend-icon="mdi-plus" @click="openAddClassDialog">
                    Add New Class
                </v-btn>
            </v-card>
        </div>

        <!-- Add/Edit Class Dialog -->
        <v-dialog v-model="classDialog" max-width="800px" persistent>
            <v-card>
                <v-card-title class="pa-4 bg-primary">
                    <span class="text-h6 text-white">{{ editMode ? 'Edit Class' : 'Add New Class' }}</span>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-form ref="classForm">
                        <v-row>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.subject" label="Subject Name*" variant="outlined"
                                    :rules="[v => !!v || 'Subject name is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.code" label="Course Code*" variant="outlined"
                                    :rules="[v => !!v || 'Course code is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.group" :items="groups" label="Group*" variant="outlined"
                                    :rules="[v => !!v || 'Group is required']"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.semester" :items="semesters" label="Semester*"
                                    variant="outlined" :rules="[v => !!v || 'Semester is required']"></v-select>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.room" label="Room*" variant="outlined"
                                    :rules="[v => !!v || 'Room is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model="formData.schedule" label="Schedule (e.g., Mon/Wed 2-4PM)*"
                                    variant="outlined" :rules="[v => !!v || 'Schedule is required']"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-text-field v-model.number="formData.students" label="Number of Students"
                                    type="number" variant="outlined"></v-text-field>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-select v-model="formData.color" :items="colorOptions" label="Color Theme"
                                    variant="outlined">
                                    <template v-slot:item="{ item, props }">
                                        <v-list-item v-bind="props">
                                            <template v-slot:prepend>
                                                <div class="color-preview mr-2" :style="{ background: item.value }">
                                                </div>
                                            </template>
                                        </v-list-item>
                                    </template>
                                    <template v-slot:selection="{ item }">
                                        <div class="d-flex align-center">
                                            <div class="color-preview mr-2" :style="{ background: item.value }"></div>
                                            <span>{{ item.title }}</span>
                                        </div>
                                    </template>
                                </v-select>
                            </v-col>
                            <v-col cols="12">
                                <v-textarea v-model="formData.description" label="Description" variant="outlined"
                                    rows="3" placeholder="Add class description, objectives, or notes..."></v-textarea>
                            </v-col>
                            <v-col cols="12">
                                <v-select v-model="formData.status" :items="['active', 'inactive']" label="Status"
                                    variant="outlined"></v-select>
                            </v-col>
                        </v-row>
                    </v-form>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="closeClassDialog">Cancel</v-btn>
                    <v-btn color="primary" variant="flat" @click="saveClass">
                        {{ editMode ? 'Save Changes' : 'Add Class' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Class Details Dialog -->
        <v-dialog v-model="detailsDialog" max-width="900px">
            <v-card v-if="selectedClass">
                <div class="class-details-header pa-6" :style="{ background: selectedClass.color }">
                    <div class="d-flex justify-space-between align-center text-white">
                        <div>
                            <div class="text-overline">{{ selectedClass.code }}</div>
                            <div class="text-h4 font-weight-bold mb-2">{{ selectedClass.subject }}</div>
                            <div class="text-h6">{{ selectedClass.group }}</div>
                        </div>
                        <v-btn icon="mdi-close" variant="text" color="white" @click="detailsDialog = false"></v-btn>
                    </div>
                </div>

                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Schedule</div>
                                <div class="text-h6 d-flex align-center">
                                    <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                                    {{ selectedClass.schedule }}
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="6">
                            <div class="info-item mb-4">
                                <div class="text-caption text-grey mb-1">Room</div>
                                <div class="text-h6 d-flex align-center">
                                    <v-icon class="mr-2">mdi-map-marker</v-icon>
                                    {{ selectedClass.room }}
                                </div>
                            </div>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card variant="tonal" color="primary">
                                <v-card-text class="text-center">
                                    <div class="text-caption mb-1">Total Students</div>
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.students }}</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card variant="tonal" color="success">
                                <v-card-text class="text-center">
                                    <div class="text-caption mb-1">Attendance Rate</div>
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.attendance }}%</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                        <v-col cols="12" md="4">
                            <v-card variant="tonal" color="warning">
                                <v-card-text class="text-center">
                                    <div class="text-caption mb-1">Sessions</div>
                                    <div class="text-h4 font-weight-bold">{{ selectedClass.sessions || 24 }}</div>
                                </v-card-text>
                            </v-card>
                        </v-col>
                    </v-row>

                    <v-divider class="my-6"></v-divider>

                    <!-- Quick Actions -->
                    <div class="text-h6 mb-4">Quick Actions</div>
                    <v-row>
                        <v-col cols="6" md="3">
                            <v-btn color="primary" variant="tonal" block prepend-icon="mdi-checkbox-marked-circle"
                                @click="takeAttendance(selectedClass)">
                                Take Attendance
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="success" variant="tonal" block prepend-icon="mdi-account-multiple"
                                @click="viewStudents(selectedClass)">
                                View Students
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="info" variant="tonal" block prepend-icon="mdi-chart-line"
                                @click="viewInsights(selectedClass)">
                                View Insights
                            </v-btn>
                        </v-col>
                        <v-col cols="6" md="3">
                            <v-btn color="warning" variant="tonal" block prepend-icon="mdi-file-document"
                                @click="generateReport(selectedClass)">
                                Generate Report
                            </v-btn>
                        </v-col>
                    </v-row>
                </v-card-text>
            </v-card>
        </v-dialog>

        <!-- Confirmation Dialog -->
        <v-dialog v-model="confirmDialog" max-width="400px">
            <v-card>
                <v-card-title class="text-h6">Confirm Action</v-card-title>
                <v-card-text>{{ confirmMessage }}</v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn variant="text" @click="confirmDialog = false">Cancel</v-btn>
                    <v-btn color="error" variant="flat" @click="confirmAction">Confirm</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { useLecturer } from '~/composables/useLecturer'
import { useAuthStore } from '~/store/userAuth'

definePageMeta({
    layout: 'lecturer',
    // middleware: ['auth', 'role-lecturer']
})

// Use lecturer composable for API integration
const { loading, error, classes: lecturerClasses, fetchClasses } = useLecturer()
const authStore = useAuthStore()

// State
const searchQuery = ref('')
const filterSemester = ref('All Semesters')
const filterStatus = ref('All Status')
const viewMode = ref('grid')
const classDialog = ref(false)
const detailsDialog = ref(false)
const confirmDialog = ref(false)
const editMode = ref(false)
const selectedClass = ref(null)
const confirmMessage = ref('')
const confirmCallback = ref(null)

// Form Data
const formData = ref({
    subject: '',
    code: '',
    group: '',
    semester: '',
    room: '',
    schedule: '',
    students: 0,
    color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    description: '',
    status: 'active'
})

// Options
const semesters = ['All Semesters', 'Fall 2024', 'Spring 2025', 'Summer 2025']
const statusOptions = ['All Status', 'active', 'inactive']
const groups = ['CS-9-G1', 'CS-9-G2', 'CS-10-G1', 'CS-10-G2', 'IT-9-G1', 'IT-10-G1', 'IT-10-G2']
const colorOptions = [
    { title: 'Purple Gradient', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
    { title: 'Blue Gradient', value: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)' },
    { title: 'Green Gradient', value: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)' },
    { title: 'Orange Gradient', value: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)' },
    { title: 'Red Gradient', value: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)' },
    { title: 'Teal Gradient', value: 'linear-gradient(135deg, #009688 0%, #00695C 100%)' },
]

// Fetch classes on mount
onMounted(async () => {
    // Uncomment when backend API is ready
    // await fetchClasses()
})

// Temporary local classes data (will be replaced with API data)
const localClasses = ref([
    {
        id: 1,
        subject: 'Database Systems',
        code: 'CS301',
        group: 'CS-9-G1',
        semester: 'Spring 2025',
        room: 'Lab A-101',
        schedule: 'Mon, Wed 10:00 AM - 12:00 PM',
        students: 35,
        attendance: 87,
        sessions: 24,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        status: 'active',
        description: 'Introduction to database management systems'
    },
    {
        id: 2,
        subject: 'Web Development',
        code: 'CS303',
        group: 'CS-9-G2',
        semester: 'Spring 2025',
        room: 'Lab B-205',
        schedule: 'Tue, Thu 2:00 PM - 4:00 PM',
        students: 32,
        attendance: 92,
        sessions: 22,
        color: 'linear-gradient(135deg, #2196F3 0%, #1976D2 100%)',
        status: 'active',
        description: 'Modern web development with frameworks'
    },
    {
        id: 3,
        subject: 'Data Structures',
        code: 'CS201',
        group: 'CS-10-G1',
        semester: 'Spring 2025',
        room: 'Room C-302',
        schedule: 'Mon, Wed, Fri 8:00 AM - 9:30 AM',
        students: 40,
        attendance: 78,
        sessions: 26,
        color: 'linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%)',
        status: 'active',
        description: 'Core data structures and algorithms'
    },
    {
        id: 4,
        subject: 'Software Engineering',
        code: 'CS405',
        group: 'CS-10-G2',
        semester: 'Spring 2025',
        room: 'Room D-104',
        schedule: 'Tue, Thu 10:00 AM - 12:00 PM',
        students: 28,
        attendance: 85,
        sessions: 20,
        color: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
        status: 'active',
        description: 'Software development lifecycle and practices'
    },
    {
        id: 5,
        subject: 'Operating Systems',
        code: 'CS407',
        group: 'IT-10-G1',
        semester: 'Fall 2024',
        room: 'Lab E-201',
        schedule: 'Wed, Fri 1:00 PM - 3:00 PM',
        students: 30,
        attendance: 65,
        sessions: 28,
        color: 'linear-gradient(135deg, #F44336 0%, #C62828 100%)',
        status: 'inactive',
        description: 'Operating system concepts and design'
    },
    {
        id: 6,
        subject: 'Computer Networks',
        code: 'CS501',
        group: 'IT-10-G2',
        semester: 'Spring 2025',
        room: 'Lab F-103',
        schedule: 'Mon, Thu 3:00 PM - 5:00 PM',
        students: 25,
        attendance: 90,
        sessions: 21,
        color: 'linear-gradient(135deg, #009688 0%, #00695C 100%)',
        status: 'active',
        description: 'Network protocols and architecture'
    }
])

// Classes data - use localClasses for now, switch to lecturerClasses when API is ready
const classes = computed(() => {
    // When backend is ready, uncomment this:
    // return lecturerClasses.value || []

    // For now, use local data:
    return localClasses.value
})

// Computed
const filteredClasses = computed(() => {
    let result = classes.value

    // Filter by search query
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase()
        result = result.filter(c =>
            c.subject.toLowerCase().includes(query) ||
            c.code.toLowerCase().includes(query) ||
            c.group.toLowerCase().includes(query)
        )
    }

    // Filter by semester
    if (filterSemester.value !== 'All Semesters') {
        result = result.filter(c => c.semester === filterSemester.value)
    }

    // Filter by status
    if (filterStatus.value !== 'All Status') {
        result = result.filter(c => c.status === filterStatus.value)
    }

    return result
})

// Methods
const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'success'
    if (attendance >= 75) return 'primary'
    if (attendance >= 60) return 'warning'
    return 'error'
}

const openAddClassDialog = () => {
    editMode.value = false
    formData.value = {
        subject: '',
        code: '',
        group: '',
        semester: '',
        room: '',
        schedule: '',
        students: 0,
        color: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        description: '',
        status: 'active'
    }
    classDialog.value = true
}

const editClass = (classItem) => {
    editMode.value = true
    selectedClass.value = classItem
    formData.value = { ...classItem }
    classDialog.value = true
}

const closeClassDialog = () => {
    classDialog.value = false
    editMode.value = false
    selectedClass.value = null
}

const saveClass = () => {
    if (editMode.value) {
        const index = localClasses.value.findIndex(c => c.id === selectedClass.value.id)
        if (index !== -1) {
            localClasses.value[index] = { ...localClasses.value[index], ...formData.value }
        }
    } else {
        const newClass = {
            id: localClasses.value.length + 1,
            ...formData.value,
            attendance: 0,
            sessions: 0
        }
        localClasses.value.push(newClass)
    }
    closeClassDialog()
}

const viewClassDetails = (classItem) => {
    selectedClass.value = classItem
    detailsDialog.value = true
}

const deleteClass = (classItem) => {
    confirmMessage.value = `Are you sure you want to delete "${classItem.subject}"?`
    confirmCallback.value = () => {
        localClasses.value = localClasses.value.filter(c => c.id !== classItem.id)
        confirmDialog.value = false
    }
    confirmDialog.value = true
}

const duplicateClass = (classItem) => {
    const newClass = {
        ...classItem,
        id: localClasses.value.length + 1,
        subject: `${classItem.subject} (Copy)`,
    }
    localClasses.value.push(newClass)
}

const archiveClass = (classItem) => {
    confirmMessage.value = `Are you sure you want to archive "${classItem.subject}"?`
    confirmCallback.value = () => {
        const index = localClasses.value.findIndex(c => c.id === classItem.id)
        if (index !== -1) {
            localClasses.value[index].status = 'inactive'
        }
        confirmDialog.value = false
    }
    confirmDialog.value = true
}

const confirmAction = () => {
    if (confirmCallback.value) {
        confirmCallback.value()
    }
}

const resetFilters = () => {
    searchQuery.value = ''
    filterSemester.value = 'All Semesters'
    filterStatus.value = 'All Status'
}

const takeAttendance = (classItem) => {
    // Navigate to attendance page or open attendance dialog
    console.log('Take attendance for:', classItem.subject)
}

const viewStudents = (classItem) => {
    // Navigate to analytics page for this class
    navigateTo(`/lecturer/classes/${classItem.id}/analytics`)
}

const viewInsights = (classItem) => {
    // Navigate to insights page
    navigateTo('/lecturer/insights')
}

const generateReport = (classItem) => {
    // Generate and download report
    console.log('Generate report for:', classItem.subject)
}

// Import/Export functions
const handleImportCSV = () => {
    // Implementation for CSV import
    console.log('Importing classes from CSV...')
    // You can implement actual CSV import logic here
}

const handleExportExcel = () => {
    // Implementation for Excel export
    console.log('Exporting classes to Excel...')
    // You can implement actual Excel export logic here
}

const handleExportPDF = () => {
    // Implementation for PDF export
    console.log('Exporting classes to PDF...')
    // You can implement actual PDF export logic here
}

// Initialize - fetch classes on mount
onMounted(async () => {
    await classStore.fetchClasses()
})
</script>

<style scoped>
.classes-page {
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
    background: white;
    border-radius: 8px;
}

.filter-select :deep(.v-field) {
    border-radius: 12px;
}

.view-toggle {
    border-radius: 12px;
    overflow: hidden;
}

.view-toggle .v-btn {
    border-radius: 0;
    min-width: 44px;
    height: 44px;
}

/* Modern Table Styles */
.modern-table-wrapper {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
    margin-top: 24px;
}

.modern-table {
    width: 100%;
}

.modern-header-row {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
}

.modern-header-cell {
    padding: 20px 16px;
    border: none;
    position: relative;
    text-align: left !important;
    background: #f8fafc;
    border-bottom: 2px solid #e2e8f0;
}

.modern-header-cell.center-align {
    text-align: center !important;
}

.header-content {
    display: flex;
    align-items: center;
    color: #374151 !important;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    justify-content: center;
}

.modern-header-cell:not(.center-align) .header-content {
    justify-content: flex-start;
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

.modern-table-cell.center-align {
    text-align: center !important;
}

.class-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.class-details {
    flex: 1;
}

.class-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.class-code {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.group-info,
.schedule-info,
.room-info {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
}

.students-chip {
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
}

.attendance-progress {
    display: flex;
    align-items: center;
    gap: 8px;
    justify-content: center;
}

.attendance-text {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    min-width: 32px;
}

.status-chip {
    border-radius: 8px;
    font-weight: 500;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
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

/* Grid View Cards */
.class-card {
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.3s ease;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}

.class-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12) !important;
    border-color: #3b82f6;
}

.class-card-header {
    border-radius: 16px 16px 0 0;
    position: relative;
    overflow: hidden;
}

.class-details-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.color-indicator {
    width: 4px;
    height: 40px;
    border-radius: 2px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 2px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.table-row {
    cursor: pointer;
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.table-row:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: scale(1.001);
}

.info-item {
    padding: 16px;
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.2s ease;
}

.info-item:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        padding: 20px 24px;
        gap: 24px;
    }

    .action-section {
        flex-direction: column;
        gap: 8px;
    }
}

@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
        gap: 20px;
    }

    .modern-table-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .stats-cards {
        flex-wrap: wrap;
        gap: 12px;
    }

    .toolbar-right {
        flex-direction: column;
        align-items: stretch;
        gap: 12px;
    }

    .search-container {
        min-width: auto;
        width: 100%;
    }

    .table-toolbar {
        flex-direction: column;
        gap: 16px;
        align-items: stretch;
    }
}
</style>