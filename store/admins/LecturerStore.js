import { defineStore } from 'pinia'

export const useLecturerStore = defineStore('lecturer', {
  state: () => ({
    lecturers: [],
    loading: false,
    error: null
  }),

  getters: {
    activeLecturers: (state) => state.lecturers.filter(l => l.active === 1),
    inactiveLecturers: (state) => state.lecturers.filter(l => l.active === 0),
    getLecturerById: (state) => (id) => state.lecturers.find(l => l.id === id),
    getLecturerByGlobalId: (state) => (globalId) => state.lecturers.find(l => l.global_id === globalId)
  },

  actions: {
    async fetchLecturers() {
      this.loading = true
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.get('/instructors/')
        this.lecturers = response.data?.data || response.data?.items || []
        return { success: true, data: this.lecturers }
      } catch (error) {
        console.error('Fetch failed:', error.response?.data)
        this.error = error.response?.data?.message || 'Failed to fetch lecturers'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async createLecturer(lecturerData) {
      this.loading = true
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.post(
          '/instructors/',
          lecturerData
        )
        const created = response.data?.data || response.data
        this.lecturers.push(created)
        return { success: true, data: created }
      } catch (error) {
        console.error('Create failed:', error.response?.data)
        this.error = error.response?.data?.message || 'Failed to create'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateLecturer(globalId, lecturerData) {
      this.loading = true
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        console.log('Updating with payload:', lecturerData) // Debug
        const response = await $AdminPrivateAxios.patch(
          `/instructors/${globalId}`,  // ← FIXED: full path
          lecturerData
        )

        const updated = response.data?.data || response.data
        const index = this.lecturers.findIndex(l => l.global_id === globalId)
        if (index !== -1) {
          this.lecturers.splice(index, 1, updated)
        }

        return { success: true, data: updated }
      } catch (error) {
        console.error('Update failed:', error.response?.data)
        this.error = error.response?.data?.message || 'Failed to update lecturer'
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

   async toggleLecturerStatus(globalId, active) {
  this.loading = true
  try {
    const { $AdminPrivateAxios } = useNuxtApp()
    
    // Ensure value is numeric 1 or 0
    const payload = { value: active ? 1 : 0 }

    const response = await $AdminPrivateAxios.post(
      `/instructors/${globalId}/status`,
      payload
    )

    // Update local store
    const updated = response.data?.data || response.data
    const index = this.lecturers.findIndex(l => l.global_id === globalId)
    if (index !== -1) {
      this.lecturers.splice(index, 1, updated)
    }

    return { success: true, data: updated }
  } catch (error) {
    console.error('Toggle status failed:', error.response?.data)
    this.error = error.response?.data?.message || 'Failed to toggle status'
    return { success: false, error: this.error }
  } finally {
    this.loading = false
  }
}

  }
})