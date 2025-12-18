import { userAuth } from '~/store/userAuth'
import { adminAuth } from '~/store/adminAuth'

export default defineNuxtRouteMiddleware((to, from) => {
  const userStore = userAuth()
  const adminStore = adminAuth()

  try {
    const token = userStore.getToken() || adminStore.getToken()
    if (!token) {
      return navigateTo('/auth/login')
    }
    
    const parts = token.split('.')
    if (parts.length !== 3) {
      return navigateTo('/auth/login')
    }
    
    const payload = JSON.parse(atob(parts[1]))
    const user = userStore.getUser() as any
    const admin = adminStore.getAdmin() as any
    const roleRaw = (payload?.role || user?.role || admin?.role || '').toLowerCase()
      
    // Set layout based on role
    if (roleRaw.includes('admin')) {
      setPageLayout('admin')
    } else if (roleRaw.includes('lecturer') || roleRaw.includes('assistant')) {
      setPageLayout('lecturer')
    } else if (roleRaw.includes('student')) {
      setPageLayout('student')
    } else {
      setPageLayout('default')
    }
  } catch (e) {
    console.error('Profile layout middleware error:', e)
    return navigateTo('/auth/login')
  }
})
