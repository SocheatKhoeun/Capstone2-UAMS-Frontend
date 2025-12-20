import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerClassesStore = defineStore('lecturerClasses', {
  state: () => ({
    courseOfferings: [],
    sessions: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allOfferings: (s) => s.courseOfferings,
    allSessions: (s) => s.sessions,
    getOfferingById: (s) => (id) => s.courseOfferings.find(o => String(o.id) === String(id) || String(o.global_id) === String(id))
  },

  actions: {
    _client() {
      const nuxtApp = useNuxtApp()
      const cfg = useRuntimeConfig()
      const base = (cfg.public?.USER_PRIVATE_API || '').replace(/\/+$/, '')
      const axiosInstance = nuxtApp?.$UserPrivateAxios || null
      return { axiosInstance, base }
    },

    _normalizeOffering(item) {
      return {
        id: item.id ?? null,
        global_id: item.global_id ?? item.globalId ?? '',
        subject: item.subject?.name || item.subject_name || item.name || 'Unknown',
        code: item.subject?.code || item.code || 'N/A',
        instructor_id: item.instructor_id ?? item.instructorId ?? null,
        group: item.group?.group_name || item.group_name || item.group || 'N/A',
        room: item.room?.room || item.room_name || item.room || null,
        term: item.term?.term || item.term_name || item.term || null,
        generation: item.generation?.generation || item.generation || null,
        active: item.active === true || item.active === 1,
        raw: item
      }
    },

    _normalizeSession(item) {
      return {
        id: item.id ?? null,
        global_id: item.global_id ?? item.globalId ?? '',
        offering_id: item.offering_id ?? item.offeringId ?? item.course_offering_id ?? null,
        room_id: item.room_id ?? item.roomId ?? null,
        start_datetime: item.start_datetime ?? item.start_time ?? null,
        end_datetime: item.end_datetime ?? item.end_time ?? null,
        status: item.status ?? null,
        active: item.active === true || item.active === 1,
        raw: item
      }
    },

    async fetchCourseOfferings() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/course_offerings/` : '/lecturer/auth/course_offerings/'
        let res
        if (axiosInstance) {
          res = await axiosInstance.get(endpoint)
          res = res?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          res = await r.json()
        }
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        this.courseOfferings = list.map(i => this._normalizeOffering(i))
        this.lastMessage = res?.message || 'Course offerings retrieved'
        this.lastCode = res?.code ?? 200
        return this.courseOfferings
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        throw err
      } finally {
        this.loading = false
      }
    },

    async fetchSessions() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/sessions/` : '/lecturer/auth/sessions/'
        let res
        if (axiosInstance) {
          res = await axiosInstance.get(endpoint)
          res = res?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          res = await r.json()
        }
        const list = Array.isArray(res?.data) ? res.data : (Array.isArray(res) ? res : [])
        this.sessions = list.map(i => this._normalizeSession(i))
        this.lastMessage = res?.message || 'Sessions retrieved'
        this.lastCode = res?.code ?? 200
        return this.sessions
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        throw err
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.courseOfferings = []
      this.sessions = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
