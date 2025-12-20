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
                            <div class="stat-number">{{ classes.filter(c => c.status === 'active').length }}</div>
                            <div class="stat-label">ACTIVE</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ classes.filter(c => c.status === 'inactive').length }}</div>
                            <div class="stat-label">INACTIVE</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu offset-y>
                        <template v-slot:activator="{ props }">
                            <v-btn class="modern-btn" prepend-icon="mdi-import" variant="outlined" 
                                color="grey" v-bind="props" elevation="0">
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
                            <v-btn class="modern-btn" prepend-icon="mdi-export" variant="outlined" 
                                color="grey" v-bind="props" elevation="0">
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
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="comfortable" 
                                hide-details class="search-input" />
                        </div>

                        <v-select v-model="filterSemester" :items="semesters" label="Semester" variant="outlined" 
                            density="comfortable" class="filter-select" />

                        <v-select v-model="filterStatus" :items="statusOptions" label="Status" variant="outlined" 
                            density="comfortable" class="filter-select" />

                        <v-btn-toggle v-model="viewMode" mandatory color="primary" variant="outlined" divided class="view-toggle">
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
                            <!-- start/end -->
                            <div class="d-flex align-center mb-2">
                              <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                              <span class="text-body-2">
                                <strong>Start:</strong> {{ classItem.start_formatted }}
                              </span>
                            </div>
                            <div class="d-flex align-center mb-2">
                              <v-icon size="small" class="mr-2">mdi-clock-outline</v-icon>
                              <span class="text-body-2">
                                <strong>End:</strong> {{ classItem.end_formatted }}
                              </span>
                            </div>

                            <!-- offering / room id -->
                            <div class="d-flex align-center mb-2">
                              <v-icon size="small" class="mr-2">mdi-database</v-icon>
                               <span class="text-body-2"> Room: {{ classItem.room }}</span>
                            </div>
                        </div>

                        <!-- Status & Active -->
                        <div class="d-flex justify-space-between align-center">
                          <div>
                            <v-chip :color="classItem.status === 'planned' ? 'info' : (classItem.status === 'completed' ? 'success' : 'warning')" size="small">
                              {{ classItem.status }}
                            </v-chip>
                            <v-chip size="small" variant="outlined" class="ml-2">
                              {{ classItem.active ? 'Active' : 'Inactive' }}
                            </v-chip>
                          </div>
                          <div class="text-caption text-grey">
                            {{ classItem.semester }}
                          </div>
                        </div>
                    </v-card-text>
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
                            <div class="schedule-info">
                              <div>{{ classItem.start_formatted }} - {{ classItem.end_formatted }}</div>
                              <div class="text-caption text-grey">Offering #{{ classItem.offering_id }} • {{ classItem.room }}</div>
                              <div class="mt-1">
                                <v-chip :color="classItem.status === 'planned' ? 'info' : (classItem.status === 'completed' ? 'success' : 'warning')" size="small">
                                  {{ classItem.status }}
                                </v-chip>
                                <v-chip size="small" variant="outlined" class="ml-1">{{ classItem.active ? 'Active' : 'Inactive' }}</v-chip>
                              </div>
                            </div>
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
                                    :color="getAttendanceColor(classItem.attendance)" height="8" rounded class="mr-2"
                                    style="max-width: 80px;"></v-progress-linear>
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
                                <v-btn icon size="small" variant="text" 
                                    @click.stop="takeAttendance(classItem)" class="action-btn" color="success">
                                    <v-icon>mdi-checkbox-marked-circle</v-icon>
                                    <v-tooltip activator="parent" location="top">Take Attendance</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" 
                                    @click.stop="viewStudents(classItem)" class="action-btn" color="primary">
                                    <v-icon>mdi-account-multiple</v-icon>
                                    <v-tooltip activator="parent" location="top">View Students</v-tooltip>
                                </v-btn>
                                <v-btn icon size="small" variant="text" 
                                    @click.stop="editClass(classItem)" class="action-btn" color="info">
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
import { ref, computed, onMounted, reactive } from 'vue'
import { useLecturerSessionStore } from '~/store/lecturers/sessionStore'
import { useLecturerSubjectStore } from '~/store/lecturers/subjectStore'
import { useLecturerScheduleStore } from '~/store/lecturers/scheduleStore'
import { useLecturerRoomStore } from '~/store/lecturers/roomStore'
import { userAuth } from '~/store/userAuth'

definePageMeta({
  layout: 'lecturer',
  middleware: ['auth']
})

const sessionStore = useLecturerSessionStore()
const subjectStore = useLecturerSubjectStore()
const scheduleStore = useLecturerScheduleStore()
const roomStore = useLecturerRoomStore()
const authStore = userAuth()

// UI state
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
const classForm = ref(null)

// Form data
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

// Options for dropdowns
const semesters = ref(['All Semesters', 'Fall 2024', 'Spring 2024', 'Summer 2024'])
const statusOptions = ['All Status', 'active', 'inactive', 'planned', 'completed']
const groups = ref(['Group A', 'Group B', 'Group C', 'Group D'])
const colorOptions = [
  { title: 'Blue', value: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' },
  { title: 'Green', value: 'linear-gradient(135deg, #84fab0 0%, #8fd3f4 100%)' },
  { title: 'Orange', value: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)' },
  { title: 'Purple', value: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)' },
  { title: 'Red', value: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' },
  { title: 'Indigo', value: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }
]

// Format helper
const formatDateTime = (iso) => {
  if (!iso) return 'TBA'
  try {
    return new Date(iso).toLocaleString(undefined, { 
      year: 'numeric', 
      month: 'short', 
      day: '2-digit', 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  } catch { 
    return iso 
  }
}

// Map session to UI item
const mapSessionToItem = (s) => {
  const raw = s.raw || {}
  let offering = raw.offering || raw.course_offering || null
  const oid = s.offering_id ?? raw.offering_id ?? null
  
  if (!offering && oid && Array.isArray(scheduleStore.schedules)) {
    offering = scheduleStore.schedules.find(o => 
      String(o.id) === String(oid) || String(o.global_id) === String(oid)
    ) || null
  }
  offering = offering || {}

  const subjectId = offering?.subject_id ?? offering?.subject?.id ?? raw.subject_id ?? raw.subject?.id ?? null
  let subjectName = null
  
  if (subjectId && Array.isArray(subjectStore.subjects)) {
    const found = subjectStore.subjects.find(x => 
      String(x.id) === String(subjectId) || String(x.global_id) === String(subjectId)
    )
    if (found) subjectName = found.subject_name || found.name || found.subjectName || null
  }
  
  const embeddedSubject = offering.subject || raw.subject || {}
  subjectName = subjectName || embeddedSubject.name || embeddedSubject.subject_name || 
                offering.subject_name || raw.subject_name || 'Unknown Subject'

  const startIso = s.start_datetime ?? s.start_time ?? raw.start_time ?? offering.start_time ?? null
  const endIso = s.end_datetime ?? s.end_time ?? raw.end_time ?? offering.end_time ?? null

  const roomId = s.room_id ?? raw.room_id ?? offering.room_id ?? offering.room?.id ?? null
  let roomName = null
  
  if (roomId && Array.isArray(roomStore.rooms)) {
    const foundRoom = roomStore.rooms.find(r => 
      String(r.id) === String(roomId) || String(r.global_id) === String(roomId)
    )
    if (foundRoom) roomName = foundRoom.room
  }
  roomName = roomName || offering.room?.room || offering.room_name || raw.room_name || raw.room || 'TBA'

  return {
    id: s.id,
    offering_id: s.offering_id ?? raw.offering_id ?? offering.id ?? offering.global_id ?? null,
    room_id: roomId,
    start_iso: startIso,
    end_iso: endIso,
    start_formatted: formatDateTime(startIso),
    end_formatted: formatDateTime(endIso),
    subject: subjectName,
    code: embeddedSubject.code || offering.subject_code || raw.subject_code || 'N/A',
    group: offering.group?.group_name || raw.group_name || offering.group || 'N/A',
    room: roomName,
    attendance: raw.attendance_rate ?? raw.attendance ?? 0,
    students: raw.students_count ?? raw.students ?? offering.enrollments?.length ?? 0,
    status: s.status ?? raw.status ?? 'planned',
    active: s.active === true || s.active === 1 || raw.active === true || raw.active === 1,
    semester: offering.term?.term || raw.term_name || offering.term_name || '',
    color: offering.color || 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    raw,
    offering_raw: offering
  }
}

// Computed classes list
const classes = computed(() => {
  const sessions = sessionStore.sessions || []
  return sessions.map(mapSessionToItem)
})

// Filtered classes
const filteredClasses = computed(() => {
  let result = classes.value.slice()
  
  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter(c =>
      String(c.subject || '').toLowerCase().includes(q) ||
      String(c.code || '').toLowerCase().includes(q) ||
      String(c.group || '').toLowerCase().includes(q)
    )
  }
  
  if (filterSemester.value !== 'All Semesters') {
    result = result.filter(c => c.semester === filterSemester.value)
  }
  
  if (filterStatus.value !== 'All Status') {
    result = result.filter(c => c.status === filterStatus.value)
  }
  
  return result
})

// UI helper functions
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

const saveClass = async () => {
  const { valid } = await classForm.value.validate()
  if (!valid) return
  
  // TODO: Implement actual save logic with API
  console.log('Saving class:', formData.value)
  closeClassDialog()
}

const viewClassDetails = (classItem) => {
  selectedClass.value = classItem
  detailsDialog.value = true
}

const deleteClass = (classItem) => {
  confirmMessage.value = `Are you sure you want to delete "${classItem.subject}"?`
  confirmCallback.value = () => {
    // TODO: Implement actual delete logic
    console.log('Deleting class:', classItem)
    confirmDialog.value = false
  }
  confirmDialog.value = true
}

const duplicateClass = (classItem) => {
  console.log('Duplicating class:', classItem)
  // TODO: Implement duplicate logic
}

const archiveClass = (classItem) => {
  console.log('Archiving class:', classItem)
  // TODO: Implement archive logic
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
  navigateTo(`/lecturer/classes/${classItem.id}/attendance`)
}

const viewStudents = (classItem) => {
  navigateTo(`/lecturer/classes/${classItem.id}/analytics`)
}

const viewInsights = (classItem) => {
  navigateTo('/lecturer/insights')
}

const generateReport = (classItem) => {
  console.log('Generating report for:', classItem)
  // TODO: Implement report generation
}

const handleImportCSV = () => {
  console.log('Import CSV')
  // TODO: Implement CSV import
}

const handleExportExcel = () => {
  console.log('Export to Excel')
  // TODO: Implement Excel export
}

const handleExportPDF = () => {
  console.log('Export to PDF')
  // TODO: Implement PDF export
}

// Fetch data on mount
onMounted(async () => {
  try {
    await Promise.all([
      subjectStore.fetchSubjects(),
      scheduleStore.fetchSchedules(),
      roomStore.fetchRooms(),
      sessionStore.fetchSessions()
    ])
    console.log('✅ All data loaded successfully')
  } catch (err) {
    console.error('❌ Failed to load data:', err)
  }
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
    margin-bottom: 16px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.info-item:last-child {
    margin-bottom: 0;
}

.text-caption {
    font-size: 12px;
    color: #64748b;
    margin: 0;
}

.text-h6 {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 8px 0;
}

.text-overline {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #94a3b8;
    margin-bottom: 4px;
}

.text-body-2 {
    font-size: 14px;
    color: #374151;
    margin: 0;
}

.pa-4 {
    padding: 32px 24px;
}

.pa-6 {
    padding: 24px;
}

.pa-8 {
    padding: 32px;
}

.pb-4 {
    padding-bottom: 16px;
}

.mb-4 {
    margin-bottom: 16px;
}

.mt-1 {
    margin-top: 4px;
}

.rounded {
    border-radius: 12px !important;
}

.overflow-hidden {
    overflow: hidden !important;
}

.position-relative {
    position: relative !important;
}

.cursor-pointer {
    cursor: pointer !important;
}

.transition-all {
    transition: all 0.2s ease !important;
}

.scale-up {
    transform: scale(1.05) !important;
}

.scale-down {
    transform: scale(0.95) !important;
}

.fade-enter-active, .fade-leave-active {
    transition: opacity 0.2s ease;
}

.fade-enter, .fade-leave-to {
    opacity: 0;
}

.slide-enter-active, .slide-leave-active {
    transition: transform 0.2s ease, opacity 0.2s ease;
}

.slide-enter, .slide-leave-to {
    transform: translateY(10px);
    opacity: 0;
}
</style>