'use client';

import { useEffect } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

export interface ImageLightboxProps {
  src: string | null;
  alt?: string;
  onClose: () => void;
}

export function ImageLightbox({
  src,
  alt = 'Enlarged dish view',
  onClose,
}: ImageLightboxProps) {
  useEffect(() => {
    if (!src) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [src, onClose]);

  return (
    <AnimatePresence>
      {src && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={alt}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-kasshoku-deep/90 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.92 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.92 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="relative max-w-4xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={onClose}
              aria-label="Close enlarged image"
              className="absolute -top-12 right-0 p-2 text-washi hover:text-kohaku-soft transition-colors"
            >
              <X size={32} />
            </button>
            <div className="relative aspect-[4/3] w-full">
              <Image
                src={src}
                alt={alt}
                fill
                className="object-contain rounded-md"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
