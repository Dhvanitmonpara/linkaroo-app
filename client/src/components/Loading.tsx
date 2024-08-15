const Loading = () => {
  return (
    <div className="flex justify-center fixed z-20 w-screen space-x-5 items-center h-screen bg-zinc-900">
      <div className="text-white">
        <p className="font-mono text-6xl">Linkaroo</p>
        <span className="pl-2">is linking...</span>
      </div>
    </div>
  );
};

export default Loading;
