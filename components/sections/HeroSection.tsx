'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { motion, AnimatePresence } from 'framer-motion'
import { Parallax } from 'react-scroll-parallax'
import Link from 'next/link'

interface HeroSectionProps {
  images: string[]
}

export default function HeroSection({ images }: HeroSectionProps) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((i) => (i + 1) % images.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [images.length])

  return (
    <section
      aria-label="Mitsukabose hero"
      className="relative w-full h-[94vh] overflow-hidden"
    >
      {/* Background slideshow with parallax + crossfade */}
      <Parallax speed={-20} className="absolute inset-0 z-0">
        <AnimatePresence initial={false}>
          {images.map((src, i) =>
            i === index ? (
              <motion.div
                key={src}
                className="absolute inset-0"
                initial={{ opacity: 0, scale: 1.08 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
              >
                <Image
                  src={src}
                  alt={`Hero background ${i + 1}`}
                  fill
                  className="object-cover"
                  priority={i === 0}
                />
                {/* Multi-layer gradient for depth */}
                <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,26,20,0.6)] via-[rgba(31,26,20,0.2)] to-[rgba(31,26,20,0.75)]" />
                <div className="absolute inset-0 bg-gradient-to-r from-[rgba(31,26,20,0.3)] via-transparent to-[rgba(31,26,20,0.3)]" />
              </motion.div>
            ) : null
          )}
        </AnimatePresence>
      </Parallax>

      {/* Floating kanji decoration */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden" aria-hidden="true">
        <motion.span
          className="absolute top-[12%] right-[8%] font-serif text-[12rem] md:text-[18rem] text-washi/[0.04] leading-none select-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 0.8 }}
        >
          醸
        </motion.span>
        <motion.span
          className="absolute bottom-[15%] left-[5%] font-serif text-[8rem] md:text-[12rem] text-washi/[0.03] leading-none select-none"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, delay: 1.2 }}
        >
          味
        </motion.span>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4 md:px-8 pb-24 md:pb-20">
        {/* Location badge */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mb-8"
        >
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-washi/20 bg-washi/[0.06] backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-kohaku-soft animate-subtle-pulse" />
            <span className="text-[10px] md:text-xs tracking-[0.4em] text-kohaku-soft uppercase font-light">
              Hotarugaike · Toyonaka · Osaka
            </span>
          </span>
        </motion.div>

        {/* Title block */}
        <motion.div
          initial={{ scale: 0.92, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="mb-6"
        >
          <h1 className="font-serif text-5xl md:text-7xl lg:text-[5.5rem] font-light text-washi mb-4 tracking-wide text-balance leading-[1.1]">
            <span className="block">Mitsuka Bose</span>
            <motion.span
              className="block text-2xl md:text-3xl text-kohaku-soft mt-3 tracking-[0.35em] font-light"
              initial={{ opacity: 0, letterSpacing: '0.6em' }}
              animate={{ opacity: 1, letterSpacing: '0.35em' }}
              transition={{ duration: 1.2, delay: 0.5 }}
            >
              みつか坊主
            </motion.span>
          </h1>
        </motion.div>

        {/* Tagline with elegant dividers */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.8 }}
          className="flex items-center gap-4 mb-10"
        >
          <div className="w-12 h-px bg-gradient-to-r from-transparent to-kohaku-soft/60" />
          <p className="font-serif text-lg md:text-xl text-washi/80 font-light italic tracking-wide">
            Fermented Miso Ramen &amp; Craft Beer
          </p>
          <div className="w-12 h-px bg-gradient-to-l from-transparent to-kohaku-soft/60" />
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 16, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.7 }}
          className="text-base md:text-lg text-washi/70 mb-10 max-w-xl font-light leading-relaxed"
        >
          Savor the authentic depth of miso in Hotarugaike, Osaka.
          <span className="block mt-1 text-washi/50">
            Where tradition and innovation intertwine in every bowl.
          </span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="flex flex-col sm:flex-row gap-4 justify-center"
        >
          <Link href="/menu" aria-label="View full menu">
            <button className="group relative bg-shibu-aka hover:bg-shibu-aka-deep text-washi px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-sm font-light transition-all duration-400 min-w-[200px] glow-shibu-aka hover:-translate-y-0.5 overflow-hidden">
              <span className="relative z-10">View Menu</span>
              <div className="absolute inset-0 bg-gradient-to-r from-shibu-aka-deep/0 via-washi/10 to-shibu-aka-deep/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-700" />
            </button>
          </Link>
          <Link href="/access" aria-label="Restaurant access">
            <button className="bg-transparent hover:bg-washi/8 text-washi border border-washi/30 hover:border-washi/60 px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-sm font-light transition-all duration-300 min-w-[200px] hover:-translate-y-0.5 backdrop-blur-sm">
              Access
            </button>
          </Link>
          <Link href="/events" aria-label="Special events">
            <button className="bg-transparent hover:bg-washi/8 text-washi border border-washi/30 hover:border-washi/60 px-10 py-4 text-sm tracking-[0.2em] uppercase rounded-sm font-light transition-all duration-300 min-w-[200px] hover:-translate-y-0.5 backdrop-blur-sm">
              Events
            </button>
          </Link>
        </motion.div>
      </div>

      {/* Slideshow indicators */}
      <div className="absolute bottom-20 sm:bottom-24 left-1/2 -translate-x-1/2 z-10 flex gap-2" aria-hidden="true">
        {images.map((_, i) => (
          <button
            key={i}
            onClick={() => setIndex(i)}
            className={`transition-all duration-500 rounded-full ${
              i === index
                ? 'w-8 h-1 bg-kohaku-soft'
                : 'w-1 h-1 bg-washi/30 hover:bg-washi/50'
            }`}
            aria-label={`Go to slide ${i + 1}`}
          />
        ))}
      </div>

      {/* Scroll-down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="hidden sm:flex absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex-col items-center text-washi/50 pointer-events-none"
        aria-hidden="true"
      >
        <p className="text-[9px] tracking-[0.5em] uppercase mb-3 font-light">Scroll</p>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
          className="w-px h-8 bg-gradient-to-b from-washi/40 to-transparent"
        />
      </motion.div>

      {/* Bottom fade into page */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent z-[5] pointer-events-none" />
    </section>
  )
}
