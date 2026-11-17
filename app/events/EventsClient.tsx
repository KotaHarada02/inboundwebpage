'use client';

import { motion } from 'framer-motion';
import { Gift, MapPin, Star, Users } from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const },
  },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
};

export default function EventsClient() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section
        aria-label="Events hero"
        className="relative isolate bg-[url('/images/food-and-drinks/japanese-pattern-dark.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,26,20,0.85)] via-[rgba(31,26,20,0.65)] to-[rgba(31,26,20,0.85)]" />
        <div className="relative z-10 min-h-[60vh] flex flex-col justify-center items-center px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-6 inline-flex items-center">
              <div className="h-px w-12 bg-kohaku-soft" />
              <span className="mx-4 text-kohaku-soft font-light uppercase tracking-[0.4em] text-xs">
                Special Events
              </span>
              <div className="h-px w-12 bg-kohaku-soft" />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 text-washi tracking-wide">
              <span className="block">Join Our</span>
              <span className="text-kohaku italic">Community</span>
            </h1>

            <p className="text-lg text-washi/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Be part of our growing community and enjoy special rewards for your support.
            </p>
          </motion.div>
        </div>
      </section>

      <main className="max-w-6xl mx-auto px-4 py-20">
        {/* Intro */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
          className="mb-20 text-center"
        >
          <motion.div variants={fadeIn} className="mb-8">
            <p className="text-xs tracking-[0.5em] text-kohaku uppercase mb-3">Thank you</p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6 text-foreground tracking-wide">
              Special Thank You Events
            </h2>
            <p className="text-lg text-foreground-soft max-w-3xl mx-auto leading-relaxed font-light">
              We appreciate every customer who visits and takes the time to share their
              experience. As a token of our gratitude, we offer two special rewards for your
              support.
            </p>
          </motion.div>
        </motion.section>

        {/* Events Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-24"
        >
          {/* Website Visit Event */}
          <motion.article variants={fadeIn} className="group">
            <div className="bg-background-soft/60 backdrop-blur-sm rounded-md overflow-hidden h-full border border-kasshoku/10 shadow-cinematic transition-transform duration-500 group-hover:-translate-y-1">
              <div className="h-1 bg-gradient-to-r from-kohaku via-shibu-aka to-kasshoku" />
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-shibu-aka rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(178,58,43,0.6)]">
                    <Gift size={28} className="text-washi" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-foreground">
                      Website Visit Reward
                    </h3>
                    <p className="text-kohaku text-sm tracking-widest uppercase">
                      Free Sticker
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-foreground-soft leading-relaxed">
                  <p>
                    Thank you for visiting our website! We&apos;re excited to share our story
                    and menu with you.
                  </p>
                  <p>
                    Simply mention that you visited our website when you come in, and we&apos;ll
                    give you a special{' '}
                    <span className="text-shibu-aka font-medium">Mitsukabōzu sticker</span> as
                    a thank-you gift.
                  </p>
                </div>

                <div className="bg-background rounded-sm p-6 border border-kasshoku/10">
                  <h4 className="font-serif text-foreground mb-3 flex items-center gap-2">
                    <Users size={18} className="text-shibu-aka" />
                    How to Get Your Sticker
                  </h4>
                  <ul className="space-y-2 text-foreground-soft text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      Visit our restaurant in person
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      Tell our staff &quot;I visited your website&quot;
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      Receive your free Mitsukabōzu sticker
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>

          {/* Google Review Event */}
          <motion.article variants={fadeIn} className="group">
            <div className="bg-background-soft/60 backdrop-blur-sm rounded-md overflow-hidden h-full border border-kasshoku/10 shadow-cinematic transition-transform duration-500 group-hover:-translate-y-1">
              <div className="h-1 bg-gradient-to-r from-kasshoku via-shibu-aka to-kohaku" />
              <div className="p-8 lg:p-10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-kasshoku rounded-full flex items-center justify-center shadow-[0_8px_20px_-8px_rgba(91,58,41,0.6)]">
                    <Star size={28} className="text-kohaku-soft" />
                  </div>
                  <div>
                    <h3 className="font-serif text-2xl font-light text-foreground">
                      Google Review Reward
                    </h3>
                    <p className="text-kohaku text-sm tracking-widest uppercase">
                      Premium Miso
                    </p>
                  </div>
                </div>

                <div className="space-y-3 mb-8 text-foreground-soft leading-relaxed">
                  <p>
                    Your feedback helps us improve and helps other customers discover our
                    authentic miso ramen experience.
                  </p>
                  <p>
                    Leave a review on Google Maps and show it to our staff to receive a special{' '}
                    <span className="text-shibu-aka font-medium">premium miso sample</span> as
                    our thank-you.
                  </p>
                </div>

                <div className="bg-background rounded-sm p-6 border border-kasshoku/10">
                  <h4 className="font-serif text-foreground mb-3 flex items-center gap-2">
                    <MapPin size={18} className="text-shibu-aka" />
                    How to Get Your Miso
                  </h4>
                  <ul className="space-y-2 text-foreground-soft text-sm">
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      <Link
                        href="https://maps.app.goo.gl/HWZm8vedVNUbZzjt5"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link-underline text-ai hover:text-shibu-aka transition-colors"
                      >
                        Write a review on Google Maps
                      </Link>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      Show your review to our staff
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-shibu-aka mt-1">·</span>
                      Receive your premium miso sample
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </motion.article>
        </motion.div>

        {/* Terms */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="bg-background-soft/60 backdrop-blur-sm rounded-md p-10 lg:p-12 border border-kasshoku/10"
        >
          <h3 className="font-serif text-2xl text-foreground mb-6 text-center">
            Terms &amp; Conditions
          </h3>
          <div className="max-w-3xl mx-auto space-y-3 text-foreground-soft text-sm leading-relaxed">
            <p>· One reward per customer per visit. Rewards are subject to availability.</p>
            <p>· Google reviews must be genuine and posted from your personal account.</p>
            <p>· These promotions are valid for dine-in customers only.</p>
            <p>
              · Mitsukabōzu reserves the right to modify or discontinue these promotions at
              any time.
            </p>
          </div>
        </motion.section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-24 text-center"
        >
          <div className="bg-kasshoku-deep text-washi rounded-md p-12 md:p-16 shadow-cinematic">
            <p className="text-xs tracking-[0.5em] text-kohaku uppercase mb-3">
              Ready to visit?
            </p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-6 tracking-wide">
              Join Our Community
            </h2>
            <p className="text-lg text-washi/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Visit us today and be part of our growing community. We can&apos;t wait to share
              our authentic miso ramen experience with you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/menu"
                className="px-8 py-4 bg-shibu-aka text-washi tracking-widest uppercase text-sm font-light hover:bg-shibu-aka-deep transition-colors rounded-sm shadow-[0_10px_25px_-10px_rgba(178,58,43,0.6)] hover:-translate-y-0.5 inline-block"
              >
                View Our Menu
              </Link>
              <Link
                href="/access"
                className="px-8 py-4 bg-transparent border border-washi/60 text-washi tracking-widest uppercase text-sm font-light hover:bg-washi/10 transition-colors rounded-sm hover:-translate-y-0.5 inline-block"
              >
                Find Us
              </Link>
            </div>
          </div>
        </motion.section>
      </main>
    </div>
  );
}
