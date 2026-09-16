const colorClasses = {
  blue: "bg-blue-50 text-blue-600",
  green: "bg-green-50 text-green-600",
  purple: "bg-purple-50 text-purple-600",
  orange: "bg-orange-50 text-orange-600",
  yellow: "bg-yellow-50 text-yellow-600",
  red: "bg-red-50 text-red-600",
  gray: "bg-gray-100 text-gray-700",
};

const DashboardCard = ({ title, count, color = "blue" }) => {
  return (
    <div className="flex items-center justify-between p-6 rounded-xl border border-gray-100 shadow-sm bg-white hover:shadow-md transition-shadow">
      <div>
        <p className="text-sm font-medium text-gray-500">{title}</p>
        <p className="text-3xl font-bold text-gray-800 mt-2">
          {count ?? 0}
        </p>
      </div>
      <div
        className={`flex h-12 w-12 items-center justify-center rounded-full text-lg font-semibold ${colorClasses[color]}`}
      >
        {title?.charAt(0)}
      </div>
    </div>
  );
};

export default DashboardCard;