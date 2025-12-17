<template>
    <div class="student-quick-actions">
        <h2>Student Management - Quick Examples</h2>

        <!-- Example 1: Fetch All Students -->
        <v-card class="mb-4">
            <v-card-title>1. Fetch All Students</v-card-title>
            <v-card-text>
                <v-btn @click="fetchAllStudents" color="primary" :loading="loading">
                    Fetch Students
                </v-btn>
                <div v-if="students.length" class="mt-3">
                    <p>Found {{ students.length }} students</p>
                </div>
            </v-card-text>
        </v-card>

        <!-- Example 2: Create Student -->
        <v-card class="mb-4">
            <v-card-title>2. Create Student</v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="newStudent.firstName" label="First Name" variant="outlined"
                            density="compact" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="newStudent.lastName" label="Last Name" variant="outlined"
                            density="compact" />
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="newStudent.email" label="Email" variant="outlined" density="compact" />
                    </v-col>
                    <v-col cols="6">
                        <v-select v-model="newStudent.gender" :items="['male', 'female', 'other']" label="Gender"
                            variant="outlined" density="compact" />
                    </v-col>
                </v-row>
                <v-btn @click="createStudent" color="success" :loading="loading">
                    Create Student
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Example 3: Update Student -->
        <v-card class="mb-4">
            <v-card-title>3. Update Student</v-card-title>
            <v-card-text>
                <v-text-field v-model="updateData.studentId" label="Student ID (global_id)" variant="outlined"
                    density="compact" class="mb-2" />
                <v-text-field v-model="updateData.firstName" label="First Name (optional)" variant="outlined"
                    density="compact" class="mb-2" />
                <v-text-field v-model="updateData.email" label="Email (optional)" variant="outlined" density="compact"
                    class="mb-2" />
                <v-btn @click="updateStudent" color="warning" :loading="loading">
                    Update Student
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Example 4: Toggle Status -->
        <v-card class="mb-4">
            <v-card-title>4. Toggle Student Status</v-card-title>
            <v-card-text>
                <v-text-field v-model="statusData.studentId" label="Student ID (global_id)" variant="outlined"
                    density="compact" class="mb-2" />
                <v-select v-model="statusData.active"
                    :items="[{ title: 'Active', value: 1 }, { title: 'Inactive', value: 0 }]" label="Status"
                    variant="outlined" density="compact" class="mb-2" />
                <v-btn @click="toggleStatus" color="info" :loading="loading">
                    Toggle Status
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Example 5: Delete Student -->
        <v-card class="mb-4">
            <v-card-title>5. Soft Delete Student</v-card-title>
            <v-card-text>
                <v-text-field v-model="deleteData.studentId" label="Student ID (global_id)" variant="outlined"
                    density="compact" class="mb-2" />
                <v-btn @click="deleteStudent" color="error" :loading="loading">
                    Delete Student
                </v-btn>
            </v-card-text>
        </v-card>

        <!-- Success/Error Messages -->
        <v-alert v-if="message" :type="messageType" class="mt-4">
            {{ message }}
        </v-alert>
    </div>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue';
import { useStudentStore } from '~/store/studentStore';

// Store
const studentStore = useStudentStore();

// State
const loading = ref(false);
const message = ref('');
const messageType = ref<'success' | 'error'>('success');
const students = ref<any[]>([]);

// Form data
const newStudent = reactive({
    firstName: '',
    lastName: '',
    email: '',
    gender: 'male'
});

const updateData = reactive({
    studentId: '',
    firstName: '',
    email: ''
});

const statusData = reactive({
    studentId: '',
    active: 1
});

const deleteData = reactive({
    studentId: ''
});

// Methods

/**
 * Example 1: Fetch all students
 */
const fetchAllStudents = async () => {
    loading.value = true;
    message.value = '';

    try {
        students.value = await studentStore.getAllStudents();
        message.value = `Successfully fetched ${students.value.length} students`;
        messageType.value = 'success';
    } catch (error: any) {
        message.value = error.response?.data?.detail || error.message || 'Failed to fetch students';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

/**
 * Example 2: Create a new student
 * Required fields: first_name, last_name, email, gender
 */
const createStudent = async () => {
    loading.value = true;
    message.value = '';

    try {
        const studentData = {
            firstName: newStudent.firstName,
            lastName: newStudent.lastName,
            email: newStudent.email,
            gender: newStudent.gender
        };

        const created = await studentStore.createStudent(studentData);
        message.value = `Student created successfully! ID: ${created.studentId}`;
        messageType.value = 'success';

        // Reset form
        newStudent.firstName = '';
        newStudent.lastName = '';
        newStudent.email = '';
        newStudent.gender = 'male';
    } catch (error: any) {
        message.value = error.response?.data?.detail || error.message || 'Failed to create student';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

/**
 * Example 3: Update student
 * Only first_name, last_name, email can be updated
 */
const updateStudent = async () => {
    loading.value = true;
    message.value = '';

    try {
        const data: any = {};
        if (updateData.firstName) data.firstName = updateData.firstName;
        if (updateData.email) data.email = updateData.email;

        const updated = await studentStore.updateStudent(updateData.studentId, data);
        message.value = 'Student updated successfully!';
        messageType.value = 'success';
    } catch (error: any) {
        message.value = error.response?.data?.detail || error.message || 'Failed to update student';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

/**
 * Example 4: Toggle student status
 * active: 1 = active, 0 = inactive
 */
const toggleStatus = async () => {
    loading.value = true;
    message.value = '';

    try {
        await studentStore.toggleStudentStatus(statusData.studentId, statusData.active);
        message.value = `Student status set to ${statusData.active === 1 ? 'Active' : 'Inactive'}`;
        messageType.value = 'success';
    } catch (error: any) {
        message.value = error.response?.data?.detail || error.message || 'Failed to toggle status';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};

/**
 * Example 5: Soft delete student
 */
const deleteStudent = async () => {
    loading.value = true;
    message.value = '';

    try {
        await studentStore.deleteStudent(deleteData.studentId);
        message.value = 'Student deleted successfully!';
        messageType.value = 'success';
        deleteData.studentId = '';
    } catch (error: any) {
        message.value = error.response?.data?.detail || error.message || 'Failed to delete student';
        messageType.value = 'error';
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.student-quick-actions {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
}

h2 {
    margin-bottom: 24px;
    color: #1e293b;
}
</style>
