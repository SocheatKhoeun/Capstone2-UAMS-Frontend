import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerScheduleStore = defineStore('lecturerSchedules', {
  state: () => ({
    schedules: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allSchedules: (s) => s.schedules,
    activeSchedules: (s) => s.schedules.filter(it => it.active === true || it.active === 1),
    getById: (s) => (id) => s.schedules.find(it => String(it.id) === String(id)),
    getByGlobalId: (s) => (gid) => s.schedules.find(it => String(it.global_id) === String(gid)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.schedules,
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
        group_id: item.group_id ?? item.groupId ?? null,
        subject_id: item.subject_id ?? item.subjectId ?? null,
        term_id: item.term_id ?? item.termId ?? null,
        room_id: item.room_id ?? item.roomId ?? null,
        instructor_id: item.instructor_id ?? item.instructorId ?? null,
        assistant_id: item.assistant_id ?? item.assistantId ?? null,
        generation_id: item.generation_id ?? item.generationId ?? null,
        description: item.description ?? '',
        start_time: item.start_time ?? item.startTime ?? null,
        end_time: item.end_time ?? item.endTime ?? null,
        status: item.status ?? null,
        active: item.active === true || item.active === 1 || String(item.active) === 'true',
        created_at: item.created_at ?? item.createdAt ?? null,
        updated_at: item.updated_at ?? item.updatedAt ?? null,
        raw: item
      }
    },

    async fetchSchedules() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/course_offerings/` : '/lecturer/auth/course_offerings/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.schedules = list.map(i => this._normalize(i))
        this.lastMessage = resData?.message || 'Course offerings retrieved'
        this.lastCode = resData?.code ?? 200
        return this.schedules
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchSchedules error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    clear() {
      this.schedules = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
