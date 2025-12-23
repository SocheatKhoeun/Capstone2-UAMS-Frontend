import { defineStore } from "pinia";
import { useNuxtApp, useRuntimeConfig } from "#app";

export const useStudentScheduleStore = defineStore("studentSchedule", {
  state: () => ({
    sessions: [],
    loading: false,
    error: null,
  }),

  getters: {
    // Get sessions for a specific date
    getSessionsByDate: (state) => (dateStr) => {
      return state.sessions.filter((s) => s.dateKey === dateStr);
    },

    // Get upcoming sessions
    upcomingSessions: (state) => {
      const now = new Date();
      return state.sessions
        .filter((s) => new Date(s.start_datetime) > now)
        .sort(
          (a, b) => new Date(a.start_datetime) - new Date(b.start_datetime),
        );
    },

    // Get today's sessions
    todaySessions: (state) => {
      const todayStr = new Date().toISOString().slice(0, 10);
      return state.sessions.filter((s) => s.dateKey === todayStr);
    },
  },

  actions: {
    _client() {
      const nuxtApp = useNuxtApp();
      const config = useRuntimeConfig();
      const axiosInstance =
        nuxtApp?.$UserPrivateAxios || nuxtApp?.$axios || null;
      const base = (
        config.public?.USER_PRIVATE_API ||
        config.public?.API_BASE_URL ||
        ""
      ).replace(/\/+$/, "");
      return { client: axiosInstance, base };
    },

    async fetchSchedule() {
      this.loading = true;
      this.error = null;
      try {
        const { client } = this._client();
        if (!client) throw new Error("Axios client not available");

        // Fetch student's sessions
        // This endpoint should return sessions for the logged-in student
        const res = await client.get("/user/sessions/");

        const rawData = res?.data?.data ?? res?.data ?? [];
        const items = Array.isArray(rawData) ? rawData : rawData.items || [];

        // Transform sessions to include computed fields
        this.sessions = items.map((session) => this._normalizeSession(session));
      } catch (err) {
        this.error = err.response?.data?.message || err.message;
        console.error("Fetch schedule failed:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    _normalizeSession(session) {
      // Extract date from start_datetime
      const startDate = new Date(session.start_datetime);
      const dateKey = startDate.toISOString().slice(0, 10);

      return {
        id: session.id,
        global_id: session.global_id,
        offering_id: session.offering_id,
        room_id: session.room_id,
        start_datetime: session.start_datetime,
        end_datetime: session.end_datetime,
        status: session.status || "planned",
        active: session.active,
        created_at: session.created_at,
        updated_at: session.updated_at,

        // Additional fields from joins (if backend provides them)
        subject_code: session.subject_code || "N/A",
        subject_name: session.subject_name || "Unknown Subject",
        room_name: session.room_name || null,
        instructor_name: session.instructor_name || "TBA",
        term_id: session.term_id || null,
        term_label: session.term_label || null,

        // Computed field for grouping
        dateKey,
      };
    },

    clearSchedule() {
      this.sessions = [];
      this.error = null;
    },
  },
});
