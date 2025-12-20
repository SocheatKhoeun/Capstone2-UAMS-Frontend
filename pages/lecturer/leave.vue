<template>
    <div class="leave-management-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon color="white" size="24">mdi-calendar-clock</v-icon>
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Leave Management</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Lectur
                                    er</span>
                                <v-icon size="12" class="breadcrumb-separator mx-1">mdi-chevron-right</v-icon>
                                <span class="breadcrumb-item active">Leave Management</span>
                            </div>
                        </div>
                    </div>

                    <div class="stats-cards">
                        <div class="stat-card">
                            <div class="stat-number">{{ studentLeaveRequests.length }}</div>
                            <div class="stat-label">Total Requests</div>
                        </div>
                        <div class="stat-card">
                            <div class="stat-number">{{ pendingStudentRequests }}</div>
                            <div class="stat-label">Pending</div>
                        </div>  
                        <div class="stat-card">
                            <div class="stat-number">{{ approvedStudentRequests }}</div>
                            <div class="stat-label">Approved</div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                class="modern-btn"
                                prepend-icon="mdi-download"
                                append-icon="mdi-chevron-down"
                            >
                                Import
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item" @click="handleImportCSV">
                                <v-list-item-title>Import from CSV</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                class="modern-btn"
                                prepend-icon="mdi-upload"
                                append-icon="mdi-chevron-down"
                            >
                                Export
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item" @click="handleExportExcel">
                                <v-list-item-title>Export to Excel</v-list-item-title>
                            </v-list-item>
                            <v-list-item class="menu-item" @click="handleExportPDF">
                                <v-list-item-title>Export to PDF</v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>

                    <v-menu>
                        <template v-slot:activator="{ props }">
                            <v-btn
                                v-bind="props"
                                class="modern-btn add-btn"
                                prepend-icon="mdi-plus"
                                append-icon="mdi-chevron-down"
                            >
                                Add Leave Request
                            </v-btn>
                        </template>
                        <v-list class="modern-menu">
                            <v-list-item class="menu-item" @click="openStudentLeaveForm">
                                <v-list-item-title>
                                    <v-icon start size="20">mdi-account-school</v-icon>
                                    Student Leave Request
                                </v-list-item-title>
                            </v-list-item>
                            <v-list-item class="menu-item" @click="openLecturerLeaveForm">
                                <v-list-item-title>
                                    <v-icon start size="20">mdi-account-tie</v-icon>
                                    My Leave Request
                                </v-list-item-title>
                            </v-list-item>
                        </v-list>
                    </v-menu>
                </div>
            </div>
        </div>

        <!-- Modern Tab Section -->
        <div class="modern-tab-section">
            <div class="tab-container">
                <v-tabs v-model="activeTab" color="primary" slider-color="primary" height="48" class="modern-tabs">
                    <v-tab value="student-requests" class="modern-tab">
                        <v-icon start size="20">mdi-account-group</v-icon>
                        Student Requests
                        <v-badge v-if="pendingStudentRequests > 0" :content="pendingStudentRequests" color="error" 
                                inline class="ml-2" floating></v-badge>
                    </v-tab>
                    <v-tab value="my-requests" class="modern-tab">
                        <v-icon start size="20">mdi-account-edit</v-icon>
                        My Leave Requests
                    </v-tab>
                </v-tabs>
            </div>
        </div>

        <!-- Modern Table Section -->
        <div class="modern-table-section">
            <v-window v-model="activeTab">
                <!-- Student Requests Tab -->
                <v-window-item value="student-requests">
                    <div class="table-container">
                        <div class="table-toolbar">
                            <div class="toolbar-left">
                                <h2 class="table-title">
                                    <v-icon class="mr-2" color="primary">mdi-view-grid</v-icon>
                                    Leave Information
                                </h2>
                                <p class="table-subtitle">Manage and organize your leave requests</p>
                            </div>
                            <div class="toolbar-right">
                                <div class="search-container">
                                    <v-text-field
                                        v-model="studentSearchQuery"
                                        placeholder="Search requests..."
                                        density="compact"
                                        variant="outlined"
                                        prepend-inner-icon="mdi-magnify"
                                        class="search-input"
                                    ></v-text-field>
                                </div>
                                <v-select
                                    v-model="studentStatusFilter"
                                    :items="statusFilterOptions"
                                    placeholder="Status"
                                    density="compact"
                                    variant="outlined"
                                    class="sort-select"
                                ></v-select>
                                <v-btn
                                    variant="text"
                                    icon="mdi-tune"
                                    class="filter-btn"
                                ></v-btn>
                            </div>
                        </div>

                        <!-- Student Requests Data Table -->
                        <div class="modern-table-wrapper">
                            <v-data-table
                                :headers="studentRequestHeaders"
                                :items="filteredStudentRequests"
                                :items-per-page="10"
                                class="modern-table"
                                hover
                            >
                                <template #bottom="{ page, pageCount, itemsLength }">
                                    <div class="custom-table-footer">
                                        <v-btn
                                            variant="outlined"
                                            size="large"
                                            class="footer-btn"
                                            :disabled="page === 1"
                                            @click="page--"
                                        >
                                            <v-icon size="20">mdi-chevron-left</v-icon>
                                            Previous
                                        </v-btn>
                                        <div class="footer-info">
                                            Page {{ page }} of {{ pageCount }} ({{ itemsLength }} total records)
                                        </div>
                                            <v-btn
                                                variant="outlined"
                                                size="large"
                                                class="footer-btn"
                                                :disabled="page === pageCount"
                                                @click="page++"
                                        >
                                            Next
                                            <v-icon size="20">mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                                <template #headers>
                                    <tr class="modern-header-row">
                                        <th class="modern-header-cell id-column">
                                            <div class="header-content">#</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Student</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Class</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Type</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Dates</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Status</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Approval</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Actions</div>
                                        </th>
                                    </tr>
                                </template>
                                <template #item="{ item, index }">
                                    <tr class="modern-table-row">
                                        <td class="modern-table-cell id-column">
                                            <div class="id-badge">{{ index + 1 }}</div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="group-info">
                                                <div class="group-avatar">
                                                    <v-icon color="primary">mdi-account-group</v-icon>
                                                </div>
                                                <div class="group-details">
                                                    <div class="group-name">{{ item.student }}</div>
                                                    <div class="group-meta">{{ item.studentId }}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="global-id-badge">{{ item.class }}</div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <v-chip :color="getTypeColor(item.type)" variant="flat" size="small" text-color="white">
                                                {{ item.type }}
                                            </v-chip>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="date-info">
                                                <div class="date-primary">{{ formatDate(item.startDate) }}</div>
                                                <div class="date-secondary">to {{ formatDate(item.endDate) }}</div>
                                            </div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <v-chip :color="getStatusColor(item.status)" text-color="white" variant="flat" size="small">
                                                <v-icon :icon="getStatusIcon(item.status)" size="16" class="mr-1"></v-icon>
                                                {{ item.status }}
                                            </v-chip>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="approval-actions">
                                                <template v-if="item.status === 'Pending'">
                                                    <v-tooltip text="Approve Request">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn 
                                                                v-bind="props"
                                                                variant="elevated" 
                                                                icon="mdi-check-circle" 
                                                                size="small"
                                                                color="green"
                                                                class="modern-action-btn approve-btn mr-2"
                                                                @click="approveRequest(item)"
                                                            ></v-btn>
                                                        </template>
                                                    </v-tooltip>

                                                    <v-tooltip text="Reject Request">
                                                        <template v-slot:activator="{ props }">
                                                            <v-btn 
                                                                v-bind="props"
                                                                variant="elevated" 
                                                                icon="mdi-close-circle" 
                                                                size="small"
                                                                color="orange"
                                                                class="modern-action-btn reject-btn"
                                                                @click="rejectRequest(item)"
                                                            ></v-btn>
                                                        </template>
                                                    </v-tooltip>
                                                </template>
                                                <template v-else>
                                                    <span class="text-grey text-caption">{{ item.status }}</span>
                                                </template>
                                            </div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="action-group">
                                                <v-tooltip text="View Details">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-eye" 
                                                            size="small"
                                                            color="blue"
                                                            class="modern-action-btn view-btn"
                                                            @click="viewStudentRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                                
                                                <v-tooltip text="Edit Request">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-pencil" 
                                                            size="small"
                                                            class="modern-action-btn edit-btn"
                                                            @click="editStudentRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                                
                                                <v-tooltip text="Delete Request">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-delete" 
                                                            size="small"
                                                            class="modern-action-btn delete-btn"
                                                            @click="deleteRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                <template #no-data>
                                    <div class="empty-state">
                                        <v-icon size="64" color="grey-lighten-2">mdi-inbox-outline</v-icon>
                                        <h3 class="empty-title">No student requests found</h3>
                                        <p class="empty-subtitle">When students submit leave requests, they will appear here for your review.</p>
                                    </div>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </v-window-item>

                <!-- My Requests Tab -->
                <v-window-item value="my-requests">
                    <div class="table-container">
                        <div class="table-toolbar">
                            <div class="toolbar-left">
                                <h2 class="table-title">
                                    <v-icon class="mr-2" color="primary">mdi-history</v-icon>
                                    My Leave Requests
                                </h2>
                                <p class="table-subtitle">Manage your personal leave applications</p>
                            </div>
                            <!-- <div class="toolbar-right">
                                <v-btn
                                    class="modern-btn add-btn"
                                    prepend-icon="mdi-plus"
                                    @click="showNewLeaveDialog = true"
                                >
                                    Submit New Request
                                </v-btn>
                            </div> -->
                        </div>

                        <!-- My Requests Data Table -->
                        <div class="modern-table-wrapper">
                            <v-data-table
                                :headers="myRequestHeaders"
                                :items="myLeaveRequests"
                                :items-per-page="10"
                                class="modern-table"
                                hover
                            >
                                <template #bottom="{ page, pageCount, itemsLength }">
                                    <div class="custom-table-footer">
                                        <v-btn
                                            variant="outlined"
                                            size="large"
                                            class="footer-btn"
                                            :disabled="page === 1"
                                            @click="page--"
                                        >
                                            <v-icon size="20">mdi-chevron-left</v-icon>
                                            Previous
                                        </v-btn>
                                        <div class="footer-info">
                                            Page {{ page }} of {{ pageCount }} ({{ itemsLength }} total records)
                                        </div>
                                        <v-btn
                                            variant="outlined"
                                            size="large"
                                            class="footer-btn"
                                            :disabled="page === pageCount"
                                            @click="page++"
                                        >
                                            Next
                                            <v-icon size="20">mdi-chevron-right</v-icon>
                                        </v-btn>
                                    </div>
                                </template>
                                <template #headers>
                                    <tr class="modern-header-row">
                                        <th class="modern-header-cell">
                                            <div class="header-content">Dates</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Duration</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Type</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Status</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Submitted</div>
                                        </th>
                                        <th class="modern-header-cell">
                                            <div class="header-content">Actions</div>
                                        </th>
                                    </tr>
                                </template>
                                <template #item="{ item }">
                                    <tr class="modern-table-row">
                                        <td class="modern-table-cell">
                                            <div class="date-info">
                                                <div class="date-primary">{{ formatDate(item.startDate) }}</div>
                                                <div class="date-secondary">to {{ formatDate(item.endDate) }}</div>
                                            </div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="global-id-badge">{{ calculateDuration(item.startDate, item.endDate) }} days</div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <v-chip color="blue-grey" variant="flat" size="small">
                                                {{ item.type }}
                                            </v-chip>
                                        </td>
                                        <td class="modern-table-cell">
                                            <v-chip :color="getStatusColor(item.status)" variant="flat" size="small">
                                                <v-icon :icon="getStatusIcon(item.status)" size="16" class="mr-1"></v-icon>
                                                {{ item.status }}
                                            </v-chip>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="date-info">
                                                <div class="date-primary">{{ formatDate(item.submittedAt) }}</div>
                                            </div>
                                        </td>
                                        <td class="modern-table-cell">
                                            <div class="action-group">
                                                <v-tooltip text="View Details">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-eye" 
                                                            size="small"
                                                            color="blue"
                                                            class="modern-action-btn view-btn"
                                                            @click="viewMyRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                                
                                                <v-tooltip v-if="item.status === 'Pending'" text="Edit Request">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-pencil" 
                                                            size="small"
                                                            class="modern-action-btn edit-btn"
                                                            @click="editMyRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                                
                                                <v-tooltip text="Delete Request">
                                                    <template v-slot:activator="{ props }">
                                                        <v-btn 
                                                            v-bind="props"
                                                            variant="elevated" 
                                                            icon="mdi-delete" 
                                                            size="small"
                                                            class="modern-action-btn delete-btn"
                                                            @click="deleteRequest(item)"
                                                        ></v-btn>
                                                    </template>
                                                </v-tooltip>
                                            </div>
                                        </td>
                                    </tr>
                                </template>
                                <template #no-data>
                                    <div class="empty-state">
                                        <v-icon size="64" color="grey-lighten-2">mdi-file-document-outline</v-icon>
                                        <h3 class="empty-title">No leave requests found</h3>
                                        <p class="empty-subtitle">Submit your first leave request using the button above.</p>
                                    </div>
                                </template>
                            </v-data-table>
                        </div>
                    </div>
                </v-window-item>
            </v-window>
        </div>

        <!-- Enhanced New/Edit Leave Request Dialog -->
        <v-dialog v-model="showNewLeaveDialog" max-width="900" persistent>
            <v-card elevation="8" class="rounded-lg modern-dialog">
                <div class="dialog-header">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon :color="isEditMode ? 'orange' : 'primary'" size="24">
                                {{ isEditMode ? 'mdi-pencil' : 'mdi-calendar-plus' }}
                            </v-icon>
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title">
                                {{ isLecturerRequest ? (isEditMode ? 'Edit My Leave Request' : 'New Personal Leave Request') : (isEditMode ? 'Edit Student Leave Request' : 'New Student Leave Request') }}
                            </h2>
                            <p class="dialog-subtitle">
                                {{ isLecturerRequest ? 'Submit your personal leave request' : 'Create a leave request for a student' }}
                            </p>
                        </div>
                    </div>
                    <v-btn
                        icon="mdi-close"
                        variant="text"
                        size="small"
                        class="close-btn"
                        @click="closeLeaveDialog"
                    ></v-btn>
                </div>

                <div class="dialog-content">
                    <v-form ref="leaveFormRef" v-model="leaveFormValid" @submit.prevent="submitLeaveRequest">
                        <!-- Student Information Section (only for student requests) -->
                        <div v-if="!isLecturerRequest" class="form-section">
                            <h3 class="section-title">
                                <v-icon class="mr-2" color="primary">mdi-account-school</v-icon>
                                Student Information
                            </h3>
                            
                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Student Name *</label>
                                    <v-text-field
                                        v-model="leaveFormData.studentName"
                                        :rules="[rules.required, rules.studentName]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-account"
                                        placeholder="Enter student's full name"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Student ID *</label>
                                    <v-text-field
                                        v-model="leaveFormData.studentId"
                                        :rules="[rules.required, rules.studentId]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-card-account-details"
                                        placeholder="e.g., e20210001"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Class *</label>
                                    <v-select
                                        v-model="leaveFormData.class"
                                        :items="classOptions"
                                        :rules="[rules.required]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-google-classroom"
                                        placeholder="Select class"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Contact Number *</label>
                                    <v-text-field
                                        v-model="leaveFormData.contactNumber"
                                        :rules="[rules.required, rules.phoneNumber]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-phone"
                                        placeholder="e.g., +855 12 345 678"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Lecturer Information Section (only for lecturer requests) -->
                        <div v-if="isLecturerRequest" class="form-section">
                            <h3 class="section-title">
                                <v-icon class="mr-2" color="primary">mdi-account-tie</v-icon>
                                Personal Information
                            </h3>
                            
                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Full Name</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.lecturerName"
                                        variant="outlined"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-account"
                                        readonly
                                        bg-color="grey-lighten-3"
                                        class="form-field"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Employee ID</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.employeeId"
                                        variant="outlined"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-badge-account"
                                        readonly
                                        bg-color="grey-lighten-3"
                                        class="form-field"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="4">
                                    <label class="form-label">Department</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.department"
                                        variant="outlined"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-domain"
                                        readonly
                                        bg-color="grey-lighten-3"
                                        class="form-field"
                                    />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <label class="form-label">Contact Number *</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.contactNumber"
                                        :rules="[rules.required, rules.phoneNumber]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-phone"
                                        placeholder="e.g., +855 12 345 678"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="4">
                                    <label class="form-label">Email Address</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.email"
                                        :rules="[rules.email]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-email"
                                        placeholder="lecturer@university.edu"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Emergency Contact Name</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.emergencyContact"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-account-alert"
                                        placeholder="Emergency contact person"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Emergency Contact Phone</label>
                                    <v-text-field
                                        v-model="lecturerLeaveFormData.emergencyPhone"
                                        :rules="[rules.phoneNumber]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-phone-alert"
                                        placeholder="e.g., +855 12 345 678"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>
                        </div>

                        <v-divider class="my-6"></v-divider>

                        <!-- Leave Request Details Section -->
                        <div class="form-section">
                            <h3 class="section-title">
                                <v-icon class="mr-2" color="primary">mdi-calendar-clock</v-icon>
                                Leave Request Details
                            </h3>
                            
                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Start Date *</label>
                                    <v-text-field
                                        v-model="leaveFormData.startDate"
                                        type="date"
                                        :rules="[rules.required, rules.startDateNotPast]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-calendar-start"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">End Date *</label>
                                    <v-text-field
                                        v-model="leaveFormData.endDate"
                                        type="date"
                                        :rules="[rules.required, rules.endDateAfterStart]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-calendar-end"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Leave Type *</label>
                                    <v-select
                                        v-model="leaveFormData.type"
                                        :items="leaveTypes"
                                        :rules="[rules.required]"
                                        variant="outlined"
                                        density="comfortable"
                                        color="primary"
                                        prepend-inner-icon="mdi-format-list-bulleted-type"
                                        placeholder="Select leave type"
                                        class="form-field"
                                        :loading="formLoading"
                                    />
                                </v-col>
                                <v-col cols="12" md="6">
                                    <label class="form-label">Duration</label>
                                    <v-text-field
                                        :model-value="calculateDurationText"
                                        variant="outlined"
                                        density="comfortable"
                                        prepend-inner-icon="mdi-calendar-range"
                                        readonly
                                        class="form-field"
                                        placeholder="Will be calculated automatically"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <label class="form-label">Detailed Reason *</label>
                                    <v-textarea
                                        v-model="leaveFormData.reason"
                                        :rules="[rules.required, rules.minLength(10)]"
                                        variant="outlined"
                                        rows="4"
                                        color="primary"
                                        prepend-inner-icon="mdi-text-box-outline"
                                        placeholder="Please provide a comprehensive explanation for your leave request. Include any relevant details that support your application..."
                                        class="form-field"
                                        counter="500"
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="12">
                                    <label class="form-label">Supporting Documents</label>
                                    <v-file-input
                                        v-model="leaveFormData.attachment"
                                        variant="outlined"
                                        density="comfortable"
                                        prepend-icon="mdi-paperclip"
                                        accept=".pdf,.doc,.docx,.jpg,.png,.jpeg"
                                        hint="Attach medical certificates, conference invitations, etc. (PDF, DOC, or Image files - Max 5MB)"
                                        persistent-hint
                                        color="primary"
                                        class="form-field"
                                        show-size
                                        :loading="formLoading"
                                    />
                                </v-col>
                            </v-row>
                        </div>

                        <!-- Request Summary -->
                        <v-card v-if="leaveFormData.startDate && leaveFormData.endDate" class="info-box mt-6 mb-4">
                            <v-card-text class="py-4">
                                <h4 class="text-subtitle-1 font-weight-bold mb-3">
                                    <v-icon class="mr-2" color="primary">mdi-information</v-icon>
                                    Request Summary
                                </h4>
                                <div class="d-flex flex-wrap gap-4">
                                    <v-chip color="primary" variant="outlined" prepend-icon="mdi-calendar">
                                        {{ formatDate(leaveFormData.startDate) }} - {{ formatDate(leaveFormData.endDate) }}
                                    </v-chip>
                                    <v-chip v-if="leaveFormData.type" color="success" variant="outlined" prepend-icon="mdi-tag">
                                        {{ leaveFormData.type }}
                                    </v-chip>
                                    <v-chip color="info" variant="outlined" prepend-icon="mdi-clock">
                                        {{ calculateDurationText }}
                                    </v-chip>
                                </div>
                            </v-card-text>
                        </v-card>
                    </v-form>
                </div>

                <v-divider></v-divider>
                <div class="dialog-actions">
                    <v-btn
                        variant="outlined"
                        size="large"
                        @click="closeLeaveDialog"
                        class="cancel-btn action-btn"
                        :disabled="formLoading"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="primary"
                        size="large"
                        @click="submitLeaveRequest"
                        :disabled="!leaveFormValid || formLoading"
                        :loading="formLoading"
                        class="submit-btn action-btn"
                        type="submit"
                    >
                        <v-icon start>{{ isEditMode ? 'mdi-content-save' : 'mdi-send' }}</v-icon>
                        {{ isEditMode ? 'Update Request' : 'Submit Request' }}
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>

        <!-- View Student Request Dialog -->
        <v-dialog v-model="viewStudentDialog" max-width="750">
            <v-card v-if="selectedStudentRequest" elevation="8" class="rounded-lg">
                <v-card-title class="pa-5 bg-gradient-indigo">
                    <div class="d-flex justify-space-between align-center">
                        <div class="d-flex align-center">
                            <v-icon color="white" size="28" class="mr-3">mdi-file-document-outline</v-icon>
                            <span class="text-h6 font-weight-bold text-white">Student Leave Request Details</span>
                        </div>
                        <v-btn icon="mdi-close" variant="text" color="white" @click="viewStudentDialog = false"></v-btn>
                    </div>
                </v-card-title>
                <v-card-text class="pa-7">
                    <v-row>
                        <v-col cols="12">
                            <div class="student-info-card pa-4 mb-5">
                                <div class="d-flex align-center">
                                    <v-avatar color="indigo" size="72" class="mr-4 elevation-3">
                                        <span class="text-h4 text-white font-weight-bold">{{
                                            selectedStudentRequest.student.charAt(0) }}</span>
                                    </v-avatar>
                                    <div>
                                        <div class="text-h5 font-weight-bold text-grey-darken-3 mb-1">{{
                                            selectedStudentRequest.student }}</div>
                                        <div class="text-body-1 text-grey-darken-1 mb-2">
                                            <v-icon size="16" class="mr-1">mdi-identifier</v-icon>{{
                                                selectedStudentRequest.studentId }}
                                        </div>
                                        <v-chip size="small" variant="flat" color="indigo-lighten-4"
                                            class="font-weight-medium text-indigo-darken-2">
                                            <v-icon start size="14">mdi-book-open-variant</v-icon>
                                            {{ selectedStudentRequest.class }}
                                        </v-chip>
                                    </div>
                                </div>
                            </div>
                        </v-col>
                    </v-row>

                    <v-divider class="my-4"></v-divider>

                    <v-row>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Leave Type</div>
                                <div class="font-weight-bold">{{ selectedStudentRequest.type }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Status</div>
                                <v-chip :color="getStatusColor(selectedStudentRequest.status)" text-color="white" variant="flat" size="small">
                                    {{ selectedStudentRequest.status }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Start Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedStudentRequest.startDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">End Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedStudentRequest.endDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Duration</div>
                                <div class="font-weight-bold">{{ calculateDuration(selectedStudentRequest.startDate,
                                    selectedStudentRequest.endDate) }} days</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3">
                                <div class="text-caption text-grey mb-2">Reason</div>
                                <div>{{ selectedStudentRequest.reason }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pa-4" v-if="selectedStudentRequest.status === 'Pending'">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" @click="viewStudentDialog = false">Close</v-btn>
                    <v-btn color="error" variant="outlined" prepend-icon="mdi-close"
                        @click="rejectRequest(selectedStudentRequest)">
                        Reject
                    </v-btn>
                    <v-btn color="success" variant="flat" prepend-icon="mdi-check"
                        @click="approveRequest(selectedStudentRequest)">
                        Approve
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- View My Request Dialog -->
        <v-dialog v-model="viewMyRequestDialog" max-width="700">
            <v-card v-if="selectedMyRequest">
                <v-card-title class="pa-4 bg-grey-lighten-4">
                    <div class="d-flex justify-space-between align-center">
                        <span class="text-h6 font-weight-bold">My Leave Request Details</span>
                        <v-btn icon="mdi-close" variant="text" @click="viewMyRequestDialog = false"></v-btn>
                    </div>
                </v-card-title>
                <v-card-text class="pa-6">
                    <v-row>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Leave Type</div>
                                <div class="font-weight-bold">{{ selectedMyRequest.type }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Status</div>
                                <v-chip :color="getStatusColor(selectedMyRequest.status)" text-color="white" variant="flat" size="small">
                                    {{ selectedMyRequest.status }}
                                </v-chip>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Start Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.startDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="6">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">End Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.endDate) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Duration</div>
                                <div class="font-weight-bold">{{ calculateDuration(selectedMyRequest.startDate,
                                    selectedMyRequest.endDate) }} days</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3 mb-3">
                                <div class="text-caption text-grey mb-1">Submitted Date</div>
                                <div class="font-weight-bold">{{ formatDate(selectedMyRequest.submittedAt) }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12">
                            <div class="info-box pa-3">
                                <div class="text-caption text-grey mb-2">Reason</div>
                                <div>{{ selectedMyRequest.reason }}</div>
                            </div>
                        </v-col>
                        <v-col cols="12" v-if="selectedMyRequest.adminComment">
                            <div class="info-box pa-3 bg-blue-lighten-5">
                                <div class="text-caption text-grey mb-2">Admin Comment</div>
                                <div>{{ selectedMyRequest.adminComment }}</div>
                            </div>
                        </v-col>
                    </v-row>
                </v-card-text>
                <v-card-actions class="pa-4">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" @click="viewMyRequestDialog = false">Close</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Reject Reason Dialog -->
        <v-dialog v-model="rejectDialog" max-width="550">
            <v-card elevation="8" class="rounded-lg">
                <v-card-title class="pa-5 bg-gradient-red">
                    <div class="d-flex align-center">
                        <v-icon color="white" size="28" class="mr-3">mdi-close-circle-outline</v-icon>
                        <span class="text-h6 font-weight-bold text-white">Reject Leave Request</span>
                    </div>
                </v-card-title>
                <v-card-text class="pa-7">
                    <p class="text-body-1 text-grey-darken-1 mb-4">Please provide a detailed explanation for
                        rejecting
                        this request. This will help the student understand your decision.</p>
                    <v-textarea v-model="rejectReason" label="Reason for Rejection*" variant="outlined" rows="5"
                        placeholder="Enter a clear and constructive reason for declining this leave request..."
                        :rules="[rules.required]" color="error" bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-text-box-outline" />
                </v-card-text>
                <v-divider></v-divider>
                <v-card-actions class="pa-5">
                    <v-spacer></v-spacer>
                    <v-btn variant="outlined" size="large" @click="rejectDialog = false" class="text-none px-6">
                        Cancel
                    </v-btn>
                    <v-btn color="error" variant="flat" size="large" @click="confirmReject"
                        class="text-none px-8 font-weight-bold" prepend-icon="mdi-close-thick">
                        Confirm Rejection
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Enhanced Delete Confirmation Dialog -->
        <v-dialog v-model="deleteDialog" max-width="580" persistent>
            <v-card elevation="12" class="rounded-lg modern-dialog">
                <div class="dialog-header bg-gradient-red">
                    <div class="header-content">
                        <div class="header-icon">
                            <v-icon color="white" size="28">mdi-delete-alert</v-icon>
                        </div>
                        <div class="header-text">
                            <h2 class="dialog-title text-white">Delete Leave Request</h2>
                            <p class="dialog-subtitle text-white opacity-90">This action cannot be undone</p>
                        </div>
                    </div>
                </div>
                
                <div class="dialog-content" v-if="requestToDelete">
                    <div class="warning-box mb-4">
                        <v-icon color="warning" size="24" class="mr-3">mdi-alert-triangle</v-icon>
                        <div>
                            <div class="font-weight-bold text-h6 mb-1">Warning: Permanent Deletion</div>
                            <div class="text-body-2 text-grey-darken-1">
                                You are about to permanently delete this leave request. This action cannot be reversed.
                            </div>
                        </div>
                    </div>
                    
                    <div class="request-details-box pa-4">
                        <h4 class="text-subtitle-1 font-weight-bold mb-3 text-red-darken-2">
                            <v-icon class="mr-2">mdi-file-document</v-icon>
                            Request Details
                        </h4>
                        <div class="d-flex flex-column gap-2">
                            <div class="d-flex align-center">
                                <strong class="mr-2">Student:</strong> {{ requestToDelete.student || 'Personal Request' }}
                            </div>
                            <div class="d-flex align-center">
                                <strong class="mr-2">Type:</strong> {{ requestToDelete.type }}
                            </div>
                            <div class="d-flex align-center">
                                <strong class="mr-2">Dates:</strong> {{ formatDate(requestToDelete.startDate) }} - {{ formatDate(requestToDelete.endDate) }}
                            </div>
                            <div class="d-flex align-center">
                                <strong class="mr-2">Status:</strong> 
                                <v-chip :color="getStatusColor(requestToDelete.status)" size="small" class="ml-1">
                                    {{ requestToDelete.status }}
                                </v-chip>
                            </div>
                        </div>
                    </div>
                    
                    <v-textarea 
                        v-model="deleteReason" 
                        label="Reason for deletion (optional)" 
                        variant="outlined" 
                        rows="3"
                        placeholder="Optional: Provide a reason for this deletion for audit purposes..."
                        class="mt-4"
                        bg-color="grey-lighten-5"
                        prepend-inner-icon="mdi-note-text-outline"
                    />
                </div>
                
                <v-divider></v-divider>
                <div class="dialog-actions">
                    <v-btn
                        variant="outlined"
                        size="large"
                        @click="deleteDialog = false; requestToDelete = null; deleteReason = ''"
                        class="cancel-btn action-btn"
                        prepend-icon="mdi-close"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="error"
                        size="large"
                        @click="confirmDelete"
                        class="delete-confirm-btn action-btn"
                        variant="flat"
                        prepend-icon="mdi-delete"
                    >
                        Delete Permanently
                    </v-btn>
                </div>
            </v-card>
        </v-dialog>

        <!-- Success Snackbar -->
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="3000">
            {{ snackbarMessage }}
            <template v-slot:actions>
                <v-btn variant="text" @click="snackbar = false">Close</v-btn>
            </template>
        </v-snackbar>
    </div>
</template>

<script setup>
definePageMeta({
    // middleware: ['auth', 'role-lecturer'],
    layout: 'lecturer'
})

// State
const activeTab = ref('student-requests')
const showNewLeaveDialog = ref(false)
const viewStudentDialog = ref(false)
const viewMyRequestDialog = ref(false)
const rejectDialog = ref(false)
const deleteDialog = ref(false)
const leaveFormValid = ref(false)
const selectedStudentRequest = ref(null)
const selectedMyRequest = ref(null)
const rejectReason = ref('')
const requestToReject = ref(null)
const requestToDelete = ref(null)
const deleteReason = ref('')
const isEditMode = ref(false)
const formLoading = ref(false)
const leaveFormRef = ref(null)
const isLecturerRequest = ref(false) // Track if form is for lecturer or student request

// Filters
const studentSearchQuery = ref('')
const studentStatusFilter = ref('All')
const studentClassFilter = ref('All Classes')

// Snackbar
const snackbar = ref(false)
const snackbarMessage = ref('')
const snackbarColor = ref('success')

// Form Data
const leaveFormData = reactive({
    id: null,
    studentName: '',
    studentId: '',
    class: '',
    contactNumber: '',
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    attachment: null,
    status: 'Pending'
})

// Lecturer Personal Leave Form Data
const lecturerLeaveFormData = reactive({
    id: null,
    lecturerName: 'Dr. John Smith', // This would come from auth context
    employeeId: 'LEC001', // This would come from auth context
    department: 'Computer Science', // This would come from auth context
    contactNumber: '',
    email: '',
    startDate: '',
    endDate: '',
    type: '',
    reason: '',
    attachment: null,
    emergencyContact: '',
    emergencyPhone: '',
    status: 'Pending'
})

// Options
const leaveTypes = ['Sick Leave', 'Personal Leave', 'Emergency Leave', 'Medical Leave', 'Conference', 'Research', 'Vacation', 'Family Emergency']
const statusFilterOptions = ['All', 'Pending', 'Approved', 'Rejected']
const classFilterOptions = ['All Classes', 'CS201', 'CS303', 'CS405', 'CS407', 'CS501']
const classOptions = ['CS201', 'CS303', 'CS405', 'CS407', 'CS501', 'CS601', 'CS603', 'CS701']

// Comprehensive Validation Rules
const rules = {
    required: value => !!value || 'This field is required',
    
    studentId: value => {
        if (!value) return 'Student ID is required'
        const pattern = /^e\d{8}$/
        return pattern.test(value) || 'Student ID must be in format: e20210001'
    },
    
    studentName: value => {
        if (!value) return 'Student name is required'
        if (value.length < 2) return 'Student name must be at least 2 characters'
        if (value.length > 50) return 'Student name must not exceed 50 characters'
        const pattern = /^[a-zA-Z\s]+$/
        return pattern.test(value) || 'Student name can only contain letters and spaces'
    },
    
    phoneNumber: value => {
        if (!value) return 'Contact number is required'
        const pattern = /^(\+855|0)[1-9]\d{7,8}$/
        return pattern.test(value.replace(/\s/g, '')) || 'Please enter a valid Cambodian phone number'
    },
    
    startDateNotPast: value => {
        if (!value) return true
        const today = new Date()
        const selectedDate = new Date(value)
        today.setHours(0, 0, 0, 0)
        selectedDate.setHours(0, 0, 0, 0)
        return selectedDate >= today || 'Start date cannot be in the past'
    },
    
    endDateAfterStart: value => {
        if (!leaveFormData.startDate || !value) return true
        const startDate = new Date(leaveFormData.startDate)
        const endDate = new Date(value)
        return endDate >= startDate || 'End date must be after or equal to start date'
    },
    
    minLength: (min) => value => {
        if (!value) return true
        return value.length >= min || `Must be at least ${min} characters`
    },
    
    maxLength: (max) => value => {
        if (!value) return true
        return value.length <= max || `Must not exceed ${max} characters`
    },
    
    email: value => {
        if (!value) return true
        const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        return pattern.test(value) || 'Please enter a valid email address'
    }
}

// Student Leave Requests (Mock Data)
const studentLeaveRequests = ref([
    {
        id: 1,
        student: 'CHAN Sok',
        studentId: 'e20210001',
        class: 'CS201',
        startDate: '2025-02-15',
        endDate: '2025-02-17',
        type: 'Sick Leave',
        reason: 'I have been diagnosed with flu and need to rest for recovery.',
        status: 'Pending',
        submittedAt: '2025-02-10'
    },
    {
        id: 2,
        student: 'LIM Dara',
        studentId: 'e20210002',
        class: 'CS303',
        startDate: '2025-02-20',
        endDate: '2025-02-20',
        type: 'Personal Leave',
        reason: 'Family commitment that requires my presence.',
        status: 'Pending',
        submittedAt: '2025-02-12'
    },
    {
        id: 3,
        student: 'SREY Pov',
        studentId: 'e20210003',
        class: 'CS201',
        startDate: '2025-01-10',
        endDate: '2025-01-12',
        type: 'Medical Leave',
        reason: 'Medical appointment and checkup.',
        status: 'Approved',
        submittedAt: '2025-01-05'
    },
    {
        id: 4,
        student: 'KIM Sreynich',
        studentId: 'e20210004',
        class: 'CS405',
        startDate: '2025-01-20',
        endDate: '2025-01-21',
        type: 'Emergency Leave',
        reason: 'Family emergency.',
        status: 'Rejected',
        rejectionReason: 'Insufficient documentation provided.',
        submittedAt: '2025-01-18'
    },
    {
        id: 5,
        student: 'PHON Ratanak',
        studentId: 'e20210005',
        class: 'CS407',
        startDate: '2025-02-25',
        endDate: '2025-02-26',
        type: 'Sick Leave',
        reason: 'Fever and headache.',
        status: 'Pending',
        submittedAt: '2025-02-14'
    }
])

// My Leave Requests (Mock Data)
const myLeaveRequests = ref([
    {
        id: 1,
        startDate: '2025-03-15',
        endDate: '2025-03-17',
        type: 'Conference',
        reason: 'Attending International Computer Science Conference in Bangkok.',
        status: 'Approved',
        submittedAt: '2025-02-20',
        adminComment: 'Approved. Please submit conference report upon return.'
    },
    {
        id: 2,
        startDate: '2025-04-10',
        endDate: '2025-04-10',
        type: 'Personal Leave',
        reason: 'Personal matters to attend to.',
        status: 'Pending',
        submittedAt: '2025-02-22'
    },
    {
        id: 3,
        startDate: '2025-01-05',
        endDate: '2025-01-07',
        type: 'Sick Leave',
        reason: 'Medical treatment required.',
        status: 'Approved',
        submittedAt: '2024-12-28',
        adminComment: 'Get well soon.'
    },
    {
        id: 4,
        startDate: '2024-12-20',
        endDate: '2024-12-21',
        type: 'Research',
        reason: 'Field research for ongoing project.',
        status: 'Rejected',
        submittedAt: '2024-12-10',
        adminComment: 'Please reschedule as this conflicts with final exam period.'
    }
])

// Table Headers
const studentRequestHeaders = [
    { title: 'Student', key: 'student' },
    { title: 'Class', key: 'class' },
    { title: 'Type', key: 'type' },
    { title: 'Dates', key: 'dates' },
    { title: 'Status', key: 'status' },
    { title: 'Approval', key: 'approval', sortable: false },
    { title: 'Actions', key: 'actions', sortable: false }
]

const myRequestHeaders = [
    { title: 'Dates', key: 'dates' },
    { title: 'Duration', key: 'duration' },
    { title: 'Type', key: 'type' },
    { title: 'Status', key: 'status' },
    { title: 'Submitted', key: 'submittedAt' },
    { title: 'Actions', key: 'actions', sortable: false }
]

// Computed
const filteredStudentRequests = computed(() => {
    let result = studentLeaveRequests.value

    // Filter by search
    if (studentSearchQuery.value) {
        const query = studentSearchQuery.value.toLowerCase()
        result = result.filter(r =>
            r.student.toLowerCase().includes(query) ||
            r.studentId.toLowerCase().includes(query)
        )
    }

    // Filter by status
    if (studentStatusFilter.value !== 'All') {
        result = result.filter(r => r.status === studentStatusFilter.value)
    }

    // Filter by class
    if (studentClassFilter.value !== 'All Classes') {
        result = result.filter(r => r.class === studentClassFilter.value)
    }

    return result
})

const pendingStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Pending').length
)

const approvedStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Approved').length
)

const rejectedStudentRequests = computed(() =>
    studentLeaveRequests.value.filter(r => r.status === 'Rejected').length
)

const approvedMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Approved').length
)

const pendingMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Pending').length
)

const rejectedMyRequests = computed(() =>
    myLeaveRequests.value.filter(r => r.status === 'Rejected').length
)

// Enhanced computed properties for form functionality
const calculateDurationText = computed(() => {
    const formData = isLecturerRequest.value ? lecturerLeaveFormData : leaveFormData
    if (!formData.startDate || !formData.endDate) return 'Select dates'
    const duration = calculateDuration(formData.startDate, formData.endDate)
    return duration === 1 ? '1 day' : `${duration} days`
})

const currentFormData = computed(() => {
    return isLecturerRequest.value ? lecturerLeaveFormData : leaveFormData
})

const isFormValid = computed(() => {
    const formData = currentFormData.value
    if (isLecturerRequest.value) {
        return leaveFormValid.value && 
               formData.lecturerName && 
               formData.employeeId && 
               formData.contactNumber && 
               formData.startDate && 
               formData.endDate && 
               formData.type && 
               formData.reason
    } else {
        return leaveFormValid.value && 
               formData.studentName && 
               formData.studentId && 
               formData.class && 
               formData.contactNumber && 
               formData.startDate && 
               formData.endDate && 
               formData.type && 
               formData.reason
    }
})

const formTitle = computed(() => {
    return isEditMode.value ? 'Edit Leave Request' : 'New Leave Request'
})

const submitButtonText = computed(() => {
    if (formLoading.value) return isEditMode.value ? 'Updating...' : 'Submitting...'
    return isEditMode.value ? 'Update Request' : 'Submit Request'
})

// Methods
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}

const formatTime = (dateString) => {
    if (!dateString) return ''
    try {
        const date = new Date(dateString)
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit'
        })
    } catch (error) {
        return ''
    }
}

const calculateDuration = (startDate, endDate) => {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1
    return diffDays
}

const getStatusColor = (status) => {
    switch (status) {
        case 'Approved': return 'light-green'
        case 'Rejected': return 'red-lighten-2'
        case 'Pending': return 'orange-lighten-2'
        default: return 'grey'
    }
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'Approved': return 'mdi-check-circle'
        case 'Rejected': return 'mdi-close-circle'
        case 'Pending': return 'mdi-clock-outline'
        default: return 'mdi-help-circle'
    }
}

const getTypeColor = (type) => {
    switch (type) {
        case 'Sick Leave': return 'light-blue'
        case 'Personal Leave': return 'light-blue'
        case 'Emergency Leave': return 'light-blue'
        case 'Medical Leave': return 'light-blue'
        case 'Conference': return 'light-blue'
        case 'Research': return 'light-blue'
        case 'Vacation': return 'light-blue'
        case 'Family Emergency': return 'light-blue'
        default: return 'light-blue'
    }
}

const resetStudentFilters = () => {
    studentSearchQuery.value = ''
    studentStatusFilter.value = 'All'
    studentClassFilter.value = 'All Classes'
}

const viewStudentRequest = (request) => {
    selectedStudentRequest.value = request
    viewStudentDialog.value = true
}

const editStudentRequest = (request) => {
    isEditMode.value = true
    
    // Populate form with existing data
    Object.assign(leaveFormData, {
        id: request.id,
        studentName: request.student || '',
        studentId: request.studentId || '',
        class: request.class || '',
        contactNumber: request.contactNumber || '',
        startDate: request.startDate || '',
        endDate: request.endDate || '',
        type: request.type || '',
        reason: request.reason || '',
        attachment: request.attachment || null,
        status: request.status || 'Pending'
    })
    
    showNewLeaveDialog.value = true
}

const viewMyRequest = (request) => {
    selectedMyRequest.value = request
    viewMyRequestDialog.value = true
}

const approveRequest = (request) => {
    const index = studentLeaveRequests.value.findIndex(r => r.id === request.id)
    if (index !== -1) {
        studentLeaveRequests.value[index].status = 'Approved'
        showSnackbar('Leave request approved successfully', 'success')
        viewStudentDialog.value = false
    }
}

const rejectRequest = (request) => {
    requestToReject.value = request
    rejectDialog.value = true
    viewStudentDialog.value = false
}

const confirmReject = () => {
    if (requestToReject.value && rejectReason.value) {
        const index = studentLeaveRequests.value.findIndex(r => r.id === requestToReject.value.id)
        if (index !== -1) {
            studentLeaveRequests.value[index].status = 'Rejected'
            studentLeaveRequests.value[index].rejectionReason = rejectReason.value
            showSnackbar('Leave request rejected', 'error')
        }
        rejectDialog.value = false
        rejectReason.value = ''
        requestToReject.value = null
    }
}

const submitLeaveRequest = async () => {
    if (!leaveFormValid.value || !isFormValid.value) {
        showSnackbar('Please fill in all required fields correctly', 'warning')
        return
    }
    
    formLoading.value = true
    
    try {
        // Validate form data before submission
        const validationErrors = validateFormData()
        if (validationErrors.length > 0) {
            showSnackbar(validationErrors[0], 'error')
            return
        }
        
        // Simulate API call with more realistic delay
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        if (isEditMode.value && leaveFormData.id) {
            // Update existing request
            const index = studentLeaveRequests.value.findIndex(r => r.id === leaveFormData.id)
            if (index !== -1) {
                const updatedRequest = {
                    ...studentLeaveRequests.value[index],
                    student: leaveFormData.studentName,
                    studentId: leaveFormData.studentId,
                    class: leaveFormData.class,
                    contactNumber: leaveFormData.contactNumber,
                    startDate: leaveFormData.startDate,
                    endDate: leaveFormData.endDate,
                    type: leaveFormData.type,
                    reason: leaveFormData.reason,
                    attachment: leaveFormData.attachment,
                    updatedAt: new Date().toISOString().split('T')[0]
                }
                studentLeaveRequests.value[index] = updatedRequest
                showSnackbar('Leave request updated successfully', 'success')
            } else {
                showSnackbar('Request not found for update', 'error')
                return
            }
        } else {
            // Create new request with enhanced data
            const newRequest = {
                id: Math.max(...studentLeaveRequests.value.map(r => r.id || 0), 0) + 1,
                student: leaveFormData.studentName,
                studentId: leaveFormData.studentId,
                class: leaveFormData.class,
                contactNumber: leaveFormData.contactNumber,
                startDate: leaveFormData.startDate,
                endDate: leaveFormData.endDate,
                type: leaveFormData.type,
                reason: leaveFormData.reason,
                attachment: leaveFormData.attachment,
                status: 'Pending',
                submittedAt: new Date().toISOString().split('T')[0],
                duration: calculateDuration(leaveFormData.startDate, leaveFormData.endDate)
            }
            
            // Add to the beginning of the array for better UX
            studentLeaveRequests.value.unshift(newRequest)
            showSnackbar(`Leave request submitted successfully for ${leaveFormData.studentName}`, 'success')
        }
        
        closeLeaveDialog()
    } catch (error) {
        console.error('Error submitting leave request:', error)
        showSnackbar('Failed to submit request. Please try again.', 'error')
    } finally {
        formLoading.value = false
    }
}

// Form validation helper
const validateFormData = () => {
    const errors = []
    
    if (!leaveFormData.studentName?.trim()) errors.push('Student name is required')
    if (!leaveFormData.studentId?.trim()) errors.push('Student ID is required')
    if (!leaveFormData.class) errors.push('Class is required')
    if (!leaveFormData.contactNumber?.trim()) errors.push('Contact number is required')
    if (!leaveFormData.startDate) errors.push('Start date is required')
    if (!leaveFormData.endDate) errors.push('End date is required')
    if (!leaveFormData.type) errors.push('Leave type is required')
    if (!leaveFormData.reason?.trim()) errors.push('Reason is required')
    
    // Validate date logic
    if (leaveFormData.startDate && leaveFormData.endDate) {
        const startDate = new Date(leaveFormData.startDate)
        const endDate = new Date(leaveFormData.endDate)
        if (endDate < startDate) {
            errors.push('End date must be after start date')
        }
    }
    
    return errors
}

const closeLeaveDialog = () => {
    // Confirm close if form has data and is not submitted
    const formData = isLecturerRequest.value ? lecturerLeaveFormData : leaveFormData
    const hasFormData = Object.values(formData).some(value => 
        value !== null && value !== '' && value !== 'Pending'
    )
    
    if (hasFormData && !formLoading.value) {
        const confirmClose = confirm('You have unsaved changes. Are you sure you want to close?')
        if (!confirmClose) return
    }
    
    showNewLeaveDialog.value = false
    isEditMode.value = false
    isLecturerRequest.value = false
    formLoading.value = false
    
    // Enhanced form reset
    Object.assign(leaveFormData, {
        id: null,
        studentName: '',
        studentId: '',
        class: '',
        contactNumber: '',
        startDate: '',
        endDate: '',
        type: '',
        reason: '',
        attachment: null,
        status: 'Pending'
    })
    
    Object.assign(lecturerLeaveFormData, {
        id: null,
        lecturerName: 'Dr. John Smith',
        employeeId: 'LEC001',
        department: 'Computer Science',
        contactNumber: '',
        email: '',
        startDate: '',
        endDate: '',
        type: '',
        reason: '',
        attachment: null,
        emergencyContact: '',
        emergencyPhone: '',
        status: 'Pending'
    })
    
    // Reset form validation with delay to ensure proper cleanup
    nextTick(() => {
        if (leaveFormRef.value) {
            leaveFormRef.value.resetValidation()
        }
        leaveFormValid.value = false
    })
}

// Methods for opening different form types
const openStudentLeaveForm = () => {
    isLecturerRequest.value = false
    isEditMode.value = false
    showNewLeaveDialog.value = true
}

const openLecturerLeaveForm = () => {
    isLecturerRequest.value = true
    isEditMode.value = false
    showNewLeaveDialog.value = true
}

const deleteMyRequest = async (request) => {
    if (!confirm(`Are you sure you want to delete this leave request?\n\nRequest: ${request.type}\nDates: ${formatDate(request.startDate)} to ${formatDate(request.endDate)}\n\nThis action cannot be undone.`)) {
        return
    }
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const index = myLeaveRequests.value.findIndex(r => r.id === request.id)
        if (index !== -1) {
            myLeaveRequests.value.splice(index, 1)
            showSnackbar('Your leave request has been deleted successfully', 'success')
        } else {
            showSnackbar('Request not found', 'error')
        }
    } catch (error) {
        console.error('Error deleting request:', error)
        showSnackbar('Failed to delete request. Please try again.', 'error')
    }
}

const editMyRequest = (request) => {
    // Convert my request to student request format for editing
    isEditMode.value = true
    
    // Note: For editing personal requests, we might need different form handling
    // For now, we'll use the existing form but with personal data
    Object.assign(leaveFormData, {
        id: request.id,
        studentName: 'Personal Request', // Placeholder
        studentId: 'LECTURER', // Placeholder
        class: 'N/A', // Not applicable for lecturers
        contactNumber: '', // Could be lecturer's contact
        startDate: request.startDate || '',
        endDate: request.endDate || '',
        type: request.type || '',
        reason: request.reason || '',
        attachment: request.attachment || null,
        status: request.status || 'Pending'
    })
    
    showNewLeaveDialog.value = true
    showSnackbar('Editing personal leave requests will be implemented in a future update', 'info')
}

const showSnackbar = (message, color) => {
    snackbarMessage.value = message
    snackbarColor.value = color
    snackbar.value = true
}

// Import/Export functions (placeholders for Group Management style compatibility)
const handleImportCSV = async () => {
    try {
        // Placeholder for import functionality
        showSnackbar('Import functionality not yet implemented', 'info')
    } catch (error) {
        showSnackbar('Import failed', 'error')
    }
}

const handleExportExcel = () => {
    try {
        // Placeholder for export functionality
        showSnackbar('Export to Excel functionality not yet implemented', 'info')
    } catch (error) {
        showSnackbar('Export failed', 'error')
    }
}

const handleExportPDF = () => {
    try {
        // Placeholder for export functionality
        showSnackbar('Export to PDF functionality not yet implemented', 'info')
    } catch (error) {
        showSnackbar('Export failed', 'error')
    }
}

const deleteRequest = (request) => {
    requestToDelete.value = request
    deleteDialog.value = true
}

const confirmDelete = async () => {
    if (!requestToDelete.value) return
    
    const request = requestToDelete.value
    const isPersonalRequest = !request.student // My requests don't have student property
    
    try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 800))
        
        if (isPersonalRequest) {
            // Delete from my requests
            const index = myLeaveRequests.value.findIndex(r => r.id === request.id)
            if (index !== -1) {
                myLeaveRequests.value.splice(index, 1)
                showSnackbar('Your leave request has been deleted successfully', 'success')
            } else {
                showSnackbar('Request not found', 'error')
            }
        } else {
            // Delete from student requests
            const index = studentLeaveRequests.value.findIndex(r => r.id === request.id)
            if (index !== -1) {
                studentLeaveRequests.value.splice(index, 1)
                showSnackbar(`Leave request for ${request.student} deleted successfully`, 'success')
            } else {
                showSnackbar('Request not found', 'error')
            }
        }
        
        // Log deletion reason if provided
        if (deleteReason.value) {
            console.log('Delete reason:', deleteReason.value)
        }
        
    } catch (error) {
        console.error('Error deleting request:', error)
        showSnackbar('Failed to delete request. Please try again.', 'error')
    } finally {
        // Reset dialog state
        deleteDialog.value = false
        requestToDelete.value = null
        deleteReason.value = ''
    }
}
</script>

<style scoped>
.leave-management-page {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    min-height: 100vh;
    padding: 0;
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
    padding: 24px 32px;
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 32px;
}

.title-section {
    flex: 1;
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

.stats-cards {
    display: flex;
    gap: 16px;
}

.stat-card {
    background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    padding: 16px 20px;
    min-width: 100px;
    text-align: center;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
    transition: all 0.2s ease;
}

.stat-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-number {
    font-size: 24px;
    font-weight: 700;
    color: #1e293b;
    line-height: 1;
    margin-bottom: 4px;
}

.stat-label {
    font-size: 12px;
    font-weight: 500;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.05em;
}

.action-section {
    display: flex;
    gap: 12px;
    align-items: center;
}

.modern-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 20px;
    transition: all 0.2s ease;
    border: 1px solid #e2e8f0;
    background: white !important;
    color: #1e293b !important;
}

.modern-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.modern-btn .v-icon {
    color: #1e293b !important;
}

.add-btn {
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%) !important;
    border: none !important;
    color: white !important;
}

.add-btn .v-icon {
    color: white !important;
}

.modern-menu {
    border-radius: 12px;
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    border: 1px solid #e2e8f0;
}

.menu-item {
    padding: 12px 16px;
    border-radius: 8px;
    margin: 4px;
    transition: all 0.2s ease;
}

.menu-item:hover {
    background: #f8fafc;
}

/* Modern Tab Section */
.modern-tab-section {
    background: white;
    border-bottom: 1px solid #e2e8f0;
}

.tab-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 32px;
}

.modern-tabs {
    background: transparent;
}

.modern-tab {
    text-transform: none;
    font-weight: 500;
    min-height: 48px;
}

/* Modern Table Section */
.modern-table-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.table-container {
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.table-toolbar {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 24px 24px 16px;
    border-bottom: 1px solid #f1f5f9;
}

.toolbar-left {
    flex: 1;
}

.table-title {
    font-size: 20px;
    font-weight: 600;
    color: #1e293b;
    margin: 0 0 4px 0;
    display: flex;
    align-items: center;
}

.table-subtitle {
    font-size: 14px;
    color: #64748b;
    margin: 0;
}

.toolbar-right {
    display: flex;
    gap: 12px;
    align-items: center;
}

.search-container {
    min-width: 300px;
}

.search-input :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.sort-select {
    min-width: 140px;
}

.sort-select :deep(.v-field) {
    border-radius: 12px;
}

.filter-btn {
    height: 40px;
    width: 40px;
    border-radius: 12px;
}

/* Modern Table Styles */
.modern-table-wrapper {
    position: relative;
    overflow: hidden;
}

.modern-table {
    width: 100%;
    background-color: white;
}

.modern-header-cell {
    padding: 20px 16px;
    border: none;
    position: relative;
    text-align: left !important;
}

.header-content {
    display: flex;
    align-items: center;
    color: #45474b !important;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-left: 4px;
}

.modern-table-row {
    transition: all 0.2s ease;
    border-bottom: 1px solid #f1f5f9;
}

.modern-table-row:hover {
    background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%);
    transform: scale(1.001);
}

.modern-table-cell {
    padding: 16px;
    border: none;
    vertical-align: middle;
    text-align: left !important;
}

.group-info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.group-avatar {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
    color: #1d4ed8;
    border-radius: 10px;
}

.group-details {
    flex: 1;
}

.group-name {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.group-meta {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.global-id-badge {
    display: inline-flex;
    align-items: center;
    padding: 6px 12px;
    background: #f1f5f9;
    color: #1e293b;
    font-weight: 600;
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    border-radius: 8px;
}

.date-info {
    text-align: left;
}

.date-primary {
    font-weight: 500;
    color: #1e293b;
    font-size: 14px;
    line-height: 1.2;
}

.date-secondary {
    font-size: 12px;
    color: #64748b;
    margin-top: 2px;
}

.action-group {
    display: flex;
    gap: 4px;
    justify-content: flex-start;
}

.approval-actions {
    display: flex;
    gap: 6px;
    justify-content: center;
    align-items: center;
    min-width: 120px;
}

.approval-actions .modern-action-btn {
    width: 38px !important;
    height: 38px !important;
}

.modern-action-btn {
    width: 42px !important;
    height: 42px !important;
    border-radius: 12px !important;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 40px !important;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08) !important;
    border: 1px solid #f1f5f9 !important;
}

.modern-action-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 3px 8px rgba(0, 0, 0, 0.12) !important;
}

.edit-btn {
    background: white !important;
    color: #f59e0b !important;
}

.edit-btn:hover {
    background: #fffbeb !important;
    border-color: #fde68a !important;
}

.delete-btn {
    background: white !important;
    color: #ef4444 !important;
}

/* Enhanced action button styles */
.view-btn {
    background: white !important;
    color: #2563eb !important;
}

.view-btn:hover {
    background: #eff6ff !important;
    border-color: #bfdbfe !important;
}

.approve-btn {
    background: white !important;
    color: #16a34a !important;
    border: 2px solid #bbf7d0 !important;
}

.approve-btn:hover {
    background: #f0fdf4 !important;
    border-color: #16a34a !important;
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(22, 163, 74, 0.25) !important;
}

.reject-btn {
    background: white !important;
    color: #ea580c !important;
    border: 2px solid #fed7aa !important;
}

.reject-btn:hover {
    background: #fff7ed !important;
    border-color: #ea580c !important;
    transform: scale(1.08);
    box-shadow: 0 4px 12px rgba(234, 88, 12, 0.25) !important;
}

.delete-btn {
    background: white !important;
    color: #dc2626 !important;
}

.delete-btn:hover {
    background: #fef2f2 !important;
    border-color: #fecaca !important;
    transform: scale(1.05);
}

/* Empty State */
.empty-state {
    text-align: center;
    padding: 64px 32px;
    color: #64748b;
}

.empty-title {
    font-size: 18px;
    font-weight: 600;
    color: #475569;
    margin: 16px 0 8px 0;
}

.empty-subtitle {
    font-size: 14px;
    margin: 0;
    line-height: 1.5;
}

/* Modern Dialog Styles */
.modern-dialog {
    border-radius: 16px !important;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
    border-bottom: 1px solid #e2e8f0;
}

.header-content {
    display: flex;
    align-items: center;
    gap: 16px;
    flex: 1;
}

.header-icon {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.header-text {
    flex: 1;
}

.dialog-title {
    font-size: 20px;
    font-weight: 600;
    color: #1a1a1a;
    margin: 0;
    line-height: 1.3;
}

.dialog-subtitle {
    font-size: 14px;
    color: #94a3b8;
    margin: 2px 0 0 0;
    line-height: 1.4;
}

.close-btn {
    opacity: 0.7;
    transition: all 0.2s ease;
}

.close-btn:hover {
    opacity: 1;
    background-color: rgba(0, 0, 0, 0.04);
}

.dialog-content {
    padding: 24px !important;
    max-height: 70vh;
    overflow-y: auto;
}

.form-section {
    margin-bottom: 24px;
}

.section-title {
    font-size: 16px;
    font-weight: 600;
    color: #374151;
    margin: 0 0 16px 0;
    padding-bottom: 8px;
    border-bottom: 2px solid #e5e7eb;
}

.form-group {
    margin-bottom: 20px;
}

.form-group:last-child {
    margin-bottom: 0;
}

.form-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
}

.form-field {
    margin-bottom: 0 !important;
}

.form-field :deep(.v-field) {
    border-radius: 12px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.2s ease;
}

.form-field :deep(.v-field:hover) {
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.12);
}

.form-field :deep(.v-field--focused) {
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.dialog-actions {
    padding: 20px 24px 24px !important;
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    border-top: 1px solid #e2e8f0;
    background: #f9fafb;
}

.dialog-actions .action-btn {
    height: 44px;
    border-radius: 12px;
    text-transform: none;
    font-weight: 500;
    font-size: 14px;
    padding: 0 24px;
    transition: all 0.2s ease;
    min-width: 120px;
}

.dialog-actions .cancel-btn {
    border-color: #d1d5db;
    color: #6b7280;
}

.dialog-actions .cancel-btn:hover {
    background: #f9fafb;
    border-color: #9ca3af;
    transform: translateY(-1px);
}

.dialog-actions .delete-confirm-btn {
    background: #dc2626 !important;
    color: white !important;
    box-shadow: 0 4px 12px rgba(220, 38, 38, 0.3);
}

.dialog-actions .delete-confirm-btn:hover {
    background: #b91c1c !important;
    box-shadow: 0 6px 16px rgba(220, 38, 38, 0.4);
    transform: translateY(-1px);
}

/* Legacy compatibility styles for existing dialogs and cards */
.page-container {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    min-height: 100vh;
}

.page-header {
    animation: fadeInDown 0.6s ease-out;
}

.stat-card-blue {
    border-left-color: #3949AB;
}

.stat-card-orange {
    border-left-color: #F57C00;
}

.stat-card-green {
    border-left-color: #388E3C;
}

.stat-card-red {
    border-left-color: #D32F2F;
}

.stat-icon {
    transition: transform 0.3s ease;
}

.tab-card {
    border-radius: 16px;
    overflow: hidden;
}

.filter-card {
    border-radius: 16px;
    background: linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%);
}

.data-table-card {
    border-radius: 16px;
    overflow: hidden;
}

.modern-table :deep(thead) {
    background-color: #f5f5f5;
}

.modern-table :deep(th) {
    font-weight: 700 !important;
    color: #424242 !important;
    text-transform: uppercase;
    font-size: 0.75rem;
    letter-spacing: 0.5px;
}

.modern-table :deep(tbody tr) {
    transition: background-color 0.2s ease;
}

.modern-table :deep(tbody tr:hover) {
    background-color: #f8f9fa !important;
}

.bg-gradient-indigo {
    background: linear-gradient(135deg, #3949AB 0%, #5C6BC0 100%);
}

.bg-gradient-red {
    background: linear-gradient(135deg, #D32F2F 0%, #E57373 100%);
}

.info-box {
    background: linear-gradient(135deg, #f5f7fa 0%, #e8ecf1 100%);
    border-radius: 12px;
    border-left: 3px solid #3949AB;
}

.student-info-card {
    background: linear-gradient(135deg, #E8EAF6 0%, #C5CAE9 100%);
    border-radius: 16px;
    border: 2px solid #3949AB;
}

@keyframes fadeInDown {
    from {
        opacity: 0;
        transform: translateY(-20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.rounded-lg {
    border-radius: 16px;
}

/* Custom Table Footer Styles */
.custom-table-footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: #fafafa;
    border-top: 1px solid #e0e0e0;
}

.footer-info {
    color: #757575;
    font-size: 14px;
    font-weight: 400;
    flex: 1;
    text-align: center;
}

.footer-btn {
    border: 1px solid #d0d0d0 !important;
    border-radius: 8px !important;
    color: #616161 !important;
    text-transform: none !important;
    font-weight: 400 !important;
    padding: 0 20px !important;
    height: 40px !important;
    min-width: 110px !important;
    background: white !important;
    transition: all 0.2s ease;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05) !important;
}

.footer-btn:hover:not(:disabled) {
    background-color: #f5f5f5 !important;
    border-color: #9e9e9e !important;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1) !important;
}

.footer-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
    background: #fafafa !important;
}

.footer-btn .v-icon {
    font-size: 20px;
    margin: 0 4px;
}

/* Responsive Design */
@media (max-width: 1200px) {
    .header-container {
        padding: 20px 24px;
        flex-direction: column;
        align-items: stretch;
        gap: 20px;
    }

    .stats-cards {
        flex-wrap: wrap;
    }
}

@media (max-width: 768px) {
    .header-container {
        padding: 16px;
    }

    .modern-table-section {
        padding: 16px;
    }

    .title-wrapper {
        flex-direction: column;
        align-items: flex-start;
        gap: 12px;
    }

    .stats-cards {
        flex-direction: column;
        gap: 12px;
    }

    .toolbar-right {
        flex-direction: column;
        align-items: stretch;
        gap: 8px;
    }

    .search-container {
        min-width: auto;
    }

    .table-toolbar {
        flex-direction: column;
        gap: 16px;
    }

    .modern-table-wrapper {
        overflow-x: auto;
    }

    .modern-table {
        min-width: 800px;
    }
}
</style>