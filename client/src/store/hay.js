import { create } from "zustand"

import { devtools, persist } from "zustand/middleware"

const profileStore = (set) => ({
    profile: {},
    addProfile: (profile) => set(state => (state.profile = profile)),
    updateProfile: (updatedProfile) => set(state => (state.profile = {...state.profile,...updatedProfile })),
    removeProfile: () => set(state => (state.profile = {})),
})

const useProfileStore = create(
    devtools(
        persist(profileStore, {
            name: "profile"
        })
    )
)

export default useProfileStore;
