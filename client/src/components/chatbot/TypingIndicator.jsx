const TypingIndicator = () => {
  return (
    <div className="flex gap-3">
      <div className="w-9 h-9 shrink-0 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-lg shadow-md shadow-green-500/10">
        🤖
      </div>

      <div className="flex items-center gap-3 bg-white dark:bg-gray-800 border border-gray-200/80 dark:border-gray-700 rounded-2xl rounded-bl-md px-5 py-4 shadow-sm">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-bounce" />
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: "120ms" }}
          />
          <span
            className="w-2 h-2 rounded-full bg-green-500 animate-bounce"
            style={{ animationDelay: "240ms" }}
          />
        </div>
        <span className="text-xs text-gray-400 dark:text-gray-500">Thinking…</span>
      </div>
    </div>
  );
};

export default TypingIndicator;