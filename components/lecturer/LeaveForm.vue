<template>
    <v-card class="leave-form-card" elevation="2">
        <v-card-title class="form-header">
            <v-icon color="white" class="mr-2">mdi-calendar-clock</v-icon>
            {{ isEdit ? 'Edit Leave Request' : 'New Leave Request' }}
        </v-card-title>

        <v-card-text>
            <v-form ref="formRef" v-model="valid">
                <v-row>
                    <v-col cols="12">
                        <label class="form-label">Leave Type *</label>
                        <v-select v-model="formData.leaveType" :items="leaveTypes"
                            :rules="[v => !!v || 'Leave type is required']" variant="outlined" density="comfortable"
                            placeholder="Select leave type" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <label class="form-label">Start Date *</label>
                        <v-text-field v-model="formData.startDate" type="date"
                            :rules="[v => !!v || 'Start date is required']" variant="outlined" density="comfortable" />
                    </v-col>

                    <v-col cols="12" md="6">
                        <label class="form-label">End Date *</label>
                        <v-text-field v-model="formData.endDate" type="date" :rules="[
                            v => !!v || 'End date is required',
                            v => !formData.startDate || v >= formData.startDate || 'End date must be after start date'
                        ]" variant="outlined" density="comfortable" />
                    </v-col>

                    <v-col cols="12">
                        <label class="form-label">Reason *</label>
                        <v-textarea v-model="formData.reason" :rules="[v => !!v || 'Reason is required']"
                            variant="outlined" rows="4"
                            placeholder="Please provide a detailed reason for your leave request" />
                    </v-col>

                    <v-col cols="12">
                        <label class="form-label">Attachments</label>
                        <v-file-input v-model="formData.attachments" variant="outlined" density="comfortable"
                            prepend-icon="" prepend-inner-icon="mdi-paperclip" multiple chips
                            placeholder="Upload supporting documents" accept="image/*,.pdf,.doc,.docx" />
                    </v-col>

                    <v-col cols="12" v-if="forStudent">
                        <label class="form-label">Student *</label>
                        <v-autocomplete v-model="formData.studentId" :items="students"
                            :rules="[v => !!v || 'Student selection is required']" item-title="name" item-value="id"
                            variant="outlined" density="comfortable" placeholder="Select student">
                            <template v-slot:item="{ props, item }">
                                <v-list-item v-bind="props">
                                    <template v-slot:prepend>
                                        <v-avatar size="32" color="primary">
                                            <span class="text-white">{{ item.raw.name?.charAt(0) }}</span>
                                        </v-avatar>
                                    </template>
                                    <v-list-item-title>{{ item.raw.name }}</v-list-item-title>
                                    <v-list-item-subtitle>{{ item.raw.studentId }}</v-list-item-subtitle>
                                </v-list-item>
                            </template>
                        </v-autocomplete>
                    </v-col>
                </v-row>
            </v-form>
        </v-card-text>

        <v-card-actions class="form-actions">
            <v-spacer />
            <v-btn variant="outlined" @click="handleCancel" :disabled="loading">
                Cancel
            </v-btn>
            <v-btn color="primary" @click="handleSubmit" :loading="loading" :disabled="!valid">
                {{ isEdit ? 'Update' : 'Submit' }} Request
            </v-btn>
        </v-card-actions>
    </v-card>
</template>

<script setup>
import Swal from 'sweetalert2'

const props = defineProps({
    isEdit: {
        type: Boolean,
        default: false
    },
    forStudent: {
        type: Boolean,
        default: false
    },
    initialData: {
        type: Object,
        default: () => ({})
    },
    students: {
        type: Array,
        default: () => []
    }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const leaveTypes = [
    'Sick Leave',
    'Personal Leave',
    'Emergency Leave',
    'Medical Leave',
    'Family Leave',
    'Other'
]

const formData = ref({
    leaveType: props.initialData.leaveType || '',
    startDate: props.initialData.startDate || '',
    endDate: props.initialData.endDate || '',
    reason: props.initialData.reason || '',
    attachments: [],
    studentId: props.initialData.studentId || null
})

const handleSubmit = async () => {
    if (!formRef.value) return

    const { valid: isValid } = await formRef.value.validate()
    if (!isValid) return

    loading.value = true
    try {
        emit('submit', formData.value)
    } catch (error) {
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Failed to submit leave request. Please try again.'
        })
    } finally {
        loading.value = false
    }
}

const handleCancel = () => {
    emit('cancel')
}

defineExpose({
    formRef,
    resetForm: () => {
        formRef.value?.reset()
        formData.value = {
            leaveType: '',
            startDate: '',
            endDate: '',
            reason: '',
            attachments: [],
            studentId: null
        }
    }
})
</script>

<style scoped>
.leave-form-card {
    border-radius: 12px;
}

.form-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    padding: 20px;
    font-size: 1.25rem;
    font-weight: 600;
}

.form-label {
    display: block;
    font-size: 0.875rem;
    font-weight: 600;
    color: #333;
    margin-bottom: 8px;
}

.form-actions {
    padding: 16px 24px;
    border-top: 1px solid #e0e0e0;
}
</style>