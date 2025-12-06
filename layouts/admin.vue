<template>
  <v-app>
    <!-- Navbar (Sidebar) -->
    <Navbar ref="navbarRef" v-model="drawerOpen" role="admin" />

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
import AppHeader from '~/components/ui/AppHeader.vue'
import Navbar from '~/components/ui/Navbar.vue'
import { adminAuth } from '~/store/adminAuth';
import { userAuth } from '~/store/userAuth';
import { useRouter } from 'vue-router';

// Composables
const router = useRouter();
const { mdAndDown } = useDisplay()
const adminStore = adminAuth();
const userStore = userAuth();

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

onMounted(() => {
  try {
    const token = userStore.getToken() || adminStore.getToken();
    if (!token) {
      router.replace('/auth/login');
      return;
    }
    const parts = token.split('.');
    if (parts.length !== 3) {
      // invalid token format
      router.replace('/auth/login');
      return;
    }
    const payload = JSON.parse(atob(parts[1]));
    const roleRaw = (payload?.role || userStore.getUser()?.role || adminStore.getAdmin()?.role || '') + '';
    const role = roleRaw.toLowerCase();

    if (role.includes('student')) {
      router.replace('/student/dashboard');
      return;
    }
    if (role.includes('lecturer') || role.includes('assistant')) {
      router.replace('/lecturer/dashboard');
      return;
    }
    if (role.includes('admin')) {
      router.replace('/admin/dashboard');
      return;
    }
    router.replace('/auth/login');
  } catch (e) {
    // console.error('Role guard error:', e);
    router.replace('/auth/login');
  }
});
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  height: 100vh;
  overflow-y: auto;
}

.admin-layout {
  display: flex;
  min-height: 100vh;
}

/* Left navbar */
.admin-navbar {
  flex-shrink: 0;
}

/* Right: header + content */
.admin-main {
  display: flex;
  flex-direction: column;
  flex: 1 1 auto;
}

/* Top header */
.admin-header {
  flex-shrink: 0;
  border-bottom: 1px solid #e0e0e0;
}

/* Keep pages from jumping */
.admin-page-container {
  padding: 20px 24px;
  margin: 0;
  max-width: none;
}
</style>