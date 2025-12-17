<template>
  <div class="profile-page">
    <!-- Modern Header Section -->
    <div class="modern-header">
      <div class="header-container">
        <div class="title-section">
          <div class="title-wrapper">
            <div class="title-icon">
              <v-icon icon="mdi-account-circle" size="32" color="white" />
            </div>
            <div class="title-content">
              <h1 class="page-title">Profile</h1>
              <div class="breadcrumb">
                <span class="breadcrumb-item">User</span>
                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                <span class="breadcrumb-item active">Profile</span>
              </div>
            </div>
          </div>
        </div>

        <div class="action-section">
          <v-btn
            v-if="!isEditMode"
            class="modern-btn edit-btn"
            prepend-icon="mdi-pencil"
            variant="flat"
            color="primary"
            @click="toggleEditMode"
          >
            Edit Profile
          </v-btn>
          <template v-else>
            <v-btn
              class="modern-btn cancel-btn"
              prepend-icon="mdi-close"
              variant="outlined"
              @click="cancelEdit"
            >
              Cancel
            </v-btn>
            <v-btn
              class="modern-btn save-btn"
              prepend-icon="mdi-content-save"
              variant="flat"
              color="primary"
              @click="saveProfile"
              :loading="isSaving"
            >
              Save Changes
            </v-btn>
          </template>
        </div>
      </div>
    </div>

    <!-- Profile Content -->
    <div class="profile-content">
      <v-container>
        <v-row>
          <!-- Profile Card -->
          <v-col cols="12">
            <v-card class="profile-card" elevation="2" rounded="xl">
              <!-- Profile Header -->
              <div class="profile-header">
                <div class="profile-avatar-section">
                  <v-avatar size="120" class="profile-avatar">
                    <v-img v-if="profileData.avatar" :src="profileData.avatar" />
                    <span v-else class="avatar-text">{{ profileInitial }}</span>
                  </v-avatar>
                  <v-btn
                    v-if="isEditMode"
                    icon
                    size="small"
                    class="avatar-edit-btn"
                    color="primary"
                    @click="triggerFileUpload"
                  >
                    <v-icon icon="mdi-camera" />
                  </v-btn>
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*"
                    style="display: none"
                    @change="handleFileUpload"
                  />
                </div>
                <div class="profile-header-info">
                  <h2 class="profile-name">{{ profileData.name }}</h2>
                  <div class="profile-meta">
                    <v-chip color="primary" variant="tonal" size="small" class="mr-2">
                      <v-icon start size="16">mdi-briefcase</v-icon>
                      {{ profileData.role }}
                    </v-chip>
                    <v-chip color="success" variant="tonal" size="small">
                      <v-icon start size="16">mdi-shield-check</v-icon>
                      {{ profileData.location }}
                    </v-chip>
                  </div>
                </div>
              </div>

              <v-divider class="my-6" />

              <!-- Personal Information Section -->
              <div class="info-section">
                <div class="section-header">
                  <v-icon icon="mdi-account" size="24" color="primary" class="mr-2" />
                  <h3 class="section-title">Personal Information</h3>
                </div>

                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">First Name</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.firstName"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.firstName }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">Last Name</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.lastName"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.lastName }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">Email address</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.email"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        type="email"
                      />
                      <div v-else class="info-value">{{ profileData.email }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">Phone</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.phone"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.phone }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12">
                    <div class="info-field">
                      <label class="info-label">Bio</label>
                      <v-textarea
                        v-if="isEditMode"
                        v-model="profileData.bio"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                        rows="3"
                      />
                      <div v-else class="info-value">{{ profileData.bio }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>

              <v-divider class="my-6" />

              <!-- Address Section -->
              <div class="info-section">
                <div class="section-header">
                  <v-icon icon="mdi-map-marker" size="24" color="primary" class="mr-2" />
                  <h3 class="section-title">Address</h3>
                </div>

                <v-row class="mt-4">
                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">Country</label>
                      <v-select
                        v-if="isEditMode"
                        v-model="profileData.country"
                        :items="countries"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.country }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">City/State</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.cityState"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.cityState }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">Postal Code</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.postalCode"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.postalCode }}</div>
                    </div>
                  </v-col>

                  <v-col cols="12" md="6">
                    <div class="info-field">
                      <label class="info-label">TAX ID</label>
                      <v-text-field
                        v-if="isEditMode"
                        v-model="profileData.taxId"
                        variant="outlined"
                        density="comfortable"
                        hide-details
                      />
                      <div v-else class="info-value">{{ profileData.taxId }}</div>
                    </div>
                  </v-col>
                </v-row>
              </div>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </div>

    <!-- Success Snackbar -->
    <v-snackbar v-model="showSuccessSnackbar" color="success" :timeout="3000">
      <v-icon start>mdi-check-circle</v-icon>
      Profile updated successfully!
    </v-snackbar>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useUserRole } from '~/composables/useUserRole'

definePageMeta({
  middleware: ['auth', 'profile-layout']
})

const { getCurrentUser } = useUserRole()

// State
const isEditMode = ref(false)
const isSaving = ref(false)
const showSuccessSnackbar = ref(false)
const fileInput = ref(null)

const profileData = ref({
  avatar: null,
  name: 'Musharof Chowdhury',
  firstName: 'Chowdhury',
  lastName: 'Musharof',
  email: 'randomuser@pimjo.com',
  phone: '+09 363 398 46',
  bio: 'Team Manager',
  role: 'Team Manager',
  location: 'Arizona, United States',
  country: 'United States',
  cityState: 'Arizona, United States.',
  postalCode: 'ERT 2489',
  taxId: 'AS4568384'
})

const originalData = ref({ ...profileData.value })

// Computed
const profileInitial = computed(() => {
  const name = profileData.value.name || 'U'
  return name.charAt(0).toUpperCase()
})

const countries = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'China',
  'India',
  'Brazil'
]

// Load user data on mount
onMounted(async () => {
  // Load user profile data from store
  const currentUser = getCurrentUser()
  if (currentUser) {
    profileData.value.firstName = currentUser.first_name || currentUser.firstName || ''
    profileData.value.lastName = currentUser.last_name || currentUser.lastName || ''
    profileData.value.name = `${profileData.value.firstName} ${profileData.value.lastName}`.trim()
    profileData.value.email = currentUser.email || ''
    profileData.value.phone = currentUser.phone || currentUser.phone_number || ''
    profileData.value.role = currentUser.role || ''
  }
})

// Methods
const toggleEditMode = () => {
  isEditMode.value = true
  originalData.value = { ...profileData.value }
}

const cancelEdit = () => {
  isEditMode.value = false
  profileData.value = { ...originalData.value }
}

const saveProfile = async () => {
  isSaving.value = true
  
  // Simulate API call - replace with actual API call
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  isEditMode.value = false
  isSaving.value = false
  showSuccessSnackbar.value = true
}

const triggerFileUpload = () => {
  fileInput.value?.click()
}

const handleFileUpload = (event) => {
  const file = event.target.files?.[0]
  if (file) {
    const reader = new FileReader()
    reader.onload = (e) => {
      profileData.value.avatar = e.target?.result
    }
    reader.readAsDataURL(file)
  }
}
</script>

<style scoped>
.profile-page {
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  min-height: 100vh;
  padding: 0;
}

/* Modern Header */
.modern-header {
  background: white;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 24px 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 32px;
}

.title-section {
  flex: 1;
}

.title-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.title-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-content {
  flex: 1;
}

.page-title {
  font-size: 28px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 4px 0;
  letter-spacing: -0.025em;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 4px;
}

.breadcrumb-item {
  font-size: 14px;
  color: #64748b;
  font-weight: 500;
}

.breadcrumb-item.active {
  color: #3b82f6;
}

.breadcrumb-separator {
  opacity: 0.5;
}

.action-section {
  display: flex;
  gap: 12px;
}

.modern-btn {
  height: 44px;
  border-radius: 12px;
  text-transform: none;
  font-weight: 500;
  padding: 0 24px;
  transition: all 0.2s ease;
}

.edit-btn,
.save-btn {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
  box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
}

.cancel-btn {
  border: 1px solid #e2e8f0;
}

/* Profile Content */
.profile-content {
  max-width: 1400px;
  margin: 24px auto;
  padding: 0 32px;
}

.profile-card {
  padding: 32px;
  overflow: visible;
}

/* Profile Header */
.profile-header {
  display: flex;
  align-items: center;
  gap: 24px;
}

.profile-avatar-section {
  position: relative;
}

.profile-avatar {
  border: 4px solid white;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.avatar-text {
  font-size: 48px;
  font-weight: 700;
  color: white;
}

.avatar-edit-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.profile-header-info {
  flex: 1;
}

.profile-name {
  font-size: 32px;
  font-weight: 700;
  color: #1e293b;
  margin: 0 0 12px 0;
}

.profile-meta {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

/* Info Section */
.info-section {
  margin-bottom: 24px;
}

.section-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}

.section-title {
  font-size: 20px;
  font-weight: 600;
  color: #1e293b;
  margin: 0;
}

.info-field {
  margin-bottom: 16px;
}

.info-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #64748b;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  font-weight: 500;
  color: #1e293b;
  padding: 12px 16px;
  background: #f8fafc;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

/* Responsive */
@media (max-width: 768px) {
  .header-container {
    flex-direction: column;
    align-items: stretch;
    padding: 16px 20px;
  }

  .action-section {
    justify-content: stretch;
  }

  .modern-btn {
    flex: 1;
  }

  .profile-content {
    padding: 0 16px;
  }

  .profile-card {
    padding: 20px;
  }

  .profile-header {
    flex-direction: column;
    text-align: center;
  }

  .profile-name {
    font-size: 24px;
  }

  .profile-meta {
    justify-content: center;
  }
}
</style>
