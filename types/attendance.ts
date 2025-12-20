/**
 * Attendance Type Definitions
 * Types for attendance records and sessions
 */

export interface AttendanceRecord {
  id: number | string;
  student_id: string;
  student_name: string;
  status: "Present" | "Absent" | "Late" | "Excused";
  method: "Face Recognition" | "Manual" | "QR Code";
  checkin_time: string;
  checkout_time?: string;
  verification_status?: "Verified" | "Failed" | "Pending";
  similarity_score?: number;
  remarks?: string;
  session_id?: number | string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceSession {
  id: number | string;
  name: string;
  date: string;
  start_time: string;
  end_time: string;
  room: string;
  course_id?: number | string;
  course_name?: string;
  class_id?: number | string;
  class_name?: string;
  lecturer_id?: number | string;
  lecturer_name?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AttendanceStatistics {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  attendance_rate: number;
}

export interface AttendanceFilter {
  search?: string;
  status?: string;
  method?: string;
  date_from?: string;
  date_to?: string;
  class_id?: number | string;
  course_id?: number | string;
}

export interface AttendanceCreateInput {
  student_id: string | number;
  session_id: string | number;
  status: "Present" | "Absent" | "Late" | "Excused";
  method: "Face Recognition" | "Manual" | "QR Code";
  checkin_time: string;
  checkout_time?: string;
  verification_status?: "Verified" | "Failed" | "Pending";
  similarity_score?: number;
  remarks?: string;
}

export interface AttendanceUpdateInput {
  status?: "Present" | "Absent" | "Late" | "Excused";
  method?: "Face Recognition" | "Manual" | "QR Code";
  checkin_time?: string;
  checkout_time?: string;
  verification_status?: "Verified" | "Failed" | "Pending";
  similarity_score?: number;
  remarks?: string;
}
