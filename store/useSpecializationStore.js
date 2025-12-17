import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useSpecializationStore = defineStore('specializations', {
  state: () => ({
    specializations: [],
    loading: false,
    error: null,
  }),

  actions: {
    _normalize(spec) {
      return {
        id: spec.id ?? null,
        global_id: spec.global_id ?? spec.globalId ?? null,
        name: spec.name ?? '',
        department_id: spec.department_id ?? spec.departmentId ?? null,
        active: spec.active === 1 || spec.active === true || spec.active === '1' ? 1 : 0,
        created_at: spec.created_at ?? spec.createdAt ?? null,
        updated_at: spec.updated_at ?? spec.update_at ?? spec.updatedAt ?? null,
        raw: spec
      }
    },

    _client() {
      const nuxtApp = useNuxtApp()
      const config = useRuntimeConfig()
      const axiosInstance = nuxtApp?.$axios || nuxtApp?.$AdminPrivateAxios || null
      const base = (config.public?.ADMIN_PRIVATE_API || '').replace(/\/+$/, '')
      return { client: axiosInstance, base }
    },

    async fetchSpecializations() {
      this.loading = true
      this.error = null
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const res = await client.get(`${base}/specializations/`)
        const data = res?.data?.data ?? res?.data ?? []
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
        this.specializations = list.map(spec => this._normalize(spec))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch specializations failed:', err)
      } finally {
        this.loading = false
      }
    },

    async createSpecialization(payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const body = { 
          ...payload, 
          active: payload.active ? 1 : 0 
        }
        const res = await client.post(`${base}/specializations/`, body)
        const created = res.data?.data ?? res.data
        const normalized = this._normalize(created)
        this.specializations.unshift(normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateSpecialization(globalId, payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const identifier = String(globalId ?? '')
        const body = { 
          ...payload, 
          active: payload.active ? 1 : 0 
        }

        let res
        try {
          res = await client.patch(`${base}/specializations/${identifier}/`, body)
        } catch (err) {
          if (err.response && [405, 401, 400].includes(err.response.status)) {
            res = await client.put(`${base}/specializations/${identifier}/`, body)
          } else {
            throw err
          }
        }

        const updated = res.data?.data ?? res.data
        const normalized = this._normalize(updated)
        const idx = this.specializations.findIndex(spec =>
          String(spec.id) === String(normalized.id) || String(spec.global_id) === String(normalized.global_id)
        )
        if (idx !== -1) this.specializations.splice(idx, 1, normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteSpecialization(globalId) {
      this.loading = true
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const identifier = String(globalId ?? '')

        // Backend uses POST request to /{global_id}/delete (soft delete - sets status to 2)
        const res = await client.post(`${base}/specializations/${identifier}/delete`)

        // Remove from local state
        this.specializations = this.specializations.filter(spec =>
          String(spec.global_id) !== identifier
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
