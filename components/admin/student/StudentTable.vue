<template>
    <div class="student-table-wrapper">
        <!-- If no permission -->
        <v-card v-if="!permissions.list" class="st-card">
            <v-card-text class="text-center text-medium-emphasis">
                You do not have permission to view students.
            </v-card-text>
        </v-card>

        <!-- Main table -->
        <v-card v-else class="st-card">
            <!-- Top bar -->
            <div class="st-header">
                <h2 class="st-title">Students</h2>

                <div class="st-rows-per-page">
                    <span class="st-rows-label">Rows per page:</span>
                    <v-select v-model="rowsPerPage" :items="[5, 10, 25, 50, 100]" density="compact" hide-details
                        variant="outlined" class="st-rows-select" />
                </div>
            </div>

            <!-- Table -->
            <div class="st-table-container">
                <table class="st-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>STUDENT CODE</th>
                            <th>NAME</th>
                            <th>GENDER</th>
                            <th>GENERATION</th>
                            <th>GROUP</th>
                            <th>EMAIL</th>
                            <th>PHONE</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>

                    <tbody>
                        <tr v-if="paginatedStudents.length === 0">
                            <td colspan="11" class="st-empty">No students found.</td>
                        </tr>

                        <tr v-for="(student, index) in paginatedStudents" :key="student.id" class="st-row">
                            <!-- No -->
                            <td class="st-cell-number">
                                {{ startIndex + index + 1 }}
                            </td>

                            <td class="st-cell-text">
                                {{ student.student_code }}
                            </td>



                            <td class="st-cell-text">
                                {{ fullName(student) }}
                            </td>

                            <td class="st-cell-text">
                                {{ prettyGender(student.gender) }}
                            </td>

                            <td class="st-cell-text">
                                {{ generationLabel(student.generation_id) }}
                            </td>

                            <td class="st-cell-text">
                                {{ groupLabel(student.group_id) }}
                            </td>

                            <td class="st-cell-text">
                                {{ student.email }}
                            </td>

                            <td class="st-cell-text">
                                {{ student.phone_number || 'N/A' }}
                            </td>

                            <td class="st-cell-text">
                                <span class="st-status-chip" :class="statusClass(student.active)">
                                    {{ statusLabel(student.active) }}
                                </span>
                            </td>

                            <!-- Action buttons -->
                            <td class="st-cell-action">
                                <div class="st-action-group">
                                    <!-- View -->
                                    <v-btn icon size="small" class="st-btn st-btn-view" @click="onView(student)"
                                        :aria-label="`View student ${fullName(student)}`">
                                        <v-icon size="18">mdi-eye</v-icon>
                                    </v-btn>

                                    <!-- Edit -->
                                    <v-btn v-if="permissions.edit" icon size="small" class="st-btn st-btn-edit"
                                        @click="onEdit(student.id)" :aria-label="`Edit student ${fullName(student)}`">
                                        <v-icon size="18">mdi-pencil</v-icon>
                                    </v-btn>


                                    <!-- Delete -->
                                    <v-btn v-if="permissions.delete" icon size="small" class="st-btn st-btn-delete"
                                        @click="onDelete(student.id)"
                                        :aria-label="`Delete student ${fullName(student)}`">
                                        <v-icon size="18">mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom pagination -->
            <div v-if="paginatedStudents.length > 0" class="st-pagination">
                <v-btn size="small" variant="outlined" :disabled="currentPage === 1" @click="goPrevious">
                    Previous
                </v-btn>

                <span class="st-page-label">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>

                <v-btn size="small" variant="outlined" :disabled="currentPage === totalPages" @click="goNext">
                    Next
                </v-btn>
            </div>
        </v-card>

        <!-- View dialog -->
        <v-dialog v-model="isViewDialogOpen" max-width="700px">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Student Details
                </v-card-title>
                <v-card-text v-if="selectedStudent">
                    <div class="st-details-grid">
                        <div>
                            <p><strong>Student Code:</strong> {{ selectedStudent.student_code }}</p>
                            <p><strong>Name:</strong> {{ fullName(selectedStudent) }}</p>
                            <p><strong>Gender:</strong> {{ prettyGender(selectedStudent.gender) }}</p>
                            <p><strong>DOB:</strong> {{ dobLabel(selectedStudent.dob) }}</p>
                        </div>
                        <div>
                            <p><strong>Email:</strong> {{ selectedStudent.email }}</p>
                            <p><strong>Phone:</strong> {{ selectedStudent.phone_number || 'N/A' }}</p>
                            <p><strong>Generation:</strong> {{ generationLabel(selectedStudent.generation_id) }}</p>
                            <p><strong>Group:</strong> {{ groupLabel(selectedStudent.group_id) }}</p>
                            <p><strong>Status:</strong> {{ statusLabel(selectedStudent.active) }}</p>
                        </div>
                    </div>
                    <div class="mt-4">
                        <p><strong>Address:</strong></p>
                        <p>{{ selectedStudent.address || 'N/A' }}</p>
                    </div>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn color="primary" @click="closeViewDialog">
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Delete confirm dialog -->
        <v-dialog v-model="isDeleteDialogOpen" max-width="420px">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Confirm Deletion
                </v-card-title>
                <v-card-text>
                    Are you sure you want to delete this student? This action cannot
                    be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeDeleteDialog">Cancel</v-btn>
                    <v-btn color="error" @click="confirmDeleteStudent">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

interface Student {
    id: number | string
    global_id: string
    student_code: string
    first_name: string
    last_name: string
    gender?: string | null    // gender_enum
    dob?: string | null       // ISO string like '2000-01-15'
    email: string
    phone_number?: string | null
    address?: string | null
    profile_image?: string | null
    generation_id?: number | null
    group_id?: number | null
    active?: number | boolean | null
}

interface Permissions {
    add: boolean
    edit: boolean
    delete: boolean
    list: boolean
}

const props = defineProps<{
    students: Student[]
    permissions: Permissions
}>()


const emit = defineEmits<{
    (e: 'edit', id: number | string): void
    (e: 'delete', id: number | string): void
    (e: 'view', student: Student): void
}>()

/* ---------- Pagination ---------- */
const rowsPerPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => {
    const total = Math.ceil(props.students.length / rowsPerPage.value)
    return total || 1
})

const startIndex = computed(
    () => (currentPage.value - 1) * rowsPerPage.value,
)

const paginatedStudents = computed(() =>
    props.students.slice(
        startIndex.value,
        startIndex.value + rowsPerPage.value,
    ),
)

watch(
    () => props.students,
    () => {
        currentPage.value = 1
    },
    { deep: true },
)

const goPrevious = () => {
    if (currentPage.value > 1) currentPage.value--
}
const goNext = () => {
    if (currentPage.value < totalPages.value) currentPage.value++
}

/* ---------- Helpers ---------- */
const fullName = (s: Student) =>
    [s.first_name, s.last_name].filter(Boolean).join(' ')

const prettyGender = (g?: string | null) => {
    if (!g) return 'N/A'
    const val = g.toLowerCase()
    if (val === 'male') return 'Male'
    if (val === 'female') return 'Female'
    return val.charAt(0).toUpperCase() + val.slice(1)
}

const dobLabel = (dob?: string | null) => {
    if (!dob) return 'N/A'
    // assume 'YYYY-MM-DD'
    try {
        return new Date(dob).toLocaleDateString()
    } catch {
        return dob
    }
}

const generationLabel = (id?: number | null) =>
    id ? `Generation ${id}` : 'N/A'

const groupLabel = (id?: number | null) =>
    id ? `Group ${id}` : 'N/A'

const statusLabel = (active?: number | boolean | null) =>
    active === 1 || active === true ? 'Active' : 'Inactive'

const statusClass = (active?: number | boolean | null) => {
    const isActive = active === 1 || active === true
    return isActive ? 'st-status-open' : 'st-status-close'
}

/* ---------- View dialog ---------- */
const selectedStudent = ref<Student | null>(null)
const isViewDialogOpen = ref(false)

const onView = (student: Student) => {
    selectedStudent.value = student
    isViewDialogOpen.value = true
    emit('view', student)
}

const closeViewDialog = () => {
    isViewDialogOpen.value = false
    selectedStudent.value = null
}

/* ---------- Delete dialog ---------- */
const isDeleteDialogOpen = ref(false)
const deleteStudentId = ref<number | string | null>(null)

const onDelete = (id: number | string) => {
    deleteStudentId.value = id
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    deleteStudentId.value = null
}

const confirmDeleteStudent = () => {
    if (deleteStudentId.value != null) {
        emit('delete', deleteStudentId.value)
    }
    closeDeleteDialog()
}

/* ---------- Edit ---------- */
const onEdit = (id: number | string) => {
    emit('edit', id)
}
</script>

<style scoped>
.student-table-wrapper {
    width: 100%;
}

/* Card wrapper similar to professor design */
.st-card {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    border: 1px solid #e5e7eb;
    width: 100%;
}

/* Header */
.st-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;
}

.st-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.st-rows-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.st-rows-label {
    font-size: 13px;
    color: #6b7280;
}

.st-rows-select {
    max-width: 90px;
}

/* Table container */
.st-table-container {
    width: 100%;
    overflow-x: auto;
    padding: 0 12px 12px 12px;
}

/* Table styling */
.st-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #ffffff;
}

.st-table thead tr {
    background: #f5f5f7;
}

.st-table th {
    padding: 12px 12px;
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: left;
}

.st-table tbody tr:nth-child(even) {
    background-color: #fafafa;
}

.st-table tbody tr:hover {
    background-color: #f3f4f6;
}


.st-table td {
    padding: 12px 12px;
    font-size: 14px;
    color: #111827;
    border-top: 1px solid #e5e7eb;
}

.st-cell-number {
    width: 60px;
}

.st-cell-action {
    width: 160px;
}

/* Action buttons */
.st-action-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.st-btn {
    border-radius: 8px;
    min-width: 32px;
    height: 32px;
}

.st-btn-view {
    background-color: #facc15;
    color: #ffffff;
}

.st-btn-edit {
    background-color: #3b82f6;
    color: #ffffff;
}

.st-btn-delete {
    background-color: #ef4444;
    color: #ffffff;
}

/* Status chip */
.st-status-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

/* Active */
.st-status-open {
    background-color: #dcfce7;
    color: #166534;
}

/* Inactive */
.st-status-close {
    background-color: #fee2e2;
    color: #b91c1c;
}

/* Empty state */
.st-empty {
    text-align: center;
    padding: 24px 12px;
    color: #9ca3af;
}

/* Pagination */
.st-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px 20px;
    border-top: 1px solid #e5e7eb;
}

.st-page-label {
    font-size: 13px;
    color: #4b5563;
}

/* Details grid in view dialog */
.st-details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 24px;
    font-size: 14px;
}

@media (max-width: 768px) {
    .st-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .st-rows-per-page {
        align-self: flex-end;
    }

    .st-details-grid {
        grid-template-columns: 1fr;
    }
}
</style>
