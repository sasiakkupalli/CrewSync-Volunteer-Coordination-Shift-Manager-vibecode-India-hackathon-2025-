import { 
  users, events, duties, shifts, volunteers, assignments,
  type User, type InsertUser,
  type Event, type InsertEvent,
  type Duty, type InsertDuty,
  type Shift, type InsertShift,
  type Volunteer, type InsertVolunteer,
  type Assignment, type InsertAssignment
} from "@shared/schema";

export interface IStorage {
  // Users
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: number): Promise<Event | undefined>;
  createEvent(event: InsertEvent): Promise<Event>;
  updateEvent(id: number, event: Partial<Event>): Promise<Event | undefined>;
  deleteEvent(id: number): Promise<boolean>;

  // Volunteers
  getVolunteers(): Promise<Volunteer[]>;
  getVolunteer(id: number): Promise<Volunteer | undefined>;
  getVolunteerByEmail(email: string): Promise<Volunteer | undefined>;
  createVolunteer(volunteer: InsertVolunteer): Promise<Volunteer>;
  updateVolunteer(id: number, volunteer: Partial<Volunteer>): Promise<Volunteer | undefined>;
  deleteVolunteer(id: number): Promise<boolean>;

  // Duties
  getDuties(): Promise<Duty[]>;
  getDutiesByEvent(eventId: number): Promise<Duty[]>;
  getDuty(id: number): Promise<Duty | undefined>;
  createDuty(duty: InsertDuty): Promise<Duty>;
  updateDuty(id: number, duty: Partial<Duty>): Promise<Duty | undefined>;
  deleteDuty(id: number): Promise<boolean>;

  // Shifts
  getShifts(): Promise<Shift[]>;
  getShiftsByEvent(eventId: number): Promise<Shift[]>;
  getShift(id: number): Promise<Shift | undefined>;
  createShift(shift: InsertShift): Promise<Shift>;
  updateShift(id: number, shift: Partial<Shift>): Promise<Shift | undefined>;
  deleteShift(id: number): Promise<boolean>;

  // Assignments
  getAssignments(): Promise<Assignment[]>;
  getAssignmentsByVolunteer(volunteerId: number): Promise<Assignment[]>;
  getAssignmentsByShift(shiftId: number): Promise<Assignment[]>;
  getAssignment(id: number): Promise<Assignment | undefined>;
  createAssignment(assignment: InsertAssignment): Promise<Assignment>;
  updateAssignment(id: number, assignment: Partial<Assignment>): Promise<Assignment | undefined>;
  deleteAssignment(id: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private events: Map<number, Event>;
  private volunteers: Map<number, Volunteer>;
  private duties: Map<number, Duty>;
  private shifts: Map<number, Shift>;
  private assignments: Map<number, Assignment>;
  private currentIds: { [key: string]: number };

  constructor() {
    this.users = new Map();
    this.events = new Map();
    this.volunteers = new Map();
    this.duties = new Map();
    this.shifts = new Map();
    this.assignments = new Map();
    this.currentIds = {
      users: 1,
      events: 1,
      volunteers: 1,
      duties: 1,
      shifts: 1,
      assignments: 1,
    };

    // Seed with sample data
    this.seedData();
  }

  private async seedData() {
    // Create admin user
    await this.createUser({
      username: "admin",
      password: "admin",
      role: "organizer",
    });

    // Create sample volunteers
    const volunteer1 = await this.createVolunteer({
      name: "Sarah Chen",
      email: "sarah.chen@email.com",
      phone: "(555) 123-4567",
      skills: ["registration", "customer_service"],
      availability: ["weekdays", "weekends"],
    });

    const volunteer2 = await this.createVolunteer({
      name: "Mike Johnson",
      email: "mike.j@email.com", 
      phone: "(555) 234-5678",
      skills: ["setup", "manual_labor"],
      availability: ["weekends"],
    });

    const volunteer3 = await this.createVolunteer({
      name: "Anna Davis",
      email: "anna.davis@email.com",
      phone: "(555) 345-6789",
      skills: ["food_service", "hospitality"],
      availability: ["weekdays"],
    });

    // Create sample event
    const event1 = await this.createEvent({
      name: "Charity Fundraiser",
      description: "Annual charity fundraising event",
      startDate: new Date(),
      endDate: new Date(Date.now() + 8 * 60 * 60 * 1000), // 8 hours from now
      location: "Community Center",
      organizerId: 1,
      status: "active",
    });

    // Create sample duties
    const duty1 = await this.createDuty({
      name: "Registration",
      description: "Check-in volunteers and guests",
      eventId: event1.id,
      color: "blue",
    });

    const duty2 = await this.createDuty({
      name: "Setup Crew",
      description: "Set up tables, chairs, and equipment",
      eventId: event1.id,
      color: "green",
    });

    const duty3 = await this.createDuty({
      name: "Food Service",
      description: "Serve food and beverages",
      eventId: event1.id,
      color: "purple",
    });

    // Create sample shifts
    const shift1 = await this.createShift({
      eventId: event1.id,
      dutyId: duty1.id,
      startTime: new Date(),
      endTime: new Date(Date.now() + 4 * 60 * 60 * 1000),
      maxVolunteers: 2,
      location: "Main Entrance",
    });

    const shift2 = await this.createShift({
      eventId: event1.id,
      dutyId: duty2.id,
      startTime: new Date(Date.now() - 3 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 1 * 60 * 60 * 1000),
      maxVolunteers: 4,
      location: "Main Hall",
    });

    const shift3 = await this.createShift({
      eventId: event1.id,
      dutyId: duty3.id,
      startTime: new Date(Date.now() - 1 * 60 * 60 * 1000),
      endTime: new Date(Date.now() + 3 * 60 * 60 * 1000),
      maxVolunteers: 3,
      location: "Food Area",
    });

    // Create sample assignments
    await this.createAssignment({
      shiftId: shift1.id,
      volunteerId: volunteer1.id,
      status: "checked_in",
      checkInTime: new Date(Date.now() - 30 * 60 * 1000),
    });

    await this.createAssignment({
      shiftId: shift2.id,
      volunteerId: volunteer2.id,
      status: "no_show",
    });

    await this.createAssignment({
      shiftId: shift3.id,
      volunteerId: volunteer3.id,
      status: "break",
      checkInTime: new Date(Date.now() - 60 * 60 * 1000),
    });
  }

  // Users
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentIds.users++;
    const user: User = { 
      ...insertUser, 
      id,
      role: insertUser.role || "volunteer"
    };
    this.users.set(id, user);
    return user;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return Array.from(this.events.values());
  }

  async getEvent(id: number): Promise<Event | undefined> {
    return this.events.get(id);
  }

  async createEvent(insertEvent: InsertEvent): Promise<Event> {
    const id = this.currentIds.events++;
    const event: Event = { 
      ...insertEvent, 
      id,
      description: insertEvent.description || null,
      status: insertEvent.status || "scheduled"
    };
    this.events.set(id, event);
    return event;
  }

  async updateEvent(id: number, eventUpdate: Partial<Event>): Promise<Event | undefined> {
    const event = this.events.get(id);
    if (!event) return undefined;
    const updated = { ...event, ...eventUpdate };
    this.events.set(id, updated);
    return updated;
  }

  async deleteEvent(id: number): Promise<boolean> {
    return this.events.delete(id);
  }

  // Volunteers
  async getVolunteers(): Promise<Volunteer[]> {
    return Array.from(this.volunteers.values());
  }

  async getVolunteer(id: number): Promise<Volunteer | undefined> {
    return this.volunteers.get(id);
  }

  async getVolunteerByEmail(email: string): Promise<Volunteer | undefined> {
    return Array.from(this.volunteers.values()).find(volunteer => volunteer.email === email);
  }

  async createVolunteer(insertVolunteer: InsertVolunteer): Promise<Volunteer> {
    const id = this.currentIds.volunteers++;
    const volunteer: Volunteer = { 
      ...insertVolunteer, 
      id,
      phone: insertVolunteer.phone || null,
      skills: insertVolunteer.skills || null,
      availability: insertVolunteer.availability || null
    };
    this.volunteers.set(id, volunteer);
    return volunteer;
  }

  async updateVolunteer(id: number, volunteerUpdate: Partial<Volunteer>): Promise<Volunteer | undefined> {
    const volunteer = this.volunteers.get(id);
    if (!volunteer) return undefined;
    const updated = { ...volunteer, ...volunteerUpdate };
    this.volunteers.set(id, updated);
    return updated;
  }

  async deleteVolunteer(id: number): Promise<boolean> {
    return this.volunteers.delete(id);
  }

  // Duties
  async getDuties(): Promise<Duty[]> {
    return Array.from(this.duties.values());
  }

  async getDutiesByEvent(eventId: number): Promise<Duty[]> {
    return Array.from(this.duties.values()).filter(duty => duty.eventId === eventId);
  }

  async getDuty(id: number): Promise<Duty | undefined> {
    return this.duties.get(id);
  }

  async createDuty(insertDuty: InsertDuty): Promise<Duty> {
    const id = this.currentIds.duties++;
    const duty: Duty = { 
      ...insertDuty, 
      id,
      description: insertDuty.description || null,
      color: insertDuty.color || "blue"
    };
    this.duties.set(id, duty);
    return duty;
  }

  async updateDuty(id: number, dutyUpdate: Partial<Duty>): Promise<Duty | undefined> {
    const duty = this.duties.get(id);
    if (!duty) return undefined;
    const updated = { ...duty, ...dutyUpdate };
    this.duties.set(id, updated);
    return updated;
  }

  async deleteDuty(id: number): Promise<boolean> {
    return this.duties.delete(id);
  }

  // Shifts
  async getShifts(): Promise<Shift[]> {
    return Array.from(this.shifts.values());
  }

  async getShiftsByEvent(eventId: number): Promise<Shift[]> {
    return Array.from(this.shifts.values()).filter(shift => shift.eventId === eventId);
  }

  async getShift(id: number): Promise<Shift | undefined> {
    return this.shifts.get(id);
  }

  async createShift(insertShift: InsertShift): Promise<Shift> {
    const id = this.currentIds.shifts++;
    const shift: Shift = { 
      ...insertShift, 
      id,
      location: insertShift.location || null,
      maxVolunteers: insertShift.maxVolunteers || 1
    };
    this.shifts.set(id, shift);
    return shift;
  }

  async updateShift(id: number, shiftUpdate: Partial<Shift>): Promise<Shift | undefined> {
    const shift = this.shifts.get(id);
    if (!shift) return undefined;
    const updated = { ...shift, ...shiftUpdate };
    this.shifts.set(id, updated);
    return updated;
  }

  async deleteShift(id: number): Promise<boolean> {
    return this.shifts.delete(id);
  }

  // Assignments
  async getAssignments(): Promise<Assignment[]> {
    return Array.from(this.assignments.values());
  }

  async getAssignmentsByVolunteer(volunteerId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(assignment => assignment.volunteerId === volunteerId);
  }

  async getAssignmentsByShift(shiftId: number): Promise<Assignment[]> {
    return Array.from(this.assignments.values()).filter(assignment => assignment.shiftId === shiftId);
  }

  async getAssignment(id: number): Promise<Assignment | undefined> {
    return this.assignments.get(id);
  }

  async createAssignment(insertAssignment: InsertAssignment): Promise<Assignment> {
    const id = this.currentIds.assignments++;
    const assignment: Assignment = { 
      ...insertAssignment, 
      id,
      status: insertAssignment.status || "assigned",
      checkInTime: insertAssignment.checkInTime || null,
      checkOutTime: insertAssignment.checkOutTime || null,
      notes: insertAssignment.notes || null
    };
    this.assignments.set(id, assignment);
    return assignment;
  }

  async updateAssignment(id: number, assignmentUpdate: Partial<Assignment>): Promise<Assignment | undefined> {
    const assignment = this.assignments.get(id);
    if (!assignment) return undefined;
    const updated = { ...assignment, ...assignmentUpdate };
    this.assignments.set(id, updated);
    return updated;
  }

  async deleteAssignment(id: number): Promise<boolean> {
    return this.assignments.delete(id);
  }
}

export const storage = new MemStorage();

