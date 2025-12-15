<template>
  <div class="uas-page">
    <div class="uas-page-header">
      <div>
        <h1 class="uas-page-title">Leave Request</h1>
        <p class="uas-page-subtitle">Submit and manage your leave requests</p>
      </div>
      <div class="uas-page-actions">
        <VBtn color="primary" prepend-icon="mdi-plus" @click="showRequestDialog = true">
          New Request
        </VBtn>
      </div>
    </div>

    <!-- Leave Request Statistics -->
    <VRow>
      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="warning" class="mr-3">mdi-clock-outline</VIcon>
              <div>
                <div class="text-h6">Pending</div>
                <div class="text-h4">{{ pendingCount }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="success" class="mr-3">mdi-check-circle</VIcon>
              <div>
                <div class="text-h6">Approved</div>
                <div class="text-h4">{{ approvedCount }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>

      <VCol cols="12" md="4">
        <VCard class="uas-card">
          <VCardText>
            <div class="d-flex align-center">
              <VIcon size="48" color="error" class="mr-3">mdi-close-circle</VIcon>
              <div>
                <div class="text-h6">Rejected</div>
                <div class="text-h4">{{ rejectedCount }}</div>
              </div>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>

    <!-- Leave Requests List -->
    <VCard class="uas-card mt-4">
      <VCardTitle>My Leave Requests</VCardTitle>
      <VCardText>
        <VDataTable
          :headers="headers"
          :items="leaveRequests"
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

    <!-- New Request Dialog -->
    <VDialog v-model="showRequestDialog" max-width="600">
      <VCard>
        <VCardTitle>New Leave Request</VCardTitle>
        <VCardText>
          <VForm>
            <VSelect
              v-model="newRequest.type"
              :items="['Sick Leave', 'Personal Leave', 'Emergency']"
              label="Leave Type"
              class="mb-4"
            />
            <VTextField
              v-model="newRequest.startDate"
              label="Start Date"
              type="date"
              class="mb-4"
            />
            <VTextField
              v-model="newRequest.endDate"
              label="End Date"
              type="date"
              class="mb-4"
            />
            <VTextarea
              v-model="newRequest.reason"
              label="Reason"
              rows="4"
            />
          </VForm>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn @click="showRequestDialog = false">Cancel</VBtn>
          <VBtn color="primary" @click="submitRequest">Submit</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup>
import { ref } from 'vue'

definePageMeta({
  layout: 'student',
  middleware: 'auth'
})

const showRequestDialog = ref(false)
const pendingCount = ref(1)
const approvedCount = ref(3)
const rejectedCount = ref(0)

const newRequest = ref({
  type: '',
  startDate: '',
  endDate: '',
  reason: ''
})

const headers = [
  { title: 'Date', key: 'date' },
  { title: 'Type', key: 'type' },
  { title: 'Reason', key: 'reason' },
  { title: 'Status', key: 'status' },
]

const leaveRequests = ref([
  { date: '2024-12-10', type: 'Sick Leave', reason: 'Medical appointment', status: 'Approved' },
  { date: '2024-12-08', type: 'Personal Leave', reason: 'Family matter', status: 'Approved' },
  { date: '2024-12-15', type: 'Emergency', reason: 'Urgent family issue', status: 'Pending' },
])

const getStatusColor = (status) => {
  switch (status) {
    case 'Approved': return 'success'
    case 'Pending': return 'warning'
    case 'Rejected': return 'error'
    default: return 'default'
  }
}

const submitRequest = () => {
  // Add API call here
  showRequestDialog.value = false
  newRequest.value = {
    type: '',
    startDate: '',
    endDate: '',
    reason: ''
  }
}
</script>

<style scoped>
.uas-page {
  padding: 16px 20px;
}

.uas-page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
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
