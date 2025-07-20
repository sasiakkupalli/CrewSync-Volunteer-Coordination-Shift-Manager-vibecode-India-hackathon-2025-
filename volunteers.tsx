import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { apiRequest } from "@/lib/queryClient";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Plus, Users, Mail, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertVolunteerSchema, type Volunteer } from "@shared/schema";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";

type VolunteerFormData = z.infer<typeof insertVolunteerSchema>;

export default function Volunteers() {
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const { toast } = useToast();

  const { data: volunteers = [], isLoading } = useQuery<Volunteer[]>({
    queryKey: ["/api/volunteers"],
  });

  const form = useForm<VolunteerFormData>({
    resolver: zodResolver(insertVolunteerSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      skills: [],
      availability: [],
    },
  });

  const createVolunteerMutation = useMutation({
    mutationFn: async (data: VolunteerFormData) => {
      return apiRequest("POST", "/api/volunteers", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers"] });
      queryClient.invalidateQueries({ queryKey: ["/api/volunteers-with-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/stats"] });
      setCreateDialogOpen(false);
      form.reset();
      toast({
        title: "Volunteer added",
        description: "The volunteer has been successfully added.",
      });
    },
    onError: () => {
      toast({
        title: "Error", 
        description: "Failed to add volunteer. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: VolunteerFormData) => {
    // Parse skills and availability from comma-separated strings
    const processedData = {
      ...data,
      skills: data.skills || [],
      availability: data.availability || [],
    };
    createVolunteerMutation.mutate(processedData);
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(word => word[0]).join('').substring(0, 2).toUpperCase();
  };

  const getGradientClass = (index: number) => {
    const gradients = [
      "gradient-blue-purple",
      "gradient-green-teal", 
      "gradient-orange-red"
    ];
    return gradients[index % gradients.length];
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 lg:p-8">
        <div className="text-center">Loading volunteers...</div>
      </div>
    );
  }

  return (
    <>
      {/* Page Header */}
      <div className="bg-white border-b border-neutral-200 px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Volunteers</h1>
            <p className="mt-1 text-sm text-neutral-500">
              Manage your volunteer database and assignments.
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Volunteer
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Add New Volunteer</DialogTitle>
                </DialogHeader>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter full name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Enter email address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter phone number" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <div className="flex justify-end space-x-2 pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setCreateDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button type="submit" disabled={createVolunteerMutation.isPending}>
                        {createVolunteerMutation.isPending ? "Adding..." : "Add Volunteer"}
                      </Button>
                    </div>
                  </form>
                </Form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>

      {/* Volunteers Content */}
      <main className="p-4 sm:p-6 lg:p-8">
        {volunteers.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Users className="h-12 w-12 text-neutral-400 mb-4" />
              <h3 className="text-lg font-medium text-neutral-800 mb-2">No volunteers yet</h3>
              <p className="text-neutral-500 text-center mb-4">
                Start building your volunteer community by adding your first volunteer.
              </p>
              <Button onClick={() => setCreateDialogOpen(true)}>
                <Plus className="mr-2 h-4 w-4" />
                Add Volunteer
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {volunteers.map((volunteer, index) => (
              <Card key={volunteer.id} className="border border-neutral-200">
                <CardContent className="p-6">
                  <div className="flex items-center mb-4">
                    <div className={`w-12 h-12 ${getGradientClass(index)} rounded-full flex items-center justify-center text-white font-semibold`}>
                      {getInitials(volunteer.name)}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium text-neutral-800">{volunteer.name}</h3>
                      <Badge variant="secondary" className="text-xs">
                        Volunteer
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-neutral-600">
                      <Mail className="h-4 w-4 mr-2" />
                      {volunteer.email}
                    </div>
                    {volunteer.phone && (
                      <div className="flex items-center text-sm text-neutral-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {volunteer.phone}
                      </div>
                    )}
                  </div>
                  
                  {volunteer.skills && volunteer.skills.length > 0 && (
                    <div className="mt-4">
                      <p className="text-xs font-medium text-neutral-500 mb-2">SKILLS</p>
                      <div className="flex flex-wrap gap-1">
                        {volunteer.skills.slice(0, 3).map((skill, skillIndex) => (
                          <Badge key={skillIndex} variant="outline" className="text-xs">
                            {skill}
                          </Badge>
                        ))}
                        {volunteer.skills.length > 3 && (
                          <Badge variant="outline" className="text-xs">
                            +{volunteer.skills.length - 3} more
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  
                  <div className="mt-4 flex space-x-2">
                    <Button variant="outline" size="sm" className="flex-1">
                      View Profile
                    </Button>
                    <Button size="sm" className="flex-1">
                      Assign
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

