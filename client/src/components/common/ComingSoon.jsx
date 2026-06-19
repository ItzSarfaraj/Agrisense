import { Clock3 } from "lucide-react";

const ComingSoon = ({
  title,
  description,
}) => {
  return (
    <div className="flex items-center justify-center min-h-[70vh]">
      <div className="max-w-2xl w-full bg-white rounded-3xl shadow-lg border border-gray-100 p-10 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-green-100 flex items-center justify-center mb-6">
          <Clock3
            size={40}
            className="text-green-600"
          />
        </div>

        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {title}
        </h1>

        <p className="text-gray-500 text-lg leading-relaxed">
          {description}
        </p>

        <div className="mt-8 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-green-50 text-green-700 font-medium">
          🚀 Coming Soon
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;