export type Role = 'CLIENT' | 'SPECIALIST' | 'ADMIN';
export type BookingStatus = 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface User {
  id: string;
  email: string;
  name: string;
  role: Role;
  createdAt: string;
}

export interface Service {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: number;
}

export interface Specialist {
  id: string;
  name: string;
  description: string;
  avatar: string | null;
  experience: number;
  services: Array<{ service: Service }>;
  _count?: { bookings: number };
}

export interface TimeSlot {
  id: string;
  specialistId: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

export interface Booking {
  id: string;
  userId: string;
  specialistId: string;
  serviceId: string;
  timeSlotId: string;
  status: BookingStatus;
  notes: string | null;
  service: Service;
  specialist: Specialist;
  timeSlot: TimeSlot;
  review: Review | null;
  createdAt: string;
}

export interface Review {
  id: string;
  rating: number;
  comment: string | null;
  createdAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
}
