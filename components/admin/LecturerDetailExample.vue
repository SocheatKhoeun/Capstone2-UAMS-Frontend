<template>
    <div class="lecturer-detail">
        <!-- Lecturer Profile Header -->
        <v-card class="mb-4">
            <v-card-title>
                <div class="d-flex align-center">
                    <v-avatar size="64" color="primary" class="mr-4">
                        <span class="text-h5">{{ lecturer?.firstName?.charAt(0) || 'L' }}</span>
                    </v-avatar>
                    <div>
                        <h2>{{ lecturer?.name || 'Lecturer Name' }}</h2>
                        <v-chip :color="getPositionColor(lecturer?.position)" size="small" class="mt-1">
                            {{ lecturer?.position || 'Lecturer' }}
                        </v-chip>
                    </div>
                </div>
            </v-card-title>
            <v-card-text>
                <v-row>
                    <v-col cols="6">
                        <div class="info-item">
                            <v-icon small class="mr-2">mdi-email</v-icon>
                            <strong>Email:</strong> {{ lecturer?.email || 'N/A' }}
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="info-item">
                            <v-icon small class="mr-2">mdi-phone</v-icon>
                            <strong>Phone:</strong> {{ lecturer?.phone || 'N/A' }}
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="info-item">
                            <v-icon small class="mr-2">mdi-account-badge</v-icon>
                            <strong>Employee ID:</strong> {{ lecturer?.employeeId || 'N/A' }}
                        </div>
                    </v-col>
                    <v-col cols="6">
                        <div class="info-item">
                            <v-icon small class="mr-2">mdi-school</v-icon>
                            <strong>Department:</strong> {{ lecturer?.department || 'N/A' }}
                        </div>
                    </v-col>
                </v-row>
            </v-card-text>
        </v-card>

        <!-- Courses Section -->
        <v-card class="mb-4">
            <v-card-title>
                <v-icon class="mr-2">mdi-book-open-page-variant</v-icon>
                Courses Teaching ({{ courses.length }})
            </v-card-title>
            <v-card-text>
                <v-progress-linear v-if="coursesLoading" indeterminate color="primary" />
                <v-list v-else-if="courses.length > 0">
                    <v-list-item v-for="course in courses" :key="course.id">
                        <template v-slot:prepend>
                            <v-icon color="primary">mdi-book</v-icon>
                        </template>
                        <v-list-item-title>{{ course.subject_name }}</v-list-item-title>
                        <v-list-item-subtitle>
                            {{ course.course_code }} | Room: {{ course.room_name }} |
                            {{ course.start_time }} - {{ course.end_time }}
                        </v-list-item-subtitle>
                        <template v-slot:append>
                            <v-chip size="small" :color="course.role === 'instructor' ? 'success' : 'info'">
                                {{ course.role === 'instructor' ? 'Instructor' : 'Assistant' }}
                            </v-chip>
                        </template>
                    </v-list-item>
                </v-list>
                <div v-else class="text-center py-8">
                    <v-icon size="48" color="grey">mdi-book-off-outline</v-icon>
                    <p class="text-grey mt-2">No courses assigned</p>
                </div>
            </v-card-text>
        </v-card>

        <!-- Schedule Section -->
        <v-card>
            <v-card-title>
                <v-icon class="mr-2">mdi-calendar-clock</v-icon>
                Weekly Schedule
            </v-card-title>
            <v-card-text>
                <v-progress-linear v-if="scheduleLoading" indeterminate color="primary" />
                <div v-else-if="schedule.length > 0">
                    <v-table>
                        <thead>
                            <tr>
                                <th>Day</th>
                                <th>Time</th>
                                <th>Course</th>
                                <th>Room</th>
                                <th>Group</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="item in schedule" :key="item.id">
                                <td>{{ item.day_of_week }}</td>
                                <td>{{ item.start_time }} - {{ item.end_time }}</td>
                                <td>{{ item.subject_name }}</td>
                                <td>{{ item.room_name }}</td>
                                <td>{{ item.group_name }}</td>
                            </tr>
                        </tbody>
                    </v-table>
                </div>
                <div v-else class="text-center py-8">
                    <v-icon size="48" color="grey">mdi-calendar-blank-outline</v-icon>
                    <p class="text-grey mt-2">No schedule available</p>
                </div>
            </v-card-text>
        </v-card>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useLecturerStore } from '~/store/lecturerStore'

const props = defineProps({
    lecturerId: {
        type: String,
        required: true
    }
})

const lecturerStore = useLecturerStore()
const lecturer = ref(null)
const courses = ref([])
const schedule = ref([])
const coursesLoading = ref(false)
const scheduleLoading = ref(false)

// Fetch lecturer data
onMounted(async () => {
    await loadLecturerData()
})

const loadLecturerData = async () => {
    try {
        // Get lecturer details
        lecturer.value = await lecturerStore.getLecturerByGlobalId(props.lecturerId)

        // Get courses
        coursesLoading.value = true
        courses.value = await lecturerStore.getLecturerCourses(props.lecturerId)
        coursesLoading.value = false

        // Get schedule
        scheduleLoading.value = true
        schedule.value = await lecturerStore.getLecturerSchedule(props.lecturerId)
        scheduleLoading.value = false
    } catch (error) {
        console.error('Failed to load lecturer data:', error)
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
.lecturer-detail {
    padding: 16px;
}

.info-item {
    display: flex;
    align-items: center;
    margin-bottom: 8px;
}

.info-item strong {
    margin-right: 8px;
}
</style>
