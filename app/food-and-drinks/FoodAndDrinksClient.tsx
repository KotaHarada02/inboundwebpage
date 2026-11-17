'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import { getFoodDrinks } from '@/domain/services/dataService';
import type { FoodDrinkItem } from '@/domain/types';
import {
  Beer,
  JapaneseYenIcon as Sake,
  UtensilsCrossed,
  ChevronDown,
  X,
} from 'lucide-react';
import Link from 'next/link';

const fadeIn = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] as const } },
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

type SectionKey = 'minoh' | 'orize' | 'sake' | 'food';
type TabKey = SectionKey | 'all';

export default function FoodAndDrinksClient() {
  const items: FoodDrinkItem[] = getFoodDrinks();
  const ORIZE_IDS = new Set([
    'orize-malt-pale-ale',
    'japanese-white-no9-barrel',
    'black-head-ipa',
    'parallel-ipa',
    'oryzae-golden-ale',
  ]);
  const isOrize = (item: FoodDrinkItem) => ORIZE_IDS.has(item.id);

  const orizeBeers = items.filter((item) => item.category === 'beer' && isOrize(item));
  const minohBeers = items.filter((item) => item.category === 'beer' && !isOrize(item));
  const sakes = items.filter((item) => item.category === 'sake');
  const foods = items.filter((item) => item.category === 'ramen');

  const [activeTab, setActiveTab] = useState<TabKey>('all');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const heroRef = useRef<HTMLDivElement>(null);
  const orizeRef = useRef<HTMLDivElement>(null);
  const minohRef = useRef<HTMLDivElement>(null);
  const sakeRef = useRef<HTMLDivElement>(null);
  const foodRef = useRef<HTMLDivElement>(null);

  const isOrizeInView = useInView(orizeRef, { once: false, amount: 0.3 });
  const isMinohInView = useInView(minohRef, { once: false, amount: 0.3 });
  const isSakeInView = useInView(sakeRef, { once: false, amount: 0.3 });

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + 200;
      const sections = [
        { ref: minohRef, tab: 'minoh' as const },
        { ref: orizeRef, tab: 'orize' as const },
        { ref: sakeRef, tab: 'sake' as const },
        { ref: foodRef, tab: 'food' as const },
      ];

      for (let i = sections.length - 1; i >= 0; i--) {
        const s = sections[i];
        if (s.ref.current && s.ref.current.offsetTop <= scrollPosition) {
          setActiveTab(s.tab);
          return;
        }
      }
      if (scrollPosition < (orizeRef.current?.offsetTop || 0) - 100) {
        setActiveTab('all');
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (section: SectionKey) => {
    const refs = { minoh: minohRef, sake: sakeRef, food: foodRef, orize: orizeRef };
    if (refs[section].current) {
      const headerHeight = 132;
      const element = refs[section].current;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerHeight;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
      setActiveTab(section);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Image Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-kasshoku-deep/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImage(null)}
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.95 }}
              className="relative max-w-4xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-12 right-0 text-washi hover:text-kohaku transition-colors"
                aria-label="Close image"
              >
                <X size={32} />
              </button>
              <div className="relative aspect-[4/3] w-full">
                <Image
                  src={selectedImage || '/placeholder.svg'}
                  alt="Enlarged view"
                  fill
                  className="object-contain rounded-md"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section
        ref={heroRef}
        aria-label="Food & drinks hero"
        className="relative isolate bg-[url('/images/food-and-drinks/japanese-pattern-dark.jpg')] bg-cover bg-center"
      >
        <div className="absolute inset-0 bg-gradient-to-b from-[rgba(31,26,20,0.85)] via-[rgba(31,26,20,0.6)] to-[rgba(31,26,20,0.85)]" />
        <div className="relative z-10 min-h-[90vh] flex flex-col justify-center items-center px-4 py-24">
          <motion.div
            initial={{ opacity: 0, y: -24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <div className="mb-6 inline-flex items-center">
              <div className="h-px w-12 bg-kohaku-soft" />
              <span className="mx-4 text-kohaku-soft font-light uppercase tracking-[0.4em] text-xs">
                Authentic Experience
              </span>
              <div className="h-px w-12 bg-kohaku-soft" />
            </div>

            <h1 className="font-serif text-5xl md:text-7xl font-light mb-6 text-washi tracking-wide">
              <span className="block">Taste of</span>
              <span className="text-kohaku italic">Japan</span>
            </h1>

            <p className="text-lg text-washi/80 max-w-2xl mx-auto mb-12 font-light leading-relaxed">
              Discover our curated selection of Japanese craft beer, premium sake, and miso
              ramen — born from the fermentation culture of Osaka.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Link
                href="/menu"
                className="px-8 py-4 bg-shibu-aka text-washi tracking-widest uppercase text-sm font-light hover:bg-shibu-aka-deep transition-all rounded-sm shadow-[0_10px_25px_-10px_rgba(178,58,43,0.6)] hover:-translate-y-0.5 inline-block"
              >
                View Full Menu
              </Link>
              <button
                onClick={() => scrollToSection('minoh')}
                className="px-8 py-4 bg-transparent border border-washi/60 text-washi tracking-widest uppercase text-sm font-light hover:bg-washi/10 transition-all rounded-sm hover:-translate-y-0.5"
              >
                Explore Selections
              </button>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 1 }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2"
          >
            <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>
              <ChevronDown className="text-kohaku-soft" size={36} aria-hidden="true" />
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Navigation */}
      <nav
        aria-label="Section navigation"
        className="sticky top-16 md:top-20 z-30 bg-kasshoku-deep/90 backdrop-blur-md shadow-md border-b border-washi/5"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center px-4 py-3 gap-3 md:gap-0">
            <div className="text-washi font-serif text-lg tracking-wider hidden md:block">
              Our Selections
            </div>
            <div className="flex gap-1 overflow-x-auto no-scrollbar">
              <NavBtn active={activeTab === 'all'} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Overview
              </NavBtn>
              <NavBtn active={activeTab === 'minoh'} onClick={() => scrollToSection('minoh')} icon={<Beer size={16} />}>
                Minoh
              </NavBtn>
              <NavBtn active={activeTab === 'orize'} onClick={() => scrollToSection('orize')} icon={<Beer size={16} />}>
                Orizé
              </NavBtn>
              <NavBtn active={activeTab === 'sake'} onClick={() => scrollToSection('sake')} icon={<Sake size={16} />}>
                Akishika
              </NavBtn>
              <NavBtn active={activeTab === 'food'} onClick={() => scrollToSection('food')} icon={<UtensilsCrossed size={16} />}>
                Food
              </NavBtn>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-6xl mx-auto px-4 py-20">
        {/* Introduction */}
        <motion.section
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={staggerContainer}
          className="mb-24 text-center"
        >
          <motion.div variants={fadeIn} className="mb-14">
            <p className="text-xs tracking-[0.5em] text-kohaku uppercase mb-3">
              Authentic Japan
            </p>
            <h2 className="font-serif text-4xl md:text-5xl font-light mb-6 text-foreground tracking-wide">
              A Curated Experience
            </h2>
            <p className="text-lg text-foreground-soft max-w-3xl mx-auto leading-relaxed font-light">
              Each item in our collection represents the pinnacle of Japanese craftsmanship
              and tradition — slow brews, lively fermentation, and dishes that honor the
              terroir of Osaka.
            </p>
          </motion.div>

          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            <CategoryCard icon={<Beer size={28} className="text-washi" />} title="Craft Beer">
              Award-winning brews from Minoh and koji-fermented beers from Orizé.
            </CategoryCard>
            <CategoryCard icon={<Sake size={28} className="text-washi" />} title="Premium Sake">
              Akishika&apos;s organic sake, brewed in Nose Town from naturally grown rice.
            </CategoryCard>
            <CategoryCard
              icon={<UtensilsCrossed size={28} className="text-washi" />}
              title="Miso Ramen"
            >
              Slow-brewed white-miso ramen and seasonal fermented small plates.
            </CategoryCard>
          </motion.div>
        </motion.section>

        {/* Sections */}
        <FeatureSection
          sectionRef={minohRef}
          id="minoh"
          inView={isMinohInView}
          icon={<Beer size={22} className="text-shibu-aka" />}
          title="Minoh Beer"
          intro="Established in 1997 in Osaka Prefecture, Minoh Beer is a family-owned craft brewery internationally recognized for its quality. Led by the Ohshita sisters, every bottle balances character and depth."
          items={minohBeers}
          onImageClick={setSelectedImage}
        />

        <FeatureSection
          sectionRef={orizeRef}
          id="orize"
          inView={isOrizeInView}
          icon={<Beer size={22} className="text-shibu-aka" />}
          title="Orizé Brewing"
          intro="Founded in 2019 in Wakayama, Orizé is a pioneering nano-brewery — the world's first to brew beer with rice koji. Gluten-free, fermentation-driven, and rooted in domestic ingredients."
          items={orizeBeers}
          onImageClick={setSelectedImage}
        />

        <FeatureSection
          sectionRef={sakeRef}
          id="sake"
          inView={isSakeInView}
          icon={<Sake size={22} className="text-shibu-aka" />}
          title="Akishika Sake"
          intro="In the mountains of Nose Town, Akishika has crafted sake since 1886. Master brewer Hiroaki Oku grows his own rice using natural farming — pure expressions of terroir, bottle by bottle."
          items={sakes}
          onImageClick={setSelectedImage}
        />

        <section ref={foodRef} id="food" className="scroll-mt-40 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8 }}
            className="mb-12"
          >
            <div className="flex items-center gap-4 mb-4">
              <UtensilsCrossed size={22} className="text-shibu-aka" />
              <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
                Mitsukabose Food
              </h2>
              <div className="h-px flex-grow bg-kasshoku/20" />
            </div>
            <p className="text-foreground-soft max-w-3xl leading-relaxed font-light">
              Authentic Japanese cuisine focused on miso ramen and seasonal small plates,
              prepared with locally sourced ingredients and time-honored techniques.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {foods.map((food, index) => (
              <motion.article
                key={`${food.name}-${index}`}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.6, delay: (index % 6) * 0.05, ease: [0.22, 1, 0.36, 1] }}
                className="group"
              >
                <div className="bg-background-soft/60 rounded-md overflow-hidden h-full flex flex-col border border-kasshoku/10 shadow-cinematic transition-transform duration-500 group-hover:-translate-y-1">
                  <div className="relative h-64 overflow-hidden">
                    <Image
                      src={food.imageUrl || '/placeholder.svg'}
                      alt={food.name}
                      fill
                      className="object-cover cursor-pointer group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onClick={() => setSelectedImage(food.imageUrl)}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-kasshoku-deep/80 via-kasshoku-deep/20 to-transparent flex items-end">
                      <div className="p-6">
                        <span className="inline-block px-3 py-1 bg-shibu-aka text-washi rounded-sm text-[10px] tracking-[0.3em] uppercase mb-2">
                          Ramen
                        </span>
                        <h3 className="font-serif text-2xl font-light text-washi">
                          {food.name}
                        </h3>
                      </div>
                    </div>
                  </div>
                  <div className="p-6 flex-grow">
                    <p className="text-foreground-soft leading-relaxed text-sm">
                      {food.description}
                    </p>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        </section>

        {/* CTA */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, amount: 0.3 }}
          className="mt-24 text-center"
        >
          <div className="bg-kasshoku-deep text-washi rounded-md p-12 md:p-16 shadow-cinematic">
            <p className="text-xs tracking-[0.5em] text-kohaku uppercase mb-3">Come taste</p>
            <h2 className="font-serif text-3xl md:text-4xl font-light mb-6 tracking-wide">
              Ready to Experience Japan?
            </h2>
            <p className="text-lg text-washi/80 max-w-2xl mx-auto mb-10 font-light leading-relaxed">
              Visit us in Hotarugaike for a carefully curated selection of craft beer,
              premium sake, and miso ramen.
            </p>
            <Link
              href="/menu"
              className="px-8 py-4 bg-shibu-aka text-washi tracking-widest uppercase text-sm font-light hover:bg-shibu-aka-deep transition-colors rounded-sm shadow-[0_10px_25px_-10px_rgba(178,58,43,0.6)] hover:-translate-y-0.5 inline-block"
            >
              View Full Menu
            </Link>
          </div>
        </motion.section>
      </main>
    </div>
  );
}

function NavBtn({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean;
  onClick: () => void;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-sm transition-colors flex items-center gap-2 whitespace-nowrap text-sm tracking-wider ${
        active
          ? 'bg-shibu-aka text-washi'
          : 'text-washi/80 hover:bg-washi/5 hover:text-washi'
      }`}
    >
      {icon}
      {children}
    </button>
  );
}

function CategoryCard({
  icon,
  title,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.article
      variants={fadeIn}
      className="bg-background-soft/60 backdrop-blur-sm p-8 rounded-md border border-kasshoku/10 shadow-cinematic"
    >
      <div className="w-14 h-14 bg-shibu-aka rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_8px_20px_-8px_rgba(178,58,43,0.6)]">
        {icon}
      </div>
      <h3 className="font-serif text-xl font-light text-foreground mb-3">{title}</h3>
      <p className="text-foreground-soft text-sm leading-relaxed">{children}</p>
    </motion.article>
  );
}

function FeatureSection({
  sectionRef,
  id,
  inView,
  icon,
  title,
  intro,
  items,
  onImageClick,
}: {
  sectionRef: React.RefObject<HTMLDivElement | null>;
  id: string;
  inView: boolean;
  icon: React.ReactNode;
  title: string;
  intro: string;
  items: FoodDrinkItem[];
  onImageClick: (url: string) => void;
}) {
  return (
    <section ref={sectionRef} id={id} className="mb-24 scroll-mt-40">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 }}
        transition={{ duration: 0.8 }}
        className="mb-12"
      >
        <div className="flex items-center gap-4 mb-4">
          {icon}
          <h2 className="font-serif text-3xl md:text-4xl font-light text-foreground">
            {title}
          </h2>
          <div className="h-px flex-grow bg-kasshoku/20" />
        </div>
        <p className="text-foreground-soft max-w-3xl leading-relaxed font-light">{intro}</p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {items.map((item) => (
          <motion.article key={item.id} variants={fadeIn} className="group">
            <div className="bg-background-soft/60 rounded-md overflow-hidden h-full flex flex-col border border-kasshoku/10 shadow-cinematic transition-transform duration-500 group-hover:-translate-y-1">
              <div className="relative h-56 overflow-hidden bg-background-soft">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover cursor-pointer group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 50vw"
                  onClick={() => onImageClick(item.imageUrl)}
                />
              </div>
              <div className="p-6 flex flex-col gap-3">
                <span className="inline-block self-start px-2.5 py-1 bg-background text-shibu-aka rounded-sm text-[10px] tracking-[0.3em] uppercase border border-shibu-aka/30">
                  {item.category === 'sake' ? 'Sake' : item.category === 'beer' ? 'Beer' : 'Ramen'}
                </span>
                <h3 className="font-serif text-xl font-light text-foreground">{item.name}</h3>
                <p className="text-foreground-soft text-sm leading-relaxed line-clamp-4">
                  {item.description}
                </p>
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
