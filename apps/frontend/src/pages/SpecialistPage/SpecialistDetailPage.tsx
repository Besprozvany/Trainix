import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import api from '@/shared/api/instance';
import type { Specialist, TimeSlot } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import { Card } from '@/shared/ui/Card/Card';

async function fetchSpecialist(id: string): Promise<Specialist> {
  const { data } = await api.get(`/specialists/${id}`);
  return data.data;
}

async function fetchAvailability(id: string): Promise<TimeSlot[]> {
  const { data } = await api.get(`/specialists/${id}/availability`);
  return data.data;
}

export function SpecialistDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedSlotId, setSelectedSlotId] = useState('');
  const [booking, setBooking] = useState(false);

  const { data: specialist, isLoading } = useQuery({
    queryKey: ['specialist', id],
    queryFn: () => fetchSpecialist(id!),
    enabled: !!id,
  });

  const { data: slots } = useQuery({
    queryKey: ['availability', id],
    queryFn: () => fetchAvailability(id!),
    enabled: !!id,
  });

  const handleBook = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!selectedServiceId || !selectedSlotId) return;
    setBooking(true);
    try {
      await api.post('/bookings', {
        specialistId: id,
        serviceId: selectedServiceId,
        timeSlotId: selectedSlotId,
      });
      navigate('/profile');
    } catch {
      // TODO: show toast
    } finally {
      setBooking(false);
    }
  };

  if (isLoading) {
    return <div className="h-96 animate-pulse rounded-2xl bg-[#18181f]" />;
  }

  if (!specialist) return null;

  const groupedSlots = (slots ?? []).reduce<Record<string, TimeSlot[]>>((acc, slot) => {
    const day = format(new Date(slot.startTime), 'EEE, MMM d');
    (acc[day] ??= []).push(slot);
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-10">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col gap-6 md:flex-row md:items-start"
      >
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-indigo-500 to-violet-600 text-4xl font-bold text-white">
          {specialist.name[0]}
        </div>
        <div className="flex flex-col gap-3">
          <h1 className="text-3xl font-bold text-[#e8e8f0]">{specialist.name}</h1>
          <p className="text-[#8b8ba0] leading-relaxed max-w-xl">{specialist.description}</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="info">{specialist.experience} yrs experience</Badge>
            {specialist.services.map(({ service }) => (
              <Badge key={service.id} variant="default">{service.name}</Badge>
            ))}
          </div>
        </div>
      </motion.div>

      <div className="grid gap-8 lg:grid-cols-[1fr_340px]">
        {/* Availability */}
        <div>
          <h2 className="mb-5 text-xl font-semibold text-[#e8e8f0]">Available slots</h2>

          {Object.keys(groupedSlots).length === 0 ? (
            <Card>
              <p className="text-center text-[#8b8ba0]">No available slots for the next 7 days</p>
            </Card>
          ) : (
            <div className="flex flex-col gap-6">
              {Object.entries(groupedSlots).map(([day, daySlots]) => (
                <div key={day}>
                  <p className="mb-3 text-sm font-medium text-[#8b8ba0]">{day}</p>
                  <div className="flex flex-wrap gap-2">
                    {daySlots.map((slot) => (
                      <motion.button
                        key={slot.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setSelectedSlotId(slot.id)}
                        className={`rounded-xl border px-4 py-2 text-sm transition-all duration-200 ${
                          selectedSlotId === slot.id
                            ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                            : 'border-[#2e2e3e] bg-[#18181f] text-[#e8e8f0] hover:border-indigo-500/50'
                        }`}
                      >
                        {format(new Date(slot.startTime), 'HH:mm')}
                      </motion.button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking card */}
        <div className="sticky top-24">
          <Card className="flex flex-col gap-5">
            <h3 className="text-lg font-semibold text-[#e8e8f0]">Book a session</h3>

            <div>
              <p className="mb-2 text-sm font-medium text-[#8b8ba0]">Select service</p>
              <div className="flex flex-col gap-2">
                {specialist.services.map(({ service }) => (
                  <motion.button
                    key={service.id}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                    onClick={() => setSelectedServiceId(service.id)}
                    className={`flex items-center justify-between rounded-xl border p-3 text-left transition-all duration-200 ${
                      selectedServiceId === service.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-[#2e2e3e] bg-[#22222d] hover:border-indigo-500/30'
                    }`}
                  >
                    <div>
                      <p className="text-sm font-medium text-[#e8e8f0]">{service.name}</p>
                      <p className="text-xs text-[#8b8ba0]">{service.duration} min</p>
                    </div>
                    <span className="text-sm font-semibold text-indigo-400">
                      ${Number(service.price).toFixed(0)}
                    </span>
                  </motion.button>
                ))}
              </div>
            </div>

            {selectedSlotId && (
              <div className="rounded-xl border border-[#2e2e3e] bg-[#22222d] p-3 text-sm">
                <p className="text-[#8b8ba0]">Selected time</p>
                <p className="font-medium text-[#e8e8f0]">
                  {format(
                    new Date(slots?.find((s) => s.id === selectedSlotId)?.startTime ?? ''),
                    'EEE, MMM d · HH:mm',
                  )}
                </p>
              </div>
            )}

            {isAuthenticated ? (
              <Button
                className="w-full justify-center"
                isLoading={booking}
                disabled={!selectedServiceId || !selectedSlotId}
                onClick={handleBook}
              >
                Confirm booking
              </Button>
            ) : (
              <Link to="/login">
                <Button className="w-full justify-center" variant="ghost">
                  Sign in to book
                </Button>
              </Link>
            )}
          </Card>
        </div>
      </div>
    </div>
  );
}
