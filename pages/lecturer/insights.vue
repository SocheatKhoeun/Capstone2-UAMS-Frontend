<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-chart-bar</v-icon>
                        Class Insights & Analytics
                    </v-card-title>

                    <v-card-text>
                        <!-- Summary Cards -->
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="primary" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-account-group</v-icon>
                                        <h2>{{ insights.totalStudents }}</h2>
                                        <p>Total Students</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="success" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-percent</v-icon>
                                        <h2>{{ insights.averageAttendance }}%</h2>
                                        <p>Avg Attendance</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="warning" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-account-alert</v-icon>
                                        <h2>{{ insights.lowAttendance }}</h2>
                                        <p>Low Attendance</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="info" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-book-open</v-icon>
                                        <h2>{{ insights.totalClasses }}</h2>
                                        <p>Classes This Week</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Charts Section -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="8">
                                <v-card>
                                    <v-card-title>Attendance Trend</v-card-title>
                                    <v-card-text>
                                        <canvas ref="attendanceChart" width="400" height="200"></canvas>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card>
                                    <v-card-title>Class Distribution</v-card-title>
                                    <v-card-text>
                                        <canvas ref="classChart" width="200" height="200"></canvas>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Performance Analysis -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title>Top Performing Students</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item v-for="student in topStudents" :key="student.id">
                                                <v-list-item-avatar>
                                                    <v-icon color="green">mdi-account-star</v-icon>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ student.name }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ student.attendance }}%
                                                        attendance</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-chip color="green" small>{{ student.grade }}</v-chip>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title>Students Need Attention</v-card-title>
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item v-for="student in needAttention" :key="student.id">
                                                <v-list-item-avatar>
                                                    <v-icon color="red">mdi-account-alert</v-icon>
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{ student.name }}</v-list-item-title>
                                                    <v-list-item-subtitle>{{ student.attendance }}%
                                                        attendance</v-list-item-subtitle>
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-btn size="small" color="primary"
                                                        @click="contactStudent(student.id)">
                                                        Contact
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Class Performance Table -->
                        <v-row class="mt-4">
                            <v-col>
                                <v-card>
                                    <v-card-title>Class Performance Overview</v-card-title>
                                    <v-card-text>
                                        <v-data-table :headers="classHeaders" :items="classPerformance"
                                            :items-per-page="10">
                                            <template v-slot:item.attendance="{ item }">
                                                <v-chip :color="getAttendanceColor(item.attendance)" small>
                                                    {{ item.attendance }}%
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
definePageMeta({
    // middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

const attendanceChart = ref(null)
const classChart = ref(null)

const insights = reactive({
    totalStudents: 120,
    averageAttendance: 85,
    lowAttendance: 8,
    totalClasses: 12
})

const classHeaders = [
    { title: 'Class', key: 'className' },
    { title: 'Students', key: 'studentCount' },
    { title: 'Attendance', key: 'attendance' },
    { title: 'Avg Grade', key: 'avgGrade' },
    { title: 'Last Session', key: 'lastSession' }
]

const classPerformance = ref([
    {
        id: 1,
        className: 'Mathematics 101',
        studentCount: 30,
        attendance: 92,
        avgGrade: 'A-',
        lastSession: '2024-01-15'
    },
    {
        id: 2,
        className: 'Physics 201',
        studentCount: 25,
        attendance: 78,
        avgGrade: 'B+',
        lastSession: '2024-01-14'
    },
    {
        id: 3,
        className: 'Chemistry 301',
        studentCount: 20,
        attendance: 85,
        avgGrade: 'B',
        lastSession: '2024-01-13'
    }
])

const topStudents = ref([
    {
        id: 1,
        name: 'Alice Johnson',
        attendance: 98,
        grade: 'A+'
    },
    {
        id: 2,
        name: 'Bob Smith',
        attendance: 95,
        grade: 'A'
    },
    {
        id: 3,
        name: 'Carol Davis',
        attendance: 92,
        grade: 'A-'
    }
])

const needAttention = ref([
    {
        id: 1,
        name: 'David Wilson',
        attendance: 45,
        grade: 'D'
    },
    {
        id: 2,
        name: 'Eva Brown',
        attendance: 52,
        grade: 'C-'
    },
    {
        id: 3,
        name: 'Frank Miller',
        attendance: 38,
        grade: 'F'
    }
])

const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'green'
    if (attendance >= 75) return 'orange'
    return 'red'
}

const contactStudent = (studentId) => {
    console.log('Contacting student:', studentId)
    // Implement contact functionality
}

onMounted(() => {
    // Initialize charts
    if (attendanceChart.value) {
        console.log('Attendance chart canvas ready')
    }
    if (classChart.value) {
        console.log('Class chart canvas ready')
    }
})
</script>