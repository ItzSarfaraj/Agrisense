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
    <div className="bg-white rounded-3xl shadow-md border border-gray-100 p-6">
      <h2 className="text-2xl font-bold mb-6">System Status</h2>

      <div className="space-y-4">
        {services.map((service) => {
          const Icon = service.icon;

          return (
            <div
              key={service.name}
              className="flex items-center justify-between"
            >
              <div className="flex items-center gap-3">
                <Icon size={20} className="text-green-600" />

                <span>{service.name}</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500"></div>

                <span className="text-green-600 font-medium">
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
