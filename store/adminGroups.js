import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useAdminGroups = defineStore('adminGroups', {
  state: () => ({
    groups: [],
    loading: false,
    error: null,
  }),

  actions: {
    _normalize(g) {
      return {
        id: g.id ?? null,
        global_id: g.global_id ?? g.globalId ?? null,
        group_name: g.group_name ?? g.groupName ?? '',
        active: g.active === 1 || g.active === true || g.active === '1',
        created_at: g.created_at ?? g.createdAt ?? null,
        updated_at: g.updated_at ?? g.update_at ?? g.updatedAt ?? null,
        raw: g
      }
    },

    _client() {
      const nuxtApp = useNuxtApp()
      const config = useRuntimeConfig()
      const axiosInstance = nuxtApp?.$axios || nuxtApp?.$AdminPrivateAxios || null
      const base = (config.public?.ADMIN_PRIVATE_API || '').replace(/\/+$/, '')
      return { client: axiosInstance, base }
    },

    async fetchGroups() {
      this.loading = true
      this.error = null
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const res = await client.get(`${base}/groups/`)
        const data = res?.data?.data ?? res?.data ?? []
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
        this.groups = list.map(g => this._normalize(g))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch groups failed:', err)
      } finally {
        this.loading = false
      }
    },

    async createGroup(payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const body = { ...payload, active: payload.active ? 1 : 0 }
        const res = await client.post(`${base}/groups/`, body)
        const created = res.data?.data ?? res.data
        const normalized = this._normalize(created)
        this.groups.unshift(normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateGroup(idOrGlobalId, payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const identifier = String(idOrGlobalId ?? '')
        const body = { ...payload, active: payload.active ? 1 : 0 }

        let res
        try {
          res = await client.patch(`${base}/groups/${identifier}/`, body)
        } catch (err) {
          if (err.response && (err.response.status === 405 || err.response.status === 401 || err.response.status === 400)) {
            res = await client.put(`${base}/groups/${identifier}/`, body)
          } else {
            throw err
          }
        }

        const updated = res.data?.data ?? res.data
        const normalized = this._normalize(updated)
        const idx = this.groups.findIndex(g =>
          String(g.id) === String(normalized.id) || String(g.global_id) === String(normalized.global_id)
        )
        if (idx !== -1) this.groups.splice(idx, 1, normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteGroup(idOrGlobalId) {
      this.loading = true
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const identifier = String(idOrGlobalId ?? '')

        const isNumericId = /^\d+$/.test(identifier)

        let res
        if (isNumericId) {
          res = await client.delete(`${base}/groups/${identifier}/`)
        } else {
          res = await client.post(`${base}/groups/${identifier}/delete`)
        }

        this.groups = this.groups.filter(g =>
          String(g.id) !== identifier && String(g.global_id) !== identifier
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