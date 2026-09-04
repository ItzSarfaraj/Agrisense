import ReactMarkdown from "react-markdown";

const cleanResponse = (content) => {
  return content
    .replace(/svgCopy/gi, "")
    .replace(/\*\*•\*\*/g, "")
    .replace(/\*\*•/g, "**")
    .replace(/•/g, "")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
};

const isTakeaway = (children) => {
  const text = String(children || "").toLowerCase();
  return (
    text.includes("practical takeaway") ||
    text.includes("key takeaway") ||
    text.includes("मुख्य निष्कर्ष") ||
    text.includes("व्यावहारिक सुझाव")
  );
};

const ChatResponse = ({ content }) => {
  const formattedContent = cleanResponse(content);

  return (
    <article className="chat-response">
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <div className="mb-6 mt-1">
              <h1 className="text-2xl sm:text-[27px] font-bold tracking-tight text-slate-900 dark:text-white">
                {children}
              </h1>
              <div className="mt-3 h-1 w-12 rounded-full bg-gradient-to-r from-emerald-500 to-green-400" />
            </div>
          ),

          h2: ({ children }) => (
            <div className="mt-8 mb-4 flex items-center gap-3">
              <span className="h-6 w-1 rounded-full bg-emerald-500" />
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-slate-800 dark:text-gray-100">
                {children}
              </h2>
            </div>
          ),

          h3: ({ children }) => (
            <h3 className="mt-6 mb-2.5 text-base sm:text-[17px] font-semibold text-slate-800 dark:text-gray-100">
              {children}
            </h3>
          ),

          p: ({ children }) => {
            if (isTakeaway(children)) {
              return (
                <div className="my-6 rounded-2xl border border-emerald-200 bg-emerald-50/70 px-5 py-4 dark:border-emerald-900/60 dark:bg-emerald-950/30">
                  <p className="mb-0 text-[14px] leading-7 text-slate-700 dark:text-gray-200">
                    {children}
                  </p>
                </div>
              );
            }

            return (
              <p className="mb-4 text-[15px] leading-7 text-slate-600 dark:text-gray-300 last:mb-0">
                {children}
              </p>
            );
          },

          strong: ({ children }) => (
            <strong className="font-semibold text-emerald-800 dark:text-emerald-300">
              {children}
            </strong>
          ),

          em: ({ children }) => (
            <em className="text-slate-500 dark:text-gray-400">
              {children}
            </em>
          ),

          ul: ({ children }) => (
            <ul className="my-4 space-y-2.5 pl-0">
              {children}
            </ul>
          ),

          ol: ({ children }) => (
            <ol className="my-5 space-y-4 pl-7 list-decimal marker:font-bold marker:text-emerald-600 dark:marker:text-emerald-400">
              {children}
            </ol>
          ),

          li: ({ children }) => (
            <li className="relative pl-2 text-[15px] leading-7 text-slate-600 dark:text-gray-300">
              {children}
            </li>
          ),

          blockquote: ({ children }) => (
            <blockquote className="my-5 rounded-r-2xl border-l-4 border-amber-400 bg-amber-50 px-5 py-4 text-[14px] leading-7 text-slate-700 dark:bg-amber-950/25 dark:text-gray-300">
              {children}
            </blockquote>
          ),

          hr: () => (
            <div className="my-7 h-px bg-gradient-to-r from-transparent via-emerald-200 to-transparent dark:via-gray-700" />
          ),

          code: ({ children }) => (
            <code className="rounded-md bg-emerald-50 px-1.5 py-1 text-[13px] font-medium text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
              {children}
            </code>
          ),

          pre: ({ children }) => (
            <pre className="my-5 overflow-x-auto rounded-2xl bg-slate-900 p-5 text-sm leading-6 text-slate-100 shadow-inner">
              {children}
            </pre>
          ),

          a: ({ children, href }) => (
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-green-600 dark:text-emerald-400"
            >
              {children}
            </a>
          ),

          table: ({ children }) => (
            <div className="my-6 overflow-x-auto rounded-2xl border border-emerald-100 dark:border-gray-700">
              <table className="w-full min-w-[500px] border-collapse text-sm">
                {children}
              </table>
            </div>
          ),

          thead: ({ children }) => (
            <thead className="bg-emerald-50 dark:bg-emerald-950/30">
              {children}
            </thead>
          ),

          th: ({ children }) => (
            <th className="border-b border-emerald-100 px-4 py-3 text-left font-semibold text-emerald-800 dark:border-gray-700 dark:text-emerald-300">
              {children}
            </th>
          ),

          td: ({ children }) => (
            <td className="border-b border-gray-100 px-4 py-3 text-slate-600 dark:border-gray-700 dark:text-gray-300">
              {children}
            </td>
          ),
        }}
      >
        {formattedContent}
      </ReactMarkdown>
    </article>
  );
};

export default ChatResponse;