<template>
    <div>
        <v-row>
            <v-col cols="12">
                <h1 class="text-h4 mb-6">Student Dashboard</h1>
            </v-col>
        </v-row>

        <!-- Welcome Card -->
        <v-row>
            <v-col cols="12">
                <v-card color="primary" dark>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <div class="flex-grow-1">
                                <h2 class="text-h5 mb-2">Welcome back, {{ studentName }}!</h2>
                                <p class="mb-0">Student ID: {{ studentId }}</p>
                            </div>
                            <v-icon size="64">mdi-account-circle</v-icon>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Quick Stats -->
        <v-row class="mt-4">
            <v-col cols="12" md="4">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="success" class="mr-3">mdi-check-circle</v-icon>
                            <div>
                                <div class="text-h6">Attendance Rate</div>
                                <div class="text-h4">{{ attendanceRate }}%</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="primary" class="mr-3">mdi-calendar</v-icon>
                            <div>
                                <div class="text-h6">Today's Classes</div>
                                <div class="text-h4">{{ todayClasses }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-text>
                        <div class="d-flex align-center">
                            <v-icon size="48" color="warning" class="mr-3">mdi-calendar-remove</v-icon>
                            <div>
                                <div class="text-h6">Leave Requests</div>
                                <div class="text-h4">{{ pendingLeaves }}</div>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Today's Schedule -->
        <v-row class="mt-6">
            <v-col cols="12" md="8">
                <v-card>
                    <v-card-title>Today's Schedule</v-card-title>
                    <v-card-text>
                        <v-list>
                            <v-list-item v-for="class_item in todaySchedule" :key="class_item.id" class="mb-2">
                                <v-list-item-content>
                                    <v-list-item-title>{{ class_item.subject }}</v-list-item-title>
                                    <v-list-item-subtitle>
                                        {{ class_item.time }} - {{ class_item.room }} - {{ class_item.lecturer }}
                                    </v-list-item-subtitle>
                                </v-list-item-content>
                                <v-list-item-action>
                                    <v-chip :color="class_item.status === 'completed' ? 'success' : 'primary'">
                                        {{ class_item.status }}
                                    </v-chip>
                                </v-list-item-action>
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="4">
                <v-card>
                    <v-card-title>Quick Actions</v-card-title>
                    <v-card-text>
                        <v-btn block class="mb-2" color="primary" to="/student/attendance">
                            <v-icon left>mdi-check-circle</v-icon>
                            View Attendance
                        </v-btn>
                        <v-btn block class="mb-2" color="secondary" to="/student/schedule">
                            <v-icon left>mdi-calendar</v-icon>
                            Full Schedule
                        </v-btn>
                        <v-btn block color="warning" to="/student/leave">
                            <v-icon left>mdi-calendar-remove</v-icon>
                            Request Leave
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'student',
    // middleware: ['auth']
})

const studentName = ref('John Doe')
const studentId = ref('STU-2024-001')
const attendanceRate = ref(87)
const todayClasses = ref(4)
const pendingLeaves = ref(1)

const todaySchedule = ref([
    {
        id: 1,
        subject: 'Mathematics',
        time: '08:00 - 10:00',
        room: 'Room A101',
        lecturer: 'Dr. Smith',
        status: 'completed'
    },
    {
        id: 2,
        subject: 'Computer Science',
        time: '10:30 - 12:30',
        room: 'Lab B201',
        lecturer: 'Prof. Johnson',
        status: 'completed'
    },
    {
        id: 3,
        subject: 'Physics',
        time: '14:00 - 16:00',
        room: 'Room C301',
        lecturer: 'Dr. Brown',
        status: 'upcoming'
    },
    {
        id: 4,
        subject: 'English',
        time: '16:30 - 18:30',
        room: 'Room D401',
        lecturer: 'Ms. Davis',
        status: 'upcoming'
    }
])
</script>