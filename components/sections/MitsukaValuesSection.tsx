"use client"

import { useRef } from "react"
import { motion, useScroll, useTransform, useInView } from "framer-motion"
import { GrapeIcon, Droplets, Wheat, Utensils, MapPin } from "lucide-react"

interface Value {
  number: string;
  title: string;
  icon: React.ReactNode;
  body: React.ReactNode;
}

const values = [
  {
    number: "①",
    title: "What Mitsukabose Values Most",
    icon: <Utensils className="w-8 h-8" />,
    body: (
      <>
        <p className="mb-4">
          We value &quot;cultivating people.&quot;
          <br />
          Mitsukabose is not just a restaurant that serves miso ramen, local sake, or craft beer.
          <br />
          As a &quot;theme park of fermentation, miso, and noodles,&quot; our mission is to be a place where everyone
          involved—diners, staff, producers, and the local community—can experience the essence of fermentation:
          transformation, deepening, and connection.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>A single bowl of ramen can reset someone&rsquo;s day,</li>
          <li>Spark laughter between strangers,</li>
          <li>Become a source of pride for the one who made it.</li>
        </ul>
        <p>We cherish these invisible values more than anything.</p>
      </>
    ),
  },
  {
    number: "②",
    title: "A Turning Point for Mitsukabose",
    icon: <Droplets className="w-8 h-8" />,
    body: (
      <>
        <p className="mb-4">
          In 2022, after over a decade of serving miso ramen in both Hotarugaike and Umeda, Mitsukabose made the
          decision to consolidate its operations back to its origin—Hotarugaike.
          <br />
          This move wasn&rsquo;t just a &quot;downsizing,&quot; but rather the beginning of a re-fermentation. Our goal
          was not only to be &quot;rooted in the community,&quot; but to become a presence that ferments with the
          community.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Use local ingredients,</li>
          <li>Share the heart and soul of the producers,</li>
          <li>
            Create a space where local residents, workers, and travelers can come together, blending into a living
            ecosystem where &quot;people and the community ferment together.&quot;
          </li>
        </ul>
        <p>
          Mitsukabose is not just a restaurant.
          <br />
          It&rsquo;s a micro-fermentation hub.
          <br />
          This marked a new chapter for Mitsukabose starting in 2022—and the true beginning of the vision we had when we
          first opened.
        </p>
      </>
    ),
  },
  {
    number: "③",
    title: "The Charm of Osaka (Hokusetsu)",
    icon: <MapPin className="w-8 h-8" />,
    body: (
      <>
        <p className="mb-4">
          &quot;A community where warmth and the culture of fermentation naturally take root.&quot;
          <br />
          In the northern part of Osaka, the Hokusetsu area strikes a perfect balance between city life and nature. From
          town, you can see the satoyama (rural foothills) woven into the landscape. With Itami Airport nearby, it
          offers easy domestic access, and it&rsquo;s home to national universities, Expo &#39;70 Park, and many locals
          who nurture their community and small, meaningful cultures.
        </p>
        <ul className="list-disc pl-5 mb-4 space-y-1">
          <li>Akishika Sake Brewery grows pesticide-free rice in the mountains of Nose.</li>
          <li>Minoh Beer brews craft beer at the foot of the Minoh mountains.</li>
          <li>In places like Suita and Minoh, people run local markets full of community love.</li>
        </ul>
        <p>
          This region provides fertile ground for enjoying both what remains unchanged and what evolves over time.
          <br />
          Mitsukabose has taken root in this very &quot;fermentation-friendly&quot; place, and together with our team,
          we continue to cultivate it every day.
        </p>
      </>
    ),
  },
]

export default function MitsukaValuesSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  })

  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"])

  return (
    <section ref={containerRef} className="py-24 relative overflow-hidden" id="values">
      {/* Japanese-inspired background */}
      <motion.div className="absolute inset-0 z-0" style={{ y: backgroundY }}>
        <div className="absolute inset-0 bg-gradient-to-b from-background via-background-soft/40 to-background" />
        <div className="absolute inset-0 opacity-5">
          <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <pattern id="seigaiha" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M0,10 a10,10 0 0,0 20,0 a10,10 0 0,0 -20,0 z" fill="none" stroke="#000" strokeWidth="0.5" />
              <path d="M0,10 a5,5 0 0,0 10,0 a5,5 0 0,0 -10,0 z" fill="none" stroke="#000" strokeWidth="0.5" />
              <path d="M10,10 a10,10 0 0,0 20,0 a10,10 0 0,0 -20,0 z" fill="none" stroke="#000" strokeWidth="0.5" />
              <path d="M10,10 a5,5 0 0,0 10,0 a5,5 0 0,0 -10,0 z" fill="none" stroke="#000" strokeWidth="0.5" />
            </pattern>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#seigaiha)" />
          </svg>
        </div>
      </motion.div>

      {/* Subtle decorative icons — 3 large, very low-opacity anchors */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none" aria-hidden="true">
        {[
          { Icon: GrapeIcon, x: '8%',  y: '15%', size: 160, rot: -15 },
          { Icon: Wheat,     x: '82%', y: '55%', size: 200, rot: 20 },
          { Icon: Droplets,  x: '50%', y: '80%', size: 140, rot: 0 },
        ].map(({ Icon, x, y, size, rot }, i) => (
          <motion.div
            key={i}
            className="absolute text-kasshoku/[0.04]"
            style={{ left: x, top: y, rotate: rot }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 2, delay: i * 0.4 }}
          >
            <Icon size={size} />
          </motion.div>
        ))}
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <ValuesSectionHeader />

        <div className="max-w-5xl mx-auto mt-20">
          {values.map((value, index) => (
            <ValueCard key={index} value={value} index={index} />
          ))}
        </div>
      </div>

      {/* Japanese-inspired decorative elements */}
      <div className="absolute bottom-0 left-0 w-full h-16 bg-kasshoku/5 z-0">
        <div className="absolute bottom-0 left-0 w-full">
          <svg viewBox="0 0 1200 30" preserveAspectRatio="none" className="w-full h-8">
            <path d="M0,0 Q300,30 600,0 T1200,0 V30 H0 Z" fill="#E0A85B" fillOpacity="0.25" />
            <path d="M0,5 Q300,35 600,5 T1200,5 V30 H0 Z" fill="#E0A85B" fillOpacity="0.18" />
          </svg>
        </div>
      </div>
    </section>
  )
}

function ValuesSectionHeader() {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.3 })

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.7 }}
      className="text-center relative"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.9, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.2 }}
        className="inline-block relative"
      >
        <div className="absolute -inset-1 bg-kohaku-soft/20 rounded-full blur-2xl"></div>
        <h2 className="font-serif text-4xl sm:text-6xl font-light mb-6 text-kasshoku-deep relative tracking-wide">
          <span className="relative inline-block">
            What Is{" "}
            <motion.span
              className="text-shibu-aka relative inline-block italic"
              animate={{
                y: [0, -5, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              Mitsukabose
              <motion.div
                className="absolute -bottom-1 left-0 w-full h-px bg-shibu-aka rounded-full"
                animate={{
                  scaleX: [0.7, 1, 0.7],
                  x: ["-15%", "0%", "-15%"],
                }}
                transition={{
                  duration: 3,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "easeInOut",
                }}
              />
            </motion.span>
            ?
          </span>
        </h2>
      </motion.div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={isInView ? { y: 0, opacity: 1 } : { y: 20, opacity: 0 }}
        transition={{ duration: 0.7, delay: 0.4 }}
        className="max-w-2xl mx-auto"
      >
        <p className="text-lg text-foreground-soft mb-8 font-light">
        Welcome to the world of fermentation through our values and story
        </p>

        <div className="flex items-center justify-center space-x-3">
          <div className="w-16 h-px bg-kasshoku/40 rounded-full"></div>
          <div className="w-2 h-2 bg-shibu-aka rounded-full"></div>
          <div className="w-16 h-px bg-kasshoku/40 rounded-full"></div>
        </div>
      </motion.div>
    </motion.div>
  )
}

function ValueCard({ value, index }: { value: Value; index: number }) {
  const cardRef = useRef(null)
  const isInView = useInView(cardRef, { once: false, amount: 0.3 })

  return (
    <motion.div
      ref={cardRef}
      initial={{ opacity: 0, y: 100 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 100 }}
      transition={{
        duration: 0.8,
        delay: index * 0.2,
        ease: "easeOut",
      }}
      className="mb-20 relative"
    >
      {/* Connecting line between cards */}
      {index < values.length - 1 && (
        <motion.div
          className="absolute left-1/2 bottom-0 w-px h-20 bg-gradient-to-b from-kasshoku/40 to-transparent"
          initial={{ scaleY: 0, opacity: 0 }}
          animate={isInView ? { scaleY: 1, opacity: 1 } : { scaleY: 0, opacity: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          style={{ translateX: "-50%", translateY: "100%" }}
        />
      )}

      <div className="relative">
        {/* Number badge — editorial typographic style */}
        <motion.div
          className="absolute -top-5 -left-4 z-10 md:-top-7 md:-left-7"
          initial={{ opacity: 0, x: -10 }}
          animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
          transition={{ duration: 0.6, delay: index * 0.15 + 0.2 }}
        >
          <div className="flex flex-col items-center leading-none">
            <span className="font-serif text-[2.8rem] md:text-[3.5rem] font-light text-shibu-aka/20 leading-none select-none tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
          </div>
        </motion.div>

        <motion.div
          className="bg-background border border-kasshoku/10 rounded-md shadow-cinematic overflow-hidden relative z-0"
          whileHover={{
            scale: 1.02,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.15)",
          }}
          transition={{ duration: 0.3 }}
        >
          {/* Top decorative pattern */}
          <div className="h-1 bg-gradient-to-r from-kohaku via-shibu-aka to-kasshoku"></div>

          <div className="p-8 md:p-10 pt-8 md:pt-10">
            <div className="ml-14 md:ml-16">
              <div className="flex items-center mb-6">
                <motion.div
                  className="mr-4 text-shibu-aka"
                  animate={{
                    rotate: [0, 10, 0, -10, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                    delay: index * 1.5,
                  }}
                >
                  {value.icon}
                </motion.div>
                <h3 className="font-serif text-2xl md:text-3xl font-light text-kasshoku-deep">{value.title}</h3>
              </div>

              <motion.div
                className="prose prose-lg max-w-none text-foreground-soft leading-relaxed"
                initial={{ opacity: 0.8 }}
                whileHover={{ opacity: 1 }}
              >
                {value.body}
              </motion.div>
            </div>
          </div>

          {/* Side decorative element */}
          <div className="absolute top-0 right-0 h-full w-1 bg-background-soft"></div>

          {/* Bottom decorative pattern */}
          <div className="h-px bg-kasshoku/10"></div>
        </motion.div>
      </div>
    </motion.div>
  )
}
