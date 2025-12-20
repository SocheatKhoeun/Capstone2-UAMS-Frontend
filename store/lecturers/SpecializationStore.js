import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerSpecializationStore = defineStore('lecturerSpecializations', {
  state: () => ({
    specializations: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allSpecializations: (s) => s.specializations,
    activeSpecializations: (s) => s.specializations.filter(sp => sp.active === true || sp.active === 1),
    getById: (s) => (id) => s.specializations.find(sp => String(sp.id) === String(id)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.specializations,
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
        name: item.name ?? item.specialization_name ?? '',
        department_id: item.department_id ?? item.departmentId ?? null,
        active: item.active === true || item.active === 1 || String(item.active) === 'true',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchSpecializations() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/specializations/` : '/lecturer/auth/specializations/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.specializations = list.map(i => this._normalize(i))
        this.lastMessage = resData?.message || 'Specializations retrieved'
        this.lastCode = resData?.code ?? 200
        return this.specializations
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchSpecializations error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.specializations = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
