<!-- filepath: e:\CADT Year4\Capstone II\Full-Stack\Capstone2-UAMS-Frontend\pages\student\schedules\index.vue -->
<template>
    <div class="schedule-page">
        <!-- Modern Header -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <VIcon
                                icon="mdi-calendar-clock"
                                color="white"
                                size="32"
                            />
                        </div>
                        <div class="title-content">
                            <div class="page-title">Class Schedule</div>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Student</span>
                                <span class="breadcrumb-separator">/</span>
                                <span class="breadcrumb-item active"
                                    >Schedule</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="subtitle-text">
                        View your upcoming classes by day, week, or term. You
                        can also export or import your schedule.
                    </div>
                </div>
                <div class="header-actions">
                    <ExportButtons
                        :data="exportData"
                        :columns="exportColumns"
                        filename="Student_Schedule"
                        @export-start="onExportStart"
                        @export-complete="onExportComplete"
                        @export-error="onExportError"
                    />
                    <ImportCsv
                        :columns="exportColumns"
                        @import-complete="onImportComplete"
                        @import-error="onImportError"
                    />
                    <VBtn
                        class="refresh-btn"
                        variant="flat"
                        color="primary"
                        prepend-icon="mdi-refresh"
                        @click="fetchSchedule"
                    >
                        Refresh
                    </VBtn>
                </div>
            </div>
        </div>

        <!-- Content Section -->
        <div class="content-section">
            <!-- Filters Card -->
            <VCard class="filter-card" elevation="0">
                <VCardText>
                    <div class="filter-controls">
                        <VSelect
                            v-model="filters.termId"
                            :items="termItems"
                            item-title="label"
                            item-value="value"
                            label="Term"
                            density="comfortable"
                            clearable
                            class="filter-item"
                        />
                        <VMenu
                            v-model="dateMenu"
                            :close-on-content-click="false"
                            transition="scale-transition"
                            max-width="290"
                            min-width="290"
                        >
                            <template #activator="{ props }">
                                <VTextField
                                    v-bind="props"
                                    v-model="dateRangeLabel"
                                    label="Date range"
                                    readonly
                                    density="comfortable"
                                    class="filter-item"
                                    prepend-inner-icon="mdi-calendar-range"
                                />
                            </template>
                            <VDatePicker
                                v-model="dateRange"
                                range
                                @update:model-value="onDateRangeChange"
                            />
                        </VMenu>
                        <div class="switch-wrapper">
                            <VSwitch
                                v-model="filters.todayOnly"
                                label="Show today only"
                                color="primary"
                                hide-details
                            />
                        </div>
                        <VBtn
                            variant="text"
                            color="default"
                            @click="clearFilters"
                        >
                            Clear Filters
                        </VBtn>
                    </div>
                </VCardText>
            </VCard>

            <!-- Loading State -->
            <div v-if="loading" class="loading-state">
                <VProgressCircular indeterminate color="primary" size="64" />
                <p class="loading-text">Loading schedule...</p>
            </div>

            <!-- Schedule List (grouped by date) -->
            <div v-else-if="groupedSessionsKeys.length" class="schedule-list">
                <div
                    v-for="date in groupedSessionsKeys"
                    :key="date"
                    class="date-group"
                >
                    <div class="date-header">
                        <div class="date-header-left">
                            <VIcon
                                icon="mdi-calendar"
                                color="primary"
                                class="mr-2"
                            />
                            <span class="date-title">{{
                                formatDate(date)
                            }}</span>
                            <VChip
                                class="class-count-chip ml-2"
                                variant="outlined"
                                size="small"
                            >
                                {{ groupedSessions[date].length }} classes
                            </VChip>
                        </div>
                    </div>
                    <div class="sessions-grid">
                        <div
                            v-for="session in groupedSessions[date]"
                            :key="session.id"
                            class="session-card"
                        >
                            <div class="session-content">
                                <div class="session-main">
                                    <div class="session-subject">
                                        <span class="subject-code">{{
                                            session.subject_code
                                        }}</span>
                                        <span class="separator">—</span>
                                        <span class="subject-name">{{
                                            session.subject_name
                                        }}</span>
                                    </div>
                                    <div class="session-details">
                                        <div class="detail-item">
                                            <VIcon
                                                icon="mdi-clock-outline"
                                                size="16"
                                                class="mr-1"
                                            />
                                            {{
                                                formatTime(
                                                    session.start_datetime,
                                                )
                                            }}
                                            -
                                            {{
                                                formatTime(session.end_datetime)
                                            }}
                                        </div>
                                        <div class="detail-item">
                                            <VIcon
                                                icon="mdi-map-marker"
                                                size="16"
                                                class="mr-1"
                                                color="success"
                                            />
                                            Room
                                            {{ session.room_name || "TBA" }}
                                        </div>
                                        <div class="detail-item">
                                            <VIcon
                                                icon="mdi-account-tie"
                                                size="16"
                                                class="mr-1"
                                                color="info"
                                            />
                                            {{ session.instructor_name }}
                                        </div>
                                    </div>
                                </div>
                                <div class="session-badges">
                                    <VChip
                                        size="small"
                                        :color="
                                            sessionStatusColor(session.status)
                                        "
                                        class="status-chip"
                                        label
                                    >
                                        <VIcon
                                            :icon="
                                                getStatusIcon(session.status)
                                            "
                                            size="16"
                                            class="mr-1"
                                        />
                                        {{ session.status }}
                                    </VChip>
                                    <VChip
                                        v-if="session.term_label"
                                        size="small"
                                        variant="outlined"
                                        label
                                    >
                                        {{ session.term_label }}
                                    </VChip>
                                </div>
                            </div>
                            <div class="session-actions">
                                <VChip
                                    v-if="
                                        getAttendanceStatus(session) ===
                                        'present'
                                    "
                                    size="small"
                                    color="success"
                                    variant="flat"
                                    label
                                >
                                    Present
                                </VChip>
                                <VBtn
                                    v-else
                                    size="small"
                                    color="primary"
                                    variant="flat"
                                    prepend-icon="mdi-face-recognition"
                                    @click="goToAttendance(session)"
                                >
                                    Scan Attendance
                                </VBtn>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Empty State -->
            <VCard v-else class="empty-state" elevation="0">
                <div class="empty-icon">
                    <VIcon
                        icon="mdi-calendar-blank"
                        size="48"
                        color="primary"
                    />
                </div>
                <div class="empty-title">No classes found</div>
                <div class="empty-subtitle">
                    Try adjusting your term or date range to see more results.
                </div>
                <VBtn variant="text" color="primary" @click="clearFilters">
                    Clear Filters
                </VBtn>
            </VCard>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAttendanceStore } from "~/store/useAttendanceStore";
import { useStudentScheduleStore } from "~/store/useStudentScheduleStore";
import { useTermStore } from "~/store/useTermStore";
import ExportButtons from "~/components/ui/ExportButtons.vue";
import ImportCsv from "~/components/ui/ImportCsv.vue";

definePageMeta({
    layout: "student",
    middleware: "auth",
});

const scheduleStore = useStudentScheduleStore();
const attendanceStore = useAttendanceStore();
const termStore = useTermStore();

const loading = ref(false);
const dateMenu = ref(false);
const dateRange = ref(null);

const filters = ref({
    termId: null,
    todayOnly: true,
});

const goToAttendance = (session) => {
    navigateTo({
        path: "/student/attendance",
        query: { session_id: String(session.id) },
    });
};

// Computed term items for dropdown
const termItems = computed(() => {
    return termStore.terms
        .filter((t) => t.active === 1)
        .map((t) => ({
            label: t.term,
            value: t.id,
        }));
});

// Date range label for display
const dateRangeLabel = computed(() => {
    if (
        !dateRange.value ||
        !Array.isArray(dateRange.value) ||
        dateRange.value.length === 0
    ) {
        return "All dates";
    }
    const dates = dateRange.value.filter((d) => d != null);
    if (dates.length === 0) return "All dates";
    if (dates.length === 1) return dates[0];
    const sorted = [...dates].sort();
    return `${sorted[0]} → ${sorted[sorted.length - 1]}`;
});

// Group sessions by date
const groupedSessions = computed(() => {
    const map = {};
    const todayStr = new Date().toISOString().slice(0, 10);

    scheduleStore.sessions.forEach((s) => {
        // Apply filters
        if (filters.value.todayOnly && s.dateKey !== todayStr) return;
        if (filters.value.termId && s.term_id !== filters.value.termId) return;

        // Date range filter
        if (
            dateRange.value &&
            Array.isArray(dateRange.value) &&
            dateRange.value.length > 0
        ) {
            const dates = dateRange.value.filter((d) => d != null).sort();
            if (dates.length > 0) {
                if (s.dateKey < dates[0] || s.dateKey > dates[dates.length - 1])
                    return;
            }
        }

        if (!map[s.dateKey]) map[s.dateKey] = [];
        map[s.dateKey].push(s);
    });

    // Sort sessions within each date by start time
    Object.keys(map).forEach((dateKey) => {
        map[dateKey].sort(
            (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
        );
    });

    return map;
});

const groupedSessionsKeys = computed(() =>
    Object.keys(groupedSessions.value).sort(),
);

const attendanceBySessionId = computed(() => {
    const map = new Map();
    attendanceStore.attendances.forEach((item) => {
        const sessionId = item.session_id || item.session?.id;
        if (sessionId) map.set(sessionId, item);
    });
    return map;
});

// Export/Import columns definition
const exportColumns = [
    { key: "dateKey", header: "Date", format: "date", width: 16 },
    {
        key: "start_datetime",
        header: "Start Time",
        format: "datetime",
        width: 18,
    },
    { key: "end_datetime", header: "End Time", format: "datetime", width: 18 },
    { key: "subject_code", header: "Subject Code", width: 14 },
    { key: "subject_name", header: "Subject Name", width: 24 },
    { key: "room_name", header: "Room", width: 12 },
    { key: "instructor_name", header: "Instructor", width: 18 },
    { key: "status", header: "Status", width: 12 },
    { key: "term_label", header: "Term", width: 12 },
];

// Data to export (filtered)
const exportData = computed(() => {
    // Flatten all filtered sessions into a single array
    return groupedSessionsKeys.value.flatMap(
        (date) => groupedSessions.value[date],
    );
});

// Fetch schedule data
const fetchSchedule = async () => {
    loading.value = true;
    try {
        await Promise.all([
            scheduleStore.fetchSchedule(),
            attendanceStore.fetchAttendance(),
        ]);
    } catch (error) {
        console.error("Failed to fetch schedule:", error);
    } finally {
        loading.value = false;
    }
};

// Handle date range change
const onDateRangeChange = (val) => {
    if (!val || (Array.isArray(val) && val.length === 0)) {
        dateRange.value = null;
    }
    dateMenu.value = false;
};

// Format date for display
const formatDate = (dateStr) => {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(undefined, {
        weekday: "short",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
};

// Format time for display
const formatTime = (iso) => {
    return new Date(iso).toLocaleTimeString(undefined, {
        hour: "2-digit",
        minute: "2-digit",
    });
};

// Get status color
const sessionStatusColor = (status) => {
    switch (status) {
        case "planned":
            return "primary";
        case "completed":
            return "success";
        case "canceled":
            return "error";
        case "makeup":
            return "warning";
        default:
            return "default";
    }
};

// Get status icon
const getStatusIcon = (status) => {
    switch (status) {
        case "planned":
            return "mdi-calendar-check";
        case "completed":
            return "mdi-check-circle";
        case "canceled":
            return "mdi-close-circle";
        case "makeup":
            return "mdi-calendar-refresh";
        default:
            return "mdi-calendar";
    }
};

// Clear all filters
const clearFilters = () => {
    filters.value.termId = null;
    filters.value.todayOnly = false;
    dateRange.value = null;
    fetchSchedule();
};

const getAttendanceStatus = (session) => {
    const attendance = attendanceBySessionId.value.get(session.id);
    return attendance?.status || null;
};

// Export/Import event handlers
const onExportStart = (type) => {
    // Optionally show a loading indicator or toast
};
const onExportComplete = (type) => {
    // Optionally show a success toast
};
const onExportError = (err) => {
    // Optionally show an error toast
    console.error("Export error:", err);
};
const onImportComplete = (rows) => {
    // Optionally merge imported rows into the schedule
    // For demo: just log them
    console.log("Imported rows:", rows);
};
const onImportError = (err) => {
    // Optionally show an error toast
    console.error("Import error:", err);
};

// Initialize on mount
onMounted(async () => {
    loading.value = true;
    try {
        await termStore.fetchTerms({ scope: "user" });
        if (!filters.value.termId) {
            const activeTerm = termStore.terms.find((t) => t.active === 1);
            if (activeTerm) filters.value.termId = activeTerm.id;
        }
        await Promise.all([
            scheduleStore.fetchSchedule(),
            attendanceStore.fetchAttendance(),
        ]);
    } catch (error) {
        console.error("Failed to initialize schedule page:", error);
    } finally {
        loading.value = false;
    }
});
</script>

<style scoped>
.schedule-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
}

/* Modern Header Styles */
.modern-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    flex-wrap: wrap;
}

.title-section {
    flex: 1;
    min-width: 300px;
}

.title-wrapper {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 12px;
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

.subtitle-text {
    font-size: 14px;
    color: #64748b;
    margin: 8px 0 0;
    line-height: 1.5;
}

.header-actions {
    display: flex;
    gap: 12px;
}

.refresh-btn {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.025em;
}

/* Content Section */
.content-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
}

/* Filter Card */
.filter-card {
    background: white;
    border-radius: 16px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
}

.filter-header {
    display: flex;
    align-items: center;
    margin-bottom: 16px;
    padding-bottom: 12px;
    border-bottom: 1px solid #e2e8f0;
}

.filter-title {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.filter-controls {
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    align-items: center;
}

.filter-item {
    min-width: 240px;
    flex: 1;
}

.switch-wrapper {
    display: flex;
    align-items: center;
}

/* Loading State */
.loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    gap: 20px;
}

.loading-text {
    font-size: 16px;
    color: #64748b;
    font-weight: 500;
    margin: 0;
}

/* Schedule List */
.schedule-list {
    display: flex;
    flex-direction: column;
    gap: 32px;
}

.date-group {
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.date-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 16px;
    background: white;
    border-radius: 12px;
    border: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.date-header-left {
    display: flex;
    align-items: center;
}

.date-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0;
}

.class-count-chip {
    font-weight: 600;
    font-size: 12px;
}

/* Sessions Grid */
.sessions-grid {
    display: grid;
    gap: 12px;
}

.session-card {
    background: white;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.session-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 16px rgba(0, 0, 0, 0.1);
    border-color: #3b82f6;
}

.session-content {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 20px;
    padding: 20px !important;
}

.session-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.session-subject {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 4px;
}

.subject-code {
    font-size: 16px;
    font-weight: 700;
    color: #3b82f6;
    letter-spacing: 0.025em;
}

.separator {
    color: #cbd5e1;
}

.subject-name {
    font-size: 16px;
    font-weight: 600;
    color: #1e293b;
}

.session-details {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.detail-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #475569;
    font-weight: 500;
}

.session-badges {
    display: flex;
    flex-direction: column;
    gap: 8px;
    align-items: flex-end;
}

.session-actions {
    padding: 0 20px 20px;
    display: flex;
    justify-content: flex-end;
}

.status-chip {
    font-weight: 600;
    text-transform: capitalize;
    font-size: 12px;
}

/* Empty State */
.empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 80px 20px;
    background: white;
    border-radius: 16px;
    border: 2px dashed #e2e8f0;
}

.empty-icon {
    margin-bottom: 20px;
}

.empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin-bottom: 8px;
}

.empty-subtitle {
    font-size: 14px;
    color: #64748b;
    text-align: center;
    max-width: 400px;
    line-height: 1.5;
}

/* Responsive Design */
@media (max-width: 1024px) {
    .header-container {
        flex-direction: column;
        align-items: stretch;
    }

    .header-actions {
        justify-content: flex-start;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .content-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: row;
    }

    .page-title {
        font-size: 24px;
    }

    .filter-controls {
        flex-direction: column;
        align-items: stretch;
    }

    .filter-item {
        min-width: 100%;
    }

    .switch-wrapper {
        justify-content: flex-start;
    }

    .session-content {
        flex-direction: column;
        gap: 16px;
    }

    .session-badges {
        flex-direction: row;
        align-items: flex-start;
        flex-wrap: wrap;
    }

    .date-header {
        flex-direction: column;
        align-items: flex-start;
        gap: 8px;
    }
}

@media (max-width: 480px) {
    .title-icon {
        width: 40px;
        height: 40px;
    }

    .page-title {
        font-size: 20px;
    }

    .session-subject {
        flex-direction: column;
        align-items: flex-start;
    }

    .separator {
        display: none;
    }
}
</style>
