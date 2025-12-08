import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useAdminDepartments = defineStore('adminDepartments', {
  state: () => ({
    departments: [],
    loading: false,
    error: null,
  }),

  actions: {
    _normalize(dep) {
      return {
        id: dep.id ?? null,
        global_id: dep.global_id ?? dep.globalId ?? null,
        name: dep.name ?? dep.department_name ?? '',
        active: dep.active === 1 || dep.active === true || dep.active === '1',
        created_at: dep.created_at ?? dep.createdAt ?? null,
        updated_at: dep.updated_at ?? dep.update_at ?? dep.updatedAt ?? null,
        raw: dep
      }
    },

    _client() {
      const nuxtApp = useNuxtApp()
      const config = useRuntimeConfig()
      const axiosInstance = nuxtApp?.$axios || nuxtApp?.$AdminPrivateAxios || null
      const base = (config.public?.ADMIN_PRIVATE_API || '').replace(/\/+$/, '')
      return { client: axiosInstance, base }
    },

    async fetchDepartments() {
      this.loading = true
      this.error = null
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const res = await client.get(`${base}/departments/`)
        const data = res?.data?.data ?? res?.data ?? []
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
        this.departments = list.map(dep => this._normalize(dep))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch departments failed:', err)
      } finally {
        this.loading = false
      }
    },

    async createDepartment(payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const body = { ...payload, active: payload.active ? 1 : 0 }
        const res = await client.post(`${base}/departments/`, body)
        const created = res.data?.data ?? res.data
        const normalized = this._normalize(created)
        this.departments.unshift(normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateDepartment(idOrGlobalId, payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const identifier = String(idOrGlobalId ?? '')
        const body = { ...payload, active: payload.active ? 1 : 0 }

        let res
        try {
          res = await client.patch(`${base}/departments/${identifier}/`, body)
        } catch (err) {
          if (err.response && [405, 401, 400].includes(err.response.status)) {
            res = await client.put(`${base}/departments/${identifier}/`, body)
          } else {
            throw err
          }
        }

        const updated = res.data?.data ?? res.data
        const normalized = this._normalize(updated)
        const idx = this.departments.findIndex(dep =>
          String(dep.id) === String(normalized.id) || String(dep.global_id) === String(normalized.global_id)
        )
        if (idx !== -1) this.departments.splice(idx, 1, normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteDepartment(idOrGlobalId) {
      this.loading = true
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const identifier = String(idOrGlobalId ?? '')

        const isNumericId = /^\d+$/.test(identifier)
        let res
        if (isNumericId) {
          res = await client.delete(`${base}/departments/${identifier}/`)
        } else {
          res = await client.post(`${base}/departments/${identifier}/delete`)
        }

        this.departments = this.departments.filter(dep =>
          String(dep.id) !== identifier && String(dep.global_id) !== identifier
        )
        return res
      } catch (err) {
        this.error = err.response?.data?.message || err.message || String(err)
        throw err
      } finally {
        this.loading = false
      }
    }
  }
})
