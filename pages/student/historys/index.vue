<!-- filepath: e:\CADT Year4\Capstone II\Full-Stack\Capstone2-UAMS-Frontend\pages\student\historys\index.vue -->
<template>
    <div class="history-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon
                                icon="mdi-history"
                                size="32"
                                color="white"
                            />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">History</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Student</span>
                                <v-icon
                                    icon="mdi-chevron-right"
                                    size="16"
                                    class="breadcrumb-separator"
                                />
                                <span class="breadcrumb-item active"
                                    >History</span
                                >
                            </div>
                        </div>
                    </div>
                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ leaves.length }}</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                        <div class="stat-card stat-card-success">
                            <div class="stat-number">{{ approvedLeaves }}</div>
                            <div class="stat-label">Approved</div>
                        </div>
                        <div class="stat-card stat-card-warning">
                            <div class="stat-number">{{ pendingLeaves }}</div>
                            <div class="stat-label">Pending</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <!-- Export Button Component -->
                    <ExportButtons
                        :data="exportRows"
                        :columns="exportColumns"
                        filename="Leave_History_Export"
                        @export-start="handleExportStart"
                        @export-complete="handleExportComplete"
                        @export-error="handleExportError"
                    />

                    <!-- Add Leave Request Button -->
                    <!-- <v-btn
                        class="modern-btn add-btn"
                        prepend-icon="mdi-calendar-plus"
                        variant="flat"
                        @click="openNewLeaveDialog"
                    >
                        Request Leave
                    </v-btn> -->
                </div>
            </div>
        </div>

        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <div class="table-container">
                <!-- Table Header with Search and Filters -->
                <div class="table-toolbar">
                    <div class="toolbar-left">
                        <h2 class="table-title">
                            <v-icon
                                icon="mdi-calendar-text"
                                size="20"
                                class="mr-2"
                            />
                            Leave Requests
                        </h2>
                        <div class="table-subtitle">
                            Track all your submitted leave requests
                        </div>
                    </div>

                    <div class="toolbar-right">
                        <div class="search-container">
                            <v-text-field
                                v-model="searchQuery"
                                placeholder="Search by reason..."
                                prepend-inner-icon="mdi-magnify"
                                variant="outlined"
                                density="compact"
                                hide-details
                                class="search-input"
                                clearable
                            />
                        </div>

                        <v-select
                            v-model="filters.status"
                            :items="statusOptions"
                            label="Status"
                            variant="outlined"
                            density="compact"
                            hide-details
                            class="filter-select"
                            clearable
                        />

                        <v-btn
                            icon="mdi-filter-variant"
                            variant="outlined"
                            class="filter-btn"
                            @click="showFilters = !showFilters"
                        />
                    </div>
                </div>

                <!-- Quick Filters (collapsible) -->
                <v-expand-transition>
                    <div v-show="showFilters" class="filters-panel">
                        <div class="filters-content">
                            <div class="filter-group">
                                <label class="filter-label">Date Range</label>
                                <v-menu
                                    v-model="dateMenu"
                                    :close-on-content-click="false"
                                    transition="scale-transition"
                                    max-width="290"
                                    min-width="290"
                                >
                                    <template #activator="{ props }">
                                        <v-text-field
                                            v-bind="props"
                                            v-model="dateRangeLabel"
                                            readonly
                                            density="compact"
                                            variant="outlined"
                                            prepend-inner-icon="mdi-calendar-range"
                                            hide-details
                                        />
                                    </template>
                                    <v-date-picker
                                        v-model="filters.dateRange"
                                        range
                                        @update:model-value="onDateRangeChange"
                                    />
                                </v-menu>
                            </div>
                        </div>
                    </div>
                </v-expand-transition>

                <!-- Modern Data Table -->
                <div class="modern-table-wrapper">
                    <v-table class="modern-table">
                        <thead>
                            <tr class="modern-header-row">
                                <th class="modern-header-cell id-column">
                                    <div class="header-content">ID</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Period</div>
                                </th>
                                <th class="modern-header-cell">
                                    <div class="header-content">Reason</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Days</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Status</div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">
                                        Submitted At
                                    </div>
                                </th>
                                <th class="modern-header-cell center-align">
                                    <div class="header-content">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr
                                v-for="(item, index) in paginatedLeaves"
                                :key="item.leave_id"
                                class="modern-table-row"
                            >
                                <td class="modern-table-cell id-column">
                                    <div class="id-badge">
                                        {{
                                            (currentPage - 1) * itemsPerPage +
                                            index +
                                            1
                                        }}
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="period-info">
                                        <div class="period-dates">
                                            {{ formatDate(item.start_date) }}
                                            →
                                            {{ formatDate(item.end_date) }}
                                        </div>
                                    </div>
                                </td>
                                <td class="modern-table-cell">
                                    <div class="reason-text">
                                        {{ item.reason || "N/A" }}
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="days-badge">
                                        {{ getDays(item) }} day(s)
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <v-chip
                                        :color="statusColor(item.status)"
                                        size="small"
                                        class="status-chip"
                                    >
                                        <v-icon start size="16">{{
                                            statusIcon(item.status)
                                        }}</v-icon>
                                        {{ item.status }}
                                    </v-chip>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="date-info">
                                        {{ formatDateTime(item.created_at) }}
                                    </div>
                                </td>
                                <td class="modern-table-cell center-align">
                                    <div class="action-group">
                                        <v-btn
                                            icon
                                            class="action-btn"
                                            @click="viewDetail(item)"
                                        >
                                            <v-icon color="#3b82f6"
                                                >mdi-eye</v-icon
                                            >
                                        </v-btn>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>

                    <!-- Empty State -->
                    <div v-if="filteredLeaves.length === 0" class="empty-state">
                        <v-icon
                            icon="mdi-calendar-blank"
                            size="64"
                            color="grey-lighten-1"
                        />
                        <h3 class="empty-title">No leave requests found</h3>
                        <p class="empty-subtitle">
                            You haven't submitted any leave requests yet.
                        </p>
                        <!-- <v-btn
                            color="primary"
                            variant="flat"
                            @click="openNewLeaveDialog"
                            class="mt-4"
                        >
                            <v-icon start>mdi-calendar-plus</v-icon>
                            Request Leave
                        </v-btn> -->
                    </div>

                    <!-- Pagination Footer -->
                    <div
                        v-if="filteredLeaves.length > 0"
                        class="pagination-section"
                    >
                        <v-btn
                            variant="outlined"
                            :disabled="currentPage === 1"
                            @click="goToPrevPage"
                            class="pagination-btn"
                        >
                            Previous
                        </v-btn>

                        <div class="pagination-info">
                            <span class="pagination-text"
                                >Page {{ currentPage }} of
                                {{ totalPages }}</span
                            >
                        </div>

                        <v-btn
                            variant="outlined"
                            :disabled="currentPage >= totalPages"
                            @click="goToNextPage"
                            class="pagination-btn"
                        >
                            Next
                        </v-btn>
                    </div>
                </div>
            </div>
        </div>

        <!-- Detail Dialog -->
        <v-dialog v-model="detailDialog" max-width="600" persistent>
            <v-card class="modern-dialog" elevation="24" v-if="selectedLeave">
                <!-- Dialog Header -->
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon
                                icon="mdi-calendar-text"
                                color="primary"
                                size="24"
                            />
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">Leave Request Details</h2>
                            <p class="dialog-subtitle">
                                {{ selectedLeave.reason || "Leave Request" }}
                            </p>
                        </div>
                    </div>
                    <v-btn
                        icon="mdi-close"
                        variant="text"
                        size="small"
                        @click="detailDialog = false"
                        class="close-btn"
                    />
                </div>

                <v-divider />

                <!-- Dialog Content -->
                <v-card-text class="dialog-content">
                    <div class="detail-section">
                        <div class="detail-grid">
                            <div class="detail-item">
                                <div class="detail-label">Period</div>
                                <div class="detail-value">
                                    {{ formatDate(selectedLeave.start_date) }} →
                                    {{ formatDate(selectedLeave.end_date) }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Days</div>
                                <div class="detail-value">
                                    {{ getDays(selectedLeave) }} day(s)
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Status</div>
                                <div class="detail-value">
                                    <v-chip
                                        :color="
                                            statusColor(selectedLeave.status)
                                        "
                                        size="small"
                                    >
                                        {{ selectedLeave.status }}
                                    </v-chip>
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Reason</div>
                                <div class="detail-value">
                                    {{ selectedLeave.reason || "—" }}
                                </div>
                            </div>
                            <div class="detail-item">
                                <div class="detail-label">Submitted At</div>
                                <div class="detail-value">
                                    {{
                                        formatDateTime(selectedLeave.created_at)
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </v-card-text>

                <v-divider />

                <!-- Dialog Actions -->
                <v-card-actions class="dialog-actions">
                    <v-btn
                        variant="outlined"
                        color="grey-darken-1"
                        @click="detailDialog = false"
                    >
                        Close
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import ExportButtons from "~/components/ui/ExportButtons.vue";
import { useRequestLeaveStore } from "~/store/useRequestLeaveStore";

definePageMeta({
    layout: "student",
    middleware: "auth",
});

interface LeaveItem {
    leave_id: number;
    start_date: string;
    end_date: string;
    reason: string | null;
    status: "Pending" | "Approved" | "Rejected" | "Canceled";
    created_at: string;
}

const requestLeaveStore = useRequestLeaveStore();
const leaves = computed<LeaveItem[]>(
    () => requestLeaveStore.leaveRequests as LeaveItem[],
);
const searchQuery = ref("");
const showFilters = ref(false);
const dateMenu = ref(false);
const detailDialog = ref(false);
const selectedLeave = ref<LeaveItem | null>(null);
const currentPage = ref(1);
const itemsPerPage = 10;

const filters = ref({
    status: null as LeaveItem["status"] | null,
    dateRange: null as any,
});

const statusOptions = [
    { title: "All Status", value: null },
    { title: "Pending", value: "Pending" },
    { title: "Approved", value: "Approved" },
    { title: "Rejected", value: "Rejected" },
    { title: "Canceled", value: "Canceled" },
];

// Export columns
const exportColumns = [
    { key: "leave_id", header: "ID", width: 10 },
    { key: "start_date", header: "From Date", format: "date", width: 14 },
    { key: "end_date", header: "To Date", format: "date", width: 14 },
    { key: "days", header: "Days", width: 10 },
    { key: "reason", header: "Reason", width: 30 },
    { key: "status", header: "Status", width: 12 },
    {
        key: "created_at",
        header: "Submitted At",
        format: "datetime",
        width: 18,
    },
];

// Computed
const dateRangeLabel = computed(() => {
    if (!filters.value.dateRange) return "All dates";
    const { start, end } = filters.value.dateRange;
    if (!start || !end) return "All dates";
    return `${start} → ${end}`;
});

const approvedLeaves = computed(
    () => leaves.value.filter((l) => l.status === "Approved").length,
);
const pendingLeaves = computed(
    () => leaves.value.filter((l) => l.status === "Pending").length,
);

const filteredLeaves = computed(() => {
    let result = leaves.value;

    // Search filter
    if (searchQuery.value) {
        const query = searchQuery.value.toLowerCase();
        result = result.filter((l) => l.reason?.toLowerCase().includes(query));
    }

    // Status filter
    if (filters.value.status) {
        result = result.filter((l) => l.status === filters.value.status);
    }

    // Date range filter
    if (filters.value.dateRange) {
        const { start, end } = filters.value.dateRange;
        result = result.filter((l) => {
            const d = l.start_date?.slice(0, 10);
            if (start && d < start) return false;
            if (end && d > end) return false;
            return true;
        });
    }

    return result;
});

const totalPages = computed(() =>
    Math.ceil(filteredLeaves.value.length / itemsPerPage),
);

const paginatedLeaves = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredLeaves.value.slice(start, end);
});

// Methods
const statusColor = (status: LeaveItem["status"]) => {
    switch (status) {
        case "Pending":
            return "warning";
        case "Approved":
            return "success";
        case "Rejected":
            return "error";
        case "Canceled":
            return "default";
        default:
            return "default";
    }
};

const statusIcon = (status: LeaveItem["status"]) => {
    switch (status) {
        case "Pending":
            return "mdi-clock-outline";
        case "Approved":
            return "mdi-check-circle";
        case "Rejected":
            return "mdi-close-circle";
        case "Canceled":
            return "mdi-cancel";
        default:
            return "mdi-help-circle";
    }
};

const formatDate = (d: string) => new Date(d).toLocaleDateString();
const formatDateTime = (d: string) => new Date(d).toLocaleString();

const getDays = (item: LeaveItem) => {
    if (!item.start_date || !item.end_date) return 0;
    const start = new Date(item.start_date);
    const end = new Date(item.end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;
};

const exportRows = computed(() =>
    filteredLeaves.value.map((leave) => ({
        ...leave,
        days: getDays(leave),
    })),
);

const onDateRangeChange = () => {
    dateMenu.value = false;
};

const viewDetail = (item: LeaveItem) => {
    selectedLeave.value = item;
    detailDialog.value = true;
};

const goToPrevPage = () => {
    if (currentPage.value > 1) currentPage.value--;
};

const goToNextPage = () => {
    if (currentPage.value < totalPages.value) currentPage.value++;
};

const openNewLeaveDialog = () => {
    alert("Open leave request form (not implemented)");
};

// Export handlers
const handleExportStart = (type: string) => {
    console.log(`Starting ${type} export...`);
};

const handleExportComplete = (type: string) => {
    console.log(`${type} export completed successfully`);
};

const handleExportError = (error: any) => {
    console.error("Export error:", error);
};

onMounted(() => {
    requestLeaveStore.fetchLeaveRequests({ scope: "user" }).catch(() => {});
});
</script>

<style scoped>
/* Same modern styles as generations page */
.history-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
}

/* Modern Header */
.modern-header {
    background: white;
    border-bottom: 1px solid #e2e8f0;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    margin-bottom: 24px;
}

.header-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 24px;
    flex-wrap: wrap;
}

.title-section {
    flex: 1;
    min-width: 300px;
}

.title-wrapper {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 20px;
}

.title-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
}

.title-content {
    flex: 1;
}

.page-title {
    font-size: 32px;
    font-weight: 700;
    color: #1e293b;
    margin: 0 0 8px 0;
    letter-spacing: -0.025em;
}

.breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
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

.stats-cards {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
    gap: 16px;
    margin-top: 16px;
}

.stat-card {
    background: linear-gradient(145deg, #ffffff 0%, #f8faff 100%);
    border: 1px solid rgba(59, 130, 246, 0.1);
    border-left: 4px solid #3b82f6;
    border-radius: 12px;
    padding: 16px;
    transition: all 0.3s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.15);
}

.stat-card-success {
    border-left-color: #22c55e;
}

.stat-card-warning {
    border-left-color: #f59e0b;
}

.stat-number {
    font-size: 28px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 13px;
    color: #64748b;
    font-weight: 500;
}

.action-section {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
}

.modern-btn {
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
    text-transform: none;
    font-weight: 600;
    letter-spacing: 0.025em;
    border-radius: 10px;
}

.add-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

/* Table Section */
.modern-table-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px 24px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.04);
    overflow: hidden;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-bottom: 1px solid #e2e8f0;
    flex-wrap: wrap;
    gap: 16px;
}

.toolbar-left {
    flex: 1;
    min-width: 200px;
}

.table-title {
    font-size: 18px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
}

.table-subtitle {
    font-size: 13px;
    color: #64748b;
}

.toolbar-right {
    display: flex;
    gap: 12px;
    align-items: center;
    flex-wrap: wrap;
}

.search-input {
    min-width: 280px;
}

.filter-select {
    min-width: 160px;
}

.filters-panel {
    padding: 16px 24px;
    background: #f8fafc;
    border-bottom: 1px solid #e2e8f0;
}

.filters-content {
    display: flex;
    gap: 16px;
    flex-wrap: wrap;
}

.filter-group {
    flex: 1;
    min-width: 200px;
}

.filter-label {
    display: block;
    font-size: 13px;
    font-weight: 500;
    color: #475569;
    margin-bottom: 8px;
}

/* Modern Table */
.modern-table-wrapper {
    overflow-x: auto;
}

.modern-table {
    width: 100%;
}

.modern-header-row {
    background: #f8fafc;
}

.modern-header-cell {
    padding: 16px;
    font-weight: 600;
    font-size: 13px;
    color: #475569;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-bottom: 2px solid #e2e8f0;
}

.modern-table-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #e2e8f0;
}

.modern-table-row:hover {
    background: #f8fafc;
}

.modern-table-cell {
    padding: 16px;
    font-size: 14px;
    color: #1e293b;
}

.center-align {
    text-align: center;
}

.id-column {
    width: 80px;
}

.id-badge {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 4px 12px;
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    color: white;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
}

.period-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.period-dates {
    font-weight: 500;
    color: #1e293b;
}

.reason-text {
    color: #475569;
    max-width: 300px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.days-badge {
    padding: 6px 12px;
    background: #e0e7ff;
    color: #3730a3;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13px;
}

.status-chip {
    font-weight: 600;
    text-transform: capitalize;
}

.date-info {
    font-size: 13px;
    color: #64748b;
}

.action-group {
    display: flex;
    gap: 4px;
    justify-content: center;
}

.action-btn {
    width: 32px;
    height: 32px;
    transition: all 0.2s ease;
}

.action-btn:hover {
    transform: scale(1.1);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 80px 20px;
}

.empty-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 16px 0 8px;
}

.empty-subtitle {
    font-size: 14px;
    color: #64748b;
    max-width: 400px;
    margin: 0 auto;
}

/* Pagination */
.pagination-section {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 24px;
    border-top: 1px solid #e2e8f0;
}

.pagination-info {
    font-size: 14px;
    color: #64748b;
    font-weight: 500;
}

/* Dialog */
.modern-dialog {
    border-radius: 16px;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px;
    background: #f8fafc;
}

.header-content {
    display: flex;
    gap: 16px;
    flex: 1;
}

.header-icon {
    width: 48px;
    height: 48px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.header-text {
    flex: 1;
}

.dialog-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
}

.dialog-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.dialog-content {
    padding: 24px;
}

.detail-section {
    margin-bottom: 20px;
}

.detail-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 16px;
}

.detail-item {
    padding: 12px;
    background: #f8fafc;
    border-radius: 8px;
}

.detail-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-bottom: 4px;
}

.detail-value {
    font-size: 14px;
    font-weight: 600;
    color: #1e293b;
}

.dialog-actions {
    padding: 16px 24px;
    background: #f8fafc;
}

/* Responsive */
@media (max-width: 768px) {
    .header-container {
        flex-direction: column;
    }

    .stats-cards {
        grid-template-columns: 1fr;
    }

    .table-toolbar {
        flex-direction: column;
        align-items: stretch;
    }

    .toolbar-right {
        width: 100%;
    }

    .search-input,
    .filter-select {
        min-width: 100%;
    }

    .detail-grid {
        grid-template-columns: 1fr;
    }
}
</style>
