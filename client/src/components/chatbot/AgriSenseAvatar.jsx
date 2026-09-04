import { useState } from "react";

const AgriSenseAvatar = ({
  size = 44,
  className = "",
  seed = "AgriSense-AI",
}) => {
  const [failed, setFailed] = useState(false);

  const avatarUrl = `https://api.dicebear.com/10.x/bottts/svg?seed=${encodeURIComponent(
    seed
  )}`;

  if (failed) {
    return (
      <div
        aria-label="AgriSense AI"
        className={`flex shrink-0 items-center justify-center rounded-full border border-emerald-200 bg-gradient-to-br from-emerald-100 to-green-50 text-xl shadow-sm dark:border-emerald-900/60 dark:from-emerald-950 dark:to-gray-800 ${className}`}
        style={{ width: size, height: size }}
      >
        🤖
      </div>
    );
  }

  return (
    <div
      className={`shrink-0 overflow-hidden rounded-full border border-emerald-200 bg-emerald-50 shadow-sm dark:border-emerald-900/60 dark:bg-emerald-950/40 ${className}`}
      style={{ width: size, height: size }}
    >
      <img
        src={avatarUrl}
        alt="AgriSense AI"
        width={size}
        height={size}
        loading="eager"
        onError={() => setFailed(true)}
        className="h-full w-full object-cover"
      />
    </div>
  );
};

export default AgriSenseAvatar;