
import { useDashboardData } from "@/hooks/useDashboardData";
import UserStatsCards from "@/components/Dashboard/UserStatsCards";
import DailyChallengeCard from "@/components/Dashboard/DailyChallengeCard";
import AchievementsCard from "@/components/Dashboard/AchievementsCard";
import ChallengeLibrarySection from "@/components/Dashboard/ChallengeLibrarySection";

const Dashboard = () => {
  const { stats, challengeStats, loading } = useDashboardData();

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading your dashboard...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Welcome back, PM!</h1>
          <p className="text-gray-400">Ready to level up your product management skills?</p>
        </div>

        {/* Stats Cards */}
        <UserStatsCards stats={stats} />

        {/* Main Actions */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          <DailyChallengeCard />
          <AchievementsCard />
        </div>

        {/* Challenge Library */}
        <ChallengeLibrarySection challengeStats={challengeStats} />
      </div>
    </div>
  );
};

export default Dashboard;
