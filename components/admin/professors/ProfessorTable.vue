<template>
    <div class="prof-table-wrapper">
        <!-- If no permission -->
        <v-card v-if="!permissions.list" class="pt-card">
            <v-card-text class="text-center text-medium-emphasis">
                You do not have permission to view professors.
            </v-card-text>
        </v-card>
        <!-- Main table -->
        <v-card v-else class="pt-card">
            <!-- Top bar -->
            <div class="pt-header">
                <h2 class="pt-title">Professors</h2>

                <div class="pt-rows-per-page">
                    <span class="pt-rows-label">Rows per page:</span>
                    <v-select v-model="rowsPerPage" :items="[5, 10, 25, 50, 100]" density="compact" hide-details
                        variant="outlined" class="pt-rows-select" />
                </div>
            </div>
            <!-- Table -->
            <div class="pt-table-container">
                <table class="pt-table">
                    <thead>
                        <tr>
                            <th>NO</th>
                            <th>PROFESSOR ID</th>
                            <th>NAME</th>
                            <th>EMAIL</th>
                            <th>DEPARTMENT</th>
                            <th>STATUS</th>
                            <th>ACTION</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-if="paginatedProfessors.length === 0">
                            <td colspan="7" class="pt-empty">No professors found.</td>
                        </tr>

                        <tr v-for="(prof, index) in paginatedProfessors" :key="prof.id" class="pt-row">
                            <!-- No -->
                            <td class="pt-cell-number">
                                {{ startIndex + index + 1 }}
                            </td>
                            <!-- Data cells -->
                            <td class="pt-cell-text">
                                {{ prof.professor_code }}
                            </td>
                            <td class="pt-cell-text">
                                {{ prof.name }}
                            </td>
                            <td class="pt-cell-text">
                                {{ prof.email }}
                            </td>
                            <td class="pt-cell-text">
                                {{ prof.department || 'N/A' }}
                            </td>

                            <!-- Status -->
                            <td class="pt-cell-text">
                                <span class="pt-status-chip" :class="statusClass(prof.status)">
                                    {{ prof.status || 'N/A' }}
                                </span>
                            </td>
                            <td class="pt-cell-action">
                                <div class="pt-action-group">
                                    <!-- View -->
                                    <v-btn icon size="small" class="pt-btn pt-btn-view" @click="onView(prof)"
                                        :aria-label="`View professor ${prof.name}`">
                                        <v-icon size="18">mdi-eye</v-icon>
                                    </v-btn>

                                    <!-- Edit -->
                                    <v-btn v-if="permissions.edit" icon size="small" class="pt-btn pt-btn-edit"
                                        @click="onEdit(prof.id)" :aria-label="`Edit professor ${prof.name}`">
                                        <v-icon size="18">mdi-pencil</v-icon>
                                    </v-btn>

                                    <!-- Delete -->
                                    <v-btn v-if="permissions.delete" icon size="small" class="pt-btn pt-btn-delete"
                                        @click="onDelete(prof.id)" :aria-label="`Delete professor ${prof.name}`">
                                        <v-icon size="18">mdi-delete</v-icon>
                                    </v-btn>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <!-- Bottom pagination -->
            <div v-if="paginatedProfessors.length > 0" class="pt-pagination">
                <v-btn size="small" variant="outlined" :disabled="currentPage === 1" @click="goPrevious">
                    Previous
                </v-btn>


                <span class="pt-page-label">
                    Page {{ currentPage }} of {{ totalPages }}
                </span>

                <v-btn size="small" variant="outlined" :disabled="currentPage === totalPages" @click="goNext">
                    Next
                </v-btn>
            </div>
        </v-card>

        <!-- View dialog -->
        <v-dialog v-model="isViewDialogOpen" max-width="600px">
            <v-card>
                <v-card-title class="font-weight-bold">
                    Professor Details
                </v-card-title>
                <v-card-text v-if="selectedProfessor">
                    <div class="pt-details-grid">
                        <div>
                            <p><strong>Professor ID:</strong> {{ selectedProfessor.professor_code }}</p>
                            <p><strong>Name:</strong> {{ selectedProfessor.name }}</p>
                            <p><strong>Email:</strong> {{ selectedProfessor.email }}</p>
                        </div>
                        <div>
                            <p><strong>Department:</strong> {{ selectedProfessor.department || 'N/A' }}</p>
                            <p><strong>Phone:</strong> {{ selectedProfessor.phone || 'N/A' }}</p>
                            <p><strong>Status:</strong> {{ selectedProfessor.status || 'N/A' }}</p>
                        </div>
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
                    Are you sure you want to delete this professor? This action cannot
                    be undone.
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn variant="text" @click="closeDeleteDialog">Cancel</v-btn>
                    <v-btn color="error" @click="confirmDeleteProfessor">
                        Delete
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { computed, defineEmits, defineProps, ref, watch } from 'vue'

interface Professor {
    id: number | string
    professor_code: string
    name: string
    email: string
    department?: string
    phone?: string
    status?: string
}

interface Permissions {
    add: boolean
    edit: boolean
    delete: boolean
    list: boolean
}

const props = defineProps<{
    professors: Professor[]
    permissions: Permissions
}>()

const emit = defineEmits<{
    (e: 'edit', id: number | string): void
    (e: 'delete', id: number | string): void
    (e: 'view', prof: Professor): void
}>()

/* ---------- Pagination ---------- */
const rowsPerPage = ref(10)
const currentPage = ref(1)

const totalPages = computed(() => {
    const total = Math.ceil(props.professors.length / rowsPerPage.value)
    return total || 1
})

const startIndex = computed(
    () => (currentPage.value - 1) * rowsPerPage.value,
)

const paginatedProfessors = computed(() =>
    props.professors.slice(
        startIndex.value,
        startIndex.value + rowsPerPage.value,
    ),
)

watch(
    () => props.professors,
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

/* ---------- Status chip classes ---------- */
const statusClass = (status?: string) => {
    const s = (status || '').trim().toLowerCase()
    if (s === 'open' || s === 'active') return 'pt-status-open'
    if (s === 'in progress' || s === 'on leave') return 'pt-status-progress'
    if (s === 'close' || s === 'inactive') return 'pt-status-close'
    return 'pt-status-default'
}

/* ---------- View dialog ---------- */
const selectedProfessor = ref<Professor | null>(null)
const isViewDialogOpen = ref(false)

const onView = (prof: Professor) => {
    selectedProfessor.value = prof
    isViewDialogOpen.value = true
    emit('view', prof)
}


const closeViewDialog = () => {
    isViewDialogOpen.value = false
    selectedProfessor.value = null
}

/* ---------- Delete dialog ---------- */
const isDeleteDialogOpen = ref(false)
const deleteProfessorId = ref<number | string | null>(null)

const onDelete = (id: number | string) => {
    deleteProfessorId.value = id
    isDeleteDialogOpen.value = true
}

const closeDeleteDialog = () => {
    isDeleteDialogOpen.value = false
    deleteProfessorId.value = null
}

const confirmDeleteProfessor = () => {
    if (deleteProfessorId.value != null) {
        emit('delete', deleteProfessorId.value)
    }
    closeDeleteDialog()
}

/* ---------- Edit ---------- */
const onEdit = (id: number | string) => {
    emit('edit', id)
}
</script>

<style scoped>
/* Card wrapper similar to screenshot */
.prof-table-wrapper {
    width: 100%;
}

.pt-card {
    border-radius: 16px;
    box-shadow: 0 8px 24px rgba(15, 23, 42, 0.06);
    border: 1px solid #e5e7eb;
    width: 100%;
}

/* Header */
.pt-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px 8px 20px;
}

.pt-title {
    font-size: 18px;
    font-weight: 700;
    color: #111827;
}

.pt-rows-per-page {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pt-rows-label {
    font-size: 13px;
    color: #6b7280;
}

.pt-rows-select {
    max-width: 90px;
}

/* Table container */
.pt-table-container {
    width: 100%;
    overflow-x: auto;
    padding: 0 12px 12px 12px;
}

/* Table styling */
.pt-table {
    width: 100%;
    border-collapse: separate;
    border-spacing: 0;
    background: #ffffff;
}

.pt-table thead tr {
    background: #f5f5f7;
}

.pt-table th {
    padding: 12px 12px;
    font-size: 11px;
    font-weight: 700;
    color: #9ca3af;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    text-align: left;
}

.pt-table tbody tr:nth-child(even) {
    background-color: #fafafa;
}

.pt-table tbody tr:hover {
    background-color: #f3f4f6;
}

.pt-table td {
    padding: 12px 12px;
    font-size: 14px;
    color: #111827;
    border-top: 1px solid #e5e7eb;
}

.pt-cell-number {
    width: 60px;
}

.pt-cell-action {
    width: 140px;
}

/* Action buttons */
.pt-action-group {
    display: flex;
    align-items: center;
    gap: 8px;
}

.pt-btn {
    border-radius: 8px;
    min-width: 32px;
    height: 32px;
}

.pt-btn-view {
    background-color: #facc15;
    color: #ffffff;
}

.pt-btn-edit {
    background-color: #3b82f6;
    color: #ffffff;
}

.pt-btn-delete {
    background-color: #ef4444;
    color: #ffffff;
}

/* Status chip */
.pt-status-chip {
    display: inline-flex;
    align-items: center;
    padding: 4px 10px;
    border-radius: 999px;
    font-size: 12px;
    font-weight: 600;
}

/* Yellow "in progress" style */
.pt-status-progress {
    background-color: #fef3c7;
    color: #92400e;
}

/* Green "Open" style */
.pt-status-open {
    background-color: #dcfce7;
    color: #166534;
}

/* Red / closed / inactive */
.pt-status-close {
    background-color: #fee2e2;
    color: #b91c1c;
}

/* Default grey */
.pt-status-default {
    background-color: #e5e7eb;
    color: #374151;
}

/* Empty state */
.pt-empty {
    text-align: center;
    padding: 24px 12px;
    color: #9ca3af;
}

/* Pagination */
.pt-pagination {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 12px 20px 16px 20px;
    border-top: 1px solid #e5e7eb;
}

.pt-page-label {
    font-size: 13px;
    color: #4b5563;
}

/* Details grid in view dialog */
.pt-details-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px 24px;
    font-size: 14px;
}

@media (max-width: 768px) {
    .pt-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }

    .pt-rows-per-page {
        align-self: flex-end;
    }

    .pt-details-grid {
        grid-template-columns: 1fr;
    }
}
</style>
