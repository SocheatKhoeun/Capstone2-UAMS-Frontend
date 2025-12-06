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
import { useRouter } from 'vue-router'

defineEmits(['toggle-drawer'])

const router = useRouter()
const drawer = ref(true)

// Use a wrapper function to ensure reactivity
const logout = async () => {
 
}
</script>