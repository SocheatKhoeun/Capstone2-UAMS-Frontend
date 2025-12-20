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
import { userAuth } from '~/store/userAuth';
import { adminAuth } from '~/store/adminAuth';
import { useRouter } from 'vue-router';

// Composables
const router = useRouter();
const { mdAndDown } = useDisplay()
const userStore = userAuth();
const adminStore = adminAuth();
// State
const drawerOpen = ref(true)
const navbarRef = ref(null)

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
    const payload = JSON.parse(atob(parts[1])); // best-effort decode
    const roleRaw = (payload?.role || userStore.getUser()?.role || adminStore.getAdmin()?.role || '') + '';
    const role = roleRaw.toLowerCase();

    // Redirect based on role if not student
    if (role.includes('admin' || 'superadmin')) {
      return;
    }

    if (role.includes('lecturer') || role.includes('assistant')) {
      router.replace('/lecturer/dashboard');
      return; // allowed
    }
    if (role.includes('student')) {
      router.replace('/student/dashboard');
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
</style>