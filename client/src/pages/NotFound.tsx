import useProfileStore from "@/store/profileStore";
import { useMediaQuery } from "react-responsive";
import { Link } from "react-router-dom";

const NotFound = () => {
  const isSmallScreen = useMediaQuery({ query: "(max-width: 1024px)" });
  const { profile } = useProfileStore();
  const theme = profile?.theme;
  return (
    <div className={`flex fixed h-screen w-screen z-[100] flex-col items-center justify-center ${theme == "black" ? "bg-black" : "bg-zinc-900"} text-center`}>
      <h1 className="text-8xl font-bold text-zinc-300">404</h1>
      <p className="mt-4 md:text-2xl text-gray-500 text-xl px-5">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to={isSmallScreen ? "/list" : "/"} className="mt-6 text-lg text-blue-600 hover:underline">
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFound;
