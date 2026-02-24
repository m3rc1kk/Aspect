import axiosInstance from './axiosConfig';

const authService = {
    signUp: async (userData) => {
        try {
            const formData = new FormData();
            formData.append('email', userData.email);
            formData.append('username', userData.username);
            formData.append('nickname', userData.nickname);
            formData.append('password', userData.password);
            formData.append('confirm_password', userData.confirmPassword);
            
            if (userData.avatar) {
                if (typeof userData.avatar === 'string' && userData.avatar.startsWith('data:')) {
                    const blob = dataURLtoBlob(userData.avatar);
                    formData.append('avatar', blob, 'avatar.jpg');
                } else {
                    formData.append('avatar', userData.avatar);
                }
            }

            const response = await axiosInstance.post('/sign-up/', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Registration failed' };
        }
    },

    signUpVerify: async (email, code) => {
        try {
            const response = await axiosInstance.post('/sign-up/verify/', { email, code });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            if (!error.response) throw error;
            throw error.response.data || { message: 'Verification failed' };
        }
    },

    signIn: async (credentials) => {
        try {
            const response = await axiosInstance.post('/sign-in/', credentials);

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            if (!error.response) throw error;
            throw error.response.data || { message: 'Login failed' };
        }
    },

    signInWithGoogle: async (idToken) => {
        try {
            const response = await axiosInstance.post('/auth/google/', { id_token: idToken });

            if (response.data.access && response.data.refresh) {
                localStorage.setItem('access_token', response.data.access);
                localStorage.setItem('refresh_token', response.data.refresh);
                localStorage.setItem('user', JSON.stringify(response.data.user));
            }

            return response.data;
        } catch (error) {
            if (!error.response) throw error;
            const data = error.response.data;
            const detail = typeof data === 'string' ? data : (data?.detail ?? data?.message);
            throw { detail: detail || 'Google sign in failed' };
        }
    },

    logout: async () => {
        try {
            const refreshToken = localStorage.getItem('refresh_token');
            if (refreshToken) {
                await axiosInstance.post('/logout/', {
                    refresh: refreshToken,
                });
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('user');
        }
    },

    resetPassword: async (email) => {
        try {
            const response = await axiosInstance.post('/password/reset/', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Password reset failed' };
        }
    },

    resetPasswordConfirm: async (uid, token, newPassword, confirmPassword) => {
        try {
            const response = await axiosInstance.post('/password/reset/confirm/', {
                uid,
                token,
                new_password: newPassword,
                confirm_password: confirmPassword,
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || { message: 'Password reset confirmation failed' };
        }
    },

    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    updateUserData: (userData) => {
        localStorage.setItem('user', JSON.stringify(userData));
    },

    isAuthenticated: () => {
        return !!localStorage.getItem('access_token');
    },
};

function dataURLtoBlob(dataURL) {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)[1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new Blob([u8arr], { type: mime });
}

export default authService;
