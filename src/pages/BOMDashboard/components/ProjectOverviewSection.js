import React from 'react';

function ProjectOverviewSection({ data }) {
  if (!data) return null;

  // Data for pie chart (we'll use CSS to create a simple donut chart)
  const chartData = [
    { label: 'Active', value: data.activeProjects, percentage: data.activePercentage, color: 'bg-blue-500' },
    { label: 'Completed On-time', value: data.completedOnTimeProjects, percentage: data.completedPercentage, color: 'bg-green-500' },
    { label: 'Overdue', value: data.overdueProjects, percentage: data.overduePercentage, color: 'bg-red-500' }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Project Status Overview
        </h2>
        <p className="text-gray-600">
          Total projects breakdown by status
        </p>
      </div>

      {/* Total Projects Card */}
      <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-blue-900 mb-1">
            {data.totalProjects}
          </div>
          <div className="text-blue-700 font-medium">Total Projects</div>
        </div>
      </div>

      {/* Status Breakdown */}
      <div className="space-y-4">
        {chartData.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-gray-50">
            <div className="flex items-center space-x-3">
              <div className={`w-4 h-4 rounded-full ${item.color}`}></div>
              <span className="font-medium text-gray-900">{item.label}</span>
            </div>
            <div className="text-right">
              <div className="font-bold text-gray-900">{item.value}</div>
              <div className="text-sm text-gray-600">{item.percentage}%</div>
            </div>
          </div>
        ))}
      </div>

      {/* Visual Progress Bars */}
      <div className="mt-6">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Distribution</h3>
        <div className="space-y-3">
          {chartData.map((item, index) => (
            <div key={index}>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">{item.label}</span>
                <span className="font-medium">{item.percentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${item.color}`}
                  style={{ width: `${item.percentage}%` }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Status Summary</h3>
        <div className="text-sm text-gray-700 space-y-1">
          <div>
            <span className="font-medium">Healthy Projects:</span>{" "}
            {data.activeProjects + data.completedOnTimeProjects} 
            ({Math.round(((data.activeProjects + data.completedOnTimeProjects) / data.totalProjects) * 100)}%)
          </div>
          <div>
            <span className="font-medium">At Risk:</span>{" "}
            {data.overdueProjects} ({data.overduePercentage}%)
          </div>
          {data.overduePercentage > 20 && (
            <div className="text-red-600 font-medium">
              ⚠️ High percentage of overdue projects requires attention
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProjectOverviewSection;
