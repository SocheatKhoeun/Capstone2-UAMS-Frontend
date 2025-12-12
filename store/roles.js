import { defineStore } from 'pinia'

export const useRoleStore = defineStore('roles', {
  state: () => ({
    roles: [],
    loading: false,
    error: null,
  }),

  getters: {
    roleStats: (state) => {
      if (!state.roles || state.roles.length === 0) {
        return {
          total: 0,
          active: 0,
          inactive: 0,
          byLevel: {}
        }
      }

      return {
        total: state.roles.length,
        active: state.roles.filter(r => r.is_active).length,
        inactive: state.roles.filter(r => !r.is_active).length,
        byLevel: state.roles.reduce((acc, role) => {
          acc[role.level] = (acc[role.level] || 0) + 1
          return acc
        }, {})
      }
    },

    getRoleById: (state) => (id) => {
      return state.roles.find(role => role.id === id)
    },

    getRolesByLevel: (state) => (level) => {
      return state.roles.filter(role => role.level === level)
    },

    activeRoles: (state) => {
      return state.roles.filter(role => role.is_active)
    }
  },

  actions: {
    async fetchRoles() {
      this.loading = true
      this.error = null
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        console.log('Fetching roles data...')
        
        // Fetch admins to get role statistics
        const adminResponse = await $AdminPrivateAxios.get('/admins/')
        console.log('Admin response:', adminResponse.data)
        
        // The response structure is: { status: "success", data: [...] }
        const admins = adminResponse.data?.data || []
        console.log('Admins count:', admins.length, 'Admins:', admins)
        
        // Try to fetch instructors count
        let instructorCount = 0
        try {
          const instructorResponse = await $AdminPrivateAxios.get('/instructors/')
          console.log('Instructor response:', instructorResponse.data)
          const instructors = instructorResponse.data?.data || []
          instructorCount = Array.isArray(instructors) ? instructors.length : (instructorResponse.data?.data?.total || 0)
          console.log('Instructor count:', instructorCount)
        } catch (err) {
          console.warn('Could not fetch instructors:', err.message)
        }
        
        // Try to fetch students count
        let studentCount = 0
        try {
          const studentResponse = await $AdminPrivateAxios.get('/students/')
          console.log('Student response:', studentResponse.data)
          const students = studentResponse.data?.data || []
          studentCount = Array.isArray(students) ? students.length : (studentResponse.data?.data?.total || 0)
          console.log('Student count:', studentCount)
        } catch (err) {
          console.warn('Could not fetch students:', err.message)
        }
        
        // Build role data from system configuration and admin statistics
        this.roles = this._buildRolesFromAdmins(admins, instructorCount, studentCount)
        console.log('Built roles:', this.roles)
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch roles failed:', err)
        console.error('Error details:', err)
        // Fallback to static roles if API fails
        this.roles = this._getStaticRoles()
      } finally {
        this.loading = false
      }
    },

    _buildRolesFromAdmins(admins, instructorCount = 0, studentCount = 0) {
      // Count users by role
      const roleCounts = {
        superadmin: 0,
        admin: 0
      }
      
      console.log('Building roles from admins:', admins)
      
      admins.forEach(admin => {
        console.log('Admin role:', admin.role, 'Active:', admin.active)
        if (admin.role && roleCounts[admin.role] !== undefined) {
          roleCounts[admin.role]++
        }
      })
      
      console.log('Role counts:', roleCounts)

      // Define system roles with actual counts
      return [
        {
          id: 1,
          name: 'Super Administrator',
          level: 'Admin',
          type: 'System',
          description: 'Full system access with all permissions',
          is_active: true,
          user_count: roleCounts.superadmin,
          permissions: [
            'users.create',
            'users.read',
            'users.update',
            'users.delete',
            'roles.manage',
            'system.configure',
            'groups.manage',
            'attendance.manage',
            'reports.generate',
            'admins.create',
            'admins.delete'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        {
          id: 2,
          name: 'Administrator',
          level: 'Admin',
          type: 'System',
          description: 'Administrative access to manage users and groups',
          is_active: true,
          user_count: roleCounts.admin,
          permissions: [
            'users.create',
            'users.read',
            'users.update',
            'groups.manage',
            'attendance.view',
            'reports.view',
            'students.manage',
            'instructors.manage'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        ...this._getStaticNonAdminRoles(instructorCount, studentCount)
      ]
    },

    _getStaticNonAdminRoles(instructorCount = 0, studentCount = 0) {
      // Static roles for non-admin users (Lecturers, Students, etc.)
      // These are not in the admins table but are part of the system
      return [
        {
          id: 3,
          name: 'Lecturer',
          level: 'Staff',
          type: 'Academic',
          description: 'Faculty member with teaching responsibilities',
          is_active: true,
          user_count: instructorCount,
          permissions: [
            'attendance.mark',
            'attendance.view',
            'students.view',
            'courses.view',
            'grades.manage'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        {
          id: 4,
          name: 'Assistant Lecturer',
          level: 'Staff',
          type: 'Academic',
          description: 'Teaching assistant with limited permissions',
          is_active: true,
          user_count: 0,
          permissions: [
            'attendance.mark',
            'attendance.view',
            'students.view',
            'courses.view'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        {
          id: 5,
          name: 'Student',
          level: 'Student',
          type: 'Academic',
          description: 'Enrolled student with view-only access',
          is_active: true,
          user_count: studentCount,
          permissions: [
            'attendance.view-own',
            'grades.view-own',
            'profile.view',
            'profile.update'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        }
      ]
    },

    _getStaticRoles() {
      // Fallback static roles if API fails
      return [
        {
          id: 1,
          name: 'Super Administrator',
          level: 'Admin',
          type: 'System',
          description: 'Full system access with all permissions',
          is_active: true,
          user_count: 0,
          permissions: [
            'users.create',
            'users.read',
            'users.update',
            'users.delete',
            'roles.manage',
            'system.configure',
            'groups.manage',
            'attendance.manage',
            'reports.generate'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        {
          id: 2,
          name: 'Administrator',
          level: 'Admin',
          type: 'System',
          description: 'Administrative access to manage users and groups',
          is_active: true,
          user_count: 0,
          permissions: [
            'users.create',
            'users.read',
            'users.update',
            'groups.manage',
            'attendance.view',
            'reports.view'
          ],
          created_at: new Date('2024-01-01'),
          updated_at: new Date('2024-01-01')
        },
        ...this._getStaticNonAdminRoles()
      ]
    },

    setRoles(roles) {
      this.roles = roles
    },

    addRole(role) {
      this.roles.unshift(role)
    },

    updateRole(id, updatedRole) {
      const index = this.roles.findIndex(role => role.id === id)
      if (index !== -1) {
        this.roles[index] = { ...this.roles[index], ...updatedRole }
      }
    },

    removeRole(id) {
      this.roles = this.roles.filter(role => role.id !== id)
    }
  }
})
