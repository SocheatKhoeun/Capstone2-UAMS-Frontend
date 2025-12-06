<template>
  <v-app>
     <!-- Navbar (Sidebar) -->
    <Navbar ref="navbarRef" v-model="drawerOpen" role="lecturer" />
    <!-- Header -->
    <AppHeader
      @toggle-drawer="toggleDrawer"
      :drawer-open="drawerOpen"
      :is-mobile="isMobile"
    />
    
    <!-- Main Content Area -->
    <v-main class="main-content">
      <slot />
    </v-main>
  </v-app>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useDisplay } from 'vuetify'
import AppHeader from '~/components/ui/AppHeader.vue'
import Navbar from '~/components/ui/Navbar.vue'

// Composables
const { mdAndDown } = useDisplay()

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
</script>

<style scoped>
.main-content {
  background-color: #f5f5f5;
  height: 100vh;
  overflow-y: auto;
}
</style>