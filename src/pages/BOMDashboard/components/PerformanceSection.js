import React, { useState } from 'react';

function PerformanceSection({ spaceData, pmData }) {
  const [activeTab, setActiveTab] = useState('spaces');

  const getPerformanceColor = (rate) => {
    if (rate >= 80) return 'text-green-600 bg-green-50';
    if (rate >= 60) return 'text-yellow-600 bg-yellow-50';
    return 'text-red-600 bg-red-50';
  };

  const getRiskBadge = (overdueCount) => {
    if (overdueCount === 0) return { text: 'Low', color: 'bg-green-100 text-green-800' };
    if (overdueCount <= 3) return { text: 'Medium', color: 'bg-yellow-100 text-yellow-800' };
    return { text: 'High', color: 'bg-red-100 text-red-800' };
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-2">
          Performance Analysis
        </h2>
        <p className="text-gray-600">
          Performance metrics by Space and Project Manager
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setActiveTab('spaces')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'spaces'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          By Space
        </button>
        <button
          onClick={() => setActiveTab('pms')}
          className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'pms'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          By Project Manager
        </button>
      </div>

      {/* Space Performance Table */}
      {activeTab === 'spaces' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Space
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-time Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue Tasks
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Risk Level
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {spaceData && spaceData.length > 0 ? (
                spaceData.map((space, index) => {
                  const riskBadge = getRiskBadge(space.overdueTasksCount);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {space.spaceName}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {space.totalProjects}
                          <span className="text-gray-500 ml-1">
                            ({space.activeProjectsCount} active)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(space.onTimeCompletionRate)}`}>
                          {space.onTimeCompletionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {space.overdueTasksCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskBadge.color}`}>
                          {riskBadge.text}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No space data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* PM Performance Table */}
      {activeTab === 'pms' && (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Project Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  On-time Rate
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Overdue Projects
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {pmData && pmData.length > 0 ? (
                pmData.map((pm, index) => {
                  const riskBadge = getRiskBadge(pm.overdueProjectsCount);
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {pm.pmName || 'Unknown PM'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {pm.totalProjects}
                          <span className="text-gray-500 ml-1">
                            ({pm.activeProjectsCount} active)
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getPerformanceColor(pm.onTimeCompletionRate)}`}>
                          {pm.onTimeCompletionRate}%
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {pm.overdueProjectsCount}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${riskBadge.color}`}>
                          {pm.onTimeCompletionRate >= 80 ? 'Excellent' : 
                           pm.onTimeCompletionRate >= 60 ? 'Good' : 'Needs Improvement'}
                        </span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-4 text-center text-gray-500">
                    No PM data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Performance Summary */}
      <div className="mt-6 p-4 bg-gray-50 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Performance Summary</h3>
        {activeTab === 'spaces' && spaceData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Top Performing Space:</span>{" "}
              {spaceData.length > 0 ? 
                spaceData.reduce((prev, current) => 
                  prev.onTimeCompletionRate > current.onTimeCompletionRate ? prev : current
                ).spaceName : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Average Completion Rate:</span>{" "}
              {spaceData.length > 0 ? 
                Math.round(spaceData.reduce((sum, space) => sum + space.onTimeCompletionRate, 0) / spaceData.length) : 0}%
            </div>
            <div>
              <span className="font-medium">Total Overdue Tasks:</span>{" "}
              {spaceData.reduce((sum, space) => sum + space.overdueTasksCount, 0)}
            </div>
          </div>
        )}
        {activeTab === 'pms' && pmData && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-700">
            <div>
              <span className="font-medium">Top Performing PM:</span>{" "}
              {pmData.length > 0 ? 
                pmData.reduce((prev, current) => 
                  prev.onTimeCompletionRate > current.onTimeCompletionRate ? prev : current
                ).pmName || 'N/A' : 'N/A'}
            </div>
            <div>
              <span className="font-medium">Average Completion Rate:</span>{" "}
              {pmData.length > 0 ? 
                Math.round(pmData.reduce((sum, pm) => sum + pm.onTimeCompletionRate, 0) / pmData.length) : 0}%
            </div>
            <div>
              <span className="font-medium">Total Overdue Projects:</span>{" "}
              {pmData.reduce((sum, pm) => sum + pm.overdueProjectsCount, 0)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PerformanceSection;
