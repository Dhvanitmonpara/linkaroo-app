import { create } from "zustand"

import { devtools, persist } from "zustand/middleware"

interface ProfileState {
    profile: {
        name: string;
        email: string;
        avatar: string;
    };
}

const profileStore = (set) => ({
    profile: {},
    addProfile: (profile: ProfileState) => set(state => (state.profile = profile)),
    updateProfile: (updatedProfile: ProfileState) => set(state => (state.profile = {...state.profile,...updatedProfile })),
    removeProfile: () => set(state => (state.profile = {})),
})

const useProfileStore = create<ProfileState>(
    devtools(
        persist(profileStore, {
            name: "profile"
        })
    )
)

export default useProfileStore;
