import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

type ProfileType = {
  name?: string;
  email?: string;
  avatar?: string;
};

interface ProfileState {
  profile: ProfileType;
  addProfile: (profile: ProfileType) => void;
  updateProfile: (updatedProfile: ProfileType) => void;
  removeProfile: () => void;
}

const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profile: { name: "", email: "", avatar: "" },
        addProfile: (profile) => set({ profile }),
        updateProfile: (updatedProfile) =>
          set((state) => ({
            profile: { ...state.profile, ...updatedProfile },
          })),
        removeProfile: () =>
          set({ profile: { name: "", email: "", avatar: "" } }),
      }),
      { name: "profile" }
    )
  )
);

export default useProfileStore;
export type {ProfileType}
