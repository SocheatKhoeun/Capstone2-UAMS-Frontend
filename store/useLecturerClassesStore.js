import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const useLecturerClassesStore = defineStore('lecturerClasses', {
  state: () => ({
    courseOfferings: [],
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    activeCourseOfferings: (state) => 
      state.courseOfferings.filter(co => co.active === 1 || co.active === true),
    
    todaySessions: (state) => {
      const today = new Date()
      today.setHours(0, 0, 0, 0)
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      
      return state.sessions.filter(session => {
        if (!session.start_datetime) return false
        const sessionDate = new Date(session.start_datetime)
        return sessionDate >= today && sessionDate < tomorrow
      }).sort((a, b) => {
        const dateA = new Date(a.start_datetime)
        const dateB = new Date(b.start_datetime)
        return dateA - dateB
      })
    },

    upcomingSessions: (state) => {
      const now = new Date()
      return state.sessions.filter(session => {
        if (!session.start_datetime) return false
        const sessionDate = new Date(session.start_datetime)
        return sessionDate > now
      }).sort((a, b) => {
        const dateA = new Date(a.start_datetime)
        const dateB = new Date(b.start_datetime)
        return dateA - dateB
      })
    },
  },

  actions: {
    getLecturerApiPath(endpoint) {
      // Try to get base URL from axios instance or runtime config
      try {
        const nuxtApp = useNuxtApp()
        const config = useRuntimeConfig()
        const baseUrl = config.public?.USER_PRIVATE_API || ''
        
        // If base URL ends with /user, replace it with /lecturer/auth
        if (baseUrl.endsWith('/user')) {
          const newBase = baseUrl.replace(/\/user$/, '/lecturer/auth')
          return `${newBase}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
        }
        
        // Otherwise, try to construct from base
        // Assume base is something like http://localhost:8000/api/v1/user
        // We need http://localhost:8000/api/v1/lecturer/auth
        if (baseUrl.includes('/api/v1/')) {
          const newBase = baseUrl.replace(/\/api\/v1\/[^/]+/, '/api/v1/lecturer/auth')
          return `${newBase}${endpoint.startsWith('/') ? endpoint : '/' + endpoint}`
        }
      } catch (err) {
        console.warn('Could not construct lecturer API path from config:', err)
      }
      
      // Fallback: use relative path (assumes axios base URL is set correctly)
      return endpoint.startsWith('/') ? endpoint : '/' + endpoint
    },

    async fetchCourseOfferings() {
      const { $UserPrivateAxios } = useNuxtApp()
      const config = useRuntimeConfig()
      const baseUrl = config.public?.USER_PRIVATE_API || ''
      
      this.loading = true
      this.error = null

      try {
        // Determine the correct base path
        let basePath = '/lecturer/auth'
        if (baseUrl.includes('/api/v1/user')) {
          basePath = '/api/v1/lecturer/auth'
        } else if (baseUrl.includes('/api/v1')) {
          basePath = '/api/v1/lecturer/auth'
        }

        // Try different path variations
        const paths = [
          `${basePath}/course_offerings`,
          '/lecturer/auth/course_offerings',
          '/api/v1/lecturer/auth/course_offerings'
        ]

        let response = null
        let lastError = null

        for (const path of paths) {
          try {
            response = await $UserPrivateAxios.get(path)
            console.log('Successfully fetched from:', path, response.data)
            break // Success, exit loop
          } catch (err) {
            lastError = err
            console.warn('Failed to fetch from:', path, err.response?.status, err.response?.data)
            // If 404, try next path
            if (err.response?.status === 404) {
              continue
            }
            // For other errors, try next path but keep the error
          }
        }

        if (!response) {
          throw lastError || new Error('Failed to fetch course offerings from all attempted paths')
        }

        const data = response.data?.data || response.data || {}
        this.courseOfferings = Array.isArray(data) ? data : (data.items || [])
        console.log('Course offerings loaded:', this.courseOfferings.length)
        return this.courseOfferings
      } catch (error) {
        console.error('Failed to fetch course offerings:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch course offerings'
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchSessions() {
      const { $UserPrivateAxios } = useNuxtApp()
      const config = useRuntimeConfig()
      const baseUrl = config.public?.USER_PRIVATE_API || ''
      
      this.loading = true
      this.error = null

      try {
        // Determine the correct base path
        let basePath = '/lecturer/auth'
        if (baseUrl.includes('/api/v1/user')) {
          basePath = '/api/v1/lecturer/auth'
        } else if (baseUrl.includes('/api/v1')) {
          basePath = '/api/v1/lecturer/auth'
        }

        const paths = [
          `${basePath}/sessions`,
          '/lecturer/auth/sessions',
          '/api/v1/lecturer/auth/sessions'
        ]

        let response = null
        let lastError = null

        for (const path of paths) {
          try {
            response = await $UserPrivateAxios.get(path)
            break
          } catch (err) {
            lastError = err
            if (err.response?.status === 404) {
              continue
            }
          }
        }

        if (!response) {
          throw lastError || new Error('Failed to fetch sessions from all attempted paths')
        }

        const data = response.data?.data || response.data || {}
        this.sessions = Array.isArray(data) ? data : (data.items || [])
        return this.sessions
      } catch (error) {
        console.error('Failed to fetch sessions:', error)
        this.error = error.response?.data?.message || error.message || 'Failed to fetch sessions'
        throw error
      } finally {
        this.loading = false
      }
    },

    getTokenFromCookie() {
      if (typeof document !== 'undefined') {
        const cookies = document.cookie.split(';')
        for (let cookie of cookies) {
          const [name, value] = cookie.trim().split('=')
          if (name === 'token') {
            return decodeURIComponent(value)
          }
        }
      }
      return null
    },

    clearError() {
      this.error = null
    },
  },
})

