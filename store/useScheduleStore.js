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
      
      console.log("=== FETCHING SCHEDULES ===")
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.get('/course_offerings/')
        
        console.log("Schedules API response:", response)
        console.log("Schedules data:", response.data)
        
        this.schedules = response.data?.data || []
        
        console.log("Total schedules loaded:", this.schedules.length)
        console.log("Schedules list:", this.schedules)
        console.log("======================")
        
        return { success: true, data: this.schedules }
      } catch (error) {
        console.error("Failed to fetch schedules:", error)
        console.error("Error details:", error.response?.data)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async createSchedule(scheduleData) {
      this.loading = true
      this.error = null
      
      console.log("=== CREATING SCHEDULE ===")
      console.log("Schedule data:", scheduleData)
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.post('/course_offerings/', scheduleData)
        
        console.log("Create response:", response)
        console.log("Created schedule:", response.data)
        
        // Add to local state
        if (response.data?.data) {
          this.schedules.push(response.data.data)
          console.log("Schedule added to store. Total schedules:", this.schedules.length)
        }
        
        console.log("========================")
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error("Failed to create schedule:", error)
        console.error("Error details:", error.response?.data)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateSchedule(id, scheduleData) {
      this.loading = true
      this.error = null
      
      console.log("=== UPDATING SCHEDULE ===")
      console.log("Schedule ID:", id)
      console.log("Update data:", scheduleData)
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const identifier = scheduleData.global_id ? String(scheduleData.global_id) : String(id)
        
        console.log("Using identifier:", identifier)
        
        const response = await $AdminPrivateAxios.patch(`/course_offerings/${identifier}`, scheduleData)
        
        console.log("Update response:", response)
        console.log("Updated schedule:", response.data)
        
        // Update in local state
        const index = this.schedules.findIndex(s => s.id === id || s.global_id === scheduleData.global_id)
        if (index !== -1 && response.data?.data) {
          this.schedules[index] = response.data.data
          console.log("Schedule updated in store at index:", index)
        }
        
        console.log("========================")
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error("Failed to update schedule:", error)
        console.error("Error details:", error.response?.data)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async deleteSchedule(id) {
      this.loading = true
      this.error = null
      
      console.log("=== DELETE SCHEDULE OPERATION START ===")
      
      const schedule = this.schedules.find(s => s.id === id)
      console.log("Schedule to delete:", schedule)
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const identifier = schedule?.global_id ? String(schedule.global_id) : String(id)
        
        console.log("Using identifier:", identifier)
        console.log("DELETE request URL:", `/course_offerings/${identifier}/delete`)
        
        // Delete the schedule using POST method (backend expects POST to /course_offerings/{id}/delete)
        const response = await $AdminPrivateAxios.post(`/course_offerings/${identifier}/delete`)
        
        console.log("DELETE response:", response)
        console.log("DELETE response data:", response.data)
        console.log("DELETE SUCCESS - Schedule marked as deleted (status = 2)")
        
        // Remove from local state
        const schedulesBefore = this.schedules.length
        this.schedules = this.schedules.filter(s => s.id !== id && s.global_id !== schedule?.global_id)
        const schedulesAfter = this.schedules.length
        
        console.log(`Schedules count before: ${schedulesBefore}, after: ${schedulesAfter}`)
        console.log("Remaining schedules:", this.schedules)
        console.log("=== DELETE SCHEDULE OPERATION END ===")
        
        return { success: true }
      } catch (error) {
        console.error("=== DELETE SCHEDULE ERROR ===")
        console.error("Delete schedule error:", error)
        console.error("Error details:", error.response?.data)
        console.error("Error status:", error.response?.status)
        console.error("============================")
        
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async updateScheduleSlot(scheduleId, day, timeSlot, slotData) {
      console.log("=== UPDATING SCHEDULE SLOT ===")
      console.log("Schedule ID:", scheduleId)
      console.log("Day:", day)
      console.log("Time Slot:", timeSlot)
      console.log("Slot Data:", slotData)
      
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
        const result = await this.updateSchedule(scheduleId, schedule)
        
        console.log("Slot update result:", result)
        console.log("==============================")
        
        return result
      } catch (error) {
        console.error("Failed to update schedule slot:", error)
        return { success: false, error: error.message }
      }
    }
  }
})
