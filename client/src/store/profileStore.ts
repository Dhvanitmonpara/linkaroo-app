import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { fontOptions, themeType } from "@/lib/types";
import { fetchedTagType } from "@/lib/types";

type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatarImage: string;
  coverImage: string;
  theme: themeType;
  font: fontOptions;
  createdAt: string;
  updatedAt: string;
  _v: number;
};

interface ProfileState {
  profile: User;
  addProfile: (profile: User) => void;
  updateProfile: (updatedProfile: User) => void;
  removeProfile: () => void;
  changeTheme: (theme: themeType) => void;
  changeFont: (font: fontOptions) => void;
  tags: fetchedTagType[] | null;
  setTags: (tags: fetchedTagType[]) => void;
}

const useProfileStore = create<ProfileState>()(
  devtools(
    persist(
      (set) => ({
        profile: {
          _id: "",
          username: "",
          email: "",
          fullName: "",
          avatarImage: "",
          coverImage: "",
          theme: "light",
          font: "font-mono",
          createdAt: "",
          updatedAt: "",
          _v: 0,
        },
        addProfile: (profile) => set({ profile }),
        updateProfile: (updatedProfile) =>
          set((state) => ({
            profile: { ...state.profile, ...updatedProfile },
          })),
        removeProfile: () =>
          set({
            profile: {
              _id: "",
              username: "",
              email: "",
              fullName: "",
              avatarImage: "",
              coverImage: "",
              theme: "light",
              font: "font-mono",
              createdAt: "",
              updatedAt: "",
              _v: 0,
            },
          }),
        changeTheme: (theme: themeType) => {
          set((state) => ({
            profile: { ...state.profile, theme },
          }));
        },
        changeFont: (font: fontOptions) => {
          set((state) => ({
            profile: { ...state.profile, font },
          }));
        },
        tags: null,
        setTags: (tags) => set({ tags }),
      }),
      { name: "profile" }
    )
  )
);

export default useProfileStore;
export type { User };
