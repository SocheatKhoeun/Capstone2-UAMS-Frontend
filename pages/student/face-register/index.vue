<template>
    <div class="scan-page">
        <v-container class="scan-container">
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
                                    icon="mdi-face-recognition"
                                    size="40"
                                    color="white"
                                />
                            </v-avatar>
                        </div>
                        <h1 class="scan-title mt-4">Face Registration</h1>
                        <p class="scan-subtitle">
                            Register your face for attendance scan
                        </p>
                    </v-col>
                </v-row>
            </div>

            <v-row justify="center">
                <v-col cols="12" md="8" lg="6">
                    <v-card class="scan-card" elevation="4">
                        <v-card-text class="pa-8">
                            <div class="qr-scanner-section">
                                <div class="camera-container">
                                    <div
                                        class="camera-preview"
                                        :class="{
                                            'camera-active': isCameraActive,
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
                                                Camera preview will appear here
                                            </p>
                                        </div>
                                        <div v-else class="camera-overlay">
                                            <video
                                                ref="videoRef"
                                                class="camera-video"
                                                autoplay
                                                muted
                                                playsinline
                                            ></video>
                                            <div class="scan-frame">
                                                <div class="scan-corners">
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
                                                <div class="scan-line"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

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
                                            prepend-icon="mdi-content-save"
                                            size="large"
                                            :loading="isSubmitting"
                                        >
                                            Register Face
                                        </v-btn>
                                    </div>
                                    <v-btn
                                        variant="text"
                                        color="primary"
                                        class="mt-3"
                                        prepend-icon="mdi-arrow-left"
                                        @click="goBack"
                                    >
                                        Back to Scan
                                    </v-btn>
                                </div>

                                <v-alert
                                    type="info"
                                    variant="tonal"
                                    class="mt-4"
                                    icon="mdi-information"
                                >
                                    <div class="alert-content">
                                        <strong>Tips for best results:</strong>
                                        <ul class="mt-2 ml-4">
                                            <li>Face the camera directly</li>
                                            <li>Ensure good lighting</li>
                                            <li>
                                                Keep your face inside the frame
                                            </li>
                                        </ul>
                                    </div>
                                </v-alert>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
        </v-container>

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
                    <h3 class="success-title mb-2">Face Registered!</h3>
                    <p class="success-message">
                        Your face was registered successfully.
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
                    <h3 class="error-title mb-2">Registration Failed</h3>
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
import { ref, nextTick } from "vue";
import { useNuxtApp } from "#app";

definePageMeta({
    layout: "student",
});

const isCameraActive = ref(false);
const isSubmitting = ref(false);
const showSuccessDialog = ref(false);
const showErrorDialog = ref(false);
const errorMessage = ref("");
const videoRef = ref(null);
let mediaStream = null;

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
        showRegisterError(
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
    if (!videoRef.value) {
        showRegisterError("Camera not ready. Please start the camera.");
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
                showRegisterError("Failed to capture image.");
                return;
            }
            isSubmitting.value = true;
            try {
                const { $UserPrivateAxios } = useNuxtApp();
                const formData = new FormData();
                formData.append("file", blob, "face.jpg");
                await $UserPrivateAxios.post(
                    "/user/attendance/enroll",
                    formData,
                );
                showRegisterSuccess();
            } catch (err) {
                showRegisterError(
                    err.response?.data?.message ||
                        err.message ||
                        "Registration failed",
                );
            } finally {
                isSubmitting.value = false;
            }
        },
        "image/jpeg",
        0.9,
    );
};

const showRegisterSuccess = () => {
    stopCamera();
    showSuccessDialog.value = true;
};

const showRegisterError = (message) => {
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
    startCamera();
};

const goBack = () => {
    stopCamera();
    navigateTo("/student/attendance");
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

.scan-card {
    border-radius: 24px;
    background: white;
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
    backdrop-filter: blur(10px);
}

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

.alert-content ul {
    margin: 0;
    padding-left: 20px;
}

.alert-content li {
    margin: 4px 0;
}

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

@keyframes pulse {
    0%,
    100% {
        transform: scale(1);
    }
    50% {
        transform: scale(1.05);
    }
}

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
</style>
