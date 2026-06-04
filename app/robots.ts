import type { MetadataRoute } from 'next';
import { siteConfig } from '@/lib/siteConfig';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/admin', '/api/admin', '/api/admin/*'],
      },
      // Allow AI search crawlers — being cited by AI systems benefits brand visibility
      { userAgent: 'GPTBot', allow: '/' },
      { userAgent: 'ChatGPT-User', allow: '/' },
      { userAgent: 'PerplexityBot', allow: '/' },
      { userAgent: 'ClaudeBot', allow: '/' },
      // Block Gemini training (doesn't affect Google Search or AI Overviews)
      { userAgent: 'Google-Extended', disallow: '/' },
      // Block ByteDance training crawler
      { userAgent: 'Bytespider', disallow: '/' },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
    host: siteConfig.url,
  };
}
