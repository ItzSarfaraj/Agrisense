const LoadingSpinner = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="h-14 w-14 border-4 border-green-200 border-t-green-600 rounded-full animate-spin"></div>

      <h2 className="mt-4 text-green-700 font-semibold text-lg">
        Loading AgriSense...
      </h2>
    </div>
  );
};

export default LoadingSpinner;