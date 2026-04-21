import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/store/authStore';
import api from '@/shared/api/instance';
import type { Booking } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Button } from '@/shared/ui/Button/Button';
import { Card } from '@/shared/ui/Card/Card';

const statusBadge: Record<string, 'info' | 'success' | 'danger' | 'warning'> = {
  PENDING: 'warning',
  CONFIRMED: 'success',
  CANCELLED: 'danger',
  COMPLETED: 'info',
};

async function fetchMyBookings(): Promise<Booking[]> {
  const { data } = await api.get('/bookings/my');
  return data.data;
}

async function cancelBooking(id: string) {
  await api.delete(`/bookings/${id}`);
}

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export function ProfilePage() {
  const { isAuthenticated, user } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: bookings, isLoading } = useQuery({
    queryKey: ['my-bookings'],
    queryFn: fetchMyBookings,
    enabled: isAuthenticated,
  });

  const { mutate: cancel, isPending: cancelling } = useMutation({
    mutationFn: cancelBooking,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['my-bookings'] }),
  });

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const upcoming = bookings?.filter((b) => b.status === 'PENDING' || b.status === 'CONFIRMED') ?? [];
  const past = bookings?.filter((b) => b.status !== 'PENDING' && b.status !== 'CONFIRMED') ?? [];

  return (
    <div className="flex flex-col gap-10">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center gap-5"
      >
        <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-500 text-2xl font-bold text-white">
          {user?.name[0].toUpperCase()}
        </div>
        <div>
          <h1 className="text-2xl font-bold text-[#e8e8f0]">{user?.name}</h1>
          <p className="text-sm text-[#8b8ba0]">{user?.email}</p>
        </div>
      </motion.div>

      <section>
        <h2 className="mb-5 text-xl font-semibold text-[#e8e8f0]">Upcoming sessions</h2>

        {isLoading ? (
          <div className="flex flex-col gap-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-28 animate-pulse rounded-2xl bg-[#18181f]" />
            ))}
          </div>
        ) : upcoming.length === 0 ? (
          <Card>
            <p className="text-center text-[#8b8ba0]">
              No upcoming sessions.{' '}
              <a href="/specialists" className="text-indigo-400 hover:underline">
                Find a trainer
              </a>
            </p>
          </Card>
        ) : (
          <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-4">
            {upcoming.map((booking) => (
              <motion.div key={booking.id} variants={fadeUp}>
                <Card className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-[#e8e8f0]">{booking.service.name}</p>
                      <Badge variant={statusBadge[booking.status]}>{booking.status}</Badge>
                    </div>
                    <p className="text-sm text-[#8b8ba0]">with {booking.specialist.name}</p>
                    <p className="text-sm text-[#8b8ba0]">
                      {format(new Date(booking.timeSlot.startTime), 'EEE, MMM d · HH:mm')}
                      {' · '}
                      {booking.service.duration} min
                    </p>
                  </div>
                  <Button
                    variant="danger"
                    size="sm"
                    isLoading={cancelling}
                    onClick={() => cancel(booking.id)}
                  >
                    Cancel
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {past.length > 0 && (
        <section>
          <h2 className="mb-5 text-xl font-semibold text-[#e8e8f0]">Past sessions</h2>
          <motion.div variants={stagger} initial="initial" animate="animate" className="flex flex-col gap-4">
            {past.map((booking) => (
              <motion.div key={booking.id} variants={fadeUp}>
                <Card className="flex items-center justify-between opacity-60">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-[#e8e8f0]">{booking.service.name}</p>
                      <Badge variant={statusBadge[booking.status]}>{booking.status}</Badge>
                    </div>
                    <p className="text-sm text-[#8b8ba0]">
                      {format(new Date(booking.timeSlot.startTime), 'EEE, MMM d · HH:mm')}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-[#e8e8f0]">
                    ${Number(booking.service.price).toFixed(0)}
                  </p>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </section>
      )}
    </div>
  );
}
