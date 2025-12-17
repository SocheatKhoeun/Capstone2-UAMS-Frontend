import { defineStore } from 'pinia'

export const useScheduleStore = defineStore('schedule', {
  state: () => ({
    schedules: [],
    loading: false,
    error: null
  }),

  getters: {
    activeSchedules: (state) => state.schedules.filter(s => s.status === 'active'),
    getScheduleById: (state) => (id) => state.schedules.find(s => s.id === id)
  },

  actions: {
    async fetchSchedules() {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.get('/course_offerings/')
        
        this.schedules = response.data?.data || []
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Schedules loaded:', this.schedules.length)
        }
        
        return { success: true, data: this.schedules }
      } catch (error) {
        console.error('Failed to fetch schedules:', error.response?.data?.message || error.message)
        this.error = error.message
        return { success: false, error: error.message }
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
        
        // Add to local state
        if (response.data?.data) {
          this.schedules.push(response.data.data)
        }
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error('Failed to create schedule:', error.response?.data?.message || error.message)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(id, scheduleData) {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const identifier = scheduleData.global_id ? String(scheduleData.global_id) : String(id)
        
        const response = await $AdminPrivateAxios.patch(`/course_offerings/${identifier}`, scheduleData)
        
        // Update in local state
        const index = this.schedules.findIndex(s => s.id === id || s.global_id === scheduleData.global_id)
        if (index !== -1 && response.data?.data) {
          this.schedules[index] = response.data.data
        }
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error('Failed to update schedule:', error.response?.data?.message || error.message)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async deleteSchedule(id) {
      this.loading = true
      this.error = null
      
      const schedule = this.schedules.find(s => s.id === id)
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const identifier = schedule?.global_id ? String(schedule.global_id) : String(id)
        
        // Delete the schedule using POST method (backend expects POST to /course_offerings/{id}/delete)
        await $AdminPrivateAxios.post(`/course_offerings/${identifier}/delete`)
        
        // Remove from local state
        this.schedules = this.schedules.filter(s => s.id !== id && s.global_id !== schedule?.global_id)
        
        return { success: true }
      } catch (error) {
        console.error('Failed to delete schedule:', error.response?.data?.message || error.message)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateScheduleSlot(scheduleId, day, timeSlot, slotData) {
      try {
        const schedule = this.schedules.find(s => s.id === scheduleId)
        if (!schedule) {
          throw new Error('Schedule not found')
        }

        // Update the schedule_data for the specific day and time slot
        if (!schedule.schedule_data) {
          schedule.schedule_data = {}
        }
        if (!schedule.schedule_data[day]) {
          schedule.schedule_data[day] = []
        }

        // Update or add the slot
        const slotIndex = schedule.schedule_data[day].findIndex(slot => slot.time === timeSlot)
        if (slotIndex !== -1) {
          schedule.schedule_data[day][slotIndex] = { ...schedule.schedule_data[day][slotIndex], ...slotData }
        } else {
          schedule.schedule_data[day].push({ time: timeSlot, ...slotData })
        }

        // Update the schedule on the server
        return await this.updateSchedule(scheduleId, schedule)
      } catch (error) {
        console.error('Failed to update schedule slot:', error.message)
        return { success: false, error: error.message }
      }
    }
  }
})
