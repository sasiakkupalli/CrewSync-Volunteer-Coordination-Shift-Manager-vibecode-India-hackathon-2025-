import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Download, Plus, Users } from "lucide-react";
import StatsGrid from "@/components/stats-grid";
import UpcomingShifts from "@/components/upcoming-shifts";
import RecentActivity from "@/components/recent-activity";
import VolunteerTable from "@/components/volunteer-table";
import VolunteerPortalModal from "@/components/volunteer-portal-modal";
import { useState } from "react";

export default function Dashboard() {
  const [volunteerPortalOpen, setVolunteerPortalOpen] = useState(false);

  const { data: stats = { activeEvents: 0, totalVolunteers: 0, hoursScheduled: 0, attendanceRate: 0 } } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Dashboard</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Welcome back! Here's what's happening with your events.
            </p>
          </div>
          <div className="mt-4 sm:mt-0 flex space-x-3">
            <Button variant="outline" className="flex items-center">
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Event
            </Button>
          </div>
        </div>
      </div>

      {/* Dashboard Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        <StatsGrid stats={stats} />
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <UpcomingShifts />
          <RecentActivity />
        </div>

        <VolunteerTable />
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 space-y-3">
        <Button
          onClick={() => setVolunteerPortalOpen(true)}
          size="icon"
          className="w-14 h-14 bg-secondary text-white rounded-full shadow-lg hover:bg-secondary/90"
        >
          <Users className="h-6 w-6" />
        </Button>
        <Button
          size="icon"
          className="w-14 h-14 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>

      <VolunteerPortalModal 
        open={volunteerPortalOpen} 
        onOpenChange={setVolunteerPortalOpen} 
      />
    </>
  );
}

