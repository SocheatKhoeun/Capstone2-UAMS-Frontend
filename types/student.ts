/**
 * Student Type Definitions
 * Based on backend API schema
 */

export interface StudentOut {
  id: number;
  global_id: string;
  student_code: string;
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  dob?: string; // YYYY-MM-DD format
  email: string;
  phone_number?: string;
  address?: string;
  profile_image?: string; // Full URL to image
  generation_id?: number;
  group_id?: number;
  active: number; // 0 or 1
  created_at?: string;
  updated_at?: string;
}

export interface StudentCreateInput {
  student_code: string; // Required
  email: string; // Required
  password: string; // Required (8-32 characters)
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  dob?: string; // YYYY-MM-DD format
  phone_number?: string;
  address?: string;
  generation_id?: number;
  active?: number; // 0 or 1, defaults to 1
}

export interface StudentUpdateInput {
  student_code?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  gender?: "male" | "female" | "other";
  dob?: string;
  phone_number?: string;
  address?: string;
  generation_id?: number;
  group_id?: number;
  active?: number;
}

export interface StudentStatusUpdate {
  active: number; // 0 or 1
}
