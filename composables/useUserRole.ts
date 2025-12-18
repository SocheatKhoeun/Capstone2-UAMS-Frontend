import { userAuth } from '~/store/userAuth'
import { adminAuth } from '~/store/adminAuth'

export const useUserRole = () => {
  const userStore = userAuth()
  const adminStore = adminAuth()

  const getUserRole = (): 'admin' | 'lecturer' | 'student' | 'default' => {
    try {
      const token = userStore.getToken() || adminStore.getToken()
      if (!token) return 'default'
      
      const parts = token.split('.')
      if (parts.length !== 3) return 'default'
      
      const payload = JSON.parse(atob(parts[1]))
      const user = userStore.getUser() as any
      const admin = adminStore.getAdmin() as any
      const roleRaw = (payload?.role || user?.role || admin?.role || '').toLowerCase()
      
      if (roleRaw.includes('admin')) return 'admin'
      if (roleRaw.includes('lecturer') || roleRaw.includes('assistant')) return 'lecturer'
      if (roleRaw.includes('student')) return 'student'
      
      return 'default'
    } catch (e) {
      console.error('Error determining user role:', e)
      return 'default'
    }
  }

  const getCurrentUser = () => {
    return userStore.getUser() || adminStore.getAdmin()
  }

  return {
    getUserRole,
    getCurrentUser
  }
}
