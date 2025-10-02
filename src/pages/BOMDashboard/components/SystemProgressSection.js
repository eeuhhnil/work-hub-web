import React from 'react';

function SystemProgressSection({ data }) {
  if (!data) return null;

  const taskStats = [
    { 
      label: 'Open (Pending)', 
      value: data.pendingTasks, 
      color: 'bg-gray-500',
      textColor: 'text-gray-700',
      bgColor: 'bg-gray-50'
    },
    {
      label: 'In Progress',
      value: data.processingTasks,
      color: 'bg-yellow-500',
      textColor: 'text-yellow-700',
      bgColor: 'bg-yellow-50'
    },
    {
      label: 'Pending Approval',
      value: data.pendingApprovalTasks || 0,
      color: 'bg-orange-500',
      textColor: 'text-orange-700',
      bgColor: 'bg-orange-50'
    },
    {
      label: 'Done (Approved)',
      value: data.completedTasks,
      color: 'bg-green-500',
      textColor: 'text-green-700',
      bgColor: 'bg-green-50'
    },
    { 
      label: 'Overdue', 
      value: data.overdueTasks, 
      color: 'bg-red-500',
      textColor: 'text-red-700',
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          System-wide Task Progress
        </h2>
        <p className="text-gray-600">
          Task distribution across all projects
        </p>
      </div>

      {/* Total Tasks Card */}
      <div className="mb-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
        <div className="text-center">
          <div className="text-3xl font-bold text-purple-900 mb-1">
            {data.totalTasks}
          </div>
          <div className="text-purple-700 font-medium">Total Tasks</div>
        </div>
      </div>

      {/* Task Status Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
        {taskStats.map((stat, index) => (
          <div key={index} className={`p-4 rounded-lg ${stat.bgColor} border border-opacity-20`}>
            <div className="flex items-center justify-between">
              <div>
                <div className={`text-2xl font-bold ${stat.textColor}`}>
                  {stat.value}
                </div>
                <div className={`text-sm font-medium ${stat.textColor}`}>
                  {stat.label}
                </div>
              </div>
              <div className={`w-3 h-3 rounded-full ${stat.color}`}></div>
            </div>
          </div>
        ))}
      </div>

      {/* Progress Metrics */}
      <div className="space-y-4">
        {/* Completion Progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Completion Progress</span>
            <span className="font-semibold text-green-600">{data.completionPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-300"
              style={{ width: `${data.completionPercentage}%` }}
            ></div>
          </div>
          <div className="text-xs text-gray-500 mt-1">
            * Only PM-approved tasks count as completed
          </div>
        </div>

        {/* Overdue Rate */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Overdue Rate</span>
            <span className={`font-semibold ${data.overduePercentage > 15 ? 'text-red-600' : data.overduePercentage > 10 ? 'text-yellow-600' : 'text-green-600'}`}>
              {data.overduePercentage}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3">
            <div
              className={`h-3 rounded-full transition-all duration-300 ${
                data.overduePercentage > 15 ? 'bg-red-500' : 
                data.overduePercentage > 10 ? 'bg-yellow-500' : 'bg-green-500'
              }`}
              style={{ width: `${Math.min(data.overduePercentage, 100)}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Task Flow Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Task Flow Analysis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
          <div>
            <span className="font-medium">Active Tasks:</span>{" "}
            {data.pendingTasks + data.processingTasks} 
            ({Math.round(((data.pendingTasks + data.processingTasks) / data.totalTasks) * 100)}%)
          </div>
          <div>
            <span className="font-medium">Completion Rate:</span>{" "}
            <span className={data.completionPercentage >= 70 ? 'text-green-600' : data.completionPercentage >= 50 ? 'text-yellow-600' : 'text-red-600'}>
              {data.completionPercentage >= 70 ? '🟢 Good' : data.completionPercentage >= 50 ? '🟡 Average' : '🔴 Poor'}
            </span>
          </div>
        </div>
        
        {data.overduePercentage > 15 && (
          <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
            ⚠️ High overdue rate detected. Consider reviewing project timelines and resource allocation.
          </div>
        )}
      </div>
    </div>
  );
}

export default SystemProgressSection;
