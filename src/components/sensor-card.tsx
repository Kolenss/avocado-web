import { Cloud, Wind, Droplets, Thermometer, type LucideIcon } from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  cloud: Cloud,
  wind: Wind,
  droplets: Droplets,
  thermometer: Thermometer,
};

interface Props {
  label: string;
  value: number;
  unit: string;
  icon: string;
  color?: string;
}

export default function SensorCard({ label, value, unit, icon, color = "#023c69" }: Props) {
  const Icon = iconMap[icon] ?? Cloud;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-2">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ backgroundColor: `${color}15` }}
        >
          <Icon size={16} color={color} />
        </div>
        <span className="text-xs text-gray-500 font-medium">{label}</span>
      </div>
      <div className="flex items-baseline gap-1">
        <span className="text-2xl font-bold text-gray-900">{value}</span>
        <span className="text-sm text-gray-400">{unit}</span>
      </div>
    </div>
  );
}
