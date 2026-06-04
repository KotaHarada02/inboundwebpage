'use client';

import { getAccessInfo } from '@/domain/services/dataService';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { MapPin, Train, Clock, ExternalLink } from 'lucide-react';

export default function AccessSection() {
  const accessInfo = getAccessInfo();
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.12, delayChildren: 0.2 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      id="access"
      aria-labelledby="access-heading"
      className="py-24 relative"
    >
      <div className="container mx-auto px-4 relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: -16 }}
          transition={{ duration: 0.7 }}
          className="text-center mb-16"
        >
          <p className="text-[10px] tracking-[0.5em] text-kohaku uppercase mb-3 font-light">
            How to find us
          </p>
          <h2
            id="access-heading"
            className="font-serif text-4xl md:text-5xl font-light text-foreground tracking-wide"
          >
            Access
          </h2>
          <span className="block text-sm text-muted mt-2 tracking-[0.3em] font-light">
            アクセス
          </span>
          <div className="flex items-center justify-center gap-3 mt-6">
            <div className="w-12 h-px bg-kasshoku/30" />
            <div className="w-1.5 h-1.5 bg-shibu-aka rounded-full" />
            <div className="w-12 h-px bg-kasshoku/30" />
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Map */}
          <motion.div
            initial={{ opacity: 0, x: -20, scale: 0.97 }}
            animate={inView ? { opacity: 1, x: 0, scale: 1 } : { opacity: 0, x: -20, scale: 0.97 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="relative h-[420px] lg:h-auto rounded-md overflow-hidden border border-kasshoku/10 group"
            style={{ boxShadow: 'var(--shadow-elevated)' }}
          >
            <iframe
              src={accessInfo.mapUrl}
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="Mitsukabose location on Google Maps"
            />
            {/* Map overlay on hover */}
            <div className="absolute inset-0 bg-kasshoku-deep/0 group-hover:bg-kasshoku-deep/5 transition-colors duration-500 pointer-events-none" />
          </motion.div>

          {/* Info cards */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
            className="flex flex-col justify-center"
          >
            <div className="bg-background-soft/40 backdrop-blur-sm rounded-md border border-kasshoku/8 overflow-hidden" style={{ boxShadow: 'var(--shadow-soft)' }}>
              {/* Station info */}
              <motion.div variants={itemVariants} className="p-6 group/item hover:bg-background-soft/60 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-shibu-aka/8 flex items-center justify-center flex-none mt-0.5">
                    <Train className="w-4 h-4 text-shibu-aka" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-foreground mb-1.5 tracking-wide">
                      Nearest Station
                    </h3>
                    <p className="text-foreground-soft font-light">{accessInfo.station}</p>
                    <p className="text-muted text-sm mt-1 font-light">
                      {accessInfo.walkTime} walk · directly connected
                    </p>
                  </div>
                </div>
              </motion.div>

              <div className="mx-6 h-px bg-kasshoku/8" />

              {/* Address */}
              <motion.div variants={itemVariants} className="p-6 group/item hover:bg-background-soft/60 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-shibu-aka/8 flex items-center justify-center flex-none mt-0.5">
                    <MapPin className="w-4 h-4 text-shibu-aka" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-foreground mb-1.5 tracking-wide">
                      Address
                    </h3>
                    <p className="text-foreground-soft font-light leading-relaxed">
                      2F, Airport Center Building,
                      <br />
                      1-6-5 Hotarugaike Higashimachi,
                      <br />
                      Toyonaka, Osaka 560-0032, Japan
                    </p>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=Mitsukabose+Toyonaka+Osaka`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 mt-2 text-xs text-shibu-aka hover:text-shibu-aka-deep transition-colors font-light"
                    >
                      Open in Google Maps
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </motion.div>

              <div className="mx-6 h-px bg-kasshoku/8" />

              {/* Hours */}
              <motion.div variants={itemVariants} className="p-6 group/item hover:bg-background-soft/60 transition-colors duration-300">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-shibu-aka/8 flex items-center justify-center flex-none mt-0.5">
                    <Clock className="w-4 h-4 text-shibu-aka" aria-hidden="true" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-serif text-lg text-foreground mb-2 tracking-wide">
                      Business Hours
                    </h3>
                    <div className="space-y-1.5">
                      <div className="flex items-baseline justify-between">
                        <span className="text-foreground-soft font-light">Wed – Sat &amp; Holidays</span>
                        <span className="text-foreground text-sm font-light tabular-nums">
                          11:30 – 24:00
                          <span className="text-muted text-xs ml-1">(LO 23:30)</span>
                        </span>
                      </div>
                      <div className="flex items-baseline justify-between">
                        <span className="text-foreground-soft font-light">Sunday</span>
                        <span className="text-foreground text-sm font-light tabular-nums">
                          11:30 – 22:00
                          <span className="text-muted text-xs ml-1">(LO 21:30)</span>
                        </span>
                      </div>
                      <p className="text-muted text-xs mt-1.5 font-light tracking-wide uppercase">
                        Closed Monday &amp; Tuesday
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
