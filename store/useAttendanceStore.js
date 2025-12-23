import { defineStore } from "pinia";

export const useAttendanceStore = defineStore("attendance", {
  state: () => ({
    attendances: [],
    loading: false,
    error: null,
    searchQuery: "",
    statusFilter: "",
    methodFilter: "",
  }),

  getters: {
    // Get attendance summary
    summary: (state) => {
      const total = state.attendances.length;
      const present = state.attendances.filter(
        (a) => a.status === "present",
      ).length;
      const late = state.attendances.filter((a) => a.status === "late").length;
      const absent = state.attendances.filter(
        (a) => a.status === "absent",
      ).length;
      const excused = state.attendances.filter(
        (a) => a.status === "excused",
      ).length;
      return { total, present, late, absent, excused };
    },

    // Get attendance rate
    attendanceRate: (state) => {
      const total = state.attendances.length;
      if (!total) return 0;
      const present = state.attendances.filter(
        (a) => a.status === "present",
      ).length;
      const late = state.attendances.filter((a) => a.status === "late").length;
      const excused = state.attendances.filter(
        (a) => a.status === "excused",
      ).length;
      return ((present + late + excused) / total) * 100;
    },

    // Get unique subjects
    subjects: (state) => {
      const subjectMap = new Map();
      state.attendances.forEach((a) => {
        if (a.subject_id && a.subject_name) {
          subjectMap.set(a.subject_id, {
            id: a.subject_id,
            code: a.subject_code,
            name: a.subject_name,
          });
        }
      });
      return Array.from(subjectMap.values());
    },
  },

  actions: {
    async fetchAttendance() {
      this.loading = true;
      this.error = null;

      try {
        const { $UserPrivateAxios } = useNuxtApp();
        const response = await $UserPrivateAxios.get("/user/attendance/");

        // Transform data to include session details
        this.attendances = response.data.data.map((item) => ({
          ...item,
          session_date: item.session?.start_datetime?.split("T")[0] || "",
          start_datetime: item.session?.start_datetime || "",
          end_datetime: item.session?.end_datetime || "",
          subject_id: item.session?.course_offering?.subject?.id || null,
          subject_code:
            item.session?.course_offering?.subject?.subject_code || "N/A",
          subject_name:
            item.session?.course_offering?.subject?.subject_name || "Unknown",
          group_name: item.session?.course_offering?.group?.group_name || null,
        }));

        return this.attendances;
      } catch (err) {
        console.error("Failed to fetch attendance:", err);
        this.error = err.message;
        this.attendances = [];
        throw err;
      } finally {
        this.loading = false;
      }
    },

    async createAttendance(data) {
      try {
        const { $UserPrivateAxios } = useNuxtApp();
        const response = await $UserPrivateAxios.post(
          "/user/attendance/",
          data,
        );

        // Refresh attendance list
        await this.fetchAttendance();

        return response.data;
      } catch (err) {
        console.error("Failed to create attendance:", err);
        throw err;
      }
    },

    setSearchQuery(query) {
      this.searchQuery = query;
    },

    setStatusFilter(status) {
      this.statusFilter = status;
    },

    setMethodFilter(method) {
      this.methodFilter = method;
    },
  },
});
