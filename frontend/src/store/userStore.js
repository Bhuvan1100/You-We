import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,
  backendData: null,
  isLoggedIn: false,
  loading: true,
  admin: false,

  setUser: (user) =>
    set({
      user,
      isLoggedIn: !!user,
      loading: false,
    }),

  setBackendData: (data) => set({ backendData: data }),

  updateBackendField: (key, value) =>
    set((state) => ({
      backendData: {
        ...state.backendData,
        [key]: value,
      },
    })),

  clearUser: () =>
    set({
      user: null,
      backendData: null,
      isLoggedIn: false,
      loading: false,
    }),

  setLoading: (status) => set({ loading: status }),

  setAdmin: (isAdmin) => set(() => ({ admin: isAdmin })),

  
  verifyToken: async () => {
    const token = localStorage.getItem("jwtToken");
    if (!token) return false;

    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/jwt/verifytoken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ token }),   
    });

      const data = await res.json();
      if (res.ok && data.email) {
        useUserStore.getState().setUser({
          name: data.name,
          email: data.email,
        });
        return true;
      } else {
        localStorage.removeItem("jwtToken");
        return false;
      }
    } catch (err) {
      console.error("Token verification failed:", err);
      localStorage.removeItem("jwtToken");
      return false;
    }
  },
}));

export default useUserStore;
