import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Dashboard from "@/pages/dashboard";
import Events from "@/pages/events";
import Volunteers from "@/pages/volunteers";
import Shifts from "@/pages/shifts";
import Duties from "@/pages/duties";
import VolunteerPortal from "@/pages/volunteer-portal";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import MobileNav from "@/components/layout/mobile-nav";
import { useIsMobile } from "@/hooks/use-mobile";

function Router() {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen flex bg-neutral-50">
      {!isMobile && <Sidebar />}
      
      <div className="flex-1 lg:ml-72">
        {isMobile && <MobileNav />}
        
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/events" component={Events} />
          <Route path="/volunteers" component={Volunteers} />
          <Route path="/shifts" component={Shifts} />
          <Route path="/duties" component={Duties} />
          <Route path="/volunteer-portal" component={VolunteerPortal} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;

