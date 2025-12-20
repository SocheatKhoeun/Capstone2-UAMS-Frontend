import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useLecturerGenerationStore = defineStore('lecturerGenerations', {
  state: () => ({
    generations: [],
    loading: false,
    error: null,
    lastMessage: '',
    lastCode: 0
  }),

  getters: {
    allGenerations: (s) => s.generations,
    activeGenerations: (s) => s.generations.filter(g => g.active === 1 || g.active === true),
    getById: (s) => (id) => s.generations.find(g => String(g.id) === String(id)),
    displayPayload: (s) => ({
      status: s.lastCode >= 200 && s.lastCode < 300 ? 'success' : (s.lastCode ? 'error' : 'unknown'),
      data: s.generations,
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

    _normalize(gen) {
      return {
        id: gen.id ?? null,
        global_id: gen.global_id ?? gen.globalId ?? '',
        generation: gen.generation ?? gen.generation_name ?? '',
        start_year: gen.start_year ?? gen.startYear ?? null,
        end_year: gen.end_year ?? gen.endYear ?? null,
        active: gen.active === 1 || gen.active === true || String(gen.active) === '1',
        created_at: gen.created_at ?? gen.createdAt ?? null,
        updated_at: gen.updated_at ?? gen.updatedAt ?? null,
        raw: gen
      }
    },

    async fetchGenerations() {
      this.loading = true
      this.error = null
      try {
        const { axiosInstance, base } = this._client()
        const endpoint = base ? `${base}/lecturer/auth/generations/` : '/lecturer/auth/generations/'
        let resData
        if (axiosInstance) {
          const r = await axiosInstance.get(endpoint)
          resData = r?.data
        } else {
          const r = await fetch(endpoint, { credentials: 'include' })
          resData = await r.json()
        }

        const list = Array.isArray(resData?.data) ? resData.data : (Array.isArray(resData) ? resData : [])
        this.generations = list.map(g => this._normalize(g))
        this.lastMessage = resData?.message || 'Generations retrieved'
        this.lastCode = resData?.code ?? 200
        return this.generations
      } catch (err) {
        this.error = err?.response?.data?.message || err?.message || String(err)
        this.lastMessage = this.error
        this.lastCode = err?.response?.status ?? 500
        console.error('fetchGenerations error:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    getDisplayPayload() {
      return this.displayPayload
    },

    clear() {
      this.generations = []
      this.loading = false
      this.error = null
      this.lastMessage = ''
      this.lastCode = 0
    }
  }
})
