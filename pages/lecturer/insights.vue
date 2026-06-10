<template>
    <v-container>
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        <v-icon left>mdi-chart-bar</v-icon>
                        Class Insights & Analytics
                    </v-card-title>

                    <v-card-text>
                        <!-- Summary Cards -->
                        <v-row>
                            <v-col cols="12" md="3">
                                <v-card
                                    class="text-center"
                                    color="primary"
                                    dark
                                >
                                    <v-card-text>
                                        <v-icon large>mdi-account-group</v-icon>
                                        <h2>{{ insights.totalStudents }}</h2>
                                        <p>Total Students</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card
                                    class="text-center"
                                    color="success"
                                    dark
                                >
                                    <v-card-text>
                                        <v-icon large>mdi-percent</v-icon>
                                        <h2>
                                            {{ insights.averageAttendance }}%
                                        </h2>
                                        <p>Avg Attendance</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card
                                    class="text-center"
                                    color="warning"
                                    dark
                                >
                                    <v-card-text>
                                        <v-icon large>mdi-account-alert</v-icon>
                                        <h2>{{ insights.lowAttendance }}</h2>
                                        <p>Low Attendance</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="3">
                                <v-card class="text-center" color="info" dark>
                                    <v-card-text>
                                        <v-icon large>mdi-book-open</v-icon>
                                        <h2>{{ insights.totalClasses }}</h2>
                                        <p>Classes This Week</p>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Charts Section -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="8">
                                <v-card>
                                    <v-card-title
                                        >Attendance Trend</v-card-title
                                    >
                                    <v-card-text>
                                        <canvas
                                            ref="attendanceChart"
                                            width="400"
                                            height="200"
                                        ></canvas>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="4">
                                <v-card>
                                    <v-card-title
                                        >Class Distribution</v-card-title
                                    >
                                    <v-card-text>
                                        <canvas
                                            ref="classChart"
                                            width="200"
                                            height="200"
                                        ></canvas>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Performance Analysis -->
                        <v-row class="mt-4">
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title
                                        >Top Performing Students</v-card-title
                                    >
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item
                                                v-for="student in topStudents"
                                                :key="student.id"
                                            >
                                                <v-list-item-avatar>
                                                    <v-icon color="green"
                                                        >mdi-account-star</v-icon
                                                    >
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{
                                                        student.name
                                                    }}</v-list-item-title>
                                                    <v-list-item-subtitle
                                                        >{{
                                                            student.attendance
                                                        }}%
                                                        attendance</v-list-item-subtitle
                                                    >
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-chip
                                                        color="green"
                                                        small
                                                        >{{
                                                            student.grade
                                                        }}</v-chip
                                                    >
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                            <v-col cols="12" md="6">
                                <v-card>
                                    <v-card-title
                                        >Students Need Attention</v-card-title
                                    >
                                    <v-card-text>
                                        <v-list>
                                            <v-list-item
                                                v-for="student in needAttention"
                                                :key="student.id"
                                            >
                                                <v-list-item-avatar>
                                                    <v-icon color="red"
                                                        >mdi-account-alert</v-icon
                                                    >
                                                </v-list-item-avatar>
                                                <v-list-item-content>
                                                    <v-list-item-title>{{
                                                        student.name
                                                    }}</v-list-item-title>
                                                    <v-list-item-subtitle
                                                        >{{
                                                            student.attendance
                                                        }}%
                                                        attendance</v-list-item-subtitle
                                                    >
                                                </v-list-item-content>
                                                <v-list-item-action>
                                                    <v-btn
                                                        size="small"
                                                        color="primary"
                                                        @click="
                                                            contactStudent(
                                                                student.id,
                                                            )
                                                        "
                                                    >
                                                        Contact
                                                    </v-btn>
                                                </v-list-item-action>
                                            </v-list-item>
                                        </v-list>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>

                        <!-- Class Performance Table -->
                        <v-row class="mt-4">
                            <v-col>
                                <v-card>
                                    <v-card-title
                                        >Class Performance
                                        Overview</v-card-title
                                    >
                                    <v-card-text>
                                        <v-data-table
                                            :headers="classHeaders"
                                            :items="classPerformance"
                                            :items-per-page="10"
                                        >
                                            <template
                                                v-slot:item.attendance="{
                                                    item,
                                                }"
                                            >
                                                <v-chip
                                                    :color="
                                                        getAttendanceColor(
                                                            item.attendance,
                                                        )
                                                    "
                                                    small
                                                >
                                                    {{ item.attendance }}%
                                                </v-chip>
                                            </template>
                                        </v-data-table>
                                    </v-card-text>
                                </v-card>
                            </v-col>
                        </v-row>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from "vue";
import { useNuxtApp } from "#app";
import { useLecturerSessionStore } from "~/store/lecturers/sessionStore";
import { useLecturerScheduleStore } from "~/store/lecturers/scheduleStore";
import { useLecturerSubjectStore } from "~/store/lecturers/subjectStore";
import { useLecturerStudentsStore } from "~/store/lecturers/StudentsStore";

definePageMeta({
    layout: "lecturer",
});

const attendanceChart = ref(null);
const classChart = ref(null);

const sessionStore = useLecturerSessionStore();
const offeringStore = useLecturerScheduleStore();
const subjectStore = useLecturerSubjectStore();
const studentStore = useLecturerStudentsStore();

const attendanceRecords = ref([]);

const insights = reactive({
    totalStudents: 0,
    averageAttendance: 0,
    lowAttendance: 0,
    totalClasses: 0,
});

const classHeaders = [
    { title: "Class", key: "className" },
    { title: "Students", key: "studentCount" },
    { title: "Attendance", key: "attendance" },
    { title: "Avg Grade", key: "avgGrade" },
    { title: "Last Session", key: "lastSession" },
];

const classPerformance = ref([]);
const topStudents = ref([]);
const needAttention = ref([]);

const getAttendanceColor = (attendance) => {
    if (attendance >= 90) return "green";
    if (attendance >= 75) return "orange";
    return "red";
};

const contactStudent = (studentId) => {
    console.log("Contacting student:", studentId);
    // Implement contact functionality
};

const normalizeStatus = (status) => {
    if (!status) return "unknown";
    return String(status).toLowerCase();
};

const getWeekBounds = () => {
    const now = new Date();
    const day = now.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    const start = new Date(now);
    start.setDate(now.getDate() + diff);
    start.setHours(0, 0, 0, 0);
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
    return { start, end };
};

const fetchAttendance = async () => {
    const { $UserPrivateAxios } = useNuxtApp();
    const res = await $UserPrivateAxios.get("/lecturer/auth/attendance");
    const data = res?.data?.data || res?.data || [];
    attendanceRecords.value = Array.isArray(data) ? data : data.items || [];
};

const buildStats = () => {
    const studentStats = new Map();
    attendanceRecords.value.forEach((rec) => {
        const sid = rec.student_id;
        if (!sid) return;
        if (!studentStats.has(sid)) {
            studentStats.set(sid, { total: 0, attended: 0 });
        }
        const entry = studentStats.get(sid);
        entry.total += 1;
        const status = normalizeStatus(rec.status);
        if (["present", "late", "excused"].includes(status)) {
            entry.attended += 1;
        }
    });

    const totalAttendance = attendanceRecords.value.length;
    const totalAttended = attendanceRecords.value.filter((r) =>
        ["present", "late", "excused"].includes(normalizeStatus(r.status)),
    ).length;
    insights.averageAttendance = totalAttendance
        ? Math.round((totalAttended / totalAttendance) * 100)
        : 0;

    const low = Array.from(studentStats.entries()).filter(([, v]) => {
        if (!v.total) return false;
        return v.attended / v.total < 0.75;
    });
    insights.lowAttendance = low.length;

    insights.totalStudents = studentStore.students.length || studentStats.size;

    const { start, end } = getWeekBounds();
    insights.totalClasses = sessionStore.sessions.filter((s) => {
        if (!s.start_datetime) return false;
        const dt = new Date(s.start_datetime);
        return dt >= start && dt <= end;
    }).length;

    const studentNameById = new Map(
        studentStore.students.map((s) => [
            s.id,
            `${s.first_name || ""} ${s.last_name || ""}`.trim() ||
                s.student_code,
        ]),
    );

    const ranked = Array.from(studentStats.entries()).map(([sid, v]) => ({
        id: sid,
        name: studentNameById.get(sid) || `Student ${sid}`,
        attendance: v.total ? Math.round((v.attended / v.total) * 100) : 0,
    }));
    ranked.sort((a, b) => b.attendance - a.attendance);
    topStudents.value = ranked.slice(0, 3).map((s) => ({ ...s, grade: "A" }));
    needAttention.value = ranked
        .slice(-3)
        .reverse()
        .map((s) => ({ ...s, grade: "F" }));

    const classMap = new Map();
    attendanceRecords.value.forEach((rec) => {
        const session = sessionStore.sessions.find(
            (s) => String(s.id) === String(rec.session_id),
        );
        const offering = session
            ? offeringStore.schedules.find(
                  (o) => String(o.id) === String(session.offering_id),
              )
            : null;
        const subject = offering
            ? subjectStore.subjects.find(
                  (s) => String(s.id) === String(offering.subject_id),
              )
            : null;
        const className = subject?.name || subject?.subject_name || "Unknown";
        if (!classMap.has(className)) {
            classMap.set(className, {
                id: className,
                className,
                studentSet: new Set(),
                total: 0,
                attended: 0,
                lastSession: rec.created_at ? rec.created_at.split("T")[0] : "",
            });
        }
        const entry = classMap.get(className);
        entry.total += 1;
        entry.studentSet.add(rec.student_id);
        if (
            ["present", "late", "excused"].includes(normalizeStatus(rec.status))
        ) {
            entry.attended += 1;
        }
        if (rec.created_at && rec.created_at > entry.lastSession) {
            entry.lastSession = rec.created_at.split("T")[0];
        }
    });

    classPerformance.value = Array.from(classMap.values()).map((c) => ({
        id: c.id,
        className: c.className,
        studentCount: c.studentSet.size,
        attendance: c.total ? Math.round((c.attended / c.total) * 100) : 0,
        avgGrade: "N/A",
        lastSession: c.lastSession || "N/A",
    }));
};

onMounted(async () => {
    try {
        await Promise.all([
            sessionStore.fetchSessions(),
            offeringStore.fetchSchedules(),
            subjectStore.fetchSubjects(),
            studentStore.fetchStudents(),
        ]);
        await fetchAttendance();
        buildStats();
    } catch (err) {
        console.error("Failed to load insights data:", err);
    }

    if (attendanceChart.value) {
        console.log("Attendance chart canvas ready");
    }
    if (classChart.value) {
        console.log("Class chart canvas ready");
    }
});
</script>
