import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerStudentsStore = defineStore('lecturerStudents', {
  state: () => ({
    students: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allStudents: (s) => s.students,
    activeStudents: (s) => s.students.filter(st => st.active === 1 || st.active === true),
    getById: (s) => (id) => s.students.find(st => String(st.id) === String(id)),
    getByGlobalId: (s) => (gid) => s.students.find(st => String(st.global_id) === String(gid)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.students,
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
        student_code: item.student_code ?? item.studentCode ?? item.student_id ?? '',
        first_name: item.first_name ?? item.firstName ?? '',
        last_name: item.last_name ?? item.lastName ?? '',
        gender: item.gender ?? '',
        dob: item.dob ?? null,
        email: item.email ?? '',
        phone_number: item.phone_number ?? item.phoneNumber ?? '',
        address: item.address ?? '',
        profile_image: item.profile_image ?? item.avatar ?? '',
        generation_id: item.generation_id ?? item.generationId ?? null,
        active: item.active === 1 || item.active === true || String(item.active) === '1',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchStudents() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/students/` : '/lecturer/auth/students/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.students = list.map(s => this._normalize(s))
        this.lastMessage = resData?.message || 'Students retrieved successfully'
        this.lastCode = resData?.code ?? 200
        return this.students
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchStudents error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.students = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
