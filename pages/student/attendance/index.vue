<template>
    <div class="scan-page">
        <v-container class="scan-container">
            <!-- Header Section -->
            <div class="scan-header">
                <v-row justify="center" class="mb-6">
                    <v-col cols="12" class="text-center">
                        <div class="scan-icon-wrapper">
                            <v-avatar
                                size="80"
                                color="primary"
                                class="scan-avatar"
                            >
                                <v-icon
                                    icon="mdi-qrcode-scan"
                                    size="40"
                                    color="white"
                                />
                            </v-avatar>
                        </div>
                        <h1 class="scan-title mt-4">Attendance Scan</h1>
                        <p class="scan-subtitle">
                            Scan your face or enter attendance code
                        </p>
                    </v-col>
                </v-row>
            </div>

            <!-- Main Content -->
            <v-row justify="center">
                <v-col cols="12" md="8" lg="6">
                    <!-- Scan Methods Card -->
                    <v-card class="scan-card" elevation="4">
                        <v-card-text class="pa-8">
                            <!-- Method Tabs -->
                            <v-tabs
                                v-model="scanMethod"
                                class="scan-tabs mb-6"
                                centered
                            >
                                <v-tab value="face" class="scan-tab">
                                    <v-icon
                                        icon="mdi-face-recognition"
                                        class="mr-2"
                                    />
                                    Face Scan
                                </v-tab>
                                <v-tab value="manual" class="scan-tab">
                                    <v-icon icon="mdi-keyboard" class="mr-2" />
                                    Manual Entry
                                </v-tab>
                            </v-tabs>

                            <!-- QR Code Scanner -->
                            <v-window v-model="scanMethod">
                                <v-window-item value="face">
                                    <div class="qr-scanner-section">
                                        <v-select
                                            v-model="selectedSessionId"
                                            :items="sessionOptions"
                                            item-title="title"
                                            item-value="value"
                                            label="Session"
                                            variant="outlined"
                                            density="comfortable"
                                            class="mb-4"
                                            :loading="sessionsLoading"
                                            clearable
                                        />
                                        <!-- Camera Preview Area -->
                                        <div class="camera-container">
                                            <div
                                                class="camera-preview"
                                                :class="{
                                                    'camera-active':
                                                        isCameraActive,
                                                }"
                                            >
                                                <div
                                                    v-if="!isCameraActive"
                                                    class="camera-placeholder"
                                                >
                                                    <v-icon
                                                        icon="mdi-camera"
                                                        size="64"
                                                        color="grey-lighten-1"
                                                    />
                                                    <p class="mt-4">
                                                        Camera preview will
                                                        appear here
                                                    </p>
                                                </div>
                                                <div
                                                    v-else
                                                    class="camera-overlay"
                                                >
                                                    <video
                                                        ref="videoRef"
                                                        class="camera-video"
                                                        autoplay
                                                        muted
                                                        playsinline
                                                    ></video>
                                                    <div class="scan-frame">
                                                        <div
                                                            class="scan-corners"
                                                        >
                                                            <div
                                                                class="corner top-left"
                                                            ></div>
                                                            <div
                                                                class="corner top-right"
                                                            ></div>
                                                            <div
                                                                class="corner bottom-left"
                                                            ></div>
                                                            <div
                                                                class="corner bottom-right"
                                                            ></div>
                                                        </div>
                                                        <div
                                                            class="scan-line"
                                                        ></div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- Camera Controls -->
                                        <div class="camera-controls mt-6">
                                            <v-btn
                                                v-if="!isCameraActive"
                                                @click="startCamera"
                                                color="primary"
                                                size="large"
                                                prepend-icon="mdi-camera"
                                                class="camera-btn"
                                                block
                                            >
                                                Start Camera
                                            </v-btn>
                                            <div v-else class="active-controls">
                                                <v-btn
                                                    @click="stopCamera"
                                                    color="error"
                                                    variant="outlined"
                                                    prepend-icon="mdi-camera-off"
                                                    class="mr-3"
                                                >
                                                    Stop Camera
                                                </v-btn>
                                                <v-btn
                                                    @click="captureFrame"
                                                    color="primary"
                                                    prepend-icon="mdi-camera-iris"
                                                    size="large"
                                                    :loading="isSubmitting"
                                                >
                                                    Capture
                                                </v-btn>
                                            </div>
                                            <v-btn
                                                variant="text"
                                                color="primary"
                                                class="mt-3"
                                                prepend-icon="mdi-account-plus"
                                                @click="goToFaceRegister"
                                            >
                                                Register Face
                                            </v-btn>
                                        </div>

                                        <!-- Scan Instructions -->
                                        <v-alert
                                            type="info"
                                            variant="tonal"
                                            class="mt-4"
                                            icon="mdi-information"
                                        >
                                            <div class="alert-content">
                                                <strong>How to scan:</strong>
                                                <ul class="mt-2 ml-4">
                                                    <li>
                                                        Keep your face within
                                                        the frame
                                                    </li>
                                                    <li>
                                                        Hold steady and look
                                                        toward the camera
                                                    </li>
                                                    <li>
                                                        Tap Capture to submit
                                                        your scan
                                                    </li>
                                                </ul>
                                            </div>
                                        </v-alert>
                                    </div>
                                </v-window-item>

                                <!-- Manual Entry -->
                                <v-window-item value="manual">
                                    <div class="manual-entry-section">
                                        <v-form
                                            @submit.prevent="
                                                submitAttendanceCode
                                            "
                                        >
                                            <!-- Attendance Code Input -->
                                            <div class="code-input-wrapper">
                                                <v-text-field
                                                    v-model="attendanceCode"
                                                    label="Attendance Code"
                                                    placeholder="Enter 6-digit code"
                                                    variant="outlined"
                                                    prepend-inner-icon="mdi-ticket-confirmation"
                                                    class="attendance-code-field"
                                                    :rules="codeRules"
                                                    maxlength="6"
                                                    counter
                                                    hide-details="auto"
                                                />
                                            </div>

                                            <!-- Submit Button -->
                                            <v-btn
                                                type="submit"
                                                color="primary"
                                                size="large"
                                                prepend-icon="mdi-check"
                                                class="submit-btn mt-6"
                                                block
                                                :disabled="!isValidCode"
                                                :loading="isSubmitting"
                                            >
                                                Submit Attendance
                                            </v-btn>
                                        </v-form>

                                        <!-- Manual Entry Instructions -->
                                        <v-alert
                                            type="info"
                                            variant="tonal"
                                            class="mt-4"
                                            icon="mdi-information"
                                        >
                                            <div class="alert-content">
                                                <strong>Manual Entry:</strong>
                                                <ul class="mt-2 ml-4">
                                                    <li>
                                                        Get the 6-digit code
                                                        from your instructor
                                                    </li>
                                                    <li>
                                                        Enter the code exactly
                                                        as provided
                                                    </li>
                                                    <li>
                                                        Submit before the time
                                                        limit expires
                                                    </li>
                                                </ul>
                                            </div>
                                        </v-alert>
                                    </div>
                                </v-window-item>
                            </v-window>
                        </v-card-text>
                    </v-card>

                    <!-- Recent Attendance History -->
                    <v-card class="history-card mt-6" elevation="2">
                        <v-card-title class="history-title">
                            <v-icon icon="mdi-history" class="mr-2" />
                            Recent Attendance
                        </v-card-title>
                        <v-card-text>
                            <div
                                v-if="recentAttendance.length === 0"
                                class="no-history"
                            >
                                <v-icon
                                    icon="mdi-calendar-blank"
                                    size="48"
                                    color="grey-lighten-1"
                                />
                                <p class="mt-3">No attendance records yet</p>
                            </div>
                            <div v-else class="attendance-list">
                                <v-list density="compact">
                                    <v-list-item
                                        v-for="(
                                            record, index
                                        ) in recentAttendance"
                                        :key="index"
                                        class="attendance-item"
                                    >
                                        <template #prepend>
                                            <v-avatar
                                                size="40"
                                                :color="
                                                    record.status === 'present'
                                                        ? 'success'
                                                        : 'error'
                                                "
                                            >
                                                <v-icon
                                                    :icon="
                                                        record.status ===
                                                        'present'
                                                            ? 'mdi-check'
                                                            : 'mdi-close'
                                                    "
                                                    color="white"
                                                />
                                            </v-avatar>
                                        </template>

                                        <v-list-item-title>{{
                                            record.subject
                                        }}</v-list-item-title>
                                        <v-list-item-subtitle>
                                            {{
                                                formatDateTime(record.datetime)
                                            }}
                                        </v-list-item-subtitle>

                                        <template #append>
                                            <v-chip
                                                :color="
                                                    record.status === 'present'
                                                        ? 'success'
                                                        : 'error'
                                                "
                                                variant="flat"
                                                size="small"
                                            >
                                                {{ record.status }}
                                            </v-chip>
                                        </template>
                                    </v-list-item>
                                </v-list>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

        <!-- Success Dialog -->
        <v-dialog v-model="showSuccessDialog" max-width="400" persistent>
            <v-card class="success-dialog">
                <v-card-text class="text-center pa-8">
                    <v-avatar size="80" color="success" class="mb-4">
                        <v-icon
                            icon="mdi-check-circle"
                            size="40"
                            color="white"
                        />
                    </v-avatar>
                    <h3 class="success-title mb-2">Attendance Recorded!</h3>
                    <p class="success-message">
                        Your attendance has been successfully recorded for
                        <strong>{{ currentSubject }}</strong>
                    </p>
                </v-card-text>
                <v-card-actions class="justify-center pb-6">
                    <v-btn
                        @click="closeSuccessDialog"
                        color="primary"
                        variant="elevated"
                        size="large"
                    >
                        Continue
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <!-- Error Dialog -->
        <v-dialog v-model="showErrorDialog" max-width="400" persistent>
            <v-card class="error-dialog">
                <v-card-text class="text-center pa-8">
                    <v-avatar size="80" color="error" class="mb-4">
                        <v-icon
                            icon="mdi-alert-circle"
                            size="40"
                            color="white"
                        />
                    </v-avatar>
                    <h3 class="error-title mb-2">Scan Failed</h3>
                    <p class="error-message">{{ errorMessage }}</p>
                </v-card-text>
                <v-card-actions class="justify-center pb-6">
                    <v-btn
                        @click="closeErrorDialog"
                        color="error"
                        variant="outlined"
                        class="mr-3"
                    >
                        Close
                    </v-btn>
                    <v-btn
                        @click="retryAction"
                        color="primary"
                        variant="elevated"
                    >
                        Try Again
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { useNuxtApp, useRoute } from "#app";
import { useStudentScheduleStore } from "~/store/useStudentScheduleStore";

// Set the layout
definePageMeta({
    layout: "student",
});

// Reactive state
const scanMethod = ref("face");
const isCameraActive = ref(false);
const attendanceCode = ref("");
const isSubmitting = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref("");
const currentSubject = ref("Mathematics 101");
const selectedSessionId = ref(null);
const sessionsLoading = ref(false);
const videoRef = ref(null);
let mediaStream = null;
const route = useRoute();

// Recent attendance data
const recentAttendance = ref([
    {
        subject: "Mathematics 101",
        datetime: new Date("2025-11-25T08:00:00"),
        status: "present",
    },
    {
        subject: "Physics 201",
        datetime: new Date("2025-11-24T10:00:00"),
        status: "present",
    },
    {
        subject: "Chemistry 301",
        datetime: new Date("2025-11-24T14:00:00"),
        status: "absent",
    },
]);

// Validation rules
const codeRules = [
    (v) => !!v || "Attendance code is required",
    (v) => /^\d{6}$/.test(v) || "Code must be exactly 6 digits",
];

// Computed properties
const isValidCode = computed(() => {
    return attendanceCode.value && /^\d{6}$/.test(attendanceCode.value);
});

const scheduleStore = useStudentScheduleStore();
const sessionOptions = computed(() => {
    return scheduleStore.sessions.map((session) => ({
        title: `${session.subject_name || "Unknown Subject"} - ${formatDateTime(session.start_datetime)}`,
        value: session.id,
    }));
});

// Methods
const startCamera = async () => {
    try {
        mediaStream = await navigator.mediaDevices.getUserMedia({
            video: true,
            audio: false,
        });
        isCameraActive.value = true;
        await nextTick();
        if (videoRef.value) {
            videoRef.value.srcObject = mediaStream;
            if (videoRef.value.play) {
                await videoRef.value.play();
            }
        }
    } catch (err) {
        showAttendanceError(
            "Unable to access camera. Please allow camera permission.",
        );
    }
};

const stopCamera = () => {
    isCameraActive.value = false;
    if (mediaStream) {
        mediaStream.getTracks().forEach((track) => track.stop());
        mediaStream = null;
    }
    if (videoRef.value) {
        videoRef.value.srcObject = null;
    }
};

const captureFrame = () => {
    if (!selectedSessionId.value) {
        showAttendanceError("Please select a session before scanning.");
        return;
    }
    if (!videoRef.value) {
        showAttendanceError("Camera not ready. Please start the camera.");
        return;
    }

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.value.videoWidth || 640;
    canvas.height = videoRef.value.videoHeight || 480;
    const ctx = canvas.getContext("2d");
    ctx.drawImage(videoRef.value, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(
        async (blob) => {
            if (!blob) {
                showAttendanceError("Failed to capture image.");
                return;
            }
            isSubmitting.value = true;
            try {
                const { $UserPrivateAxios } = useNuxtApp();
                const formData = new FormData();
                formData.append("session_id", String(selectedSessionId.value));
                formData.append("file", blob, "capture.jpg");
                const response = await $UserPrivateAxios.post(
                    "/user/attendance/scan",
                    formData,
                );
                const data = response?.data?.data || response?.data || {};
                if (data.result !== "success") {
                    showAttendanceError(
                        `Scan failed: ${data.result || "unknown"}`,
                    );
                } else {
                    showAttendanceSuccess();
                }
            } catch (err) {
                showAttendanceError(
                    err.response?.data?.message || err.message || "Scan failed",
                );
            } finally {
                isSubmitting.value = false;
            }
        },
        "image/jpeg",
        0.9,
    );
};

const submitAttendanceCode = () => {
    if (!isValidCode.value) return;

    isSubmitting.value = true;

    // Simulate API call
    setTimeout(() => {
        isSubmitting.value = false;
        const success = Math.random() > 0.2; // 80% success rate for demo

        if (success) {
            showAttendanceSuccess();
            attendanceCode.value = "";
        } else {
            showAttendanceError(
                "Invalid attendance code. Please check and try again.",
            );
        }
    }, 1500);
};

const showAttendanceSuccess = () => {
    stopCamera();
    const session = scheduleStore.sessions.find(
        (s) => s.id === selectedSessionId.value,
    );
    if (session) {
        currentSubject.value = session.subject_name || currentSubject.value;
    }
    showSuccessDialog.value = true;

    // Add to recent attendance
    recentAttendance.value.unshift({
        subject: currentSubject.value,
        datetime: new Date(),
        status: "present",
    });
};

const showAttendanceError = (message) => {
    errorMessage.value = message;
    showErrorDialog.value = true;
};

const closeSuccessDialog = () => {
    showSuccessDialog.value = false;
};

const closeErrorDialog = () => {
    showErrorDialog.value = false;
};

const retryAction = () => {
    closeErrorDialog();
    if (scanMethod.value === "face") {
        startCamera();
    }
};

const formatDateTime = (date) => {
    if (!date) return "Unknown time";
    const dt = new Date(date);
    if (Number.isNaN(dt.getTime())) return "Unknown time";
    return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(dt);
};

// Lifecycle
onMounted(() => {
    sessionsLoading.value = true;
    scheduleStore
        .fetchSchedule()
        .then(() => {
            const sessionId = route.query.session_id;
            if (sessionId) {
                selectedSessionId.value = Number(sessionId);
            }
        })
        .catch(() => {})
        .finally(() => {
            sessionsLoading.value = false;
        });
});

const goToFaceRegister = () => {
    stopCamera();
    navigateTo("/student/face-register");
};
</script>

<style scoped>
.scan-page {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
    padding: 20px 0;
}

.scan-container {
    max-width: 1200px;
    margin: 0 auto;
}

/* Header Styles */
.scan-header {
    text-align: center;
    margin-bottom: 32px;
}

.scan-icon-wrapper {
    display: inline-block;
    animation: pulse 2s infinite;
}

.scan-avatar {
    box-shadow: 0 8px 32px rgba(26, 35, 126, 0.3);
}

.scan-title {
    font-size: 2.5rem;
    font-weight: 700;
    color: white;
    margin-bottom: 8px;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.scan-subtitle {
    font-size: 1.2rem;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
}

/* Card Styles */
.scan-card {
    border-radius: 24px;
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

/* Tabs */
.scan-tabs :deep(.v-tab) {
    font-weight: 600;
    text-transform: none;
}

/* QR Scanner Styles */
.camera-container {
    position: relative;
    border-radius: 16px;
    overflow: hidden;
    background: #f5f5f5;
}

.camera-preview {
    width: 100%;
    height: 300px;
    background: #fafafa;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    border: 2px dashed #ddd;
    transition: all 0.3s ease;
}

.camera-preview.camera-active {
    border-color: #1976d2;
    background: #000;
}

.camera-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    position: absolute;
    inset: 0;
}

.camera-placeholder {
    text-align: center;
    color: #999;
}

.camera-overlay {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
}

.scan-frame {
    position: relative;
    width: 200px;
    height: 200px;
    border: 2px solid rgba(255, 255, 255, 0.3);
}

.scan-corners {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.corner {
    position: absolute;
    width: 20px;
    height: 20px;
    border: 3px solid #fff;
}

.corner.top-left {
    top: -2px;
    left: -2px;
    border-right: none;
    border-bottom: none;
}

.corner.top-right {
    top: -2px;
    right: -2px;
    border-left: none;
    border-bottom: none;
}

.corner.bottom-left {
    bottom: -2px;
    left: -2px;
    border-right: none;
    border-top: none;
}

.corner.bottom-right {
    bottom: -2px;
    right: -2px;
    border-left: none;
    border-top: none;
}

.scan-line {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 2px;
    background: linear-gradient(90deg, transparent, #00ff00, transparent);
    animation: scanLine 2s infinite;
}

@keyframes scanLine {
    0%,
    100% {
        transform: translateY(0);
        opacity: 0;
    }
    50% {
        transform: translateY(100px);
        opacity: 1;
    }
}

/* Camera Controls */
.camera-controls {
    text-align: center;
}

.active-controls {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
}

.camera-btn {
    font-weight: 600;
    border-radius: 12px;
}

/* Manual Entry Styles */
.manual-entry-section {
    padding: 20px 0;
}

.code-input-wrapper {
    margin-bottom: 20px;
}

.attendance-code-field :deep(.v-field) {
    font-size: 1.5rem;
    text-align: center;
    font-weight: 600;
    letter-spacing: 0.2em;
}

.submit-btn {
    font-weight: 600;
    border-radius: 12px;
    height: 56px;
}

/* Alert Styles */
.alert-content ul {
    margin: 0;
    padding-left: 20px;
}

.alert-content li {
    margin: 4px 0;
}

/* History Card */
.history-card {
    border-radius: 16px;
}

.history-title {
    font-weight: 600;
    color: #1976d2;
}

.no-history {
    text-align: center;
    padding: 40px 20px;
    color: #999;
}

.attendance-list {
    max-height: 300px;
    overflow-y: auto;
}

.attendance-item {
    border-radius: 12px;
    margin-bottom: 8px;
    transition: background-color 0.2s ease;
}

.attendance-item:hover {
    background-color: #f5f5f5;
}

/* Dialog Styles */
.success-dialog,
.error-dialog {
    border-radius: 20px;
}

.success-title {
    color: #2e7d32;
    font-weight: 600;
}

.success-message {
    color: #666;
    line-height: 1.5;
}

.error-title {
    color: #d32f2f;
    font-weight: 600;
}

.error-message {
    color: #666;
    line-height: 1.5;
}

/* Animations */
@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

/* Responsive Design */
@media (max-width: 768px) {
    .scan-page {
        padding: 10px 0;
    }

    .scan-title {
        font-size: 2rem;
    }

    .scan-subtitle {
        font-size: 1rem;
    }

    .scan-card {
        border-radius: 16px;
        margin: 0 8px;
    }

    .camera-preview {
        height: 250px;
    }

    .scan-frame {
        width: 160px;
        height: 160px;
    }

    .active-controls {
        flex-direction: column;
    }

    .active-controls .v-btn {
        width: 100%;
        margin: 4px 0;
    }

    .scan-tabs :deep(.v-tab) {
        font-size: 0.875rem;
    }
}

@media (max-width: 480px) {
    .scan-title {
        font-size: 1.75rem;
    }

    .camera-preview {
        height: 200px;
    }

    .scan-frame {
        width: 120px;
        height: 120px;
    }

    .scan-card {
        margin: 0 4px;
    }

    .scan-card .v-card-text {
        padding: 24px !important;
    }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
    .camera-preview {
        background: #2d2d2d;
        border-color: #555;
    }

    .camera-placeholder {
        color: #ccc;
    }

    .no-history {
        color: #ccc;
    }
}
</style>
