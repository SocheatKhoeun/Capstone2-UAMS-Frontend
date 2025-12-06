import { defineNuxtRouteMiddleware, navigateTo } from '#app';
import { userAuth } from '~/store/userAuth';

export default defineNuxtRouteMiddleware(async (to) => {
  const authStore = userAuth();
  const token = authStore.getToken();
  const isValidToken = token ? await authStore.checkTokenExpired() : false;

  // Consider any /auth route (index + subroutes) as public auth pages
  const isAuthRoute = to.path === '/auth' || to.path.startsWith('/auth/');

  // If the target is an auth route:
  // - authenticated users should be redirected to the app (avoid showing login/register)
  // - unauthenticated users should be allowed to proceed to login/register
  if (isAuthRoute) {
    if (isValidToken) {
      return navigateTo('/');
    }
    return; // allow unauthenticated access to auth pages
  }

  // For protected (non-auth) routes, require a valid token
  if (!isValidToken) {
    // Redirect unauthenticated users to the real login page
    return navigateTo('/auth/login');
  }

  // If we reach here the user is authenticated and can continue
});