<template>
  <div class="schedule-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-calendar-clock" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Schedule Management</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">Lecturer</span>
                <v-icon icon="mdi-chevron-right" size="16" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Schedule</span>
              </div>
            </div>
          </div>
          <div class="stats-cards">
            <div class="stat-card">
              <div class="stat-number">{{ totalSessions }}</div>
              <div class="stat-label">TOTAL SESSIONS</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ todaySessions }}</div>
              <div class="stat-label">TODAY</div>
            </div>
            <div class="stat-card">
              <div class="stat-number">{{ thisWeekSessions }}</div>
              <div class="stat-label">THIS WEEK</div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn" prepend-icon="mdi-import" variant="outlined" 
                color="grey" v-bind="props" elevation="0">
                Import
                <v-icon icon="mdi-chevron-down" end />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item @click="handleImportCSV" class="menu-item">
                <v-icon icon="mdi-file-excel" class="mr-2" color="green" />
                Import from CSV
              </v-list-item>
            </v-list>
          </v-menu>

          <v-menu offset-y>
            <template v-slot:activator="{ props }">
              <v-btn class="modern-btn" prepend-icon="mdi-export" variant="outlined" 
                color="grey" v-bind="props" elevation="0">
                Export
                <v-icon icon="mdi-chevron-down" end />
              </v-btn>
            </template>
            <v-list class="modern-menu">
              <v-list-item @click="handleExportExcel" class="menu-item">
                <v-icon icon="mdi-file-excel" class="mr-2" color="green" />
                Export to Excel
              </v-list-item>
              <v-list-item @click="handleExportPDF" class="menu-item">
                <v-icon icon="mdi-file-pdf-box" class="mr-2" color="red" />
                Export to PDF
              </v-list-item>
            </v-list>
          </v-menu>

          <v-btn class="modern-btn add-btn" prepend-icon="mdi-plus" variant="flat" color="primary"
            @click="addScheduleDialog = true" elevation="0">
            Add Schedule
          </v-btn>
        </div>
      </div>
    </div>

    <!-- Modern Table Section -->
    <div class="modern-table-section">
      <div class="table-container">
        <!-- Week Selector -->
        <div class="week-selector">
          <v-btn icon variant="text" @click="previousWeek" class="nav-btn">
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <div class="week-info">
            <div class="week-label">{{ currentWeekLabel }}</div>
            <div class="week-range">{{ currentWeekRange }}</div>
          </div>
          <v-btn icon variant="text" @click="nextWeek" class="nav-btn">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </div>

        <!-- Schedule Table -->
        <div class="schedule-grid">
          <!-- Header Row - Time Column -->
          <div class="time-column header-cell">
            <div class="pa-3 text-center font-weight-bold">Time</div>
          </div>

          <!-- Header Row - Days -->
          <div v-for="day in weekDays" :key="day" class="day-column header-cell">
            <div class="pa-3 text-center">
              <div class="font-weight-bold">{{ day }}</div>
              <div class="text-caption text-grey">{{ getDayDate(day) }}</div>
            </div>
          </div>

          <!-- Time Slots -->
          <template v-for="slot in timeSlots" :key="slot">
            <!-- Time Column -->
            <div class="time-column cell">
              <div class="pa-3 text-center text-body-2 text-grey">
                {{ slot }}
              </div>
            </div>

            <!-- Day Cells -->
            <div v-for="day in weekDays" :key="`${day}-${slot}`" class="day-column cell">
              <div class="pa-2">
                <div v-for="session in getSessionsForSlot(day, slot)" :key="session.id" class="session-card mb-2"
                  :class="session.color" @click="viewSession(session)">
                  <div class="font-weight-bold text-body-2 mb-1">{{ session.code }}</div>
                  <div class="text-caption">{{ session.subject }}</div>
                  <div class="text-caption">
                    <v-icon size="x-small">mdi-map-marker</v-icon>
                    {{ session.room }}
                  </div>
                  <div class="text-caption">
                    <v-icon size="x-small">mdi-account-group</v-icon>
                    {{ session.group }}
                  </div>
                </div>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Legend -->
    <div class="legend-section">
      <v-card class="legend-card" elevation="0">
        <v-card-text>
          <div class="d-flex align-center flex-wrap gap-4">
            <span class="legend-title">Legend:</span>
            <div class="d-flex align-center">
              <div class="legend-box bg-blue mr-2"></div>
              <span class="legend-text">Data Structures</span>
            </div>
            <div class="d-flex align-center">
              <div class="legend-box bg-green mr-2"></div>
              <span class="legend-text">Database</span>
            </div>
            <div class="d-flex align-center">
              <div class="legend-box bg-orange mr-2"></div>
              <span class="legend-text">Web Development</span>
            </div>
            <div class="d-flex align-center">
              <div class="legend-box bg-purple mr-2"></div>
              <span class="legend-text">Mobile Development</span>
            </div>
            <div class="d-flex align-center">
              <div class="legend-box bg-red mr-2"></div>
              <span class="legend-text">Software Engineering</span>
            </div>
            <div class="d-flex align-center">
              <div class="legend-box bg-indigo mr-2"></div>
              <span class="legend-text">AI</span>
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  // middleware: ['auth', 'role-lecturer'],
  layout: 'lecturer'
})

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = [
  '08:00 - 10:00',
  '10:00 - 12:00',
  '13:00 - 15:00',
  '15:00 - 17:00'
]

const currentWeek = ref(0)
const addScheduleDialog = ref(false)

// Computed stats
const totalSessions = computed(() => schedule.value.length)

const todaySessions = computed(() => {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long' })
  return schedule.value.filter(s => s.day === today).length
})

const thisWeekSessions = computed(() => {
  if (currentWeek.value === 0) {
    return schedule.value.length
  }
  return 0 // For other weeks, you'd implement actual filtering
})

const currentWeekLabel = computed(() => {
  if (currentWeek.value === 0) return 'This Week'
  if (currentWeek.value === -1) return 'Last Week'
  if (currentWeek.value === 1) return 'Next Week'
  return `Week ${currentWeek.value > 0 ? '+' : ''}${currentWeek.value}`
})

const currentWeekRange = computed(() => {
  const today = new Date()
  const firstDay = new Date(today.setDate(today.getDate() - today.getDay() + 1 + (currentWeek.value * 7)))
  const lastDay = new Date(firstDay)
  lastDay.setDate(lastDay.getDate() + 4)

  return `${firstDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${lastDay.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}`
})

const schedule = ref([
  {
    id: 1,
    day: 'Monday',
    time: '08:00 - 10:00',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    group: 'CS-9-G1',
    room: 'Lab 301',
    color: 'bg-blue'
  },
  {
    id: 2,
    day: 'Monday',
    time: '10:00 - 12:00',
    subject: 'Database Management',
    code: 'CS303',
    group: 'IT-10-G2',
    room: 'Room 205',
    color: 'bg-green'
  },
  {
    id: 3,
    day: 'Monday',
    time: '13:00 - 15:00',
    subject: 'Software Engineering',
    code: 'CS301',
    group: 'CS-10-G2',
    room: 'Room 201',
    color: 'bg-red'
  },
  {
    id: 4,
    day: 'Tuesday',
    time: '08:00 - 10:00',
    subject: 'Web Development',
    code: 'CS405',
    group: 'CS-11-G1',
    room: 'Lab 302',
    color: 'bg-orange'
  },
  {
    id: 5,
    day: 'Tuesday',
    time: '10:00 - 12:00',
    subject: 'Artificial Intelligence',
    code: 'CS501',
    group: 'CS-12-G1',
    room: 'Lab 401',
    color: 'bg-indigo'
  },
  {
    id: 6,
    day: 'Wednesday',
    time: '08:00 - 10:00',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    group: 'CS-9-G1',
    room: 'Lab 301',
    color: 'bg-blue'
  },
  {
    id: 7,
    day: 'Wednesday',
    time: '13:00 - 15:00',
    subject: 'Mobile App Development',
    code: 'CS407',
    group: 'SE-11-G3',
    room: 'Lab 303',
    color: 'bg-purple'
  },
  {
    id: 8,
    day: 'Wednesday',
    time: '13:00 - 15:00',
    subject: 'Software Engineering',
    code: 'CS301',
    group: 'CS-10-G2',
    room: 'Room 201',
    color: 'bg-red'
  },
  {
    id: 9,
    day: 'Thursday',
    time: '08:00 - 10:00',
    subject: 'Database Management',
    code: 'CS303',
    group: 'IT-10-G2',
    room: 'Room 205',
    color: 'bg-green'
  },
  {
    id: 10,
    day: 'Thursday',
    time: '10:00 - 12:00',
    subject: 'Mobile App Development',
    code: 'CS407',
    group: 'SE-11-G3',
    room: 'Lab 303',
    color: 'bg-purple'
  },
  {
    id: 11,
    day: 'Thursday',
    time: '13:00 - 15:00',
    subject: 'Artificial Intelligence',
    code: 'CS501',
    group: 'CS-12-G1',
    room: 'Lab 401',
    color: 'bg-indigo'
  },
  {
    id: 12,
    day: 'Friday',
    time: '08:00 - 10:00',
    subject: 'Data Structures & Algorithms',
    code: 'CS201',
    group: 'CS-9-G1',
    room: 'Lab 301',
    color: 'bg-blue'
  },
  {
    id: 13,
    day: 'Friday',
    time: '10:00 - 12:00',
    subject: 'Web Development',
    code: 'CS405',
    group: 'CS-11-G1',
    room: 'Lab 302',
    color: 'bg-orange'
  }
])

const getSessionsForSlot = (day, time) => {
  return schedule.value.filter(s => s.day === day && s.time === time)
}

const getDayDate = (day) => {
  const dayIndex = weekDays.indexOf(day)
  const today = new Date()
  const targetDate = new Date(today.setDate(today.getDate() - today.getDay() + 1 + dayIndex + (currentWeek.value * 7)))
  return targetDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

const previousWeek = () => {
  currentWeek.value--
}

const nextWeek = () => {
  currentWeek.value++
}

const viewSession = (session) => {
  console.log('View session:', session)
  // Navigate to class details or session page
}

// Import/Export functions
const handleImportCSV = () => {
  console.log('Importing schedule from CSV...')
  // Implementation for CSV import
}

const handleExportExcel = () => {
  console.log('Exporting schedule to Excel...')
  // Implementation for Excel export
}

const handleExportPDF = () => {
  console.log('Exporting schedule to PDF...')
  // Implementation for PDF export
}
</script>

<style scoped>
.schedule-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 0;
}

/* Modern Header Styles */
.modern-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 32px;
}

.title-section {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 20px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: #3b82f6;
}

.breadcrumb-separator {
  opacity: 0.5;
}

.stats-cards {
  display: flex;
  gap: 16px;
}

.stat-card {
  background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 16px 20px;
  min-width: 100px;
  text-align: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: all 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 24px;
  font-weight: 700;
  color: #1e293b;
  line-height: 1;
  margin-bottom: 4px;
}

.stat-label {
  font-size: 12px;
  font-weight: 500;
  color: #64748b;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.action-section {
  display: flex;
  gap: 12px;
  align-items: center;
}

.modern-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 20px;
  transition: all 0.2s ease;
  border: 1px solid #e2e8f0;
}

.modern-btn:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.add-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  border: none !important;
  color: white !important;
}

.modern-menu {
  border-radius: 12px;
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.menu-item {
  padding: 12px 16px;
  border-radius: 8px;
  margin: 4px;
  transition: all 0.2s ease;
}

.menu-item:hover {
  background: #f8fafc;
}

/* Modern Table Section */
.modern-table-section {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
}

.table-container {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  overflow: hidden;
}

/* Week Selector */
.week-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid #f1f5f9;
  background: #f8fafc;
}

.nav-btn {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.nav-btn:hover {
  background: #e2e8f0;
  transform: scale(1.05);
}

.week-info {
  text-align: center;
  flex: 1;
}

.week-label {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
}

.week-range {
  font-size: 14px;
  color: #64748b;
}

/* Schedule Grid */
.schedule-grid {
  display: grid;
  grid-template-columns: 120px repeat(5, 1fr);
  min-width: 100%;
}

.header-cell {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  border-bottom: 2px solid #e2e8f0;
  border-right: 1px solid #e2e8f0;
  font-weight: 600;
  color: #374151;
}

.cell {
  border-bottom: 1px solid #f1f5f9;
  border-right: 1px solid #f1f5f9;
  min-height: 100px;
  transition: all 0.2s ease;
}

.cell:hover {
  background: #f8fafc;
}

.time-column {
  border-left: 1px solid #e2e8f0;
  background: #fafbfc;
}

.session-card {
  padding: 8px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.session-card:hover {
  transform: scale(1.02);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bg-blue {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.bg-green {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
}

.bg-orange {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.bg-purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
}

.bg-red {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
}

.bg-indigo {
  background: linear-gradient(135deg, #3F51B5 0%, #283593 100%);
}

/* Legend Section */
.legend-section {
  max-width: 1400px;
  margin: 24px auto 0;
  padding: 0 32px;
}

.legend-card {
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
  border: 1px solid #e2e8f0;
}

.legend-title {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
}

.legend-text {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.legend-box {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.legend-box.bg-blue {
  background: linear-gradient(135deg, #2196F3 0%, #1976D2 100%);
}

.legend-box.bg-green {
  background: linear-gradient(135deg, #4CAF50 0%, #2E7D32 100%);
}

.legend-box.bg-orange {
  background: linear-gradient(135deg, #FF9800 0%, #F57C00 100%);
}

.legend-box.bg-purple {
  background: linear-gradient(135deg, #9C27B0 0%, #7B1FA2 100%);
}

.legend-box.bg-red {
  background: linear-gradient(135deg, #F44336 0%, #C62828 100%);
}

.legend-box.bg-indigo {
  background: linear-gradient(135deg, #3F51B5 0%, #283593 100%);
}

/* Responsive Design */
@media (max-width: 1200px) {
  .header-container {
    padding: 20px 24px;
    gap: 24px;
  }

  .action-section {
    flex-direction: column;
    gap: 8px;
  }
}

@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    gap: 20px;
  }

  .modern-table-section,
  .legend-section {
    padding: 16px 20px;
  }

  .title-wrapper {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .stats-cards {
    flex-wrap: wrap;
    gap: 12px;
  }

  .schedule-grid {
    grid-template-columns: 80px repeat(5, 1fr);
    font-size: 12px;
  }

  .week-selector {
    padding: 16px;
  }
}

/* Animation for smooth transitions */
.schedule-grid,
.stat-card,
.session-card {
  animation: fadeInUp 0.5s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
