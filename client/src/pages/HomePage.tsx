import { Lists } from "@/components";
import { Input } from "@/components/ui/input";
import useProfileStore from "@/store/profileStore"

const HomePage = () => {
    const { theme, fullName } = useProfileStore().profile
    return (
        <div className={`${theme !== "light" ? "text-zinc-100" : "text-zinc-900"} select-none h-[calc(100vh-4.5rem)] overflow-y-scroll`}>
            <div className="flex justify-center items-center flex-col space-y-12 pt-36">
                <div className="flex justify-center items-center flex-col space-y-3">
                    <h1 className="text-5xl font-semibold">Welcome back, {fullName}</h1>
                    <p className={`mt-4 text-lg ${theme !== "light" ? "text-zinc-400" : "text-zinc-500"}`}>Ready to capture your links?</p>
                </div>
                <div className="mt-8 max-w-5xl w-2/5">
                    <Input
                        type="text"
                        placeholder="Quick add a new doc..."
                        className={`w-full px-4 py-6 text-lg rounded-md ${theme !== "light"
                            ? "bg-zinc-800 text-zinc-100 placeholder-zinc-400"
                            : "bg-white text-zinc-900 placeholder-zinc-500"
                            } rounded-3xl w-full`}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                // TODO: Implement quick add functionality
                                console.log("Quick add:", e.currentTarget.value);
                                e.currentTarget.value = '';
                            }
                        }}
                    />
                </div>
            </div>
            <div className="px-64 pt-24">
                <Lists className="!h-auto grid grid-cols-3 !gap-2 space-y-0" extraElementClassNames="hidden" />
            </div>
        </div>
    )
}

export default HomePage