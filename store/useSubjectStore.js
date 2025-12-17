import { defineStore } from 'pinia'
import { useNuxtApp, useRuntimeConfig } from '#app'

export const useSubjectStore = defineStore('subjects', {
  state: () => ({
    subjects: [],
    loading: false,
    error: null,
  }),

  actions: {
    _normalize(subject) {
      return {
        id: subject.id ?? null,
        global_id: subject.global_id ?? subject.globalId ?? null,
        subject_code: subject.code ?? subject.subject_code ?? subject.subjectCode ?? '',
        subject_name: subject.name ?? subject.subject_name ?? subject.subjectName ?? '',
        description: subject.description ?? '',
        credit_hours: subject.credits ?? subject.credit_hours ?? subject.creditHours ?? 3,
        lecture_hours: subject.lecture_hours ?? subject.lectureHours ?? 0,
        lab_hours: subject.lab_hours ?? subject.labHours ?? 0,
        department_id: subject.specialization_id ?? subject.department_id ?? subject.departmentId ?? null,
        is_active: subject.active === 1 || subject.active === true || subject.is_active === 1 || subject.is_active === true || subject.is_active === '1' ? true : false,
        created_at: subject.created_at ?? subject.createdAt ?? null,
        updated_at: subject.updated_at ?? subject.updatedAt ?? null,
        raw: subject
      }
    },

    _client() {
      const nuxtApp = useNuxtApp()
      const config = useRuntimeConfig()
      const axiosInstance = nuxtApp?.$axios || nuxtApp?.$AdminPrivateAxios || null
      const base = (config.public?.ADMIN_PRIVATE_API || '').replace(/\/+$/, '')
      return { client: axiosInstance, base }
    },

    async fetchSubjects() {
      this.loading = true
      this.error = null
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const res = await client.get(`${base}/subjects/`)
        const data = res?.data?.data ?? res?.data ?? []
        const list = Array.isArray(data) ? data : (Array.isArray(data.data) ? data.data : [])
        this.subjects = list.map(subject => this._normalize(subject))
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch subjects failed:', err)
      } finally {
        this.loading = false
      }
    },

    async createSubject(payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const body = { 
          code: payload.subject_code,
          specialization_id: payload.department_id,
          name: payload.subject_name,
          description: payload.description || '',
          credits: payload.credit_hours,
          lecture_hours: payload.lecture_hours || 0,
          lab_hours: payload.lab_hours || 0,
          active: payload.is_active ? true : false 
        }
        const res = await client.post(`${base}/subjects/`, body)
        const created = res.data?.data ?? res.data
        const normalized = this._normalize(created)
        this.subjects.unshift(normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateSubject(globalId, payload) {
      this.loading = true
      try {
        const { client, base } = this._client()
        const identifier = String(globalId ?? '')
        const body = { 
          code: payload.subject_code,
          name: payload.subject_name,
          description: payload.description || '',
          credits: payload.credit_hours,
          lecture_hours: payload.lecture_hours || 0,
          lab_hours: payload.lab_hours || 0,
          specialization_id: payload.department_id,
          active: payload.is_active ? true : false 
        }

        let res
        try {
          res = await client.patch(`${base}/subjects/${identifier}`, body)
        } catch (err) {
          if (err.response && [405, 401, 400].includes(err.response.status)) {
            res = await client.put(`${base}/subjects/${identifier}`, body)
          } else {
            throw err
          }
        }

        const updated = res.data?.data ?? res.data
        const normalized = this._normalize(updated)
        const idx = this.subjects.findIndex(subject =>
          String(subject.id) === String(normalized.id) || String(subject.global_id) === String(normalized.global_id)
        )
        if (idx !== -1) this.subjects.splice(idx, 1, normalized)
        return normalized
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteSubject(globalId) {
      this.loading = true
      try {
        const { client, base } = this._client()
        if (!client) throw new Error('Axios client not available')
        const identifier = String(globalId ?? '')

        // Backend uses POST request to /{global_id}/delete (soft delete - sets status to 2)
        const res = await client.post(`${base}/subjects/${identifier}/delete`)

        // Remove from local state
        this.subjects = this.subjects.filter(subject =>
          String(subject.global_id) !== identifier
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