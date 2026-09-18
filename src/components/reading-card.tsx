import type { Reading } from "@/lib/types";

function timeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const minutes = Math.floor(diff / 60000);
  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export default function ReadingCard({ reading }: { reading: Reading }) {
  const { sensors, result, timestamp } = reading;

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <div
          className="px-3 py-1 rounded-full text-xs font-semibold text-white"
          style={{ backgroundColor: result.color }}
        >
          {result.level}
        </div>
        <span className="text-xs text-gray-400">{timeAgo(timestamp)}</span>
      </div>

      <div className="flex items-center gap-2 mb-3">
        <span className="text-2xl font-bold text-gray-900">{result.score}</span>
        <span className="text-sm text-gray-400">/ 100</span>
      </div>

      <div className="grid grid-cols-4 gap-2 text-center">
        <div>
          <div className="text-xs text-gray-400">CO&#x2082;</div>
          <div className="text-sm font-semibold text-gray-700">{sensors.co2}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">VOC</div>
          <div className="text-sm font-semibold text-gray-700">{sensors.voc}</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Humid</div>
          <div className="text-sm font-semibold text-gray-700">{sensors.humidity}%</div>
        </div>
        <div>
          <div className="text-xs text-gray-400">Temp</div>
          <div className="text-sm font-semibold text-gray-700">{sensors.temperature}&deg;</div>
        </div>
      </div>
    </div>
  );
}
