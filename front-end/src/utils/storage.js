export const storage = {
  getToken: () => localStorage.getItem('token'),
  setToken: (token) => localStorage.setItem('token', token),
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },
  setUser: (user) => localStorage.setItem('user', JSON.stringify(user)),
  getUser: () => JSON.parse(localStorage.getItem('user')),
};