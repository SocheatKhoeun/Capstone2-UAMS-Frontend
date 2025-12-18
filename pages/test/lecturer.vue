<template>
    <div class="test-page">
        <v-container>
            <v-row>
                <v-col cols="12">
                    <h1 class="text-h3 mb-4">Lecturer Management Test Page</h1>
                    <v-alert type="info" variant="tonal" class="mb-4">
                        This page tests the lecturer CRUD operations with the backend API
                    </v-alert>
                </v-col>
            </v-row>

            <!-- Test Create Lecturer -->
            <v-row>
                <v-col cols="12">
                    <v-card class="mb-6">
                        <v-card-title class="bg-primary text-white">
                            <v-icon class="mr-2">mdi-test-tube</v-icon>
                            Test Create Lecturer
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <v-form ref="testFormRef" v-model="formValid">
                                <v-row>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.employeeId" label="Employee ID *"
                                            placeholder="e.g., EMP001" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.email" label="Email *" type="email"
                                            placeholder="lecturer@example.com" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required', v => /.+@.+\..+/.test(v) || 'Invalid email']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.firstName" label="First Name *"
                                            placeholder="John" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.lastName" label="Last Name *"
                                            placeholder="Doe" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.phone" label="Phone *"
                                            placeholder="+855 12 345 678" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="testLecturer.position" label="Position *"
                                            :items="positionOptions" variant="outlined" density="comfortable"
                                            item-title="title" item-value="value" :rules="[v => !!v || 'Required']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-text-field v-model="testLecturer.password" label="Password *" type="password"
                                            placeholder="Min 8 characters" variant="outlined" density="comfortable"
                                            :rules="[v => !!v || 'Required', v => v.length >= 8 || 'Min 8 characters']" />
                                    </v-col>
                                    <v-col cols="12" md="6">
                                        <v-select v-model="testLecturer.specialization"
                                            label="Specialization (Optional)" :items="specializationOptions"
                                            variant="outlined" density="comfortable" clearable />
                                    </v-col>
                                    <v-col cols="12">
                                        <v-switch v-model="testLecturer.active" label="Active Status" color="success" />
                                    </v-col>
                                </v-row>

                                <v-divider class="my-4" />

                                <div class="d-flex gap-2">
                                    <v-btn color="primary" size="large" @click="handleCreateLecturer"
                                        :loading="creating" :disabled="!formValid">
                                        <v-icon class="mr-2">mdi-plus-circle</v-icon>
                                        Create Lecturer
                                    </v-btn>

                                    <v-btn color="warning" size="large" variant="outlined" @click="fillSampleData">
                                        <v-icon class="mr-2">mdi-auto-fix</v-icon>
                                        Fill Sample Data
                                    </v-btn>

                                    <v-btn color="secondary" size="large" variant="outlined" @click="clearForm">
                                        <v-icon class="mr-2">mdi-eraser</v-icon>
                                        Clear Form
                                    </v-btn>
                                </div>
                            </v-form>

                            <!-- Response Display -->
                            <v-alert v-if="createResponse" :type="createResponse.type" variant="tonal" class="mt-4"
                                closable @click:close="createResponse = null">
                                <div class="font-weight-bold mb-2">{{ createResponse.title }}</div>
                                <div>{{ createResponse.message }}</div>
                                <div v-if="createResponse.data" class="mt-2">
                                    <v-expansion-panels>
                                        <v-expansion-panel>
                                            <v-expansion-panel-title>View Response Data</v-expansion-panel-title>
                                            <v-expansion-panel-text>
                                                <pre
                                                    class="response-data">{{ JSON.stringify(createResponse.data, null, 2) }}</pre>
                                            </v-expansion-panel-text>
                                        </v-expansion-panel>
                                    </v-expansion-panels>
                                </div>
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Test Fetch Lecturers -->
            <v-row>
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="bg-success text-white d-flex justify-space-between align-center">
                            <div>
                                <v-icon class="mr-2">mdi-account-group</v-icon>
                                Existing Lecturers ({{ lecturers.length }})
                            </div>
                            <v-btn color="white" variant="text" @click="fetchLecturers" :loading="fetching">
                                <v-icon class="mr-2">mdi-refresh</v-icon>
                                Refresh
                            </v-btn>
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <v-progress-linear v-if="fetching" indeterminate color="success" />

                            <v-table v-else-if="lecturers.length > 0">
                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Email</th>
                                        <th>Phone</th>
                                        <th>Position</th>
                                        <th>Status</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr v-for="lecturer in lecturers" :key="lecturer.id">
                                        <td>{{ lecturer.employeeId }}</td>
                                        <td>{{ lecturer.name }}</td>
                                        <td>{{ lecturer.email }}</td>
                                        <td>{{ lecturer.phone }}</td>
                                        <td>
                                            <v-chip size="small" :color="getPositionColor(lecturer.position)">
                                                {{ lecturer.position || 'N/A' }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <v-chip size="small" :color="lecturer.active ? 'success' : 'error'">
                                                {{ lecturer.active ? 'Active' : 'Inactive' }}
                                            </v-chip>
                                        </td>
                                        <td>
                                            <v-btn icon size="small" color="error"
                                                @click="handleDeleteLecturer(lecturer)">
                                                <v-icon size="20">mdi-delete</v-icon>
                                            </v-btn>
                                        </td>
                                    </tr>
                                </tbody>
                            </v-table>

                            <v-alert v-else type="info" variant="tonal">
                                No lecturers found. Create one using the form above!
                            </v-alert>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>

            <!-- Backend Connection Status -->
            <v-row class="mt-4">
                <v-col cols="12">
                    <v-card>
                        <v-card-title class="bg-info text-white">
                            <v-icon class="mr-2">mdi-api</v-icon>
                            Backend Connection Status
                        </v-card-title>
                        <v-card-text class="pt-4">
                            <div class="d-flex align-center mb-2">
                                <v-icon :color="backendConnected ? 'success' : 'error'" class="mr-2">
                                    {{ backendConnected ? 'mdi-check-circle' : 'mdi-alert-circle' }}
                                </v-icon>
                                <span class="font-weight-bold">
                                    {{ backendConnected ? 'Connected' : 'Disconnected' }}
                                </span>
                            </div>
                            <div class="text-caption">
                                <strong>Endpoint:</strong> {{ apiEndpoint }}
                            </div>
                            <div class="text-caption">
                                <strong>Last Check:</strong> {{ lastCheckTime || 'Not checked yet' }}
                            </div>

                            <v-btn color="primary" variant="outlined" size="small" class="mt-3"
                                @click="checkBackendConnection" :loading="checkingConnection">
                                <v-icon class="mr-2">mdi-connection</v-icon>
                                Test Connection
                            </v-btn>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>
    </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useLecturerStore } from '~/store/lecturerStore'
import Swal from 'sweetalert2'

definePageMeta({
    layout: 'admin',
})

const lecturerStore = useLecturerStore()
const testFormRef = ref(null)
const formValid = ref(false)
const creating = ref(false)
const fetching = ref(false)
const checkingConnection = ref(false)
const backendConnected = ref(false)
const lastCheckTime = ref('')
const createResponse = ref(null)

const apiEndpoint = computed(() => {
    return useRuntimeConfig().public.ADMIN_PRIVATE_API + '/instructors/'
})

const testLecturer = ref({
    employeeId: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: 'lecturer',
    password: '',
    specialization: '',
    active: true
})

const positionOptions = [
    { title: 'Professor', value: 'professor' },
    { title: 'Lecturer', value: 'lecturer' },
    { title: 'Assistant', value: 'assistant' }
]

const specializationOptions = [
    'Data Science',
    'Network Security',
    'Web Development',
    'AI & Machine Learning',
    'Mobile Development',
    'Database Systems'
]

const lecturers = computed(() => lecturerStore.lecturers)

// Fetch lecturers on mount
onMounted(async () => {
    await fetchLecturers()
    await checkBackendConnection()
})

const fetchLecturers = async () => {
    fetching.value = true
    try {
        await lecturerStore.getAllLecturers()
        console.log('✅ Lecturers fetched:', lecturers.value.length)
    } catch (error) {
        console.error('❌ Failed to fetch lecturers:', error)
        Swal.fire({
            icon: 'error',
            title: 'Fetch Failed',
            text: error.message || 'Failed to fetch lecturers',
        })
    } finally {
        fetching.value = false
    }
}

const handleCreateLecturer = async () => {
    if (!formValid.value) {
        Swal.fire({
            icon: 'warning',
            title: 'Validation Error',
            text: 'Please fill in all required fields',
        })
        return
    }

    creating.value = true
    createResponse.value = null

    try {
        console.log('📤 Creating lecturer with data:', testLecturer.value)

        const result = await lecturerStore.createLecturer(testLecturer.value)

        console.log('✅ Lecturer created successfully:', result)

        createResponse.value = {
            type: 'success',
            title: 'Success! 🎉',
            message: `Lecturer "${testLecturer.value.firstName} ${testLecturer.value.lastName}" created successfully!`,
            data: result
        }

        Swal.fire({
            icon: 'success',
            title: 'Lecturer Created!',
            text: `${testLecturer.value.firstName} ${testLecturer.value.lastName} has been added to the system.`,
            confirmButtonColor: '#3b82f6',
        })

        // Refresh the list
        await fetchLecturers()

        // Clear form
        clearForm()
    } catch (error) {
        console.error('❌ Failed to create lecturer:', error)

        const errorMessage = error.response?.data?.message ||
            error.response?.data?.detail ||
            error.message ||
            'Unknown error occurred'

        createResponse.value = {
            type: 'error',
            title: 'Creation Failed ❌',
            message: errorMessage,
            data: error.response?.data
        }

        Swal.fire({
            icon: 'error',
            title: 'Creation Failed',
            text: errorMessage,
            confirmButtonColor: '#dc2626',
        })
    } finally {
        creating.value = false
    }
}

const handleDeleteLecturer = async (lecturer) => {
    const result = await Swal.fire({
        icon: 'warning',
        title: 'Delete Lecturer?',
        text: `Are you sure you want to delete ${lecturer.name}?`,
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    })

    if (result.isConfirmed) {
        try {
            await lecturerStore.deleteLecturer(lecturer.lecturerId)

            Swal.fire({
                icon: 'success',
                title: 'Deleted!',
                text: 'Lecturer has been deleted.',
                timer: 2000
            })

            await fetchLecturers()
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Delete Failed',
                text: error.message || 'Failed to delete lecturer',
            })
        }
    }
}

const fillSampleData = () => {
    const randomId = Math.floor(Math.random() * 1000)
    testLecturer.value = {
        employeeId: `EMP${randomId}`,
        firstName: 'Test',
        lastName: 'Lecturer',
        email: `test.lecturer${randomId}@university.edu`,
        phone: `+855 ${Math.floor(Math.random() * 90 + 10)} ${Math.floor(Math.random() * 900000 + 100000)}`,
        position: 'lecturer',
        password: 'TestPass123!',
        specialization: 'Data Science',
        active: true
    }
}

const clearForm = () => {
    testLecturer.value = {
        employeeId: '',
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        position: 'lecturer',
        password: '',
        specialization: '',
        active: true
    }
    testFormRef.value?.resetValidation()
}

const checkBackendConnection = async () => {
    checkingConnection.value = true
    try {
        await lecturerStore.getAllLecturers(1, 1)
        backendConnected.value = true
        lastCheckTime.value = new Date().toLocaleTimeString()
    } catch (error) {
        backendConnected.value = false
        lastCheckTime.value = new Date().toLocaleTimeString()
    } finally {
        checkingConnection.value = false
    }
}

const getPositionColor = (position) => {
    switch (position) {
        case 'professor': return 'purple'
        case 'assistant': return 'blue'
        default: return 'green'
    }
}
</script>

<style scoped>
.test-page {
    min-height: 100vh;
    background: #f5f5f5;
    padding: 24px 0;
}

.response-data {
    background: #1e1e1e;
    color: #d4d4d4;
    padding: 12px;
    border-radius: 4px;
    font-size: 12px;
    overflow-x: auto;
}
</style>
