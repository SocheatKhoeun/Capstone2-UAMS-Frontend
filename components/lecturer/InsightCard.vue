<template>
    <v-card class="insight-card" elevation="2">
        <v-card-text>
            <div class="d-flex align-center justify-space-between mb-3">
                <div class="insight-icon-wrapper" :style="{ backgroundColor: color + '20' }">
                    <v-icon :color="color" size="32">{{ icon }}</v-icon>
                </div>
                <v-chip v-if="trend" :color="trendColor" size="small" variant="flat">
                    <v-icon start size="16">{{ trendIcon }}</v-icon>
                    {{ trend }}
                </v-chip>
            </div>
            <div class="insight-content">
                <h2 class="insight-value">{{ value }}</h2>
                <p class="insight-label">{{ label }}</p>
                <p v-if="subtitle" class="insight-subtitle">{{ subtitle }}</p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
const props = defineProps({
    icon: {
        type: String,
        required: true
    },
    value: {
        type: [String, Number],
        required: true
    },
    label: {
        type: String,
        required: true
    },
    subtitle: {
        type: String,
        default: ''
    },
    color: {
        type: String,
        default: 'primary'
    },
    trend: {
        type: String,
        default: ''
    }
})

const trendColor = computed(() => {
    if (!props.trend) return ''
    const value = parseFloat(props.trend)
    return value > 0 ? 'success' : value < 0 ? 'error' : 'grey'
})

const trendIcon = computed(() => {
    if (!props.trend) return ''
    const value = parseFloat(props.trend)
    return value > 0 ? 'mdi-trending-up' : value < 0 ? 'mdi-trending-down' : 'mdi-minus'
})
</script>

<style scoped>
.insight-card {
    height: 100%;
    border-radius: 12px;
    transition: all 0.3s ease;
}

.insight-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12) !important;
}

.insight-icon-wrapper {
    width: 64px;
    height: 64px;
    border-radius: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.insight-content {
    margin-top: 8px;
}

.insight-value {
    font-size: 2rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 4px;
    color: #1a1a1a;
}

.insight-label {
    font-size: 0.875rem;
    font-weight: 600;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-bottom: 4px;
}

.insight-subtitle {
    font-size: 0.75rem;
    color: #999;
    margin: 0;
}
</style>