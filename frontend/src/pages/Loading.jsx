const Loading = () => {
  return (
    <div className="flex items-center justify-center h-screen fixed bg-gray-300  min-w-[420px] backdrop-blur-xl flex-col gap-5 ">
      <div className="h-20 w-20 border-e-5 border-amber-300 animate-spin rounded-full "></div>
    </div>
  );
};
export default Loading;
