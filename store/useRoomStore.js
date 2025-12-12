import { defineStore } from 'pinia'

export const useRoomStore = defineStore('rooms', {
  state: () => ({
    rooms: [],
    loading: false,
    error: null,
  }),

  getters: {
    roomStats: (state) => {
      if (!state.rooms || state.rooms.length === 0) {
        return {
          total: 0,
          active: 0,
          inactive: 0,
          byType: {}
        }
      }

      return {
        total: state.rooms.length,
        active: state.rooms.filter(c => c.active).length,
        inactive: state.rooms.filter(c => !c.active).length,
        byType: state.rooms.reduce((acc, cls) => {
          const type = cls.classType || 'Unknown'
          acc[type] = (acc[type] || 0) + 1
          return acc
        }, {})
      }
    },

    getRoomById: (state) => (id) => {
      return state.rooms.find(cls => cls.id === id)
    },

    getRoomsByTerm: (state) => (termId) => {
      return state.rooms.filter(cls => cls.term_id === termId)
    },

    getRoomsByInstructor: (state) => (instructorId) => {
      return state.rooms.filter(cls => cls.instructor_id === instructorId)
    },

    activeRooms: (state) => {
      return state.rooms.filter(cls => cls.active)
    }
  },

  actions: {
    async fetchRooms() {
      this.loading = true
      this.error = null
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        console.log('Fetching rooms data...')
        
        // Fetch course offerings from the backend
        const response = await $AdminPrivateAxios.get('/course-offerings/')
        console.log('Course offerings response:', response.data)
        
        // The response structure is: { status: "success", data: [...] }
        const courseOfferings = response.data?.data || []
        console.log('Course offerings count:', courseOfferings.length)
        
        // Transform course offerings to room format
        this.rooms = courseOfferings.map(offering => this._transformCourseOffering(offering))
        console.log('Transformed rooms:', this.rooms)
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Fetch rooms failed:', err)
        console.error('Error details:', err.response?.data)
        // Fallback to mock data for development
        this.rooms = this._getMockRooms()
      } finally {
        this.loading = false
      }
    },

    _transformCourseOffering(offering) {
      // Transform backend course_offering to frontend class format
      return {
        id: offering.id,
        global_id: offering.global_id,
        subject: offering.subject?.name || 'Unknown Subject',
        code: offering.subject?.code || 'N/A',
        lecturerName: offering.instructor ? `${offering.instructor.first_name} ${offering.instructor.last_name}`.trim() : 'Unknown',
        assistantName: offering.assistant ? `${offering.assistant.first_name} ${offering.assistant.last_name}`.trim() : 'N/A',
        classType: this._determineClassType(offering.subject),
        year: offering.generation?.start_year || new Date().getFullYear(),
        term: offering.term?.term || 'N/A',
        group: offering.group?.group_name || 'N/A',
        generation: offering.generation?.generation || 'N/A',
        department: offering.subject?.specialization?.department?.name || 'Unknown',
        room: offering.room?.room || 'Not assigned',
        schedule: this._formatSchedule(offering.start_time, offering.end_time),
        students: offering.enrollments?.length || 0,
        attendance: 85, // TODO: Calculate from actual attendance data
        status: offering.active ? 'active' : 'inactive',
        active: offering.active,
        description: offering.description || '',
        created_at: offering.created_at,
        updated_at: offering.updated_at,
        // Keep original IDs for backend operations
        subject_id: offering.subject_id,
        instructor_id: offering.instructor_id,
        assistant_id: offering.assistant_id,
        term_id: offering.term_id,
        group_id: offering.group_id,
        generation_id: offering.generation_id,
        room_id: offering.room_id,
      }
    },

    _determineClassType(subject) {
      // Determine class type based on subject data
      if (!subject) return 'Theory Class'
      
      const name = subject.name?.toLowerCase() || ''
      const code = subject.code?.toLowerCase() || ''
      
      if (name.includes('lab') || code.includes('lab')) return 'Lab Class'
      if (name.includes('seminar')) return 'Seminar'
      if (name.includes('workshop')) return 'Workshop'
      if (name.includes('capstone') || name.includes('project')) return 'Capstone Project'
      
      return 'Theory Class'
    },

    _formatSchedule(startTime, endTime) {
      if (!startTime || !endTime) return 'Not scheduled'
      
      // Format time from timestamp
      const start = new Date(startTime)
      const end = new Date(endTime)
      
      const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
      const dayName = days[start.getDay()]
      
      const formatTime = (date) => {
        return date.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: false 
        })
      }
      
      return `${dayName} ${formatTime(start)}-${formatTime(end)}`
    },

    _getMockRooms() {
      // Mock data for development when API fails
      return [
        {
          id: 1,
          subject: 'Data Structures & Algorithms',
          code: 'CS301',
          lecturerName: 'Dr. John Smith',
          assistantName: 'Mr. Assistant',
          classType: 'Theory Class',
          year: 3,
          term: 1,
          group: 'A',
          generation: '11',
          department: 'Computer Science',
          room: 'CS-101',
          schedule: 'Mon 08:00-10:00',
          students: 45,
          attendance: 92,
          status: 'active',
          active: true
        },
        {
          id: 2,
          subject: 'Database Systems Lab',
          code: 'CS302L',
          lecturerName: 'Prof. Jane Doe',
          assistantName: 'Ms. Lab Assistant',
          classType: 'Lab Class',
          year: 3,
          term: 1,
          group: 'B',
          generation: '11',
          department: 'Computer Science',
          room: 'LAB-201',
          schedule: 'Wed 13:00-16:00',
          students: 40,
          attendance: 88,
          status: 'active',
          active: true
        }
      ]
    },

    async createRoom(payload) {
      this.loading = true
      this.error = null
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        // Transform frontend format to backend format
        const backendPayload = {
          subject_id: payload.subject_id,
          instructor_id: payload.instructor_id,
          assistant_id: payload.assistant_id,
          term_id: payload.term_id,
          group_id: payload.group_id,
          generation_id: payload.generation_id,
          room_id: payload.room_id,
          description: payload.description,
          start_time: payload.start_time,
          end_time: payload.end_time,
          status: 1, // 1=planned
          active: 1
        }
        
        const response = await $AdminPrivateAxios.post('/course-offerings/', backendPayload)
        const newOffering = response.data?.data
        
        if (newOffering) {
          const newRoom = this._transformCourseOffering(newOffering)
          this.rooms.unshift(newRoom)
        }
        
        return newOffering
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Create room failed:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async updateRoom(globalId, payload) {
      this.loading = true
      this.error = null
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        const backendPayload = {
          subject_id: payload.subject_id,
          instructor_id: payload.instructor_id,
          assistant_id: payload.assistant_id,
          term_id: payload.term_id,
          group_id: payload.group_id,
          generation_id: payload.generation_id,
          room_id: payload.room_id,
          description: payload.description,
          start_time: payload.start_time,
          end_time: payload.end_time,
        }
        
        const response = await $AdminPrivateAxios.patch(`/course-offerings/${globalId}`, backendPayload)
        const updatedOffering = response.data?.data
        
        if (updatedOffering) {
          const index = this.rooms.findIndex(c => c.global_id === globalId)
          if (index !== -1) {
            this.rooms[index] = this._transformCourseOffering(updatedOffering)
          }
        }
        
        return updatedOffering
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Update room failed:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    async deleteRoom(globalId) {
      this.loading = true
      this.error = null
      try {
        const { $AdminPrivateAxios } = useNuxtApp()
        
        // Set status to deleted (soft delete)
        await $AdminPrivateAxios.post(`/course-offerings/${globalId}/status`, { value: 2 })
        
        // Remove from local state
        this.rooms = this.rooms.filter(c => c.global_id !== globalId)
      } catch (err) {
        this.error = err.response?.data?.message || err.message
        console.error('Delete room failed:', err)
        throw err
      } finally {
        this.loading = false
      }
    },

    setRooms(rooms) {
      this.rooms = rooms
    },

    addRoomLocal(roomData) {
      this.rooms.unshift(roomData)
    },

    updateRoomLocal(id, updatedRoom) {
      const index = this.rooms.findIndex(c => c.id === id)
      if (index !== -1) {
        this.rooms[index] = { ...this.rooms[index], ...updatedRoom }
      }
    },

    removeRoomLocal(id) {
      this.rooms = this.rooms.filter(c => c.id !== id)
    }
  }
})
