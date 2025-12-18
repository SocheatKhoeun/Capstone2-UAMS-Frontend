<template>
    <div class="specializations-page">
        <!-- Header -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-school" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Specialization Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Specializations</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ specializations.length }}</div>
                            <div class="stat-label">Total Specializations</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{specializations.filter(s => s.active).length}}</div>
                            <div class="stat-label">Active</div>
                        </div>
                    </div>
                </div>
                <div class="action-section">
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Specialization
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon icon="mdi-table" size="20" class="mr-2" />
                            Specialization Information
                        </h2>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search specializations..."
                                prepend-inner-icon="mdi-magnify" variant="outlined" density="compact" hide-details
                                clearable />
                        </div>
                    </div>
                </div>

                <!-- Table -->
                <v-table class="modern-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Name</th>
                            <th>Department</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="spec in filteredSpecializations" :key="spec.id">
                            <td>{{ spec.id }}</td>
                            <td>{{ spec.name }}</td>
                            <td>{{ getDepartmentName(spec.department_id) }}</td>
                            <td>
                                <v-chip :color="spec.active ? 'success' : 'error'" size="small">
                                    {{ spec.active ? 'Active' : 'Inactive' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-btn icon size="small" @click="openEditDialog(spec)">
                                    <v-icon color="#fde047">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon size="small" @click="deleteSpecialization(spec)" class="ml-1">
                                    <v-icon color="error">mdi-delete</v-icon>
                                </v-btn>
                            </td>
                        </tr>
                    </tbody>
                </v-table>
            </div>
        </div>

        <!-- Create/Edit Dialog -->
        <v-dialog v-model="dialogOpen" max-width="500" persistent>
            <v-card>
                <v-card-title>{{ isEdit ? 'Edit Specialization' : 'Add Specialization' }}</v-card-title>
                <v-card-text>
                    <v-form ref="formRef" v-model="formValid">
                        <v-text-field v-model="formData.name" label="Specialization Name *" :rules="nameRules"
                            variant="outlined" density="comfortable" />
                        <v-select v-model="formData.department_id" :items="departments" label="Department *"
                            :rules="departmentRules" variant="outlined" density="comfortable" item-title="name"
                            item-value="id" />
                        <v-switch v-model="formData.active" label="Active" color="primary" />
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-spacer />
                    <v-btn @click="dialogOpen = false">Cancel</v-btn>
                    <v-btn color="primary" :disabled="!formValid" :loading="formLoading" @click="submitForm">
                        {{ isEdit ? 'Update' : 'Create' }}
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admin'
})

const { $AdminPrivateAxios } = useNuxtApp()

const searchQuery = ref('')
const dialogOpen = ref(false)
const isEdit = ref(false)
const formValid = ref(false)
const formLoading = ref(false)
const formRef = ref(null)
const specializations = ref([])
const departments = ref([])
const selectedSpecialization = ref(null)

const formData = reactive({
    name: '',
    department_id: null,
    active: true
})

const nameRules = [
    v => !!v || 'Specialization name is required',
    v => v.length >= 2 || 'At least 2 characters'
]

const departmentRules = [
    v => v !== null && v !== undefined || 'Department is required'
]

onMounted(async () => {
    await fetchDepartments()
    await fetchSpecializations()
})

const fetchDepartments = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/departments/')
        const data = response.data.data || response.data || []
        departments.value = Array.isArray(data) ? data : data.items || []
    } catch (error) {
        console.error('Error fetching departments:', error)
    }
}

const fetchSpecializations = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/specializations/')
        const data = response.data.data || response.data || []
        specializations.value = Array.isArray(data) ? data : data.items || []
    } catch (error) {
        console.error('Error fetching specializations:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch specializations' })
    }
}

const getDepartmentName = (deptId) => {
    const dept = departments.value.find(d => d.id === deptId)
    return dept?.name || 'N/A'
}

const filteredSpecializations = computed(() => {
    if (!searchQuery.value) return specializations.value
    const q = searchQuery.value.toLowerCase()
    return specializations.value.filter(s => s.name?.toLowerCase().includes(q))
})

const openCreateDialog = () => {
    isEdit.value = false
    Object.assign(formData, { name: '', department_id: null, active: true })
    dialogOpen.value = true
}

const openEditDialog = (spec) => {
    isEdit.value = true
    selectedSpecialization.value = spec
    Object.assign(formData, {
        name: spec.name,
        department_id: spec.department_id,
        active: !!spec.active
    })
    dialogOpen.value = true
}

const submitForm = async () => {
    if (!formValid.value) return
    formLoading.value = true

    try {
        const payload = {
            name: formData.name,
            department_id: formData.department_id,
            active: formData.active
        }

        if (isEdit.value) {
            await $AdminPrivateAxios.patch(`/specializations/${selectedSpecialization.value.global_id}`, payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Specialization updated successfully', timer: 2000 })
        } else {
            await $AdminPrivateAxios.post('/specializations/', payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Specialization created successfully', timer: 2000 })
        }

        await fetchSpecializations()
        dialogOpen.value = false
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to save specialization' })
    } finally {
        formLoading.value = false
    }
}

const deleteSpecialization = async (spec) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Specialization?',
        text: `Are you sure you want to delete "${spec.name}"? This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            await $AdminPrivateAxios.post(`/specializations/${spec.global_id}/delete`)
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Specialization deleted successfully', timer: 2000 })
            await fetchSpecializations()
        } catch (error) {
            console.error('Error deleting specialization:', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to delete specialization' })
        }
    }
}
</script>

<style scoped>
.specializations-page {
    padding: 20px;
}

.modern-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 30px;
    border-radius: 12px;
    margin-bottom: 24px;
    color: white;
}

.header-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.title-wrapper {
    display: flex;
    gap: 16px;
    align-items: center;
}

.page-title {
    font-size: 28px;
    font-weight: 600;
    margin: 0;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
    opacity: 0.9;
}

.stats-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
    background: rgba(255, 255, 255, 0.2);
    padding: 16px 24px;
    border-radius: 8px;
    text-align: center;
}

.stat-number {
    font-size: 32px;
    font-weight: 700;
}

.stat-label {
    font-size: 14px;
    opacity: 0.9;
    margin-top: 4px;
}

.modern-table-section {
    background: white;
    border-radius: 12px;
    padding: 24px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
}

.table-title {
    font-size: 20px;
    font-weight: 600;
    display: flex;
    align-items: center;
}

.search-container {
    width: 300px;
}
</style>
