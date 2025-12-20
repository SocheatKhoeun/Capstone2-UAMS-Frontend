<template>
  <v-form ref="formRef" v-model="formValid" @submit.prevent="onSubmit">
    <div class="form-group">
      <label class="form-label">Term Name <span class="text-red">*</span></label>
      <v-text-field 
        v-model="localForm.term" 
        :rules="termRules" 
        variant="outlined"
        density="comfortable" 
        hide-details="auto" 
        class="form-field" 
        placeholder="Fall 2024" />
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
      <v-btn 
        variant="outlined" 
        color="grey-darken-1" 
        @click="$emit('cancel')" 
        :disabled="loading" 
        class="action-btn cancel-btn">
        <v-icon start>mdi-close</v-icon>
        Cancel
      </v-btn>
      <v-btn 
        :color="isEdit ? 'warning' : 'primary'" 
        variant="flat" 
        @click="onSubmit" 
        :loading="loading" 
        :disabled="!formValid" 
        class="action-btn submit-btn">
        <v-icon start>{{ isEdit ? 'mdi-content-save' : 'mdi-plus' }}</v-icon>
        {{ isEdit ? 'Update Term' : 'Add Term' }}
      </v-btn>
    </div>
  </v-form>
</template>

<script setup lang="ts">
import { ref, reactive, watch } from 'vue'

const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:modelValue', 'submit', 'cancel'])

// Local form state
const localForm = reactive({
  term: props.modelValue.term || '',
  active: props.modelValue.active ?? 1
})

// Form validation
const formRef = ref(null)
const formValid = ref(false)


const termRules = [
  (v: string) => !!v || 'Term name is required',
  (v: string) => v.length >= 3 || 'Term name must be at least 3 characters',
  (v: string) => v.length <= 100 || 'Term name must not exceed 100 characters'
]

// Status options
const statusItems = [
  { text: 'Active', value: 1 },
  { text: 'Inactive', value: 0 }
]

// Watch for changes in localForm and emit to parent
watch(localForm, (newVal) => {
  emit('update:modelValue', { ...newVal })
}, { deep: true })

// Watch for changes in modelValue prop
watch(() => props.modelValue, (newVal) => {
  Object.assign(localForm, {
    global_id: newVal.global_id || '',
    term: newVal.term || '',
    active: newVal.active ?? 1
  })
}, { deep: true })

// Form submission
const onSubmit = async () => {
  if (formRef.value) {
    const { valid } = await (formRef.value as any).validate()
    if (valid) {
      emit('submit', { ...localForm })
    }
  }
}

// Expose reset method
const reset = () => {
  if (formRef.value) {
    (formRef.value as any).reset()
  }
}

defineExpose({
  reset
})
</script>

<style scoped>
.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
}

.text-red {
  color: #dc2626;
}

.form-field {
  width: 100%;
  margin-bottom: 0 !important;
}

.form-field :deep(.v-field) {
  border-radius: 12px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
}

.form-field :deep(.v-field:hover) {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.form-field :deep(.v-field--focused) {
  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  margin-top: 24px;
}

.action-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  font-size: 14px;
  padding: 0 32px;
  transition: all 0.2s ease;
  min-width: 120px;
}

.cancel-btn {
  min-width: 100px;
}

.submit-btn {
  min-width: 140px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  transform: translateY(-1px);
}
</style>
