<template>
    <div class="add-admin-page">
        <!-- Modern Header Section -->
        <div class="modern-header">
            <div class="header-container">
                <div class="title-section">
                    <div class="title-wrapper">
                        <div class="title-icon">
                            <v-icon icon="mdi-shield-account" size="32" color="white" />
                        </div>
                        <div class="title-content">
                            <h1 class="page-title">Add New Admin</h1>
                            <div class="breadcrumb">
                                <span class="breadcrumb-item">Admin</span>
                                <v-icon icon="mdi-chevron-right" size="16" color="grey" class="breadcrumb-separator" />
                                <span class="breadcrumb-item active">Add Admin</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div class="action-section">
                    <v-btn class="modern-btn cancel-btn" variant="outlined" @click="goBack">
                        Cancel
                    </v-btn>
                </div>
            </div>
        </div>

        <!-- Form Section -->
        <div class="modern-form-section">
            <div class="form-container">
                <v-card class="modern-card">
                    <div class="dialog-header">
                        <div class="header-content">
                            <div class="header-icon">
                                <v-icon color="white" size="24">mdi-plus</v-icon>
                            </div>
                            <div class="header-text">
                                <h3 class="dialog-title">Add New Admin</h3>
                                <p class="dialog-subtitle">Fill in the admin details below</p>
                            </div>
                        </div>
                    </div>

                    <v-card-text class="dialog-content">
                        <v-form ref="formRef" v-model="formValid">
                            <div class="form-group">
                                <label class="form-label">Admin ID (Global ID) *</label>
                                <v-text-field v-model="formData.adminId" :rules="adminIdRules" variant="outlined"
                                    density="comfortable" placeholder="e.g., admin001" class="form-field" />
                            </div>

                            <v-row>
                                <v-col cols="6">
                                    <div class="form-group">
                                        <label class="form-label">First Name *</label>
                                        <v-text-field v-model="formData.firstName" :rules="nameRules" variant="outlined"
                                            density="comfortable" placeholder="Enter first name" class="form-field" />
                                    </div>
                                </v-col>
                                <v-col cols="6">
                                    <div class="form-group">
                                        <label class="form-label">Last Name</label>
                                        <v-text-field v-model="formData.lastName" variant="outlined"
                                            density="comfortable" placeholder="Enter last name" class="form-field" />
                                    </div>
                                </v-col>
                            </v-row>

                            <v-row>
                                <v-col cols="6">
                                    <div class="form-group">
                                        <label class="form-label">Email *</label>
                                        <v-text-field v-model="formData.email" :rules="emailRules" variant="outlined"
                                            density="comfortable" placeholder="admin@uams.edu" class="form-field" />
                                    </div>
                                </v-col>
                                <v-col cols="6">
                                    <div class="form-group">
                                        <label class="form-label">Password *</label>
                                        <v-text-field v-model="formData.password" :rules="passwordRules" type="password"
                                            variant="outlined" density="comfortable" placeholder="Min 8 characters"
                                            class="form-field" />
                                    </div>
                                </v-col>
                            </v-row>

                            <div class="form-group">
                                <label class="form-label">Role *</label>
                                <v-select v-model="formData.role" :items="roleOptions" variant="outlined"
                                    density="comfortable" class="form-field" />
                            </div>

                            <div class="form-group">
                                <div class="switch-container">
                                    <v-switch v-model="formData.active" color="primary" hide-details>
                                        <template v-slot:label>
                                            <div class="switch-info">
                                                <span class="form-label">Active Status</span>
                                                <span class="switch-description">Admin is currently active</span>
                                            </div>
                                        </template>
                                    </v-switch>
                                </div>
                            </div>
                        </v-form>
                    </v-card-text>

                    <v-card-actions class="dialog-actions">
                        <v-spacer />
                        <v-btn variant="outlined" class="action-btn cancel-btn" @click="goBack" :disabled="formLoading">
                            Cancel
                        </v-btn>
                        <v-btn color="primary" class="action-btn submit-btn" @click="submitForm" :loading="formLoading"
                            :disabled="!formValid">
                            Create Admin
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </div>
        </div>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'admin',
})

import { userAdminStore } from '@/store/userAdmin'
import Swal from 'sweetalert2'

const router = useRouter()
const adminStore = userAdminStore()

const formRef = ref(null)
const formValid = ref(false)
const formLoading = ref(false)

const formData = reactive({
    adminId: '',
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    role: 'admin',
    active: true
})

// Validation rules
const adminIdRules = [
    v => !!v || 'Admin ID is required',
    v => (v && v.length >= 5) || 'Admin ID must be at least 5 characters'
]

const nameRules = [
    v => !!v || 'Name is required',
    v => (v && v.length >= 2) || 'Name must be at least 2 characters'
]

const emailRules = [
    v => !!v || 'Email is required',
    v => /.+@.+\..+/.test(v) || 'Email must be valid'
]

const passwordRules = [
    v => !!v || 'Password is required',
    v => (v && v.length >= 8) || 'Password must be at least 8 characters',
    v => (v && v.length <= 32) || 'Password must be at most 32 characters'
]

// Options
const roleOptions = ['admin', 'superadmin']

const submitForm = async () => {
    if (!formValid.value) return

    formLoading.value = true

    try {
        const userData = {
            adminId: formData.adminId,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            active: formData.active
        }

        await adminStore.createUser(userData)

        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Admin created successfully!',
            confirmButtonColor: '#3b82f6',
            timer: 2000
        })

        router.push('/admin/admins')
    } catch (error) {
        console.error('Error submitting form:', error)
        Swal.fire({
            icon: 'error',
            title: 'Error',
            text: error.response?.data?.message || 'Failed to create admin. Please try again.',
            confirmButtonColor: '#3b82f6'
        })
    } finally {
        formLoading.value = false
    }
}

const goBack = () => {
    router.push('/admin/admins')
}
</script>

<style scoped>
.add-admin-page {
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
}

.modern-btn:hover {
    transform: translateY(-1px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.cancel-btn {
    border: 1px solid #e2e8f0;
}

/* Modern Form Section */
.modern-form-section {
    max-width: 1400px;
    margin: 0 auto;
    padding: 24px 32px;
}

.form-container {
    max-width: 700px;
    margin: 0 auto;
    background: white;
    border-radius: 16px;
    box-shadow: 0 4px 16px rgba(0, 0, 0, 0.08);
    overflow: hidden;
}

.modern-card {
    border-radius: 16px !important;
    overflow: hidden;
}

.dialog-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px;
    background: linear-gradient(135deg, #f8f9fc 0%, #f1f3f8 100%);
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
    background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(59, 130, 246, 0.25);
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
    color: #6b7280;
    margin: 2px 0 0 0;
    line-height: 1.4;
}

.dialog-content {
    padding: 24px !important;
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

.switch-container {
    display: flex;
    align-items: center;
    gap: 16px;
    padding: 16px;
    background: #f8fafc;
    border: 1px solid #e2e8f0;
    border-radius: 12px;
}

.switch-info {
    flex: 1;
}

.switch-description {
    font-size: 13px;
    color: #64748b;
    display: block;
    margin-top: 4px;
}

.dialog-actions {
    padding: 20px 24px 24px !important;
    gap: 12px;
}

.cancel-btn {
    min-width: 100px;
}

.submit-btn {
    min-width: 140px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.submit-btn:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
    transform: translateY(-1px);
}

/* Responsive Design */
@media (max-width: 768px) {
    .header-container {
        padding: 16px 20px;
    }

    .modern-form-section {
        padding: 16px 20px;
    }

    .title-wrapper {
        flex-direction: column;
        text-align: center;
        gap: 12px;
    }

    .action-section {
        justify-content: center;
    }
}
</style>