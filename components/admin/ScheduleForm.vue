<template>
  <div class="schedule-grid-container">
    <!-- Schedule Header -->
    <div class="schedule-header">
      <div class="schedule-title-section">
        <h3 class="schedule-title">Manage schedule</h3>
        <p class="schedule-subtitle">Manager/Group/{{ schedule.group_id }}</p>
      </div>
      <div class="subject-info">
        <p class="subject-note">Subject specify by Generation and specialize</p>
        <div class="subject-details">
          <div class="subject-type theory">
            <span class="subject-label">Theory</span>
            <div class="subject-example">
              <h4>Machine learning</h4>
              <p>Dr. MEAN Piseth</p>
              <p><strong>ROOM: A001</strong></p>
            </div>
          </div>
          <div class="subject-type lab">
            <span class="subject-label">Lab</span>
            <div class="subject-example">
              <h4>Machine learning</h4>
              <p>Dr. MEAN Piseth</p>
              <p><strong>ROOM: A001</strong></p>
            </div>
          </div>
          <div class="subject-type theory">
            <span class="subject-label">Theory</span>
            <div class="subject-example">
              <h4>Machine learning</h4>
              <p>Dr. MEAN Piseth</p>
              <p><strong>ROOM: A001</strong></p>
            </div>
          </div>
          <div class="subject-type lab">
            <span class="subject-label">Lab</span>
            <div class="subject-example">
              <h4>Machine learning</h4>
              <p>Dr. MEAN Piseth</p>
              <p><strong>ROOM: A001</strong></p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Schedule Table -->
    <div class="schedule-table-container">
      <div class="table-header-row">
        <div class="table-header semester">
          <div class="semester-info">
            <span class="semester-text">Semester: Year 4. Term 1. Group 2</span>
            <span class="date-range">Start Date: {{ formatDate(schedule.start_date) }} September, 2024</span>
          </div>
        </div>
      </div>
      
      <table class="schedule-table">
        <thead>
          <tr class="table-header-days">
            <th class="time-column">Time</th>
            <th class="day-column">Monday</th>
            <th class="day-column">Tuesday</th>
            <th class="day-column">Wednesday</th>
            <th class="day-column">Thursday</th>
            <th class="day-column">Friday</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(timeSlot, index) in timeSlots" :key="timeSlot" class="schedule-row"
              :class="{ 'break-row': isBreakTime(timeSlot) }">
            <td class="time-cell">{{ timeSlot }}</td>
            <td v-for="day in days" :key="day" class="schedule-cell"
                :class="getCellClass(day, timeSlot)"
                @click="editCell(day, timeSlot)">
              <div v-if="getScheduleData(day, timeSlot)" class="subject-cell">
                <div v-if="getScheduleData(day, timeSlot).type === 'Break'" class="break-cell">
                  <span class="break-text">{{ getScheduleData(day, timeSlot).subject }}</span>
                </div>
                <div v-else-if="getScheduleData(day, timeSlot).type === 'Seminar'" class="seminar-cell">
                  <span class="seminar-text">{{ getScheduleData(day, timeSlot).subject }}</span>
                </div>
                <div v-else class="subject-content">
                  <h4 class="subject-name">{{ getScheduleData(day, timeSlot).subject }}</h4>
                  <p v-if="getScheduleData(day, timeSlot).lecturer" class="lecturer-name">
                    {{ getScheduleData(day, timeSlot).lecturer }}
                  </p>
                  <p v-if="getScheduleData(day, timeSlot).room" class="room-info">
                    <strong>Room: {{ getScheduleData(day, timeSlot).room }}</strong>
                  </p>
                  <span v-if="getScheduleData(day, timeSlot).type" class="subject-type-badge"
                        :class="getScheduleData(day, timeSlot).type.toLowerCase()">
                    {{ getScheduleData(day, timeSlot).type }}
                  </span>
                </div>
              </div>
              <div v-else class="empty-cell" @click="editCell(day, timeSlot)">
                <v-icon icon="mdi-plus" size="16" color="grey-lighten-1" v-if="editable" />
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Edit Cell Dialog -->
    <v-dialog v-model="editDialog" max-width="500" persistent>
      <v-card class="edit-cell-dialog">
        <v-card-title class="dialog-title">
          <v-icon icon="mdi-calendar-edit" class="mr-2" />
          Edit Schedule Slot
        </v-card-title>
        <v-card-subtitle>
          {{ selectedDay }} - {{ selectedTime }}
        </v-card-subtitle>

        <v-divider />

        <v-card-text class="pt-4">
          <v-form ref="editFormRef" v-model="editFormValid">
            <v-select v-model="editFormData.type" :items="subjectTypes" label="Type" variant="outlined"
              density="compact" class="mb-3" />
            
            <template v-if="editFormData.type === 'Break'">
              <v-text-field v-model="editFormData.subject" label="Break Description" variant="outlined"
                density="compact" placeholder="e.g., Break (20min)" />
            </template>
            
            <template v-else-if="editFormData.type === 'Seminar'">
              <v-text-field v-model="editFormData.subject" label="Seminar Title" variant="outlined"
                density="compact" placeholder="e.g., SEMINAR" />
            </template>
            
            <template v-else>
              <v-text-field v-model="editFormData.subject" label="Subject" variant="outlined" density="compact"
                placeholder="e.g., Machine Learning" class="mb-3" />
              
              <v-text-field v-model="editFormData.lecturer" label="Lecturer" variant="outlined" density="compact"
                placeholder="e.g., Dr. John Doe" class="mb-3" />
              
              <v-text-field v-model="editFormData.room" label="Room" variant="outlined" density="compact"
                placeholder="e.g., A001" class="mb-3" />
            </template>
          </v-form>
        </v-card-text>

        <v-divider />

        <v-card-actions class="pa-4">
          <v-btn variant="outlined" @click="closeEditDialog">
            Cancel
          </v-btn>
          <v-spacer />
          <v-btn color="error" variant="text" @click="clearCell" v-if="hasExistingData">
            Clear
          </v-btn>
          <v-btn color="primary" variant="flat" @click="saveCell">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
const props = defineProps({
  schedule: {
    type: Object,
    required: true
  },
  editable: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update-slot'])

// Reactive data
const editDialog = ref(false)
const selectedDay = ref('')
const selectedTime = ref('')
const editFormValid = ref(false)
const editFormRef = ref(null)

const editFormData = reactive({
  subject: '',
  lecturer: '',
  room: '',
  type: 'Theory'
})

// Constants
const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
const timeSlots = [
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

const subjectTypes = ['Theory', 'Lab', 'Project', 'Seminar', 'Break']

// Computed
const hasExistingData = computed(() => {
  const data = getScheduleData(selectedDay.value, selectedTime.value)
  return data && data.subject
})

// Methods
const getScheduleData = (day, time) => {
  if (!props.schedule?.schedule_data?.[day]) return null
  return props.schedule.schedule_data[day].find(slot => slot.time === time)
}

const isBreakTime = (timeSlot) => {
  const breakTimes = ['09:30-09:50', '11:20-12:10', '13:40-13:50', '15:20-15:30']
  return breakTimes.includes(timeSlot)
}

const getCellClass = (day, timeSlot) => {
  const data = getScheduleData(day, timeSlot)
  if (!data) return 'empty'
  
  return {
    'break-time': data.type === 'Break',
    'seminar-time': data.type === 'Seminar',
    'theory-time': data.type === 'Theory',
    'lab-time': data.type === 'Lab',
    'project-time': data.type === 'Project'
  }
}

const editCell = (day, timeSlot) => {
  if (!props.editable) return
  
  selectedDay.value = day
  selectedTime.value = timeSlot
  
  const existingData = getScheduleData(day, timeSlot)
  if (existingData) {
    Object.assign(editFormData, existingData)
  } else {
    Object.assign(editFormData, {
      subject: '',
      lecturer: '',
      room: '',
      type: isBreakTime(timeSlot) ? 'Break' : 'Theory'
    })
  }
  
  editDialog.value = true
}

const closeEditDialog = () => {
  editDialog.value = false
  Object.assign(editFormData, {
    subject: '',
    lecturer: '',
    room: '',
    type: 'Theory'
  })
}

const saveCell = () => {
  const slotData = { ...editFormData }
  emit('update-slot', selectedDay.value, selectedTime.value, slotData)
  closeEditDialog()
}

const clearCell = () => {
  const slotData = {
    subject: '',
    lecturer: '',
    room: '',
    type: ''
  }
  emit('update-slot', selectedDay.value, selectedTime.value, slotData)
  closeEditDialog()
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', { 
    day: 'numeric',
    month: 'long'
  })
}
</script>

<style scoped>
.schedule-grid-container {
  padding: 24px;
  background: #f8fafc;
  min-height: 100vh;
}

.schedule-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 24px;
  gap: 32px;
}

.schedule-title-section {
  flex-shrink: 0;
}

.schedule-title {
  font-size: 24px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.schedule-subtitle {
  color: #64748b;
  margin: 0;
  font-size: 14px;
}

.subject-info {
  flex: 1;
  max-width: 600px;
}

.subject-note {
  font-size: 14px;
  color: #64748b;
  margin: 0 0 12px 0;
}

.subject-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
}

.subject-type {
  background: white;
  padding: 12px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
  min-width: 120px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

.subject-type.theory {
  border-left: 4px solid #3b82f6;
}

.subject-type.lab {
  border-left: 4px solid #10b981;
}

.subject-label {
  display: inline-block;
  font-size: 12px;
  font-weight: 600;
  color: #374151;
  background: #f1f5f9;
  padding: 2px 8px;
  border-radius: 4px;
  margin-bottom: 8px;
}

.subject-example h4 {
  font-size: 14px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.subject-example p {
  font-size: 12px;
  color: #64748b;
  margin: 0 0 2px 0;
}

.schedule-table-container {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  overflow: hidden;
  border: 1px solid #e2e8f0;
}

.table-header-row {
  background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
  color: white;
  padding: 16px 24px;
}

.semester-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.semester-text {
  font-size: 16px;
  font-weight: 600;
}

.date-range {
  font-size: 14px;
  opacity: 0.9;
}

.schedule-table {
  width: 100%;
  border-collapse: collapse;
}

.table-header-days {
  background: #f8fafc;
  border-bottom: 2px solid #e2e8f0;
}

.table-header-days th {
  padding: 12px 8px;
  text-align: center;
  font-weight: 600;
  color: #374151;
  font-size: 14px;
  border-right: 1px solid #e2e8f0;
}

.time-column {
  width: 120px;
  background: #f1f5f9 !important;
}

.day-column {
  width: calc((100% - 120px) / 5);
}

.schedule-row {
  border-bottom: 1px solid #e2e8f0;
}

.schedule-row.break-row {
  background: #fef3e2;
}

.time-cell {
  padding: 12px 8px;
  text-align: center;
  background: #f8fafc;
  font-weight: 500;
  color: #374151;
  font-size: 12px;
  border-right: 1px solid #e2e8f0;
  vertical-align: top;
}

.schedule-cell {
  padding: 8px;
  border-right: 1px solid #e2e8f0;
  vertical-align: top;
  min-height: 80px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
}

.schedule-cell:hover {
  background-color: #f8fafc;
}

.schedule-cell.break-time {
  background: #fef3e2;
}

.schedule-cell.seminar-time {
  background: #1e40af;
}

.subject-cell {
  height: 100%;
  min-height: 60px;
}

.break-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
}

.break-text {
  font-size: 12px;
  font-weight: 500;
  color: #92400e;
  text-align: center;
}

.seminar-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
}

.seminar-text {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
}

.subject-content {
  padding: 4px;
  height: 100%;
  position: relative;
}

.subject-name {
  font-size: 12px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
  line-height: 1.3;
}

.lecturer-name {
  font-size: 11px;
  color: #64748b;
  margin: 0 0 4px 0;
}

.room-info {
  font-size: 11px;
  color: #374151;
  margin: 0 0 4px 0;
}

.subject-type-badge {
  position: absolute;
  bottom: 4px;
  right: 4px;
  font-size: 9px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 4px;
  text-transform: uppercase;
}

.subject-type-badge.theory {
  background: #dbeafe;
  color: #1e40af;
}

.subject-type-badge.lab {
  background: #d1fae5;
  color: #065f46;
}

.subject-type-badge.project {
  background: #fef3c7;
  color: #92400e;
}

.empty-cell {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 60px;
  opacity: 0.5;
}

.empty-cell:hover {
  opacity: 1;
  background: #f1f5f9;
}

.edit-cell-dialog .dialog-title {
  display: flex;
  align-items: center;
  font-weight: 600;
  color: #1e293b;
}
</style>