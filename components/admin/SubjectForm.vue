<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
    <v-container fluid class="pa-0">
      <v-row dense>
        <!-- Subject Code -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model="localForm.subject_code"
            label="Subject Code *"
            placeholder="CS101"
            :rules="subjectCodeRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Subject Name -->
        <v-col cols="12" md="8">
          <v-text-field
            v-model="localForm.subject_name"
            label="Subject Name *"
            placeholder="Introduction to Computer Science"
            :rules="subjectNameRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Credit Hours -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.credit_hours"
            label="Credit Hours *"
            type="number"
            placeholder="3"
            :rules="creditHoursRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Lecture Hours -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.lecture_hours"
            label="Lecture Hours *"
            type="number"
            placeholder="15"
            :rules="lectureHoursRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Lab Hours -->
        <v-col cols="12" md="4">
          <v-text-field
            v-model.number="localForm.lab_hours"
            label="Lab Hours *"
            type="number"
            placeholder="30"
            :rules="labHoursRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Department -->
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.department_id"
            label="Department *"
            placeholder="Select department"
            :items="departmentItems"
            item-title="title"
            item-value="value"
            :rules="departmentRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Status -->
        <v-col cols="12" md="6">
          <v-select
            v-model="localForm.is_active"
            label="Status"
            :items="statusItems"
            item-title="title"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>

        <!-- Description -->
        <v-col cols="12">
          <v-textarea
            v-model="localForm.description"
            label="Description"
            placeholder="Enter subject description..."
            rows="3"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </v-col>
      </v-row>

      <!-- Actions -->
      <v-divider class="my-4" />
      <v-row justify="end" class="ga-2">
        <v-btn
          variant="outlined"
          color="grey-darken-1"
          @click="emit('cancel')"
          :disabled="loading"
        >
          <v-icon start>mdi-close</v-icon>
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          type="submit"
          :loading="loading"
          :disabled="!formValid"
        >
          <v-icon start>mdi-content-save</v-icon>
          Save
        </v-btn>
      </v-row>
    </v-container>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

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

// Rules
const subjectCodeRules = [
  (v: any) => !!v || 'Subject Code is required',
  (v: any) => (v && v.length >= 2) || 'At least 2 characters'
]

const subjectNameRules = [
  (v: any) => !!v || 'Subject Name is required',
  (v: any) => (v && v.length >= 3) || 'At least 3 characters'
]

const creditHoursRules = [
  (v: any) => v !== null && v !== '' || 'Required',
  (v: any) => v > 0 || 'Must be greater than 0',
  (v: any) => v <= 10 || 'Max 10'
]

const lectureHoursRules = [
  (v: any) => v !== null && v !== '' || 'Required',
  (v: any) => v >= 0 || 'Must be 0 or greater'
]

const labHoursRules = [
  (v: any) => v !== null && v !== '' || 'Required',
  (v: any) => v >= 0 || 'Must be 0 or greater'
]

const departmentRules = [
  (v: any) => !!v || 'Department is required'
]

const statusItems = [
  { title: 'Active', value: true },
  { title: 'Inactive', value: false }
]

const onSubmit = () => {
  if (!formValid.value) return
  emit('submit', { ...localForm })
}
</script>