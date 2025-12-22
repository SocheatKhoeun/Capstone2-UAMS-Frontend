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
              <v-btn class="modern-btn" prepend-icon="mdi-import" variant="outlined" color="grey" v-bind="props"
                elevation="0">
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
              <v-btn class="modern-btn" prepend-icon="mdi-export" variant="outlined" color="grey" v-bind="props"
                elevation="0">
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
        <div class="schedule-grid" :style="gridStyle">
          <!-- Top-left corner cell -->
          <div class="corner-cell header-cell">
            <div class="pa-3 text-center font-weight-bold text-body-2">Time / Day</div>
          </div>

          <!-- Header Row - Days of Week -->
          <div v-for="day in activeWeekDays" :key="`header-${day}`" class="day-column header-cell">
            <div class="pa-3 text-center">
              <div class="font-weight-bold text-body-2">{{ day }}</div>
              <div class="text-caption text-grey">{{ getDayDate(day) }}</div>
            </div>
          </div>

          <!-- Time Slot Rows -->
          <template v-for="slot in timeSlots" :key="`time-${slot}`">
            <!-- Time Label Column -->
            <div class="time-column header-cell">
              <div class="pa-3 text-center font-weight-bold text-body-2">{{ slot }}</div>
            </div>

            <!-- Day Cells for this Time Slot -->
            <div v-for="day in activeWeekDays" :key="`${slot}-${day}`" class="cell">
              <div class="pa-2">
                <div v-if="getSessionsForSlot(day, slot).length === 0" class="empty-slot">
                  <!-- Empty slot -->
                </div>
                <div v-for="session in getSessionsForSlot(day, slot)" :key="session.id" class="session-card mb-2"
                  :class="session.color" @click="viewSession(session)">
                  <div class="session-header mb-1">
                    <span class="font-weight-bold text-body-2">{{ session.subject }}</span>
                  </div>
                  <div class="session-info">
                    <div class="text-caption d-flex align-center mb-1">
                      <v-icon size="x-small" class="mr-1">mdi-account-group</v-icon>
                      <span class="font-weight-medium">{{ session.group }}</span>
                    </div>
                    <div class="text-caption d-flex align-center mb-1">
                      <v-icon size="x-small" class="mr-1">mdi-school</v-icon>
                      <span>{{ session.generation }}</span>
                    </div>
                    <div class="text-caption d-flex align-center">
                      <v-icon size="x-small" class="mr-1">mdi-map-marker</v-icon>
                      <span>{{ session.room }}</span>
                    </div>
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
            <span class="legend-title">Subjects:</span>
            <div v-for="[subjectId, color] in subjectColorMap" :key="subjectId" class="d-flex align-center">
              <div class="legend-box mr-2" :class="color"></div>
              <span class="legend-text">{{ getSubjectName(subjectId) }}</span>
            </div>
            <div v-if="subjectColorMap.size === 0" class="text-caption text-grey">
              No subjects scheduled yet
            </div>
          </div>
        </v-card-text>
      </v-card>
    </div>
  </div>
</template>

<script setup>
import { userAuth } from '~/store/userAuth'

definePageMeta({
  middleware: ['auth'],
  layout: 'lecturer'
})

const userStore = userAuth()

const weekDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const currentWeek = ref(0)
const addScheduleDialog = ref(false)

// Reference data
const groups = ref([])
const subjects = ref([])
const rooms = ref([])
const generations = ref([])
const schedules = ref([])
const loading = ref(false)
const currentInstructorId = ref(null)

// Dynamic color palette for subjects
const colorPalette = [
  'bg-blue',
  'bg-green',
  'bg-orange',
  'bg-purple',
  'bg-red',
  'bg-indigo',
  'bg-teal',
  'bg-pink',
  'bg-cyan',
  'bg-amber',
  'bg-lime',
  'bg-brown'
]

// Subject color mapping (dynamically assigned, consistent per subject)
const subjectColorMap = ref(new Map())

// Dynamically generate time slots from actual schedule data
const timeSlots = computed(() => {
  const slots = new Set()

  schedule.value.forEach(s => {
    if (s.time) {
      slots.add(s.time)
    }
  })

  // If no slots found, return default slots
  if (slots.size === 0) {
    return [
      '08:00 - 10:00',
      '10:00 - 12:00',
      '13:00 - 15:00',
      '15:00 - 17:00'
    ]
  }

  // Sort time slots chronologically
  return Array.from(slots).sort((a, b) => {
    const timeA = a.split(' - ')[0]
    const timeB = b.split(' - ')[0]
    return timeA.localeCompare(timeB)
  })
})

// Filter weekdays that have actual schedules
const activeWeekDays = computed(() => {
  const daysWithSchedule = new Set()

  schedule.value.forEach(s => {
    if (s.day) {
      daysWithSchedule.add(s.day)
    }
  })

  // If no days found, return weekdays only
  if (daysWithSchedule.size === 0) {
    return weekDays.filter(day => ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].includes(day))
  }

  // Return days in order, filtering to show only days that exist in schedule
  return weekDays.filter(day => daysWithSchedule.has(day))
})

// Dynamic grid style based on number of active days
const gridStyle = computed(() => {
  const numDays = activeWeekDays.value.length || 5
  return {
    gridTemplateColumns: `150px repeat(${numDays}, minmax(180px, 1fr))`
  }
})

// Get current instructor's ID from token
const getCurrentInstructorId = () => {
  const user = userStore.getUser()
  const token = userStore.getToken()

  if (user?.id) {
    return user.id
  }

  // Decode token to get instructor ID
  if (token) {
    try {
      const parts = token.split('.')
      if (parts.length === 3) {
        const payload = JSON.parse(atob(parts[1]))
        return payload.user_id || payload.userId || null
      }
    } catch (e) {
      console.error('Failed to decode token:', e)
    }
  }

  return null
}

// Filter schedules for current lecturer
const lecturerSchedules = computed(() => {
  if (!currentInstructorId.value) return []

  return schedules.value.filter(schedule => {
    return schedule.instructor_id === currentInstructorId.value ||
      schedule.assistant_id === currentInstructorId.value
  })
})

// Transform backend data to UI format
const schedule = computed(() => {
  return lecturerSchedules.value.map(s => {
    const startTime = s.start_time ? new Date(s.start_time) : null
    const endTime = s.end_time ? new Date(s.end_time) : null

    let day = 'Monday'
    let timeSlot = '08:00 - 10:00'

    if (startTime) {
      const dayIndex = startTime.getDay() // 0 = Sunday, 1 = Monday, etc.
      const dayMap = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
      day = dayMap[dayIndex] || 'Monday'

      const hours = startTime.getHours()
      const minutes = startTime.getMinutes()
      const startStr = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`

      if (endTime) {
        const endHours = endTime.getHours()
        const endMinutes = endTime.getMinutes()
        const endStr = `${endHours.toString().padStart(2, '0')}:${endMinutes.toString().padStart(2, '0')}`
        timeSlot = `${startStr} - ${endStr}`
      } else {
        // Default 2 hour duration if no end time
        const endHours = hours + 2
        const endStr = `${endHours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`
        timeSlot = `${startStr} - ${endStr}`
      }
    }

    const subjectName = getSubjectName(s.subject_id)
    const subjectCode = getSubjectCode(subjectName)
    const color = getSubjectColor(s.subject_id)

    // Get group name from multiple possible sources
    let groupName = 'Unknown Group'
    if (s.groups && s.groups.length > 0) {
      groupName = s.groups[0].name || s.groups[0].group_name || 'Unknown Group'
    } else if (s.group_id) {
      groupName = getGroupName(s.group_id)
    }

    return {
      id: s.global_id || s.id,
      day: day,
      time: timeSlot,
      subject: subjectName,
      code: subjectCode,
      group: groupName,
      room: getRoomName(s.room_id),
      generation: getGenerationName(s.generation_id),
      color: color,
      rawData: s
    }
  })
})

// Helper to get subject color based on subject ID (consistent per subject)
const getSubjectColor = (subjectId) => {
  // Check if we already have a color for this subject
  if (subjectColorMap.value.has(subjectId)) {
    return subjectColorMap.value.get(subjectId)
  }

  // Assign a new color based on the current map size
  const colorIndex = subjectColorMap.value.size % colorPalette.length
  const assignedColor = colorPalette[colorIndex]

  // Store the color for this subject
  subjectColorMap.value.set(subjectId, assignedColor)

  return assignedColor
}

// Helper to generate subject code
const getSubjectCode = (subjectName) => {
  const words = subjectName.split(' ')
  if (words.length >= 2) {
    return words.map(w => w[0]).join('').toUpperCase().substring(0, 3) + '101'
  }
  return subjectName.substring(0, 3).toUpperCase() + '101'
}

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

const getSessionsForSlot = (day, time) => {
  return schedule.value.filter(s => s.day === day && s.time === time)
}

const getDayDate = (day) => {
  const dayIndex = weekDays.indexOf(day)
  if (dayIndex === -1) return ''

  const today = new Date()
  const currentDay = today.getDay() // 0 = Sunday
  const targetDay = dayIndex

  // Calculate days to add/subtract to get to target day
  let daysToAdd = targetDay - currentDay + (currentWeek.value * 7)

  const targetDate = new Date(today)
  targetDate.setDate(today.getDate() + daysToAdd)

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

// Helper functions to get reference data names
const getGroupName = (id) => {
  const group = groups.value.find(g => g.id === id)
  if (!group) {
    console.log('❌ Group not found for id:', id, 'Available groups:', groups.value.map(g => ({ id: g.id, name: g.group_name || g.name })))
  }
  return group?.group_name || group?.name || 'Unknown Group'
}

const getSubjectName = (id) => {
  const subject = subjects.value.find(s => s.id === id)
  return subject?.name || 'Unknown Subject'
}

const getRoomName = (id) => {
  const room = rooms.value.find(r => r.id === id)
  return room?.room || 'No Room'
}

const getGenerationName = (id) => {
  const generation = generations.value.find(g => g.id === id)
  return generation?.generation || 'N/A'
}

// Fetch reference data
const fetchReferenceData = async () => {
  try {
    const { $UserPrivateAxios } = useNuxtApp()

    // Use lecturer endpoints instead of admin endpoints
    const [groupsRes, subjectsRes, roomsRes, generationsRes] = await Promise.all([
      $UserPrivateAxios.get('/lecturer/auth/groups/'),
      $UserPrivateAxios.get('/lecturer/auth/subjects/'),
      $UserPrivateAxios.get('/lecturer/auth/rooms/'),
      $UserPrivateAxios.get('/lecturer/auth/generations/')
    ])

    groups.value = groupsRes.data?.data || []
    subjects.value = subjectsRes.data?.data || []
    rooms.value = roomsRes.data?.data || []
    generations.value = generationsRes.data?.data || []

    console.log('📚 Reference data loaded:', {
      groups: groups.value.length,
      subjects: subjects.value.length,
      rooms: rooms.value.length,
      generations: generations.value.length,
      sampleGroup: groups.value[0],
      groupsData: groups.value.slice(0, 3)
    })
  } catch (error) {
    console.error('Failed to load reference data:', error)
  }
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

// Lifecycle - Fetch data on mount
onMounted(async () => {
  console.log('🔄 Loading lecturer schedule data...')

  // Get current instructor ID
  currentInstructorId.value = getCurrentInstructorId()
  console.log('👤 Current instructor ID:', currentInstructorId.value)

  // Fetch schedules using lecturer endpoint and reference data
  try {
    const { $UserPrivateAxios } = useNuxtApp()

    // Fetch schedules from lecturer endpoint
    const schedulesRes = await $UserPrivateAxios.get('/lecturer/auth/course_offerings/')
    schedules.value = schedulesRes.data?.data || []

    console.log('📅 Schedules fetched:', schedules.value.length)
  } catch (error) {
    console.error('Failed to fetch schedules:', error)
  }

  // Fetch reference data
  await fetchReferenceData()

  console.log('✅ Lecturer schedule loaded:', {
    totalSchedules: schedules.value.length,
    lecturerSchedules: lecturerSchedules.value.length,
    displaySchedules: schedule.value.length,
    sampleSchedule: schedules.value[0],
    groupsCount: groups.value.length,
    sampleGroup: groups.value[0]
  })
})
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
  min-width: 100%;
  gap: 0;
}

.corner-cell {
  background: linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%);
  border-bottom: 2px solid #cbd5e1;
  border-right: 2px solid #cbd5e1;
  font-weight: 700;
  color: #1e293b;
  position: sticky;
  top: 0;
  z-index: 3;
}

.corner-cell {
  z-index: 4;
  position: sticky;
  top: 0;
  left: 0;
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

.session-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 4px;
}

.session-info {
  margin-top: 6px;
  padding-top: 4px;
  border-top: 1px solid rgba(255, 255, 255, 0.2);
}

.session-info .text-caption {
  opacity: 0.95;
  line-height: 1.4;
}

.session-info .font-weight-medium {
  font-weight: 600;
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

.bg-teal {
  background: linear-gradient(135deg, #009688 0%, #00796B 100%);
}

.bg-pink {
  background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
}

.bg-cyan {
  background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
}

.bg-amber {
  background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%);
}

.bg-lime {
  background: linear-gradient(135deg, #CDDC39 0%, #AFB42B 100%);
}

.bg-brown {
  background: linear-gradient(135deg, #795548 0%, #5D4037 100%);
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

.legend-box.bg-teal {
  background: linear-gradient(135deg, #009688 0%, #00796B 100%);
}

.legend-box.bg-pink {
  background: linear-gradient(135deg, #E91E63 0%, #C2185B 100%);
}

.legend-box.bg-cyan {
  background: linear-gradient(135deg, #00BCD4 0%, #0097A7 100%);
}

.legend-box.bg-amber {
  background: linear-gradient(135deg, #FFC107 0%, #FFA000 100%);
}

.legend-box.bg-lime {
  background: linear-gradient(135deg, #CDDC39 0%, #AFB42B 100%);
}

.legend-box.bg-brown {
  background: linear-gradient(135deg, #795548 0%, #5D4037 100%);
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
    font-size: 12px;
  }

  .week-selector {
    padding: 16px;
  }

  .day-label-cell {
    font-size: 13px;
  }

  .session-card {
    font-size: 11px;
    padding: 8px;
  }

  .schedule-grid {
    font-size: 12px;
  }

  .corner-cell,
  .header-cell {
    padding: 8px 4px;
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
