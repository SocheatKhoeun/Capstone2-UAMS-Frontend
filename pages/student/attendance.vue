<template>
  <div class="uas-page">
    <div class="uas-page-header">
      <div>
        <h1 class="uas-page-title">My Attendance</h1>
        <p class="uas-page-subtitle">View your attendance records and statistics</p>
      </div>
    </div>

    <VRow>
      <!-- Attendance Summary Cards -->
      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="success" class="mr-3">mdi-check-circle</VIcon>
              <div>
                <div class="text-h6">Attendance Rate</div>
                <div class="text-h4">{{ attendanceRate }}%</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="primary" class="mr-3">mdi-calendar-check</VIcon>
              <div>
                <div class="text-h6">Present</div>
                <div class="text-h4">{{ presentCount }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="error" class="mr-3">mdi-calendar-remove</VIcon>
              <div>
                <div class="text-h6">Absent</div>
                <div class="text-h4">{{ absentCount }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Attendance Records -->
    <VCard class="uas-card mt-4">
      <VCardTitle>Attendance Records</VCardTitle>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="attendanceRecords"
          :items-per-page="10"
          class="elevation-0"
        >
          <template #[`item.status`]="{ item }">
            <VChip
              :color="getStatusColor(item.status)"
              size="small"
              label
            >
              {{ item.status }}
            </VChip>
          </template>
        </VDataTable>
      </VCardText>
    </VCard>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'student',
  middleware: 'auth'
})

const attendanceRate = ref(87)
const presentCount = ref(26)
const absentCount = ref(4)

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Subject', key: 'subject' },
  { title: 'Time', key: 'time' },
  { title: 'Status', key: 'status' },
]

const attendanceRecords = ref([
  { date: '2024-12-14', subject: 'Mathematics', time: '08:00 - 10:00', status: 'Present' },
  { date: '2024-12-14', subject: 'Computer Science', time: '10:30 - 12:30', status: 'Present' },
  { date: '2024-12-13', subject: 'Physics', time: '14:00 - 16:00', status: 'Present' },
  { date: '2024-12-13', subject: 'English', time: '16:30 - 18:30', status: 'Absent' },
])

const getStatusColor = (status) => {
  return status === 'Present' ? 'success' : 'error'
}
</script>

<style scoped>
.uas-page {
  padding: 16px 20px;
}

.uas-page-header {
  margin-bottom: 24px;
}

.uas-page-title {
  font-size: 24px;
  font-weight: 600;
  margin: 0;
}

.uas-page-subtitle {
  font-size: 14px;
  opacity: 0.7;
  margin: 4px 0 0;
}

.uas-card {
  border-radius: 10px;
}
</style>
