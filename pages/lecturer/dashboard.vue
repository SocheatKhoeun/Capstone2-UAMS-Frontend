<template>
    <v-container fluid class="pa-6">
        <!-- Welcome Section -->
        <div class="mb-6">
            <h1 class="text-h4 font-weight-bold mb-2">
                Welcome back, {{ getUserName() }} 👋
            </h1>
            <p class="text-grey">
                Here's what's happening with your classes today
            </p>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-12">
            <v-progress-circular indeterminate color="primary" size="64" />
            <p class="mt-4 text-grey">Loading dashboard data...</p>
        </div>

        <!-- Quick Stats -->
        <v-row v-if="!loading" class="mb-6">
            <v-col cols="12" md="3">
                <v-card class="stat-card" elevation="1">
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div class="text-caption text-grey mb-1">
                                    Total Classes
                                </div>
                                <div class="text-h4 font-weight-bold">
                                    {{ totalClasses }}
                                </div>
                            </div>
                            <v-avatar color="blue-lighten-5" size="56">
                                <v-icon color="primary" size="28"
                                    >mdi-google-classroom</v-icon
                                >
                            </v-avatar>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="stat-card" elevation="1">
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div class="text-caption text-grey mb-1">
                                    Total Students
                                </div>
                                <div class="text-h4 font-weight-bold">
                                    {{ totalStudents }}
                                </div>
                            </div>
                            <v-avatar color="green-lighten-5" size="56">
                                <v-icon color="success" size="28"
                                    >mdi-account-group</v-icon
                                >
                            </v-avatar>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="stat-card" elevation="1">
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div class="text-caption text-grey mb-1">
                                    Today's Classes
                                </div>
                                <div class="text-h4 font-weight-bold">
                                    {{ todayClasses.length }}
                                </div>
                            </div>
                            <v-avatar color="orange-lighten-5" size="56">
                                <v-icon color="warning" size="28"
                                    >mdi-calendar-today</v-icon
                                >
                            </v-avatar>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>

            <v-col cols="12" md="3">
                <v-card class="stat-card" elevation="1">
                    <v-card-text>
                        <div class="d-flex align-center justify-space-between">
                            <div>
                                <div class="text-caption text-grey mb-1">
                                    Avg Attendance
                                </div>
                                <div class="text-h4 font-weight-bold">
                                    {{ avgAttendance }}%
                                </div>
                            </div>
                            <v-avatar color="purple-lighten-5" size="56">
                                <v-icon color="purple" size="28"
                                    >mdi-chart-line</v-icon
                                >
                            </v-avatar>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

        <!-- Today's Schedule -->
        <v-row v-if="!loading">
            <v-col cols="12" md="8">
                <v-card elevation="1">
                    <v-card-title
                        class="pa-4 d-flex justify-space-between align-center"
                    >
                        <span class="text-h6 font-weight-bold"
                            >Today's Schedule</span
                        >
                        <v-chip color="primary" size="small">{{
                            currentDay
                        }}</v-chip>
                    </v-card-title>
                    <v-card-text>
                        <div
                            v-if="todayClasses.length > 0"
                            class="schedule-list"
                        >
                            <div
                                v-for="classItem in todayClasses"
                                :key="classItem.id"
                                class="schedule-item pa-4 mb-3"
                                :class="{
                                    active: classItem.status === 'ongoing',
                                }"
                            >
                                <div
                                    class="d-flex align-center justify-space-between"
                                >
                                    <div class="d-flex align-center">
                                        <div class="time-badge mr-4">
                                            <div class="text-caption text-grey">
                                                {{
                                                    classItem.time.split(
                                                        " - ",
                                                    )[0]
                                                }}
                                            </div>
                                            <div class="text-caption text-grey">
                                                {{
                                                    classItem.time.split(
                                                        " - ",
                                                    )[1]
                                                }}
                                            </div>
                                        </div>
                                        <div>
                                            <div
                                                class="text-h6 font-weight-bold mb-1"
                                            >
                                                {{ classItem.subject }}
                                            </div>
                                            <div class="text-body-2 text-grey">
                                                <v-icon size="small"
                                                    >mdi-account-group</v-icon
                                                >
                                                {{ classItem.group }} •
                                                {{ classItem.students }}
                                                students
                                            </div>
                                            <div class="text-body-2 text-grey">
                                                <v-icon size="small"
                                                    >mdi-map-marker</v-icon
                                                >
                                                {{ classItem.room }}
                                            </div>
                                        </div>
                                    </div>
                                    <div class="text-right">
                                        <v-chip
                                            :color="
                                                getStatusColor(classItem.status)
                                            "
                                            size="small"
                                            class="mb-2"
                                        >
                                            {{ classItem.status }}
                                        </v-chip>
                                        <div>
                                            <v-btn
                                                v-if="
                                                    classItem.status ===
                                                    'ongoing'
                                                "
                                                color="primary"
                                                size="small"
                                                variant="flat"
                                            >
                                                Take Attendance
                                            </v-btn>
                                            <v-btn
                                                v-else-if="
                                                    classItem.status ===
                                                    'upcoming'
                                                "
                                                color="primary"
                                                size="small"
                                                variant="outlined"
                                            >
                                                Prepare
                                            </v-btn>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <v-alert v-else type="info" variant="tonal">
                            No classes scheduled for today
                        </v-alert>
                    </v-card-text>
                </v-card>
            </v-col>

            <!-- Quick Actions -->
            <v-col cols="12" md="4">
                <v-card elevation="1" class="mb-4">
                    <v-card-title class="pa-4">
                        <span class="text-h6 font-weight-bold"
                            >Quick Actions</span
                        >
                    </v-card-title>
                    <v-card-text class="pa-2">
                        <v-list density="compact" class="py-0">
                            <v-list-item
                                to="/lecturer/classes"
                                prepend-icon="mdi-google-classroom"
                                class="rounded-lg mb-1"
                            >
                                <v-list-item-title
                                    >View All Classes</v-list-item-title
                                >
                            </v-list-item>
                            <v-list-item
                                to="/lecturer/schedule"
                                prepend-icon="mdi-calendar-clock"
                                class="rounded-lg mb-1"
                            >
                                <v-list-item-title
                                    >Full Schedule</v-list-item-title
                                >
                            </v-list-item>
                            <v-list-item
                                to="/lecturer/leave"
                                prepend-icon="mdi-calendar-remove"
                                class="rounded-lg mb-1"
                            >
                                <v-list-item-title
                                    >Request Leave</v-list-item-title
                                >
                            </v-list-item>
                        </v-list>
                    </v-card-text>
                </v-card>

                <!-- Upcoming Classes -->
                <v-card elevation="1">
                    <v-card-title class="pa-4">
                        <span class="text-h6 font-weight-bold">This Week</span>
                    </v-card-title>
                    <v-card-text class="pa-2">
                        <div
                            class="week-stat pa-3 mb-2 rounded-lg bg-blue-lighten-5"
                        >
                            <div
                                class="d-flex justify-space-between align-center"
                            >
                                <span class="text-body-2">Total Sessions</span>
                                <span class="text-h6 font-weight-bold">{{
                                    weekTotal
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="week-stat pa-3 mb-2 rounded-lg bg-green-lighten-5"
                        >
                            <div
                                class="d-flex justify-space-between align-center"
                            >
                                <span class="text-body-2">Completed</span>
                                <span class="text-h6 font-weight-bold">{{
                                    weekCompleted
                                }}</span>
                            </div>
                        </div>
                        <div
                            class="week-stat pa-3 rounded-lg bg-orange-lighten-5"
                        >
                            <div
                                class="d-flex justify-space-between align-center"
                            >
                                <span class="text-body-2">Remaining</span>
                                <span class="text-h6 font-weight-bold">{{
                                    weekRemaining
                                }}</span>
                            </div>
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useNuxtApp } from "#app";
import { userAuth } from "~/store/userAuth";

definePageMeta({
    layout: "lecturer",
    middleware: ["auth"],
});

const userStore = userAuth();

const loading = ref(true);
const totalClasses = ref(0);
const totalStudents = ref(0);
const avgAttendance = ref(0);
const currentDay = ref(
    new Date().toLocaleDateString("en-US", { weekday: "long" }),
);
const todayClasses = ref([]);
const weekTotal = ref(0);
const weekCompleted = ref(0);
const weekRemaining = ref(0);

onMounted(async () => {
    await loadDashboardData();
});

const loadDashboardData = async () => {
    loading.value = true;
    try {
        const user = userStore.getUser() || {};
        const raw = user.raw || {};
        const globalId =
            user.global_id ||
            user.globalId ||
            user.user_global_id ||
            raw.global_id ||
            null;

        if (!globalId) {
            console.warn(
                "Lecturer global_id missing; dashboard API not called.",
            );
            return;
        }

        const { $UserPrivateAxios } = useNuxtApp();
        const res = await $UserPrivateAxios.get(
            `/lecturer/auth/dashboard/stats/${globalId}`,
        );
        const data = res?.data?.data || res?.data || {};

        totalClasses.value = Number(data.total_classes || 0);
        totalStudents.value = Number(data.total_students || 0);
        avgAttendance.value = Math.round(Number(data.avg_attendance || 0));

        const schedule = Array.isArray(data.todays_schedule)
            ? data.todays_schedule
            : [];
        todayClasses.value = schedule.map((session) => {
            const start = session.start_datetime
                ? new Date(session.start_datetime)
                : null;
            const end = session.end_datetime
                ? new Date(session.end_datetime)
                : null;
            const now = new Date();
            let status = "upcoming";
            if (start && end) {
                if (now < start) {
                    status = "upcoming";
                } else if (now >= start && now <= end) {
                    status = "ongoing";
                } else {
                    status = "completed";
                }
            }
            const subjectName = session.subject?.code
                ? `${session.subject.code} - ${session.subject.name || ""}`.trim()
                : session.subject?.name || "Subject";

            return {
                id: session.id,
                global_id: session.global_id,
                subject: subjectName,
                group: session.course_type || "N/A",
                time: formatTimeRange(start, end),
                room: session.room?.room || "TBA",
                students: session.students || 0,
                status,
            };
        });

        const week = data.this_week || {};
        weekTotal.value = Number(week.total_sessions || 0);
        weekCompleted.value = Number(week.completed_sessions || 0);
        weekRemaining.value = Math.max(
            weekTotal.value - weekCompleted.value,
            0,
        );
    } catch (error) {
        console.error("Error loading dashboard data:", error);
    } finally {
        loading.value = false;
    }
};

const formatTimeRange = (startTime, endTime) => {
    if (!startTime || !endTime) return "TBA";
    const formatTime = (date) => {
        return date.toLocaleTimeString("en-US", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
        });
    };
    return `${formatTime(startTime)} - ${formatTime(endTime)}`;
};

const getStatusColor = (status) => {
    switch (status) {
        case "completed":
            return "success";
        case "ongoing":
            return "primary";
        case "upcoming":
            return "warning";
        default:
            return "grey";
    }
};

const getUserName = () => {
    const user = userStore.getUser();
    if (user?.first_name && user?.last_name) {
        return `${user.first_name} ${user.last_name}`;
    }
    return "Lecturer";
};
</script>

<style scoped>
.stat-card {
    border-radius: 12px;
    height: 100%;
}

.schedule-list {
    max-height: 600px;
    overflow-y: auto;
}

.schedule-item {
    border: 1px solid #e0e0e0;
    border-radius: 12px;
    transition: all 0.3s;
}

.schedule-item:hover {
    border-color: #1976d2;
    box-shadow: 0 2px 8px rgba(25, 118, 210, 0.1);
}

.schedule-item.active {
    background-color: #e3f2fd;
    border-color: #1976d2;
}

.time-badge {
    text-align: center;
    min-width: 60px;
}

.week-stat {
    border: 1px solid transparent;
}
</style>
