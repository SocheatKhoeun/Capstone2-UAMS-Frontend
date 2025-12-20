import { defineStore } from 'pinia'
import { useNuxtApp } from '#app'

export const classesStore = defineStore('classesStore', {
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

      return state.sessions
        .filter(session => {
          if (!session.start_datetime) return false
          const sessionDate = new Date(session.start_datetime)
          return sessionDate >= today && sessionDate < tomorrow
        })
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
    },

    upcomingSessions: (state) => {
      const now = Date.now()
      return state.sessions
        .filter(session => {
          if (!session.start_datetime) return false
          return new Date(session.start_datetime).getTime() > now
        })
        .sort((a, b) => new Date(a.start_datetime) - new Date(b.start_datetime))
    },
  },

  actions: {
    // Helper: get axios instance
    getAxiosInstance() {
      const nuxtApp = useNuxtApp()
      return nuxtApp.$UserPrivateAxios
    },

    // Normalize runtime base URL (remove trailing slashes)
    getNormalizedBase() {
      const cfg = useRuntimeConfig()
      return (cfg.public?.USER_PRIVATE_API || '').replace(/\/+$/, '')
    },

    // Try a list of paths sequentially until one succeeds
    async tryPaths(paths) {
      const axios = this.getAxiosInstance()
      let lastError = null
      for (const p of paths) {
        try {
          // If axios isn't available, fallback to fetch
          if (axios) {
            const res = await axios.get(p)
            return res
          } else {
            const url = p.startsWith('http') ? p : p
            const res = await fetch(url, { credentials: 'include' })
            const data = await res.json()
            return { data }
          }
        } catch (err) {
          lastError = err
          // continue on 404 or other errors to try next candidate
          if (err?.response?.status === 404) continue
        }
      }
      throw lastError || new Error('All attempted paths failed')
    },

    async fetchCourseOfferings() {
      this.loading = true
      this.error = null
      try {
        const base = this.getNormalizedBase()
        const candidates = [
          // Absolute URL first (bypasses axios.baseURL and avoids double /api/v1)
          base ? `${base}/lecturer/auth/course_offerings` : null,
          // Relative endpoints that rely on axios.baseURL
          '/lecturer/auth/course_offerings',
          '/api/v1/lecturer/auth/course_offerings'
        ].filter(Boolean)

        const res = await this.tryPaths(candidates)
        const payload = res.data?.data || res.data || {}
        this.courseOfferings = Array.isArray(payload) ? payload : (payload.items || [])
        return this.courseOfferings
      } catch (err) {
        console.error('Failed to fetch course offerings:', err)
        this.error = err?.response?.data?.message || err?.message || 'Failed to fetch course offerings'
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchSessions() {
      this.loading = true
      this.error = null
      try {
        const base = this.getNormalizedBase()
        const candidates = [
          base ? `${base}/lecturer/auth/sessions` : null,
          '/lecturer/auth/sessions',
          '/api/v1/lecturer/auth/sessions'
        ].filter(Boolean)

        const res = await this.tryPaths(candidates)
        const payload = res.data?.data || res.data || {}
        this.sessions = Array.isArray(payload) ? payload : (payload.items || [])
        return this.sessions
      } catch (err) {
        console.error('Failed to fetch sessions:', err)
        this.error = err?.response?.data?.message || err?.message || 'Failed to fetch sessions'
        throw err
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