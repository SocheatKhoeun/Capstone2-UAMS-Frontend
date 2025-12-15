<template>
  <div>
    <!-- Filters -->
    <VCard class="uas-card mb-4" variant="flat">
      <VCardText class="d-flex flex-wrap gap-4">
        <VSelect
          v-model="filters.status"
          :items="statusOptions"
          label="Status"
          density="comfortable"
          class="filter-item"
          clearable
        />
        <VMenu
          v-model="dateMenu"
          :close-on-content-click="false"
          transition="scale-transition"
          max-width="290"
          min-width="290"
        >
          <template #activator="{ props }">
            <VTextField
              v-bind="props"
              v-model="dateRangeLabel"
              label="Date range"
              readonly
              density="comfortable"
              prepend-inner-icon="mdi-calendar-range"
            />
          </template>
          <VDatePicker v-model="filters.dateRange" range @update:model-value="onDateRangeChange" />
        </VMenu>
      </VCardText>
    </VCard>

    <!-- Table -->
    <VCard class="uas-card">
      <VDataTable
        :headers="headers"
        :items="filteredLeaves"
        :items-per-page="10"
        class="leave-table"
      >
        <template #item.period="{ item }">
          <div>
            {{ formatDate(item.from_date) }} → {{ formatDate(item.to_date) }}
          </div>
          <div class="text-caption text-medium-emphasis">
            {{ item.days }} day(s)
          </div>
        </template>
        <template #item.status="{ item }">
          <VChip
            :color="statusColor(item.status)"
            size="small"
            label
            class="text-capitalize"
          >
            {{ item.status }}
          </VChip>
        </template>
        <template #item.created_at="{ item }">
          {{ formatDateTime(item.created_at) }}
        </template>
        <template #item.actions="{ item }">
          <VBtn
            icon
            size="small"
            variant="text"
            @click="viewDetail(item)"
          >
            <VIcon icon="mdi-open-in-new" size="18" />
          </VBtn>
        </template>
      </VDataTable>
    </VCard>

    <!-- Detail dialog -->
    <VDialog v-model="detailDialog" max-width="500">
      <VCard v-if="selectedLeave">
        <VCardTitle>{{ selectedLeave.reason || 'Leave Request' }}</VCardTitle>
        <VCardText>
          <div class="mb-2">
            <strong>Period:</strong>
            {{ formatDate(selectedLeave.from_date) }} → {{ formatDate(selectedLeave.to_date) }}
          </div>
          <div class="mb-2">
            <strong>Status:</strong>
            <VChip
              :color="statusColor(selectedLeave.status)"
              size="small"
              label
              class="ml-1 text-capitalize"
            >
              {{ selectedLeave.status }}
            </VChip>
          </div>
          <div class="mb-2">
            <strong>Reason:</strong>
            <div class="mt-1">
              {{ selectedLeave.reason || '—' }}
            </div>
          </div>
          <div class="mb-2 text-caption text-medium-emphasis">
            Submitted at: {{ formatDateTime(selectedLeave.created_at) }}
          </div>
        </VCardText>
        <VCardActions>
          <VSpacer />
          <VBtn variant="text" @click="detailDialog = false">Close</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface LeaveItem {
  id: number
  from_date: string
  to_date: string
  reason: string | null
  status: 'pending' | 'approved' | 'rejected' | 'canceled'
  created_at: string
  days: number
}

const headers = [
  { title: 'ID', value: 'id', width: 70 },
  { title: 'Period', value: 'period', sortable: false },
  { title: 'Reason', value: 'reason', sortable: false },
  { title: 'Status', value: 'status' },
  { title: 'Submitted At', value: 'created_at' },
  { title: '', value: 'actions', sortable: false, width: 60 },
]

const statusOptions = [
  { title: 'Pending', value: 'pending' },
  { title: 'Approved', value: 'approved' },
  { title: 'Rejected', value: 'rejected' },
  { title: 'Canceled', value: 'canceled' },
]

const leaves = ref<LeaveItem[]>([])

const filters = ref({
  status: null as LeaveItem['status'] | null,
  dateRange: null as { start: string; end: string } | null,
})

const dateMenu = ref(false)

const dateRangeLabel = computed(() => {
  if (!filters.value.dateRange) return 'All dates'
  const { start, end } = filters.value.dateRange
  if (!start || !end) return 'All dates'
  return `${start} → ${end}`
})

const filteredLeaves = computed(() =>
  leaves.value.filter(l => {
    if (filters.value.status && l.status !== filters.value.status) return false
    if (filters.value.dateRange) {
      const { start, end } = filters.value.dateRange
      const d = l.from_date.slice(0, 10)
      if (start && d < start) return false
      if (end && d > end) return false
    }
    return true
  })
)

const statusColor = (status: LeaveItem['status']) => {
  switch (status) {
    case 'pending': return 'warning'
    case 'approved': return 'success'
    case 'rejected': return 'error'
    case 'canceled': return 'default'
    default: return 'default'
  }
}

const formatDate = (d: string) =>
  new Date(d).toLocaleDateString()

const formatDateTime = (d: string) =>
  new Date(d).toLocaleString()

const onDateRangeChange = () => {}

const fetchLeaves = async () => {
  // TODO: Replace with real API call
  // Example mock data:
  leaves.value = [
    {
      id: 1,
      from_date: '2025-12-01',
      to_date: '2025-12-03',
      reason: 'Family event',
      status: 'approved',
      created_at: '2025-11-25T10:00:00Z',
      days: 3,
    },
    {
      id: 2,
      from_date: '2025-11-15',
      to_date: '2025-11-15',
      reason: 'Medical appointment',
      status: 'pending',
      created_at: '2025-11-10T09:00:00Z',
      days: 1,
    },
    {
      id: 3,
      from_date: '2025-10-10',
      to_date: '2025-10-12',
      reason: 'Personal',
      status: 'rejected',
      created_at: '2025-10-05T14:00:00Z',
      days: 3,
    },
  ]
}

const detailDialog = ref(false)
const selectedLeave = ref<LeaveItem | null>(null)

const viewDetail = (item: LeaveItem) => {
  selectedLeave.value = item
  detailDialog.value = true
}

onMounted(() => {
  fetchLeaves()
})
</script>

<style scoped>
.uas-card {
  border-radius: 10px;
}
.filter-item {
  min-width: 200px;
}
.leave-table {
  font-size: 15px;
}
</style>