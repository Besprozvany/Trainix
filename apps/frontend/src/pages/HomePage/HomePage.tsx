import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Button } from '@/shared/ui/Button/Button';
import { Card } from '@/shared/ui/Card/Card';

const features = [
  {
    icon: '🎯',
    title: 'Choose your trainer',
    description: 'Browse certified professionals and find the perfect match for your goals.',
  },
  {
    icon: '📅',
    title: 'Book in seconds',
    description: 'Pick an available slot and confirm your session instantly.',
  },
  {
    icon: '🔄',
    title: 'Manage bookings',
    description: 'View, reschedule or cancel your upcoming sessions anytime.',
  },
];

const staggerContainer = {
  animate: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
};

export function HomePage() {
  return (
    <div className="flex flex-col gap-24">
      {/* Hero */}
      <motion.section
        variants={staggerContainer}
        initial="initial"
        animate="animate"
        className="flex flex-col items-center gap-8 pt-16 text-center"
      >
        <motion.div
          variants={fadeUp}
          className="inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400"
        >
          <span className="h-2 w-2 rounded-full bg-indigo-400 animate-pulse" />
          Trainix — fitness booking platform
        </motion.div>

        <motion.h1
          variants={fadeUp}
          className="max-w-3xl text-5xl font-bold leading-tight tracking-tight text-[#e8e8f0] md:text-6xl"
        >
          Book your{' '}
          <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
            perfect session
          </span>{' '}
          in seconds
        </motion.h1>

        <motion.p
          variants={fadeUp}
          className="max-w-xl text-lg text-[#8b8ba0]"
        >
          Connect with top fitness trainers. Choose your service, pick a time, and start your
          journey — no hassle.
        </motion.p>

        <motion.div variants={fadeUp} className="flex items-center gap-4">
          <Link to="/specialists">
            <Button size="lg">Browse trainers</Button>
          </Link>
          <Link to="/register">
            <Button size="lg" variant="ghost">Sign up free</Button>
          </Link>
        </motion.div>

        {/* Glow effect */}
        <motion.div
          variants={fadeUp}
          className="pointer-events-none absolute left-1/2 top-40 h-96 w-96 -translate-x-1/2 rounded-full bg-indigo-600/10 blur-3xl"
        />
      </motion.section>

      {/* Features */}
      <section>
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
          className="grid gap-6 md:grid-cols-3"
        >
          {features.map((feature) => (
            <motion.div key={feature.title} variants={fadeUp}>
              <Card hoverable className="flex flex-col gap-4 h-full">
                <span className="text-3xl">{feature.icon}</span>
                <h3 className="text-lg font-semibold text-[#e8e8f0]">{feature.title}</h3>
                <p className="text-sm text-[#8b8ba0] leading-relaxed">{feature.description}</p>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* CTA */}
      <motion.section
        initial={{ opacity: 0, scale: 0.97 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="rounded-3xl border border-indigo-500/20 bg-gradient-to-br from-indigo-500/10 to-violet-500/10 p-12 text-center"
      >
        <h2 className="mb-4 text-3xl font-bold text-[#e8e8f0]">Ready to get started?</h2>
        <p className="mb-8 text-[#8b8ba0]">Join hundreds of clients training with Trainix.</p>
        <Link to="/register">
          <Button size="lg">Create free account</Button>
        </Link>
      </motion.section>
    </div>
  );
}
