<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
    <div class="form-group">
      <label class="form-label">Global ID <span class="text-red">*</span></label>
      <v-text-field 
        v-model="localForm.global_id" 
        :rules="globalIdRules" 
        variant="outlined"
        density="comfortable" 
        hide-details="auto" 
        class="form-field" 
        placeholder="SPEC-001"
        :disabled="isEdit" />
    </div>
    <div class="form-group">
      <label class="form-label">Specialization Name <span class="text-red">*</span></label>
      <v-text-field 
        v-model="localForm.name" 
        :rules="nameRules" 
        variant="outlined"
        density="comfortable" 
        hide-details="auto" 
        class="form-field" 
        placeholder="Software Engineering" />
    </div>
    <div class="form-group">
      <label class="form-label">Department <span class="text-red">*</span></label>
      <v-select 
        v-model="localForm.department_id" 
        :items="departments" 
        :rules="departmentRules"
        item-title="name"
        item-value="id"
        variant="outlined" 
        density="comfortable" 
        hide-details="auto" 
        class="form-field"
        placeholder="Select department" />
    </div>
    <div class="form-group">
      <label class="form-label">Status</label>
      <v-select 
        v-model="localForm.active" 
        :items="statusItems" 
        item-title="text"
        item-value="value"
        variant="outlined" 
        density="comfortable" 
        hide-details="auto" 
        class="form-field" />
    </div>
    <div class="dialog-actions mt-4">
      <v-spacer />
      <v-btn variant="outlined" color="grey-darken-1" @click="$emit('cancel')" :disabled="loading" class="action-btn cancel-btn">
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>
      <v-btn :color="isEdit ? 'warning' : 'primary'" variant="flat" @click="onSubmit" :loading="loading" :disabled="!formValid" class="action-btn submit-btn">
        <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
        {{ isEdit ? 'Update Specialization' : 'Add Specialization' }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch, toRefs, onMounted } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  departments: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const formValid = ref(false)
const localForm = reactive({
  global_id: '',
  name: '',
  department_id: null as number | null,
  active: 1
})

const statusItems = [
  { text: 'Active', value: 1 },
  { text: 'Inactive', value: 0 }
]

const globalIdRules = [
  (v: string) => !!v || 'Global ID is required',
  (v: string) => /^SPEC-\d{3}$/.test(v) || 'Global ID must be in format: SPEC-001'
]
const nameRules = [
  (v: string) => !!v || 'Specialization name is required',
  (v: string) => v.length >= 3 || 'Specialization name must be at least 3 characters',
  (v: string) => v.length <= 100 || 'Specialization name must not exceed 100 characters'
]
const departmentRules = [
  (v: any) => !!v || 'Department is required'
]

// Sync localForm with modelValue
watch(() => props.modelValue, (val) => {
  Object.assign(localForm, val)
}, { immediate: true, deep: true })

const onSubmit = () => {
  if (!formValid.value) return
  emit('submit', { ...localForm })
}
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}
.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}
.form-field {
  width: 100%;
  margin-bottom: 0 !important;
}
.dialog-actions {
  padding: 0;
  gap: 12px;
  display: flex;
  justify-content: flex-end;
}
</style>
