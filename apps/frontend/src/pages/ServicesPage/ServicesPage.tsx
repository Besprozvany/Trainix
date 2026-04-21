import { useQuery } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import api from '@/shared/api/instance';
import type { Service } from '@/shared/types';
import { Card } from '@/shared/ui/Card/Card';
import { Button } from '@/shared/ui/Button/Button';

const stagger = {
  animate: { transition: { staggerChildren: 0.07 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
};

async function fetchServices(): Promise<Service[]> {
  const { data } = await api.get('/services');
  return data.data;
}

export function ServicesPage() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['services'],
    queryFn: fetchServices,
  });

  if (isLoading) {
    return (
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-44 animate-pulse rounded-2xl border border-[#2e2e3e] bg-[#18181f]" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center gap-4 py-24 text-center">
        <span className="text-4xl">⚠️</span>
        <p className="text-[#8b8ba0]">Failed to load services. Please try again later.</p>
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
        <h1 className="text-3xl font-bold text-[#e8e8f0]">Services</h1>
        <p className="mt-2 text-[#8b8ba0]">Choose a service and find the right trainer for you</p>
      </motion.div>

      <motion.div
        variants={stagger}
        initial="initial"
        animate="animate"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
      >
        {data?.map((service) => (
          <motion.div key={service.id} variants={fadeUp}>
            <Card hoverable className="flex flex-col gap-4 h-full">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-semibold text-[#e8e8f0]">{service.name}</h3>
                <span className="text-lg font-bold text-indigo-400">
                  ${Number(service.price).toFixed(0)}
                </span>
              </div>

              <p className="text-sm text-[#8b8ba0] leading-relaxed flex-1">
                {service.description}
              </p>

              <div className="flex items-center justify-between mt-auto pt-2 border-t border-[#2e2e3e]">
                <span className="text-xs text-[#8b8ba0]">⏱ {service.duration} min</span>
                <Link to="/specialists">
                  <Button size="sm" variant="ghost">Find a trainer</Button>
                </Link>
              </div>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
