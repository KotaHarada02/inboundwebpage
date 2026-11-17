import { siteConfig } from '@/lib/siteConfig';

export function RestaurantJsonLd() {
  const restaurant = {
    '@context': 'https://schema.org',
    '@type': ['Restaurant', 'LocalBusiness'],
    '@id': `${siteConfig.url}/#restaurant`,
    name: siteConfig.name,
    alternateName: ['みつか坊主', 'Mitsukabōzu', 'Mitsuka Bose'],
    url: siteConfig.url,
    description: siteConfig.description,
    image: [
      `${siteConfig.url}/images/hero/hero-1.jpg`,
      `${siteConfig.url}/images/hero/hero-2.jpg`,
    ],
    logo: {
      '@type': 'ImageObject',
      url: `${siteConfig.url}/images/logo.png`,
      width: 200,
      height: 200,
    },
    telephone: siteConfig.telephone,
    priceRange: '¥¥',
    servesCuisine: ['Ramen', 'Miso Ramen', 'Japanese', 'Fermentation Cuisine'],
    acceptsReservations: false,
    publicAccess: true,
    smokingAllowed: false,
    inLanguage: ['en', 'ja'],
    address: {
      '@type': 'PostalAddress',
      streetAddress: 'Airport Center Building 2F, 1-6-5 Hotarugaike Higashimachi',
      addressLocality: 'Toyonaka',
      addressRegion: 'Osaka',
      postalCode: '560-0032',
      addressCountry: 'JP',
    },
    areaServed: [
      { '@type': 'City', name: 'Toyonaka' },
      { '@type': 'City', name: 'Ikeda' },
      { '@type': 'City', name: 'Suita' },
      { '@type': 'City', name: 'Osaka' },
    ],
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 34.79518,
      longitude: 135.44955,
    },
    hasMap: 'https://maps.app.goo.gl/HWZm8vedVNUbZzjt5',
    openingHoursSpecification: [
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Wednesday', 'Thursday', 'Friday', 'Saturday'],
        opens: '11:30',
        closes: '24:00',
      },
      {
        '@type': 'OpeningHoursSpecification',
        dayOfWeek: ['Sunday'],
        opens: '11:30',
        closes: '22:00',
      },
    ],
    sameAs: [
      'https://www.instagram.com/mitsukabose.official/',
      'https://x.com/mitsukabose',
      'https://maps.app.goo.gl/HWZm8vedVNUbZzjt5',
    ],
    hasMenu: `${siteConfig.url}/menu`,
    paymentAccepted: 'Cash, Credit Card, IC Card, QR Code',
    currenciesAccepted: 'JPY',
    knowsLanguage: ['en', 'ja'],
  };

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteConfig.url}/#website`,
    url: siteConfig.url,
    name: siteConfig.name,
    description: siteConfig.description,
    inLanguage: ['en', 'ja'],
    publisher: { '@id': `${siteConfig.url}/#restaurant` },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(restaurant) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(website) }}
      />
    </>
  );
}
