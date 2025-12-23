import { defineStore } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "#app";

export const useTermStore = defineStore("terms", {
  state: () => ({
    terms: [],
    loading: false,
    error: null,
  }),

  actions: {
    _normalize(term) {
      return {
        id: term.id ?? null,
        global_id: term.global_id ?? term.globalId ?? null,
        term: term.term ?? "",
        active:
          term.active === 1 || term.active === true || term.active === "1"
            ? 1
            : 0,
        created_at: term.created_at ?? term.createdAt ?? null,
        updated_at: term.updated_at ?? term.update_at ?? term.updatedAt ?? null,
        raw: term,
      };
    },

    _client(scope = "admin") {
      const nuxtApp = useNuxtApp();
      const config = useRuntimeConfig();
      let axiosInstance = nuxtApp?.$axios || null;
      let base = "";
      if (scope === "user") {
        axiosInstance = nuxtApp?.$UserPrivateAxios || axiosInstance;
        base = (config.public?.USER_PRIVATE_API || "").replace(/\/+$/, "");
      } else {
        axiosInstance = nuxtApp?.$AdminPrivateAxios || axiosInstance;
        base = (config.public?.ADMIN_PRIVATE_API || "").replace(/\/+$/, "");
      }
      return { client: axiosInstance, base };
    },

    async fetchTerms(options = {}) {
      this.loading = true;
      this.error = null;
      try {
        const { client, base } = this._client(options.scope);
        if (!client) throw new Error("Axios client not available");
        const path = options.scope === "user" ? "/user/terms/" : "/terms/";
        const res = await client.get(`${base}${path}`);
        const data = res?.data?.data ?? res?.data ?? [];
        const list = Array.isArray(data)
          ? data
          : Array.isArray(data.data)
            ? data.data
            : [];
        this.terms = list.map((term) => this._normalize(term));
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error("Fetch terms failed:", err);
      } finally {
        this.loading = false;
      }
    },

    async createTerm(payload) {
      this.loading = true;
      try {
        const { client, base } = this._client();
        const body = {
          ...payload,
          active: payload.active ? 1 : 0,
        };
        const res = await client.post(`${base}/terms/`, body);
        const created = res.data?.data ?? res.data;
        const normalized = this._normalize(created);
        this.terms.unshift(normalized);
        return normalized;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async updateTerm(globalId, payload) {
      this.loading = true;
      try {
        const { client, base } = this._client();
        const identifier = String(globalId ?? "");
        const body = {
          ...payload,
          active: payload.active ? 1 : 0,
        };

        let res;
        try {
          res = await client.patch(`${base}/terms/${identifier}/`, body);
        } catch (err) {
          if (err.response && [405, 401, 400].includes(err.response.status)) {
            res = await client.put(`${base}/terms/${identifier}/`, body);
          } else {
            throw err;
          }
        }

        const updated = res.data?.data ?? res.data;
        const normalized = this._normalize(updated);
        const idx = this.terms.findIndex(
          (term) =>
            String(term.id) === String(normalized.id) ||
            String(term.global_id) === String(normalized.global_id),
        );
        if (idx !== -1) this.terms.splice(idx, 1, normalized);
        return normalized;
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async deleteTerm(globalId) {
      this.loading = true;
      try {
        const { client, base } = this._client();
        if (!client) throw new Error("Axios client not available");
        const identifier = String(globalId ?? "");

        // Backend uses POST request to /{global_id}/delete (soft delete - sets status to 2)
        const res = await client.post(`${base}/terms/${identifier}/delete`);

        // Remove from local state
        this.terms = this.terms.filter(
          (term) => String(term.global_id) !== identifier,
        );
        return res;
      } catch (err) {
        this.error = err.response?.data?.message || err.message || String(err);
        throw err;
      } finally {
        this.loading = false;
      }
    },
  },
});
