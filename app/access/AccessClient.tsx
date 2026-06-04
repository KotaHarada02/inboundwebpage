'use client';

import Image from 'next/image';
import Link from 'next/link';
import { DecorativeBackground } from '@/components/ui/DecorativeBackground';
import { MapPin, Train, Clock, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { siteConfig } from '@/lib/siteConfig';

const restaurantInfo = {
  address:
    '2F, Airport Center Building, 1-6-5 Hotarugaike Higashimachi, Toyonaka, Osaka 560-0032, Japan',
  access:
    '1-minute walk from Hotarugaike Station East Exit (Hankyu Takarazuka Line & Osaka Monorail)',
  hours: {
    'Wed–Sat': '11:30–24:00 (Last order 23:30)',
    'Sun & Holidays': '11:30–22:00 (Last order 21:30)',
  } as const,
  closed: ['Monday', 'Tuesday'] as const,
  phone: siteConfig.telephone,
};

const mapEmbedUrl =
  'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3276.4277464384927!2d135.44954909999998!3d34.7951789!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6000f077fa0f081f%3A0x41a2ef4a75848277!2z55m66YW144Go5ZGz5ZmM44Go6bq6IOOBv-OBpOOBi-WdiuS4uw!5e0!3m2!1sja!2sjp!4v1757148904874!5m2!1sja!2sjp';

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

export default function AccessClient() {
  return (
    <div className="min-h-screen bg-background">
      <DecorativeBackground />
      <main className="relative z-10">
        {/* Page Header */}
        <header className="relative z-10 pt-20 pb-16 px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-xl mx-auto"
          >
            <p className="text-xs tracking-[0.5em] text-kohaku uppercase mb-3">
              How to find us
            </p>
            <h1 className="font-serif text-5xl md:text-6xl font-light text-foreground mb-3 tracking-wide">
              Access
            </h1>
            <p className="text-lg text-foreground-soft font-light">
              <span className="font-serif tracking-[0.3em]">アクセス</span>
              <span className="mx-3 text-muted">·</span>
              1 min from Hotarugaike Station
            </p>
          </motion.div>
        </header>

        <div className="max-w-5xl mx-auto px-4 pb-24">
          {/* Entrance Photo */}
          <motion.section
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            className="mb-20"
          >
            <div className="text-center mb-8">
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground mb-2">
                Our Entrance
              </h2>
              <p className="text-muted text-sm tracking-widest uppercase">
                Look for the staircase on the 2F
              </p>
            </div>
            <div className="rounded-md overflow-hidden shadow-cinematic border border-kasshoku/10 max-w-3xl mx-auto bg-background-soft">
              <div className="relative w-full aspect-[3/4] sm:aspect-[4/3] md:aspect-[3/4]">
                <Image
                  src="/images/access/store-front.jpg"
                  alt="The entrance to Mitsukabose on the 2nd floor of the Airport Center Building"
                  fill
                  className="object-cover object-bottom"
                  sizes="(max-width: 640px) 100vw, (max-width: 768px) 70vw, 800px"
                  priority
                />
              </div>
            </div>
            <p className="mt-6 text-center text-foreground-soft max-w-2xl mx-auto leading-relaxed">
              You&apos;ll find us on the 2nd floor of the Airport Center Building. Please
              come up the stairs to our entrance.
            </p>
          </motion.section>

          {/* Info + Map */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-12 items-stretch">
            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.2 }}
              variants={fadeUp}
            >
              <div className="space-y-6">
                <AccessRow
                  icon={<Train className="w-5 h-5 text-shibu-aka" />}
                  title="By Train"
                  body={<p className="text-foreground-soft leading-relaxed">{restaurantInfo.access}</p>}
                />
                <AccessRow
                  icon={<MapPin className="w-5 h-5 text-shibu-aka" />}
                  title="Address"
                  body={
                    <>
                      <p className="text-foreground-soft leading-relaxed">{restaurantInfo.address}</p>
                      <Link
                        href={siteConfig.links.map}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 mt-4 px-5 py-2.5 bg-shibu-aka text-washi text-sm tracking-widest uppercase rounded-sm hover:bg-shibu-aka-deep transition-colors shadow-[0_8px_20px_-8px_rgba(178,58,43,0.5)]"
                      >
                        Open in Google Maps
                      </Link>
                    </>
                  }
                />
                <AccessRow
                  icon={<Clock className="w-5 h-5 text-shibu-aka" />}
                  title="Hours"
                  body={
                    <>
                      <ul className="text-foreground-soft space-y-1">
                        {Object.entries(restaurantInfo.hours).map(([days, hours]) => (
                          <li key={days}>
                            <span className="font-medium text-foreground">{days}:</span>{' '}
                            {hours}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 text-muted text-sm">
                        Closed on {restaurantInfo.closed.join(' & ')}
                      </p>
                    </>
                  }
                />
                <AccessRow
                  icon={<Phone className="w-5 h-5 text-shibu-aka" />}
                  title="Phone"
                  body={
                    <a
                      href={`tel:${restaurantInfo.phone.replace(/[^+\d]/g, '')}`}
                      className="text-foreground-soft link-underline"
                    >
                      {restaurantInfo.phone}
                    </a>
                  }
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.8 }}
              className="relative h-[420px] md:h-full min-h-[420px] rounded-md overflow-hidden shadow-cinematic border border-kasshoku/10"
            >
              <iframe
                src={mapEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Mitsukabose location on Google Maps"
              />
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}

function AccessRow({
  icon,
  title,
  body,
}: {
  icon: React.ReactNode;
  title: string;
  body: React.ReactNode;
}) {
  return (
    <div className="bg-background-soft/50 backdrop-blur-sm rounded-md p-6 border border-kasshoku/10">
      <div className="flex items-start gap-4">
        <div className="flex-none pt-1">{icon}</div>
        <div className="flex-1 min-w-0">
          <h2 className="font-serif text-xl text-foreground mb-2">{title}</h2>
          {body}
        </div>
      </div>
    </div>
  );
}
