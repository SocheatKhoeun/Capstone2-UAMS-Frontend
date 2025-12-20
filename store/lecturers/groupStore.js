import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerGroupStore = defineStore('lecturerGroups', {
  state: () => ({
    groups: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allGroups: (s) => s.groups,
    activeGroups: (s) => s.groups.filter(g => g.active === 1 || g.active === true),
    getById: (s) => (id) => s.groups.find(g => String(g.id) === String(id)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.groups,
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

    _normalize(g) {
      return {
        id: g.id ?? null,
        global_id: g.global_id ?? g.globalId ?? '',
        group_name: g.group_name ?? g.name ?? '',
        active: g.active === 1 || g.active === true || String(g.active) === '1',
        created_at: g.created_at ?? g.createdAt ?? null,
        updated_at: g.updated_at ?? g.updatedAt ?? null,
        raw: g
      }
    },

    async fetchGroups() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/groups/` : '/lecturer/auth/groups/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.groups = list.map(g => this._normalize(g))
        this.lastMessage = resData?.message || 'Groups retrieved'
        this.lastCode = resData?.code ?? 200
        return this.groups
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchGroups error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.groups = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
