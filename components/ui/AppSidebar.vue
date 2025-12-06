<template>
  <VNavigationDrawer 
    v-model="drawer" 
    app 
    :permanent="!isMobile" 
    :temporary="isMobile" 
    :width="280" 
    :rail="isRail"
    :rail-width="72" 
    class="sidebar-custom"
  >
    <!-- Brand -->
    <div class="brand-section">
      <div class="brand-content" @click="toggleRail">
        <VAvatar size="40" class="brand-logo">
          <VIcon icon="mdi-school-outline" color="primary" />
        </VAvatar>
        <div v-if="!isRail" class="brand-text">
          <span class="brand-title">UAMS</span>
          <span class="brand-subtitle">Admin Panel</span>
        </div>
      </div>
    </div>

    <VDivider class="brand-divider" />

    <!-- Navigation -->
    <VList nav density="comfortable" class="nav-list">
      <!-- Dashboard -->
      <VListItem 
        :to="'/admin/dashboard'" 
        :active="isActivePath('/admin/dashboard')"
        class="nav-item"
        prepend-icon="mdi-view-dashboard-outline"
      >
        <VListItemTitle v-if="!isRail">Dashboard</VListItemTitle>
        <VTooltip v-if="isRail" text="Dashboard" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Users Group -->
      <VListGroup value="users" v-if="!isRail">
        <template #activator="{ props }">
          <VListItem v-bind="props" class="nav-item" prepend-icon="mdi-account-outline">
            <VListItemTitle>Users</VListItemTitle>
          </VListItem>
        </template>
        <VListItem 
          :to="'/admin/users'" 
          :active="isActivePath('/admin/users')"
          class="nav-subitem"
          prepend-icon="mdi-account-multiple"
        >
          <VListItemTitle>All Users</VListItemTitle>
        </VListItem>
      </VListGroup>

      <!-- Users (Rail mode) -->
      <VListItem 
        v-if="isRail"
        :to="'/admin/users'" 
        :active="isActivePath('/admin/users')"
        class="nav-item"
        prepend-icon="mdi-account-outline"
      >
        <VTooltip text="Users" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Roles -->
      <VListItem 
        :to="'/admin/roles'" 
        :active="isActivePath('/admin/roles')"
        class="nav-item"
        prepend-icon="mdi-account-badge-outline"
      >
        <VListItemTitle v-if="!isRail">Roles</VListItemTitle>
        <VTooltip v-if="isRail" text="Roles" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Classes -->
      <VListItem 
        :to="'/admin/classes'" 
        :active="isActivePath('/admin/classes')"
        class="nav-item"
        prepend-icon="mdi-google-classroom"
      >
        <VListItemTitle v-if="!isRail">Classes</VListItemTitle>
        <VTooltip v-if="isRail" text="Classes" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Groups -->
      <VListItem 
        :to="'/admin/groups'" 
        :active="isActivePath('/admin/groups')"
        class="nav-item"
        prepend-icon="mdi-account-group"
      >
        <VListItemTitle v-if="!isRail">Groups</VListItemTitle>
        <VTooltip v-if="isRail" text="Groups" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Professors -->
      <VListItem 
        :to="'/admin/profs'" 
        :active="isActivePath('/admin/profs')"
        class="nav-item"
        prepend-icon="mdi-account-tie-outline"
      >
        <VListItemTitle v-if="!isRail">Professors</VListItemTitle>
        <VTooltip v-if="isRail" text="Professors" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Schedules -->
      <VListItem 
        :to="'/admin/schedules'" 
        :active="isActivePath('/admin/schedules')"
        class="nav-item"
        prepend-icon="mdi-calendar-outline"
      >
        <VListItemTitle v-if="!isRail">Schedules</VListItemTitle>
        <VTooltip v-if="isRail" text="Schedules" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Leave Requests -->
      <VListItem 
        :to="'/admin/request_leave'" 
        :active="isActivePath('/admin/request_leave')"
        class="nav-item"
        prepend-icon="mdi-calendar-clock"
      >
        <VListItemTitle v-if="!isRail">Leave Requests</VListItemTitle>
        <VTooltip v-if="isRail" text="Leave Requests" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Reports -->
      <VListItem 
        :to="'/admin/reports'" 
        :active="isActivePath('/admin/reports')"
        class="nav-item"
        prepend-icon="mdi-chart-box-outline"
      >
        <VListItemTitle v-if="!isRail">Reports</VListItemTitle>
        <VTooltip v-if="isRail" text="Reports" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Backup -->
      <VListItem 
        :to="'/admin/backup'" 
        :active="isActivePath('/admin/backup')"
        class="nav-item"
        prepend-icon="mdi-backup-restore"
      >
        <VListItemTitle v-if="!isRail">Backup</VListItemTitle>
        <VTooltip v-if="isRail" text="Backup" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>

      <!-- Settings -->
      <VListItem 
        :to="'/admin/settings'" 
        :active="isActivePath('/admin/settings')"
        class="nav-item"
        prepend-icon="mdi-cog-outline"
      >
        <VListItemTitle v-if="!isRail">Settings</VListItemTitle>
        <VTooltip v-if="isRail" text="Settings" location="right">
          <template #activator="{ props }">
            <div v-bind="props" class="tooltip-trigger" />
          </template>
        </VTooltip>
      </VListItem>
    </VList>

    <!-- Footer Controls -->
    <template #append>
      <div class="sidebar-footer">
        <VBtn 
          @click="toggleRail"
          icon 
          variant="text" 
          class="rail-toggle-btn"
          :title="isRail ? 'Expand sidebar' : 'Collapse sidebar'"
        >
          <VIcon :icon="isRail ? 'mdi-chevron-double-right' : 'mdi-chevron-double-left'" />
        </VBtn>
      </div>
    </template>
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

const route = useRoute()
const { mdAndDown } = useDisplay()

// Props
interface Props {
  modelValue?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
  'toggle-rail': []
}>()

// State
const drawer = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value)
})

const isRail = ref(false)
const isMobile = computed(() => mdAndDown.value)

// Methods
const toggleRail = () => {
  isRail.value = !isRail.value
  emit('toggle-rail')
}

const isActivePath = (path: string) => {
  return route.path === path || route.path.startsWith(path + '/')
}
</script>

<style scoped>
.sidebar-custom {
  border-right: 1px solid rgba(var(--v-border-color), 0.12);
  background: white;
}

.brand-section {
  padding: 16px;
}

.brand-content {
  display: flex;
  align-items: center;
  gap: 12px;
  cursor: pointer;
  padding: 8px;
  border-radius: 8px;
  transition: background-color 0.2s;
}

.brand-content:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.brand-logo {
  flex-shrink: 0;
  background: rgba(var(--v-theme-primary), 0.1);
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-title {
  font-weight: 700;
  font-size: 1.25rem;
  line-height: 1.2;
  color: rgb(var(--v-theme-primary));
}

.brand-subtitle {
  font-size: 0.75rem;
  color: rgb(var(--v-theme-on-surface-variant));
  opacity: 0.8;
}

.brand-divider {
  margin: 0 16px 8px;
}

.nav-list {
  padding: 8px 12px;
}

.nav-item {
  margin-bottom: 4px;
  border-radius: 8px !important;
  min-height: 44px;
  transition: all 0.2s;
}

.nav-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.04);
}

.nav-item.v-list-item--active {
  background-color: rgba(var(--v-theme-primary), 0.08);
  color: rgb(var(--v-theme-primary));
}

.nav-subitem {
  margin-left: 16px;
  margin-bottom: 4px;
  border-radius: 6px !important;
  min-height: 40px;
}

.tooltip-trigger {
  position: absolute;
  inset: 0;
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid rgba(var(--v-border-color), 0.12);
  display: flex;
  justify-content: center;
}

.rail-toggle-btn {
  color: rgb(var(--v-theme-on-surface-variant));
}

/* Rail mode adjustments */
.v-navigation-drawer--rail .brand-content {
  justify-content: center;
}

.v-navigation-drawer--rail .nav-list {
  padding: 8px 4px;
}

.v-navigation-drawer--rail .nav-item {
  justify-content: center;
}
</style>