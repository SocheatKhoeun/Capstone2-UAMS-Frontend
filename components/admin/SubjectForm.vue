<template>
    <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
        <div class="form-group">
            <label class="form-label">Global ID <span class="text-red">*</span></label>
            <v-text-field v-model="localForm.global_id" :rules="globalIdRules" variant="outlined" density="comfortable"
                hide-details="auto" class="form-field" placeholder="SUB-001" :disabled="isEdit" />
        </div>
        <div class="form-group">
            <label class="form-label">Subject Code <span class="text-red">*</span></label>
            <v-text-field v-model="localForm.subject_code" :rules="subjectCodeRules" variant="outlined"
                density="comfortable" hide-details="auto" class="form-field" placeholder="CS101" />
        </div>
        <div class="form-group">
            <label class="form-label">Subject Name <span class="text-red">*</span></label>
            <v-text-field v-model="localForm.subject_name" :rules="subjectNameRules" variant="outlined"
                density="comfortable" hide-details="auto" class="form-field"
                placeholder="Introduction to Computer Science" />
        </div>
        <div class="form-group">
            <label class="form-label">Credit Hours <span class="text-red">*</span></label>
            <v-text-field v-model.number="localForm.credit_hours" :rules="creditHoursRules" type="number"
                variant="outlined" density="comfortable" hide-details="auto" class="form-field" placeholder="3" />
        </div>
        <div class="form-group">
            <label class="form-label">Department <span class="text-red">*</span></label>
            <v-select v-model="localForm.department_id" :items="departmentItems" :rules="departmentRules"
                item-title="title" item-value="value" variant="outlined" density="comfortable" hide-details="auto"
                class="form-field" placeholder="Select department" />
        </div>
        <div class="form-group">
            <label class="form-label">Description</label>
            <v-textarea v-model="localForm.description" variant="outlined" density="comfortable" hide-details="auto"
                rows="3" class="form-field" placeholder="Enter subject description..." />
        </div>
        <div class="form-group">
            <label class="form-label">Status</label>
            <v-select v-model="localForm.is_active" :items="statusItems" item-title="title" item-value="value"
                variant="outlined" density="comfortable" hide-details="auto" class="form-field" />
        </div>
        <v-card-actions class="dialog-actions">
            <v-spacer />
            <v-btn variant="outlined" color="grey-darken-1" @click="emit('cancel')" :disabled="loading"
                class="action-btn cancel-btn">
                <v-icon start>mdi-close</v-icon>
                Cancel
            </v-btn>
            <v-btn color="primary" variant="flat" @click="onSubmit" :loading="loading" :disabled="!formValid"
                class="action-btn submit-btn">
                <v-icon start>mdi-content-save</v-icon>
                Save
            </v-btn>
        </v-card-actions>
    </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, computed } from 'vue'

const props = defineProps({
    modelValue: { type: Object, required: true },
    departmentItems: { type: Array, required: true },
    isEdit: { type: Boolean, default: false },
    loading: { type: Boolean, default: false }
})
const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

const formRef = ref()
const formValid = ref(false)
const localForm = reactive({ ...props.modelValue })

watch(() => props.modelValue, (val) => {
    Object.assign(localForm, val)
}, { deep: true })

watch(localForm, (val) => {
    emit('update:modelValue', { ...val })
}, { deep: true })

const globalIdRules = [
    (v: any) => !!v || 'Global ID is required',
    (v: any) => /^SUB-\d{3}$/.test(v) || 'Global ID must be in format SUB-XXX'
]
const subjectCodeRules = [
    (v: any) => !!v || 'Subject Code is required',
    (v: any) => (v && v.length >= 2) || 'Subject Code must be at least 2 characters'
]
const subjectNameRules = [
    (v: any) => !!v || 'Subject Name is required',
    (v: any) => (v && v.length >= 3) || 'Subject Name must be at least 3 characters'
]
const creditHoursRules = [
    (v: any) => v !== null && v !== '' || 'Credit Hours is required',
    (v: any) => v > 0 || 'Credit Hours must be greater than 0',
    (v: any) => v <= 10 || 'Credit Hours must be 10 or less'
]
const departmentRules = [
    (v: any) => !!v || 'Department is required'
]
const statusItems = [
    { title: 'Active', value: true },
    { title: 'Inactive', value: false }
]

const onSubmit = () => {
    if (formRef.value && !formValid.value) return
    emit('submit', { ...localForm })
}
</script>