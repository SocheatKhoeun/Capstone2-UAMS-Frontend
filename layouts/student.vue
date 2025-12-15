<template>
  <v-app>
    <!-- Navbar (Sidebar) -->
    <Navbar ref="navbarRef" v-model="drawerOpen" role="student" />

    <!-- Header -->
    <AppHeader @toggle-drawer="toggleDrawer" :drawer-open="drawerOpen" :is-mobile="isMobile" />

    <!-- Main Content Area -->
    <v-main class="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useDisplay } from 'vuetify'
import { useRouter } from 'vue-router'
import AppHeader from '~/components/ui/AppHeader.vue'
import Navbar from '~/components/ui/Navbar.vue'
import { userAuth } from '~/store/userAuth'
import { adminAuth } from '~/store/adminAuth'

// Composables
const router = useRouter()
const { mdAndDown } = useDisplay()
const userStore = userAuth()
const adminStore = adminAuth()

// State
const drawerOpen = ref(true)
const navbarRef = ref(null)

// Computed
const isMobile = computed(() => mdAndDown.value)

// Methods
const toggleDrawer = () => {
  if (navbarRef.value) {
    navbarRef.value.toggleDrawer()
  }
}

// Role guard: ensure only student role can use this layout
onMounted(async () => {
  try {
    // Initialize stores
    if (typeof userStore.init === 'function') {
      await userStore.init()
    }

    const token = userStore.getToken() || adminStore.getToken()
    if (!token) {
      console.warn('No token found, redirecting to login')
      router.replace('/auth/login')
      return
    }
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      console.warn('Invalid token format, redirecting to login')
      router.replace('/auth/login')
      return
    }
    
    const payload = JSON.parse(atob(parts[1]))
    const roleRaw = (payload?.role || userStore.getUser()?.role || adminStore.getAdmin()?.role || '') + ''
    const role = roleRaw.toLowerCase()

    console.log('Student layout - detected role:', role)

    if (role.includes('student')) {
      console.log('Student role confirmed, allowing access')
      return // allowed
    }
    // Redirect based on role if not student
    if (role.includes('admin')) {
      console.log('Admin role detected, redirecting to admin dashboard')
      router.replace('/admin/dashboard')
      return
    }
    if (role.includes('lecturer') || role.includes('assistant')) {
      console.log('Lecturer role detected, redirecting to lecturer dashboard')
      router.replace('/lecturer/dashboard')
      return
    }
    // fallback
    console.warn('Unknown role, redirecting to login')
    router.replace('/auth/login')
  } catch (e) {
    console.error('Role guard error:', e)
    router.replace('/auth/login')
  }
})
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  min-height: 100vh;
}
</style>