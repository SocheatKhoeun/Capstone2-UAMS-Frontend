<template>
  <v-card class="generation-form">
    <v-card-title class="text-h5 pa-6 bg-grey-lighten-4">
      {{ isEdit ? 'Edit Generation' : 'Add New Generation' }}
    </v-card-title>
    
    <v-divider />
    
    <v-card-text class="pa-6">
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
        <div class="form-group mb-4">
          <label class="form-label mb-2">Global ID <span class="text-error">*</span></label>
          <v-text-field
            v-model="form.global_id"
            :rules="globalIdRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            placeholder="GEN-001"
            :disabled="isEdit"
          />
        </div>
        
        <div class="form-group mb-4">
          <label class="form-label mb-2">Generation Name <span class="text-error">*</span></label>
          <v-text-field
            v-model="form.generation"
            :rules="generationRules"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
            placeholder="e.g., Batch 2024"
          />
        </div>
        
        <v-row>
          <v-col cols="12" md="6">
            <div class="form-group mb-4">
              <label class="form-label mb-2">Start Year</label>
              <v-text-field
                v-model.number="form.start_year"
                :rules="startYearRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                type="number"
                placeholder="2024"
              />
            </div>
          </v-col>
          
          <v-col cols="12" md="6">
            <div class="form-group mb-4">
              <label class="form-label mb-2">End Year</label>
              <v-text-field
                v-model.number="form.end_year"
                :rules="endYearRules"
                variant="outlined"
                density="comfortable"
                hide-details="auto"
                type="number"
                placeholder="2028"
              />
            </div>
          </v-col>
        </v-row>
        
        <div class="form-group mb-4">
          <label class="form-label mb-2">Status</label>
          <v-select
            v-model="form.active"
            :items="statusItems"
            item-title="text"
            item-value="value"
            variant="outlined"
            density="comfortable"
            hide-details="auto"
          />
        </div>
      </v-form>
    </v-card-text>

    <v-divider />
    
    <v-card-actions class="pa-6">
      <v-spacer />
      <v-btn
        variant="outlined"
        color="grey-darken-1"
        @click="handleCancel"
        :disabled="loading"
      >
        Cancel
      </v-btn>
      
      <v-btn
        :color="isEdit ? 'warning' : 'primary'"
        variant="flat"
        @click="handleSubmit"
        :loading="loading"
        :disabled="!valid"
      >
        {{ isEdit ? 'Update Generation' : 'Create Generation' }}
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
const props = defineProps({
  generation: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  },
  nextGlobalId: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['submit', 'cancel'])

const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const form = reactive({
  global_id: '',
  generation: '',
  start_year: null,
  end_year: null,
  active: 1
})

// Status items for dropdown
const statusItems = [
  { text: 'Active', value: 1 },
  { text: 'Inactive', value: 0 }
]

// Validation rules
const globalIdRules = [
  v => !!v || 'Global ID is required',
  v => /^GEN-\d{3}$/.test(v) || 'Global ID must be in format: GEN-001'
]

const generationRules = [
  v => !!v || 'Generation name is required',
  v => (v && v.length >= 3) || 'Generation name must be at least 3 characters',
  v => (v && v.length <= 100) || 'Generation name must not exceed 100 characters'
]

const startYearRules = [
  v => {
    if (!v) return true // Optional field
    return (v >= 2000 && v <= 2100) || 'Start year must be between 2000 and 2100'
  }
]

const endYearRules = [
  v => {
    if (!v) return true // Optional field
    if (v < 2000 || v > 2100) return 'End year must be between 2000 and 2100'
    if (form.start_year && v < form.start_year) {
      return 'End year must be greater than or equal to start year'
    }
    return true
  }
]

// Initialize form data
const initializeForm = () => {
  if (props.isEdit && props.generation) {
    form.global_id = props.generation.global_id || ''
    form.generation = props.generation.generation || ''
    form.start_year = props.generation.start_year || null
    form.end_year = props.generation.end_year || null
    form.active = props.generation.active ?? 1
  } else {
    form.global_id = props.nextGlobalId || ''
    form.generation = ''
    form.start_year = null
    form.end_year = null
    form.active = 1
  }
}

// Handle form submission
const handleSubmit = async () => {
  const result = await formRef.value?.validate()
  if (!result?.valid) return
  
  loading.value = true
  
  const generationData = {
    global_id: form.global_id,
    generation: form.generation,
    start_year: form.start_year || null,
    end_year: form.end_year || null,
    active: form.active
  }
  
  emit('submit', generationData)
  
  loading.value = false
}

// Handle cancel
const handleCancel = () => {
  formRef.value?.reset()
  initializeForm()
  emit('cancel')
}

// Watch for prop changes
watch(
  () => [props.generation, props.isEdit, props.nextGlobalId],
  () => {
    initializeForm()
  },
  { immediate: true }
)

onMounted(() => {
  initializeForm()
})
</script>

<style scoped>
.generation-form {
  border-radius: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.form-group {
  margin-bottom: 16px;
}
</style>
