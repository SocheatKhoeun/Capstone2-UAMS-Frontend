<template>
    <v-container fluid class="pa-6 bg-grey-lighten-4">
        <!-- Modern Page Header with Stats -->
        <v-row class="mb-6">
            <v-col cols="12">
                <v-card class="rounded-xl elevation-0 border">
                    <v-card-text class="pa-6">
                        <div class="d-flex justify-space-between align-center flex-wrap">
                            <div>
                                <h1 class="text-h4 font-weight-bold text-primary mb-2">
                                    <v-icon size="36" color="primary" class="mr-3">mdi-door</v-icon>
                                    Room Management
                                </h1>
                                <p class="text-subtitle-1 text-medium-emphasis mb-0">
                                    Manage rooms, capacity, and room assignments
                                </p>
                            </div>
                            <v-btn color="primary" size="large" variant="flat" class="px-6 rounded-lg" elevation="0"
                                @click="openAddDialog">
                                <v-icon left>mdi-plus</v-icon>
                                Add New Room
                            </v-btn>
                        </div>

                        <!-- Stats Cards -->
                        <v-row class="mt-4">
                            <v-col cols="12" sm="6" md="3">
                                <div class="stat-card pa-4 rounded-lg bg-blue-lighten-5">
                                    <div class="d-flex align-center">
                                        <v-avatar color="blue" size="56" class="mr-3">
                                            <v-icon size="28" color="white">mdi-door</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-h5 font-weight-bold text-blue">{{ totalRooms }}</div>
                                            <div class="text-caption text-medium-emphasis">Total Rooms</div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <div class="stat-card pa-4 rounded-lg bg-green-lighten-5">
                                    <div class="d-flex align-center">
                                        <v-avatar color="green" size="56" class="mr-3">
                                            <v-icon size="28" color="white">mdi-check-circle</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-h5 font-weight-bold text-green">{{ activeRooms }}</div>
                                            <div class="text-caption text-medium-emphasis">Available Rooms</div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <div class="stat-card pa-4 rounded-lg bg-orange-lighten-5">
                                    <div class="d-flex align-center">
                                        <v-avatar color="orange" size="56" class="mr-3">
                                            <v-icon size="28" color="white">mdi-seat</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-h5 font-weight-bold text-orange">{{ totalCapacity }}
                                            </div>
                                            <div class="text-caption text-medium-emphasis">Total Capacity</div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                            <v-col cols="12" sm="6" md="3">
                                <div class="stat-card pa-4 rounded-lg bg-purple-lighten-5">
                                    <div class="d-flex align-center">
                                        <v-avatar color="purple" size="56" class="mr-3">
                                            <v-icon size="28" color="white">mdi-office-building</v-icon>
                                        </v-avatar>
                                        <div>
                                            <div class="text-h5 font-weight-bold text-purple">{{ occupiedRooms }}
                                            </div>
                                            <div class="text-caption text-medium-emphasis">Currently Occupied</div>
                                        </div>
                                    </div>
                                </div>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Table Card -->
        <v-card class="rounded-xl elevation-0 border">
            <!-- Toolbar -->
            <v-card-title class="pa-6 border-b">
                <v-row align="center" no-gutters>
                    <v-col cols="12" md="4">
                        <v-text-field v-model="search" density="comfortable" variant="outlined" label="Search rooms..."
                            prepend-inner-icon="mdi-magnify" single-line hide-details class="rounded-lg"
                            bg-color="grey-lighten-5" />
                    </v-col>
                    <v-col cols="12" md="8" class="d-flex justify-end align-center flex-wrap ga-2">
                        <v-select v-model="selectedYear" :items="yearOptions" density="comfortable" variant="outlined"
                            label="Filter by Year" prepend-inner-icon="mdi-calendar" hide-details
                            class="rounded-lg filter-select" bg-color="grey-lighten-5" style="max-width: 200px;" />
                        <v-select v-model="selectedTerm" :items="termOptions" density="comfortable" variant="outlined"
                            label="Filter by Term" prepend-inner-icon="mdi-book-clock" hide-details
                            class="rounded-lg filter-select" bg-color="grey-lighten-5" style="max-width: 200px;" />
                        <v-select v-model="selectedType" :items="typeOptions" density="comfortable" variant="outlined"
                            label="Filter by Type" prepend-inner-icon="mdi-shape" hide-details
                            class="rounded-lg filter-select" bg-color="grey-lighten-5" style="max-width: 200px;" />
                        <v-btn variant="text" color="primary" @click="clearFilters" size="small">
                            <v-icon left>mdi-filter-off</v-icon>
                            Clear
                        </v-btn>
                    </v-col>
                </v-row>
            </v-card-title>

            <!-- Custom Table -->
            <v-table class="custom-table">
                <thead>
                    <tr>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-book-open-variant</v-icon>
                            CLASS INFO
                        </th>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-account-tie</v-icon>
                            INSTRUCTOR
                        </th>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-calendar-range</v-icon>
                            TERM & YEAR
                        </th>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-clock-time-four</v-icon>
                            SCHEDULE
                        </th>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-map-marker</v-icon>
                            ROOM
                        </th>
                        <th class="text-left font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-account-group</v-icon>
                            GROUP
                        </th>
                        <th class="text-center font-weight-bold">
                            <v-icon size="small" class="mr-1">mdi-cog</v-icon>
                            ACTIONS
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-if="loading">
                        <td colspan="7" class="text-center py-8">
                            <v-progress-circular indeterminate color="primary" size="64" />
                            <p class="text-subtitle-1 mt-4 text-medium-emphasis">Loading rooms...</p>
                        </td>
                    </tr>
                    <tr v-else-if="filteredClasses.length === 0">
                        <td colspan="7" class="text-center py-12">
                            <v-icon size="64" color="grey">mdi-folder-open-outline</v-icon>
                            <p class="text-h6 mt-4 text-medium-emphasis">No rooms found</p>
                            <p class="text-body-2 text-medium-emphasis">Try adjusting your search or filters</p>
                        </td>
                    </tr>
                    <tr v-else v-for="item in paginatedClasses" :key="item.id"
                        class="table-row hover-effect cursor-pointer">
                        <!-- Class Info -->
                        <td>
                            <div class="d-flex align-center py-2">
                                <v-avatar :color="getTypeColor(item.classType)" size="48" class="mr-3">
                                    <v-icon color="white">{{ getTypeIcon(item.classType) }}</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="font-weight-bold text-body-1">{{ item.subject }}</div>
                                    <div class="text-caption text-medium-emphasis">
                                        <v-chip size="x-small" :color="getTypeColor(item.classType)" variant="flat"
                                            class="mr-1">
                                            {{ item.code }}
                                        </v-chip>
                                        <v-chip size="x-small" :color="getTypeColor(item.classType)" variant="outlined">
                                            {{ item.classType }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </td>

                        <!-- Instructor -->
                        <td>
                            <div class="d-flex align-center">
                                <v-avatar color="blue-grey-lighten-4" size="32" class="mr-2">
                                    <v-icon size="18" color="blue-grey">mdi-account</v-icon>
                                </v-avatar>
                                <div>
                                    <div class="font-weight-medium">{{ item.lecturerName }}</div>
                                    <div class="text-caption text-medium-emphasis">{{ item.instructor_id || 'N/A' }}</div>
                                </div>
                            </div>
                        </td>

                        <!-- Term & Year -->
                        <td>
                            <div>
                                <v-chip :color="getTermColor(item.term)" variant="tonal" size="small" class="mb-1">
                                    <v-icon left size="small">mdi-book-clock</v-icon>
                                    {{ item.term }}
                                </v-chip>
                                <div class="text-caption text-medium-emphasis mt-1">
                                    Year {{ item.year }} • Gen {{ item.generation }}
                                </div>
                            </div>
                        </td>

                        <!-- Schedule -->
                        <td>
                            <div class="text-body-2">
                                <div v-if="item.schedule && item.schedule !== 'Not scheduled'">
                                    <div class="d-flex align-center">
                                        <v-icon size="16" class="mr-1" color="primary">mdi-clock-outline</v-icon>
                                        <span class="font-weight-medium">{{ item.schedule }}</span>
                                    </div>
                                </div>
                                <span v-else class="text-medium-emphasis">Not scheduled</span>
                            </div>
                        </td>

                        <!-- Room -->
                        <td>
                            <div v-if="item.room">
                                <v-chip color="indigo" variant="outlined" size="small">
                                    <v-icon left size="small">mdi-door</v-icon>
                                    {{ item.room }}
                                </v-chip>
                            </div>
                            <span v-else class="text-medium-emphasis">No room</span>
                        </td>

                        <!-- Group -->
                        <td>
                            <v-chip v-if="item.group" color="purple" variant="tonal" size="small">
                                <v-icon left size="small">mdi-account-group</v-icon>
                                {{ item.group }}
                            </v-chip>
                            <span v-else class="text-medium-emphasis">No group</span>
                        </td>

                        <!-- Actions -->
                        <td>
                            <div class="d-flex justify-center ga-1">
                                <v-tooltip text="View Details" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" icon size="small" variant="text" color="info"
                                            @click="viewClass(item)">
                                            <v-icon size="20">mdi-eye</v-icon>
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="Edit Room" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" icon size="small" variant="text" color="warning"
                                            @click="editClass(item)">
                                            <v-icon size="20">mdi-pencil</v-icon>
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                                <v-tooltip text="Delete Room" location="top">
                                    <template v-slot:activator="{ props }">
                                        <v-btn v-bind="props" icon size="small" variant="text" color="error"
                                            @click="confirmDelete(item)">
                                            <v-icon size="20">mdi-delete</v-icon>
                                        </v-btn>
                                    </template>
                                </v-tooltip>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </v-table>

            <!-- Pagination -->
            <v-card-actions class="justify-space-between pa-4 border-t">
                <div class="text-body-2 text-medium-emphasis">
                    Showing {{ startIndex + 1 }} to {{ endIndex }} of {{ filteredClasses.length }} rooms
                </div>
                <v-pagination v-model="page" :length="totalPages" :total-visible="7" density="comfortable"
                    active-color="primary" variant="flat" rounded="lg" />
            </v-card-actions>
        </v-card>

        <!-- Add/Edit Dialog -->
        <v-dialog v-model="dialog" max-width="900px" persistent scrollable>
            <v-card class="rounded-xl">
                <v-card-title class="pa-6 bg-primary">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon size="28" color="white" class="mr-3">
                                {{ isEdit ? 'mdi-pencil' : 'mdi-plus-circle' }}
                            </v-icon>
                            <span class="text-h5 font-weight-bold text-white">
                                {{ isEdit ? 'Edit Room' : 'Add New Room' }}
                            </span>
                        </div>
                        <v-btn icon variant="text" @click="closeDialog" color="white">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-6" style="max-height: 600px;">
                    <ClassForm ref="classForm" :initial-data="editedItem" @submit="saveRoom" />
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-6">
                    <v-spacer />
                    <v-btn variant="outlined" size="large" @click="closeDialog" class="px-6 rounded-lg">
                        Cancel
                    </v-btn>
                    <v-btn color="primary" variant="flat" size="large" @click="submitForm" :loading="loading"
                        class="px-8 rounded-lg">
                        <v-icon left>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
                        {{ isEdit ? 'Save Changes' : 'Create Room' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- View Dialog -->
        <v-dialog v-model="viewDialog" max-width="700px">
            <v-card class="rounded-xl">
                <v-card-title class="pa-6 bg-info">
                    <div class="d-flex align-center justify-space-between">
                        <div class="d-flex align-center">
                            <v-icon size="28" color="white" class="mr-3">mdi-information</v-icon>
                            <span class="text-h5 font-weight-bold text-white">Room Details</span>
                        </div>
                        <v-btn icon variant="text" @click="viewDialog = false" color="white">
                            <v-icon>mdi-close</v-icon>
                        </v-btn>
                    </div>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-6" v-if="selectedClass">
                    <v-row>
                        <!-- Basic Info Section -->
                        <v-col cols="12">
                            <div class="d-flex align-center mb-4">
                                <v-avatar :color="getTypeColor(selectedClass.classType)" size="64" class="mr-4">
                                    <v-icon color="white" size="32">{{ getTypeIcon(selectedClass.classType) }}</v-icon>
                                </v-avatar>
                                <div>
                                    <h2 class="text-h5 font-weight-bold">{{ selectedClass.subject }}</h2>
                                    <div class="mt-1">
                                        <v-chip size="small" :color="getTypeColor(selectedClass.classType)"
                                            variant="flat" class="mr-1">
                                            {{ selectedClass.code }}
                                        </v-chip>
                                        <v-chip size="small" :color="getTypeColor(selectedClass.classType)"
                                            variant="outlined">
                                            {{ selectedClass.classType }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-divider class="my-2" />
                        </v-col>

                        <!-- Details Grid -->
                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-account-tie</v-icon>
                                    Instructor
                                </div>
                                <div class="detail-value">{{ selectedClass.lecturerName }}</div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-book-clock</v-icon>
                                    Term
                                </div>
                                <div class="detail-value">
                                    <v-chip :color="getTermColor(selectedClass.term)" variant="tonal" size="small">
                                        {{ selectedClass.term }}
                                    </v-chip>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-calendar</v-icon>
                                    Academic Year
                                </div>
                                <div class="detail-value">Year {{ selectedClass.year }}</div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-school</v-icon>
                                    Generation
                                </div>
                                <div class="detail-value">Generation {{ selectedClass.generation }}</div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-map-marker</v-icon>
                                    Room
                                </div>
                                <div class="detail-value">
                                    <v-chip v-if="selectedClass.room" color="indigo" variant="outlined" size="small">
                                        {{ selectedClass.room }}
                                    </v-chip>
                                    <span v-else class="text-medium-emphasis">Not assigned</span>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" sm="6">
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-account-group</v-icon>
                                    Group
                                </div>
                                <div class="detail-value">
                                    <v-chip v-if="selectedClass.group" color="purple" variant="tonal" size="small">
                                        {{ selectedClass.group }}
                                    </v-chip>
                                    <span v-else class="text-medium-emphasis">No group</span>
                                </div>
                            </div>
                        </v-col>

                        <v-col cols="12" v-if="selectedClass.schedule && selectedClass.schedule !== 'Not scheduled'">
                            <v-divider class="my-2" />
                            <div class="detail-item">
                                <div class="detail-label mb-2">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-clock-time-four</v-icon>
                                    Schedule
                                </div>
                                <v-card variant="outlined" class="pa-3 bg-grey-lighten-5">
                                    <div class="d-flex align-center">
                                        <v-icon color="primary" class="mr-2">mdi-clock-outline</v-icon>
                                        <span class="font-weight-medium">{{ selectedClass.schedule }}</span>
                                    </div>
                                </v-card>
                            </div>
                        </v-col>

                        <v-col cols="12">
                            <v-divider class="my-2" />
                            <div class="detail-item">
                                <div class="detail-label">
                                    <v-icon size="20" class="mr-2" color="primary">mdi-information</v-icon>
                                    Department
                                </div>
                                <div class="detail-value">{{ selectedClass.department || 'Not specified' }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-6">
                    <v-spacer />
                    <v-btn variant="outlined" size="large" @click="viewDialog = false" class="px-6 rounded-lg">
                        Close
                    </v-btn>
                    <v-btn color="warning" variant="flat" size="large" @click="editFromView"
                        class="px-6 rounded-lg">
                        <v-icon left>mdi-pencil</v-icon>
                        Edit Room
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="500px">
            <v-card class="rounded-xl">
                <v-card-title class="pa-6 bg-error">
                    <div class="d-flex align-center">
                        <v-icon size="28" color="white" class="mr-3">mdi-alert-circle</v-icon>
                        <span class="text-h5 font-weight-bold text-white">Confirm Delete</span>
                    </div>
                </v-card-title>

                <v-divider />

                <v-card-text class="pa-6">
                    <div class="text-center py-4">
                        <v-icon size="64" color="error">mdi-delete-alert</v-icon>
                        <h3 class="text-h6 mt-4 mb-2">Are you sure you want to delete this room?</h3>
                        <p class="text-body-2 text-medium-emphasis mb-4">
                            This will permanently delete the room "{{ deleteItem?.room }}".
                            This action cannot be undone.
                        </p>
                        <v-alert type="warning" variant="tonal" density="compact">
                            All related room assignments will be removed.
                        </v-alert>
                    </div>
                </v-card-text>

                <v-divider />

                <v-card-actions class="pa-6">
                    <v-spacer />
                    <v-btn variant="outlined" size="large" @click="deleteDialog = false" class="px-6 rounded-lg">
                        Cancel
                    </v-btn>
                    <v-btn color="error" variant="flat" size="large" @click="deleteRoom" :loading="loading"
                        class="px-6 rounded-lg">
                        <v-icon left>mdi-delete</v-icon>
                        Delete Room
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </v-container>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useClassStore } from '~/store/useClassStore'
import ClassForm from '~/components/admin/ClassForm.vue'

definePageMeta({
    layout: 'admin',
    middleware: 'auth'
})

const classStore = useClassStore()

// State
const search = ref('')
const dialog = ref(false)
const viewDialog = ref(false)
const deleteDialog = ref(false)
const page = ref(1)
const itemsPerPage = ref(10)
const selectedYear = ref('All')
const selectedTerm = ref('All')
const selectedType = ref('All')
const isEdit = ref(false)
const editedItem = ref(null)
const selectedClass = ref(null)
const deleteItem = ref(null)
const classForm = ref(null)

// Computed
const loading = computed(() => classStore.loading)

const classes = computed(() => classStore.classes || [])

const filteredClasses = computed(() => {
    let filtered = classes.value

    // Search filter
    if (search.value) {
        const searchLower = search.value.toLowerCase()
        filtered = filtered.filter(item =>
            item.subject?.toLowerCase().includes(searchLower) ||
            item.code?.toLowerCase().includes(searchLower) ||
            item.lecturerName?.toLowerCase().includes(searchLower)
        )
    }

    // Year filter
    if (selectedYear.value !== 'All') {
        filtered = filtered.filter(item => item.year === selectedYear.value)
    }

    // Term filter
    if (selectedTerm.value !== 'All') {
        filtered = filtered.filter(item => item.term === selectedTerm.value)
    }

    // Type filter
    if (selectedType.value !== 'All') {
        filtered = filtered.filter(item => item.classType === selectedType.value)
    }

    return filtered
})

const paginatedClasses = computed(() => {
    const start = (page.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredClasses.value.slice(start, end)
})

const totalPages = computed(() => {
    return Math.ceil(filteredClasses.value.length / itemsPerPage.value)
})

const startIndex = computed(() => {
    return (page.value - 1) * itemsPerPage.value
})

const endIndex = computed(() => {
    const end = startIndex.value + itemsPerPage.value
    return Math.min(end, filteredClasses.value.length)
})

// Stats
const totalClasses = computed(() => classes.value.length)
const activeClasses = computed(() => classes.value.filter(c => c.active).length)
const currentTermClasses = computed(() => {
    const currentTerm = 'Fall 2024' // You can make this dynamic
    return classes.value.filter(c => c.term === currentTerm).length
})
const totalInstructors = computed(() => {
    const instructors = new Set(classes.value.map(c => c.instructor_id).filter(Boolean))
    return instructors.size
})

// Filter options
const yearOptions = computed(() => {
    const years = ['All', ...new Set(classes.value.map(c => c.year).filter(Boolean))]
    return years.sort()
})

const termOptions = computed(() => {
    const terms = ['All', ...new Set(classes.value.map(c => c.term).filter(Boolean))]
    return terms
})

const typeOptions = computed(() => {
    const types = ['All', ...new Set(classes.value.map(c => c.classType).filter(Boolean))]
    return types
})

// Methods
const openAddDialog = () => {
    isEdit.value = false
    editedItem.value = null
    dialog.value = true
}

const editClass = (item) => {
    isEdit.value = true
    editedItem.value = { ...item }
    dialog.value = true
}

const viewClass = (item) => {
    selectedClass.value = item
    viewDialog.value = true
}

const editFromView = () => {
    viewDialog.value = false
    editClass(selectedClass.value)
}

const closeDialog = () => {
    dialog.value = false
    setTimeout(() => {
        editedItem.value = null
        isEdit.value = false
    }, 300)
}

const submitForm = () => {
    if (classForm.value) {
        classForm.value.submit()
    }
}

const saveRoom = async (classData) => {
    try {
        if (isEdit.value) {
            await classStore.updateClass(editedItem.value.global_id, classData)
        } else {
            await classStore.createClass(classData)
        }
        closeDialog()
    } catch (error) {
        console.error('Error saving room:', error)
    }
}

const confirmDelete = (item) => {
    deleteItem.value = item
    deleteDialog.value = true
}

const deleteRoom = async () => {
    try {
        await classStore.deleteClass(deleteItem.value.global_id)
        deleteDialog.value = false
        deleteItem.value = null
    } catch (error) {
        console.error('Error deleting room:', error)
    }
}

const clearFilters = () => {
    selectedYear.value = 'All'
    selectedTerm.value = 'All'
    selectedType.value = 'All'
    search.value = ''
}

// Helper functions
const getTypeColor = (type) => {
    const colors = {
        'Lecture': 'blue',
        'Lab': 'green',
        'Tutorial': 'orange',
        'Seminar': 'purple',
        'Workshop': 'teal',
        'Theory': 'indigo',
        'Practical': 'cyan'
    }
    return colors[type] || 'grey'
}

const getTypeIcon = (type) => {
    const icons = {
        'Lecture': 'mdi-school',
        'Lab': 'mdi-flask',
        'Tutorial': 'mdi-account-group',
        'Seminar': 'mdi-presentation',
        'Workshop': 'mdi-tools',
        'Theory': 'mdi-book-open-variant',
        'Practical': 'mdi-wrench'
    }
    return icons[type] || 'mdi-book'
}

const getTermColor = (term) => {
    const colors = {
        'Fall': 'orange',
        'Spring': 'green',
        'Summer': 'blue',
        'Winter': 'cyan'
    }
    const season = term?.split(' ')[0]
    return colors[season] || 'grey'
}

// Lifecycle
onMounted(() => {
    classStore.fetchClasses()
})
</script>

<style scoped>
.stat-card {
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.custom-table {
    background: white;
}

.custom-table thead tr th {
    background-color: #f5f5f5;
    color: #424242;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
    padding: 16px;
    border-bottom: 2px solid #e0e0e0 !important;
}

.custom-table tbody tr {
    transition: all 0.2s ease;
}

.custom-table tbody tr:hover {
    background-color: #f5f5f5;
}

.custom-table tbody tr td {
    padding: 12px 16px;
    border-bottom: 1px solid #e0e0e0;
}

.filter-select {
    min-width: 150px;
}

.detail-item {
    padding: 8px 0;
}

.detail-label {
    font-size: 0.875rem;
    color: rgba(0, 0, 0, 0.6);
    font-weight: 500;
    margin-bottom: 4px;
    display: flex;
    align-items: center;
}

.detail-value {
    font-size: 1rem;
    color: rgba(0, 0, 0, 0.87);
    font-weight: 500;
}

.border {
    border: 1px solid #e0e0e0 !important;
}

.border-b {
    border-bottom: 1px solid #e0e0e0 !important;
}

.border-t {
    border-top: 1px solid #e0e0e0 !important;
}
</style>
