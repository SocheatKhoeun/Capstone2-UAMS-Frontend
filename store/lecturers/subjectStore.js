import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerSubjectStore = defineStore('lecturerSubjects', {
  state: () => ({
    subjects: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allSubjects: (s) => s.subjects,
    activeSubjects: (s) => s.subjects.filter(sub => sub.active === true || sub.active === 1),
    getById: (s) => (id) => s.subjects.find(sub => String(sub.id) === String(id)),
    getByGlobalId: (s) => (gid) => s.subjects.find(sub => String(sub.global_id) === String(gid)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.subjects,
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
        code: item.code ?? item.subject_code ?? '',
        specialization_id: item.specialization_id ?? item.specializationId ?? null,
        name: item.name ?? item.subject_name ?? '',
        description: item.description ?? '',
        credits: item.credits ?? item.credit_hours ?? item.credit ?? null,
        lecture_hours: item.lecture_hours ?? item.lectureHours ?? null,
        lab_hours: item.lab_hours ?? item.labHours ?? null,
        active: item.active === true || item.active === 1 || String(item.active) === '1',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchSubjects() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/subjects/` : '/lecturer/auth/subjects/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.subjects = list.map(s => this._normalize(s))
        this.lastMessage = resData?.message || 'Subjects retrieved'
        this.lastCode = resData?.code ?? 200
        return this.subjects
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchSubjects error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.subjects = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
