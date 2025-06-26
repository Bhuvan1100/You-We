import { create } from 'zustand';

const useUserStore = create((set) => ({
  user: null,               // Firebase user object
  backendData: null,        // Data from MongoDB backend
  isLoggedIn: false,        // Auth state
  loading: true,            // App-level loading indicator

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
}));

export default useUserStore;
