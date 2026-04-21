import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/shared/api/instance';
import type { Specialist } from '@/shared/types';
import { Badge } from '@/shared/ui/Badge/Badge';
import { Card } from '@/shared/ui/Card/Card';

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

async function fetchSpecialists(): Promise<Specialist[]> {
  const { data } = await api.get('/specialists');
  return data.data;
}

export function SpecialistsListPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['specialists'],
    queryFn: fetchSpecialists,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="h-52 animate-pulse rounded-2xl border border-[#2e2e3e] bg-[#18181f]"
          />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-[#8b8ba0]">Failed to load trainers. Please try again later.</p>
      </div>
    );
  }

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10"
      >
        <h1 className="text-3xl font-bold text-[#e8e8f0]">Our Trainers</h1>
        <p className="mt-2 text-[#8b8ba0]">
          {data?.length} certified professionals ready to help you
        </p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {data?.map((specialist) => (
          <motion.div key={specialist.id} variants={fadeUp}>
            <Link to={`/specialists/${specialist.id}`}>
              <Card hoverable className="flex flex-col gap-4 h-full">
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-xl font-bold text-white">
                    {specialist.name[0]}
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#e8e8f0]">{specialist.name}</h3>
                    <p className="text-xs text-[#8b8ba0]">{specialist.experience} yrs experience</p>
                  </div>
                </div>

                <p className="text-sm text-[#8b8ba0] line-clamp-2 leading-relaxed">
                  {specialist.description}
                </p>

                <div className="flex flex-wrap gap-2 mt-auto">
                  {specialist.services.slice(0, 3).map(({ service }) => (
                    <Badge key={service.id} variant="info">
                      {service.name}
                    </Badge>
                  ))}
                </div>
              </Card>
            </Link>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
