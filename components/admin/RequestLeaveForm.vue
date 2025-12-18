<template>
  <v-dialog :model-value="modelValue" @update:model-value="$emit('update:modelValue', $event)" 
    max-width="800" persistent scrollable>
    <v-card class="request-leave-form">
      <!-- Form Header -->
      <div class="form-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon icon="mdi-calendar-plus" color="primary" size="28" />
          </div>
          <div class="header-text">
            <h2 class="form-title">{{ isEditMode ? 'Edit Leave Request' : 'New Leave Request' }}</h2>
            <p class="form-subtitle">{{ isEditMode ? 'Update leave request details' : 'Fill in the leave request information' }}</p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="closeForm" class="close-btn" />
      </div>

      <v-divider />

      <!-- Form Content -->
      <v-card-text class="form-content">
        <v-form ref="formRef" v-model="formValid" @submit.prevent="handleSubmit">
          <div class="form-sections">
            <!-- Student Information Section -->
            <div class="form-section">
              <div class="section-title">
                <v-icon icon="mdi-account" color="primary" size="20" />
                Student Information
              </div>
              
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.student_id"
                    label="Student ID"
                    prepend-inner-icon="mdi-identifier"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    :disabled="isEditMode"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.student_name"
                    label="Student Name"
                    prepend-inner-icon="mdi-account-outline"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.generation"
                    label="Generation"
                    prepend-inner-icon="mdi-school"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.specialize"
                    label="Specialization"
                    prepend-inner-icon="mdi-book-education"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Leave Details Section -->
            <div class="form-section">
              <div class="section-title">
                <v-icon icon="mdi-calendar-clock" color="warning" size="20" />
                Leave Details
              </div>
              
              <v-row dense>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.leave_type"
                    :items="leaveTypeOptions"
                    label="Leave Type"
                    prepend-inner-icon="mdi-format-list-bulleted-type"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-select
                    v-model="formData.status"
                    :items="statusOptions"
                    label="Status"
                    prepend-inner-icon="mdi-flag"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    :disabled="!isEditMode"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.start_date"
                    label="Start Date"
                    type="date"
                    prepend-inner-icon="mdi-calendar-start"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required]"
                    @change="calculateDuration"
                  />
                </v-col>
                <v-col cols="12" md="6">
                  <v-text-field
                    v-model="formData.end_date"
                    label="End Date"
                    type="date"
                    prepend-inner-icon="mdi-calendar-end"
                    variant="outlined"
                    density="comfortable"
                    :rules="[rules.required, rules.endDateAfterStart]"
                    @change="calculateDuration"
                  />
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    v-model="formData.duration_days"
                    label="Duration (Days)"
                    prepend-inner-icon="mdi-calendar-range"
                    variant="outlined"
                    density="comfortable"
                    readonly
                    :hint="`${formData.duration_days} ${formData.duration_days === 1 ? 'day' : 'days'}`"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.reason"
                    label="Reason for Leave"
                    prepend-inner-icon="mdi-text"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                    :rules="[rules.required]"
                  />
                </v-col>
                <v-col cols="12">
                  <v-textarea
                    v-model="formData.notes"
                    label="Additional Notes (Optional)"
                    prepend-inner-icon="mdi-note-text"
                    variant="outlined"
                    density="comfortable"
                    rows="2"
                  />
                </v-col>
              </v-row>
            </div>

            <!-- Approval Section (Edit Mode Only) -->
            <div v-if="isEditMode && formData.status !== 'Pending'" class="form-section">
              <div class="section-title">
                <v-icon icon="mdi-check-circle" color="success" size="20" />
                {{ formData.status }} Details
              </div>
              
              <v-row dense>
                <v-col cols="12" v-if="formData.status === 'Approved'">
                  <v-text-field
                    v-model="formData.approved_by"
                    label="Approved By"
                    prepend-inner-icon="mdi-account-check"
                    variant="outlined"
                    density="comfortable"
                  />
                </v-col>
                <v-col cols="12" v-if="formData.status === 'Rejected'">
                  <v-textarea
                    v-model="formData.rejection_reason"
                    label="Rejection Reason"
                    prepend-inner-icon="mdi-comment-alert"
                    variant="outlined"
                    density="comfortable"
                    rows="3"
                  />
                </v-col>
              </v-row>
            </div>
          </div>
        </v-form>
      </v-card-text>

      <v-divider />

      <!-- Form Actions -->
      <v-card-actions class="form-actions">
        <v-btn variant="outlined" color="grey-darken-1" @click="closeForm" :disabled="loading">
          <v-icon start>mdi-close</v-icon>
          Cancel
        </v-btn>
        
        <v-spacer />
        
        <v-btn 
          v-if="isEditMode" 
          variant="outlined" 
          color="error" 
          @click="handleDelete"
          :loading="loading"
        >
          <v-icon start>mdi-delete</v-icon>
          Delete
        </v-btn>
        
        <v-btn 
          color="primary" 
          variant="flat" 
          @click="handleSubmit"
          :loading="loading"
          :disabled="!formValid"
        >
          <v-icon start>{{ isEditMode ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
          {{ isEditMode ? 'Update' : 'Create' }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRequestLeaveStore } from '@/store/useRequestLeaveStore'

const props = defineProps({
  modelValue: Boolean,
  editData: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue', 'success', 'deleted'])

const requestLeaveStore = useRequestLeaveStore()
const formRef = ref(null)
const formValid = ref(false)
const loading = ref(false)

const isEditMode = computed(() => !!props.editData)

// Leave type options
const leaveTypeOptions = [
  'Medical Leave',
  'Personal Leave',
  'Family Emergency',
  'Academic Leave',
  'Other'
]

// Status options
const statusOptions = [
  'Pending',
  'Approved',
  'Rejected'
]

// Form data
const formData = ref({
  student_id: '',
  student_name: '',
  generation: '',
  specialize: '',
  leave_type: '',
  status: 'Pending',
  start_date: '',
  end_date: '',
  duration_days: 0,
  reason: '',
  notes: '',
  approved_by: '',
  rejection_reason: ''
})

// Form validation rules
const rules = {
  required: (v) => !!v || 'This field is required',
  endDateAfterStart: (v) => {
    if (!formData.value.start_date || !v) return true
    return new Date(v) >= new Date(formData.value.start_date) || 'End date must be after start date'
  }
}

// Calculate duration between dates
const calculateDuration = () => {
  if (formData.value.start_date && formData.value.end_date) {
    const start = new Date(formData.value.start_date)
    const end = new Date(formData.value.end_date)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    formData.value.duration_days = diffDays + 1
  }
}

// Reset form - MOVED BEFORE WATCH TO AVOID INITIALIZATION ERROR
const resetForm = () => {
  formData.value = {
    student_id: '',
    student_name: '',
    generation: '',
    specialize: '',
    leave_type: '',
    status: 'Pending',
    start_date: '',
    end_date: '',
    duration_days: 0,
    reason: '',
    notes: '',
    approved_by: '',
    rejection_reason: ''
  }
  formRef.value?.resetValidation()
}

// Watch for edit data changes
watch(() => props.editData, (newData) => {
  if (newData) {
    formData.value = {
      ...newData,
      start_date: newData.start_date ? newData.start_date.split('T')[0] : '',
      end_date: newData.end_date ? newData.end_date.split('T')[0] : ''
    }
  } else {
    resetForm()
  }
}, { immediate: true })

// Close form
const closeForm = () => {
  emit('update:modelValue', false)
  setTimeout(resetForm, 300)
}

// Handle form submission
const handleSubmit = async () => {
  const { valid } = await formRef.value.validate()
  if (!valid) return

  loading.value = true
  
  try {
    let result
    if (isEditMode.value) {
      result = await requestLeaveStore.updateLeaveRequest(props.editData.leave_id, formData.value)
    } else {
      result = await requestLeaveStore.createLeaveRequest(formData.value)
    }

    if (result.success) {
      emit('success', result.data)
      closeForm()
      
      // Show success notification
      const message = isEditMode.value 
        ? 'Leave request updated successfully' 
        : 'Leave request created successfully'
      
      if (window.$swal) {
        window.$swal.fire({
          icon: 'success',
          title: 'Success',
          text: message,
          timer: 2000,
          showConfirmButton: false
        })
      }
    } else {
      throw new Error(result.error)
    }
  } catch (error) {
    console.error('Form submission error:', error)
    
    if (window.$swal) {
      window.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to save leave request'
      })
    }
  } finally {
    loading.value = false
  }
}

// Handle delete
const handleDelete = async () => {
  if (!window.$swal) {
    console.error('SweetAlert not available')
    return
  }

  const result = await window.$swal.fire({
    icon: 'warning',
    title: 'Delete Leave Request?',
    text: 'This action cannot be undone.',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it',
    cancelButtonText: 'Cancel',
    confirmButtonColor: '#d33'
  })

  if (result.isConfirmed) {
    loading.value = true
    
    try {
      const deleteResult = await requestLeaveStore.deleteLeaveRequest(props.editData.leave_id)
      
      if (deleteResult.success) {
        emit('deleted', props.editData.leave_id)
        closeForm()
        
        window.$swal.fire({
          icon: 'success',
          title: 'Deleted',
          text: 'Leave request has been deleted',
          timer: 2000,
          showConfirmButton: false
        })
      } else {
        throw new Error(deleteResult.error)
      }
    } catch (error) {
      console.error('Delete error:', error)
      
      window.$swal.fire({
        icon: 'error',
        title: 'Error',
        text: error.message || 'Failed to delete leave request'
      })
    } finally {
      loading.value = false
    }
  }
}
</script>

<style scoped>
.request-leave-form {
  border-radius: 12px;
  overflow: hidden;
}

.form-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 12px;
}

.form-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin: 0;
}

.form-subtitle {
  font-size: 0.9rem;
  opacity: 0.9;
  margin: 0;
}

.close-btn {
  color: white !important;
}

.form-content {
  padding: 24px;
  max-height: 60vh;
  overflow-y: auto;
}

.form-sections {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.form-section {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
}

.section-title {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #2c3e50;
}

.form-actions {
  padding: 16px 24px;
  background: #f8f9fa;
}
</style>
