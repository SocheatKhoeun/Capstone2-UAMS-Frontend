<template>
  <VAppBar app flat height="64" class="header-custom">
    <div class="header-left">
      <VBtn icon variant="text" class="menu-btn" @click="$emit('toggle-drawer')">
        <VIcon icon="mdi-menu" />
      </VBtn>
    </div>

    <div class="header-spacer" style="flex:1"></div>

    <div class="header-right">
      <VBtn icon variant="text" class="notif-btn header-icon">
        <VIcon icon="mdi-bell-outline" />
      </VBtn>
      <VBtn icon variant="text" class="lang-btn header-icon">
        <VIcon icon="mdi-earth" class="earth-btn"/>
        <VIcon icon="mdi-chevron-down" size="16" />
      </VBtn>

      <VMenu offset-y min-width="280">
        <template #activator="{ props }">
          <VBtn v-bind="props" class="user-btn header-icon">
            <VAvatar color="primary" size="32" class="avatar-circle">
              <span class="text-white">{{ userInitial }}</span>
            </VAvatar>
            <span class="username">{{ userName }}</span>
            <VIcon icon="mdi-chevron-down" size="16" />
          </VBtn>
        </template>

        <VCard class="user-dropdown" elevation="8">
          <div class="user-info-header">
            <VAvatar color="primary" size="48" class="user-avatar">
              <span class="text-white avatar-text">{{ userInitial }}</span>
            </VAvatar>
            <div class="user-details">
              <div class="user-name">{{ userName }}</div>
              <div class="user-email">{{ userEmail }}</div>
            </div>
          </div>
          <VDivider />

          <VList class="user-menu" nav density="compact">
            <VListItem @click="$router.push('/profile')" class="menu-item">
              <template #prepend>
                <VIcon color="primary" size="20">mdi-account-circle</VIcon>
              </template>
              <VListItemTitle>View profile</VListItemTitle>
            </VListItem>
            <VDivider class="my-1" />

            <!-- Sign Out -->
            <VListItem @click="onSignOut" class="menu-item sign-out">
              <template #prepend>
                <VIcon color="error" size="20">mdi-logout</VIcon>
              </template>
              <VListItemTitle>Sign out</VListItemTitle>
            </VListItem>
          </VList>
        </VCard>
      </VMenu>
    </div>
  </VAppBar>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { adminAuth } from '~/store/adminAuth'
import { userAuth } from '~/store/userAuth'

defineEmits(['toggle-drawer'])

const router = useRouter()
const adminStore = adminAuth()
const studentStore = userAuth()

// Computed properties for user info
const currentUser = computed(() => {
  const admin = adminStore.getAdmin?.() || adminStore.admin
  const student = studentStore.getUser?.() || studentStore.user
  return admin || student || null
})

const userName = computed(() => {
  if (!currentUser.value) return 'User'
  const user = currentUser.value as any
  const first = user.first_name || user.firstName || ''
  const last = user.last_name || user.lastName || ''
  const full = `${first} ${last}`.trim()
  return full || user.email || user.student_code || 'User'
})

const userEmail = computed(() => {
  if (!currentUser.value) return 'user@example.com'
  return (currentUser.value as any)?.email || 'user@example.com'
})

const userInitial = computed(() => {
  const name = userName.value
  return name.charAt(0).toUpperCase()
})

// Use a wrapper function to ensure reactivity
const onSignOut = async () => {
  try {
    // Try both logout methods
    if (typeof adminStore.logout === 'function') {
      await adminStore.logout()
    }
    if (typeof studentStore.logout === 'function') {
      await studentStore.logout()
    }
  } catch (err) {
    console.error('Sign out error:', err)
  } finally {
    // navigate to login page
    router.push('/auth/login')
  }
}

// Initialize user data on mount
onMounted(() => {
  if (typeof adminStore.init === 'function') {
    adminStore.init()
  }
  if (typeof studentStore.init === 'function') {
    studentStore.init()
  }
})
</script>


<style scoped>
/* Modern admin-style header */
.header-custom {
  width: 100%;
  height: 64px;
  min-height: 64px;
  max-height: 64px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 32px;
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.06);
  z-index: 10;
}
.header-left {
  display: flex;
  align-items: center;
  gap: 16px;
}
.brand-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #1e293b;
  letter-spacing: 0.02em;
  margin-left: 8px;
}
.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.menu-btn {
  margin-right: 8px;
}
.header-icon {
  transition: background 0.2s, box-shadow 0.2s;
  border-radius: 8px;
  padding: 4px;
}
.header-icon:hover {
  background: #f5f7fa !important;
  box-shadow: 0 2px 8px rgba(59,130,246,0.08);
}
.user-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  min-width: 0;
  padding: 0 8px 0 0;
}
.avatar-circle {
  border-radius: 50%;
  box-shadow: 0 2px 8px rgba(59,130,246,0.12);
}
.username {
  font-weight: 600;
  color: #1e293b;
  font-size: 1rem;
  margin-left: 2px;
  letter-spacing: 0.01em;
}
.lang-btn {
  display: flex;
  align-items: center;
  gap: 2px;
}
.notif-btn {
  color: #64748b;
}
.earth-btn {
  color: #64748b;
}

/* User Dropdown Styles */
.user-dropdown {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  border: 1px solid #e2e8f0;
}

.user-info-header {
  padding: 20px 20px 16px 20px;
  background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-avatar {
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 8px rgba(25, 118, 210, 0.2);
}

.avatar-text {
  font-size: 20px;
  font-weight: 700;
}

.user-details {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.user-name {
  font-size: 16px;
  font-weight: 600;
  color: #1e293b;
  line-height: 1.2;
}

.user-email {
  font-size: 13px;
  color: #64748b;
  line-height: 1.2;
}

.user-menu {
  padding: 8px 0;
  background: #fff;
}

.menu-item {
  margin: 0 8px;
  border-radius: 8px;
  transition: all 0.2s ease;
  min-height: 44px;
}

.menu-item:hover {
  background: #f1f5f9 !important;
}

.menu-item.sign-out:hover {
  background: #fef2f2 !important;
}

.menu-item .v-list-item-title {
  font-size: 14px;
  font-weight: 500;
  color: #374151;
}

.menu-item.sign-out .v-list-item-title {
  color: #dc2626;
}

.menu-item :deep(.v-list-item__prepend) {
  margin-inline-end: 12px !important;
}
</style>

