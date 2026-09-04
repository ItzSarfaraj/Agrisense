import {
  ArrowDown,
  CircleAlert,
  CircleCheck,
  CircleHelp,
  PlayCircle,
  Stethoscope,
} from "lucide-react";

const nodeStyles = {
  start: {
    icon: PlayCircle,
    className:
      "border-emerald-200 bg-emerald-50/80 text-emerald-700 dark:border-emerald-900/60 dark:bg-emerald-950/30 dark:text-emerald-300",
    badge: "START",
  },
  action: {
    icon: CircleHelp,
    className:
      "border-blue-200 bg-blue-50/80 text-blue-700 dark:border-blue-900/60 dark:bg-blue-950/30 dark:text-blue-300",
    badge: "ACTION",
  },
  decision: {
    icon: CircleHelp,
    className:
      "border-amber-200 bg-amber-50/80 text-amber-700 dark:border-amber-900/60 dark:bg-amber-950/30 dark:text-amber-300",
    badge: "DECISION",
  },
  success: {
    icon: CircleCheck,
    className:
      "border-green-200 bg-green-50/80 text-green-700 dark:border-green-900/60 dark:bg-green-950/30 dark:text-green-300",
    badge: "SUCCESS",
  },
  warning: {
    icon: CircleAlert,
    className:
      "border-orange-200 bg-orange-50/80 text-orange-700 dark:border-orange-900/60 dark:bg-orange-950/30 dark:text-orange-300",
    badge: "WARNING",
  },
  expert: {
    icon: Stethoscope,
    className:
      "border-purple-200 bg-purple-50/80 text-purple-700 dark:border-purple-900/60 dark:bg-purple-950/30 dark:text-purple-300",
    badge: "EXPERT",
  },
};

const TreatmentFlowchart = ({ flowchart, title }) => {
  if (!flowchart?.nodes?.length) {
    return null;
  }

  const connections = flowchart.connections || [];

  const connectionMap = connections.reduce((map, connection) => {
    if (!map[connection.from]) {
      map[connection.from] = [];
    }

    map[connection.from].push(connection);

    return map;
  }, {});

  return (
    <div className="w-full">
      {title && (
        <div className="mb-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-gray-400">
            Treatment Decision Path
          </p>
          <h3 className="mt-1 text-sm font-bold text-gray-900 dark:text-white">
            {title}
          </h3>
        </div>
      )}

      <div className="rounded-2xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-950/30 sm:p-6">
        <div className="mx-auto max-w-2xl">
          {flowchart.nodes.map((node, index) => {
            const config =
              nodeStyles[node.type] || nodeStyles.action;

            const Icon = config.icon;
            const outgoing = connectionMap[node.id] || [];

            return (
              <div key={node.id}>
                <div
                  className={`relative overflow-hidden rounded-2xl border p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${config.className}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white/70 shadow-sm dark:bg-black/10">
                      <Icon
                        size={17}
                        aria-hidden="true"
                      />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[8px] font-extrabold uppercase tracking-[0.14em] opacity-60">
                          {config.badge}
                        </span>
                      </div>

                      <p className="text-xs font-bold leading-5 sm:text-sm">
                        {node.label}
                      </p>
                    </div>
                  </div>

                  {outgoing.length > 0 && (
                    <div className="mt-4 space-y-2 border-t border-current/10 pt-3">
                      {outgoing.map(
                        (connection, connectionIndex) => (
                          <div
                            key={`${connection.to}-${connectionIndex}`}
                            className="flex items-center gap-2 rounded-xl bg-white/50 px-3 py-2 dark:bg-black/10"
                          >
                            <span
                              aria-hidden="true"
                              className="h-1.5 w-1.5 shrink-0 rounded-full bg-current opacity-50"
                            />

                            <p className="text-[10px] font-medium leading-4 opacity-75">
                              {connection.label}
                            </p>
                          </div>
                        ),
                      )}
                    </div>
                  )}
                </div>

                {index <
                  flowchart.nodes.length - 1 && (
                  <div className="flex flex-col items-center py-1.5">
                    <div
                      aria-hidden="true"
                      className="h-3 w-px bg-gray-200 dark:bg-gray-700"
                    />

                    <ArrowDown
                      size={14}
                      className="text-gray-300 dark:text-gray-600"
                      aria-hidden="true"
                    />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TreatmentFlowchart;