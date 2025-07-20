import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  LogOut, 
  Clock, 
  Calendar, 
  UserPen, 
  HelpCircle, 
  Bell, 
  MapPin, 
  ClipboardList,
  Utensils,
  Users
} from "lucide-react";

interface VolunteerPortalModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function VolunteerPortalModal({ open, onOpenChange }: VolunteerPortalModalProps) {
  // Mock volunteer data - in real app this would come from API
  const volunteer = {
    name: "Sarah Chen",
    email: "sarah.chen@email.com",
    initials: "SC",
  };

  const currentAssignment = {
    event: "Charity Fundraiser",
    duty: "Registration Desk", 
    time: "2:00 PM - 6:00 PM",
    location: "Main Entrance",
    status: "active",
  };

  const upcomingTasks = [
    {
      id: 1,
      event: "Community Marathon",
      duty: "Water Station",
      date: "Tomorrow",
      time: "6:00 AM - 2:00 PM",
      icon: Users,
      color: "bg-green-100 text-green-800",
    },
    {
      id: 2,
      event: "Food Festival", 
      duty: "Food Service",
      date: "Dec 15",
      time: "10:00 AM - 2:00 PM",
      icon: Utensils,
      color: "bg-orange-100 text-orange-800",
    },
  ];

  const quickActions = [
    { icon: Calendar, label: "View Schedule", color: "text-primary" },
    { icon: UserPen, label: "Update Profile", color: "text-primary" },
    { icon: HelpCircle, label: "Get Help", color: "text-primary" },
    { icon: Bell, label: "Notifications", color: "text-primary" },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Volunteer Portal</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Volunteer Profile */}
          <div className="text-center">
            <div className="w-20 h-20 gradient-blue-purple rounded-full flex items-center justify-center text-white font-bold text-xl mx-auto mb-4">
              {volunteer.initials}
            </div>
            <h3 className="text-lg font-semibold text-neutral-800">{volunteer.name}</h3>
            <p className="text-sm text-neutral-500">{volunteer.email}</p>
          </div>

          {/* Current Assignment */}
          <div className="bg-secondary/5 border border-secondary/20 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium text-neutral-800">Current Assignment</h4>
              <Badge className="bg-secondary/10 text-secondary">
                <span className="w-1.5 h-1.5 bg-secondary rounded-full mr-1.5"></span>
                Active
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-medium">Event:</span> {currentAssignment.event}
              </p>
              <p className="text-sm">
                <span className="font-medium">Duty:</span> {currentAssignment.duty}
              </p>
              <p className="text-sm">
                <span className="font-medium">Time:</span> {currentAssignment.time}
              </p>
              <p className="text-sm flex items-center">
                <span className="font-medium">Location:</span> 
                <MapPin className="h-3 w-3 ml-1 mr-1" />
                {currentAssignment.location}
              </p>
            </div>
            <div className="mt-4 flex space-x-2">
              <Button className="flex-1 bg-secondary text-white hover:bg-secondary/90">
                <LogOut className="mr-2 h-4 w-4" />
                Check Out
              </Button>
              <Button variant="outline" className="flex-1">
                <Clock className="mr-2 h-4 w-4" />
                Break
              </Button>
            </div>
          </div>

          {/* Upcoming Tasks */}
          <div>
            <h4 className="font-medium text-neutral-800 mb-3">Upcoming Tasks</h4>
            <div className="space-y-3">
              {upcomingTasks.map((task) => {
                const Icon = task.icon;
                return (
                  <div key={task.id} className="border border-neutral-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="font-medium text-sm text-neutral-800">{task.event}</h5>
                      <span className="text-xs text-neutral-500">{task.date}</span>
                    </div>
                    <div className="flex items-center text-sm text-neutral-600">
                      <Badge className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${task.color} mr-2`}>
                        <Icon className="mr-1 h-3 w-3" />
                        {task.duty}
                      </Badge>
                      <span>{task.time}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div>
            <h4 className="font-medium text-neutral-800 mb-3">Quick Actions</h4>
            <div className="grid grid-cols-2 gap-3">
              {quickActions.map((action, index) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={index}
                    variant="outline"
                    className="flex flex-col items-center p-3 h-auto"
                  >
                    <Icon className={`${action.color} h-5 w-5 mb-2`} />
                    <span className="text-xs font-medium text-neutral-700">{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

