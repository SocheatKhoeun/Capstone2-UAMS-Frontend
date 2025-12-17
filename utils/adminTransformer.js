/**
 * Data transformation layer for Admin objects
 * Maps between backend API format and frontend UI format
 */

/**
 * Transform backend admin object to frontend format
 * @param {Object} backendAdmin - Admin object from backend API
 * @returns {Object} Frontend-formatted admin object
 */
export const transformAdminFromBackend = (backendAdmin) => {
  if (!backendAdmin) return null;

  return {
    id: backendAdmin.id,
    adminId: backendAdmin.global_id,
    name:
      [backendAdmin.first_name, backendAdmin.last_name]
        .filter(Boolean)
        .join(" ") || "N/A",
    email: backendAdmin.email,
    role: backendAdmin.role,
    // Handle both boolean (true/false) and integer (1/0) for active status
    status:
      backendAdmin.active === true || backendAdmin.active === 1
        ? "Active"
        : "Inactive",
    firstName: backendAdmin.first_name || "",
    lastName: backendAdmin.last_name || "",
    createdAt: backendAdmin.created_at,
    updatedAt: backendAdmin.updated_at,
  };
};

/**
 * Transform array of backend admin objects to frontend format
 * @param {Array} backendAdmins - Array of admin objects from backend API
 * @returns {Array} Array of frontend-formatted admin objects
 */
export const transformAdminsFromBackend = (backendAdmins) => {
  if (!Array.isArray(backendAdmins)) return [];
  return backendAdmins.map(transformAdminFromBackend);
};

/**
 * Transform frontend admin data to backend format for creation
 * @param {Object} frontendData - Admin data from frontend form
 * @returns {Object} Backend-formatted admin object
 */
export const transformAdminToBackend = (frontendData) => {
  const backendData = {
    email: frontendData.email,
    password: frontendData.password,
    role: frontendData.role || "admin",
  };

  // Optional fields
  if (frontendData.globalId || frontendData.adminId) {
    backendData.global_id = frontendData.globalId || frontendData.adminId;
  }

  if (frontendData.firstName) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName) {
    backendData.last_name = frontendData.lastName;
  }

  if (typeof frontendData.active !== "undefined") {
    backendData.active = frontendData.active;
  } else if (typeof frontendData.status === "string") {
    backendData.active = frontendData.status.toLowerCase() === "active";
  }

  return backendData;
};

/**
 * Transform frontend admin data to backend format for updates
 * Only includes fields that are being updated
 * @param {Object} frontendData - Admin data from frontend form
 * @returns {Object} Backend-formatted admin object for update
 */
export const transformAdminUpdateToBackend = (frontendData) => {
  const backendData = {};

  if (frontendData.email) {
    backendData.email = frontendData.email;
  }

  if (frontendData.password) {
    backendData.password = frontendData.password;
  }

  if (frontendData.role) {
    backendData.role = frontendData.role;
  }

  if (frontendData.firstName !== undefined) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName !== undefined) {
    backendData.last_name = frontendData.lastName;
  }

  if (typeof frontendData.active !== "undefined") {
    backendData.active = frontendData.active;
  } else if (typeof frontendData.status === "string") {
    backendData.active = frontendData.status.toLowerCase() === "active";
  }

  return backendData;
};

/**
 * Extract data from backend response
 * Handles wrapped responses with status/data structure
 * @param {Object} response - Axios response object
 * @returns {Object|Array} Extracted data
 */
export const extractBackendData = (response) => {
  // Handle wrapped response format: { status: "success", data: {...} }
  if (response.data && response.data.status === "success") {
    return response.data.data;
  }

  // Handle direct data response
  if (response.data) {
    return response.data;
  }

  return response;
};

/**
 * Handle backend error response
 * @param {Error} error - Error object from axios
 * @returns {String} User-friendly error message
 */
export const handleBackendError = (error) => {
  if (error.response) {
    // Server responded with error
    const errorData = error.response.data;

    if (errorData && errorData.message) {
      return errorData.message;
    }

    if (errorData && errorData.detail) {
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
        return "Admin not found.";
      case 409:
        return "Email already exists.";
      case 422:
        return "Validation error. Please check your input.";
      case 500:
        return "Server error. Please try again later.";
      default:
        return `Error: ${error.response.status}`;
    }
  } else if (error.request) {
    // Request made but no response
    return "No response from server. Please check your connection.";
  } else {
    // Something else happened
    return error.message || "An unexpected error occurred.";
  }
};

/**
 * Validate admin data before submission
 * @param {Object} adminData - Admin data to validate
 * @param {Boolean} isUpdate - Whether this is an update operation
 * @returns {Object} { valid: Boolean, errors: Array }
 */
export const validateAdminData = (adminData, isUpdate = false) => {
  const errors = [];

  // Email validation
  if (!isUpdate || adminData.email) {
    if (!adminData.email) {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(adminData.email)) {
      errors.push("Invalid email format");
    }
  }

  // Password validation
  if (!isUpdate || adminData.password) {
    if (!isUpdate && !adminData.password) {
      errors.push("Password is required");
    } else if (adminData.password) {
      if (adminData.password.length < 8) {
        errors.push("Password must be at least 8 characters");
      } else if (adminData.password.length > 32) {
        errors.push("Password must be less than 32 characters");
      }
    }
  }

  // Role validation
  if (!isUpdate || adminData.role) {
    if (!isUpdate && !adminData.role) {
      errors.push("Role is required");
    } else if (
      adminData.role &&
      !["admin", "superadmin"].includes(adminData.role)
    ) {
      errors.push('Role must be either "admin" or "superadmin"');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
