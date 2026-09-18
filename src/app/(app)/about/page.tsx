import { Cpu, Cloud, Wind, Droplets, Thermometer } from "lucide-react";

const sensors = [
  {
    icon: Cloud,
    name: "CO₂ Sensor",
    desc: "Measures carbon dioxide concentration in parts per million. Rising CO₂ levels indicate increased cellular respiration as the avocado ripens.",
  },
  {
    icon: Wind,
    name: "VOC Sensor",
    desc: "Detects volatile organic compounds in parts per billion. Ethylene and other VOCs are released during the ripening process.",
  },
  {
    icon: Droplets,
    name: "Humidity Sensor",
    desc: "Monitors relative humidity percentage. Higher moisture levels around the fruit correlate with advanced ripening stages.",
  },
  {
    icon: Thermometer,
    name: "Temperature Sensor",
    desc: "Tracks ambient temperature in Celsius. Warmer conditions accelerate ripening through increased enzymatic activity.",
  },
];

const techStack = [
  "Next.js",
  "TypeScript",
  "Tailwind CSS",
  "Zustand",
  "Framer Motion",
];

export default function AboutPage() {
  return (
    <div className="pt-2 pb-4">
      <h1 className="text-lg font-bold text-gray-900 mb-1">About</h1>
      <p className="text-xs text-gray-400 mb-6">How the app works</p>

      <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100 mb-4">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
            <span className="text-xl">🥑</span>
          </div>
          <div>
            <h2 className="text-sm font-bold text-gray-900">Avocado</h2>
            <p className="text-xs text-gray-400">Freshness Monitor</p>
          </div>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed">
          Avocado is an intelligent freshness monitoring app that uses CO&#x2082;, VOC,
          humidity, and temperature sensors to estimate avocado ripeness. Originally
          built as a React Native app connecting to ESP32 BLE hardware sensors.
        </p>
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-3 flex items-center gap-2">
        <Cpu size={14} />
        Sensors
      </h2>

      <div className="space-y-3 mb-6">
        {sensors.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.name}
              className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16} className="text-[#023c69]" />
                <span className="text-sm font-semibold text-gray-900">{s.name}</span>
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{s.desc}</p>
            </div>
          );
        })}
      </div>

      <h2 className="text-sm font-bold text-gray-900 mb-3">Tech Stack</h2>
      <div className="flex flex-wrap gap-2 mb-6">
        {techStack.map((t) => (
          <span
            key={t}
            className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium"
          >
            {t}
          </span>
        ))}
      </div>

      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          Capstone Project &middot; Computer Engineering
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          Originally built with React Native + ESP32 BLE
        </p>
        <p className="text-xs text-gray-400 text-center mt-1">
          Web version recreated with Next.js for portfolio
        </p>
      </div>
    </div>
  );
}
