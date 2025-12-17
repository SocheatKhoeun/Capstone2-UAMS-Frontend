<template>
  <!-- Floating toggle on mobile -->
  <VBtn v-if="isMobile && !drawer" class="uas-fab" :style="fabStyle" icon size="large" :aria-label="'Open navigation'"
    @click="openDrawer()">
    <VIcon icon="mdi-menu" size="24" />
  </VBtn>

  <VNavigationDrawer v-model="drawer" app :permanent="!isMobile" :temporary="isMobile" :width="280" :rail="isRail"
    :rail-width="80" :location="side" class="uas-drawer"
    :class="side === 'right' ? 'uas-drawer--right' : 'uas-drawer--left'" elevation="3">
    <!-- Brand Section -->
    <div class="uas-brand-container" :class="{ 'uas-brand-container--rail': isRail }">
      <div class="uas-brand" @click="!isRail && $router.push('/')">
        <div class="uas-logo-wrapper">
          <VAvatar size="40" class="uas-logo">
            <VIcon icon="mdi-school" size="24" />
          </VAvatar>
        </div>

        <!-- Brand title only when expanded
          -->
        <Transition name="brand-text">
          <div class="uas-brand-text" v-if="!isRail">
            <span class="uas-title">UAMS</span>
            <div class="uas-title-underline"></div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- Navigation Menu -->
    <div class="uas-menu-wrapper">
      <VList nav density="comfortable" class="uas-navigation-list" v-model:opened="opened">
        <!-- Admin Navigation -->
        <template v-if="props.role === 'admin'">
          <!-- Dashboard -->
          <VListItem :to="'/admin/dashboard'" nav :active="isActivePath('/admin/dashboard')"
            :class="['uas-item', isActivePath('/admin/dashboard') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Dashboard" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-view-dashboard" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-view-dashboard" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Dashboard</VListItemTitle>
          </VListItem>

          <!-- User Management Section -->
          <div v-if="!isRail" class="uas-section-divider">
            <span class="uas-section-title">User Management</span>
          </div>

          <!-- Roles -->
          <VListItem :to="'/admin/roles'" nav :active="isActivePath('/admin/roles')"
            :class="['uas-item', isActivePath('/admin/roles') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Roles" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-shield-account" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-shield-account" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Roles</VListItemTitle>
          </VListItem>

          <!-- Users Group -->
          <VListGroup value="users" class="uas-group">
            <template #activator="{ props }">
              <VListItem v-bind="props" :active="isSectionActive('/admin/users')"
                :class="['uas-item', 'uas-group-item', isSectionActive('/admin/users') && 'uas-item--active']">
                <template #prepend>
                  <div class="uas-item-icon-wrapper">
                    <VTooltip v-if="isRail" text="Users" location="right" offset="8">
                      <template #activator="{ props: tip }">
                        <VIcon v-bind="tip" icon="mdi-account-group" class="uas-item-icon" />
                      </template>
                    </VTooltip>
                    <VIcon v-else icon="mdi-account-group" class="uas-item-icon" />
                  </div>
                </template>

                <VListItemTitle v-if="!isRail" class="uas-item-title">Users</VListItemTitle>

                <template #append>
                  <VIcon v-if="!isRail" icon="mdi-chevron-down"
                    :class="['uas-chevron', isUsersOpen && 'uas-chevron--open']" size="18" />
                </template>
              </VListItem>
            </template>

            <!-- User Sub-items -->
            <div class="uas-sub-items">
              <VListItem v-for="r in userRoles" :key="r.to" :to="r.to" nav :active="isActivePath(r.to)"
                :class="['uas-item', 'uas-sub-item', isActivePath(r.to) && 'uas-item--active']" @click="onClickItem">
                <template #prepend>
                  <div class="uas-item-icon-wrapper uas-sub-icon-wrapper">
                    <VTooltip v-if="isRail" :text="r.title" location="right" offset="8">
                      <template #activator="{ props: tip }">
                        <VIcon v-bind="tip" :icon="r.icon" class="uas-item-icon" size="18" />
                      </template>
                    </VTooltip>
                    <VIcon v-else :icon="r.icon" class="uas-item-icon" size="18" />
                  </div>
                </template>

                <VListItemTitle v-if="!isRail" class="uas-item-title uas-sub-title">
                  {{ r.title }}
                </VListItemTitle>
              </VListItem>
            </div>
          </VListGroup>

          <!-- Academic Section -->
          <div v-if="!isRail" class="uas-section-divider">
            <span class="uas-section-title">Academic</span>
          </div>

          <!-- Rooms -->
          <VListItem :to="'/admin/schedules'" nav :active="isActivePath('/admin/schedules')"
            :class="['uas-item', isActivePath('/admin/schedules') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Rooms" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-clock" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-clock" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Schedules</VListItemTitle>
          </VListItem>

          <!-- Professors -->
          <!-- <VListItem :to="'/admin/professor'" nav :active="isActivePath('/admin/professor')"
            :class="['uas-item', isActivePath('/admin/professor') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Professors" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-account-tie" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-account-tie" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Professors</VListItemTitle>
          </VListItem> -->

          <!-- Rooms -->
          <VListItem :to="'/admin/rooms'" nav :active="isActivePath('/admin/rooms')"
            :class="['uas-item', isActivePath('/admin/rooms') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Rooms" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-door" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-door" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Rooms</VListItemTitle>
          </VListItem>

          <VListItem :to="'/admin/departments'" nav :active="isActivePath('/admin/departments')"
            :class="['uas-item', isActivePath('/admin/departments') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Departments" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-account-group-outline" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-account-group-outline" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Departments</VListItemTitle>
          </VListItem>

          <!-- Groups -->
          <VListItem :to="'/admin/groups'" nav :active="isActivePath('/admin/groups')"
            :class="['uas-item', isActivePath('/admin/groups') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Groups" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-account-group-outline" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-account-group-outline" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Groups</VListItemTitle>
          </VListItem>

          <!-- Generations -->
          <VListItem :to="'/admin/generations'" nav :active="isActivePath('/admin/generations')"
            :class="['uas-item', isActivePath('/admin/generations') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Generations" location="right" offset="8">
                  <template #activator="{ props }">
<<<<<<< HEAD
                    <VIcon v-bind="props" icon="mdi-calendar-clock" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-clock" class="uas-item-icon" />
=======
                    <VIcon v-bind="props" icon="mdi-school-outline" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-school-outline" class="uas-item-icon" />
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Generations</VListItemTitle>
          </VListItem>

<<<<<<< HEAD
          <!-- Specializations -->
=======
          <!-- Specialization -->
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
          <VListItem :to="'/admin/specializations'" nav :active="isActivePath('/admin/specializations')"
            :class="['uas-item', isActivePath('/admin/specializations') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
<<<<<<< HEAD
                <VTooltip v-if="isRail" text="Specializations" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-certificate-outline" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-certificate-outline" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Specializations</VListItemTitle>
=======
                <VTooltip v-if="isRail" text="Specialization" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-star-settings" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-star-settings" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Specialization</VListItemTitle>
          </VListItem>

          <!-- Terms -->
          <VListItem :to="'/admin/terms'" nav :active="isActivePath('/admin/terms')"
            :class="['uas-item', isActivePath('/admin/terms') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Terms" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-text" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-text" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Terms</VListItemTitle>
          </VListItem>

          <!-- Subject -->
          <VListItem :to="'/admin/subjects'" nav :active="isActivePath('/admin/subjects')"
            :class="['uas-item', isActivePath('/admin/subjects') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Subjects" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-book-open-variant" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-book-open-variant" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Subjects</VListItemTitle>
>>>>>>> b84a0ed0d1bf92b8fcc356ce33140513c8ab5917
          </VListItem>

          <!-- Operations Section -->
          <div v-if="!isRail" class="uas-section-divider">
            <span class="uas-section-title">Operations</span>
          </div>

          <!-- Leave Requests -->
          <VListItem :to="'/admin/request-leave'" nav :active="isActivePath('/admin/request-leave')"
            :class="['uas-item', isActivePath('/admin/request-leave') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Leave Requests" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-remove" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-remove" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Leave Requests</VListItemTitle>
          </VListItem>

          <!-- Reports -->
          <VListItem :to="'/admin/reports'" nav :active="isActivePath('/admin/reports')"
            :class="['uas-item', isActivePath('/admin/reports') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Reports" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-chart-box" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-chart-box" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Reports</VListItemTitle>
          </VListItem>
        </template>

        <!-- Lecturer Navigation -->
        <template v-else-if="props.role === 'lecturer'">
          <!-- Dashboard -->
          <VListItem :to="'/lecturer/dashboard'" nav :active="isActivePath('/lecturer/dashboard')"
            :class="['uas-item', isActivePath('/lecturer/dashboard') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Dashboard" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-view-dashboard" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-view-dashboard" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Dashboard</VListItemTitle>
          </VListItem>

          <!-- Classes -->
          <VListItem :to="'/lecturer/classes'" nav :active="isActivePath('/lecturer/classes')"
            :class="['uas-item', isActivePath('/lecturer/classes') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Classes" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-google-classroom" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-google-classroom" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Classes</VListItemTitle>
          </VListItem>

          <!-- Insights -->
          <VListItem :to="'/lecturer/insights'" nav :active="isActivePath('/lecturer/insights')"
            :class="['uas-item', isActivePath('/lecturer/insights') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Insights" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-chart-line" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-chart-line" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Insights</VListItemTitle>
          </VListItem>

          <!-- Leave Request -->
          <VListItem :to="'/lecturer/schedule'" nav :active="isActivePath('/lecturer/schedule')"
            :class="['uas-item', isActivePath('/lecturer/schedule') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Leave Request" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-clock" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-clock" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Schedules</VListItemTitle>
          </VListItem>

          <!-- Leave Request -->
          <VListItem :to="'/lecturer/leave'" nav :active="isActivePath('/lecturer/leave')"
            :class="['uas-item', isActivePath('/lecturer/leave') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Leave Request" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-clock" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-remove" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Leave Request</VListItemTitle>
          </VListItem>

          <!-- Attendance -->
          <!-- <VListItem :to="'/lecturer/attendance'" nav :active="isActivePath('/lecturer/attendance')"
            :class="['uas-item', isActivePath('/lecturer/attendance') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Attendance" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-clock" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-clock" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Attendance</VListItemTitle>
          </VListItem> -->
        </template>

        <!-- Student Navigation -->
        <template v-else-if="props.role === 'student'">
          <!-- Dashboard -->
          <VListItem :to="'/student/dashboard'" nav :active="isActivePath('/student/dashboard')"
            :class="['uas-item', isActivePath('/student/dashboard') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Dashboard" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-view-dashboard" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-view-dashboard" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Dashboard</VListItemTitle>
          </VListItem>

          <!-- Schedule -->
          <VListItem :to="'/student/schedules'" nav :active="isActivePath('/student/schedules')"
            :class="['uas-item', isActivePath('/student/schedules') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Schedule" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Schedule</VListItemTitle>
          </VListItem>

          <!-- History -->
          <VListItem :to="'/student/historys'" nav :active="isActivePath('/student/historys')"
            :class="['uas-item', isActivePath('/student/historys') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="History" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-history" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-history" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">History</VListItemTitle>
          </VListItem>

          <!-- Attendance -->
          <VListItem :to="'/student/attendance'" nav :active="isActivePath('/student/attendance')"
            :class="['uas-item', isActivePath('/student/attendance') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Attendance" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-check-circle" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-check-circle" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Scan Attendance</VListItemTitle>
          </VListItem>

          <!-- Leave Request -->
          <VListItem :to="'/student/request-leaves'" nav :active="isActivePath('/student/request-leaves')"
            :class="['uas-item', isActivePath('/student/request-leaves') && 'uas-item--active']" @click="onClickItem">
            <template #prepend>
              <div class="uas-item-icon-wrapper">
                <VTooltip v-if="isRail" text="Leave Request" location="right" offset="8">
                  <template #activator="{ props }">
                    <VIcon v-bind="props" icon="mdi-calendar-remove" class="uas-item-icon" />
                  </template>
                </VTooltip>
                <VIcon v-else icon="mdi-calendar-remove" class="uas-item-icon" />
              </div>
            </template>
            <VListItemTitle v-if="!isRail" class="uas-item-title">Leave Request</VListItemTitle>
          </VListItem>
        </template>
      </VList>
    </div>

    <!-- Rail Expand Button (removed - using hamburger in brand) -->
  </VNavigationDrawer>
</template>

<script setup lang="ts">
import { ref, computed, watch, watchEffect, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useDisplay } from 'vuetify'

// Props
interface Props {
  modelValue?: boolean
  role?: 'admin' | 'lecturer' | 'student'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: true,
  role: 'admin'
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: boolean]
}>()

// Expose methods for parent components
defineExpose({
  toggleDrawer: () => toggleDrawer(),
  openDrawer: () => openDrawer(),
  collapseDrawer: () => collapseDrawer()
})

const route = useRoute()
const { mdAndDown } = useDisplay()

/* ---------- Actions ---------- */

const onClickItem = () => {
  if (isMobile.value) drawer.value = false
}


/* ---------- State ---------- */
const internalDrawer = ref(true)
const drawer = computed({
  get: () => props.modelValue && internalDrawer.value,
  set: (value) => {
    internalDrawer.value = value
    emit('update:modelValue', value)
  }
})
const collapsed = ref(false)             // desktop collapsed -> rail
const side = ref<'left' | 'right'>('left')
const openGroups = ref<{ users: boolean }>({ users: false })

/* ---------- Responsive ---------- */
const isMobile = computed(() => mdAndDown.value)
const isRail = computed(() => !isMobile.value && collapsed.value)

/* Normalize state when breakpoint changes */
watch(isMobile, (m) => {
  if (m) {
    internalDrawer.value = false        // start closed on mobile
    collapsed.value = false     // no rail on mobile
  } else {
    internalDrawer.value = true         // visible on desktop
  }
}, { immediate: true })

/* FAB position follows drawer side */
const fabStyle = computed(() =>
  side.value === 'left'
    ? { left: '16px', right: 'auto' }
    : { right: '16px', left: 'auto' }
)

/* ---------- Persistence ---------- */
const STORAGE_KEY = 'uas:sidebar'

onMounted(() => {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) {
      try {
        const { drawer: d, collapsed: c, side: s, openGroups: og } = JSON.parse(saved)
        if (typeof d === 'boolean') internalDrawer.value = d
        if (typeof c === 'boolean') collapsed.value = c
        if (s === 'left' || s === 'right') side.value = s
        if (og && typeof og.users === 'boolean') openGroups.value.users = og.users
      } catch { }
    }
  }
  // Auto-open Users when already under /user/*
  if (route.path.startsWith('/user') && !opened.value.includes('users')) {
    opened.value.push('users')
  }
})

let persistTimer: number | undefined
watch([internalDrawer, collapsed, side, openGroups], () => {
  if (typeof window === 'undefined') return
  clearTimeout(persistTimer)
  persistTimer = window.setTimeout(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        drawer: internalDrawer.value,
        collapsed: collapsed.value,
        side: side.value,
        openGroups: openGroups.value,
      })
    )
  }, 100)
}, { deep: true })

/* ---------- Actions ---------- */
const openDrawer = () => {
  internalDrawer.value = true;
  if (!isMobile.value) collapsed.value = false
}
const collapseDrawer = () => {
  if (!isMobile.value) collapsed.value = true
}
const expandDrawer = () => {
  if (!isMobile.value) collapsed.value = false;
  internalDrawer.value = true
}
const toggleDrawer = () => {
  if (isMobile.value) {
    internalDrawer.value = !internalDrawer.value
  } else {
    collapsed.value = !collapsed.value
    internalDrawer.value = true
  }
}

const opened = ref<(string | number)[]>([])
// convenience for the chevron
const isUsersOpen = computed(() => opened.value.includes('users'))
/* Close drawer on route change (mobile) */
watch(() => route.fullPath, () => { if (isMobile.value) internalDrawer.value = false })
/* Active helpers */
const isActivePath = (base: string) =>
  route.path === base || route.path.startsWith(base + '/')
const isSectionActive = (base: string) =>
  route.path === base || route.path.startsWith(base + '/')
/* ---------- Menu: Users sub-roles ---------- */
const userRoles = [
  { title: 'Admin', icon: 'mdi-shield-account-outline', to: '/admin/admins' },
  { title: 'Student', icon: 'mdi-school-outline', to: '/admin/student' },
  { title: 'Lecturer', icon: 'mdi-account-tie-outline', to: '/admin/lecturer' },
]
</script>
<style scoped>
/* Drawer baseline (theme-aware) */
.uas-drawer {
  background: rgb(var(--v-theme-surface));
}

/* Brand */
.uas-brand-container {
  border-bottom: 2px solid rgba(var(--v-theme-outline-variant), 0.5);
  background-color: rgb(239, 239, 239);
}

.uas-brand {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 20px;
  cursor: pointer;
}

.uas-logo {
  border-radius: 12px;
  background: color-mix(in srgb, rgb(var(--v-theme-primary)) 10%, transparent);
  color: rgb(var(--v-theme-primary));
}

.uas-brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}


.uas-title {
  font-size: 20px;
  font-weight: normal;
}

.uas-title-underline {
  width: 100%;
  height: 2px;
  background-color: rgb(var(--v-theme-primary));
  margin-top: 2px;
}

.uas-version {
  font-size: 12px;
  color: rgb(var(--v-theme-on-surface-variant, 130, 130, 130));
}

/* Items */
.uas-item {
  margin: 10px 6px;
  border-radius: 5px;
  padding-left: 10px;
  min-height: 52px;
  transition: background 0.2s, color 0.2s;
  color: rgb(var(--v-theme-primary));
}

/* Section dividers - blue underline FIRST, then title text */
.uas-section-divider {
  padding: 8px 16px 4px 16px;
  margin-top: 12px;
  margin-bottom: 0;
  position: relative;
}

.uas-section-title {
  display: block;
  font-size: 16px;
  font-weight: 700;
  color: rgb(var(--v-theme-on-surface));
  opacity: 0.7;
  text-transform: uppercase;
  letter-spacing: 0.3px;
  margin-bottom: 8px;
  padding-top: 8px;
  position: relative;
}

.uas-section-title::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: rgb(var(--v-theme-primary));
  opacity: 0.8;
  border-radius: 1px;
}

/* Fix spacing between icon and text */
.uas-item :deep(.v-list-item__prepend) {
  margin-inline-end: 16px !important;
}

.uas-item :deep(.v-icon) {
  color: rgb(var(--v-theme-primary));
}

.uas-item-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  margin-right: 4px;
}

.uas-sub-icon-wrapper {
  margin-left: 8px;
}

.uas-item-title {
  font-size: 16px;
  font-weight: 500;
}

.uas-sub-title {
  margin-left: 8px;
}

.uas-item--active {
  background: rgb(var(--v-theme-primary));
  color: white;
}

.uas-item--active :deep(.v-icon) {
  color: white;
}

.uas-item:hover {
  background: color-mix(in srgb,
      rgb(var(--v-theme-on-surface)) 12%,
      transparent);
  color: rgb(var(--v-theme-primary));
}

.uas-item:hover :deep(.v-icon) {
  color: rgb(var(--v-theme-primary));
}

/* Footer strip like ChatGPT */
.uas-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px;
}

.uas-footer-btn {
  margin: 4px;
}

/* Chevron rotation for groups */
.uas-chevron,
.uas-chevron,
.uas-chevron--open {
  transition: transform 0.2s ease;
}

.uas-chevron--open {
  transform: rotate(90deg);
}

/* Floating action button on mobile */
.uas-fab {
  position: fixed;
  z-index: 9999;
  bottom: 16px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.25);
}

/* Right-side tweaks */
.uas-drawer--right .uas-item {
  padding-left: 16px;
  padding-right: 10px;
}

/* Hide scrollbar inside the navigation drawer */
/* Hide the drawer's default scrollbar for cleaner look */
:deep(.v-navigation-drawer__content) {
  overflow-y: auto !important;
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--v-theme-on-surface-variant), 0.3) transparent;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar) {
  width: 6px;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-thumb) {
  background: rgba(var(--v-theme-on-surface-variant), 0.3);
  border-radius: 3px;
}

:deep(.v-navigation-drawer__content::-webkit-scrollbar-track) {
  background: transparent;
}

/* Prevent inner list from creating its own scrollbar during group expand */
:deep(.v-navigation-drawer__content .v-list) {
  overflow: visible;
  /* let the group expand without a nested scroller */
}
</style>