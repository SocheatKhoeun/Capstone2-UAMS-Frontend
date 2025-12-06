<template>
  <v-card class="group-form" max-width="500">
    <v-card-title class="text-h5 pa-6">
      {{ isEdit ? 'Edit Group' : 'Add New Group' }}
    </v-card-title>
    
    <v-card-text class="pa-6">
      <v-form ref="formRef" v-model="valid" @submit.prevent="handleSubmit">
        <v-text-field
          v-model="form.global_id"
          label="Global ID"
          :rules="globalIdRules"
          required
          outlined
          class="mb-4"
        />
        
        <v-text-field
          v-model="form.group_name"
          label="Group Name"
          :rules="groupNameRules"
          required
          outlined
          class="mb-4"
        />
        
        <v-switch
          v-model="form.active"
          label="Active"
          color="primary"
          inset
          class="mb-4"
        />
        
        <div class="d-flex justify-end gap-3">
          <v-btn
            color="grey"
            variant="outlined"
            @click="handleCancel"
            :disabled="loading"
          >
            Cancel
          </v-btn>
          
          <v-btn
            color="primary"
            type="submit"
            :loading="loading"
            :disabled="!valid"
          >
            {{ isEdit ? 'Update' : 'Create' }}
          </v-btn>
        </div>
      </v-form>
    </v-card-text>
  </v-card>
</template>

<script setup>
const props = defineProps({
  group: {
    type: Object,
    default: null
  },
  isEdit: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel'])

// Mock store functions for testing (since we're not using the actual store)
const createGroup = (groupData) => {
  // This will be handled by the parent component
  return Promise.resolve(groupData)
}

const updateGroup = (id, groupData) => {
  // This will be handled by the parent component
  return Promise.resolve(groupData)
}

const formRef = ref(null)
const valid = ref(false)
const loading = ref(false)

const form = reactive({
  global_id: '',
  group_name: '',
  active: true
})

// Validation rules
const globalIdRules = [
  v => !!v || 'Global ID is required',
  v => v.length >= 2 || 'Global ID must be at least 2 characters'
]

const groupNameRules = [
  v => !!v || 'Group name is required',
  v => v.length >= 2 || 'Group name must be at least 2 characters'
]

// Initialize form data
const initializeForm = () => {
  if (props.isEdit && props.group) {
    form.global_id = props.group.global_id || ''
    form.group_name = props.group.group_name || ''
    form.active = props.group.active === 1
  } else {
    form.global_id = ''
    form.group_name = ''
    form.active = true
  }
}

// Handle form submission
const handleSubmit = async () => {
  if (!valid.value) return
  
  loading.value = true
  try {
    const groupData = {
      global_id: form.global_id,
      group_name: form.group_name,
      active: form.active ? 1 : 0
    }
    
    if (props.isEdit) {
      await updateGroup(props.group.id, groupData)
    } else {
      await createGroup(groupData)
    }
    
    emit('submit', groupData)
    
    // Reset form if creating new group
    if (!props.isEdit) {
      formRef.value?.reset()
      initializeForm()
    }
    
  } catch (error) {
    console.error('Error submitting form:', error)
  } finally {
    loading.value = false
  }
}

// Handle cancel
const handleCancel = () => {
  formRef.value?.reset()
  initializeForm()
  emit('cancel')
}

// Watch for prop changes

watch(
  () => [props.group, props.isEdit],
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
.group-form {
  margin: 0 auto;
}
</style>