/**
 * Data transformation layer for Student objects
 * Maps between backend API format and frontend UI format
 */

/**
 * Transform backend student object to frontend format
 * @param {Object} backendStudent - Student object from backend API
 * @returns {Object} Frontend-formatted student object
 */
export const transformStudentFromBackend = (backendStudent) => {
  if (!backendStudent) return null;

  return {
    id: backendStudent.id,
    globalId: backendStudent.global_id,
    studentId: backendStudent.student_id || backendStudent.global_id,
    name:
      [backendStudent.first_name, backendStudent.last_name]
        .filter(Boolean)
        .join(" ") || "N/A",
    email: backendStudent.email,
    phone: backendStudent.phone_number || backendStudent.phone || "",
    firstName: backendStudent.first_name || "",
    lastName: backendStudent.last_name || "",
    gender: backendStudent.gender || "",
    dob: backendStudent.date_of_birth || backendStudent.dob || "",
    address: backendStudent.address || "",
    departmentId: backendStudent.department_id,
    generationId: backendStudent.generation_id,
    groupId: backendStudent.group_id,
    specializationId: backendStudent.specialization_id,
    generation:
      backendStudent.generation ||
      backendStudent.generation_id?.toString() ||
      "",
    group: backendStudent.group || backendStudent.group_id?.toString() || "",
    specialize:
      backendStudent.specialization ||
      backendStudent.specialization_id?.toString() ||
      "",
    status: backendStudent.active === 1 ? "Active" : "Inactive",
    active: backendStudent.active === 1,
    createdAt: backendStudent.created_at,
    updatedAt: backendStudent.updated_at,
  };
};

/**
 * Transform array of backend student objects to frontend format
 * @param {Array} backendStudents - Array of student objects from backend API
 * @returns {Array} Array of frontend-formatted student objects
 */
export const transformStudentsFromBackend = (backendStudents) => {
  if (!Array.isArray(backendStudents)) return [];
  return backendStudents.map(transformStudentFromBackend);
};

/**
 * Transform frontend student data to backend format for creation
 * Backend API requires: student_code, email, password, generation_id, group_id
 * @param {Object} frontendData - Student data from frontend form
 * @returns {Object} Backend-formatted student object
 */
export const transformStudentToBackend = (frontendData) => {
  if (!frontendData) return {};

  const hasBackendKeys =
    "student_code" in frontendData ||
    "first_name" in frontendData ||
    "phone_number" in frontendData ||
    "generation_id" in frontendData ||
    "group_id" in frontendData;

  if (hasBackendKeys) {
    const backendData = { ...frontendData };
    const normalizeId = (value) => {
      if (value === "" || value === null || typeof value === "undefined") {
        return undefined;
      }
      const num = Number(value);
      return Number.isNaN(num) ? undefined : num;
    };

    backendData.generation_id = normalizeId(backendData.generation_id);
    backendData.group_id = normalizeId(backendData.group_id);
    backendData.specialization_id = normalizeId(backendData.specialization_id);

    if (typeof backendData.generation_id === "undefined") {
      delete backendData.generation_id;
    }
    if (typeof backendData.group_id === "undefined") {
      delete backendData.group_id;
    }
    if (typeof backendData.specialization_id === "undefined") {
      delete backendData.specialization_id;
    }

    return backendData;
  }

  // Required fields for student creation
  const backendData = {
    student_code: frontendData.studentId || frontendData.studentCode,
    email: frontendData.email,
    password: frontendData.password,
    generation_id: Number(frontendData.generationId),
    group_id: Number(frontendData.groupId),
  };

  // Optional fields
  if (frontendData.firstName) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName) {
    backendData.last_name = frontendData.lastName;
  }

  if (frontendData.phone) {
    backendData.phone_number = frontendData.phone;
  }

  if (frontendData.dob) {
    backendData.dob = frontendData.dob;
  }

  if (frontendData.gender) {
    backendData.gender = frontendData.gender;
  }

  if (frontendData.address) {
    backendData.address = frontendData.address;
  }

  if (frontendData.groupId) {
    const groupId = Number(frontendData.groupId);
    if (!Number.isNaN(groupId)) {
      backendData.group_id = groupId;
    }
  }

  if (typeof frontendData.active !== "undefined") {
    backendData.active = frontendData.active;
  }

  // Debug log
  console.log("🔄 Transformer - Input:", frontendData);
  console.log("🔄 Transformer - Output:", backendData);

  return backendData;
};

/**
 * Transform frontend student data to backend format for updates
 * Backend PATCH API accepts optional fields
 * @param {Object} frontendData - Student data from frontend form
 * @returns {Object} Backend-formatted student object for update
 */
export const transformStudentUpdateToBackend = (frontendData) => {
  const backendData = {};

  // Include all updatable fields
  if (frontendData.firstName !== undefined) {
    backendData.first_name = frontendData.firstName;
  }

  if (frontendData.lastName !== undefined) {
    backendData.last_name = frontendData.lastName;
  }

  if (frontendData.email !== undefined) {
    backendData.email = frontendData.email;
  }

  if (frontendData.phone !== undefined) {
    backendData.phone = frontendData.phone;
  }

  if (frontendData.dob !== undefined) {
    backendData.date_of_birth = frontendData.dob;
  }

  if (frontendData.gender !== undefined) {
    backendData.gender = frontendData.gender;
  }

  if (frontendData.address !== undefined) {
    backendData.address = frontendData.address;
  }

  if (frontendData.departmentId !== undefined) {
    backendData.department_id = parseInt(frontendData.departmentId);
  }

  if (frontendData.generationId !== undefined) {
    backendData.generation_id = parseInt(frontendData.generationId);
  }

  if (frontendData.groupId !== undefined) {
    backendData.group_id = parseInt(frontendData.groupId);
  }

  if (frontendData.specializationId !== undefined) {
    backendData.specialization_id = parseInt(frontendData.specializationId);
  }

  return backendData;
};
