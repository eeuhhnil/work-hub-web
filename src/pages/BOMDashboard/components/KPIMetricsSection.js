import React from 'react';

function KPIMetricsSection({ data }) {
  if (!data) return null;

  const kpiCards = [
    {
      title: "Project On-time Completion",
      value: `${data.projectOnTimeCompletionRate}%`,
      icon: "📊",
      color: data.projectOnTimeCompletionRate >= 80 ? "green" : data.projectOnTimeCompletionRate >= 60 ? "yellow" : "red",
      description: "Projects completed on schedule"
    },
    {
      title: "Task On-time Completion", 
      value: `${data.taskOnTimeCompletionRate}%`,
      icon: "✅",
      color: data.taskOnTimeCompletionRate >= 80 ? "green" : data.taskOnTimeCompletionRate >= 60 ? "yellow" : "red",
      description: "Tasks completed on time"
    },
    {
      title: "Active Projects",
      value: data.totalActiveProjects,
      icon: "🚀",
      color: "blue",
      description: "Currently running projects"
    },
    {
      title: "Completed Projects",
      value: data.totalCompletedProjects,
      icon: "🎯",
      color: "green",
      description: "Successfully completed projects"
    },
    {
      title: "Overdue Projects",
      value: data.totalOverdueProjects,
      icon: "⚠️",
      color: data.totalOverdueProjects > 5 ? "red" : data.totalOverdueProjects > 2 ? "yellow" : "green",
      description: "Projects with overdue tasks"
    },
    {
      title: "Avg Project Duration",
      value: `${data.averageProjectDuration} days`,
      icon: "⏱️",
      color: "purple",
      description: "Average time to complete projects"
    }
  ];

  const getColorClasses = (color) => {
    const colorMap = {
      green: "bg-green-50 border-green-200 text-green-800",
      yellow: "bg-yellow-50 border-yellow-200 text-yellow-800", 
      red: "bg-red-50 border-red-200 text-red-800",
      blue: "bg-blue-50 border-blue-200 text-blue-800",
      purple: "bg-purple-50 border-purple-200 text-purple-800"
    };
    return colorMap[color] || "bg-gray-50 border-gray-200 text-gray-800";
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Key Performance Indicators
        </h2>
        <p className="text-gray-600">
          System-wide performance metrics and KPIs
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {kpiCards.map((kpi, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg border-2 ${getColorClasses(kpi.color)} transition-all duration-200 hover:shadow-md`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="text-2xl">{kpi.icon}</div>
              <div className="text-right">
                <div className="text-2xl font-bold">{kpi.value}</div>
              </div>
            </div>
            <div>
              <h3 className="font-semibold text-sm mb-1">{kpi.title}</h3>
              <p className="text-xs opacity-75">{kpi.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary Insights */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Quick Insights</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Overall Health:</span>{" "}
            {data.projectOnTimeCompletionRate >= 80 && data.taskOnTimeCompletionRate >= 80
              ? "🟢 Excellent"
              : data.projectOnTimeCompletionRate >= 60 && data.taskOnTimeCompletionRate >= 60
              ? "🟡 Good"
              : "🔴 Needs Attention"}
          </div>
          <div>
            <span className="font-medium">Risk Level:</span>{" "}
            {data.totalOverdueProjects <= 2
              ? "🟢 Low"
              : data.totalOverdueProjects <= 5
              ? "🟡 Medium"
              : "🔴 High"}
          </div>
        </div>
      </div>
    </div>
  );
}

export default KPIMetricsSection;
