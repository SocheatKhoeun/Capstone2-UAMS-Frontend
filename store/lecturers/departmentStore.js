import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerDepartmentStore = defineStore('lecturerDepartments', {
  state: () => ({
    departments: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: null
  }),

  getters: {
    allDepartments: (state) => state.departments,
    activeDepartments: (state) => state.departments.filter(d => d.active === true),
    getById: (state) => (id) => state.departments.find(d => String(d.id) === String(id)),
    getByGlobalId: (state) => (gid) => state.departments.find(d => String(d.global_id) === String(gid)),
    // returns payload shaped like your example
    displayPayload: (state) => ({
      status: state.lastCode && state.lastCode >= 200 && state.lastCode < 300 ? 'success' : (state.lastCode ? 'error' : 'unknown'),
      data: state.departments,
      message: state.lastMessage || '',
      code: state.lastCode || 0
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

    _normalize(dep) {
      return {
        id: dep.id ?? null,
        global_id: dep.global_id ?? dep.globalId ?? '',
        name: dep.name ?? dep.department_name ?? '',
        active: dep.active === true || dep.active === 1 || String(dep.active) === 'true',
        created_at: dep.created_at ?? dep.createdAt ?? null,
        updated_at: dep.updated_at ?? dep.updatedAt ?? null,
        raw: dep
      }
    },

    async fetchDepartments() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/departments/` : '/lecturer/auth/departments/'
        let resData = null

        if (axiosInstance) {
          const res = await axiosInstance.get(endpoint)
          resData = res?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        // expected shape: { status, data: [...], message, code }
        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.departments = list.map(d => this._normalize(d))
        this.lastMessage = resData?.message || 'Departments retrieved'
        this.lastCode = resData?.code ?? 200
        return this.departments
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchDepartments error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    // convenience: return the full display payload immediately
    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.departments = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
