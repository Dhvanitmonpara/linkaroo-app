import { Lists } from "@/components";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useListStore from "@/store/listStore";
import useProfileStore from "@/store/profileStore"
import { handleAxiosError } from "@/utils/handlerAxiosError";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const HomePage = () => {

    const { theme, fullName } = useProfileStore().profile
    const { inbox, addInboxDocItem } = useListStore()
    const navigate = useNavigate()
    const [input, setInput] = useState("")

    const [loading, setLoading] = useState(false)

    const quickAddHandler = async ({ url }: { url: string; }) => {
        try {
            setLoading(true);

            const response = await axios.post(
                `${import.meta.env.VITE_SERVER_API_URL}/cards/quick-add/${inbox?._id}`,
                {
                    link: url,
                },
                { withCredentials: true }
            );

            if (response.status !== 201) {
                toast.error("Failed to create card");
            }

            addInboxDocItem(response.data.data)

            toast.success("Doc created successfully")

        } catch (error) {
            handleAxiosError(error as AxiosError, navigate);
        } finally {
            setLoading(false);
            setInput("")
        }
    }

    return (
        <div className={`${theme !== "light" ? "text-zinc-100" : "text-zinc-900"} no-scrollbar select-none h-[calc(100vh-4.5rem)] overflow-y-scroll`}>
            <div className="flex justify-center items-center flex-col space-y-12 pt-12 sm:pt-36">
                <div className="flex w-full sm:justify-center sm:items-center flex-col px-5 md:px-24 md:p-0 space-y-3">
                    <h1 className="text-4xl md:text-5xl font-semibold">Welcome back, {fullName}</h1>
                    <p className={`mt-4 md:text-lg ${theme !== "light" ? "text-zinc-400" : "text-zinc-500"}`}>Ready to capture your links?</p>
                </div>
                <form onSubmit={(e) => {
                    e.preventDefault();
                    quickAddHandler({ url: input });
                }} className="mt-8 max-w-5xl md:w-2/5 sm:w-3/5 w-4/5 relative"
                >
                    <Input
                        disabled={loading}
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Quick add a new doc..."
                        className={`w-full px-6 py-6 text-lg rounded-md ${theme !== "light"
                            ? "bg-zinc-800 text-zinc-100 placeholder-zinc-400"
                            : "bg-white text-zinc-900 placeholder-zinc-500"
                            } rounded-3xl w-full`}
                    />
                    <Button
                        type="submit"
                        className={`${theme !== "light" ? "bg-zinc-700 hover:bg-zinc-600 text-zinc-200" : "bg-zinc-300 hover:bg-zinc-400"} rounded-full px-8 py-5 absolute top-1 right-1 transition-all ease-in-out ${input !== "" ? "scale-100" : "scale-0"}`}
                    >
                        {loading ? (<Loader2 className="animate-spin" />) : "Add"}
                    </Button>
                </form>
            </div> 
            <div className="px-0 sm:px-24 xl:px-56 2xl-px-64 py-8 pt-6 sm:pt-12 md:pt-24">
                <Lists className="!h-auto md:grid md:grid-cols-2 2xl:!grid-cols-3" extraElementClassNames="hidden" />
            </div>
        </div>
    )
}

export default HomePage