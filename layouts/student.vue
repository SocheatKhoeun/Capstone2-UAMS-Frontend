<template>
    <v-app>
        <v-navigation-drawer v-model="drawer" permanent>
            <v-list>
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title class="text-h6">
                            Student Panel
                        </v-list-item-title>
                    </v-list-item-content>
                </v-list-item>
                <v-divider></v-divider>

                <!-- Navigation Items -->
                <v-list-item to="/student/dashboard" prepend-icon="mdi-view-dashboard">
                    <v-list-item-title>Dashboard</v-list-item-title>
                </v-list-item>

                <v-list-item to="/student/attendance" prepend-icon="mdi-check-circle">
                    <v-list-item-title>Attendance</v-list-item-title>
                </v-list-item>

                <v-list-item to="/student/schedule" prepend-icon="mdi-calendar">
                    <v-list-item-title>Schedule</v-list-item-title>
                </v-list-item>

                <v-list-item to="/student/leave" prepend-icon="mdi-calendar-remove">
                    <v-list-item-title>Leave Request</v-list-item-title>
                </v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-app-bar>
            <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
            <v-toolbar-title>UAS Student</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-btn icon @click="logout">
                <v-icon>mdi-logout</v-icon>
            </v-btn>
        </v-app-bar>

        <v-main>
            <v-container fluid>
                <slot />
            </v-container>
        </v-main>
    </v-app>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { userAuth } from '~/store/userAuth';
import { adminAuth } from '~/store/adminAuth';

defineEmits(['toggle-drawer']);

const router = useRouter();
const drawer = ref(true);

const userStore = userAuth();
const adminStore = adminAuth();

// Use a wrapper function to ensure reactivity
const logout = async () => {
  try {
    if (typeof userStore.logout === 'function') {
      await userStore.logout();
    }
    if (typeof adminStore.logout === 'function') {
      await adminStore.logout();
    }
  } catch (err) {
    console.error('Logout error:', err);
  } finally {
    await router.push('/auth/login');
  }
};

// Role guard: ensure only student role can use this layout
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

    if (role.includes('student')) {
      return; // allowed
    }
    // Redirect based on role if not student
    if (role.includes('admin')) {
      router.replace('/admin/dashboard');
      return;
    }
    if (role.includes('lecturer') || role.includes('assistant')) {
      router.replace('/lecturer/dashboard');
      return;
    }
    // fallback
    router.replace('/auth/login');
  } catch (e) {
    console.error('Role guard error:', e);
    router.replace('/auth/login');
  }
});
</script>