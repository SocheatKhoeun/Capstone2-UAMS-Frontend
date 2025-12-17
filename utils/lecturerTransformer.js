/**
 * Data transformation layer for Lecturer objects
 * Maps between backend API format and frontend UI format
 */

/**
 * Transform backend lecturer object to frontend format
 * @param {Object} backendLecturer - Lecturer object from backend API
 * @returns {Object} Frontend-formatted lecturer object
 */
export const transformLecturerFromBackend = (backendLecturer) => {
  if (!backendLecturer) return null;

  return {
    id: backendLecturer.id,
    lecturerId: backendLecturer.global_id,
    employeeId: backendLecturer.employee_id || backendLecturer.global_id,
    name:
      [backendLecturer.first_name, backendLecturer.last_name]
        .filter(Boolean)
        .join(" ") || "N/A",
    firstName: backendLecturer.first_name || "",
    lastName: backendLecturer.last_name || "",
    email: backendLecturer.email,
    phone: backendLecturer.phone_number || backendLecturer.phone || "",
    position: backendLecturer.position || "lecturer", // professor, lecturer, or assistant
    department:
      backendLecturer.department_name || backendLecturer.department || "",
    departmentId: backendLecturer.department_id,
    specialization: backendLecturer.specialization || "",
    status:
      backendLecturer.active === 1 || backendLecturer.active === true
        ? "Active"
        : "Inactive",
    active: backendLecturer.active === 1 || backendLecturer.active === true,
    courseCount: backendLecturer.course_count || 0, // Number of active courses
    createdAt: backendLecturer.created_at,
    updatedAt: backendLecturer.updated_at,
  };
};

/**
 * Transform array of backend lecturer objects to frontend format
 * @param {Array} backendLecturers - Array of lecturer objects from backend API
 * @returns {Array} Array of frontend-formatted lecturer objects
 */
export const transformLecturersFromBackend = (backendLecturers) => {
  if (!Array.isArray(backendLecturers)) return [];
  return backendLecturers.map(transformLecturerFromBackend);
};

/**
 * Transform frontend lecturer data to backend format for creation
 * @param {Object} frontendData - Lecturer data from frontend form
 * @returns {Object} Backend-formatted lecturer object
 */
export const transformLecturerToBackend = (frontendData) => {
  // Required fields for backend
  const backendData = {
    global_id: frontendData.lecturerId || frontendData.employeeId,
    email: frontendData.email,
    password: frontendData.password || "DefaultPass123!",
  };

  // Name fields - required
  if (frontendData.firstName) {
    backendData.first_name = frontendData.firstName;
  } else if (frontendData.name) {
    // If full name is provided, split it
    const nameParts = frontendData.name.trim().split(" ");
    backendData.first_name = nameParts[0];
    if (nameParts.length > 1) {
      backendData.last_name = nameParts.slice(1).join(" ");
    }
  }

  if (frontendData.lastName) {
    backendData.last_name = frontendData.lastName;
  }

  // Optional fields
  if (frontendData.position) {
    backendData.position = frontendData.position; // professor, lecturer, or assistant
  }

  if (frontendData.phone) {
    backendData.phone_number = frontendData.phone;
  }

  if (frontendData.departmentId) {
    backendData.department_id = frontendData.departmentId;
  }

  if (frontendData.specialization) {
    backendData.specialization = frontendData.specialization;
  }

  // Convert active status to boolean for backend
  if (typeof frontendData.active !== "undefined") {
    backendData.active = frontendData.active;
  } else if (typeof frontendData.status === "string") {
    backendData.active = frontendData.status.toLowerCase() === "active";
  }

  return backendData;
};

/**
 * Transform frontend lecturer data to backend format for updates
 * Only includes fields that are being updated
 * @param {Object} frontendData - Lecturer data from frontend form
 * @returns {Object} Backend-formatted lecturer object for update
 */
export const transformLecturerUpdateToBackend = (frontendData) => {
  const backendData = {};

  if (frontendData.email) {
    backendData.email = frontendData.email;
  }

  if (frontendData.password) {
    backendData.password = frontendData.password;
  }

  if (frontendData.position) {
    backendData.position = frontendData.position; // professor, lecturer, or assistant
  }

  // Name fields
  if (frontendData.firstName !== undefined) {
    backendData.first_name = frontendData.firstName;
  } else if (frontendData.name) {
    const nameParts = frontendData.name.trim().split(" ");
    backendData.first_name = nameParts[0];
    if (nameParts.length > 1) {
      backendData.last_name = nameParts.slice(1).join(" ");
    }
  }

  if (frontendData.lastName !== undefined) {
    backendData.last_name = frontendData.lastName;
  }

  if (frontendData.phone !== undefined) {
    backendData.phone_number = frontendData.phone;
  }

  if (frontendData.departmentId !== undefined) {
    backendData.department_id = frontendData.departmentId;
  }

  if (frontendData.specialization !== undefined) {
    backendData.specialization = frontendData.specialization;
  }

  // Convert active status to integer (1 or 0) for backend
  if (typeof frontendData.active !== "undefined") {
    backendData.active = frontendData.active ? 1 : 0;
  } else if (typeof frontendData.status === "string") {
    backendData.active = frontendData.status.toLowerCase() === "active" ? 1 : 0;
  }

  return backendData;
};

/**
 * Handle backend error response
 * @param {Error} error - Error object from axios
 * @returns {String} User-friendly error message
 */
export const handleLecturerError = (error) => {
  if (error.response) {
    const errorData = error.response.data;

    if (errorData && errorData.message) {
      return errorData.message;
    }

    if (errorData && errorData.detail) {
      if (Array.isArray(errorData.detail)) {
        return errorData.detail.map((err) => err.msg || err.message).join(", ");
      }
      return errorData.detail;
    }

    // HTTP status-based messages
    switch (error.response.status) {
      case 400:
        return "Invalid request. Please check your input.";
      case 401:
        return "Unauthorized. Please login again.";
      case 403:
        return "You do not have permission to perform this action.";
      case 404:
        return "Lecturer not found.";
      case 409:
        return "Email or Employee ID already exists.";
      case 422:
        return "Validation error. Please check your input.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Error: ${error.response.status}`;
    }
  } else if (error.request) {
    return "No response from server. Please check your connection.";
  } else {
    return error.message || "An unexpected error occurred.";
  }
};
