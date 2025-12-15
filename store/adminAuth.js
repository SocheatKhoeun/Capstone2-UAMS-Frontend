import { defineStore } from 'pinia';
import { useNuxtApp } from '#app';
import Cookies from 'js-cookie';

export const adminAuth = defineStore('adminAuth', {
    state: () => ({
        token: Cookies.get('token') || null,
        admin: null, 
        isLoggedIn: !!Cookies.get('token'),
        tokenInitialized: false // Add a flag to track initialization
    }),
    actions: {
        // admin management methods
        setAdmin(admin) {
            this.admin = { ...admin }; // Ensure reactivity
            localStorage.setItem('admin', JSON.stringify(admin)); // Persist
        },
        
        // Add initialization method
        async init() {
            if (this.tokenInitialized) return;
            
            const token = this.getToken();
            const storeAdmin = localStorage.getItem('admin');
            
            if (token) {
                this.token = token;
                this.isLoggedIn = true;
                this.tokenInitialized = true;
                // this.admin = storeAdmin ? JSON.parse(storeAdmin) : null; // Restore admin
            }
            
            // setTimeout(() => {
            //     this.refreshToken();
            // }, 300);
            await this.refreshToken(); // Refresh token on initialization

        },
        

        setToken(token) {
            this.token = token;
            this.isLoggedIn = true;
            this.tokenInitialized = true;
            
            // Use more complete cookie options
            Cookies.set('token', token, { 
                expires: 7, // 7 days
                path: '/',
                secure: process.env.NODE_ENV === 'production',
                // sameSite: 'Lax' // Important for cross-site requests
            });
        },
        
        getToken() {
            return Cookies.get('token'); 
        },

        resetToken(){
            this.token = null;
            this.isLoggedIn = false;
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('admin');
        },
        
        getAdmin() {
            if (!this.admin) {
                const storeAdmin = localStorage.getItem('admin');
                // this.admin = storeAdmin ? JSON.parse(storeAdmin) : null;
                this.admin = storeAdmin ? JSON.parse(storeAdmin) : null;
            }
            return this.admin;
        },
        
        // Authentication methods
        async login(email, password) {
            const {$AdminPublicAxios} = useNuxtApp();
            try {
                // Ensure we call the /login endpoint
                const response = await $AdminPublicAxios.post('/login', {
                    email: email,
                    password: password
                });

                // API shape:
                // {
                //   "status":"success",
                //   "data": { "token": "...", "expires": 1765052358 }
                // }

                const token = response?.data?.data?.token;
                const expiresAt = response?.data?.data?.expires; // unix seconds (optional)
                const adminFromResponse = response?.data?.data?.user || null;

                if (!token) {
                    throw new Error('No token received from login response');
                }

                // Persist token via existing helper and set cookie expiry if provided
                this.setToken(token);

                // If API returns an expires timestamp, update cookie expiration (js-cookie expects days)
                if (expiresAt && typeof expiresAt === 'number') {
                    try {
                        const nowSec = Math.floor(Date.now() / 1000);
                        const secondsLeft = Math.max(expiresAt - nowSec, 0);
                        const daysLeft = secondsLeft / (60 * 60 * 24);
                        // set cookie with precise expiry days (minimum small fractional day)
                        const cookieOptions = {
                            expires: daysLeft > 0 ? daysLeft : 1/24,
                            path: '/',
                            secure: process.env.NODE_ENV === 'production'
                        };
                        Cookies.set('token', token, cookieOptions);
                    } catch (cookieErr) {
                        console.error('Failed to set cookie expiry:', cookieErr);
                    }
                }

                // Only set admin object if provided by API
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
                
        // Session management methods
        logout() {
            this.admin = null;
            this.token = null;
            this.isLoggedIn = false;
            this.tokenInitialized = false;
            Cookies.remove('token', { path: '/' });
            localStorage.removeItem('admin');
        },

        async refreshToken() {
            try {
                const {$AdminPrivateAxios} = useNuxtApp();
                this.token = this.getToken(); // Ensure token is set before making the request
                if (!this.token) {
                    if (process.env.NODE_ENV === 'development') {
                        console.error('No token available for refresh');
                    }
                    return;
                }

                // Check if this is actually an admin token before trying to refresh
                try {
                    const parts = this.token.split('.');
                    if (parts.length === 3) {
                        const payload = JSON.parse(atob(parts[1]));
                        const role = (payload?.role || '').toLowerCase();
                        // If not admin role, skip refresh attempt
                        if (!role.includes('admin') && !role.includes('superadmin')) {
                            return;
                        }
                    }
                } catch (e) {
                    // Invalid token, skip refresh
                    return;
                }

                const response = await $AdminPrivateAxios.post('/refresh-token');
                
                if(response.data.success === false) {
                    console.error('Refresh token failed:', response.data.message);
                    return;
                }

        
                const token = response.data.data.token;
                const admin = response.data.data.user;
                
                this.setToken(token);
                this.setAdmin(admin); // Update admin data
                                
                return token;
            } catch (error) {
                // Only log error if it's not a 404 (which happens for non-admin users)
                if (error.response?.status !== 404) {
                    console.error('Refresh Token Error:', error.message);
                }
                // Don't logout on 404 errors
                if (error.response?.status !== 404) {
                    this.logout(); // Logout on error
                }
            }
        }
        ,
        
        async checkTokenExpired() {
            let token = this.getToken();
            if (!token) {
                return false;
            }
            
            try {
                const parts = token.split('.');
                if (parts.length !== 3) {
                    throw new Error('Invalid token format');
                }
                
                const payload = JSON.parse(atob(parts[1]));
                const currentTime = Math.floor(Date.now() / 1000);
                
                // Check if this is an admin token before attempting refresh
                const role = (payload?.role || '').toLowerCase();
                const isAdmin = role.includes('admin') || role.includes('superadmin');
                
                // If token is expired or close to expiry, refresh it (only for admin users)
                if (!payload.exp || payload.exp < currentTime) {
                    if (isAdmin) {
                        if (process.env.NODE_ENV === 'development') {
                            console.log('Token expired, refreshing');
                        }
                        token = await this.refreshToken();
                        return !!token;
                    } else {
                        // Token expired but not admin, return false to trigger re-login
                        return false;
                    }
                } else if (isAdmin && payload.exp - currentTime < 900) { // 15 minutes
                    if (process.env.NODE_ENV === 'development') {
                        console.log('Token expiring soon, refreshing');
                    }
                    this.refreshToken(); // Don't await, let it refresh in background
                }
                
                return true;
            } catch (error) {
                console.error('Token validation error:', error.message);
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