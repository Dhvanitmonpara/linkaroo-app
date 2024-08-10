import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { themeType } from "@/lib/types";

type ProfileType = {
  _id: string;
  email: string;
  avatarImage?: string;
  username: string;
  fullName?: string;
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
        profile: {
          _id: "",
          email: "",
          avatarImage: "",
          username: "",
          fullName: "",
          theme: undefined,
        },
        addProfile: (profile) => set({ profile }),
        updateProfile: (updatedProfile) =>
          set((state) => ({
            profile: { ...state.profile, ...updatedProfile },
          })),
        removeProfile: () =>
          set({
            profile: { _id: "", username: "", email: "", avatarImage: "", fullName: "" },
          }),
        changeTheme: (theme: themeType) => {
          set((state) => ({
            profile: { ...state.profile, theme },
          }));
        },
      }),
      { name: "profile" }
    )
  )
);

export default useProfileStore;
export type { ProfileType };
