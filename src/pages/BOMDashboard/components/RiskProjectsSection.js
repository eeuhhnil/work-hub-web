import React from 'react';

function RiskProjectsSection({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Risk Projects
          </h2>
          <p className="text-gray-600">
            Projects with high percentage of overdue tasks
          </p>
        </div>
        <div className="text-center py-8">
          <div className="text-green-500 text-4xl mb-2">🎉</div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">No Risk Projects</h3>
          <p className="text-gray-600">All projects are on track with no significant overdue tasks.</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'LOW':
        return 'bg-orange-100 text-orange-800 border-orange-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskIcon = (riskLevel) => {
    switch (riskLevel) {
      case 'HIGH':
        return '🚨';
      case 'MEDIUM':
        return '⚠️';
      case 'LOW':
        return '⚡';
      default:
        return '📊';
    }
  };

  const getProgressBarColor = (percentage) => {
    if (percentage >= 50) return 'bg-red-500';
    if (percentage >= 20) return 'bg-yellow-500';
    return 'bg-orange-500';
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Risk Projects
        </h2>
        <p className="text-gray-600">
          Projects with high percentage of overdue tasks (Top 10)
        </p>
      </div>

      {/* Risk Summary */}
      <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        {['HIGH', 'MEDIUM', 'LOW'].map((level) => {
          const count = data.filter(project => project.riskLevel === level).length;
          return (
            <div key={level} className={`p-4 rounded-lg border ${getRiskColor(level)}`}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-2xl font-bold">{count}</div>
                  <div className="text-sm font-medium">{level} Risk</div>
                </div>
                <div className="text-2xl">{getRiskIcon(level)}</div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Risk Projects List */}
      <div className="space-y-4">
        {data.map((project, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-1">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {project.projectName}
                  </h3>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRiskColor(project.riskLevel)}`}>
                    {getRiskIcon(project.riskLevel)} {project.riskLevel}
                  </span>
                </div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>
                    <span className="font-medium">Space:</span> {project.spaceName}
                  </div>
                  <div>
                    <span className="font-medium">PM:</span> {project.pmName || 'Unassigned'}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-red-600">
                  {project.overduePercentage}%
                </div>
                <div className="text-sm text-gray-600">Overdue</div>
              </div>
            </div>

            {/* Task Statistics */}
            <div className="grid grid-cols-2 gap-4 mb-3">
              <div className="bg-gray-50 p-3 rounded">
                <div className="text-sm text-gray-600">Total Tasks</div>
                <div className="text-xl font-semibold text-gray-900">
                  {project.totalTasks}
                </div>
              </div>
              <div className="bg-red-50 p-3 rounded">
                <div className="text-sm text-red-600">Overdue Tasks</div>
                <div className="text-xl font-semibold text-red-700">
                  {project.overdueTasksCount}
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Overdue Progress</span>
                <span className="font-medium text-red-600">{project.overduePercentage}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${getProgressBarColor(project.overduePercentage)}`}
                  style={{ width: `${Math.min(project.overduePercentage, 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Action Recommendations */}
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <div className="text-sm">
                <span className="font-medium text-yellow-800">Recommended Actions:</span>
                <ul className="mt-1 text-yellow-700 space-y-1">
                  {project.riskLevel === 'HIGH' && (
                    <>
                      <li>• Immediate review of project timeline and resources</li>
                      <li>• Consider reassigning tasks or adding team members</li>
                      <li>• Schedule urgent stakeholder meeting</li>
                    </>
                  )}
                  {project.riskLevel === 'MEDIUM' && (
                    <>
                      <li>• Review task priorities and deadlines</li>
                      <li>• Check resource allocation and availability</li>
                      <li>• Monitor progress more closely</li>
                    </>
                  )}
                  {project.riskLevel === 'LOW' && (
                    <>
                      <li>• Monitor overdue tasks and provide support</li>
                      <li>• Review task dependencies</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Export Options */}
      <div className="mt-6 flex justify-end space-x-3">
        <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50">
          Export to PDF
        </button>
        <button className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>
    </div>
  );
}

export default RiskProjectsSection;
