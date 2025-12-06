import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import Cookies from 'js-cookie'; // Added import for js-cookie
import axios from 'axios';
export const userAuth = defineStore('userAuth', {
    state: () => ({
        token: Cookies.get('token') || null, // Replaced getCookie with Cookies.get
        user: null, 
        isLoggedIn: !!Cookies.get('token'),
    }),
    actions: {
        setUser(user) {
            this.user = user;
            try { localStorage.setItem('user', JSON.stringify(user)); } catch {}
        },

        // enhance setToken to accept optional expires (unix seconds)
        setToken(token, expiresAt) {
            this.token = token;
            this.isLoggedIn = true;
            if (expiresAt && typeof expiresAt === 'number') {
                const nowSec = Math.floor(Date.now() / 1000);
                const secondsLeft = Math.max(expiresAt - nowSec, 0);
                const daysLeft = secondsLeft / (60 * 60 * 24) || 1/24;
                Cookies.set('token', token, { expires: daysLeft, path: '/', secure: process.env.NODE_ENV === 'production' });
            } else {
                Cookies.set('token', token, { path: '/', secure: process.env.NODE_ENV === 'production' });
            }
        },

        getToken() {
            return Cookies.get('token'); // Ensure Cookies is used
        },

        getUser() {
            if (!this.user) {
                try {
                    const storeUser = localStorage.getItem('user');
                    this.user = storeUser ? JSON.parse(storeUser) : null;
                } catch {}
            }
            return this.user;
        },

        async login(email, password) {
            const nuxtApp = useNuxtApp();
            const runtime = useRuntimeConfig();
            const injected = nuxtApp?.$UserPublicAxios;
            const rawBase = runtime?.public?.USER_PUBLIC_API || '';

            let response;
            try {
                if (rawBase) {
                    let base = String(rawBase).replace(/\/+$/, '');
                    if (base.endsWith('/auth')) {
                        base = base.slice(0, base.length - '/auth'.length);
                    }
                    const loginUrl = `${base.replace(/\/+$/, '')}/login`;
                    response = await axios.post(loginUrl, { email, password }, { withCredentials: true });
                } else if (injected) {
                    response = await injected.post('/login', { email, password });
                } else {
                    throw new Error('No user API configured');
                }

                // Expect response.data.data => { token, expires, role, refresh_token, refresh_expires, ... }
                const d = response?.data?.data || {};
                const token = d.token || null;
                const expires = d.expires || null;
                const role = d.role || null;
                const refreshToken = d.refresh_token || null;
                const refreshExpires = d.refresh_expires || null;

                if (!token) {
                    throw new Error('No token received from login response');
                }

                // persist token (with expiry when available)
                this.setToken(token, expires);

                // persist refresh token if provided
                try {
                    if (refreshToken) {
                        if (refreshExpires && typeof refreshExpires === 'number') {
                            const nowSec = Math.floor(Date.now() / 1000);
                            const secondsLeft = Math.max(refreshExpires - nowSec, 0);
                            const daysLeft = secondsLeft / (60 * 60 * 24) || 1/24;
                            Cookies.set('refresh_token', refreshToken, { expires: daysLeft, path: '/', secure: process.env.NODE_ENV === 'production' });
                        } else {
                            Cookies.set('refresh_token', refreshToken, { path: '/', secure: process.env.NODE_ENV === 'production' });
                        }
                    }
                } catch (e) {
                    console.warn('Failed to set refresh token cookie', e);
                }

                // decode token payload (best-effort) to set user info including role
                try {
                    const parts = token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const user = {
                            id: payload.user_id || payload.userId || payload.sub || null,
                            email: payload.email || null,
                            role: role || payload.role || null,
                            first_name: payload.first_name || null,
                            last_name: payload.last_name || null,
                            raw: payload
                        };
                        this.setUser(user);
                    }
                } catch (e) {
                    console.warn('Failed to decode token payload:', e);
                }

                this.isLoggedIn = true;
                return response.data;
            } catch (error) {
                throw error;
            }
        },

        logout() {
            this.token = null;
            this.user = null;
            this.isLoggedIn = false;
            Cookies.remove('token', { path: '/' });
            Cookies.remove('refresh_token', { path: '/' });
            try { localStorage.removeItem('user'); } catch {}
        },

        async refreshToken() {
            try {
                const { $UserPrivateAxios } = useNuxtApp();
                this.token = this.getToken();
                const refreshToken = Cookies.get('refresh_token');
                if (!this.token && !refreshToken) {
                    this.logout();
                    return;
                }

                // Attempt refresh using private endpoint (private axios will attach token if present)
                const response = await $UserPrivateAxios.post('/refresh-token', { refresh_token: refreshToken });

                const d = response?.data?.data || {};
                const token = d.token || null;
                const expires = d.expires || null;
                const refreshTokenNew = d.refresh_token || null;
                const refreshExpires = d.refresh_expires || null;

                if (!token) {
                    this.logout();
                    return;
                }

                this.setToken(token, expires);

                if (refreshTokenNew) {
                    if (refreshExpires && typeof refreshExpires === 'number') {
                        const nowSec = Math.floor(Date.now() / 1000);
                        const secondsLeft = Math.max(refreshExpires - nowSec, 0);
                        const daysLeft = secondsLeft / (60 * 60 * 24) || 1/24;
                        Cookies.set('refresh_token', refreshTokenNew, { expires: daysLeft, path: '/', secure: process.env.NODE_ENV === 'production' });
                    } else {
                        Cookies.set('refresh_token', refreshTokenNew, { path: '/', secure: process.env.NODE_ENV === 'production' });
                    }
                }

                // update user from new token
                try {
                    const parts = token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const user = {
                            id: payload.user_id || payload.userId || payload.sub || null,
                            email: payload.email || null,
                            role: payload.role || null,
                            first_name: payload.first_name || null,
                            last_name: payload.last_name || null,
                            raw: payload
                        };
                        this.setUser(user);
                    }
                } catch (e) {
                    // ignore
                }

                return token;
            } catch (error) {
                console.log("Refresh Token Error: ", error);
                this.logout();
            }
        },

        async checkTokenExpired() {
            this.token = this.getToken();
            if (!this.token) {
              this.logout();
              return false;
            }

            try {
              const parts = this.token.split('.');
              if (parts.length !== 3) {
                throw new Error('Invalid token format');
              }
              const payload = JSON.parse(atob(parts[1]));
              const currentTime = Math.floor(Date.now() / 1000);
              if (payload.exp && payload.exp < currentTime) {
                // token expired -> try refresh
                const newToken = await this.refreshToken();
                return !!newToken;
              }
              // if expiring soon, refresh in background
              if (payload.exp && payload.exp - currentTime < 900) {
                this.refreshToken();
              }
              return true;
            } catch (error) {
              this.logout();
              return false;
            }
        },
    }
});