import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import Cookies from 'js-cookie';

function safeJSONParse(str) {
  if (!str || str === 'undefined' || str === 'null') return null;
  try {
    return JSON.parse(str);
  } catch (e) {
    console.error('safeJSONParse error:', e);
    return null;
  }
}

function decodeJwtPayload(token) {
  if (!token) return null;
  try {
    const parts = token.split('.');
    if (parts.length !== 3 || !parts[1]) return null;
    let decoded;
    try {
      if (typeof atob === 'function') {
        decoded = atob(parts[1]);
      } else if (typeof Buffer !== 'undefined') {
        decoded = Buffer.from(parts[1], 'base64').toString('utf8');
      } else {
        return null;
      }
    } catch (e) {
      return null;
    }
    if (!decoded || decoded === 'undefined' || decoded === 'null') return null;
    return safeJSONParse(decoded);
  } catch (e) {
    return null;
  }
}

export const adminAuth = defineStore('adminAuth', {
  state: () => ({
    token: Cookies.get('token') || null,
    admin: null,
    isLoggedIn: !!Cookies.get('token'),
    tokenInitialized: false
  }),
  actions: {
    setAdmin(admin) {
      this.admin = { ...admin };
      try {
        localStorage.setItem('admin', JSON.stringify(admin));
      } catch (e) {
        console.error('Failed to persist admin to localStorage:', e);
      }
    },

    async init() {
      if (this.tokenInitialized) return;

      const token = this.getToken();
      const storeAdmin = localStorage.getItem('admin');

      if (token) {
        this.token = token;
        this.isLoggedIn = true;
        this.tokenInitialized = true;
        const parsed = safeJSONParse(storeAdmin);
        if (parsed) this.admin = parsed;
      }

      await this.refreshToken();
    },

    setToken(token) {
      this.token = token;
      this.isLoggedIn = true;
      this.tokenInitialized = true;

      Cookies.set('token', token, {
        expires: 7,
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      });
    },

    getToken() {
      return Cookies.get('token');
    },

    resetToken() {
      this.token = null;
      this.isLoggedIn = false;
      Cookies.remove('token', { path: '/' });
      try {
        localStorage.removeItem('admin');
      } catch (e) {
        console.error('Failed to remove admin from localStorage:', e);
      }
    },

    getAdmin() {
      if (!this.admin) {
        let storeAdmin = null;
        try {
          storeAdmin = localStorage.getItem('admin');
        } catch (e) {
          console.error('Failed to read admin from localStorage:', e);
        }
        this.admin = safeJSONParse(storeAdmin);
      }
      return this.admin;
    },

    async login(email, password) {
      const { $AdminPublicAxios } = useNuxtApp();
      try {
        const response = await $AdminPublicAxios.post('/login', {
          email,
          password
        });

        const token = response?.data?.data?.token;
        const expiresAt = response?.data?.data?.expires;
        const adminFromResponse = response?.data?.data?.user || null;

        if (!token) {
          throw new Error('No token received from login response');
        }

        this.setToken(token);

        if (expiresAt && typeof expiresAt === 'number') {
          try {
            const nowSec = Math.floor(Date.now() / 1000);
            const secondsLeft = Math.max(expiresAt - nowSec, 0);
            const daysLeft = secondsLeft / (60 * 60 * 24);
            const cookieOptions = {
              expires: daysLeft > 0 ? daysLeft : 1 / 24,
              path: '/',
              secure: process.env.NODE_ENV === 'production'
            };
            Cookies.set('token', token, cookieOptions);
          } catch (cookieErr) {
            console.error('Failed to set cookie expiry:', cookieErr);
          }
        }

        if (adminFromResponse) {
          this.setAdmin(adminFromResponse);
        }

        this.isLoggedIn = true;
        return response.data;
      } catch (error) {
        console.error('Login error:', error);
        throw error;
      }
    },

    logout() {
      this.admin = null;
      this.token = null;
      this.isLoggedIn = false;
      this.tokenInitialized = false;
      Cookies.remove('token', { path: '/' });
      try {
        localStorage.removeItem('admin');
      } catch (e) {
        console.error('Failed to remove admin from localStorage:', e);
      }
    },

    async refreshToken() {
      try {
        const { $AdminPrivateAxios } = useNuxtApp();
        this.token = this.getToken();
        if (!this.token) {
          if (process.env.NODE_ENV === 'development') {
            console.error('No token available for refresh');
          }
          return;
        }

        const payload = decodeJwtPayload(this.token);
        const role = (payload?.role || '').toLowerCase();
        if (!role.includes('admin') && !role.includes('superadmin')) {
          return;
        }

        const response = await $AdminPrivateAxios.post('/refresh');

        if (response.data?.success === false) {
          console.error('Refresh token failed:', response.data.message);
          return;
        }

        const newToken = response.data?.data?.token;
        const admin = response.data?.data?.user;

        if (newToken) this.setToken(newToken);
        if (admin) this.setAdmin(admin);

        return newToken;
      } catch (error) {
        if (error.response?.status !== 404) {
          console.error('Refresh Token Error:', error.message || error);
          this.logout();
        }
      }
    },

    async checkTokenExpired() {
      let token = this.getToken();
      if (!token) {
        return false;
      }

      try {
        const payload = decodeJwtPayload(token);
        if (!payload) throw new Error('Invalid token payload');

        const currentTime = Math.floor(Date.now() / 1000);
        const role = (payload?.role || '').toLowerCase();
        const isAdmin = role.includes('admin') || role.includes('superadmin');

        if (!payload.exp || payload.exp < currentTime) {
          if (isAdmin) {
            if (process.env.NODE_ENV === 'development') {
              console.log('Token expired, refreshing');
            }
            token = await this.refreshToken();
            return !!token;
          } else {
            return false;
          }
        } else if (isAdmin && payload.exp - currentTime < 900) {
          if (process.env.NODE_ENV === 'development') {
            console.log('Token expiring soon, refreshing');
          }
          this.refreshToken();
        }

        return true;
      } catch (error) {
        console.error('Token validation error:', error.message || error);
        return false;
      }
    },

    initializeSession() {
      if (!this.token) {
        this.logout();
        return;
      }
      this.checkTokenExpired().then(isValid => {
        if (isValid) {
          this.refreshToken();
        }
      });
    }
  }
});