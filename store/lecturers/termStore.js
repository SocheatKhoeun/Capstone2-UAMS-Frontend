import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerTermStore = defineStore('lecturerTerms', {
  state: () => ({
    terms: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allTerms: (s) => s.terms,
    activeTerms: (s) => s.terms.filter(t => t.active === true || t.active === 1),
    getById: (s) => (id) => s.terms.find(t => String(t.id) === String(id)),
    getByGlobalId: (s) => (gid) => s.terms.find(t => String(t.global_id) === String(gid)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.terms,
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
        term: item.term ?? item.name ?? '',
        active: item.active === true || item.active === 1 || String(item.active) === '1',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchTerms() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/terms/` : '/lecturer/auth/terms/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.terms = list.map(t => this._normalize(t))
        this.lastMessage = resData?.message || 'Terms retrieved'
        this.lastCode = resData?.code ?? 200
        return this.terms
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchTerms error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.terms = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
