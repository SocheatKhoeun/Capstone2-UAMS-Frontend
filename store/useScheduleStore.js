import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [],
    loading: false,
    error: null
  }),
  getters: {
    activeSchedules: (state) => state.schedules.filter(s => s.active),
    getScheduleById: (state) => (id) => state.schedules.find(s => s.id === id),
    getScheduleByGlobalId: (state) => (globalId) => state.schedules.find(s => s.global_id === globalId)
  },
  actions: {
    async fetchSchedules() {
      this.loading = true
      this.error = null

      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.get('/course_offerings/')

        this.schedules = response.data?.items || response.data?.data || []

        if (process.env.NODE_ENV === 'development') {
          console.log('Schedules loaded:', this.schedules.length)
        }

        return { success: true, data: this.schedules }
      } catch (error) {
        console.error('Failed to fetch schedules:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createSchedule(scheduleData) {
      this.loading = true
      this.error = null

      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.post('/course_offerings/', scheduleData)

        const createdSchedule = response.data?.data || response.data
        if (createdSchedule) {
          this.schedules.push(createdSchedule)
        }

        return { success: true, data: createdSchedule }
      } catch (error) {
        console.error('Failed to create schedule:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(globalId, scheduleData) {
      this.loading = true
      this.error = null

      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.patch(`/course_offerings/${globalId}`, scheduleData)

        const updatedSchedule = response.data?.data || response.data
        const index = this.schedules.findIndex(s => s.global_id === globalId)
        if (index !== -1 && updatedSchedule) {
          this.schedules.splice(index, 1, updatedSchedule)
        }

        return { success: true, data: updatedSchedule }
      } catch (error) {
        console.error('Failed to update schedule:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteSchedule(globalId) {
      this.loading = true
      this.error = null

      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        await $AdminPrivateAxios.post(`/course_offerings/${globalId}/delete`)

        this.schedules = this.schedules.filter(s => s.global_id !== globalId)

        return { success: true }
      } catch (error) {
        console.error('Failed to delete schedule:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})