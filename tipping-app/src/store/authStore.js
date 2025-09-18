import { create } from "zustand";

export const useAuthStore = create((set, get) => ({
  step: 1,
  signupData: {},
  panelHeight: "auto", 
  setPanelHeight: (height) => set({ panelHeight: height }),
  nextStep: () => set({ step: get().step + 1 }),
  prevStep: () => set({ step: Math.max(get().step - 1, 1) }),
  setSignupData: (newData) =>
    set((state) => ({ signupData: { ...state.signupData, ...newData } })),
  resetSignupData: () => set({ step: 1, signupData: {} }),
}));
