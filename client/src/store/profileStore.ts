import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { themeType } from "@/lib/types";

type ProfileType = {
  name?: string;
  email?: string;
  avatar?: string;
  theme?: themeType;
};

interface ProfileState {
  profile: ProfileType;
  addProfile: (profile: ProfileType) => void;
  updateProfile: (updatedProfile: ProfileType) => void;
  removeProfile: () => void;
  changeTheme: (theme: themeType) => void;
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
        changeTheme: (theme: themeType) =>{
          set((state) => ({
            profile: {...state.profile, theme },
          }));
        }
      }),
      { name: "profile" }
    )
  )
);

export default useProfileStore;
export type {ProfileType}
