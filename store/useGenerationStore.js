import { defineStore } from 'pinia'

export const useGenerationStore = defineStore('generation', {
  state: () => ({
    generations: [],
    loading: false,
    error: null
  }),

  getters: {
    activeGenerations: (state) => state.generations.filter(g => g.active === 1),
    inactiveGenerations: (state) => state.generations.filter(g => g.active === 0),
    getGenerationById: (state) => (id) => state.generations.find(g => g.id === id),
    getGenerationByGlobalId: (state) => (globalId) => state.generations.find(g => g.global_id === globalId)
  },

  actions: {
    async fetchGenerations() {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.get('/generations/')
        
        this.generations = response.data?.data || []
        
        if (process.env.NODE_ENV === 'development') {
          console.log('Generations loaded:', this.generations.length)
        }
        
        return { success: true, data: this.generations }
      } catch (error) {
        console.error('Failed to fetch generations:', error.response?.data?.message || error.message)
        this.error = error.message
        return { success: false, error: error.message }
      } finally {
        this.loading = false
      }
    },

    async createGeneration(generationData) {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.post('/generations/', generationData)
        
        // Add to local state
        if (response.data?.data) {
          this.generations.push(response.data.data)
        }
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error('Failed to create generation:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async updateGeneration(globalId, generationData) {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.patch(`/generations/${globalId}`, generationData)
        
        // Update in local state
        const index = this.generations.findIndex(g => g.global_id === globalId)
        if (index !== -1 && response.data?.data) {
          this.generations[index] = response.data.data
          console.log("Generation updated in store at index:", index)
        }
        
        console.log("===========================")
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error("Failed to update generation:", error)
        console.error("Error details:", error.response?.data)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async deleteGeneration(globalId) {
      this.loading = true
      this.error = null
      
      console.log("=== DELETING GENERATION ===")
      console.log("Generation Global ID:", globalId)
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        // The backend sets status to 2 (deleted) instead of actually deleting
        const response = await $AdminPrivateAxios.post(`/generations/${globalId}/status`, { value: 2 })
        
        // Remove from local state
        const index = this.generations.findIndex(g => g.global_id === globalId)
        if (index !== -1) {
          this.generations.splice(index, 1)
        }
        
        return { success: true }
      } catch (error) {
        console.error('Failed to delete generation:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    },

    async setGenerationStatus(globalId, status) {
      this.loading = true
      this.error = null
      
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        const response = await $AdminPrivateAxios.post(`/generations/${globalId}/status`, { value: status })
        
        // Update in local state
        const index = this.generations.findIndex(g => g.global_id === globalId)
        if (index !== -1 && response.data?.data) {
          this.generations[index] = response.data.data
        }
        
        return { success: true, data: response.data?.data }
      } catch (error) {
        console.error('Failed to update generation status:', error.response?.data?.message || error.message)
        this.error = error.response?.data?.message || error.message
        return { success: false, error: this.error }
      } finally {
        this.loading = false
      }
    }
  }
})
