<template>
  <v-dialog
    :model-value="modelValue"
    @update:model-value="$emit('update:modelValue', $event)"
    max-width="550px"
    persistent
  >
    <v-card class="modern-dialog" elevation="24">
      <!-- Dialog Header -->
      <div class="dialog-header">
        <div class="header-content">
          <div class="header-icon">
            <v-icon icon="mdi-shield-account" color="primary" size="28" />
          </div>
          <div class="header-text">
            <h2 class="dialog-title">Role Details</h2>
            <p class="dialog-subtitle">
              View role information and permissions
            </p>
          </div>
        </div>
        <v-btn icon="mdi-close" variant="text" size="small" @click="$emit('close')" class="close-btn" />
      </div>

      <v-divider />

      <!-- Dialog Content -->
      <v-card-text class="dialog-content">
        <div class="form-group">
          <label class="form-label">Role Name</label>
          <v-text-field 
            :model-value="role?.name" 
            readonly 
            variant="outlined" 
            density="comfortable"
            prepend-inner-icon="mdi-shield-account"
            class="form-field"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Level</label>
          <v-text-field 
            :model-value="role?.level" 
            readonly 
            variant="outlined" 
            density="comfortable"
            prepend-inner-icon="mdi-trending-up"
            class="form-field"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Type</label>
          <v-text-field 
            :model-value="role?.type" 
            readonly 
            variant="outlined" 
            density="comfortable"
            prepend-inner-icon="mdi-tag"
            class="form-field"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Status</label>
          <v-chip 
            :color="role?.is_active ? 'success' : 'error'" 
            variant="flat"
            class="mt-2"
          >
            <v-icon start :icon="role?.is_active ? 'mdi-check-circle' : 'mdi-close-circle'" />
            {{ role?.is_active ? 'Active' : 'Inactive' }}
          </v-chip>
        </div>

        <div class="form-group">
          <label class="form-label">Description</label>
          <v-textarea 
            :model-value="role?.description" 
            readonly 
            variant="outlined" 
            density="comfortable"
            prepend-inner-icon="mdi-text"
            rows="3"
            class="form-field"
          />
        </div>

        <div class="form-group">
          <label class="form-label">Permissions</label>
          <div class="permissions-grid">
            <v-chip
              v-for="permission in role?.permissions || []"
              :key="permission"
              size="small"
              color="primary"
              variant="outlined"
              class="ma-1"
            >
              <v-icon start size="14">mdi-shield-check</v-icon>
              {{ permission }}
            </v-chip>
            <div v-if="!role?.permissions?.length" class="text-grey text-body-2">
              No permissions assigned
            </div>
          </div>
        </div>
      </v-card-text>

      <v-divider />

      <!-- Dialog Actions -->
      <v-card-actions class="dialog-actions">
        <v-btn 
          variant="outlined" 
          color="grey-darken-1" 
          @click="$emit('close')" 
          class="action-btn cancel-btn"
        >
          <v-icon start>mdi-close</v-icon>
          Close
        </v-btn>

        <v-btn 
          color="primary" 
          variant="flat" 
          class="action-btn submit-btn"
          @click="editRole"
        >
          <v-icon start>mdi-pencil</v-icon>
          Edit Role
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  role: Object,
  mode: {
    type: String,
    default: 'view'
  }
})

const emit = defineEmits(['update:modelValue', 'close', 'edit'])

const editRole = () => {
  emit('edit', props.role)
}
</script>

<style scoped>
/* Modern Dialog Styles */
.modern-dialog {
  border-radius: 16px;
}

.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px;
  background: linear-gradient(135deg, #f8fafc, #f1f5f9);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 16px;
}

.header-icon {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #1976d2, #2196f3);
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.15);
}

.header-text {
  flex: 1;
}

.dialog-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0 0 4px 0;
}

.dialog-subtitle {
  font-size: 14px;
  color: #64748b;
  margin: 0;
}

.close-btn {
  opacity: 0.7;
}

.close-btn:hover {
  opacity: 1;
}

.dialog-content {
  padding: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 8px;
  display: block;
}

.form-field {
  margin-top: 8px;
}

.form-field :deep(.v-field) {
  border-radius: 8px;
  background-color: #f9fafb;
}

.permissions-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 8px;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
}

.dialog-actions {
  padding: 24px;
  gap: 12px;
}

.action-btn {
  border-radius: 8px;
  font-weight: 500;
  letter-spacing: 0.25px;
  text-transform: none;
  padding: 12px 24px;
}

.cancel-btn {
  color: #6b7280;
}

.submit-btn {
  background: linear-gradient(135deg, #1976d2, #2196f3) !important;
  color: white !important;
}

.submit-btn:hover {
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.3);
}
</style>