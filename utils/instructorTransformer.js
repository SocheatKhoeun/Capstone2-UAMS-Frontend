/**
 * Data transformation layer for Instructor objects
 * Maps between backend API format and frontend UI format
 */

/**
 * Transform backend instructor object to frontend format
 * @param {Object} backendInstructor - Instructor object from backend API
 * @returns {Object} Frontend-formatted instructor object
 */
export const transformInstructorFromBackend = (backendInstructor) => {
  if (!backendInstructor) return null;

  return {
    id: backendInstructor.id,
    globalId: backendInstructor.global_id,
    name:
      [backendInstructor.first_name, backendInstructor.last_name]
        .filter(Boolean)
        .join(" ") || "N/A",
    email: backendInstructor.email,
    phone: backendInstructor.phone_number || "",
    firstName: backendInstructor.first_name || "",
    lastName: backendInstructor.last_name || "",
    phoneNumber: backendInstructor.phone_number || "",
    position: backendInstructor.position || "",
    status: backendInstructor.active === 1 ? "Active" : "Inactive",
    active: backendInstructor.active === 1,
    createdAt: backendInstructor.created_at,
    updatedAt: backendInstructor.updated_at,
  };
};

/**
 * Transform array of backend instructor objects to frontend format
 * @param {Array} backendInstructors - Array of instructor objects from backend API
 * @returns {Array} Array of frontend-formatted instructor objects
 */
export const transformInstructorsFromBackend = (backendInstructors) => {
  if (!Array.isArray(backendInstructors)) return [];
  return backendInstructors.map(transformInstructorFromBackend);
};

/**
 * Transform frontend instructor data to backend format for creation
 * Backend API requires: email, password
 * Optional: first_name, last_name, phone_number, position, active
 * @param {Object} frontendData - Instructor data from frontend form
 * @returns {Object} Backend-formatted instructor object
 */
export const transformInstructorToBackend = (frontendData) => {
  // Required fields for instructor creation
  const backendData = {
    email: frontendData.email,
    password: frontendData.password,
  };

  // Optional fields
  if (frontendData.firstName) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName) {
    backendData.last_name = frontendData.lastName;
  }

  if (frontendData.phoneNumber || frontendData.phone) {
    backendData.phone_number = frontendData.phoneNumber || frontendData.phone;
  }

  if (frontendData.position) {
    backendData.position = frontendData.position;
  }

  if (frontendData.active !== undefined) {
    backendData.active = frontendData.active ? 1 : 0;
  }

  return backendData;
};

/**
 * Transform frontend instructor data to backend format for updates
 * All fields optional
 * @param {Object} frontendData - Instructor data from frontend form
 * @returns {Object} Backend-formatted instructor update object
 */
export const transformInstructorUpdateToBackend = (frontendData) => {
  const backendData = {};

  if (frontendData.email !== undefined) {
    backendData.email = frontendData.email;
  }

  if (frontendData.password !== undefined && frontendData.password !== "") {
    backendData.password = frontendData.password;
  }

  if (frontendData.firstName !== undefined) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName !== undefined) {
    backendData.last_name = frontendData.lastName;
  }

  if (frontendData.phoneNumber !== undefined || frontendData.phone !== undefined) {
    backendData.phone_number = frontendData.phoneNumber || frontendData.phone;
  }

  if (frontendData.position !== undefined) {
    backendData.position = frontendData.position;
  }

  if (frontendData.active !== undefined) {
    backendData.active = frontendData.active ? 1 : 0;
  }

  return backendData;
};

/**
 * Helper: Get status badge color
 * @param {string} status - "Active" or "Inactive"
 * @returns {string} Color code for badge
 */
export const getStatusColor = (status) => {
  return status === "Active" ? "success" : "error";
};

/**
 * Helper: Get status chip variant
 * @param {boolean} active - Active status
 * @returns {Object} Chip properties
 */
export const getStatusChipProps = (active) => {
  return {
    color: active ? "success" : "error",
    text: active ? "Active" : "Inactive",
    variant: "flat",
  };
};
