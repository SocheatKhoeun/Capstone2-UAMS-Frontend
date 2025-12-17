<template>
    <div class="generations-page">
        <!-- Header -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-calendar-clock" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Generation Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Generations</span>
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ generations.length }}</div>
                            <div class="stat-label">Total Generations</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{generations.filter(g => g.active).length}}</div>
                            <div class="stat-label">Active</div>
                        </div>
                    </div>
                </div>
                <div class="action-section">
                    <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
                        @click="openCreateDialog" elevation="2">
                        Add Generation
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
                            Generation Information
                        </h2>
                    </div>
                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field v-model="searchQuery" placeholder="Search generations..."
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
                            <th>Start Year</th>
                            <th>End Year</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="gen in filteredGenerations" :key="gen.id">
                            <td>{{ gen.id }}</td>
                            <td>{{ gen.generation }}</td>
                            <td>{{ gen.start_year || 'N/A' }}</td>
                            <td>{{ gen.end_year || 'N/A' }}</td>
                            <td>
                                <v-chip :color="gen.active ? 'success' : 'error'" size="small">
                                    {{ gen.active ? 'Active' : 'Inactive' }}
                                </v-chip>
                            </td>
                            <td>
                                <v-btn icon size="small" @click="openEditDialog(gen)">
                                    <v-icon color="#fde047">mdi-pencil</v-icon>
                                </v-btn>
                                <v-btn icon size="small" @click="deleteGeneration(gen)" class="ml-1">
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
                <v-card-title>{{ isEdit ? 'Edit Generation' : 'Add Generation' }}</v-card-title>
                <v-card-text>
                    <v-form ref="formRef" v-model="formValid">
                        <v-text-field v-model="formData.generation" label="Generation Name *" :rules="nameRules"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.start_year" label="Start Year" type="number"
                            variant="outlined" density="comfortable" />
                        <v-text-field v-model.number="formData.end_year" label="End Year" type="number"
                            variant="outlined" density="comfortable" />
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
const generations = ref([])
const selectedGeneration = ref(null)

const formData = reactive({
    generation: '',
    start_year: null,
    end_year: null,
    active: true
})

const nameRules = [
    v => !!v || 'Generation name is required',
    v => v.length >= 2 || 'At least 2 characters'
]

onMounted(async () => {
    await fetchGenerations()
})

const fetchGenerations = async () => {
    try {
        const response = await $AdminPrivateAxios.get('/generations/')
        generations.value = response.data.data || response.data || []
    } catch (error) {
        console.error('Error fetching generations:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: 'Failed to fetch generations' })
    }
}

const filteredGenerations = computed(() => {
    if (!searchQuery.value) return generations.value
    const q = searchQuery.value.toLowerCase()
    return generations.value.filter(g => g.generation?.toLowerCase().includes(q))
})

const openCreateDialog = () => {
    isEdit.value = false
    Object.assign(formData, { generation: '', start_year: null, end_year: null, active: true })
    dialogOpen.value = true
}

const openEditDialog = (gen) => {
    isEdit.value = true
    selectedGeneration.value = gen
    Object.assign(formData, {
        generation: gen.generation,
        start_year: gen.start_year,
        end_year: gen.end_year,
        active: gen.active === 1
    })
    dialogOpen.value = true
}

const submitForm = async () => {
    if (!formValid.value) return
    formLoading.value = true

    try {
        const payload = {
            generation: formData.generation,
            start_year: formData.start_year,
            end_year: formData.end_year,
            active: formData.active ? 1 : 0
        }

        if (isEdit.value) {
            await $AdminPrivateAxios.patch(`/generations/${selectedGeneration.value.global_id}`, payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Generation updated successfully', timer: 2000 })
        } else {
            await $AdminPrivateAxios.post('/generations/', payload)
            Swal.fire({ icon: 'success', title: 'Success', text: 'Generation created successfully', timer: 2000 })
        }

        await fetchGenerations()
        dialogOpen.value = false
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to save generation' })
    } finally {
        formLoading.value = false
    }
}

const deleteGeneration = async (gen) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Generation?',
        text: `Are you sure you want to delete "${gen.generation}"? This action cannot be undone.`,
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it',
        confirmButtonColor: '#d33',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            await $AdminPrivateAxios.post(`/generations/${gen.global_id}/delete`)
            Swal.fire({ icon: 'success', title: 'Deleted', text: 'Generation deleted successfully', timer: 2000 })
            await fetchGenerations()
        } catch (error) {
            console.error('Error deleting generation:', error)
            Swal.fire({ icon: 'error', title: 'Error', text: error.response?.data?.message || 'Failed to delete generation' })
        }
    }
}
</script>

<style scoped>
.generations-page {
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
