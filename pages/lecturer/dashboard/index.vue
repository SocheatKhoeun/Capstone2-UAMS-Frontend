<template>
  <v-container fluid class="pa-6">
    <!-- Welcome Section -->
    <div class="mb-6">
      <h1 class="text-h4 font-weight-bold mb-2">Welcome back, Dr. CHAN Rithy 👋</h1>
      <p class="text-grey">Here's what's happening with your classes today</p>
    </div>

    <!-- Quick Stats -->
    <v-row class="mb-6">
      <v-col cols="12" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Total Classes</div>
                <div class="text-h4 font-weight-bold">{{ totalClasses }}</div>
              </div>
              <v-avatar color="blue-lighten-5" size="56">
                <v-icon color="primary" size="28">mdi-google-classroom</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Total Students</div>
                <div class="text-h4 font-weight-bold">{{ totalStudents }}</div>
              </div>
              <v-avatar color="green-lighten-5" size="56">
                <v-icon color="success" size="28">mdi-account-group</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Today's Classes</div>
                <div class="text-h4 font-weight-bold">{{ todayClasses.length }}</div>
              </div>
              <v-avatar color="orange-lighten-5" size="56">
                <v-icon color="warning" size="28">mdi-calendar-today</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="3">
        <v-card class="stat-card" elevation="1">
          <v-card-text>
            <div class="d-flex align-center justify-space-between">
              <div>
                <div class="text-caption text-grey mb-1">Avg Attendance</div>
                <div class="text-h4 font-weight-bold">{{ avgAttendance }}%</div>
              </div>
              <v-avatar color="purple-lighten-5" size="56">
                <v-icon color="purple" size="28">mdi-chart-line</v-icon>
              </v-avatar>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <!-- Today's Schedule -->
    <v-row>
      <v-col cols="12" md="8">
        <v-card elevation="1">
          <v-card-title class="pa-4 d-flex justify-space-between align-center">
            <span class="text-h6 font-weight-bold">Today's Schedule</span>
            <v-chip color="primary" size="small">{{ currentDay }}</v-chip>
          </v-card-title>
          <v-card-text>
            <div v-if="todayClasses.length > 0" class="schedule-list">
              <div v-for="classItem in todayClasses" :key="classItem.id" class="schedule-item pa-4 mb-3"
                :class="{ 'active': classItem.status === 'ongoing' }">
                <div class="d-flex align-center justify-space-between">
                  <div class="d-flex align-center">
                    <div class="time-badge mr-4">
                      <div class="text-caption text-grey">{{ classItem.time.split(' - ')[0] }}
                      </div>
                      <div class="text-caption text-grey">{{ classItem.time.split(' - ')[1] }}
                      </div>
                    </div>
                    <div>
                      <div class="text-h6 font-weight-bold mb-1">{{ classItem.subject }}</div>
                      <div class="text-body-2 text-grey">
                        <v-icon size="small">mdi-account-group</v-icon>
                        {{ classItem.group }} • {{ classItem.students }} students
                      </div>
                      <div class="text-body-2 text-grey">
                        <v-icon size="small">mdi-map-marker</v-icon>
                        {{ classItem.room }}
                      </div>
                    </div>
                  </div>
                  <div class="text-right">
                    <v-chip :color="getStatusColor(classItem.status)" size="small" class="mb-2">
                      {{ classItem.status }}
                    </v-chip>
                    <div>
                      <v-btn v-if="classItem.status === 'ongoing'" color="primary" size="small" variant="flat">
                        Take Attendance
                      </v-btn>
                      <v-btn v-else-if="classItem.status === 'upcoming'" color="primary" size="small"
                        variant="outlined">
                        Prepare
                      </v-btn>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <v-alert v-else type="info" variant="tonal">
              No classes scheduled for today
            </v-alert>
          </v-card-text>
        </v-card>
      </v-col>

      <!-- Quick Actions -->
      <v-col cols="12" md="4">
        <v-card elevation="1" class="mb-4">
          <v-card-title class="pa-4">
            <span class="text-h6 font-weight-bold">Quick Actions</span>
          </v-card-title>
          <v-card-text class="pa-2">
            <v-list density="compact" class="py-0">
              <v-list-item to="/lecturer/classes" prepend-icon="mdi-google-classroom" class="rounded-lg mb-1">
                <v-list-item-title>View All Classes</v-list-item-title>
              </v-list-item>
              <v-list-item to="/lecturer/schedule" prepend-icon="mdi-calendar-clock" class="rounded-lg mb-1">
                <v-list-item-title>Full Schedule</v-list-item-title>
              </v-list-item>
              <v-list-item to="/lecturer/leave" prepend-icon="mdi-calendar-remove" class="rounded-lg mb-1">
                <v-list-item-title>Request Leave</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>

        <!-- Upcoming Classes -->
        <v-card elevation="1">
          <v-card-title class="pa-4">
            <span class="text-h6 font-weight-bold">This Week</span>
          </v-card-title>
          <v-card-text class="pa-2">
            <div class="week-stat pa-3 mb-2 rounded-lg bg-blue-lighten-5">
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">Total Sessions</span>
                <span class="text-h6 font-weight-bold">18</span>
              </div>
            </div>
            <div class="week-stat pa-3 mb-2 rounded-lg bg-green-lighten-5">
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">Completed</span>
                <span class="text-h6 font-weight-bold">12</span>
              </div>
            </div>
            <div class="week-stat pa-3 rounded-lg bg-orange-lighten-5">
              <div class="d-flex justify-space-between align-center">
                <span class="text-body-2">Remaining</span>
                <span class="text-h6 font-weight-bold">6</span>
              </div>
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
definePageMeta({
  layout: 'lecturer',
//   middleware: ['auth']
})

const totalClasses = ref(6)
const totalStudents = ref(245)
const avgAttendance = ref(87)

const currentDay = ref(new Date().toLocaleDateString('en-US', { weekday: 'long' }))

const todayClasses = ref([
  {
    id: 1,
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    group: 'CS-9-G1',
    time: '08:00 - 10:00',
    room: 'Lab 301',
    students: 42,
    status: 'completed'
  },
  {
    id: 2,
    subject: 'Database Management Systems',
    code: 'CS303',
    group: 'IT-10-G2',
    time: '10:30 - 12:30',
    room: 'Room 205',
    students: 38,
    status: 'ongoing'
  },
  {
    id: 3,
    subject: 'Web Development',
    code: 'CS405',
    group: 'CS-11-G1',
    time: '14:00 - 16:00',
    room: 'Lab 302',
    students: 35,
    status: 'upcoming'
  }
])

const getStatusColor = (status) => {
  switch (status) {
    case 'completed': return 'success'
    case 'ongoing': return 'primary'
    case 'upcoming': return 'warning'
    default: return 'grey'
  }
}
</script>

<style scoped>
.stat-card {
  border-radius: 12px;
  height: 100%;
}

.schedule-list {
  max-height: 600px;
  overflow-y: auto;
}

.schedule-item {
  border: 1px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s;
}

.schedule-item:hover {
  border-color: #1976d2;
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.schedule-item.active {
  background-color: #E3F2FD;
  border-color: #1976d2;
}

.time-badge {
  text-align: center;
  min-width: 60px;
}

.week-stat {
  border: 1px solid transparent;
}
</style>
