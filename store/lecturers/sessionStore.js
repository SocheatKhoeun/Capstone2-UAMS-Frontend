import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerSessionStore = defineStore('lecturerSessions', {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allSessions: (s) => s.sessions,
    activeSessions: (s) => s.sessions.filter(x => x.active === true || x.active === 1),
    getById: (s) => (id) => s.sessions.find(x => String(x.id) === String(id)),
    getByOfferingId: (s) => (offeringId) => s.sessions.filter(x => String(x.offering_id) === String(offeringId)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.sessions,
      message: s.lastMessage || '',
      code: s.lastCode || 0
    })
  },

  actions: {
    _client() {
      const nuxtApp = useNuxtApp()
      const cfg = useRuntimeConfig()
      const base = (cfg.public?.USER_PRIVATE_API || '').replace(/\/+$/, '')
      const axiosInstance = nuxtApp?.$UserPrivateAxios || null
      return { axiosInstance, base }
    },

    _normalize(item) {
      return {
        id: item.id ?? null,
        global_id: item.global_id ?? item.globalId ?? '',
        offering_id: item.offering_id ?? item.offeringId ?? null,
        room_id: item.room_id ?? item.roomId ?? null,
        start_datetime: item.start_datetime ?? item.startDatetime ?? item.start_time ?? null,
        end_datetime: item.end_datetime ?? item.endDatetime ?? item.end_time ?? null,
        status: item.status ?? null,
        active: item.active === true || item.active === 1 || String(item.active) === 'true',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchSessions() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/sessions/` : '/lecturer/auth/sessions/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.sessions = list.map(i => this._normalize(i))
        this.lastMessage = resData?.message || 'Sessions retrieved'
        this.lastCode = resData?.code ?? 200
        return this.sessions
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchSessions error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // Add: create a new session (POST)
    async createSession(payload) {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/sessions/` : '/lecturer/auth/sessions/'
        let resData

        if (axiosInstance) {
          const r = await axiosInstance.post(endpoint, payload)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
          })
          resData = await r.json()
        }

        // backend may return created item under data
        const created = resData?.data ?? resData
        const normalized = this._normalize(created)
        // prepend to sessions list
        this.sessions.unshift(normalized)
        this.lastMessage = resData?.message || 'Session created'
        this.lastCode = resData?.code ?? 201
        return normalized
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('createSession error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.sessions = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
