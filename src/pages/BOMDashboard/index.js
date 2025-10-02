import { useState, useEffect } from "react";
import { fetchBOMDashboard } from "~/api/bomApi";
import ProjectOverviewSection from "./components/ProjectOverviewSection";
import SystemProgressSection from "./components/SystemProgressSection";
import PerformanceSection from "./components/PerformanceSection";
import RiskProjectsSection from "./components/RiskProjectsSection";
import KPIMetricsSection from "./components/KPIMetricsSection";
import WeeklyProgressSection from "./components/WeeklyProgressSection";
import LoadingSpinner from "~/components/common/LoadingSpinner";

function BOMDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        const data = await fetchBOMDashboard();
        setDashboardData(data);
      } catch (error) {
        console.error("Error loading BOM dashboard:", error);
        setError("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-gray-600">No data available</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            BOM Dashboard
          </h1>
          <p className="text-gray-600">
            System-wide overview and performance metrics
          </p>
        </div>

        {/* Alert Section for High Risk Projects */}
        {dashboardData.riskProjects && dashboardData.riskProjects.length > 0 && (
          <div className="mb-6">
            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    High Risk Projects Alert
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>
                      {dashboardData.riskProjects.filter(p => p.riskLevel === 'HIGH').length} projects 
                      have high risk levels with significant overdue tasks.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard Grid */}
        <div className="space-y-8">
          {/* KPI Metrics - Top Priority */}
          <KPIMetricsSection data={dashboardData.kpiMetrics} />

          {/* Project Overview and System Progress */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ProjectOverviewSection data={dashboardData.overview} />
            <SystemProgressSection data={dashboardData.systemProgress} />
          </div>

          {/* Weekly Progress Chart */}
          <WeeklyProgressSection data={dashboardData.weeklyProgress} />

          {/* Performance Tables */}
          <PerformanceSection 
            spaceData={dashboardData.spacePerformance}
            pmData={dashboardData.pmPerformance}
          />

          {/* Risk Projects */}
          <RiskProjectsSection data={dashboardData.riskProjects} />
        </div>
      </div>
    </div>
  );
}

export default BOMDashboard;
