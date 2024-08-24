import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { fontOptions, themeType } from "@/lib/types";
import { fetchedTagType } from "@/lib/types";

type ProfileType = {
  _id: string;
  userId: string;
  coverImage: string;
  theme: themeType;
  font: fontOptions;
  createdAt: string;
  updatedAt: string;
  __v: number;
};

type User = {
  _id: string;
  username: string;
  email: string;
  fullName: string;
  avatarImage: string;
  profile: ProfileType;
};

interface ProfileState {
  profile: User;
  addProfile: (profile: User) => void;
  updateProfile: (updatedProfile: ProfileType) => void;
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
          profile: {
            _id: "",
            userId: "",
            coverImage: "",
            theme: "light",
            font: "font-mono", 
            createdAt: "",
            updatedAt: "",
            __v: 0,
          },
        },
        addProfile: (profile) => set({ profile }),
        updateProfile: (updatedProfile) =>
          set((state) => ({
            profile: { ...state.profile, profile: {...state.profile.profile, ...updatedProfile} },
          })),
        removeProfile: () =>
          set({
            profile: {
              _id: "",
              username: "",
              email: "",
              fullName: "",
              avatarImage: "",
              profile: {
                _id: "",
                userId: "",
                coverImage: "",
                theme: "light",
                font: "font-mono",
                createdAt: "",
                updatedAt: "",
                __v: 0,
              },
            },
          }),
        changeTheme: (theme: themeType) => {
          set((state) => ({
            profile: {
              ...state.profile,
              profile: { ...state.profile.profile, theme },
            },
          }));
        },
        changeFont: (font: fontOptions) => {
          set(state => ({
            profile: {
              ...state.profile,
              profile: {...state.profile.profile, font },
            }
          }))
        },
        tags: null,
        setTags: (tags) => set({ tags }),
      }),
      { name: "profile" }
    )
  )
);

export default useProfileStore;
export type { ProfileType, User };
