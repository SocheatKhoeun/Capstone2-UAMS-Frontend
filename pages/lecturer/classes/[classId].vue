<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-school</v-icon>
                        {{ classInfo.name }}
                        <v-spacer />
                        <v-btn color="primary" @click="takeAttendance">
                            <v-icon left>mdi-check</v-icon>
                            Take Attendance
                        </v-btn>
                    </v-card-title>

                    <v-card-text>
                        <!-- Class Info -->
                        <v-row>
                            <v-col cols="12" md="4">
                                <v-card outlined>
                                    <v-card-text>
                                        <h3>Class Information</h3>
                                        <p><strong>Subject:</strong> {{ classInfo.subject }}</p>
                                        <p><strong>Room:</strong> {{ classInfo.room }}</p>
                                        <p><strong>Schedule:</strong> {{ classInfo.schedule }}</p>
                                        <p><strong>Total Students:</strong> {{ classInfo.totalStudents }}</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="8">
                                <v-card outlined>
                                    <v-card-text>
                                        <h3>Today's Session</h3>
                                        <v-row>
                                            <v-col cols="6">
                                                <v-text-field v-model="sessionData.topic" label="Topic" outlined />
                                            </v-col>
                                            <v-col cols="6">
                                                <v-text-field v-model="sessionData.date" label="Date" type="date"
                                                    outlined />
                                            </v-col>
                                        </v-row>
                                        <v-textarea v-model="sessionData.notes" label="Session Notes" outlined
                                            rows="3" />
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Student List with Attendance -->
                        <v-row class="mt-4">
                            <v-col>
                                <v-card>
                                    <v-card-title>
                                        Student Attendance
                                        <v-spacer />
                                        <v-btn-toggle v-model="attendanceFilter" mandatory>
                                            <v-btn value="all">All</v-btn>
                                            <v-btn value="present">Present</v-btn>
                                            <v-btn value="absent">Absent</v-btn>
                                        </v-btn-toggle>
                                    </v-card-title>
                                    <v-card-text>
                                        <v-data-table :headers="studentHeaders" :items="filteredStudents"
                                            :items-per-page="15">
                                            <template v-slot:item.attendance="{ item }">
                                                <v-btn-toggle v-model="item.todayStatus" mandatory
                                                    @update:model-value="updateAttendance(item.id, $event)">
                                                    <v-btn value="present" size="small" color="green">
                                                        <v-icon>mdi-check</v-icon>
                                                    </v-btn>
                                                    <v-btn value="absent" size="small" color="red">
                                                        <v-icon>mdi-close</v-icon>
                                                    </v-btn>
                                                    <v-btn value="late" size="small" color="orange">
                                                        <v-icon>mdi-clock</v-icon>
                                                    </v-btn>
                                                </v-btn-toggle>
                                            </template>
                                            <template v-slot:item.overallAttendance="{ item }">
                                                <v-chip :color="getAttendanceColor(item.overallAttendance)" small>
                                                    {{ item.overallAttendance }}%
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                    <v-card-actions>
                                        <v-spacer />
                                        <v-btn color="success" @click="saveAttendance">
                                            Save Attendance
                                        </v-btn>
                                    </v-card-actions>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Quick Actions -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title>Quick Actions</v-card-title>
                                    <v-card-text>
                                        <v-btn block class="mb-2" color="primary">
                                            <v-icon left>mdi-file-download</v-icon>
                                            Export Attendance
                                        </v-btn>
                                        <v-btn block class="mb-2" color="secondary">
                                            <v-icon left>mdi-email</v-icon>
                                            Send Notifications
                                        </v-btn>
                                        <v-btn block color="warning">
                                            <v-icon left>mdi-chart-line</v-icon>
                                            View Reports
                                        </v-btn>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title>Class Statistics</v-card-title>
                                    <v-card-text>
                                        <v-row>
                                            <v-col cols="4" class="text-center">
                                                <h2 class="text-green">{{ stats.present }}</h2>
                                                <p>Present</p>
                                            </v-col>
                                            <v-col cols="4" class="text-center">
                                                <h2 class="text-red">{{ stats.absent }}</h2>
                                                <p>Absent</p>
                                            </v-col>
                                            <v-col cols="4" class="text-center">
                                                <h2 class="text-orange">{{ stats.late }}</h2>
                                                <p>Late</p>
                                            </v-col>
                                        </v-row>
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
    middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

const route = useRoute()
const classId = route.params.classId

const attendanceFilter = ref('all')

const classInfo = reactive({
    name: 'Mathematics 101',
    subject: 'Advanced Mathematics',
    room: 'Room A-101',
    schedule: 'Mon, Wed, Fri 09:00-10:30',
    totalStudents: 30
})

const sessionData = reactive({
    topic: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
})

const studentHeaders = [
    { title: 'Student ID', key: 'studentId' },
    { title: 'Name', key: 'name' },
    { title: 'Today', key: 'attendance', sortable: false },
    { title: 'Overall', key: 'overallAttendance' },
    { title: 'Email', key: 'email' }
]

const students = ref([
    {
        id: 1,
        studentId: 'STU001',
        name: 'John Doe',
        email: 'john@student.edu',
        overallAttendance: 92,
        todayStatus: 'present'
    },
    {
        id: 2,
        studentId: 'STU002',
        name: 'Jane Smith',
        email: 'jane@student.edu',
        overallAttendance: 88,
        todayStatus: 'present'
    },
    {
        id: 3,
        studentId: 'STU003',
        name: 'Bob Wilson',
        email: 'bob@student.edu',
        overallAttendance: 75,
        todayStatus: 'absent'
    },
    {
        id: 4,
        studentId: 'STU004',
        name: 'Alice Brown',
        email: 'alice@student.edu',
        overallAttendance: 95,
        todayStatus: 'late'
    }
])

const filteredStudents = computed(() => {
    if (attendanceFilter.value === 'all') return students.value
    return students.value.filter(student => student.todayStatus === attendanceFilter.value)
})

const stats = computed(() => {
    const present = students.value.filter(s => s.todayStatus === 'present').length
    const absent = students.value.filter(s => s.todayStatus === 'absent').length
    const late = students.value.filter(s => s.todayStatus === 'late').length

    return { present, absent, late }
})

const updateAttendance = (studentId, status) => {
    const student = students.value.find(s => s.id === studentId)
    if (student) {
        student.todayStatus = status
    }
}

const takeAttendance = () => {
    console.log('Taking attendance for class:', classId)
}

const saveAttendance = () => {
    console.log('Saving attendance:', students.value.map(s => ({
        id: s.id,
        status: s.todayStatus
    })))
}

const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return 'green'
    if (attendance >= 75) return 'orange'
    return 'red'
}

onMounted(() => {
    console.log('Loading class details for:', classId)
})
</script>