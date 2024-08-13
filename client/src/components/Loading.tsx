const Loading = () => {
  return (
    <div className="flex justify-center space-x-5 items-center h-screen bg-zinc-900">
      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 animate-spin"></div>
      <div className="text-white">
        <p className="font-mono text-6xl">Linkaroo</p>
        <span className="pl-2">is linking...</span>
      </div>
    </div>
  );
};

export default Loading;
