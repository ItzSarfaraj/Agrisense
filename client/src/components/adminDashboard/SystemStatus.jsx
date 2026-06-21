import { Server, Database, Cloud, Cpu } from "lucide-react";

const SystemStatus = () => {
  const services = [
    {
      name: "Backend API",
      status: "Online",
      icon: Server,
    },
    {
      name: "MongoDB",
      status: "Connected",
      icon: Database,
    },
    {
      name: "FastAPI Service",
      status: "Online",
      icon: Cpu,
    },
    {
      name: "Weather API",
      status: "Active",
      icon: Cloud,
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-md border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">System Status</h2>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="flex items-center justify-between py-2 border-b border-gray-100 dark:border-gray-700 last:border-0"
            >
              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20">
                <Icon size={20} className="text-green-600 dark:text-green-400" />

                <span className="text-gray-800 dark:text-gray-200">{service.name}</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 dark:bg-green-900/20">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>

                <span className="text-green-600 dark:text-green-400 font-medium">
                  {service.status}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SystemStatus;
