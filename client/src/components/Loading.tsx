import { Progress } from "@/components/ui/progress";

const Loading = ({progress}: {progress: number}) => {
  return (
      <div className="flex justify-center fixed z-50 w-screen space-x-5 items-center h-screen bg-zinc-900">
      <Progress value={progress} className="absolute left-0 top-0 h-[0.12rem] " />
        <div className="flex space-x-3 select-none hover:text-white text-zinc-300 transition-colors cursor-pointer">
          <img src="/linkaroo.png" alt="linkaroo-logo" width={54} />
          <span className="font-helvetica text-6xl">Linkaroo</span>
        </div>
      </div>
  );
};

export default Loading;
