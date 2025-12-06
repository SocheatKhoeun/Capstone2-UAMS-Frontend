<template>
    <v-form ref="formRef" @submit.prevent="handleSubmit">
        <v-row>
            <!-- Basic Information Section -->
            <v-col cols="12">
                <div class="section-title mb-3">
                    <v-icon color="indigo" class="mr-2">mdi-information</v-icon>
                    <span class="text-h6 font-weight-bold">Basic Information</span>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model="formData.subject" label="Subject Name*" variant="outlined"
                    prepend-inner-icon="mdi-book-open-variant" :rules="[rules.required]" bg-color="grey-lighten-5"
                    color="indigo" placeholder="e.g., Quantum Computing" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model="formData.code" label="Course Code*" variant="outlined"
                    prepend-inner-icon="mdi-barcode" :rules="[rules.required]" bg-color="grey-lighten-5" color="indigo"
                    placeholder="e.g., CS301" />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.lecturerId" :items="lecturers" item-title="name" item-value="id"
                    label="Lecturer*" variant="outlined" prepend-inner-icon="mdi-account-tie" :rules="[rules.required]"
                    bg-color="grey-lighten-5" color="indigo">
                    <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props">
                            <template v-slot:prepend>
                                <v-avatar color="blue-grey-lighten-4" size="32">
                                    <v-icon size="20" color="blue-grey">mdi-account</v-icon>
                                </v-avatar>
                            </template>
                        </v-list-item>
                    </template>
                </v-select>
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.classType" :items="classTypeOptions" label="Class Type*" variant="outlined"
                    prepend-inner-icon="mdi-book-education" :rules="[rules.required]" bg-color="grey-lighten-5"
                    color="indigo" />
            </v-col>

            <!-- Class Details Section -->
            <v-col cols="12" class="mt-4">
                <v-divider class="mb-4" />
                <div class="section-title mb-3">
                    <v-icon color="blue" class="mr-2">mdi-school</v-icon>
                    <span class="text-h6 font-weight-bold">Class Details</span>
                </div>
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.year" :items="yearOptions" label="Year*" variant="outlined"
                    prepend-inner-icon="mdi-calendar-today" :rules="[rules.required]" bg-color="blue-lighten-5"
                    color="blue" />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.term" :items="termOptions" label="Term*" variant="outlined"
                    prepend-inner-icon="mdi-calendar-range" :rules="[rules.required]" bg-color="blue-lighten-5"
                    color="blue" />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.generation" :items="generationOptions" label="Generation*"
                    variant="outlined" prepend-inner-icon="mdi-school" :rules="[rules.required]"
                    bg-color="blue-lighten-5" color="blue" />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.group" :items="groupOptions" label="Group*" variant="outlined"
                    prepend-inner-icon="mdi-account-group" :rules="[rules.required]" bg-color="blue-lighten-5"
                    color="blue" />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.department" :items="departmentOptions" label="Department*"
                    variant="outlined" prepend-inner-icon="mdi-domain" :rules="[rules.required]"
                    bg-color="blue-lighten-5" color="blue" />
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.semester" :items="semesterOptions" label="Semester*" variant="outlined"
                    prepend-inner-icon="mdi-calendar" :rules="[rules.required]" bg-color="blue-lighten-5"
                    color="blue" />
            </v-col>

            <!-- Schedule Section -->
            <v-col cols="12" class="mt-4">
                <v-divider class="mb-4" />
                <div class="section-title mb-3">
                    <v-icon color="green" class="mr-2">mdi-clock-outline</v-icon>
                    <span class="text-h6 font-weight-bold">Schedule & Location</span>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.dayOfWeek" :items="dayOptions" label="Day of Week*" variant="outlined"
                    prepend-inner-icon="mdi-calendar-week" :rules="[rules.required]" bg-color="green-lighten-5"
                    color="green" multiple chips />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.startTime" :items="timeOptions" label="Start Time*" variant="outlined"
                    prepend-inner-icon="mdi-clock-start" :rules="[rules.required]" bg-color="green-lighten-5"
                    color="green" />
            </v-col>

            <v-col cols="12" md="3">
                <v-select v-model="formData.endTime" :items="timeOptions" label="End Time*" variant="outlined"
                    prepend-inner-icon="mdi-clock-end" :rules="[rules.required]" bg-color="green-lighten-5"
                    color="green" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model="formData.room" label="Room*" variant="outlined"
                    prepend-inner-icon="mdi-map-marker" :rules="[rules.required]" bg-color="green-lighten-5"
                    color="green" placeholder="e.g., A201, Lab 301" />
            </v-col>

            <v-col cols="12" md="6">
                <v-text-field v-model.number="formData.students" label="Number of Students" type="number"
                    variant="outlined" prepend-inner-icon="mdi-account-multiple" bg-color="green-lighten-5"
                    color="green" min="0" placeholder="e.g., 40" />
            </v-col>

            <!-- Additional Details Section -->
            <v-col cols="12" class="mt-4">
                <v-divider class="mb-4" />
                <div class="section-title mb-3">
                    <v-icon color="purple" class="mr-2">mdi-cog</v-icon>
                    <span class="text-h6 font-weight-bold">Additional Details</span>
                </div>
            </v-col>

            <v-col cols="12" md="6">
                <v-select v-model="formData.color" :items="colorOptions" label="Color Theme" variant="outlined"
                    prepend-inner-icon="mdi-palette" bg-color="purple-lighten-5" color="purple">
                    <template v-slot:item="{ item, props }">
                        <v-list-item v-bind="props">
                            <template v-slot:prepend>
                                <div class="color-preview mr-2" :style="{ background: item.value }"></div>
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

            <v-col cols="12" md="6">
                <v-select v-model="formData.status" :items="statusOptions" label="Status*" variant="outlined"
                    prepend-inner-icon="mdi-toggle-switch" :rules="[rules.required]" bg-color="purple-lighten-5"
                    color="purple" />
            </v-col>

            <v-col cols="12">
                <v-textarea v-model="formData.description" label="Description / Notes" variant="outlined"
                    prepend-inner-icon="mdi-text" rows="3" bg-color="purple-lighten-5" color="purple"
                    placeholder="Add class description, learning objectives, or important notes..." />
            </v-col>

            <!-- Form Actions -->
            <v-col cols="12">
                <v-divider class="mb-4" />
                <div class="d-flex justify-end gap-2">
                    <v-btn variant="outlined" size="large" @click="$emit('cancel')">
                        Cancel
                    </v-btn>
                    <v-btn color="indigo" variant="flat" size="large" type="submit" prepend-icon="mdi-content-save">
                        {{ isEditMode ? 'Update Class' : 'Create Class' }}
                    </v-btn>
                </div>
            </v-col>
        </v-row>
    </v-form>
</template>

<script setup>
const props = defineProps({
    initialData: {
        type: Object,
        default: null
    },
    isEditMode: {
        type: Boolean,
        default: false
    }
})

const emit = defineEmits(['save', 'cancel'])

// Form ref
const formRef = ref(null)

// Mock lecturer data - replace with actual API call
const lecturers = ref([
    { id: 1, name: 'Dr. Duch Dynit' },
    { id: 2, name: 'Ms. Heng Sovanmonyuth' },
    { id: 3, name: 'Ms. Khim Sokkhey' },
    { id: 4, name: 'Mr. Chun Bora' },
    { id: 5, name: 'Ms. Chea Chandara' },
])

// Form data
const formData = ref({
    subject: '',
    code: '',
    lecturerId: null,
    classType: 'Theory Class',
    year: 4,
    term: 1,
    group: '',
    generation: '',
    dayOfWeek: [],
    startTime: '',
    endTime: '',
    room: '',
    students: 0,
    semester: '',
    color: '#1e3a8a',
    description: '',
    status: 'active',
    department: ''
})

// Options
const classTypeOptions = ['Theory Class', 'Lab Class', 'Seminar', 'Workshop', 'Capstone Project']
const yearOptions = [1, 2, 3, 4]
const termOptions = [1, 2]
const semesterOptions = ['Fall 2024', 'Spring 2025', 'Summer 2025']
const generationOptions = ['9', '10', '11', '12']
const groupOptions = ['1', '2', '3', '4']
const departmentOptions = ['Computer Science', 'Information Technology', 'Software Engineering', 'Information Systems']
const dayOptions = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeOptions = [
    '07:45-08:00',
    '08:00-09:30',
    '09:30-09:50',
    '09:50-11:20',
    '11:20-12:10',
    '12:10-13:40',
    '13:40-13:50',
    '13:50-15:20',
    '15:20-15:30',
    '15:30-17:00'
]
const statusOptions = ['active', 'inactive']
const colorOptions = [
    { title: 'Navy Blue (Seminar)', value: '#1e3a8a' },
    { title: 'Green (Active)', value: '#16a34a' },
    { title: 'Blue', value: '#2563eb' },
    { title: 'Purple', value: '#7c3aed' },
    { title: 'Orange', value: '#ea580c' },
    { title: 'Red', value: '#dc2626' },
    { title: 'Teal', value: '#0d9488' },
    { title: 'Pink', value: '#db2777' },
    { title: 'Indigo', value: '#4f46e5' },
]

// Validation rules
const rules = {
    required: (v) => !!v || 'This field is required',
}

// Methods
const handleSubmit = async () => {
    const { valid } = await formRef.value.validate()
    if (valid) {
        // Get lecturer name
        const lecturer = lecturers.value.find(l => l.id === formData.value.lecturerId)

        // Format schedule string
        const days = formData.value.dayOfWeek.join('/')
        const schedule = `${days} ${formData.value.startTime}-${formData.value.endTime}`

        const dataToSave = {
            ...formData.value,
            lecturerName: lecturer?.name || '',
            schedule: schedule,
            group: `G${formData.value.group}` // Format as G1, G2, etc.
        }
        emit('save', dataToSave)
    }
}

// Initialize form data if editing
watch(() => props.initialData, (newData) => {
    if (newData) {
        formData.value = { ...newData }
    }
}, { immediate: true })
</script>

<style scoped>
.section-title {
    display: flex;
    align-items: center;
    padding: 8px 0;
}

.color-preview {
    width: 24px;
    height: 24px;
    border-radius: 4px;
    border: 2px solid #e0e0e0;
}

.gap-2 {
    gap: 8px;
}
</style>