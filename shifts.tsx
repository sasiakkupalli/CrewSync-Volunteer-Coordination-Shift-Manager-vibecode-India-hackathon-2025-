import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Clock, MapPin, Users } from "lucide-react";
import type { Shift, Event, Duty } from "@shared/schema";

interface ShiftWithDetails extends Shift {
  eventName: string;
  dutyName: string;
  assignedVolunteers: number;
}

export default function Shifts() {
  const { data: shifts = [], isLoading: shiftsLoading } = useQuery<Shift[]>({
    queryKey: ["/api/shifts"],
  });

  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  const { data: duties = [] } = useQuery<Duty[]>({
    queryKey: ["/api/duties"],
  });

  const { data: assignments = [] } = useQuery({
    queryKey: ["/api/assignments"],
  });

  const shiftsWithDetails: ShiftWithDetails[] = shifts.map(shift => {
    const event = events.find(e => e.id === shift.eventId);
    const duty = duties.find(d => d.id === shift.dutyId);
    const shiftAssignments = assignments.filter((a: any) => a.shiftId === shift.id);

    return {
      ...shift,
      eventName: event?.name || "Unknown Event",
      dutyName: duty?.name || "Unknown Duty",
      assignedVolunteers: shiftAssignments.length,
    };
  });

  const getShiftStatus = (shift: Shift) => {
    const now = new Date();
    const startTime = new Date(shift.startTime);
    const endTime = new Date(shift.endTime);

    if (now >= startTime && now <= endTime) {
      return { status: "active", label: "Active", className: "bg-secondary/10 text-secondary" };
    } else if (now < startTime) {
      return { status: "upcoming", label: "Upcoming", className: "bg-accent/10 text-accent" };
    } else {
      return { status: "completed", label: "Completed", className: "bg-neutral-100 text-neutral-600" };
    }
  };

  const formatDateTime = (date: Date) => {
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  if (shiftsLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">Loading shifts...</div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Shifts</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage volunteer shifts and time schedules.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Button className="flex items-center">
              <Plus className="mr-2 h-4 w-4" />
              Create Shift
            </Button>
          </div>
        </div>
      </div>

      {/* Shifts Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {shiftsWithDetails.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Clock className="h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">No shifts scheduled</h3>
              <p className="text-neutral-500 text-center mb-4">
                Create your first shift to start scheduling volunteers.
              </p>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Create Shift
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {shiftsWithDetails.map((shift) => {
              const status = getShiftStatus(shift);
              
              return (
                <Card key={shift.id} className="border border-neutral-200">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-800 mb-1">
                          {shift.dutyName}
                        </h3>
                        <p className="text-sm text-neutral-600">{shift.eventName}</p>
                      </div>
                      <Badge className={status.className}>
                        {status.label}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-neutral-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {formatDateTime(shift.startTime)} - {formatDateTime(shift.endTime)}
                      </div>
                      
                      {shift.location && (
                        <div className="flex items-center text-sm text-neutral-600">
                          <MapPin className="h-4 w-4 mr-2" />
                          {shift.location}
                        </div>
                      )}
                      
                      <div className="flex items-center text-sm text-neutral-600">
                        <Users className="h-4 w-4 mr-2" />
                        {shift.assignedVolunteers} / {shift.maxVolunteers} volunteers
                      </div>
                    </div>
                    
                    {/* Progress bar for volunteer assignment */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-neutral-500 mb-1">
                        <span>Volunteers assigned</span>
                        <span>{Math.round((shift.assignedVolunteers / shift.maxVolunteers) * 100)}%</span>
                      </div>
                      <div className="w-full bg-neutral-200 rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full transition-all"
                          style={{
                            width: `${Math.min((shift.assignedVolunteers / shift.maxVolunteers) * 100, 100)}%`
                          }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                      <Button size="sm" className="flex-1">
                        Manage
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}

